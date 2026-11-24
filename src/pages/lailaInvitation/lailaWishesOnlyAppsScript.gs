/**
 * Laila / Hazziq — GRANTED WISHLIST ONLY (separate Google Sheet from RSVP).
 *
 * Setup:
 * 1. Create a new spreadsheet (e.g. "Laila Wishes"). Tabs: wishes, granted
 * 2. Extensions → Apps Script → paste THIS file → Save
 * 3. Run authorizeWishlistDrive_ once → Allow
 * 4. Deploy → New web app → Execute as: Me → Anyone → copy URL
 * 5. Paste the /exec URL into DEFAULT_LAILA_WISHES_SCRIPT_URL in lailaInviteData.ts
 *
 * GET  ?action=wishlist&callback=fn
 * GET  ?action=wishlistAdmin&callback=fn
 * POST { action: "grant", wishId, name, note? }
 * POST { action: "wishUpsert", wish: {...}, imageBase64?, ... }
 * POST { action: "wishSetActive", id, active }
 */

function authorizeWishlistDrive_() {
  var folder = getWishImageFolder_();
  var test = folder.createFile(Utilities.newBlob("ok", "text/plain", "auth-check.txt"));
  test.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  SpreadsheetApp.getUi().alert("Drive OK", "Folder: " + folder.getName(), SpreadsheetApp.getUi().ButtonSet.OK);
}

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "";
    if (action === "wishlist") {
      return jsonp_(e, { ok: true, wishes: listWishes_() });
    }
    if (action === "wishlistAdmin") {
      return jsonp_(e, { ok: true, wishes: listWishesAdmin_() });
    }
    return jsonp_(e, { ok: true, service: "laila-wishes" });
  } catch (err) {
    return jsonp_(e, { ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var data = parseBody_(e);
    var action = String(data.action || "").trim();
    if (action === "grant") return handleWishPost_(data);
    if (action === "wishUpsert") return json_(wishUpsert_(data));
    if (action === "wishSetActive") return json_(wishSetActive_(data.id, data.active !== false));
    return json_({ ok: false, error: "Unknown action: " + action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function parseBody_(e) {
  var raw = (e && e.postData && e.postData.contents) || "{}";
  return JSON.parse(raw);
}

function jsonp_(e, obj) {
  var text = JSON.stringify(obj);
  var cb = e && e.parameter && e.parameter.callback;
  if (cb && /^[A-Za-z_][A-Za-z0-9_]*$/.test(cb)) {
    return ContentService.createTextOutput(cb + "(" + text + ")").setMimeType(
      ContentService.MimeType.JAVASCRIPT,
    );
  }
  return json_(obj);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function colIndex_(headers, names) {
  for (var i = 0; i < headers.length; i++) {
    var h = normHeader_(headers[i]);
    for (var n = 0; n < names.length; n++) {
      if (h === names[n]) return i;
    }
  }
  return -1;
}

function normHeader_(value) {
  return String(value || "")
    .replace(/"/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
function sheetByNames_(names) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var i = 0; i < names.length; i++) {
    var s = ss.getSheetByName(names[i]);
    if (s) return s;
  }
  return null;
}

function getWishesSheet_() {
  return sheetByNames_(["wishes", "Wishes"]);
}

function getGrantsSheet_(createIfMissing) {
  var sheet = sheetByNames_(["granted", "Grants"]);
  if (!sheet && createIfMissing) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    sheet = ss.insertSheet("granted");
    ensureGrantHeaders_(sheet);
  }
  return sheet;
}

function isWishesSheet_(sheet) {
  var name = sheet.getName().toLowerCase();
  return name === "wishes";
}

function handleWishPost_(data) {
  var wishId = String(data.wishId || "").trim();
  var name = String(data.name || "").trim();
  if (!wishId || !name) throw new Error("Missing wishId or name");
  appendGrant_(wishId, name, String(data.note || "").trim());
  return json_({ ok: true });
}

function listWishesAdmin_() {
  return listWishesFromSheet_(false);
}

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu("Theocode")
      .addItem("1. Setup wishes header row", "setupWishesHeaderRow")
      .addItem("2. Fill wish link previews", "fillAllWishPreviews")
      .addToUi();
  } catch (err) {
    /* google sheets UI only */
  }
}

/** Run once from the editor if onEdit never asked for permissions. */
function fillAllWishPreviews() {
  var sheet = getWishesSheet_();
  if (!sheet) throw new Error('Missing "wishes" tab.');
  setupWishesHeaderRow();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 10)).getValues()[0];
  for (var row = 2; row <= lastRow; row++) {
    var url = getWishLinkFromRow_(sheet, row, headers);
    if (url) fillWishPreviewForRow_(sheet, row, headers, url);
  }
  SpreadsheetApp.getActiveSpreadsheet().toast("Wish link previews updated.");
}

function setupWishesHeaderRow() {
  var sheet = getWishesSheet_();
  if (!sheet) throw new Error('Missing "wishes" tab.');
  if (sheet.getLastRow() === 0) {
    ensureWishHeaders_(sheet);
    return;
  }
  var first = normHeader_(sheet.getRange(1, 1).getValue());
  if (first === "id") return;
  sheet.insertRowBefore(1);
  sheet
    .getRange(1, 1, 1, 10)
    .setValues([["ID", "Title", "Description", "Category", "Price Hint", "Link", "Image", "Qty", "Sort", "Active"]]);
  sheet.getRange(1, 1, 1, 10).setFontWeight("bold");
}

function onEdit(e) {
  try {
    handleWishLinkEdit_(e);
  } catch (err) {
    /* couple edit should not block */
  }
}

function wishColumnNumbers_(headers) {
  var idx = wishColumnIndex_(headers);
  return {
    id: idx.id >= 0 ? idx.id + 1 : 1,
    title: idx.title >= 0 ? idx.title + 1 : 2,
    description: idx.description >= 0 ? idx.description + 1 : 3,
    category: idx.category >= 0 ? idx.category + 1 : 4,
    price: idx.price >= 0 ? idx.price + 1 : 5,
    link: idx.link >= 0 ? idx.link + 1 : 6,
    image: idx.image >= 0 ? idx.image + 1 : 7,
    qty: idx.qty >= 0 ? idx.qty + 1 : 8,
    sort: idx.sort >= 0 ? idx.sort + 1 : 9,
    active: idx.active >= 0 ? idx.active + 1 : 10,
  };
}

function rowCell_(row, colNum) {
  if (colNum < 1 || colNum > row.length) return "";
  return row[colNum - 1];
}

function findHttpsInRow_(row) {
  for (var i = 0; i < row.length; i++) {
    var cell = String(row[i] || "").trim();
    if (/^https?:\/\//i.test(cell)) return cell;
  }
  return "";
}

function getWishLinkFromRow_(sheet, rowNum, headers) {
  var c = wishColumnNumbers_(headers);
  var link = String(sheet.getRange(rowNum, c.link).getValue() || "").trim();
  if (/^https?:\/\//i.test(link)) return link;
  var lastCol = Math.max(sheet.getLastColumn(), 10);
  var row = sheet.getRange(rowNum, 1, 1, lastCol).getValues()[0];
  for (var i = 0; i < row.length; i++) {
    var cell = String(row[i] || "").trim();
    if (/^https?:\/\//i.test(cell)) return cell;
  }
  return "";
}

function fillWishPreviewForRow_(sheet, rowNum, headers, url) {
  var preview = unfurlProduct_(url);
  var c = wishColumnNumbers_(headers);
  sheet.getRange(rowNum, c.link).setValue(url);

  if (preview.imageUrl) {
    var curImg = String(sheet.getRange(rowNum, c.image).getValue() || "").trim();
    if (!curImg) sheet.getRange(rowNum, c.image).setValue(preview.imageUrl);
  }
  if (preview.title) {
    var curTitle = String(sheet.getRange(rowNum, c.title).getValue() || "").trim();
    if (!curTitle) sheet.getRange(rowNum, c.title).setValue(preview.title);
  }
  if (preview.priceHint) {
    var curPrice = String(sheet.getRange(rowNum, c.price).getValue() || "").trim();
    if (!curPrice) sheet.getRange(rowNum, c.price).setValue(preview.priceHint);
  }
  if (preview.description) {
    var curDesc = String(sheet.getRange(rowNum, c.description).getValue() || "").trim();
    if (!curDesc) sheet.getRange(rowNum, c.description).setValue(preview.description);
  }
}

function handleWishLinkEdit_(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (!isWishesSheet_(sheet)) return;
  if (e.range.getRow() < 2) return;

  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 10)).getValues()[0];
  var url = String(e.value != null ? e.value : e.range.getValue() || "").trim();
  if (!/^https?:\/\//i.test(url)) return;

  fillWishPreviewForRow_(sheet, e.range.getRow(), headers, url);
}

function listWishes_() {
  return listWishesFromSheet_(true);
}

function listWishesFromSheet_(activeOnly) {
  var sheet = getWishesSheet_();
  if (!sheet) return [];
  ensureWishHeaders_(sheet);
  var grants = countGrantsByWishId_();

  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), 10);
  if (lastRow < 2) return [];

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var cols = wishColumnNumbers_(headers);
  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var out = [];

  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var id = String(rowCell_(row, cols.id) || "").trim() || "w" + (i + 1);
    var active = String(rowCell_(row, cols.active) || "yes")
      .trim()
      .toLowerCase();
    var isInactive = active === "no" || active === "0" || active === "false";
    if (activeOnly && isInactive) continue;

    var link = String(rowCell_(row, cols.link) || "").trim();
    var title = String(rowCell_(row, cols.title) || "").trim();
    var imageUrl = normalizeWishImageUrl_(String(rowCell_(row, cols.image) || "").trim());
    var priceHint = String(rowCell_(row, cols.price) || "").trim();
    var description = String(rowCell_(row, cols.description) || "").trim();

    if (!title && !link && !imageUrl) continue;

    var qty = Math.max(1, Math.floor(Number(rowCell_(row, cols.qty)) || 1));
    out.push({
      id: id,
      title: title || "Wish",
      description: description,
      category: String(rowCell_(row, cols.category) || "General").trim() || "General",
      priceHint: priceHint,
      link: link,
      imageUrl: imageUrl,
      qty: qty,
      grantedCount: grants[id] || 0,
      sort: Math.floor(Number(rowCell_(row, cols.sort)) || i),
      active: !isInactive,
    });
  }

  out.sort(function (a, b) {
    return (a.sort || 0) - (b.sort || 0);
  });
  return out;
}

function wishUpsert_(data) {
  var sheet = getWishesSheet_();
  if (!sheet) throw new Error('Missing "wishes" tab.');
  setupWishesHeaderRow();

  var imageUrl = String((data.imageUrl || (data.wish && data.wish.imageUrl)) || "").trim();
  if (data.imageBase64) {
    imageUrl = saveWishImageFromBase64_(
      String(data.imageBase64),
      String(data.imageMime || "image/jpeg"),
      String(data.imageName || "wish-photo.jpg"),
    );
  } else if (imageUrl) {
    imageUrl = normalizeWishImageUrl_(imageUrl);
  }

  var w = data.wish || data;
  var title = String(w.title || "").trim();
  if (!title) throw new Error("Title is required");

  var id = String(w.id || "").trim();
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 10)).getValues()[0];
  var cols = wishColumnNumbers_(headers);
  var rowNum = id ? findWishRowById_(sheet, cols, id) : 0;

  if (!id) {
    id = nextWishId_(sheet, cols);
  }
  if (rowNum < 2) {
    rowNum = sheet.getLastRow() + 1;
    if (rowNum < 2) rowNum = 2;
  }

  var description = String(w.description || "").trim();
  var category = String(w.category || "General").trim() || "General";
  var priceHint = String(w.priceHint || "").trim();
  var link = String(w.link || "").trim();
  var qty = Math.max(1, Math.min(20, Math.floor(Number(w.qty) || 1)));
  var sort = Math.floor(Number(w.sort));
  if (isNaN(sort)) sort = rowNum - 2;
  var active = w.active === false ? "no" : "yes";

  if (!imageUrl) {
    var existing = String(sheet.getRange(rowNum, cols.image).getValue() || "").trim();
    if (existing) imageUrl = existing;
  }

  sheet.getRange(rowNum, cols.id).setValue(id);
  sheet.getRange(rowNum, cols.title).setValue(title);
  sheet.getRange(rowNum, cols.description).setValue(description);
  sheet.getRange(rowNum, cols.category).setValue(category);
  sheet.getRange(rowNum, cols.price).setValue(priceHint);
  sheet.getRange(rowNum, cols.link).setValue(link);
  sheet.getRange(rowNum, cols.image).setValue(imageUrl);
  sheet.getRange(rowNum, cols.qty).setValue(qty);
  sheet.getRange(rowNum, cols.sort).setValue(sort);
  sheet.getRange(rowNum, cols.active).setValue(active);

  return { ok: true, id: id, imageUrl: imageUrl };
}

function wishSetActive_(id, active) {
  id = String(id || "").trim();
  if (!id) throw new Error("Missing id");
  var sheet = getWishesSheet_();
  if (!sheet) throw new Error('Missing "wishes" tab.');
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 10)).getValues()[0];
  var cols = wishColumnNumbers_(headers);
  var rowNum = findWishRowById_(sheet, cols, id);
  if (rowNum < 2) throw new Error("Wish not found");
  sheet.getRange(rowNum, cols.active).setValue(active ? "yes" : "no");
  return { ok: true };
}

function findWishRowById_(sheet, cols, id) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  for (var r = 2; r <= lastRow; r++) {
    if (String(sheet.getRange(r, cols.id).getValue() || "").trim() === id) return r;
  }
  return 0;
}

function nextWishId_(sheet, cols) {
  var lastRow = sheet.getLastRow();
  var max = 0;
  for (var r = 2; r <= Math.max(lastRow, 1); r++) {
    var raw = String(sheet.getRange(r, cols.id).getValue() || "").trim();
    var m = raw.match(/(\d+)/);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return "w" + String(max + 1).padStart(3, "0");
}

function getWishImageFolder_() {
  var name = "Laila Wishlist Images";
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function saveWishImageFromBase64_(base64, mimeType, filename) {
  var bytes = Utilities.base64Decode(base64);
  var blob = Utilities.newBlob(bytes, mimeType || "image/jpeg", filename || "wish.jpg");
  var folder = getWishImageFolder_();
  var file = folder.createFile(blob);
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    /* sharing may require authorization */
  }
  return driveImagePublicUrl_(file.getId());
}

function extractDriveFileId_(url) {
  url = String(url || "").trim();
  var m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  return "";
}

function driveImagePublicUrl_(fileId) {
  return "https://lh3.googleusercontent.com/d/" + fileId + "=w1200";
}

/** Drive “uc?” and Bing short links do not work in &lt;img&gt; on the wedding site. */
function normalizeWishImageUrl_(url) {
  url = String(url || "").trim();
  if (!url) return "";
  var driveId = extractDriveFileId_(url);
  if (driveId) return driveImagePublicUrl_(driveId);
  if (/^https?:\/\/sl\.bing\.net\//i.test(url)) return "";
  if (/bing\.com\/images\/search/i.test(url)) return "";
  return url;
}

function wishColumnIndex_(headers) {
  return {
    id: colIndex_(headers, ["id"]),
    title: colIndex_(headers, ["title", "tajuk"]),
    description: colIndex_(headers, ["description", "penerangan"]),
    category: colIndex_(headers, ["category", "kategori"]),
    price: colIndex_(headers, ["price hint", "price", "harga"]),
    link: colIndex_(headers, ["link", "pautan", "url"]),
    image: colIndex_(headers, ["image", "imej", "gambar"]),
    qty: colIndex_(headers, ["qty", "quantity", "kuantiti"]),
    sort: colIndex_(headers, ["sort", "order"]),
    active: colIndex_(headers, ["active", "aktif"]),
  };
}

function countGrantsByWishId_() {
  var sheet = getGrantsSheet_(false);
  if (!sheet || sheet.getLastRow() < 2) return {};
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 4)).getValues()[0];
  var wishCol = colIndex_(headers, ["wish id", "id"]);
  var statusCol = colIndex_(headers, ["status"]);
  if (wishCol < 0) wishCol = 1;
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  var counts = {};
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (statusCol >= 0) {
      var st = String(row[statusCol] || "").trim().toLowerCase();
      if (st === "released" || st === "cancelled") continue;
    }
    var id = String(row[wishCol] || "").trim();
    if (!id) continue;
    counts[id] = (counts[id] || 0) + 1;
  }
  return counts;
}

function appendGrant_(wishId, name, note) {
  var sheet = getGrantsSheet_(true);
  if (!sheet) throw new Error('Missing "granted" tab.');
  ensureGrantHeaders_(sheet);

  var wishes = listWishesForGrantCheck_();
  var wish = null;
  for (var i = 0; i < wishes.length; i++) {
    if (wishes[i].id === wishId) {
      wish = wishes[i];
      break;
    }
  }
  if (!wish) throw new Error("Wish not found");
  if (wish.grantedCount >= wish.qty) throw new Error("This wish is already fully granted");

  sheet.appendRow([new Date(), wishId, name, note, "active"]);
}

function listWishesForGrantCheck_() {
  return listWishes_();
}

function ensureWishHeaders_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    "ID",
    "Title",
    "Description",
    "Category",
    "Price Hint",
    "Link",
    "Image",
    "Qty",
    "Sort",
    "Active",
  ]);
  sheet.getRange(1, 1, 1, 10).setFontWeight("bold");
}

function ensureGrantHeaders_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(["Granted At", "Wish ID", "Guest Name", "Note", "Status"]);
  sheet.getRange(1, 1, 1, 5).setFontWeight("bold");
}

function unfurlProduct_(url) {
  url = String(url || "").trim();
  if (!/^https?:\/\//i.test(url)) throw new Error("Invalid URL");

  var res = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    followRedirects: true,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-MY,en;q=0.9",
    },
  });
  var code = res.getResponseCode();
  if (code >= 400) throw new Error("Could not load link (HTTP " + code + ")");
  var html = res.getContentText();

  var title = metaContent_(html, "og:title") || metaContent_(html, "twitter:title") || "";
  var imageUrl = metaContent_(html, "og:image") || metaContent_(html, "twitter:image") || "";
  var description = metaContent_(html, "og:description") || metaContent_(html, "description") || "";

  title = decodeHtmlEntities_(title.replace(/\s*\|\s*IKEA.*$/i, "").trim());
  description = decodeHtmlEntities_(description.trim());

  var priceHint = "";
  var amount =
    metaContent_(html, "product:price:amount") ||
    metaContent_(html, "og:price:amount") ||
    metaContent_(html, "product:price");
  if (amount) {
    priceHint = "RM " + String(amount).replace(/[^\d.,]/g, "");
  }
  if (!priceHint) {
    var rm = html.match(/RM\s*[\d,.]+(?:\s*\/\s*[^<"\s]{1,24})?/i);
    if (rm) priceHint = rm[0].replace(/\s+/g, " ").trim();
  }

  return {
    title: title,
    description: description,
    imageUrl: imageUrl,
    priceHint: priceHint,
  };
}

function metaContent_(html, key) {
  var patterns = [
    new RegExp(
      '<meta[^>]+(?:property|name)=["\']' + escapeRegex_(key) + '["\'][^>]+content=["\']([^"\']+)["\']',
      "i",
    ),
    new RegExp(
      '<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']' + escapeRegex_(key) + '["\']',
      "i",
    ),
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = html.match(patterns[i]);
    if (m && m[1]) return m[1].trim();
  }
  return "";
}

function escapeRegex_(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtmlEntities_(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

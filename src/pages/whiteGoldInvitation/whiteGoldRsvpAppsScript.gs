/**
 * Shared / White & Gold RSVP — paste into the Google Sheet’s Apps Script, then:
 * Deploy → Manage deployments → Edit → New version → Deploy
 *
 * Use this if Naim & Nadhirah RSVPs already go to this sheet (theme: whiteGold).
 * Adds GET list for the client dashboard at /naim-nadhirah-nikah/dashboard
 *
 * Row 1: Tarikh & Masa | Nama | Kehadiran | Bilangan Tetamu | Ucapan | Tema
 *
 * GET  ?action=list&theme=whiteGold&callback=fn  → JSONP rows (optional theme filter)
 * POST JSON { name, attending, guests, message, theme } → append row
 */

var SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    var data = parseBody_(e);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Missing tab: " + SHEET_NAME);

    ensureHeaders_(sheet);

    var attending = data.attending === "yes" ? "Hadir" : "Tidak hadir";
    var guests = Math.max(1, Math.min(10, Math.floor(Number(data.guests) || 1)));
    if (attending === "Tidak hadir") guests = 1;

    sheet.appendRow([
      new Date(),
      String(data.name || "").trim(),
      attending,
      guests,
      String(data.message || "").trim(),
      String(data.theme || "whiteGold").trim() || "whiteGold",
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "list";
    if (action === "list") {
      var theme = (e.parameter && e.parameter.theme) || "";
      return jsonp_(e, { ok: true, rows: listRows_(theme) });
    }
    return jsonp_(e, { ok: true, service: "wedding-rsvp" });
  } catch (err) {
    return jsonp_(e, { ok: false, error: String(err) });
  }
}

function parseBody_(e) {
  var raw = (e && e.postData && e.postData.contents) || "{}";
  return JSON.parse(raw);
}

function listRows_(themeFilter) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Missing tab: " + SHEET_NAME);
  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), 6);
  if (lastRow < 2) return [];

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var idx = {
    submittedAt: colIndex_(headers, ["tarikh & masa", "tarikh", "timestamp"]),
    name: colIndex_(headers, ["nama"]),
    attending: colIndex_(headers, ["kehadiran"]),
    guests: colIndex_(headers, ["bilangan tetamu", "tetamu"]),
    message: colIndex_(headers, ["ucapan"]),
    theme: colIndex_(headers, ["tema"]),
  };
  if (idx.name < 0) idx.name = 1;
  if (idx.attending < 0) idx.attending = 2;
  if (idx.guests < 0) idx.guests = 3;
  if (idx.message < 0) idx.message = 4;
  if (idx.theme < 0) idx.theme = 5;
  if (idx.submittedAt < 0) idx.submittedAt = 0;

  var want = String(themeFilter || "")
    .trim()
    .toLowerCase();
  var tz = Session.getScriptTimeZone() || "Asia/Kuala_Lumpur";
  var values = sheet.getRange(2, 1, lastRow, lastCol).getValues();
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var name = String(row[idx.name] || "").trim();
    if (!name) continue;
    var theme = String(row[idx.theme] || "").trim();
    if (want && theme && theme.toLowerCase() !== want) continue;
    rows.push({
      submittedAt: formatStamp_(row[idx.submittedAt], tz),
      name: name,
      attending: String(row[idx.attending] || "").replace(/"/g, "").trim(),
      guests: Math.max(1, Math.floor(Number(row[idx.guests]) || 1)),
      message: String(row[idx.message] || "").trim(),
      theme: theme,
    });
  }
  return rows;
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

function formatStamp_(value, tz) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, tz, "dd/MM/yyyy HH:mm");
  }
  return String(value || "").trim();
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    "Tarikh & Masa",
    "Nama",
    "Kehadiran",
    "Bilangan Tetamu",
    "Ucapan",
    "Tema",
  ]);
  sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
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

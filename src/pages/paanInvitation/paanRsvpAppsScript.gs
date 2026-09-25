/**
 * Farhan & Atheela (Paan) RSVP — paste into Extensions → Apps Script, then:
 * Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Row 1 headers (exact):
 *   Tarikh & Masa | Nama | Kehadiran | Bilangan Tetamu | Ucapan | Tema
 *
 * GET  ?action=list&callback=fn  → JSONP list for /farhan-atheela/dashboard
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
      String(data.theme || "paan").trim() || "paan",
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
      return jsonp_(e, { ok: true, rows: listRows_() });
    }
    return jsonp_(e, { ok: true, service: "paan-rsvp" });
  } catch (err) {
    return jsonp_(e, { ok: false, error: String(err) });
  }
}

function parseBody_(e) {
  var raw = (e && e.postData && e.postData.contents) || "{}";
  return JSON.parse(raw);
}

function listRows_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Missing tab: " + SHEET_NAME);
  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), 6);
  if (lastRow < 2) return [];

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var idx = {
    submittedAt: colIndex_(headers, ["tarikh & masa", "tarikh", "timestamp", "date"]),
    name: colIndex_(headers, ["nama", "name"]),
    attending: colIndex_(headers, ["kehadiran", "attending", "status"]),
    guests: colIndex_(headers, ["bilangan tetamu", "tetamu", "guests", "jumlah tetamu"]),
    message: colIndex_(headers, ["ucapan", "message", "doa"]),
    theme: colIndex_(headers, ["tema", "theme"]),
  };
  if (idx.name < 0) idx.name = 1;
  if (idx.attending < 0) idx.attending = 2;
  if (idx.guests < 0) idx.guests = 3;
  if (idx.message < 0) idx.message = 4;
  if (idx.theme < 0) idx.theme = 5;
  if (idx.submittedAt < 0) idx.submittedAt = 0;

  var tz = Session.getScriptTimeZone() || "Asia/Kuala_Lumpur";
  var values = sheet.getRange(2, 1, lastRow, lastCol).getValues();
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var name = String(row[idx.name] || "").trim();
    if (!name) continue;
    rows.push({
      submittedAt: formatStamp_(row[idx.submittedAt], tz),
      name: name,
      attending: String(row[idx.attending] || "").replace(/"/g, "").trim(),
      guests: Math.max(1, Math.floor(Number(row[idx.guests]) || 1)),
      message: String(row[idx.message] || "").trim(),
      theme: String(row[idx.theme] || "").trim(),
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
  sheet
    .getRange(1, 1, 1, 6)
    .setValues([["Tarikh & Masa", "Nama", "Kehadiran", "Bilangan Tetamu", "Ucapan", "Tema"]])
    .setFontWeight("bold");
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

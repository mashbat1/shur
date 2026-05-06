/**
 * Beeb — Орлого / захиалга бүртгэх Apps Script
 *
 * Анх нэг удаа `setup()` функцыг ажиллуул — Хүснэгт шинээр нээгдэж,
 * Төлөв багана дээр dropdown тохируулагдана.
 *
 * Дараа нь Deploy → New Deployment → Web app
 *   - Execute as: Me
 *   - Who has access: Anyone
 * → Web App URL-ыг копидоод аппын `.env.local` дотор
 *   `NEXT_PUBLIC_SHEETS_URL=...` гэж хадгал.
 */

const SHEET_NAME = "Orders";

/* ─────────────────────────  setup  ───────────────────────── */

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "ID",
      "Огноо",
      "Нэр",
      "Утас",
      "Хаяг",
      "Бүтээгдэхүүн",
      "Загвар (JSON)",
      "Нийт ₮",
      "Төлөв",
      "Хүргэх огноо",
    ]);
    sheet.getRange("A1:J1").setFontWeight("bold").setBackground("#1a1a1f").setFontColor("#ffd54a");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 100);
    sheet.setColumnWidth(2, 140);
    sheet.setColumnWidth(7, 280);
  }

  // Status dropdown (Column 9 = "Төлөв")
  const range = sheet.getRange(2, 9, 1000, 1);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(
      [
        "Хүлээгдэж буй",
        "Хүлээж авсан",
        "Эхэлсэн",
        "Хүргэлтэд",
        "Хүргэгдсэн",
        "Цуцалсан",
      ],
      true,
    )
    .setAllowInvalid(false)
    .build();
  range.setDataValidation(rule);
}

/* ─────────────────────────  POST  ───────────────────────── */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return json({ ok: false, error: "Sheet тохируулаагүй. setup() ажиллуулна уу." });
    }

    sheet.appendRow([
      data.id,
      new Date(data.createdAt || new Date()),
      data.customer && data.customer.name,
      data.customer && data.customer.phone,
      data.customer && data.customer.address,
      summarizeItems(data.items || []),
      JSON.stringify(data.items || []),
      data.total,
      "Хүлээгдэж буй",
      "",
    ]);

    return json({ ok: true, id: data.id });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/* ─────────────────────────  GET  ───────────────────────── */

function doGet(e) {
  try {
    const id = e.parameter && e.parameter.id;
    if (!id) return json({ ok: false, error: "Missing id" });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return json({ ok: false, error: "Sheet not set up" });

    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(id)) {
        return json({
          ok: true,
          id: rows[i][0],
          createdAt: formatDate(rows[i][1]),
          name: rows[i][2],
          phone: rows[i][3],
          summary: rows[i][5],
          total: rows[i][7],
          status: rows[i][8],
          deliveryDate: rows[i][9] ? formatDate(rows[i][9]) : null,
        });
      }
    }

    return json({ ok: false, error: "Захиалга олдсонгүй" });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/* ─────────────────────────  helpers  ───────────────────────── */

function summarizeItems(items) {
  return items
    .map(function (it) {
      const t = it.productType;
      const label =
        t === "bracelet"
          ? "Бугуйвч"
          : t === "necklace"
          ? "Зүүлт"
          : t === "phone_strap"
          ? "Утасны оосор"
          : t;
      return label + " (" + (it.beads ? it.beads.length : 0) + " шурэг, " + it.lengthCm + "см)";
    })
    .join("; ");
}

function formatDate(d) {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return String(d);
  return Utilities.formatDate(date, "Asia/Ulaanbaatar", "yyyy-MM-dd");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

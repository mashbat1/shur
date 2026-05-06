/**
 * Beeb — Google Sheet захиалгын backend
 *
 * Анх нэг удаа Apps Script editor-оос:
 *   1. setup()       — Orders хуудас + dropdown + email багана үүсгэх
 *   2. installEditTrigger() — Төлөв солих бүрд email/SMS явдаг болгох
 *
 * Дараа нь Deploy → Web app:
 *   - Execute as: Me
 *   - Who has access: Anyone
 *   - Web App URL-ыг appын `.env.local`-д
 *     `NEXT_PUBLIC_SHEETS_URL=...` гэж тавь.
 */

const SHEET_NAME = "Orders";

/** Хэрэглэгчид мэдэгдэл явуулах хаяг — `https://your-domain.vercel.app` */
const TRACK_BASE_URL = "https://shur-ruby.vercel.app";

/** Twilio SMS — хэрэв ашиглах бол энд credentials оруул, эс бөгөөс хоосон үлдээ */
const TWILIO = {
  accountSid: "",      // ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  authToken: "",       // 32-char auth token
  fromNumber: "",      // +15551234567
};

/* ─────────────────────  setup  ───────────────────── */

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
      "Email",
      "Сүүлд илгээсэн",
    ]);
    sheet
      .getRange("A1:L1")
      .setFontWeight("bold")
      .setBackground("#1a1a1f")
      .setFontColor("#ffd54a");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 100);
    sheet.setColumnWidth(2, 140);
    sheet.setColumnWidth(7, 280);
    sheet.setColumnWidth(11, 180);
  }

  // Status dropdown (Column 9 = "Төлөв")
  const statusRange = sheet.getRange(2, 9, 1000, 1);
  const statusRule = SpreadsheetApp.newDataValidation()
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
  statusRange.setDataValidation(statusRule);
}

function installEditTrigger() {
  // Remove existing triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "onStatusEdit") {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger("onStatusEdit")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
  Logger.log("Trigger installed.");
}

/* ─────────────────────  POST (захиалга нэмэх)  ───────────────────── */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return json({ ok: false, error: "Sheet not set up — run setup()" });
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
      (data.customer && data.customer.email) || "",
      "",
    ]);

    // Confirmation email + (optional) SMS — runs in the doPost context which
    // has the script owner's permissions, so MailApp / UrlFetchApp are OK.
    sendOrderConfirmation(data);

    return json({ ok: true, id: data.id });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function sendOrderConfirmation(data) {
  const email = data.customer && data.customer.email;
  const phone = data.customer && data.customer.phone;
  const name = data.customer && data.customer.name;
  const id = data.id;
  const total = data.total || 0;
  const summary = summarizeItems(data.items || []);
  const trackLink = TRACK_BASE_URL + "/order/" + encodeURIComponent(id);

  const subject = "Beeb — Захиалга #" + id + " баталгаажлаа";
  const body = [
    "Сайн байна уу" + (name ? ", " + name : "") + ".",
    "",
    "Таны захиалгыг бид хүлээн авлаа.",
    "",
    "  Захиалгын дугаар : " + id,
    "  Бүтээгдэхүүн     : " + summary,
    "  Нийт             : " + total.toLocaleString() + "₮",
    "",
    "Төлвийн өөрчлөлт бүрд имэйл автоматаар очно.",
    "Захиалгын явцыг харах: " + trackLink,
    "",
    "Beeb багт хандсанд баярлалаа.",
  ].join("\n");

  if (email && /\S+@\S+/.test(String(email))) {
    try {
      MailApp.sendEmail(email, subject, body);
    } catch (err) {
      Logger.log("Confirmation email error: " + err);
    }
  }

  if (TWILIO.accountSid && TWILIO.authToken && TWILIO.fromNumber && phone) {
    try {
      sendTwilioSms(
        String(phone),
        "Beeb захиалга #" + id + " хүлээн авлаа. " +
          total.toLocaleString() + "₮. " + trackLink,
      );
    } catch (err) {
      Logger.log("Confirmation SMS error: " + err);
    }
  }
}

/* ─────────────────────  GET (төлөв унших)  ───────────────────── */

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

/* ─────────────────────  Trigger: Төлөв солих үед мэдэгдэл  ───────────────────── */

function onStatusEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;

  const col = e.range.getColumn();
  const row = e.range.getRow();
  if (row < 2) return;

  // Trigger if Status (9) or Delivery Date (10) was edited
  if (col !== 9 && col !== 10) return;

  const data = sheet.getRange(row, 1, 1, 12).getValues()[0];
  const id = data[0];
  const name = data[2];
  const phone = data[3];
  const total = data[7];
  const status = data[8];
  const deliveryDate = data[9] ? formatDate(data[9]) : "";
  const email = data[10];

  if (!status) return;

  const subject = "Beeb — Захиалгын явц #" + id;
  const trackLink = TRACK_BASE_URL + "/order/" + encodeURIComponent(id);
  const lines = [
    "Сайн байна уу" + (name ? ", " + name : "") + ".",
    "",
    "Таны захиалга #" + id + "-ийн төлөв шинэчлэгдлээ:",
    "",
    "  Төлөв: " + status,
  ];
  if (deliveryDate) lines.push("  Хүргэх огноо: " + deliveryDate);
  lines.push("  Нийт: " + (total || 0).toLocaleString() + "₮");
  lines.push("");
  lines.push("Дэлгэрэнгүйг: " + trackLink);
  lines.push("");
  lines.push("Beeb багт хандсанд баярлалаа.");
  const body = lines.join("\n");

  let sentTo = [];

  // Email
  if (email && /\S+@\S+/.test(String(email))) {
    try {
      MailApp.sendEmail(email, subject, body);
      sentTo.push("email:" + email);
    } catch (err) {
      Logger.log("Email error: " + err);
    }
  }

  // SMS via Twilio (optional)
  if (TWILIO.accountSid && TWILIO.authToken && TWILIO.fromNumber && phone) {
    try {
      const smsText =
        "Beeb #" + id + " — " + status +
        (deliveryDate ? " (хүргэх: " + deliveryDate + ")" : "") +
        " " + trackLink;
      sendTwilioSms(String(phone), smsText);
      sentTo.push("sms:" + phone);
    } catch (err) {
      Logger.log("SMS error: " + err);
    }
  }

  if (sentTo.length > 0) {
    sheet.getRange(row, 12).setValue(
      Utilities.formatDate(new Date(), "Asia/Ulaanbaatar", "yyyy-MM-dd HH:mm") +
        " · " + sentTo.join(", "),
    );
  }
}

function sendTwilioSms(toRaw, body) {
  // Mongolian numbers usually have no country code in our form;
  // assume +976 if it doesn't already start with +.
  const to = String(toRaw).startsWith("+")
    ? String(toRaw)
    : "+976" + String(toRaw).replace(/[^0-9]/g, "");

  const url =
    "https://api.twilio.com/2010-04-01/Accounts/" +
    TWILIO.accountSid +
    "/Messages.json";
  const auth = Utilities.base64Encode(
    TWILIO.accountSid + ":" + TWILIO.authToken,
  );
  UrlFetchApp.fetch(url, {
    method: "post",
    headers: { Authorization: "Basic " + auth },
    payload: { From: TWILIO.fromNumber, To: to, Body: body },
  });
}

/* ─────────────────────  helpers  ───────────────────── */

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

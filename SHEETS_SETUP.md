# Google Sheets-руу захиалга бүртгэх (DB-гүйгээр)

Энэ заавар нь захиалгуудыг өгөгдсөн Google Sheet-д шууд бичих болон харах
тохиргоог хэрхэн хийхийг тайлбарлана.

Sheet жишээ: `https://docs.google.com/spreadsheets/d/1wag-ddAE_oTZ-U_RJLC8uEJo-swi5xBRDCWAFJeYr3Y/edit`

---

## 1. Apps Script тохируулах

1. Sheet-ээ нээгээд **Extensions → Apps Script**.
2. Гарч ирсэн `Code.gs`-ийн агуулгыг **бүхэлд нь устгаад**, `scripts/google-apps-script.gs` файлын
   агуулгыг хуул.
3. **💾 Save** (Ctrl+S).
4. Дээд талын функцын dropdown-оос `setup` сонгоод **▶ Run** дар. Эхний удаа Google зөвшөөрлийг
   асууна — `Allow` дар.
5. Sheet рүүгээ буцаж шалгана: **Orders** нэртэй sheet шинээр үүсэж, толгой мөр + Төлөв
   баганад dropdown гарсан байх ёстой.
6. **Email/SMS мэдэгдэл** — функцын dropdown-оос `installEditTrigger` сонгож **▶ Run** дар.
   Энэ нь Төлөв эсвэл Хүргэх огноо багана өөрчлөгдөх бүрд хэрэглэгчийн email рүү
   баталгаажуулалт явуулна.

> ⚙️ **Twilio SMS** ашиглах бол script-ийн дээд хэсэгт `TWILIO.accountSid`, `authToken`,
> `fromNumber`-ыг өөрөө бөглөөд дахин Save → installEditTrigger ажиллуул.
> Twilio account шинэ хэрэглэгчид ~$15 кредит үнэгүй өгдөг.

## 2. Web App-ыг deploy хийх

1. Apps Script-ийн дотор **Deploy → New Deployment**.
2. Шинж: **Web app** сонгох (gear icon → "Web app").
3. Settings:
   - **Description**: `beeb orders`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. **Deploy** дар. Дахин зөвшөөрөл асуувал зөвшөөр.
5. Гарч ирсэн **Web app URL**-ыг копилох. Иймэрхүү харагдана:
   ```
   https://script.google.com/macros/s/AKfycb…long…id/exec
   ```

> ℹ️ Хожим script-ээ засвал **Manage deployments → Edit → New version** хийх ёстой,
> URL хэвээр үлдэнэ.

## 3. Аппд URL-ыг хадгалах

Project root-д `.env.local` файл үүсгэж дараах нэг мөрийг бичнэ:

```
NEXT_PUBLIC_SHEETS_URL=https://script.google.com/macros/s/...exec
```

Dev server-ээ дахин эхлүүл (`npm run dev`).

## 4. Vercel-д deploy хийсэн бол

Vercel project → **Settings → Environment Variables** → нэмэх:

| Name                   | Value                              |
| ---------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SHEETS_URL` | (өмнөх алхамд авсан Web App URL)   |

Дараа нь redeploy хийгдвэл Sheet-руу бичигдэх боломжтой болно.

---

## Хэрхэн ашиглах

- **Захиалга өгсөн**: Sheet-ийн `Orders` хуудсанд автоматаар мөр нэмэгдэнэ.
- **Төлөв өөрчлөх**: I баганад dropdown сонго (`Хүлээгдэж буй` → `Эхэлсэн` → `Хүргэлтэд` →
  `Хүргэгдсэн`).
- **Хүргэх огноо**: J баганад тохируулах огноогоо бич.
- **Хэрэглэгч өөрийн захиалгаа харах**: захиалга хийсний дараа гарч ирэх **Track
  захиалга** товч руу орно. URL: `https://your-site/order/<ID>`. Сайт уг ID-аар sheet-аас
  одоогийн төлөв, хүргэх огноог уншина.

---

## Нэг алдааны жагсаалт

| Алдаа                                                  | Шийдэл                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| Sheet-д мөр нэмэгдэхгүй                                | Apps Script-д `Anyone` access өгсөн эсэхийг шалга. Дахин deploy хий.    |
| `/order/<id>` "тохируулагдаагүй" гэж байгаа            | `.env.local` дотор `NEXT_PUBLIC_SHEETS_URL` хийгээгүй / dev сервер reset хийгээгүй. |
| Sheet хоосон, гэхдээ чанал бий                         | Apps Script-ээс `setup()`-г дахин ажиллуул.                             |

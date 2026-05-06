# Beeb — 3D Bead Designer Web App

Хэрэглэгч өөрөө шүрээ сонгож, угсарч, **3D загвараар** бүх талаас нь эргүүлж харж болдог онлайн дэлгүүр.

Бүтээгдэхүүн: бугуйвч (bracelet), зүүлт (necklace), утасны оосор (phone strap).

---

## 1. Үндсэн боломжууд (Features)

### 1.1 Хэрэглэгчийн талаас
- [ ] Шурээ каталогоос үзэж сонгох (өнгө, хэмжээ, хэлбэр, материалаар шүүх)
- [ ] Бүтээгдэхүүний төрөл сонгох: бугуйвч / зүүлт / утасны оосор
- [ ] Бугуйвчны/зүүлтийн **уртыг** сонгох (см)
- [ ] Шүрээ дараалуулан угсрах (drag & drop эсвэл дараалан дарж нэмэх)
- [ ] **3D дэлгэцэнд бодит цагаар** угсралт нь харагдах
- [ ] Загвараа **360°** эргүүлж, томруулж, бүх талаас нь харах
- [ ] Загвараа хадгалах / линкээр хуваалцах
- [ ] Сагсанд хийх → захиалга өгөх
- [ ] Захиалгын явц харах

### 1.2 Админы талаас
- [ ] Шүрээ нэмэх / засах / устгах (зураг, 3D model, үнэ, нөөц)
- [ ] Бүтээгдэхүүний төрөл, утас (string) тохируулах
- [ ] Захиалга харах, төлөв шинэчлэх
- [ ] Үнэ автоматаар тооцох (шүр бүрийн үнэ + ажлын хөлс)

---

## 2. Технологийн стек (Tech Stack)

### Frontend
- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **3D engine:** [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **State:** Zustand (загварын төлөв)
- **Styling:** Tailwind CSS + shadcn/ui
- **Drag & Drop:** dnd-kit

### Backend
- **API:** Next.js API Routes (эсвэл tRPC)
- **DB:** PostgreSQL + Prisma ORM
- **File storage:** AWS S3 эсвэл Cloudinary (шурээний зураг, 3D model)
- **Auth:** NextAuth (Google + email)

### Төлбөр
- **Mongolia:** QPay, Khan Bank, Golomt API
- **International (хэрэв хэрэгтэй бол):** Stripe

### Deploy
- Vercel (frontend + API)
- Supabase эсвэл Neon (PostgreSQL)

---

## 3. 3D загварчлалын тухай (3D Implementation)

### 3.1 Шурээний 3D model
- Шурэ бүрд **GLB/GLTF** файл хэрэгтэй (low-poly, ~500-2000 triangles)
- Хувилбар 1: Blender дээр өөрөө загварчлах
- Хувилбар 2: Procedural — шурээний хэлбэрийг код дотор үүсгэх (бөмбөлөг, цилиндр, кубик гэх мэт)
- Texture: PBR (color, roughness, metalness)

### 3.2 Утас (string) физик
- Шурэг нь дагуу **catmull-rom curve** дээр байрлуулах
- Бугуйвч/зүүлтийн хэлбэр — хаалттай гогцоо (closed loop)
- Утасны оосор — нээлттэй муруй
- Сонголт 1 (хялбар): тогтмол curve дээр шурэг тэнцүү зайтай байрлуулах
- Сонголт 2 (бодит): [Cannon.js](https://github.com/pmndrs/use-cannon) ашиглан физик симуляц

### 3.3 Камер ба харалт
- `OrbitControls` (drei) — хулганаар эргүүлэх, томруулах
- Анхдагч: 45° перспектив камер, авто эргэлдэх
- Гэрэл: 1 ambient + 1 directional + environment HDRI

### 3.4 Гүйцэтгэл (Performance)
- 100+ шурэг үед `InstancedMesh` ашиглах
- Texture-уудыг compress (KTX2)
- Lazy load 3D model

---

## 4. Өгөгдлийн загвар (Database Schema)

```prisma
model Bead {
  id          String   @id @default(cuid())
  name        String
  category    String   // "round", "tube", "charm", "spacer"
  color       String   // hex
  diameterMm  Float
  imageUrl    String
  modelUrl    String?  // GLB file URL
  price       Int      // ₮
  stock       Int
  createdAt   DateTime @default(now())
}

model String {
  id        String  @id @default(cuid())
  name      String  // "elastic", "wire", "leather"
  color     String
  pricePerCm Int
}

model Design {
  id         String   @id @default(cuid())
  userId     String?
  type       String   // "bracelet" | "necklace" | "phone_strap"
  lengthCm   Float
  stringId   String
  beads      Json     // [{ beadId, position }, ...]
  thumbnail  String?  // 3D screenshot URL
  shareSlug  String   @unique
  createdAt  DateTime @default(now())
}

model Order {
  id         String   @id @default(cuid())
  userId     String
  designId   String
  status     String   // "pending" | "paid" | "making" | "shipped" | "done"
  totalPrice Int
  address    String
  phone      String
  createdAt  DateTime @default(now())
}

model User {
  id       String  @id @default(cuid())
  email    String  @unique
  name     String?
  role     String  @default("customer") // "customer" | "admin"
  designs  Design[]
  orders   Order[]
}
```

---

## 5. Файлын бүтэц (File Structure)

```
beeb/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx                    # Нүүр
│   │   ├── designer/
│   │   │   └── page.tsx                # 3D дизайнер
│   │   ├── catalog/page.tsx            # Бэлэн загварууд
│   │   └── cart/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── beads/page.tsx
│   │       └── orders/page.tsx
│   └── api/
│       ├── beads/route.ts
│       ├── designs/route.ts
│       └── orders/route.ts
├── components/
│   ├── designer/
│   │   ├── Canvas3D.tsx                # <Canvas> wrapper
│   │   ├── BeadOnString.tsx            # 1 шурэг 3D-д
│   │   ├── StringCurve.tsx             # утасны муруй
│   │   ├── BeadPicker.tsx              # зүүн талын каталог
│   │   ├── DesignTimeline.tsx          # доод талд угсралтын дараалал
│   │   └── DesignerControls.tsx        # урт, төрөл сонгох
│   └── ui/                             # shadcn
├── lib/
│   ├── db.ts                           # Prisma client
│   ├── designStore.ts                  # Zustand store
│   └── geometry.ts                     # curve & placement математик
├── prisma/
│   └── schema.prisma
├── public/
│   └── models/                         # GLB файлууд
└── package.json
```

---

## 6. Хөгжүүлэх үе шат (Roadmap)

### Phase 1 — MVP (3-4 долоо хоног)
- [x] Төслийн төлөвлөгөө (энэ файл)
- [ ] Next.js + Prisma + PostgreSQL setup
- [ ] Шурээний CRUD (admin only, image upload)
- [ ] Үндсэн UI: catalog, designer хуудас
- [ ] Three.js canvas — нэг шурэг харуулах
- [ ] Утасны муруй дээр шурэг байрлуулах (procedural geometry)
- [ ] Bead picker → шурэг нэмэх → 3D-д шууд харагдах
- [ ] OrbitControls — эргүүлэх, томруулах
- [ ] Design хадгалах (DB-д)

### Phase 2 — Захиалга (2 долоо хоног)
- [ ] User auth (NextAuth)
- [ ] Сагс
- [ ] Захиалгын form (хаяг, утас)
- [ ] QPay интеграц
- [ ] Email мэдэгдэл (Resend)
- [ ] Admin захиалгын самбар

### Phase 3 — Сайжруулалт (тасралтгүй)
- [ ] Гарын авлага / video tutorial
- [ ] Хуваалцах (share slug → preview)
- [ ] Бэлэн загваруудын галерей
- [ ] Хэлний дэмжлэг (MN/EN)
- [ ] Шурээний бодит зургийг 3D model-д хувиргах автомат pipeline
- [ ] Cannon.js физик (бодит мэт хөдөлгөөн)
- [ ] AR mode (mobile дээр өөрийн гарт нь харах)

---

## 7. Гол шийдэх ёстой техникийн асуудлууд

| # | Асуудал | Шийдэл |
|---|---------|--------|
| 1 | Шурэг бүрийн 3D model хаанаас ирэх вэ? | Phase 1: procedural (бөмбөлөг + өнгө). Phase 2: Blender + GLB upload. |
| 2 | Хаалттай гогцоонд шурэг яаж жигд байрлах вэ? | Catmull-rom closed curve, total length / bead diameter тэнцүү intervals |
| 3 | Янз бүрийн хэмжээтэй шурэг хооронд хэрхэн уялдах вэ? | Curve дээрх position нь тухайн шурэгийн radius-ыг тооцож шилжих |
| 4 | Утсыг хэрхэн зурах вэ? | `THREE.TubeGeometry` + curve |
| 5 | Mobile дээр гүйцэтгэл хэрхэн? | InstancedMesh, 60→30fps cap, low-poly models |
| 6 | Үнэ хэрхэн тооцох? | sum(beads.price) + string.length × pricePerCm + ажлын хөлс (тогтмол) |

---

## 8. Эхлэх (Getting Started)

```bash
# Next.js төсөл үүсгэх
npx create-next-app@latest . --typescript --tailwind --app

# 3D & UI dependencies
npm install three @react-three/fiber @react-three/drei
npm install zustand @dnd-kit/core
npm install @prisma/client
npm install -D prisma

# shadcn/ui setup
npx shadcn@latest init

# Prisma эхлүүлэх
npx prisma init
# → schema.prisma руу 4-р хэсгийн загвар хуулах
npx prisma migrate dev --name init
```

---

## 9. Лавлагаа (References)

- [React Three Fiber documentation](https://docs.pmnd.rs/react-three-fiber)
- [Drei helpers](https://github.com/pmndrs/drei)
- [Three.js Curve docs](https://threejs.org/docs/#api/en/extras/core/Curve)
- [Three.js Journey](https://threejs-journey.com/) — суралцах хамгийн сайн курс
- Жишээ төсөл: [Bezi 3D configurators](https://github.com/pmndrs/react-three-fiber/tree/master/examples)

---

## 10. Дараагийн алхам

1. Энэ төлөвлөгөөг уншиж, өөрчлөх / нэмэх зүйл байвал тэмдэглэх
2. Phase 1-ийг эхлүүлэх — Next.js setup
3. 5-10 жишээ шурэгээр прототип хийж 3D угсралт ажиллуулах
4. UI/UX wireframe зурах (Figma)

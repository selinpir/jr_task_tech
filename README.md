# Report Generator

Tech Talent Space staj değerlendirmesi kapsamında geliştirdiğim full stack bir rapor oluşturma uygulaması.

Uygulamada kullanıcı rapor başlığı ve içeriğini giriyor, bu bilgiler antetli PDF şablonu üzerine ekleniyor. Oluşturulan PDF önce önizlenebiliyor, ardından indirilebiliyor.

## Neler Yapıyor?

- Rapor başlığı ve içerik girişi
- Düz metin ve zengin metin desteği
- PDF önizleme
- PDF indirme
- Türkçe karakter desteği
- Mobil uyumlu arayüz
- Antetli PDF şablonu üzerine içerik oluşturma

## Kullanılan Teknolojiler

| Alan | Teknoloji |
|---|---|
| Frontend | React 18, Vite |
| Stil | CSS |
| Editör | TipTap |
| Animasyon | Framer Motion |
| Backend | Node.js, Express |
| PDF Oluşturma | Puppeteer |

## Proje Yapısı

```text
jr task1/
├── backend/
│   ├── server.js
│   ├── services/
│   │   └── pdfGenerator.js
│   └── templates/
│       └── tech.pdf
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── ReportForm.jsx
│   │       ├── Editor.jsx
│   │       ├── PDFPreview.jsx
│   │       └── Toast.jsx
│   └── index.html
│
└── README.md

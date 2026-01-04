# 📄 Report Generator - Full Stack Web Application

Profesyonel PDF rapor oluşturma aracı. Kullanıcıdan alınan rapor başlığı ve içeriği, antetli PDF şablonu üzerine yerleştirilir.

![Tech Talent Space](https://img.shields.io/badge/Tech%20Talent%20Space-Staj%20Projesi-2563eb)

## ✨ Özellikler

- 🔵 **Modern Mavi UI** - Glassmorphism tasarım, mavi renk paleti
- 🇹🇷 **Türkçe Karakter Desteği** - ğ, ş, ı, ü, ö, ç tam destek
- ✏️ **Dual Mode Editor** - Düz metin ve zengin metin (HTML) desteği
- 📐 **Ortalanmış İçerik** - Başlık ve içerik PDF'te ortalanmış görünür
- 👁️ **Real-time Preview** - PDF'in anlık önizlemesi
- 📥 **PDF Download** - Oluşturulan PDF'i indirme
- 🎬 **Smooth Animations** - Framer Motion ile akıcı geçişler
- 📱 **Responsive Design** - Mobil uyumlu tasarım

## 🛠️ Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 18 + Vite |
| UI | Vanilla CSS (Glassmorphism - Mavi Tema) |
| Editor | TipTap |
| Animation | Framer Motion |
| Backend | Node.js + Express |
| PDF | Puppeteer (Türkçe destekli) |

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Backend Kurulumu

```bash
cd backend
npm install
npm run dev
```

Backend `http://localhost:3001` adresinde çalışacaktır.

### Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

## 📁 Proje Yapısı

```
jr task1/
├── backend/
│   ├── server.js              # Express sunucu
│   ├── services/
│   │   └── pdfGenerator.js    # PDF oluşturma servisi (Puppeteer)
│   └── templates/
│       └── tech.pdf           # Antetli şablon
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Ana uygulama
│   │   ├── index.css          # Mavi tema glassmorphism stilleri
│   │   └── components/
│   │       ├── ReportForm.jsx # Rapor formu
│   │       ├── Editor.jsx     # TipTap metin editörü
│   │       ├── PDFPreview.jsx # PDF önizleme
│   │       └── Toast.jsx      # Bildirimler
│   └── index.html
└── README.md
```

## 🔌 API Endpoints

### POST /api/generate-pdf
PDF dosyası oluşturur ve indirir.

**Request Body:**
```json
{
  "title": "Rapor Başlığı",
  "content": "Rapor içeriği...",
  "contentType": "text" | "html"
}
```

**Response:** `application/pdf` binary

### POST /api/preview
PDF önizlemesi oluşturur (base64).

**Response:**
```json
{
  "pdf": "base64-encoded-pdf-data"
}
```

## 📝 Kullanım

1. **Rapor Başlığı** alanına başlık girin
2. **İçerik Formatı** seçin (Düz Metin veya Zengin Metin)
3. **İçerik** alanına raporunuzu yazın
4. **Önizle** butonuna tıklayın
5. Önizleme başarılı ise **PDF İndir** butonuyla indirin

## 🎨 PDF Çıktısı Özellikleri

- **Başlık**: Ortalanmış, 30px kenar boşluklu
- **İçerik**: Ortalanmış, 50px kenar boşluklu
- **Font**: Inter (Google Fonts)
- **Türkçe Karakterler**: Tam destek (ğ, ş, ı, ü, ö, ç)
- **Şablon**: Antetli PDF üzerine içerik yerleştirilir

## 👨‍💻 Geliştirici

Bu proje Tech Talent Space staj programı değerlendirmesi için geliştirilmiştir.

---

Made with ❤️ for Tech Talent Space

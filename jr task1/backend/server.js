import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { generatePDF } from './services/pdfGenerator.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate PDF endpoint
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { title, content, contentType } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: 'Rapor başlığı ve içeriği zorunludur.'
      });
    }

    console.log(`📄 PDF oluşturuluyor: "${title}"`);
    console.log(`📝 İçerik tipi: ${contentType || 'text'}`);

    const pdfBuffer = await generatePDF({
      title,
      content,
      contentType: contentType || 'text',
      templatePath: path.join(__dirname, 'templates', 'tech.pdf')
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rapor-${Date.now()}.pdf"`);
    res.send(pdfBuffer);

    console.log('✅ PDF başarıyla oluşturuldu');
  } catch (error) {
    console.error('❌ PDF oluşturma hatası:', error);
    res.status(500).json({
      error: 'PDF oluşturulurken bir hata oluştu.',
      details: error.message
    });
  }
});

// Preview endpoint (returns base64)
app.post('/api/preview', async (req, res) => {
  try {
    const { title, content, contentType } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: 'Rapor başlığı ve içeriği zorunludur.'
      });
    }

    const pdfBuffer = await generatePDF({
      title,
      content,
      contentType: contentType || 'text',
      templatePath: path.join(__dirname, 'templates', 'tech.pdf')
    });

    const base64 = pdfBuffer.toString('base64');
    res.json({ pdf: base64 });
  } catch (error) {
    console.error('❌ Önizleme hatası:', error);
    res.status(500).json({
      error: 'Önizleme oluşturulurken bir hata oluştu.',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`
  🚀 Report Generator Backend
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📍 Port: ${PORT}
  🌐 URL: http://localhost:${PORT}
  📄 API: /api/generate-pdf
  👁️  Preview: /api/preview
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

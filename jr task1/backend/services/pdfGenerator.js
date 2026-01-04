import { PDFDocument } from 'pdf-lib';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PDF şablon boyutları ve yazı alanı sınırları
const PAGE_CONFIG = {
    // A4 boyutları (pt cinsinden)
    width: 595.28,
    height: 841.89,
    // Antet alanları - şablona göre ayarlanacak
    headerHeight: 100,  // Üst antet yüksekliği
    footerHeight: 60,   // Alt antet yüksekliği
    // İçerik alanı
    margin: {
        left: 50,
        right: 50,
        top: 120,      // Antetin altından başla
        bottom: 120    // Footer'ın üstünde bitir - artırıldı
    },
    // Yazı ayarları
    fontSize: {
        title: 18,
        body: 11
    },
    lineHeight: 16
};

/**
 * Ana PDF oluşturma fonksiyonu
 * Hem plain text hem HTML için Puppeteer kullanır (Türkçe karakter desteği)
 */
export async function generatePDF({ title, content, contentType, templatePath }) {
    // Şablonu yükle
    const templateBytes = await fs.readFile(templatePath);
    const templateDoc = await PDFDocument.load(templateBytes);

    // Her iki tip için de HTML render kullan (Türkçe karakterler için)
    return await generateWithPuppeteer({ title, content, contentType, templateDoc });
}

/**
 * Puppeteer ile PDF oluşturma (Türkçe karakter destekli)
 */
async function generateWithPuppeteer({ title, content, contentType, templateDoc }) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    });

    try {
        const page = await browser.newPage();

        // Plain text ise HTML'e çevir
        let htmlContent = content;
        if (contentType === 'text') {
            // Satır sonlarını <br> ile değiştir ve escape et
            htmlContent = escapeHtml(content).replace(/\n/g, '<br>');
        }

        // HTML şablonu oluştur (içerik ortalanmış)
        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4;
            margin: 100px 0 120px 0;
        }
        
        body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
            padding: ${PAGE_CONFIG.margin.top}px ${PAGE_CONFIG.margin.right}px ${PAGE_CONFIG.margin.bottom}px ${PAGE_CONFIG.margin.left}px;
            orphans: 3;
            widows: 3;
        }
        
        h1.report-title {
            font-size: 18pt;
            color: #1a365d;
            margin-top: 40px;
            margin-bottom: 24px;
            font-weight: 700;
            text-align: center;
            letter-spacing: -0.02em;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            padding-left: 30px;
            padding-right: 30px;
            page-break-after: avoid;
        }
        
        .content {
            text-align: center;
            line-height: 1.8;
            padding-left: 50px;
            padding-right: 50px;
            padding-bottom: 80px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .content p, .content div {
            margin-bottom: 12px;
            page-break-inside: avoid;
            orphans: 3;
            widows: 3;
        }
        
        .content h1, .content h2, .content h3 {
            margin-top: 20px;
            margin-bottom: 12px;
            text-align: center;
            color: #1a365d;
        }
        
        .content ul, .content ol {
            margin-left: 24px;
            margin-bottom: 12px;
            text-align: left;
            display: inline-block;
        }
        
        .content li {
            margin-bottom: 4px;
        }
        
        .content table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }
        
        .content th, .content td {
            border: 1px solid #e2e8f0;
            padding: 10px 12px;
            text-align: center;
        }
        
        .content th {
            background-color: #f7fafc;
            font-weight: 600;
            color: #1a365d;
        }
        
        .content blockquote {
            border-left: 3px solid #3182ce;
            padding-left: 16px;
            margin: 16px 0;
            color: #4a5568;
            font-style: italic;
        }
        
        .content code {
            background-color: #f7fafc;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <h1 class="report-title">${escapeHtml(title)}</h1>
    <div class="content">${htmlContent}</div>
</body>
</html>
        `;

        await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

        // HTML'i PDF'e çevir
        const contentPdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '120px',
                right: '0',
                bottom: '120px',
                left: '0'
            }
        });

        // İçerik PDF'ini yükle
        const contentPdf = await PDFDocument.load(contentPdfBuffer);
        const finalPdf = await PDFDocument.create();

        // Her sayfa için şablon + içerik birleştir
        for (let i = 0; i < contentPdf.getPageCount(); i++) {
            // Şablonu kopyala
            const [templatePage] = await finalPdf.copyPages(templateDoc, [0]);
            finalPdf.addPage(templatePage);

            // İçerik sayfasını üzerine yerleştir
            const [contentPage] = await finalPdf.copyPages(contentPdf, [i]);
            const embeddedPage = await finalPdf.embedPage(contentPage, {
                left: 0,
                bottom: PAGE_CONFIG.footerHeight,
                right: PAGE_CONFIG.width,
                top: PAGE_CONFIG.height - PAGE_CONFIG.headerHeight
            });

            const currentPage = finalPdf.getPage(i);
            currentPage.drawPage(embeddedPage, {
                x: 0,
                y: PAGE_CONFIG.footerHeight,
                width: PAGE_CONFIG.width,
                height: PAGE_CONFIG.height - PAGE_CONFIG.headerHeight - PAGE_CONFIG.footerHeight
            });
        }

        const pdfBytes = await finalPdf.save();
        return Buffer.from(pdfBytes);

    } finally {
        await browser.close();
    }
}

/**
 * HTML karakterlerini escape et
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

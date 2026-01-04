import { motion } from 'framer-motion';
import { useMemo } from 'react';

function PDFPreview({ pdfData, isLoading }) {
    // Create PDF URL from base64 data
    const pdfUrl = useMemo(() => {
        if (!pdfData) return null;
        return `data:application/pdf;base64,${pdfData}`;
    }, [pdfData]);

    return (
        <div className="glass-card preview-panel">
            <div className="card-header">
                <div className="card-icon">👁️</div>
                <h2>PDF Önizleme</h2>
            </div>

            <div className="preview-frame">
                {isLoading ? (
                    <div className="preview-placeholder">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ fontSize: '48px' }}
                        >
                            ⏳
                        </motion.div>
                        <h3>PDF Oluşturuluyor...</h3>
                        <p>Lütfen bekleyin</p>
                    </div>
                ) : pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        title="PDF Preview"
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    <div className="preview-placeholder">
                        <motion.div
                            className="preview-placeholder-icon"
                            initial={{ scale: 0.8, opacity: 0.3 }}
                            animate={{ scale: 1, opacity: 0.5 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: 'reverse'
                            }}
                        >
                            📄
                        </motion.div>
                        <h3>Henüz PDF Oluşturulmadı</h3>
                        <p>Formu doldurup "Önizle" butonuna tıklayın</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PDFPreview;

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReportForm from './components/ReportForm';
import PDFPreview from './components/PDFPreview';
import Toast from './components/Toast';

function App() {
    const [pdfData, setPdfData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    }, []);

    const handleGeneratePDF = async (formData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'PDF oluşturulamadı');
            }

            const data = await response.json();
            setPdfData(data.pdf);
            showToast('PDF başarıyla oluşturuldu! 🎉', 'success');
        } catch (error) {
            console.error('PDF oluşturma hatası:', error);
            showToast(error.message || 'Bir hata oluştu', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (formData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'PDF indirilemedi');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rapor-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showToast('PDF indirildi! 📥', 'success');
        } catch (error) {
            console.error('İndirme hatası:', error);
            showToast(error.message || 'İndirme başarısız', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app">
            {/* Animated Background Orbs */}
            <div className="floating-orb orb-1" />
            <div className="floating-orb orb-2" />

            {/* Header */}
            <motion.header
                className="header"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="logo">
                    <div className="logo-icon">📄</div>
                </div>
                <h1>Rapor Oluşturucu</h1>
                <p>Profesyonel PDF raporlarınızı kolayca oluşturun</p>
            </motion.header>

            {/* Main Content */}
            <div className="main-container">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <ReportForm
                        onSubmit={handleGeneratePDF}
                        onDownload={handleDownload}
                        isLoading={isLoading}
                        hasPdf={!!pdfData}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <PDFPreview pdfData={pdfData} isLoading={isLoading} />
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>
                    Made with ❤️ for{' '}
                    <a href="https://techtalentspace.com" target="_blank" rel="noopener noreferrer">
                        Tech Talent Space
                    </a>
                </p>
            </footer>

            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;

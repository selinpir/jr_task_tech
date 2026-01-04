import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Editor from './Editor';

function ReportForm({ onSubmit, onDownload, isLoading, hasPdf }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [contentType, setContentType] = useState('text');
    const formDataRef = useRef({ title: '', content: '', contentType: 'text' });

    // Update ref when values change
    formDataRef.current = { title, content, contentType };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            return;
        }
        onSubmit({ title, content, contentType });
    };

    const handleDownload = () => {
        if (!title.trim() || !content.trim()) {
            return;
        }
        onDownload({ title, content, contentType });
    };

    const handleContentChange = (newContent) => {
        setContent(newContent);
    };

    const isFormValid = title.trim() && content.trim();

    return (
        <div className="glass-card">
            <div className="card-header">
                <div className="card-icon">✏️</div>
                <h2>Rapor Düzenleyici</h2>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className="form-group">
                    <label htmlFor="title">Rapor Başlığı</label>
                    <div className="input-wrapper">
                        <input
                            id="title"
                            type="text"
                            className="form-input"
                            placeholder="Örn: Aylık Satış Raporu"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Content Type Toggle */}
                <div className="form-group">
                    <label>İçerik Formatı</label>
                    <div className="content-type-toggle">
                        <button
                            type="button"
                            className={`toggle-btn ${contentType === 'text' ? 'active' : ''}`}
                            onClick={() => setContentType('text')}
                            disabled={isLoading}
                        >
                            📝 Düz Metin
                        </button>
                        <button
                            type="button"
                            className={`toggle-btn ${contentType === 'html' ? 'active' : ''}`}
                            onClick={() => setContentType('html')}
                            disabled={isLoading}
                        >
                            🎨 Zengin Metin
                        </button>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="form-group">
                    <label>Rapor İçeriği</label>
                    <Editor
                        content={content}
                        onChange={handleContentChange}
                        contentType={contentType}
                        disabled={isLoading}
                    />
                    <div className="char-count">
                        {content.length} karakter
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading || !isFormValid}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner" />
                            Oluşturuluyor...
                        </>
                    ) : (
                        <>
                            👁️ Önizle
                        </>
                    )}
                </motion.button>

                {/* Download Section */}
                {hasPdf && (
                    <motion.div
                        className="download-section"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            type="button"
                            className="download-btn"
                            onClick={handleDownload}
                            disabled={isLoading}
                        >
                            📥 PDF İndir
                        </button>
                    </motion.div>
                )}
            </form>
        </div>
    );
}

export default ReportForm;

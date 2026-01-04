import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';

// Toolbar Button Component
function ToolbarButton({ onClick, isActive, children, title }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`toolbar-btn ${isActive ? 'is-active' : ''}`}
            title={title}
        >
            {children}
        </button>
    );
}

// Rich Text Editor (TipTap)
function RichTextEditor({ content, onChange, disabled }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && !disabled) {
            editor.setEditable(true);
        } else if (editor && disabled) {
            editor.setEditable(false);
        }
    }, [editor, disabled]);

    if (!editor) {
        return <div className="editor-container">Yükleniyor...</div>;
    }

    return (
        <div className="editor-container">
            <div className="editor-toolbar">
                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Kalın"
                >
                    <strong>B</strong>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="İtalik"
                >
                    <em>I</em>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Altı Çizili"
                >
                    <u>U</u>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Üstü Çizili"
                >
                    <s>S</s>
                </ToolbarButton>

                <div className="toolbar-divider" />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Başlık 1"
                >
                    H1
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Başlık 2"
                >
                    H2
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Başlık 3"
                >
                    H3
                </ToolbarButton>

                <div className="toolbar-divider" />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Madde İşareti"
                >
                    •
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numaralı Liste"
                >
                    1.
                </ToolbarButton>

                <div className="toolbar-divider" />

                {/* Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Sola Hizala"
                >
                    ≡
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Ortala"
                >
                    ≡
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Sağa Hizala"
                >
                    ≡
                </ToolbarButton>

                <div className="toolbar-divider" />

                {/* Block Elements */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Alıntı"
                >
                    "
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    title="Kod Bloğu"
                >
                    {'</>'}
                </ToolbarButton>

                <div className="toolbar-divider" />

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Geri Al"
                >
                    ↩
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Yinele"
                >
                    ↪
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} className="editor-content" />
        </div>
    );
}

// Plain Text Editor
function PlainTextEditor({ content, onChange, disabled }) {
    return (
        <div className="editor-container">
            <textarea
                className="plain-text-editor"
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Rapor içeriğinizi buraya yazın..."
                disabled={disabled}
            />
        </div>
    );
}

// Main Editor Component
function Editor({ content, onChange, contentType, disabled }) {
    if (contentType === 'html') {
        return (
            <RichTextEditor
                content={content}
                onChange={onChange}
                disabled={disabled}
            />
        );
    }

    return (
        <PlainTextEditor
            content={content}
            onChange={onChange}
            disabled={disabled}
        />
    );
}

export default Editor;

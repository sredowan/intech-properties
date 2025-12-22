import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Upload URL - using 127.0.0.1 to avoid DNS issues as per previous fixes
const UPLOAD_API = import.meta.env.DEV
    ? 'http://127.0.0.1:3002/api/upload'
    : '/upload.php';

const RichTextEditor = ({ value, onChange }) => {
    const quillRef = useRef(null);

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(UPLOAD_API, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Upload failed');

                const data = await response.json();
                const url = data.url;

                // Insert image at cursor position
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', url);
            } catch (err) {
                console.error('Image upload failed:', err);
                alert('Image upload failed');
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image', 'code-block'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'link', 'image', 'code-block'
    ];

    return (
        <div className="rich-text-editor">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                className="h-64 mb-12" // mb-12 to account for toolbar
            />
            {/* Add some basic styling overrides if needed */}
            <style>{`
                .ql-editor {
                    min-height: 200px;
                    font-size: 16px;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;

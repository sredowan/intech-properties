import React, { useState, useEffect } from 'react';
import { Upload, Loader, Check, XCircle } from 'lucide-react';

// Local upload server URL
// Upload URL selection based on environment
// Development: Use local Node.js server
// Production: Use PHP script on Hostinger
const UPLOAD_API = import.meta.env.DEV
    ? 'http://localhost:3002/api/upload'
    : '/upload.php';

const ImageUpload = ({ onUpload, currentImage, label = "Upload Image" }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null

    // Sync preview when currentImage prop changes (e.g., switching between floor plans)
    useEffect(() => {
        setPreview(currentImage);
        // Reset status when image changes from parent
        if (currentImage) {
            setUploadStatus(null);
        }
    }, [currentImage]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadStatus(null);

        // Preview immediate
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            // Create form data for upload
            const formData = new FormData();
            formData.append('image', file);

            console.log(`[ImageUpload] Uploading to ${import.meta.env.DEV ? 'local node server' : 'production php script'}...`);

            // Upload to local server
            const response = await fetch(UPLOAD_API, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            console.log('[ImageUpload] Upload success:', data.url);

            // Call parent callback with the local URL
            onUpload(data.url);
            setPreview(data.url);
            setUploadStatus('success');
        } catch (err) {
            console.error("[ImageUpload] Upload failed:", err);
            setUploadStatus('error');
            alert('Upload error: ' + err.message);
            // Revert preview to previous image
            setPreview(currentImage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">{label}</label>
            <div className="flex items-center gap-4">
                {preview && (
                    <div className={`w-20 h-20 rounded-lg border-2 overflow-hidden bg-gray-50 flex-shrink-0 ${uploadStatus === 'success' ? 'border-green-500' :
                        uploadStatus === 'error' ? 'border-red-500' : 'border-gray-200'
                        }`}>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <label className="cursor-pointer flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    {uploading ? <Loader className="animate-spin text-primary" size={18} /> :
                        uploadStatus === 'success' ? <Check className="text-green-500" size={18} /> :
                            uploadStatus === 'error' ? <XCircle className="text-red-500" size={18} /> :
                                preview ? <Check className="text-green-500" size={18} /> : <Upload className="text-gray-500" size={18} />}
                    <span className="text-sm font-medium text-gray-700">
                        {uploading ? 'Uploading...' : uploadStatus === 'error' ? 'Retry' : 'Choose File'}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            </div>
            {uploadStatus === 'success' && (
                <p className="text-xs text-green-600">✓ Image uploaded successfully</p>
            )}
            {uploadStatus === 'error' && (
                <p className="text-xs text-red-600">✗ Upload failed. Please try again.</p>
            )}
        </div>
    );
};

export default ImageUpload;

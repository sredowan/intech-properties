import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Serve uploaded images statically
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename and add timestamp
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const uniqueName = `${Date.now()}_${sanitizedName}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
        }
    }
});

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return a relative URL that works with Vite's public folder
    // Vite serves files from /public at the root, so /uploads/file.png maps to /public/uploads/file.png
    const imageUrl = `/uploads/${req.file.filename}`;

    console.log(`[Upload Server] File uploaded: ${req.file.filename}`);
    console.log(`[Upload Server] Relative URL: ${imageUrl}`);

    res.json({
        success: true,
        url: imageUrl,
        filename: req.file.filename
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('[Upload Server] Error:', error.message);
    res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
    console.log(`[Upload Server] Running on http://localhost:${PORT}`);
    console.log(`[Upload Server] Uploads directory: ${uploadsDir}`);
});

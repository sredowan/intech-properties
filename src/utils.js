export const getLocalAsset = (url) => {
    if (!url) return '';
    if (url.startsWith('blob:')) return url;

    // Strip the /__nodejs_public prefix if present (legacy production artifact)
    let cleanedUrl = url.replace('/__nodejs_public', '');

    // If it's an external URL, return as-is
    if (cleanedUrl.startsWith('http') || cleanedUrl.startsWith('https')) return cleanedUrl;

    // If it's an absolute path to src/assets (dev), keep it
    if (cleanedUrl.startsWith('/src') || cleanedUrl.startsWith('/assets')) return cleanedUrl;

    // Handle uploads
    if (cleanedUrl.includes('/uploads/')) {
        // Ensure it starts with /
        const normalizedUrl = cleanedUrl.startsWith('/') ? cleanedUrl : `/${cleanedUrl}`;

        // In development, force load from backend server
        if (import.meta.env.DEV) {
            return `http://localhost:3002${normalizedUrl}`;
        }

        // In production, just return the normalized path
        return normalizedUrl;
    }

    // Fallback for filename only inputs (legacy)
    const filename = cleanedUrl.split('/').pop().split('?')[0];
    return `/assets/images/${filename}`;
};

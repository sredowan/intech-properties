export const getLocalAsset = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('https')) return url;
    if (url.startsWith('blob:')) return url;

    // If it's an absolute path to src/assets (dev), keep it
    if (url.startsWith('/src') || url.startsWith('/assets')) return url;

    // Handle uploads
    if (url.includes('/uploads/')) {
        // If it's already absolute (from new PHP script), return it
        if (url.startsWith('/')) return url;
        // If it's relative?
        return url;
    }

    // Fallback for filename only inputs (legacy)
    const filename = url.split('/').pop().split('?')[0];
    return `/assets/images/${filename}`;
};

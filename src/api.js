
const API_URL = 'http://localhost:3001/api';

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};

export const fetchData = async () => {
    const response = await fetch(`${API_URL}/data`);
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
};

export const saveData = async (data) => {
    const response = await fetch(`${API_URL}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, message: 'Upload failed' };
    }
};

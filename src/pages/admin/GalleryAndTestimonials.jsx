import React, { useState, useEffect } from 'react';
import { getGallery, addGalleryItem, deleteGalleryItem, getProperties, getTestimonials, addTestimonial, deleteTestimonial } from '../../db/queries';
import { Plus, Trash2 } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

// --- Gallery Manager ---
export function GalleryManager() {
    const [images, setImages] = useState([]);
    const [properties, setProperties] = useState([]); // To link images to properties
    const [newItem, setNewItem] = useState({ url: '', caption: '', propertyId: '', date: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Fetch Gallery
            const galleryData = await getGallery();
            setImages(galleryData.map(g => ({
                id: g.id,
                url: g.imageUrl,
                caption: g.category,
                propertyId: '',
                date: ''
            })));

            // Fetch Properties for dropdown
            const propData = await getProperties();
            setProperties(propData);
        } catch (err) {
            console.error("Error loading gallery data:", err);
        }
    };

    const handleAdd = async () => {
        if (!newItem.url) return;
        try {
            const id = await addGalleryItem({
                imageUrl: newItem.url,
                category: newItem.caption,
                order: 0
            });
            setImages([...images, { ...newItem, id }]);
            setNewItem({ url: '', caption: '', propertyId: '', date: '' });
        } catch (err) {
            alert('Failed to add image');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            await deleteGalleryItem(id);
            setImages(images.filter(i => i.id !== id));
        } catch (err) {
            alert('Failed to delete image');
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Gallery & Timeline Manager</h2>
            <div className="mb-6 bg-gray-50 p-6 rounded space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <ImageUpload
                            label="Upload Image"
                            currentImage={newItem.url}
                            onUpload={(url) => setNewItem(prev => ({ ...prev, url }))}
                        />
                    </div>
                    <div className="space-y-4">
                        <input placeholder="Caption / Milestone" className="w-full p-2 border rounded" value={newItem.caption} onChange={e => setNewItem({ ...newItem, caption: e.target.value })} />
                        <input type="date" className="w-full p-2 border rounded" value={newItem.date} onChange={e => setNewItem({ ...newItem, date: e.target.value })} />
                        <select className="w-full p-2 border rounded" value={newItem.propertyId} onChange={e => setNewItem({ ...newItem, propertyId: e.target.value })}>
                            <option value="">General Gallery</option>
                            {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                        <button onClick={handleAdd} className="w-full bg-primary text-white p-2 rounded flex items-center justify-center font-bold"><Plus size={18} className="mr-2" /> Add to Gallery</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map(img => (
                    <div key={img.id} className="relative group border rounded overflow-hidden shadow-sm">
                        <img src={img.url} alt={img.caption} className="h-40 w-full object-cover" />
                        <div className="p-2 bg-white">
                            <p className="font-bold text-sm truncate">{img.caption || 'No Caption'}</p>
                            <p className="text-xs text-gray-500">{img.date} - {properties.find(p => p.id === img.propertyId)?.title || 'General'}</p>
                        </div>
                        <button onClick={() => handleDelete(img.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Testimonials Manager ---
export function TestimonialsManager() {
    const [testimonials, setTestimonials] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', role: '', quote: '', image: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const items = await getTestimonials();
            setTestimonials(items.map(t => ({
                id: t.id,
                name: t.name,
                role: '',
                quote: t.text,
                image: ''
            })));
        } catch (err) {
            console.error("Error loading testimonials:", err);
        }
    };

    const handleAdd = async () => {
        if (!newItem.name || !newItem.quote) return;
        try {
            const id = await addTestimonial({
                name: newItem.name,
                text: newItem.quote
            });
            setTestimonials([...testimonials, { ...newItem, id }]);
            setNewItem({ name: '', role: '', quote: '', image: '' });
        } catch (err) {
            alert('Failed to add testimonial');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this testimonial?')) return;
        try {
            await deleteTestimonial(id);
            setTestimonials(testimonials.filter(t => t.id !== id));
        } catch (err) {
            alert('Failed to delete testimonial');
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow mt-8">
            <h2 className="text-2xl font-bold mb-4">Testimonials Manager</h2>
            <div className="mb-6 bg-gray-50 p-6 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <ImageUpload
                        label="Client Photo (Optional)"
                        currentImage={newItem.image}
                        onUpload={(url) => setNewItem(prev => ({ ...prev, image: url }))}
                    />
                    <div className="space-y-4">
                        <input placeholder="Client Name" className="w-full p-2 border rounded" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                        <input placeholder="Role (e.g. CEO)" className="w-full p-2 border rounded" value={newItem.role} onChange={e => setNewItem({ ...newItem, role: e.target.value })} />
                    </div>
                </div>
                <input placeholder="Quote" className="w-full p-2 border rounded mb-4" value={newItem.quote} onChange={e => setNewItem({ ...newItem, quote: e.target.value })} />
                <button onClick={handleAdd} className="w-full bg-primary text-white p-2 rounded flex items-center justify-center font-bold"><Plus size={18} className="mr-2" /> Add Testimonial</button>
            </div>

            <div className="space-y-4">
                {testimonials.map(t => (
                    <div key={t.id} className="flex items-start gap-4 border p-4 rounded bg-white shadow-sm">
                        {t.image ? (
                            <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover border" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                                {t.name.charAt(0)}
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="font-bold text-lg">{t.name} <span className="text-sm text-gray-500 font-normal">({t.role})</span></p>
                            <p className="text-gray-700 italic">"{t.quote}"</p>
                        </div>
                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

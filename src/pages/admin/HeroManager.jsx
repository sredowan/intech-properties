import React, { useState, useEffect } from 'react';
import { getHeroSlides, saveHeroSlide, deleteHeroSlide } from '../../db/queries';
import { Plus, Trash2, Edit, X, Save, AlertTriangle } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

const HeroManager = () => {
    const [slides, setSlides] = useState([]);
    const [newItem, setNewItem] = useState({
        image: '',
        title: 'Luxury Living Defined',
        subtitle: 'Experience the pinnacle of modern living in Dhaka',
        btn1Text: 'Properties',
        btn1Link: '/properties',
        btn2Text: 'Contact Us',
        btn2Link: '/contact'
    });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Custom Delete Confirmation State
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const items = await getHeroSlides();
            setSlides(items.map(s => ({
                id: s.id,
                image: s.image,
                title: s.title,
                subtitle: s.subtitle,
                btn1Text: s.buttonText || 'Properties',
                btn1Link: s.buttonLink || '/properties',
                btn2Text: 'Contact Us',
                btn2Link: '/contact',
                order: s.order
            })));
        } catch (err) {
            console.error("Error loading slides:", err);
        }
    };

    const handleEdit = (slide) => {
        setNewItem({
            image: slide.image,
            title: slide.title,
            subtitle: slide.subtitle,
            btn1Text: slide.btn1Text,
            btn1Link: slide.btn1Link,
            btn2Text: slide.btn2Text,
            btn2Link: slide.btn2Link
        });
        setEditId(slide.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewItem({
            image: '',
            title: 'Luxury Living Defined',
            subtitle: 'Experience the pinnacle of modern living in Dhaka',
            btn1Text: 'Properties',
            btn1Link: '/properties',
            btn2Text: 'Contact Us',
            btn2Link: '/contact'
        });
        setIsEditing(false);
        setEditId(null);
    };

    const handleSave = async () => {
        if (!newItem.image) {
            alert('Please upload an image');
            return;
        }
        setLoading(true);
        try {
            const slideData = {
                id: isEditing ? editId : undefined,
                image: newItem.image,
                title: newItem.title,
                subtitle: newItem.subtitle,
                buttonText: newItem.btn1Text,
                buttonLink: newItem.btn1Link,
                order: newItem.order || slides.length + 1
            };

            await saveHeroSlide(slideData);
            await loadData();
            handleCancelEdit(); // Reset form
        } catch (err) {
            console.error(err);
            alert('Failed to save slide');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteHeroSlide(deleteId);
            setSlides(slides.filter(t => t.id !== deleteId));
            if (isEditing && editId === deleteId) {
                handleCancelEdit();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete slide');
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow relative">
            <h2 className="text-2xl font-bold mb-4">Hero Slider Manager</h2>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Delete Slide?</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this slide? This action cannot be undone.</p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-blue-50 text-blue-800 p-4 rounded mb-6 text-sm">
                <strong>Recommended Size:</strong> 1920x1080px (16:9 Aspect Ratio) or larger.
                <br />Upload at least 4 slides for best experience.
            </div>

            <div className={`mb-8 p-6 rounded border transition-colors ${isEditing ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{isEditing ? 'Edit Slide' : 'Add New Slide'}</h3>
                    {isEditing && (
                        <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm bg-white border px-3 py-1 rounded">
                            <X size={14} /> Cancel Edit
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <ImageUpload
                            label="Slide Image (Required)"
                            currentImage={newItem.image}
                            onUpload={(url) => setNewItem(prev => ({ ...prev, image: url }))}
                        />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Headline Text</label>
                            <input
                                className="w-full p-2 border rounded"
                                value={newItem.title}
                                onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                placeholder="e.g. Luxury Living Defined"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Description</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={newItem.subtitle}
                                onChange={e => setNewItem({ ...newItem, subtitle: e.target.value })}
                                placeholder="e.g. Experience the pinnacle..."
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Button 1 Text</label>
                                <input
                                    className="w-full p-2 border rounded"
                                    value={newItem.btn1Text}
                                    onChange={e => setNewItem({ ...newItem, btn1Text: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Button 1 Link</label>
                                <input
                                    className="w-full p-2 border rounded"
                                    value={newItem.btn1Link}
                                    onChange={e => setNewItem({ ...newItem, btn1Link: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Button 2 Text</label>
                                <input
                                    className="w-full p-2 border rounded"
                                    value={newItem.btn2Text}
                                    onChange={e => setNewItem({ ...newItem, btn2Text: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Button 2 Link</label>
                                <input
                                    className="w-full p-2 border rounded"
                                    value={newItem.btn2Link}
                                    onChange={e => setNewItem({ ...newItem, btn2Link: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Display Order (optional)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={newItem.order || ''}
                                onChange={e => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })}
                                placeholder="e.g. 1 (First)"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={loading || !newItem.image}
                            className={`w-full text-white p-3 rounded flex items-center justify-center font-bold transition-colors disabled:opacity-50 ${isEditing ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-primary hover:bg-primary/90'}`}
                        >
                            {loading ? 'Saving...' : (isEditing ? <><Save size={18} className="mr-2" /> Update Slide</> : <><Plus size={18} className="mr-2" /> Add Slide</>)}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {slides.map((slide, idx) => (
                    <div key={slide.id} className="border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto bg-gray-100 relative">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover absolute inset-0" />
                            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
                                Slide {idx + 1}
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-center">
                            <h4 className="font-bold text-xl mb-1">{slide.title}</h4>
                            <p className="text-gray-600 mb-4">{slide.subtitle}</p>
                            <div className="flex gap-4 text-sm">
                                <span className="bg-gray-100 px-3 py-1 rounded text-gray-700 border">Btn 1: {slide.btn1Text} ({slide.btn1Link})</span>
                                <span className="bg-gray-100 px-3 py-1 rounded text-gray-700 border">Btn 2: {slide.btn2Text} ({slide.btn2Link})</span>
                            </div>
                        </div>
                        <div className="p-4 border-l bg-gray-50 flex flex-col items-center justify-center gap-2">
                            <button
                                onClick={() => handleEdit(slide)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors"
                                title="Edit"
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                onClick={() => setDeleteId(slide.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                {slides.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                        No slides added yet. Add some slides to display on the homepage.
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroManager;

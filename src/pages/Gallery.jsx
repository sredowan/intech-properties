import React, { useState, useEffect } from 'react';
import { getGallery, getProperties } from '../db/queries';
import { getLocalAsset } from '../utils';

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [properties, setProperties] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Gallery Items
                const galleryData = await getGallery();
                setGallery(galleryData.map(g => ({
                    id: g.id,
                    url: g.imageUrl,
                    image: g.imageUrl,
                    caption: g.category,
                    propertyId: '',
                    date: ''
                })));

                // Fetch Properties (for filtering titles)
                const propData = await getProperties();
                setProperties(propData);
            } catch (err) {
                console.error("Error fetching gallery data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Unique property titles from gallery items for filter
    const propertyTitles = [...new Set(gallery.map(item => {
        const prop = properties.find(p => p.id === item.propertyId);
        return prop ? prop.title : 'General';
    }))];

    const filters = ['All', 'General', ...propertyTitles.filter(t => t !== 'General')];

    const filteredGallery = filter === 'All'
        ? gallery
        : gallery.filter(item => {
            const prop = properties.find(p => p.id === item.propertyId);
            const title = prop ? prop.title : 'General';
            return title === filter;
        });

    if (loading) return <div className="py-40 text-center font-bold text-primary">Loading Gallery...</div>;

    return (
        <div className="gallery-page pt-16 pb-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-7xl font-black text-[#001253] mb-8 text-center">Project Gallery</h1>

                {/* Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${filter === f
                                ? 'bg-[#E30613] text-white shadow-lg scale-105'
                                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-[#001253]'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="columns-1 md:columns-3 gap-8 space-y-8">
                    {filteredGallery.map((item, idx) => (
                        <div key={idx} className="break-inside-avoid rounded-2xl overflow-hidden shadow-lg group relative bg-white">
                            <img
                                src={getLocalAsset(item.image)}
                                alt={item.caption}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                <p className="text-white font-bold text-lg">{item.caption}</p>
                                <p className="text-white/70 text-xs uppercase tracking-widest mt-1">
                                    {new Date(item.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredGallery.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No images found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;

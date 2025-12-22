import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLocalAsset } from '../utils';

const PropertiesSection = ({ properties }) => {
    const [filter, setFilter] = useState('ongoing');

    const filtered = properties.filter(p => {
        // Check filtering based on status field (case-insensitive)
        const status = (p.status || p.meta?.status || '').toLowerCase();
        return status === filter;
    });

    return (
        <section id="properties" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-12 text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <h4 className="text-lg font-bold text-gray-800 mb-2">Looking For The</h4>
                        <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
                            Luxurious Property for Sale in Dhaka
                        </h2>

                        {/* Divider */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2">
                                <span className="h-[1px] w-12 bg-gray-300"></span>
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                <span className="h-[1px] w-12 bg-gray-300"></span>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            Find your dream property from our featured luxury properties built at prime locations in Dhaka. From this list of ongoing, upcoming and completed properties (flat / apartments), choose the one that best resonates with your heart.
                        </p>
                    </motion.div>

                    {/* Toggle Buttons */}
                    <div className="flex bg-gray-50 rounded-full p-1.5 shadow-sm border border-gray-100 gap-2">
                        {['ongoing', 'completed', 'upcoming'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`relative px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors z-10 ${filter === t ? 'text-white' : 'text-primary hover:bg-gray-100'
                                    }`}
                            >
                                {filter === t && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-secondary rounded-full -z-10 shadow-sm"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
                <motion.div
                    layout
                    className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-8"
                >
                    <AnimatePresence mode='popLayout'>
                        {filtered.slice(0, 8).map((prop) => (
                            <motion.div
                                layout
                                key={prop.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="relative bg-white group rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
                            >
                                {/* Image Container - 3:4 Aspect Ratio (Standard Portrait) */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                    <img
                                        src={getLocalAsset(prop.images?.[0] || prop.featured_image)}
                                        alt={prop.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />

                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest shadow-sm ${filter === 'ongoing' ? 'bg-red-600 text-white' : 'bg-primary text-white'
                                            }`}>
                                            {filter === 'ongoing' ? 'Ongoing' : filter}
                                        </span>
                                    </div>

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                                </div>

                                {/* Content - Centered & Compact */}
                                <div className="p-4 flex-1 flex flex-col items-center text-center">
                                    <h3 className="text-sm font-bold text-[#0D47A1] mb-2 leading-tight group-hover:text-secondary transition-colors">
                                        {prop.title}
                                    </h3>

                                    <div className="flex items-center justify-center gap-1.5 text-gray-500 text-[10px] uppercase tracking-wide w-full">
                                        <MapPin size={12} className="shrink-0 text-secondary" />
                                        <span className="truncate max-w-[180px]">
                                            {(() => {
                                                // Simplified Location Logic
                                                if (prop.address_road && prop.address_area) {
                                                    return `${prop.address_road}, ${prop.address_area}`;
                                                }
                                                return prop.location || 'Dhaka, Bangladesh';
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                {/* Full Card Link */}
                                <Link to={`/projects/${prop.slug}`} className="absolute inset-0 z-20" aria-label={`View project ${prop.title}`} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && (
                    <div className="text-center py-24 w-full text-gray-400 italic">No properties found in this category.</div>
                )}

                {/* View All Properties Button */}
                {filtered.length > 0 && (
                    <div className="flex justify-center mt-12">
                        <Link
                            to="/properties"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-secondary text-white rounded-full font-bold uppercase text-sm tracking-wider hover:bg-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            View All Properties
                            <svg
                                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PropertiesSection;

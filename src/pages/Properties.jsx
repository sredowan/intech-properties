import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bed, Bath, Ruler, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getProperties } from '../db/queries';
import { getLocalAsset } from '../utils';

const Properties = () => {
    const { status: paramStatus } = useParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (paramStatus) {
            const statusValue = paramStatus.replace(/-/g, ' ');
            setFilters(prev => ({ ...prev, status: statusValue }));
        } else {
            setFilters(prev => ({ ...prev, status: '' }));
        }
    }, [paramStatus]);

    const getPageTitle = () => {
        if (!paramStatus) return "Find Your Dream Property";
        const status = paramStatus.toLowerCase();
        if (status.includes('ongoing')) return "Our Ongoing Projects";
        if (status.includes('upcoming')) return "Our Upcoming Projects";
        if (status.includes('completed')) return "Our Completed Projects";
        return "Find Your Dream Property";
    };

    // Filter states
    const [filters, setFilters] = useState({
        location: '',
        bedrooms: '',
        bathrooms: '',
        status: '',
        floorSize: [0, 10000]
    });

    // Derived data for filter options
    const [filterOptions, setFilterOptions] = useState({
        locations: [],
        minFloorSize: 0,
        maxFloorSize: 10000
    });

    // Fetch properties from Neon
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const props = await getProperties();
                setProperties(props);

                // Extract unique locations and floor size range
                const locations = [...new Set(props.map(p => p.address_area).filter(Boolean))];
                const sizes = props
                    .map(p => p.floor_size || p.meta?.floor_size || 0)
                    .filter(s => s > 0);

                const minSize = sizes.length > 0 ? Math.min(...sizes) : 0;
                const maxSize = sizes.length > 0 ? Math.max(...sizes) : 10000;

                setFilterOptions({
                    locations: locations.sort(),
                    minFloorSize: minSize,
                    maxFloorSize: maxSize
                });

                setFilters(prev => ({
                    ...prev,
                    floorSize: [minSize, maxSize]
                }));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching properties:', error);
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Filter properties
    const filteredProperties = properties.filter(prop => {
        const matchesLocation = !filters.location || prop.address_area === filters.location;
        const matchesBedrooms = !filters.bedrooms || (prop.bedrooms || prop.meta?.bedrooms) >= parseInt(filters.bedrooms);
        const matchesBathrooms = !filters.bathrooms || (prop.bathrooms || prop.meta?.bathrooms) >= parseInt(filters.bathrooms);
        const matchesStatus = !filters.status || (prop.status || prop.meta?.status || '').toLowerCase() === filters.status.toLowerCase();

        const propFloorSize = prop.floor_size || prop.meta?.floor_size || 0;
        const matchesFloorSize = propFloorSize >= filters.floorSize[0] && propFloorSize <= filters.floorSize[1];

        return matchesLocation && matchesBedrooms && matchesBathrooms && matchesStatus && matchesFloorSize;
    });

    const clearFilters = () => {
        setFilters({
            location: '',
            bedrooms: '',
            bathrooms: '',
            status: '',
            floorSize: [filterOptions.minFloorSize, filterOptions.maxFloorSize]
        });
    };

    const activeFilterCount = Object.values(filters).filter(v => {
        if (Array.isArray(v)) return v[0] !== filterOptions.minFloorSize || v[1] !== filterOptions.maxFloorSize;
        return v !== '';
    }).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-primary to-primary/90 text-white pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{getPageTitle()}</h1>
                        <p className="text-lg text-white/90 max-w-2xl mx-auto">
                            Explore our exclusive collection of luxury properties in prime locations across Dhaka
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Sticky Filter Bar */}
            <div className="sticky top-0 z-40 bg-white shadow-md">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Mobile Filter Toggle - Removed */}
                        <div className="md:hidden"></div>

                        {/* Desktop Filters - Horizontal Layout */}
                        <div className="hidden md:flex items-center gap-3 flex-wrap flex-1">
                            {/* Location Filter */}
                            <div className="relative">
                                <select
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-secondary focus:border-transparent transition-all cursor-pointer hover:border-secondary"
                                >
                                    <option value="">All Locations</option>
                                    {filterOptions.locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Bedrooms Filter */}
                            <div className="relative">
                                <select
                                    value={filters.bedrooms}
                                    onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-secondary focus:border-transparent transition-all cursor-pointer hover:border-secondary"
                                >
                                    <option value="">Bedrooms</option>
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num}+ Beds</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Bathrooms Filter */}
                            <div className="relative">
                                <select
                                    value={filters.bathrooms}
                                    onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-secondary focus:border-transparent transition-all cursor-pointer hover:border-secondary"
                                >
                                    <option value="">Bathrooms</option>
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <option key={num} value={num}>{num}+ Baths</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-secondary focus:border-transparent transition-all cursor-pointer hover:border-secondary"
                                >
                                    <option value="">All Status</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="semi ready">Semi Ready</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Results Count & Clear */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 font-medium hidden md:block">
                                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                            </span>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                                >
                                    <X size={14} />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Filter Panel - Horizontal Scroll */}
                    <div className="md:hidden mt-4 overflow-x-auto pb-2 -mx-6 px-6 flex items-center gap-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <select
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            className="flex-shrink-0 appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-full bg-white text-sm whitespace-nowrap focus:ring-2 focus:ring-secondary focus:border-transparent"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                        >
                            <option value="">Location</option>
                            {filterOptions.locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>

                        <select
                            value={filters.bedrooms}
                            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                            className="flex-shrink-0 appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-full bg-white text-sm whitespace-nowrap focus:ring-2 focus:ring-secondary focus:border-transparent"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                        >
                            <option value="">Bedrooms</option>
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num}+ Beds</option>
                            ))}
                        </select>

                        <select
                            value={filters.bathrooms}
                            onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                            className="flex-shrink-0 appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-full bg-white text-sm whitespace-nowrap focus:ring-2 focus:ring-secondary focus:border-transparent"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                        >
                            <option value="">Bathrooms</option>
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}+ Baths</option>
                            ))}
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="flex-shrink-0 appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-full bg-white text-sm whitespace-nowrap focus:ring-2 focus:ring-secondary focus:border-transparent"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                        >
                            <option value="">Status</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="semi ready">Semi Ready</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Properties Grid */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-24">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-gray-400 text-lg">No properties match your filters.</p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-secondary font-semibold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProperties.map((prop) => (
                                    <motion.div
                                        layout
                                        key={prop.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white group rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
                                    >
                                        {/* Image Container - 3:4 Aspect Ratio */}
                                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                            <img
                                                src={getLocalAsset(prop.featured_image)}
                                                alt={prop.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                            />

                                            {/* Status Badge */}
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest shadow-sm ${(prop.status || '').toLowerCase() === 'ongoing' ? 'bg-red-600 text-white' :
                                                    (prop.status || '').toLowerCase() === 'semi ready' ? 'bg-yellow-600 text-white' :
                                                        'bg-primary text-white'
                                                    }`}>
                                                    {prop.status || 'Available'}
                                                </span>
                                            </div>

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="text-sm font-bold text-primary mb-2 leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                                                {prop.title}
                                            </h3>

                                            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase tracking-wide mb-3">
                                                <MapPin size={12} className="shrink-0 text-secondary" />
                                                <span className="truncate">
                                                    {prop.address_road && prop.address_area
                                                        ? `${prop.address_road}, ${prop.address_area}`
                                                        : prop.location || 'Dhaka'}
                                                </span>
                                            </div>

                                            {/* Property Stats */}
                                            <div className="flex items-center gap-3 text-xs text-gray-600 mt-auto pt-3 border-t border-gray-100">
                                                {(prop.bedrooms || prop.meta?.bedrooms) && (
                                                    <div className="flex items-center gap-1">
                                                        <Bed size={14} className="text-secondary" />
                                                        <span>{prop.bedrooms || prop.meta?.bedrooms}</span>
                                                    </div>
                                                )}
                                                {(prop.bathrooms || prop.meta?.bathrooms) && (
                                                    <div className="flex items-center gap-1">
                                                        <Bath size={14} className="text-secondary" />
                                                        <span>{prop.bathrooms || prop.meta?.bathrooms}</span>
                                                    </div>
                                                )}
                                                {(prop.floor_size || prop.meta?.floor_size) && (
                                                    <div className="flex items-center gap-1">
                                                        <Ruler size={14} className="text-secondary" />
                                                        <span>{prop.floor_size || prop.meta?.floor_size}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Full Card Link */}
                                        <Link to={`/projects/${prop.slug}`} className="absolute inset-0 z-20" aria-label={`View project ${prop.title}`} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Properties;

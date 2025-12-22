import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { getSettings } from '../db/queries';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [branding, setBranding] = useState({ name: 'Intech Properties', logo_url: '', phone: ['01958600068'] });
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const fetchBranding = async () => {
            try {
                const data = await getSettings('site_branding');
                if (data) {
                    setBranding(prev => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.error("Error fetching branding:", err);
            }
        };
        fetchBranding();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToProjects = (filter) => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-2 px-6 md:px-12 flex items-center justify-between
            ${isScrolled || !isHome ? 'bg-white shadow-lg h-20' : 'bg-transparent text-white h-24'}`}
        >
            <Link to="/" className="flex items-center gap-2 h-full">
                {branding.logo_url ? (
                    <div className="h-full py-1 w-auto flex items-center">
                        <img src={branding.logo_url} alt={branding.name} className="h-full w-auto object-contain max-h-[70px]" />
                    </div>
                ) : (
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded flex items-center justify-center font-bold text-xl md:text-2xl
                        ${isScrolled || !isHome ? 'bg-primary text-white' : 'bg-white text-primary'}`}>I</div>
                )}
            </Link>

            {/* Desktop Nav */}
            <nav className={`hidden md:flex items-center gap-8 font-semibold ${isScrolled || !isHome ? 'text-[#001253]' : 'text-white'}`}>
                <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
                <Link to="/about" className="hover:text-secondary transition-colors">About</Link>

                <div className="group relative h-full flex items-center">
                    <Link to="/properties" className="hover:text-secondary transition-colors flex items-center gap-1 py-4">
                        Properties
                        <ChevronDown size={16} />
                    </Link>
                    <div className="absolute top-full left-0 w-48 bg-white text-gray-800 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 border-t-4 border-secondary">
                        <Link to="/properties/ongoing" className="block px-4 py-2 hover:bg-gray-100">Ongoing</Link>
                        <Link to="/properties/completed" className="block px-4 py-2 hover:bg-gray-100">Completed</Link>
                        <Link to="/properties/upcoming" className="block px-4 py-2 hover:bg-gray-100">Upcoming</Link>
                    </div>
                </div>

                <Link to="/gallery" className="hover:text-secondary transition-colors">Gallery</Link>
                <Link to="/landowners" className="text-secondary bg-white border border-gray-100 px-3 py-1 rounded-sm hover:bg-gray-50 transition-colors uppercase text-sm font-bold">Landowners</Link>
                <Link to="/blog" className="hover:text-secondary transition-colors">News</Link>
                <Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
                <a href={`tel:${branding.phone?.[0] || '01958600068'}`} className="bg-secondary text-white px-6 py-2 rounded-full font-bold text-sm uppercase hover:bg-red-700 transition-all shadow-md transform hover:scale-105 active:scale-95 flex items-center gap-2">
                    <Phone size={16} /> Call Now
                </a>
            </div>

            {/* Mobile Toggle */}
            <button
                className={`md:hidden ${isScrolled || !isHome ? 'text-[#001253]' : 'text-white'}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl py-6 border-t border-gray-100">
                    <nav className="flex flex-col space-y-4 px-6">
                        <Link to="/" className="text-gray-800 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/about" className="text-gray-800 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                        <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                            <Link to="/properties" className="block text-gray-500 text-xs font-bold uppercase hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Properties</Link>
                            <Link to="/properties/ongoing" className="block text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Ongoing</Link>
                            <Link to="/properties/completed" className="block text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Completed</Link>
                            <Link to="/properties/upcoming" className="block text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Upcoming</Link>
                        </div>
                        <Link to="/gallery" className="text-gray-800 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
                        <Link to="/landowners" className="text-secondary font-bold" onClick={() => setIsMobileMenuOpen(false)}>Join Venture</Link>
                        <Link to="/blog" className="text-gray-800 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>News</Link>
                        <Link to="/contact" className="text-gray-800 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                        <a href={`tel:${branding.phone?.[0] || '01958600068'}`} className="btn btn-primary w-full justify-center mt-4">Call Now</a>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;

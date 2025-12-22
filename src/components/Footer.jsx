import React, { useState, useEffect } from 'react';
import { getSettings } from '../db/queries';
import { Facebook, Linkedin, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import rehabLogo from '../assets/images/members/rehab.png';
import rajukLogo from '../assets/images/members/rajuk.png';
import fbcciLogo from '../assets/images/members/fbcci.png';
import dbcciLogo from '../assets/images/members/dbcci.png';

export const ContactSection = () => (
    <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
            <div className="bg-secondary rounded-3xl p-12 md:p-20 text-white relative">
                <div className="md:w-2/3 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Looking to build your dream project?</h2>
                    <p className="text-xl opacity-90 mb-12 max-w-xl">
                        We are here to help you turn your vision into reality. Speak to our experts today for a consultation.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/contact" className="bg-white text-secondary hover:bg-gray-100 transition-colors px-10 py-5 font-black rounded uppercase text-sm tracking-widest inline-block">Request a Call</Link>
                        <Link to="/#properties" className="bg-transparent border-2 border-white hover:bg-white hover:text-secondary transition-colors px-10 py-5 font-black rounded uppercase text-sm tracking-widest inline-block">View Portfolio</Link>
                    </div>
                </div>
                <div className="absolute top-1/2 -right-20 transform -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
                    {/* Placeholder or Logo */}
                    <div className="text-[400px] font-black leading-none">I</div>
                </div>
            </div>
        </div>
    </section>
);

export const Footer = () => {
    const [branding, setBranding] = useState({
        name: 'Intech Properties',
        logo_url: '',
        phone: ['+880 2 1234567'],
        email: 'info@intechproperties.com',
        address: 'House 12, Road 45, Gulshan 2, Dhaka',
        social: {}
    });

    useEffect(() => {
        const fetchBranding = async () => {
            try {
                const data = await getSettings('site_branding');
                if (data) {
                    setBranding(prev => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.error("Error fetching footer branding:", err);
            }
        };
        fetchBranding();
    }, []);

    const social = branding.social || {};
    const address = branding.address;
    const phone = branding.phone || [];
    const email = branding.email;

    return (
        <footer className="pt-24 pb-12 bg-primary text-white border-t border-white/5">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-4 gap-12 mb-20">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            {branding.logo_url ? (
                                <div className="h-20 md:h-24 w-auto bg-white rounded overflow-hidden flex items-center justify-center px-4">
                                    <img src={branding.logo_url} alt={branding.name} className="h-full w-auto object-contain" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded flex items-center justify-center font-bold text-primary text-4xl">I</div>
                            )}
                        </div>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-sm">
                            Built on a foundation of trust and integrity, Intech Properties Ltd is a leading real estate developer dedicated to creating exceptional living and commercial spaces.
                        </p>
                        <div className="flex gap-4">
                            {social.facebook && <a href={social.facebook} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><Facebook size={18} /></a>}
                            {social.linkedin && <a href={social.linkedin} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><Linkedin size={18} /></a>}
                            {social.instagram && <a href={social.instagram} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><Instagram size={18} /></a>}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-secondary">Quick Links</h4>
                        <ul className="space-y-4 text-white/70 text-sm">
                            <li><Link to="/#properties" className="hover:text-white transition-colors">Our Projects</Link></li>
                            <li><Link to="/landowners" className="hover:text-white transition-colors">Join Venture</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">News & Events</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-secondary">Properties</h4>
                        <ul className="space-y-4 text-white/70 text-sm">
                            <li><Link to="/#ongoing" className="hover:text-white transition-colors">Ongoing Projects</Link></li>
                            <li><Link to="/#completed" className="hover:text-white transition-colors">Completed Projects</Link></li>
                            <li><Link to="/#upcoming" className="hover:text-white transition-colors">Upcoming Projects</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-secondary">Contact</h4>
                        <ul className="space-y-6 text-white/70 text-sm">
                            <li className="flex gap-4">
                                <MapPin size={20} className="text-white font-bold shrink-0" />
                                <span>{address}</span>
                            </li>
                            <li className="flex gap-4">
                                <Phone size={20} className="text-white font-bold shrink-0" />
                                <span>{phone[0]}<br />{phone[1]}</span>
                            </li>
                            <li className="flex gap-4">
                                <Mail size={20} className="text-white font-bold shrink-0" />
                                <span>{email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                    <div className="text-white/40 text-xs uppercase tracking-widest text-center md:text-left">
                        &copy; {new Date().getFullYear()} {branding.name}. All Rights Reserved.
                    </div>

                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        <img src={rehabLogo} alt="REHAB Member" className="h-8 md:h-10 w-auto object-contain bg-white rounded-sm p-1" />
                        <img src={rajukLogo} alt="RAJUK Enlisted" className="h-8 md:h-10 w-auto object-contain bg-white rounded-sm p-1" />
                        <img src={fbcciLogo} alt="FBCCI Member" className="h-8 md:h-10 w-auto object-contain bg-white rounded-sm p-1" />
                        <img src={dbcciLogo} alt="DBCCI Member" className="h-8 md:h-10 w-auto object-contain bg-white rounded-sm p-1" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

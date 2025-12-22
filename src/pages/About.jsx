import React, { useState, useEffect } from 'react';
import { getSettings } from '../db/queries';
import { Target, Flag, History, Award, Quote, Building2, Users } from 'lucide-react';
import { getLocalAsset } from '../utils';

const About = () => {
    const [branding, setBranding] = useState({});

    useEffect(() => {
        const fetchBranding = async () => {
            try {
                const data = await getSettings('site_branding');
                if (data) {
                    setBranding(data);
                }
            } catch (err) {
                console.error("Error fetching branding:", err);
            }
        };
        fetchBranding();
    }, []);

    return (
        <div className="about-page bg-white pt-16 pb-24">

            {/* Header / Hero */}
            <div className="bg-[#0D47A1] text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 pattern-grid-lg"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">Who We Are</h1>
                    <p className="text-xl md:text-2xl text-blue-200 font-light max-w-2xl mx-auto">
                        Building dreams into reality since establishment.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-12 mb-24">
                    <div className="bg-gray-50 p-10 rounded-3xl border-l-8 border-[#0D47A1] shadow-sm hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0D47A1] mb-6">
                            <Target size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#0D47A1] mb-6">Our Vision</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            To be the most trusted and innovative real estate developer in Bangladesh, setting new benchmarks for quality living, architectural excellence, and customer satisfaction. We aim to reshape the skyline while preserving the environment and community values.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-10 rounded-3xl border-l-8 border-[#E30613] shadow-sm hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-[#E30613] mb-6">
                            <Flag size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#E30613] mb-6">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            To deliver superior residential and commercial properties that offer value, security, and modern lifestyle amenities. We are committed to transparency, timely handover, and sustainable construction practices that ensure a better future for our clients and landowners.
                        </p>
                    </div>
                </div>

                {/* History Section */}
                <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1577495508048-b635879837f4?q=80&w=1974&auto=format&fit=crop"
                            alt="Building History"
                            className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest mb-4">
                            <History size={20} /> Our Journey
                        </div>
                        <h2 className="text-4xl font-black text-[#0D47A1] mb-6">A Legacy of Excellence</h2>
                        <div className="prose text-gray-600 text-lg leading-relaxed">
                            <p className="mb-4">
                                Established with a vision to redefine urban living, <strong>iNTECH Properties Ltd.</strong> began its journey with a simple promise: quality without compromise. Over the years, we have grown from a humble beginning to one of the most respected names in the real estate sector.
                            </p>
                            <p className="mb-4">
                                Our path has been paved with numerous successful projects, satisfied homeowners, and happy landowners. We pride ourselves on having navigated market challenges while maintaining our core values of integrity and innovation.
                            </p>
                            <p>
                                Today, iNTECH stands as a symbol of trust, with a rapidly expanding portfolio of premium residential and commercial projects across prime locations in Dhaka.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Director Profile */}
                <div className="bg-[#001253] rounded-[3rem] p-10 md:p-16 text-white mb-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#E30613] rounded-full blur-[100px] opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/3 text-center">
                            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-white/10 shadow-2xl mb-6">
                                <img
                                    src="/assets/md_profile.jpg"
                                    alt="M Fakhrul Islam"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-2xl font-bold">M Fakhrul Islam</h3>
                            <p className="text-[#E30613] font-bold uppercase tracking-widest text-sm">Managing Director</p>
                        </div>
                        <div className="md:w-2/3">
                            <Quote size={48} className="text-white/20 mb-6" />
                            <h2 className="text-3xl font-bold mb-6 italic leading-normal">
                                "Our business is not just about concrete and steel; it's about building trust and framing dreams. At iNTECH, we treat every project as if we were building it for our own families."
                            </h2>
                            <p className="text-blue-200 text-lg md:pr-12 leading-relaxed">
                                Under his visionary leadership, iNTECH Properties Ltd. has consistently delivered on its promises. His commitment to ethical business practices and passion for architectural innovation has been the driving force behind the company's sustained growth and reputation in the sector.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Commitments & Memberships */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#0D47A1] mb-12">Our Affiliations & Commitments</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'REHAB Member', icon: <Building2 size={32} />, desc: 'Real Estate & Housing Association of Bangladesh' },
                            { name: 'RAJUK Enlisted', icon: <Flag size={32} />, desc: 'Follows all BNBC Codes' },
                            { name: 'Member FBCCI', icon: <Award size={32} />, desc: 'Fed. of Bangladesh Chambers of Commerce' },
                            { name: 'Member DBCCI', icon: <Users size={32} />, desc: 'Dhaka Chamber of Commerce & Industry' }
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 bg-white border border-gray-100 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-[#0D47A1] mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;

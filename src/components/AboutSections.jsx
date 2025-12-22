import React from 'react';
import { motion } from 'framer-motion';
import { Target, Shield, Zap, Users } from 'lucide-react';

export const AboutSection = () => (
    <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="md:w-1/2 relative"
                >
                    <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src="/assets/images/gallery-7.jpg"
                            alt="About iNTECH"
                            className="w-full transform hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="absolute -bottom-10 -right-10 bg-[#001253] text-white p-10 rounded-tl-3xl rounded-br-3xl z-20 hidden md:block shadow-xl">
                        <div className="text-5xl font-black mb-2 text-[#E30613]">16+</div>
                        <div className="text-xs uppercase tracking-[0.2em] opacity-80 font-bold">Years of Trust</div>
                    </div>
                    {/* Decorative Pattern */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#E30613]/5 rounded-full blur-3xl -z-10"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="md:w-1/2"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[2px] w-12 bg-[#E30613]"></div>
                        <h3 className="text-[#E30613] font-black uppercase tracking-[0.2em] text-sm">Since 2010</h3>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black mb-8 text-[#001253] leading-tight">
                        Building Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E30613] to-orange-600">Dreams Into Reality</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-10 leading-relaxed font-light">
                        Survival requires food, clothing and shelter. iNTECH PROPERTIES LTD continues to make every effort to meet the housing and commercial needs of all classes of people with <strong className="text-[#001253]">uncompromising quality</strong> and <strong className="text-[#001253]">innovative design</strong>.
                    </p>

                    <div className="grid grid-cols-2 gap-10 mb-12 border-t border-gray-100 pt-10">
                        <div>
                            <h4 className="font-black text-[#001253] text-4xl mb-2">300+</h4>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Handover Flats</p>
                        </div>
                        <div>
                            <h4 className="font-black text-[#001253] text-4xl mb-2">200+</h4>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Happy Clients</p>
                        </div>
                    </div>

                    <button className="btn btn-primary px-10 py-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        Discover Our Story
                    </button>
                </motion.div>
            </div>
        </div>
    </section>
);

export const WhyChooseUs = () => {
    const items = [
        { icon: <Shield size={32} />, title: "Trusted Legacy", text: "Over two decades of unblemished reputation in the real estate industry." },
        { icon: <Zap size={32} />, title: "Modern Design", text: "Combining luxury aesthetics with functional, sustainable architecture." },
        { icon: <Target size={32} />, title: "Prime Locations", text: "Strategically selected lands in the most growing hubs of Dhaka." },
        { icon: <Users size={32} />, title: "Expert Engineering", text: "A dedicated team of veteran architects and engineers on every project." }
    ];

    return (
        <section className="py-32 bg-[#001253] text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E30613]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-title text-white border-[#E30613]"
                    >
                        Why Choose iNTECH?
                    </motion.h2>
                    <p className="text-gray-400 max-w-xl mx-auto">We don't just build buildings; we create sustainable communities related to nature and modern living.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 p-10 rounded-3xl group hover:bg-white transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                        >
                            <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-[#E30613] group-hover:scale-110 transition-all duration-500">
                                {item.icon}
                            </div>
                            <h4 className="text-white text-xl font-bold mb-4 group-hover:text-[#001253] transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-600 transition-colors">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

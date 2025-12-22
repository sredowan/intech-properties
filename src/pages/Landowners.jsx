
import React from 'react';
import { Shield, Clock, Award, CheckCircle, ArrowRight, Building } from 'lucide-react';

const Landowners = () => {
    return (
        <div className="landowners-page bg-gray-50 min-h-screen pt-16 pb-24">
            {/* Hero Section */}
            <section className="relative bg-[#001253] text-white py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="container mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Build Your Legacy With Us</h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 font-light">
                        Transform your land into a landmark. Join hands with iNTECH Properties for a partnership built on trust, quality, and timely delivery.
                    </p>
                    <a href="#partner-form" className="inline-flex items-center gap-2 bg-[#E30613] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg">
                        Start the Conversation <ArrowRight />
                    </a>
                </div>
            </section>

            {/* Why Partner With Us */}
            <section className="py-20 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0D47A1] mb-4">Why Landowners Choose iNTECH</h2>
                    <div className="w-24 h-1 bg-[#E30613] mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* On Time Handover */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-[#E30613] group hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[#E30613] mb-6 group-hover:bg-[#E30613] group-hover:text-white transition-colors">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">On-Time Handover</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We value your time. Our strict project management ensures that your property is delivered exactly when promised, without excuses.
                        </p>
                    </div>

                    {/* Quality Build */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-[#0D47A1] group hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0D47A1] mb-6 group-hover:bg-[#0D47A1] group-hover:text-white transition-colors">
                            <Award size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Uncompromised Quality</h3>
                        <p className="text-gray-600 leading-relaxed">
                            From foundation to finishing, we use only premium materials and modern engineering practices to ensure your building stands the test of time.
                        </p>
                    </div>

                    {/* Transparent Dealings */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-[#E30613] group hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[#E30613] mb-6 group-hover:bg-[#E30613] group-hover:text-white transition-colors">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Partnership</h3>
                        <p className="text-gray-600 leading-relaxed">
                            No hidden clauses. We believe in complete transparency and fair sharing ratios, ensuring a win-win relationship for both parties.
                        </p>
                    </div>
                </div>
            </section>

            {/* Credentials / Badges */}
            <section className="bg-[#001253] py-16 text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-10 uppercase tracking-widest opacity-80">Our Commitments & Affiliations</h2>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {['REHAB Member', 'RAJUK Enlisted', 'Member FBCCI', 'Member DBCCI'].map((badge, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-4 group">
                                <div className="w-20 h-20 border-2 border-white/20 rounded-full flex items-center justify-center group-hover:border-[#E30613] group-hover:bg-[#E30613] transition-all duration-300">
                                    <CheckCircle size={32} />
                                </div>
                                <span className="font-bold text-lg">{badge}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lead Generation Form */}
            <section id="partner-form" className="py-24 container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl font-bold text-[#0D47A1] mb-6">Let's Discuss Your Property</h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Interested in developing your land? propery consultation is just a form away. Fill in your details and our Land Development Team will contact you shortly.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={14} /></div>
                                Free Site Visit & Feasibility Study
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={14} /></div>
                                Architectural Design Consultation
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={14} /></div>
                                Competitive Signing Money & Ratio
                            </li>
                        </ul>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Landowner Inquiry</h3>
                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-400">Your Name</label>
                                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#E30613] transition-colors" placeholder="Full Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-400">Phone Number</label>
                                        <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#E30613] transition-colors" placeholder="017..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400">Land Location</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#E30613] transition-colors" placeholder="Address / Area" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400">Land Size (Katha/Decimals)</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#E30613] transition-colors" placeholder="e.g. 5 Katha" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400">Message (Optional)</label>
                                    <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 h-32 focus:outline-none focus:border-[#E30613] transition-colors" placeholder="Any specific requirements..."></textarea>
                                </div>
                                <button className="w-full bg-[#0D47A1] text-white font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-[#E30613] transition-colors shadow-lg">
                                    Submit Inquiry
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landowners;

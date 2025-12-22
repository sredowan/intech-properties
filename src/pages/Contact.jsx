import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSettings, addEnquiry } from '../db/queries';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
    const [branding, setBranding] = useState({
        address: 'iNTECH AMIN GARDEN, 134/15 Furfura Sharif Road, Darussalam, Dhaka 1207',
        phone: ['01958600068 (WhatsApp)', '01958600070'],
        email: 'info@intechproperties.com.bd'
    });

    useEffect(() => {
        const fetchBranding = async () => {
            try {
                const data = await getSettings('site_branding');
                if (data) {
                    setBranding(prev => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.error("Error fetching branding for contact:", err);
            }
        };
        fetchBranding();
    }, []);

    const phone1 = branding.phone && branding.phone.length > 0 ? branding.phone[0] : '01958600068';
    const phone2 = branding.phone && branding.phone.length > 1 ? branding.phone[1] : '';

    return (
        <div className="contact-page pt-16 pb-24">
            {/* Header */}
            <div className="text-center mb-20 px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-black text-[#001253] mb-6"
                >
                    Get in Touch
                </motion.h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Ready to start your journey with iNTECH? Visit our office or drop us a message.
                </p>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div className="bg-[#001253] text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="bg-white/10 p-4 rounded-xl shrink-0"><MapPin size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 opacity-80 uppercase tracking-widest">Visit Us</h3>
                                        <p className="text-xl font-medium leading-relaxed">{branding.address}</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="bg-white/10 p-4 rounded-xl shrink-0"><Phone size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 opacity-80 uppercase tracking-widest">Call Us</h3>
                                        <p className="text-xl font-medium">{phone1}</p>
                                        {phone2 && <p className="text-xl font-medium text-white/60">{phone2}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="bg-white/10 p-4 rounded-xl shrink-0"><Mail size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 opacity-80 uppercase tracking-widest">Email Us</h3>
                                        <p className="text-xl font-medium">{branding.email}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Decor */}
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#E30613] rounded-full blur-[100px] opacity-40"></div>
                        </div>

                        <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 flex gap-6 items-center">
                            <div className="bg-white p-4 rounded-full shadow-md text-[#E30613]"><Clock size={32} /></div>
                            <div>
                                <h4 className="font-bold text-[#001253] text-lg">Office Hours</h4>
                                <p className="text-gray-500">Sat - Thu: 10:00 AM - 7:00 PM</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Map & Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-8"
                    >
                        {/* Map Placeholder */}
                        <div className="w-full h-[400px] bg-gray-200 rounded-3xl overflow-hidden relative shadow-inner group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.687657962453!2d90.35414537605953!3d23.794129587090547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c165d70e1371%3A0xe7a5c531d2797746!2siNTECH%20Properties%20Limited!5e0!3m2!1sen!2sbd!4v1703649600000!5m2!1sen!2sbd"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale hover:grayscale-0 transition-all duration-700"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none border-4 border-white/50 rounded-3xl"></div>
                        </div>

                        <ContactForm />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await addEnquiry({
                name: formData.name,
                email: '',
                phone: formData.phone,
                message: formData.message,
                propertyId: null
            });
            setStatus('success');
            setFormData({ name: '', phone: '', message: '' });
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-[#001253] mb-6">Send us a Message</h3>

            {status === 'success' && (
                <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6">
                    Message sent successfully! We will contact you soon.
                </div>
            )}
            {status === 'error' && (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">
                    Something went wrong. Please try again.
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <input
                    required
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 p-4 rounded-xl border-2 border-transparent focus:border-[#E30613] outline-none transition-colors"
                />
                <input
                    required
                    type="text"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 p-4 rounded-xl border-2 border-transparent focus:border-[#E30613] outline-none transition-colors"
                />
            </div>
            <textarea
                required
                placeholder="How can we help?"
                rows="4"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-50 p-4 rounded-xl border-2 border-transparent focus:border-[#E30613] outline-none transition-colors mb-6"
            ></textarea>
            <button disabled={loading} className="btn btn-primary w-full py-4 text-sm tracking-widest font-black disabled:opacity-50">
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
        </form>
    );
};


export default Contact;

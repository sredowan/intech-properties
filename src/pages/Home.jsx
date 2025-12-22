import React, { useState, useEffect } from 'react';
import { getProperties, getTestimonials } from '../db/queries';
import Hero from '../components/Hero';
import { AboutSection, WhyChooseUs } from '../components/AboutSections';
import PropertiesSection from '../components/PropertiesSection';
import { ContactSection } from '../components/Footer';

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch Properties
                const propsData = await getProperties();
                setProperties(propsData);

                // Fetch Testimonials
                const testData = await getTestimonials();
                setTestimonials(testData.map(t => ({
                    id: t.id,
                    name: t.name,
                    role: '',
                    quote: t.text
                })));
            } catch (err) {
                console.error("Failed to load home data", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="h-screen flex items-center justify-center text-primary font-bold">Loading...</div>;
    }

    return (
        <div className="home-page">
            <Hero properties={properties} />
            <AboutSection />
            <PropertiesSection properties={properties} />
            <WhyChooseUs />

            {/* Customer Review Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="section-title">Client Experiences</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(testimonials.length > 0 ? testimonials : [
                            {
                                id: 1,
                                name: "Ahmed Hossain",
                                role: "Owner, iNTECH Dream House",
                                quote: "Choosing iNTECH was the best decision for our family. The transparency and quality of construction exceeded our expectations."
                            },
                            {
                                id: 2,
                                name: "Mariyam Begum",
                                role: "Investor, iNTECH Avenue",
                                quote: "The team at iNTECH properties ensured our dream home was exactly as we envisioned. Professional and timely handover."
                            }
                        ]).map((review, idx) => (
                            <div key={idx} className="bg-gray-50 p-10 rounded-2xl flex flex-col justify-between italic text-lg text-gray-700 shadow-inner hover:shadow-lg transition-shadow">
                                <p>"{review.quote}"</p>
                                <div className="mt-8 flex items-center gap-4 not-italic">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl uppercase">
                                        {review.image ? <img src={review.image} alt={review.name} className="w-full h-full object-cover rounded-full" /> : review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-primary">{review.name}</div>
                                        <div className="text-xs text-gray-400">{review.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ContactSection />
        </div>
    );
};

export default Home;

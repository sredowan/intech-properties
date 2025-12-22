import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { getLocalAsset } from '../utils';
import { getHeroSlides } from '../db/queries';
import { Link } from 'react-router-dom';

const Hero = ({ properties }) => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const fetchedSlides = await getHeroSlides();

                if (fetchedSlides.length > 0) {
                    setSlides(fetchedSlides.map(s => ({
                        id: s.id,
                        image: s.image,
                        title: s.title,
                        subtitle: s.subtitle,
                        btn1Text: s.buttonText || 'Properties',
                        btn1Link: s.buttonLink || '/properties',
                        btn2Text: 'Contact Us',
                        btn2Link: '/contact',
                        order: s.order
                    })));
                } else if (properties) {
                    // Fallback to properties if no slides
                    const featured = properties.filter(p => (p.meta?.featured === '1' || p.featured_image) && p.meta).slice(0, 5);
                    const mapped = featured.map(p => ({
                        id: p.id,
                        image: getLocalAsset(p.featured_image),
                        title: p.title,
                        subtitle: p.meta?.address,
                        btn1Text: 'View Project',
                        btn1Link: `/projects/${p.id}`,
                        btn2Text: '',
                        btn2Link: ''
                    }));
                    setSlides(mapped);
                }
            } catch (err) {
                console.error("Error loading hero slides", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, [properties]);

    if (!slides.length && loading) return <div className="h-screen bg-black"></div>;
    if (!slides.length) return null;

    return (
        <section className="hero h-screen relative overflow-hidden bg-black">
            <Swiper
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                effect="fade"
                speed={1000}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                className="h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        {({ isActive }) => (
                            <div className="relative h-full w-full">
                                {/* Background Image */}
                                <motion.img
                                    src={getLocalAsset(slide.image)}
                                    alt={slide.title}
                                    className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: isActive ? 1.05 : 1 }}
                                    transition={{ duration: 10, ease: "linear" }}
                                />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
                                    <div className="container max-w-5xl">
                                        <motion.h1
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                            className="text-4xl md:text-7xl lg:text-8xl mb-6 md:mb-8 font-black uppercase tracking-tighter leading-[1.1]"
                                        >
                                            {slide.title}
                                        </motion.h1>

                                        <motion.p
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
                                            transition={{ duration: 0.8, delay: 0.6 }}
                                            className="text-lg md:text-2xl mb-10 md:mb-14 max-w-3xl mx-auto opacity-90 font-light leading-relaxed"
                                        >
                                            {slide.subtitle}
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
                                            transition={{ duration: 0.8, delay: 0.8 }}
                                            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6"
                                        >
                                            {/* Button 1 */}
                                            {slide.btn1Text && (
                                                <Link
                                                    to={slide.btn1Link || '#'}
                                                    className="px-8 py-4 bg-[#E30613] text-white font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-all rounded shadow-lg min-w-[160px]"
                                                >
                                                    {slide.btn1Text}
                                                </Link>
                                            )}

                                            {/* Button 2 */}
                                            {slide.btn2Text && (
                                                <Link
                                                    to={slide.btn2Link || '#'}
                                                    className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all rounded min-w-[160px]"
                                                >
                                                    {slide.btn2Text}
                                                </Link>
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Scroll Down Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white flex flex-col items-center gap-2 opacity-60"
            >
                <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-white/50"></div>
            </motion.div>
        </section>
    );
};

export default Hero;

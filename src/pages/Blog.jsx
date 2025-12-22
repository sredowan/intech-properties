import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, getBlogCategories } from '../db/queries';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { getLocalAsset } from '../utils';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch Posts
                const postsData = await getBlogs();
                setPosts(postsData.map(p => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    content: p.content,
                    featured_image: p.featuredImage,
                    category: p.category,
                    date: p.publishedAt,
                    seo: { metadesc: p.excerpt }
                })));

                // Fetch Categories
                const catData = await getBlogCategories();
                if (catData && catData.length > 0) {
                    setCategories(['All', ...catData]);
                } else {
                    setCategories(['All', 'Real Estate', 'Construction', 'Legal', 'Lifestyle']);
                }
            } catch (err) {
                console.error("Error loading blog data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredPosts = selectedCategory === 'All'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    if (loading) return <div className="py-40 text-center font-bold text-primary">Loading News...</div>;

    return (
        <div className="blog-page pt-16 pb-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-7xl font-black text-[#001253] mb-8 text-center">News & Updates</h1>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${selectedCategory === cat
                                ? 'bg-[#E30613] text-white shadow-lg scale-105'
                                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-[#001253]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div key={post.id} className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={getLocalAsset(post.featured_image)}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#E30613] tracking-widest shadow-sm">
                                            {post.category || 'Real Estate'}
                                        </div>
                                    </div>
                                </Link>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-6 text-[11px] text-gray-400 uppercase font-bold tracking-widest mb-4">
                                        <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-2"><User size={14} /> Admin</span>
                                    </div>
                                    <Link to={`/blog/${post.slug}`} className="block mb-4">
                                        <h3 className="text-xl md:text-2xl font-bold text-[#001253] leading-tight group-hover:text-[#E30613] transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                                        {post.seo?.metadesc || post.excerpt || "Learn more about the latest trends in the Bangladesh real estate market."}
                                    </p>
                                    <Link to={`/blog/${post.slug}`} className="flex items-center gap-2 text-[#E30613] font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all mt-auto pt-4 border-t border-gray-100">
                                        Read Article <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            <p className="text-xl">No posts found in this category.</p>
                            <button onClick={() => setSelectedCategory('All')} className="mt-4 text-[#E30613] font-bold underline">View All Posts</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;

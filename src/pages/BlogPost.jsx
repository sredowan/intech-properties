import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogBySlug } from '../db/queries';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { getLocalAsset } from '../utils';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const blogData = await getBlogBySlug(slug);
                if (blogData) {
                    setPost({
                        id: blogData.id,
                        title: blogData.title,
                        slug: blogData.slug,
                        category: blogData.category,
                        featured_image: blogData.featuredImage,
                        content: blogData.content,
                        date: blogData.publishedAt
                    });
                } else {
                    setPost(null);
                }
            } catch (err) {
                console.error("Error fetching blog post:", err);
            } finally {
                setLoading(false);
            }
        };

        window.scrollTo(0, 0);
        fetchPost();
    }, [slug]);

    if (loading) return <div className="pt-40 text-center container mx-auto px-6 font-bold text-lg">Loading Article...</div>;

    if (!post) {
        return (
            <div className="pt-40 text-center container mx-auto px-6">
                <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                <Link to="/blog" className="text-primary hover:underline">Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="blog-post-page pt-16 pb-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to News
                </Link>

                <h1 className="text-4xl md:text-5xl font-black text-[#001253] mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-gray-400 uppercase font-bold tracking-widest mb-8 border-b border-gray-100 pb-8">
                    <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><User size={16} /> Admin</span>
                    <span className="bg-red-50 text-secondary px-3 py-1 rounded-full text-xs">{post.category || 'Real Estate'}</span>
                </div>

                <div className="rounded-2xl overflow-hidden mb-12 shadow-xl">
                    <img
                        src={getLocalAsset(post.featured_image)}
                        alt={post.title}
                        className="w-full h-auto object-cover"
                    />
                </div>

                <div
                    className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#001253] prose-p:text-gray-600 prose-a:text-primary prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </div>
    );
};

export default BlogPost;

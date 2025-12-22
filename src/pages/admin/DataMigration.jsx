import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Database, Upload, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import {
    saveProperty, saveBlog, addBlogCategory, addGalleryItem,
    addTestimonial, saveHeroSlide, saveSettings, initializeDatabase
} from '../../db/queries';

export default function DataMigration() {
    const [status, setStatus] = useState('idle'); // idle, process, success, error
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const addLog = (msg, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { msg, type, timestamp }]);
    };

    const migrateData = async () => {
        setStatus('process');
        setLogs([]);
        setProgress({ current: 0, total: 0 });

        try {
            addLog('Initializing Neon database tables...', 'info');
            await initializeDatabase();
            addLog('✓ Database tables initialized', 'success');

            let totalMigrated = 0;

            // 1. Migrate Properties
            addLog('Fetching properties from Firebase...', 'info');
            const propertiesSnap = await getDocs(collection(db, 'properties'));
            const properties = propertiesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            addLog(`Found ${properties.length} properties`, 'info');

            for (const prop of properties) {
                try {
                    await saveProperty({
                        id: prop.id,
                        title: prop.title || 'Untitled',
                        slug: prop.slug || prop.id,
                        location: prop.location || prop.meta?.map_address || '',
                        area: prop.area || prop.meta?.land || '',
                        areaUnit: 'sft',
                        price: prop.price || '',
                        priceLabel: prop.priceLabel || '',
                        bedrooms: parseInt(prop.bedrooms) || 0,
                        bathrooms: parseInt(prop.bathrooms) || 0,
                        status: prop.status || 'Ongoing',
                        features: prop.features || [],
                        images: [prop.featured_image, ...(prop.images || [])].filter(Boolean),
                        floorPlans: prop.floor_plans || [],
                        description: prop.content || prop.description || '',
                        order: prop.order || 0
                    });
                    totalMigrated++;
                    addLog(`✓ Migrated property: ${prop.title}`, 'success');
                } catch (err) {
                    addLog(`✗ Failed property ${prop.title}: ${err.message}`, 'error');
                }
            }

            // 2. Migrate Blogs/Posts - try both 'posts' and 'blogs' collections
            addLog('Fetching blog posts from Firebase...', 'info');
            let posts = [];

            // Try 'posts' collection first
            try {
                const postsSnap = await getDocs(collection(db, 'posts'));
                posts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                addLog(`Found ${posts.length} items in 'posts' collection`, 'info');
            } catch (e) {
                addLog(`Could not fetch 'posts' collection: ${e.message}`, 'warning');
            }

            // Also try 'blogs' collection
            try {
                const blogsSnap = await getDocs(collection(db, 'blogs'));
                const blogsData = blogsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                addLog(`Found ${blogsData.length} items in 'blogs' collection`, 'info');
                posts = [...posts, ...blogsData];
            } catch (e) {
                addLog(`Could not fetch 'blogs' collection: ${e.message}`, 'warning');
            }

            addLog(`Total blog posts to migrate: ${posts.length}`, 'info');

            for (const post of posts) {
                try {
                    await saveBlog({
                        id: post.id,
                        title: post.title || 'Untitled Post',
                        slug: post.slug || post.id,
                        category: post.category || 'Uncategorized',
                        featuredImage: post.featured_image || post.featuredImage || post.image || '',
                        excerpt: post.excerpt || post.seo?.metadesc || post.description || '',
                        content: post.content || post.body || '',
                        publishedAt: post.date || post.publishedAt || post.created_at || new Date().toISOString()
                    });
                    totalMigrated++;
                    addLog(`✓ Migrated blog: ${post.title}`, 'success');
                } catch (err) {
                    addLog(`✗ Failed blog ${post.title}: ${err.message}`, 'error');
                }
            }

            // 3. Migrate Blog Categories
            addLog('Fetching blog categories...', 'info');
            try {
                const catDoc = await getDoc(doc(db, 'settings', 'blog_categories'));
                if (catDoc.exists()) {
                    const categories = catDoc.data().categories || [];
                    for (const cat of categories) {
                        await addBlogCategory(cat);
                        addLog(`✓ Added category: ${cat}`, 'success');
                    }
                }
            } catch (err) {
                addLog(`Categories migration skipped: ${err.message}`, 'warning');
            }

            // 4. Migrate Hero Slides
            addLog('Fetching hero slides from Firebase...', 'info');
            const heroSnap = await getDocs(collection(db, 'hero_slides'));
            const heroSlides = heroSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            addLog(`Found ${heroSlides.length} hero slides`, 'info');

            for (const slide of heroSlides) {
                try {
                    await saveHeroSlide({
                        id: slide.id,
                        image: slide.image || '',
                        title: slide.title || '',
                        subtitle: slide.subtitle || '',
                        buttonText: slide.btn1Text || slide.buttonText || 'View Properties',
                        buttonLink: slide.btn1Link || slide.buttonLink || '/properties',
                        isActive: true,
                        order: slide.order || 0
                    });
                    totalMigrated++;
                    addLog(`✓ Migrated slide: ${slide.title}`, 'success');
                } catch (err) {
                    addLog(`✗ Failed slide: ${err.message}`, 'error');
                }
            }

            // 5. Migrate Gallery
            addLog('Fetching gallery items from Firebase...', 'info');
            const gallerySnap = await getDocs(collection(db, 'gallery'));
            const gallery = gallerySnap.docs.map(d => ({ id: d.id, ...d.data() }));
            addLog(`Found ${gallery.length} gallery items`, 'info');

            for (const item of gallery) {
                try {
                    await addGalleryItem({
                        id: item.id,
                        imageUrl: item.image || item.url || '',
                        category: item.caption || item.category || 'General',
                        order: item.order || 0
                    });
                    totalMigrated++;
                    addLog(`✓ Migrated gallery item`, 'success');
                } catch (err) {
                    addLog(`✗ Failed gallery item: ${err.message}`, 'error');
                }
            }

            // 6. Migrate Testimonials
            addLog('Fetching testimonials from Firebase...', 'info');
            const testSnap = await getDocs(collection(db, 'testimonials'));
            const testimonials = testSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            addLog(`Found ${testimonials.length} testimonials`, 'info');

            for (const test of testimonials) {
                try {
                    await addTestimonial({
                        id: test.id,
                        name: test.name || 'Anonymous',
                        text: test.text || test.content || ''
                    });
                    totalMigrated++;
                    addLog(`✓ Migrated testimonial: ${test.name}`, 'success');
                } catch (err) {
                    addLog(`✗ Failed testimonial: ${err.message}`, 'error');
                }
            }

            // 7. Migrate Site Branding
            addLog('Fetching site branding from Firebase...', 'info');
            try {
                const brandDoc = await getDoc(doc(db, 'site_branding', 'main'));
                if (brandDoc.exists()) {
                    await saveSettings('site_branding', brandDoc.data());
                    addLog('✓ Migrated site branding settings', 'success');
                    totalMigrated++;
                }
            } catch (err) {
                addLog(`Branding migration skipped: ${err.message}`, 'warning');
            }

            addLog(`\n🎉 Migration Complete! ${totalMigrated} items migrated.`, 'success');
            setStatus('success');

        } catch (error) {
            console.error(error);
            addLog(`Fatal Error: ${error.message}`, 'error');
            setStatus('error');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#001253] mb-8 flex items-center gap-3">
                <Database /> Firebase to Neon Migration
            </h1>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-start gap-6 mb-8">
                    <div className={`p-4 rounded-xl ${status === 'success' ? 'bg-green-50 text-green-600' : status === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {status === 'process' ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">Migrate Data from Firebase to Neon</h2>
                        <p className="text-gray-500 mb-4">
                            This will copy all your existing data from Firebase Firestore to the new Neon PostgreSQL database.
                            This includes: Properties, Blog Posts, Hero Slides, Gallery, Testimonials, and Settings.
                        </p>

                        {status === 'idle' && (
                            <button
                                onClick={migrateData}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
                            >
                                <Database size={18} /> Start Migration
                            </button>
                        )}

                        {status === 'process' && (
                            <div className="flex items-center gap-2 text-blue-600 font-semibold">
                                <Loader2 className="animate-spin" />
                                Migration in progress...
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <CheckCircle />
                                Migration completed successfully!
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-600 font-semibold">
                                <AlertTriangle />
                                Migration failed. Check logs below.
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-900 text-gray-100 p-6 rounded-xl font-mono text-sm max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                        <span className="text-gray-500">Waiting to start migration...</span>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className={`mb-1 ${log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : log.type === 'warning' ? 'text-yellow-400' : 'text-gray-300'}`}>
                                <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
                                {log.msg}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

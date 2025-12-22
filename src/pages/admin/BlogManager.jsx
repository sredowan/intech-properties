import React, { useState, useEffect } from 'react';
import { getBlogs, saveBlog, deleteBlog, getBlogCategories, addBlogCategory, deleteBlogCategory } from '../../db/queries';
import { getLocalAsset } from '../../utils';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import RichTextEditor from '../../components/admin/RichTextEditor';

export default function BlogManager() {
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'categories'
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Fetch Posts
            const postsData = await getBlogs();
            setPosts(postsData);

            // Fetch Categories
            const categoriesData = await getBlogCategories();
            setCategories(categoriesData.length > 0 ? categoriesData : ['Uncategorized']);
        } catch (err) {
            console.error("Error loading blog data:", err);
        }
    };

    // --- Category Logic ---
    const handleAddCategory = async () => {
        const name = prompt('Enter new category name:');
        if (name && !categories.includes(name)) {
            await addBlogCategory(name);
            setCategories([...categories, name]);
        }
    };

    const handleDeleteCategory = async (cat) => {
        if (!window.confirm(`Delete category "${cat}"?`)) return;
        await deleteBlogCategory(cat);
        setCategories(categories.filter(c => c !== cat));
    };

    // --- Post Logic ---
    const handleSavePost = async (post) => {
        try {
            await saveBlog({
                ...post,
                publishedAt: post.publishedAt || new Date().toISOString()
            });
            setIsEditing(false);
            setCurrentPost(null);
            loadData();
        } catch (err) {
            alert('Failed to save post: ' + err.message);
        }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await deleteBlog(id);
            loadData();
        } catch (err) {
            alert('Failed to delete post');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Blog Manager</h2>
                <div className="space-x-4">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`px-4 py-2 rounded ${activeTab === 'posts' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-2 rounded ${activeTab === 'categories' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                    >
                        Categories
                    </button>
                </div>
            </div>

            {activeTab === 'categories' && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold text-lg">Categories</h3>
                        <button onClick={handleAddCategory} className="flex items-center text-primary hover:underline"><Plus size={16} /> Add New</button>
                    </div>
                    <ul className="space-y-2">
                        {categories.map((cat, idx) => (
                            <li key={idx} className="flex justify-between items-center p-3 border rounded bg-gray-50">
                                <span>{cat}</span>
                                <button onClick={() => handleDeleteCategory(cat)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'posts' && (
                <>
                    {isEditing ? (
                        <PostForm
                            initialData={currentPost}
                            categories={categories}
                            onSave={handleSavePost}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <div>
                            <button
                                onClick={() => { setCurrentPost(null); setIsEditing(true); }}
                                className="mb-4 flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                <Plus size={18} /> <span>New Post</span>
                            </button>
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-4">Title</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Published</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map(p => (
                                            <tr key={p.id} className="border-t hover:bg-gray-50">
                                                <td className="p-4 font-medium flex items-center gap-3">
                                                    {p.featuredImage ? (
                                                        <img src={getLocalAsset(p.featuredImage)} className="w-10 h-10 rounded object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Img</div>
                                                    )}
                                                    {p.title}
                                                </td>
                                                <td className="p-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{p.category || 'Uncategorized'}</span></td>
                                                <td className="p-4 text-gray-500 text-sm">
                                                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'Draft'}
                                                </td>
                                                <td className="p-4 flex space-x-2">
                                                    <button onClick={() => { setCurrentPost(p); setIsEditing(true); }} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                                    <button onClick={() => handleDeletePost(p.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function PostForm({ initialData, categories, onSave, onCancel }) {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        slug: '',
        content: '',
        category: categories[0] || 'Uncategorized',
        featuredImage: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-primary">{initialData ? 'Edit Post' : 'New Post'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input label="Title" name="title" value={formData.title} onChange={handleChange} />
                <Input label="Slug" name="slug" value={formData.slug} onChange={handleChange} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <ImageUpload
                        label="Featured Image"
                        currentImage={formData.featuredImage}
                        onUpload={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                    />
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <div className="h-80">
                    <RichTextEditor
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button onClick={onCancel} className="px-6 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button onClick={() => onSave(formData)} className="px-6 py-2 bg-primary text-white rounded hover:bg-blue-700">Save Post</button>
            </div>
        </div>
    );
}

const Input = ({ label, value, onChange, name }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="text"
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </div>
);

import React, { useState, useEffect } from 'react';
import { getProperties, saveProperty, deleteProperty } from '../../db/queries';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function PropertiesManager() {
    const [properties, setProperties] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProperty, setCurrentProperty] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const items = await getProperties();
            setProperties(items);
        } catch (err) {
            console.error(err);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const handleSave = async (property) => {
        try {
            await saveProperty(property);
            setIsEditing(false);
            setCurrentProperty(null);
            showToast('Property saved successfully!', 'success');
            loadData();
        } catch (err) {
            showToast('Failed to save: ' + err.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            await deleteProperty(id);
            showToast('Property deleted successfully!', 'success');
            loadData();
        } catch (err) {
            console.error(err);
            showToast('Failed to delete: ' + err.message, 'error');
        }
    };

    return (
        <div>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    <div className="flex-1 font-medium">{toast.message}</div>
                    <button onClick={() => setToast({ show: false, message: '', type: '' })} className="text-white hover:text-gray-200">
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Properties Manager</h2>
                <button
                    onClick={() => { setCurrentProperty(null); setIsEditing(true); }}
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <Plus size={18} /> <span>Add Property</span>
                </button>
            </div>

            {isEditing ? (
                <PropertyForm
                    initialData={currentProperty}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Order</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(p => (
                                    <tr key={p.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 font-medium flex items-center gap-3">
                                            {p.featured_image && <img src={p.featured_image} className="w-10 h-10 rounded object-cover" alt="" />}
                                            {p.title}
                                        </td>
                                        <td className="p-4">
                                            {p.address_area ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{p.address_area}, {p.address_city}</span>
                                                    <span className="text-xs text-gray-500">{p.address_road}</span>
                                                </div>
                                            ) : p.location}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${p.status === 'Ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 font-mono">
                                            {p.order || 0}
                                        </td>
                                        <td className="p-4 flex space-x-2">
                                            <button onClick={() => { setCurrentProperty(p); setIsEditing(true); }} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function PropertyForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        order: initialData?.order || 0,
        title: initialData?.title || '',
        location: initialData?.location || '',
        address_house: initialData?.address_house || '',
        address_road: initialData?.address_road || '',
        address_area: initialData?.address_area || '',
        address_city: initialData?.address_city || 'Dhaka',
        status: initialData?.status || 'Ongoing',
        featured_image: initialData?.featured_image || '',
        images: initialData?.images || [], // Additional slider images
        at_a_glance: initialData?.at_a_glance || { land_size: '', unit_per_floor: '', building_height: '', road_size: '' },
        floor_plans: initialData?.floor_plans || [],
        features: initialData?.features || [],
        video_url: initialData?.video_url || '',
        content: initialData?.content || '',
        slug: initialData?.slug || ''
    });

    // Auto-update full location string when parts change
    useEffect(() => {
        const parts = [
            formData.address_house,
            formData.address_road,
            formData.address_area,
            formData.address_city
        ].filter(Boolean);

        if (parts.length > 0 && !initialData) {
            setFormData(prev => ({ ...prev, location: parts.join(', ') }))
        }
    }, [formData.address_house, formData.address_road, formData.address_area, formData.address_city]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('glance.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, at_a_glance: { ...prev.at_a_glance, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFeatureChange = (feature) => {
        setFormData(prev => {
            const features = prev.features || [];
            if (features.includes(feature)) {
                return { ...prev, features: features.filter(f => f !== feature) };
            } else {
                return { ...prev, features: [...features, feature] };
            }
        });
    };

    const handleFloorPlanAdd = () => {
        setFormData(prev => ({
            ...prev,
            floor_plans: [...prev.floor_plans, {
                name: 'New Plan',
                image: '',
                is_simple_plan: false,
                details: { size: '', bed: '', bath: '', balcony: '', living: false, dining: false }
            }]
        }));
    };

    const handleFloorPlanChange = (index, field, value) => {
        const newPlans = [...formData.floor_plans];
        if (['size', 'bed', 'bath', 'balcony'].includes(field)) {
            if (!newPlans[index].details) newPlans[index].details = {};
            newPlans[index].details[field] = value;
        } else if (['living', 'dining'].includes(field)) {
            if (!newPlans[index].details) newPlans[index].details = {};
            newPlans[index].details[field] = value;
        } else {
            newPlans[index][field] = value;
        }
        setFormData({ ...formData, floor_plans: newPlans });
    };

    const featuresList = ['Lift', 'Car Parking', 'Generator', 'Prayer Room', 'Community Hall', 'Security', 'PBX System', 'Roof Top Garden'];

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-primary">{initialData ? 'Edit Property' : 'Add New Property'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input label="Title" name="title" value={formData.title} onChange={handleChange} />
                <Input label="Slug (URL)" name="slug" value={formData.slug} onChange={handleChange} />
                <div className="md:col-span-2">
                    <Input label="Display Order (Lower shows first)" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" />
                </div>

                <div className="md:col-span-2 border p-4 rounded-lg bg-gray-50">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Address Details</label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="House / Plot" name="address_house" value={formData.address_house} onChange={handleChange} placeholder="e.g. 134/15" />
                        <Input label="Road" name="address_road" value={formData.address_road} onChange={handleChange} placeholder="e.g. Furfura Sharif Road" />
                        <Input label="Area" name="address_area" value={formData.address_area} onChange={handleChange} placeholder="e.g. Darussalam" />
                        <Input label="City" name="address_city" value={formData.address_city} onChange={handleChange} placeholder="e.g. Dhaka" />
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        Full Location Preview: <span className="font-semibold text-gray-700">{formData.location}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                        <option>Ongoing</option><option>Completed</option><option>Upcoming</option>
                    </select>
                </div>
            </div>

            <div className="mb-6">
                <ImageUpload
                    label="Featured Image"
                    currentImage={formData.featured_image}
                    onUpload={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                />
            </div>

            <div className="mb-6 border p-4 rounded-lg bg-gray-50">
                <label className="block text-sm font-bold text-gray-700 mb-3">Additional Slider Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                            <img src={img} className="w-full h-32 object-cover rounded bg-white border" alt="" />
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                type="button"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <ImageUpload
                    label="Add New Image"
                    currentImage={null}
                    onUpload={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
                />
            </div>

            <h4 className="font-bold text-lg mb-4 mt-8 border-b pb-2">At A Glance</h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Input label="Land Size" name="glance.land_size" value={formData.at_a_glance?.land_size} onChange={handleChange} />
                <Input label="Unit Per Floor" name="glance.unit_per_floor" value={formData.at_a_glance?.unit_per_floor} onChange={handleChange} />
                <Input label="Building Height" name="glance.building_height" value={formData.at_a_glance?.building_height} onChange={handleChange} />
                <Input label="Road Size" name="glance.road_size" value={formData.at_a_glance?.road_size} onChange={handleChange} />
            </div>

            <h4 className="font-bold text-lg mb-4 mt-8 border-b pb-2">Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {featuresList.map(f => (
                    <label key={f} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData.features?.includes(f)}
                            onChange={() => handleFeatureChange(f)}
                            className="w-4 h-4 text-primary"
                        />
                        <span>{f}</span>
                    </label>
                ))}
            </div>

            <h4 className="font-bold text-lg mb-4 mt-8 border-b pb-2">Floor Plans & Configurations</h4>
            <div className="space-y-4 mb-6">
                <div className="flex justify-end mb-2">
                    <button type="button" onClick={() => setFormData({ ...formData, floor_plans: [] })} className="text-red-500 text-xs underline">Clear All Plans</button>
                </div>
                {formData.floor_plans.map((plan, idx) => (
                    <div key={idx} className="border p-4 rounded bg-gray-50 relative">
                        <button
                            type="button"
                            onClick={() => {
                                const newPlans = formData.floor_plans.filter((_, i) => i !== idx);
                                setFormData({ ...formData, floor_plans: newPlans });
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                            <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Input label="Plan Title (e.g. Unit A, Ground Floor)" value={plan.name} onChange={(e) => handleFloorPlanChange(idx, 'name', e.target.value)} />
                                <div className="mt-2">
                                    <label className="flex items-center space-x-2 text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={plan.is_simple_plan || false}
                                            onChange={(e) => handleFloorPlanChange(idx, 'is_simple_plan', e.target.checked)}
                                        />
                                        <span>Simple Plan (Image only, no unit details)</span>
                                    </label>
                                </div>
                            </div>
                            <ImageUpload
                                label="Floor Plan Image"
                                currentImage={plan.image || plan.fave_plan_image} // Fallback for legacy
                                onUpload={(url) => handleFloorPlanChange(idx, 'image', url)}
                            />
                        </div>

                        {!plan.is_simple_plan && (
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-white p-3 rounded border border-gray-100">
                                <Input label="Size (sft)" placeholder="1200" value={plan.details?.size} onChange={(e) => handleFloorPlanChange(idx, 'size', e.target.value)} />
                                <Input label="Beds" placeholder="3" value={plan.details?.bed} onChange={(e) => handleFloorPlanChange(idx, 'bed', e.target.value)} />
                                <Input label="Baths" placeholder="3" value={plan.details?.bath} onChange={(e) => handleFloorPlanChange(idx, 'bath', e.target.value)} />
                                <Input label="Balconies" placeholder="2" value={plan.details?.balcony} onChange={(e) => handleFloorPlanChange(idx, 'balcony', e.target.value)} />
                                <div className="flex flex-col justify-center">
                                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={plan.details?.living} onChange={(e) => handleFloorPlanChange(idx, 'living', e.target.checked)} /> <span>Living Room</span></label>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={plan.details?.dining} onChange={(e) => handleFloorPlanChange(idx, 'dining', e.target.checked)} /> <span>Dining Room</span></label>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleFloorPlanAdd} className="text-primary flex items-center text-sm font-semibold"><Plus size={16} className="mr-1" /> Add Floor Plan</button>
            </div>

            <div className="mb-6">
                <Input label="Video URL (YouTube/Vimeo)" name="video_url" value={formData.video_url} onChange={handleChange} />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Overview Description (HTML allowed)</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
                <button onClick={onCancel} className="px-6 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button onClick={() => onSave(formData)} className="px-6 py-2 bg-primary text-white rounded hover:bg-blue-700">Save Property</button>
            </div>
        </div>
    );
}

const Input = ({ label, value, onChange, name, placeholder, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </div>
);

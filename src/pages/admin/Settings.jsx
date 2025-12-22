import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../../db/queries';
import ImageUpload from '../../components/admin/ImageUpload';
import { Save } from 'lucide-react';

export default function Settings() {
    const [branding, setBranding] = useState({
        name: '',
        tagline: '',
        logo_url: '/assets/logo.png', // Default
        email: '',
        phone: [],
        address: '',
        social: { facebook: '', linkedin: '', instagram: '' }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getSettings('site_branding');
            if (data) {
                setBranding({ ...branding, ...data });
            }
        } catch (err) {
            console.error("Error loading settings:", err);
        }
    };

    const handleSave = async () => {
        try {
            await saveSettings('site_branding', branding);
            alert('Settings saved!');
        } catch (err) {
            alert('Failed to save settings: ' + err.message);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Site Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Branding</h3>
                    <div className="space-y-4">
                        <ImageUpload
                            label="Site Logo"
                            currentImage={branding.logo_url}
                            onUpload={(url) => setBranding({ ...branding, logo_url: url })}
                        />
                        <Input label="Site Name" value={branding.name} onChange={e => setBranding({ ...branding, name: e.target.value })} />
                        <Input label="Tagline" value={branding.tagline} onChange={e => setBranding({ ...branding, tagline: e.target.value })} />
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Contact Info</h3>
                    <div className="space-y-4">
                        <Input label="Email" value={branding.email} onChange={e => setBranding({ ...branding, email: e.target.value })} />
                        <Input label="Phone (comma separated)" value={branding.phone?.join(', ')} onChange={e => setBranding({ ...branding, phone: e.target.value.split(',').map(s => s.trim()) })} />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={branding.address}
                                onChange={e => setBranding({ ...branding, address: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Facebook URL" value={branding.social?.facebook} onChange={e => setBranding({ ...branding, social: { ...branding.social, facebook: e.target.value } })} />
                    <Input label="LinkedIn URL" value={branding.social?.linkedin} onChange={e => setBranding({ ...branding, social: { ...branding.social, linkedin: e.target.value } })} />
                    <Input label="Instagram URL" value={branding.social?.instagram} onChange={e => setBranding({ ...branding, social: { ...branding.social, instagram: e.target.value } })} />
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                    <Save size={20} /> Save Settings
                </button>
            </div>
        </div>
    );
}

const Input = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="text"
            value={value || ''}
            onChange={onChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </div>
);

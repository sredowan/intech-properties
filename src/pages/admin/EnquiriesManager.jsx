import React, { useState, useEffect } from 'react';
import { getEnquiries, deleteEnquiry } from '../../db/queries';
import { Trash2, Mail, Phone, Calendar, User, MessageSquare } from 'lucide-react';

export default function EnquiriesManager() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        setLoading(true);
        try {
            const items = await getEnquiries();
            setEnquiries(items.map(e => ({
                id: e.id,
                name: e.name,
                email: e.email,
                phone: e.phone,
                message: e.message,
                property: e.propertyId,
                date: e.createdAt
            })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
        try {
            await deleteEnquiry(id);
            loadEnquiries(); // Refresh
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Enquiries...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Enquiries & Messages</h2>
                <div className="text-sm text-gray-500">
                    Total: <span className="font-bold text-primary">{enquiries.length}</span>
                </div>
            </div>

            <div className="grid gap-4">
                {enquiries.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center text-gray-400 italic">
                        No enquiries found yet.
                    </div>
                ) : (
                    enquiries.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-primary relative group">
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Enquiry"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                        <User size={18} className="text-primary" />
                                        {item.name}
                                    </h3>
                                    <div className="text-sm text-gray-500 flex items-center gap-4">
                                        <span className="flex items-center gap-1"><Mail size={14} /> {item.email}</span>
                                        <span className="flex items-center gap-1"><Phone size={14} /> {item.phone}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-2 md:mt-0 font-medium bg-gray-50 px-3 py-1 rounded-full h-fit self-start">
                                    <Calendar size={12} />
                                    {item.date ? new Date(item.date).toLocaleString() : 'Unknown Date'}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded text-gray-700 text-sm italic relative">
                                <MessageSquare size={16} className="absolute -top-2 -left-2 text-gray-300 bg-white rounded-full" />
                                "{item.message}"
                            </div>

                            {item.property && (
                                <div className="mt-3 text-xs font-semibold text-secondary uppercase tracking-wider">
                                    Inquiry for: {item.property}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

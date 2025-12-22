
import React, { useEffect, useState } from 'react';
import { getCounts } from '../../db/queries';

export default function Dashboard() {
    const [stats, setStats] = useState({ properties: 0, blogs: 0, gallery: 0, testimonials: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const counts = await getCounts();
                setStats({
                    properties: counts.properties,
                    blogs: counts.blogs,
                    gallery: counts.gallery,
                    testimonials: counts.testimonials
                });
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-secondary">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Properties" count={stats.properties} color="bg-blue-500" />
                <StatCard title="Total Blogs" count={stats.blogs} color="bg-green-500" />
                <StatCard title="Gallery Images" count={stats.gallery} color="bg-purple-500" />
                <StatCard title="Testimonials" count={stats.testimonials} color="bg-orange-500" />
            </div>
        </div>
    );
}

function StatCard({ title, count, color }) {
    return (
        <div className={`${color} text-white p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-4xl font-bold">{count}</p>
        </div>
    );
}

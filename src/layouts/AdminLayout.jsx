import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, FileText, Image, MessageSquare, LogOut, Settings, Database, Mail, Menu, X, Monitor } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/hero-slider', label: 'Hero Slider', icon: Monitor },
        { path: '/admin/properties', label: 'Properties', icon: Building },
        { path: '/admin/blogs', label: 'Blogs', icon: FileText },
        { path: '/admin/gallery', label: 'Gallery', icon: Image },
        { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
        { path: '/admin/enquiries', label: 'Enquiries', icon: Mail }, // Used Mail icon here, imported below or reuse MessageSquare? Mail is better.
        { path: '/admin/migration', label: 'Migration', icon: Database },
        { path: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white shadow-sm z-20 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-md flex flex-col transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b hidden md:block">
                    <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
                </div>
                <div className="p-6 border-b md:hidden flex justify-between items-center">
                    <h1 className="text-xl font-bold text-primary">Menu</h1>
                    <button onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-red-600 p-3 w-full hover:bg-red-50 rounded-lg transition"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 w-full">
                <Outlet />
            </main>
        </div>
    );
}

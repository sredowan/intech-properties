import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ShoppingBag, ArrowRight, Loader } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error("Login Error:", err);
            let msg = 'Connection failed.';
            if (err.code === 'auth/invalid-email') msg = 'Invalid email address.';
            if (err.code === 'auth/user-not-found') msg = 'User not found.';
            if (err.code === 'auth/wrong-password') msg = 'Invalid password.';
            if (err.code === 'auth/invalid-credential') msg = 'Invalid credentials.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0D47A1] to-[#001253] p-4 text-white">
            <div className="w-full max-w-md backdrop-blur-xl bg-white/10 p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-primary" />

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black mb-2 tracking-tight">iNTECH</h1>
                    <p className="text-white/60 text-sm font-medium tracking-widest uppercase">Workspace Access</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-medium text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-white/50 mb-2 pl-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-white/50 mb-2 pl-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-secondary hover:bg-red-700 text-white shadow-lg shadow-red-900/20 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : (
                            <>
                                Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-white/20 text-xs">Protected System • Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );
}

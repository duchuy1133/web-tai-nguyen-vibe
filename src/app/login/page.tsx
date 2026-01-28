'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Khởi tạo Supabase Client trực tiếp với biến môi trường
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form Stats
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // LOGIC ĐĂNG NHẬP
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                // Thành công -> Chuyển hướng
                router.push('/');
                router.refresh();
            } else {
                // LOGIC ĐĂNG KÝ
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;

                setError('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');
            }
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-20 bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                            V
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {isLogin
                            ? 'Đăng nhập để truy cập kho tài nguyên Premium.'
                            : 'Tham gia cộng đồng VibeDigital ngay hôm nay.'}
                    </p>
                </div>

                {/* TABS */}
                <div className="flex bg-slate-950 p-1 rounded-lg mb-6 border border-slate-800">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(true); setError(null); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin
                            ? 'bg-slate-800 text-white shadow'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        Đăng Nhập
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsLogin(false); setError(null); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin
                            ? 'bg-slate-800 text-white shadow'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        Đăng Ký
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleAuth} className="space-y-4">
                    {error && (
                        <div className={`p-3 rounded-lg text-sm border ${error.includes('thành công')
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-slate-600"
                                placeholder="name@vibedigital.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            isLogin ? (
                                <>
                                    Đăng Nhập <ArrowRight size={20} />
                                </>
                            ) : (
                                <>
                                    Đăng Ký Ngay <Sparkles size={20} />
                                </>
                            )
                        )}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center">
                    <Link href="#" className="text-xs text-slate-500 hover:text-orange-400 transition-colors">
                        Quên mật khẩu?
                    </Link>
                </div>
            </div>
        </div>
    );
}

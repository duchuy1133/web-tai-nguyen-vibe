'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Loader2, User, Wallet, CreditCard, LogOut, ArrowLeft, History, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Init Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProfilePage() {
    const router = useRouter();

    // State đơn giản
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // 1. Get Auth User
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    console.log("No user found, redirecting...");
                    router.push('/login');
                    return;
                }

                setUser(user);

                // 2. Get User Profile (Balance) from 'users' table
                const { data: userProfile, error: profileError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Lỗi lấy profile:', profileError);
                    // Nếu lỗi không phải do data rỗng (VD: mất mạng, sai quyền...)
                    if (profileError.code !== 'PGRST116') {
                        setErrorMsg(`Lỗi lấy dữ liệu: ${profileError.message} (${profileError.code})`);
                    }
                }

                setProfile(userProfile || { balance: 0 });
                // Update Navbar Balance
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('BALANCE_UPDATED'));
                }

            } catch (err: any) {
                console.error('Lỗi không xác định:', err);
                setErrorMsg(`Lỗi hệ thống: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    // UI Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-amber-500" size={48} />
                <p className="text-slate-400 animate-pulse font-medium">Đang tải hồ sơ...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-slate-700 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-medium">Quay lại trang chủ</span>
                    </Link>
                    <span className="text-slate-500 text-sm hidden md:block">ID: {user.id.slice(0, 8)}...</span>
                </div>

                {/* Error Alert Display */}
                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle size={24} />
                        <div>
                            <p className="font-bold">Đã xảy ra lỗi!</p>
                            <p className="text-sm">{errorMsg}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: User Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center sticky top-24">

                            {/* Avatar */}
                            <div className="relative mb-4">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-white">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 border-slate-900 rounded-full flex items-center justify-center" title="Verified User">
                                    <ShieldCheck size={14} className="text-white" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-1">
                                {profile?.full_name || user.user_metadata?.full_name || "Thành viên Vibe"}
                            </h2>
                            <p className="text-slate-400 text-sm mb-6 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-800">
                                {user.email}
                            </p>

                            <div className="w-full h-px bg-slate-800 mb-6" />

                            <button
                                onClick={handleSignOut}
                                className="w-full py-3 px-4 bg-slate-900 hover:bg-red-950/30 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/50 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium group"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Balance & stats */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Main Balance Card (Golden Style) */}
                        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 group">
                            {/* Background Effects */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-amber-500/80">
                                        <Wallet size={20} />
                                        <span className="text-sm font-bold tracking-wider uppercase">Số dư khả dụng</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                                        PREMIUM MEMBER
                                    </div>
                                </div>

                                <div className="mt-4 mb-8">
                                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 drop-shadow-sm font-sans tracking-tight">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(profile?.balance || 0)}
                                    </h1>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 text-base">
                                        <CreditCard size={20} />
                                        Nạp tiền ngay
                                    </button>
                                    <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-4 px-6 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2">
                                        Ví Voucher
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. Transaction History */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col min-h-[300px]">
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <History size={20} className="text-slate-500" />
                                    Lịch sử giao dịch
                                </h3>
                                <button className="text-xs text-amber-500 hover:text-amber-400 font-medium">
                                    Xem tất cả
                                </button>
                            </div>

                            {/* Empty State */}
                            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 icon-float">
                                    <History size={32} className="text-slate-600" />
                                </div>
                                <h4 className="text-slate-300 font-medium mb-1">Chưa có giao dịch nào</h4>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                    Các giao dịch nạp tiền và mua sắm của bạn sẽ xuất hiện tại đây.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* CSS Animation for floating icon */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .icon-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

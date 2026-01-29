'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, LogOut, Wallet } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Init Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Navbar() {
    const { items, openCart } = useCartStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Auth State
    const [user, setUser] = useState<any>(null);
    const [balance, setBalance] = useState<number>(0); // State số dư
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Event Listener for Balance Updates
    useEffect(() => {
        const handleBalanceUpdate = () => {
            if (user) {
                supabase
                    .from('users')
                    .select('balance')
                    .eq('id', user.id)
                    .single()
                    .then(({ data }) => {
                        if (data) setBalance(data.balance || 0);
                    });
            }
        };

        window.addEventListener('BALANCE_UPDATED', handleBalanceUpdate);
        return () => window.removeEventListener('BALANCE_UPDATED', handleBalanceUpdate);
    }, [user]);

    // Fetch User & Balance
    useEffect(() => {
        setMounted(true);

        const getUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Fetch Balance từ bảng users
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('balance')
                    .eq('id', user.id)
                    .single();

                if (userData && !error) {
                    setBalance(userData.balance || 0);
                }
            }
        };

        getUserData();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                // Fetch Balance lại khi auth change
                const { data: userData } = await supabase
                    .from('users')
                    .select('balance')
                    .eq('id', currentUser.id)
                    .single();
                if (userData) setBalance(userData.balance || 0);
            } else {
                setBalance(0);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setBalance(0);
        window.location.reload(); // Reload để reset state
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                        V
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        VibeDigital
                    </span>
                </Link>

                {/* Desktop Search */}
                <div className="hidden lg:flex items-center gap-6 mx-6">
                    <Link href="/category/plugin" className="text-slate-300 hover:text-white hover:text-amber-500 transition-colors font-medium text-sm">Plugins</Link>
                    <Link href="/category/template" className="text-slate-300 hover:text-white hover:text-amber-500 transition-colors font-medium text-sm">Templates</Link>
                    <Link href="/category/luts" className="text-slate-300 hover:text-white hover:text-amber-500 transition-colors font-medium text-sm">Luts & Màu</Link>
                    <Link href="/category/sound" className="text-slate-300 hover:text-white hover:text-amber-500 transition-colors font-medium text-sm">Âm thanh</Link>
                    <Link href="/blog" className="text-slate-300 hover:text-white hover:text-amber-500 transition-colors font-medium text-sm">Blog</Link>
                </div>

                <div className="hidden md:flex items-center flex-1 max-w-sm relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-sans text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                if (target.value.trim()) {
                                    window.location.href = `/search?q=${encodeURIComponent(target.value.trim())}`;
                                }
                            }
                        }}
                    />
                    <Search className="absolute left-3 text-slate-500 w-4 h-4" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={openCart}
                        className="text-slate-400 hover:text-white transition-colors relative"
                    >
                        <ShoppingCart size={24} />
                        {mounted && items.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full animate-scale-in">
                                {items.length}
                            </span>
                        )}
                    </button>

                    {/* AUTH STATE (Real) */}
                    {mounted ? (
                        user ? (
                            <div className="flex items-center gap-3">
                                {/* Balance Display */}
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                                    <span className="text-yellow-400 font-bold text-sm">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance)}
                                    </span>
                                </div>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 hover:bg-slate-800 rounded-full transition-colors p-1"
                                    >
                                        {/* Avatar Circle */}
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm uppercase shadow-lg border border-slate-700">
                                            {user.email ? user.email.charAt(0) : 'U'}
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden py-1 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-3 border-b border-slate-800">
                                                <p className="text-sm text-white font-medium truncate">{user.email}</p>
                                                <p className="text-xs text-slate-500">Thành viên</p>
                                            </div>

                                            <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                                                <User size={16} /> Hồ sơ cá nhân
                                            </Link>

                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                                            >
                                                <LogOut size={16} /> Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                    Đăng nhập
                                </Link>
                                <Link href="/login">
                                    <button className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-orange-500/20">
                                        Đăng Ký
                                    </button>
                                </Link>
                            </div>
                        )
                    ) : (
                        // Placeholder khi chưa mount
                        <div className="w-20 h-9" />
                    )}

                    <button className="md:hidden text-slate-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
}

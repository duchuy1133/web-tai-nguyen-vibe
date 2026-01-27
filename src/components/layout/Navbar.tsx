'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { items, openCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

                    <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300">
                        <User size={16} />
                        <span>Đăng nhập</span>
                    </button>

                    <button className="md:hidden text-slate-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
}

'use client';

import { useCartStore } from '@/store/useCartStore';
import { formatVND, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, CreditCard } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeFromCart, total } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Prevent hydration errors with persist middleware
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-950 border-l border-slate-800 z-[100] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="text-orange-500" size={24} />
                                <h2 className="text-xl font-bold text-white">Giỏ hàng ({items.length})</h2>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                                    <ShoppingBag size={64} className="opacity-20" />
                                    <p className="text-lg font-medium">Giỏ hàng đang trống</p>
                                    <button
                                        onClick={closeCart}
                                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white text-sm font-medium transition-colors"
                                    >
                                        Tiếp tục mua sắm
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50 hover:border-slate-700 group"
                                    >
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">{item.category}</span>
                                                <h4 className="text-slate-200 font-medium line-clamp-1 text-sm">{item.title}</h4>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-white font-bold">{formatVND(item.price)}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Xóa khỏi giỏ"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-slate-800 bg-slate-900/50 space-y-4">
                                <div className="flex items-center justify-between text-slate-400 text-sm">
                                    <span>Tạm tính</span>
                                    <span className="text-white font-medium">{formatVND(total())}</span>
                                </div>
                                <div className="flex items-center justify-between text-lg font-bold text-white">
                                    <span>Tổng cộng</span>
                                    <span className="text-orange-500">{formatVND(total())}</span>
                                </div>

                                <button
                                    onClick={() => {
                                        closeCart();
                                        if (items.length > 0) {
                                            router.push(`/checkout?id=${items[0].id}`);
                                        }
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
                                >
                                    <CreditCard size={20} />
                                    THANH TOÁN
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

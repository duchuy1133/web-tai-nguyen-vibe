'use client';


import { ShoppingCart, Eye, FileBox, Layers, MonitorPlay } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatVND } from '@/lib/utils';

interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    category: string;
    thumbnail: string;
}

interface ProductCardProps {
    product: Product;
}

import { useCartStore } from '@/store/useCartStore';

import Link from 'next/link';

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCartStore();

    // Calculate Discount
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-lg hover:shadow-orange-500/10 transition-all duration-300 flex flex-col h-full"
        >
            <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg animate-pulse">
                            -{discountPercent}%
                        </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <div className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors" title="Xem nhanh">
                            <Eye size={20} />
                        </div>
                        <div
                            className="p-3 bg-orange-500 hover:bg-orange-400 rounded-full text-white transition-colors shadow-lg shadow-orange-500/30 cursor-pointer"
                            title="Thêm vào giỏ"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                            }}
                        >
                            <ShoppingCart size={20} />
                        </div>
                    </div>
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur text-xs font-medium text-orange-400 rounded-full border border-slate-800 uppercase tracking-wider">
                        {product.category}
                    </span>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3 flex-grow flex flex-col">
                    <h3 className="font-semibold text-lg text-slate-100 line-clamp-2 group-hover:text-orange-400 transition-colors bg-clip-text">
                        {product.title}
                    </h3>

                    {/* Fake Tech Specs */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/50 mb-2">
                        <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400">
                            <FileBox size={14} className="text-slate-500" />
                            <span>1.2 GB</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400 p-r-1 text-center border-x border-slate-800/50">
                            <Layers size={14} className="text-slate-500" />
                            <span>4K/HD</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400">
                            <MonitorPlay size={14} className="text-slate-500" />
                            <span>Pr/Ae/Da</span>
                        </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex flex-col items-start gap-1">
                            {hasDiscount && (
                                <span className="text-xs text-slate-500 line-through decoration-slate-500/50">
                                    {formatVND(product.originalPrice!)}
                                </span>
                            )}
                            <span className="text-xl font-bold text-white">
                                {formatVND(product.price)}
                            </span>
                        </div>
                        <div className="text-xs font-bold px-3 py-2 bg-slate-800 hover:bg-orange-500 hover:text-white rounded-lg text-slate-300 transition-all flex items-center gap-2 uppercase tracking-wide">
                            Xem chi tiết
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

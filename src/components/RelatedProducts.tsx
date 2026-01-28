'use client';

import React from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { Sparkles } from 'lucide-react';

interface RelatedProductsProps {
    products: any[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    // Logic Loop: Render danh sách sản phẩm 2 lần liền nhau
    const displayProducts = [...products, ...products];

    if (!products || products.length === 0) return null;

    return (
        <section className="py-12 bg-slate-950/50 border-t border-slate-900 overflow-hidden">
            <div className="container mx-auto px-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Sparkles size={24} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Có thể bạn sẽ thích
                    </h2>
                </div>
            </div>

            <div className="relative w-full">
                {/* Helper gradient edges for smooth fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

                {/* Marquee Container */}
                <div
                    className="flex gap-6 w-max animate-scroll hover:[animation-play-state:paused] py-4"
                >
                    {displayProducts.map((product, index) => (
                        <div
                            key={`${product.id}-${index}`}
                            className="w-72 flex-shrink-0"
                        >
                            <ProductCard
                                product={{
                                    id: product.id,
                                    title: product.title,
                                    price: product.price,
                                    originalPrice: product.originalPrice,
                                    category: product.category,
                                    thumbnail: product.thumbnail || product.thumbnailUrl,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

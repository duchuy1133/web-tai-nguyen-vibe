'use client';

import { ShoppingCart, CreditCard, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    title: string;
    price: number;
    category: string;
    thumbnail: string;
}

export default function AddToCartButtons({ product }: { product: Product }) {
    const router = useRouter(); // Use App Router
    const { addToCart } = useCartStore();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        // Redirect to checkout with product ID as requested
        router.push(`/checkout?id=${product.id}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
            >
                <CreditCard size={20} />
                MUA NGAY
            </button>
            <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all group"
            >
                {isAdded ? <CheckCircle2 size={20} className="text-green-500" /> : <ShoppingCart size={20} className="group-hover:text-amber-500 transition-colors" />}
                {isAdded ? "ĐÃ THÊM" : "THÊM VÀO GIỎ"}
            </button>
        </div>
    );
}

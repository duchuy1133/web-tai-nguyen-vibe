import prisma from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { notFound } from "next/navigation";
import { ProductCategory } from "@prisma/client";
import { PackageOpen } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

// Map slug to title and Enum
const CATEGORY_MAP: Record<string, { title: string, enum?: ProductCategory }> = {
    'plugin': { title: 'Plugins', enum: 'PLUGIN' },
    'template': { title: 'Mẫu (Template)', enum: 'TEMPLATE' },
    'font': { title: 'Fonts Chữ', enum: 'FONT' },
    'luts': { title: 'Luts & Màu', enum: undefined }, // Not in DB yet
    'sound': { title: 'Âm thanh', enum: undefined }, // Not in DB yet
    'script': { title: 'Scripts', enum: 'SCRIPT' },
    'image': { title: 'Stock Images', enum: 'IMAGE' },
};

async function getProductsByCategory(categoryEnum?: ProductCategory) {
    if (!categoryEnum) return [];

    try {
        const products = await prisma.product.findMany({
            where: {
                category: categoryEnum,
                isDeleted: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return products;
    } catch (error) {
        console.error("Error fetching category products:", error);
        return [];
    }
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const categoryInfo = CATEGORY_MAP[slug.toLowerCase()];

    if (!categoryInfo) return { title: 'Danh mục không tồn tại' };

    return {
        title: `${categoryInfo.title} | VibeDigital`,
        description: `Kho tài nguyên ${categoryInfo.title} chất lượng cao cho Video Editor.`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const normalizedSlug = slug.toLowerCase();
    const categoryInfo = CATEGORY_MAP[normalizedSlug];

    if (!categoryInfo) {
        notFound();
    }

    const products = await getProductsByCategory(categoryInfo.enum);

    return (
        <div className="min-h-screen pt-12 pb-20">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="bg-amber-500 w-2 h-8 rounded-full inline-block"></span>
                    {categoryInfo.title}
                </h1>
                <p className="text-slate-400 mb-12 ml-5">
                    Danh sách các tài nguyên mới nhất dành cho bạn.
                </p>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
                        <PackageOpen size={64} className="text-slate-600 mb-4" />
                        <p className="text-xl text-slate-400 font-medium">Chưa có sản phẩm nào trong danh mục này.</p>
                        <p className="text-slate-500 mt-2">Vui lòng quay lại sau nhé!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={{
                                id: product.id,
                                title: product.title,
                                price: product.price,
                                category: product.category,
                                thumbnail: product.thumbnailUrl
                            }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

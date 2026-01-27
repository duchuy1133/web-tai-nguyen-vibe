import prisma from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { Database, Search } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering since we depend on searchParams
export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props) {
    const { q } = await searchParams;
    const query = typeof q === 'string' ? q : '';

    return {
        title: query ? `Tìm kiếm: ${query} | VibeDigital` : 'Tìm kiếm | VibeDigital',
        description: `Kết quả tìm kiếm cho từ khóa "${query}"`,
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;
    const query = typeof q === 'string' ? q : '';

    if (!query) {
        return (
            <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 text-center">
                <div className="max-w-md mx-auto bg-slate-900/50 rounded-2xl border border-slate-800 p-12">
                    <Search className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-white mb-2">Nhập từ khóa để tìm kiếm</h2>
                    <p className="text-slate-400 mb-6">Hãy thử tìm "Plugin", "Template", "Font"...</p>
                    <Link href="/" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    // Search in database
    const products = await prisma.product.findMany({
        where: {
            isDeleted: false,
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">

                <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                        <Search size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Kết quả tìm kiếm cho:</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">"{query}"</h1>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                        <Database size={64} className="text-slate-700 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm nào</h3>
                        <p className="text-slate-400 max-w-md text-center mb-8">
                            Rất tiếc, chúng tôi không tìm thấy tài nguyên nào phù hợp với từ khóa "{query}".
                            Hãy thử tìm từ khóa khác hoặc xem các danh mục phổ biến.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium">
                                Về trang chủ
                            </Link>
                            <Link href="/category/plugin" className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors font-medium">
                                Xem Plugins
                            </Link>
                        </div>
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

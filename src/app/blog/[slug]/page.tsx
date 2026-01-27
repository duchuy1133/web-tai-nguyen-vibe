
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ChevronLeft, Calendar, User, ShoppingCart, Star } from 'lucide-react';
import { formatVND } from '@/lib/utils';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const post = await prisma.post.findUnique({
        where: { slug: decodedSlug },
    });

    if (!post) return { title: 'Not Found' };

    return {
        title: `${post.title} - Vibe Digital Blog`,
        description: post.excerpt,
    };
}

export const revalidate = 60;

// Helper to get random products (mock random by taking first 4 for now, 
// since Prisma random is complex across DBs)
async function getRandomProducts() {
    try {
        const products = await prisma.product.findMany({
            where: { isDeleted: false },
            take: 4,
            orderBy: { createdAt: 'desc' } // Just take latest for now
        });
        return products;
    } catch (e) {
        return [];
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    // Fetch Post and Random Products concurrently
    const [post, randomProducts] = await Promise.all([
        prisma.post.findUnique({ where: { slug: decodedSlug } }),
        getRandomProducts()
    ]);

    if (!post) notFound();

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Hero Header */}
            <div className="relative w-full h-[60vh] min-h-[400px] flex items-end pb-12">
                <div className="absolute inset-0">
                    {post.thumbnail && (
                        <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover opacity-30 blur-sm"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="mb-6">
                        <Link href="/blog" className="inline-flex items-center text-orange-400 hover:text-white transition-colors text-sm font-medium tracking-wide uppercase">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Quay lại
                        </Link>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                <User className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs text-left">Tác giả</p>
                                <p className="text-white">Vibe Editor AI</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-800 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-slate-500" />
                            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8">
                        {/* Featured Image (Clear) */}
                        {post.thumbnail && (
                            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-12">
                                <Image
                                    src={post.thumbnail}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-100 prose-p:text-slate-300 prose-a:text-orange-400 hover:prose-a:text-orange-300 prose-strong:text-white prose-li:text-slate-300">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Promo Card */}
                        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-orange-900/20">
                            <h3 className="text-2xl font-bold mb-2">Trở thành VIP Member</h3>
                            <p className="opacity-90 mb-6 text-sm">Truy cập không giới hạn kho tài nguyên chỉnh sửa video chuyên nghiệp.</p>
                            <Link href="/vip" className="inline-block w-full py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-xl">
                                Xem gói ưu đãi
                            </Link>
                        </div>

                        {/* Best Selling Products */}
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <h3 className="text-xl font-bold text-white">Tài nguyên Hot</h3>
                            </div>

                            <div className="space-y-4">
                                {randomProducts.map((product) => (
                                    <Link href={`/products/${product.id}`} key={product.id} className="group flex gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors">
                                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-950 border border-slate-700">
                                            <Image
                                                src={product.thumbnailUrl}
                                                alt={product.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="text-sm font-bold text-slate-200 group-hover:text-orange-400 transition-colors line-clamp-2 mb-1">
                                                {product.title}
                                            </h4>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-amber-500 font-bold text-sm">
                                                    {formatVND((product.price / 100) * 25000)}
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                    <ShoppingCart size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                                <Link href="/" className="text-sm text-slate-400 hover:text-white hover:underline">
                                    Xem tất cả sản phẩm &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

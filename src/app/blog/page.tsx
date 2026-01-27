
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog & Tài liệu - Vibe Digital',
    description: 'Chia sẻ kiến thức, kỹ thuật và tài nguyên mới nhất cho Video Editor.',
};

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function BlogPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                    Tài nguyên & Kiến thức
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Cập nhật xu hướng mới nhất trong ngành Video Editing.
                </p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center text-slate-500 py-20">
                    Chưa có bài viết nào. Hãy quay lại sau nhé!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post.id}
                            className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col"
                        >
                            <div className="aspect-video relative overflow-hidden bg-slate-900">
                                {post.thumbnail ? (
                                    <Image
                                        src={post.thumbnail}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h2 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-purple-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-800/50">
                                    <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span className="text-purple-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                        Đọc tiếp &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

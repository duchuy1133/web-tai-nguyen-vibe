
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ChevronLeft, Calendar, User } from 'lucide-react';

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

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const post = await prisma.post.findUnique({
        where: { slug: decodedSlug },
    });

    if (!post) notFound();

    return (
        <div className="container mx-auto px-4 py-24">
            {/* Breadcrumb / Back */}
            <div className="mb-8">
                <Link href="/blog" className="inline-flex items-center text-slate-400 hover:text-purple-400 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Quay lại Blog
                </Link>
            </div>

            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Vibe Editor AI
                    </span>
                </div>
            </div>

            {/* Featured Image */}
            {post.thumbnail && (
                <div className="relative w-full aspect-video max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 mb-16 border border-slate-800">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Content */}
            <div className="max-w-3xl mx-auto prose prose-invert prose-lg prose-slate prose-headings:text-purple-100 prose-a:text-purple-400">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </div>
    );
}

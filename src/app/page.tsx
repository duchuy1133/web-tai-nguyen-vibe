import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight, Sparkles, Zap, DollarSign, Database } from "lucide-react";
import prisma from "@/lib/prisma";
import Image from "next/image";

// Helper to map data
const mapProduct = (p: any) => ({
  ...p,
  thumbnail: p.thumbnailUrl || p.thumbnail, // fallback safely
});

export const revalidate = 60;

export default async function Home() {
  // 1. Data Logic
  const [latestProducts, plugins, templates, posts] = await Promise.all([
    // Latest 8 items
    prisma.product.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    // Plugins (take 8)
    prisma.product.findMany({
      where: { isDeleted: false, category: 'PLUGIN' },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    // Templates (take 8)
    prisma.product.findMany({
      where: { isDeleted: false, category: 'TEMPLATE' },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    // Latest Posts for Blog section
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Kept as requested for professional look */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-900/40 via-slate-950 to-slate-950 -z-10" />

        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6 animate-fade-in-up">
            <Sparkles size={16} />
            <span>Tài nguyên mới: Tháng 2/2026</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-tight">
            Nâng tầm video của bạn với <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">tài nguyên chuyên nghiệp</span>.
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#latest" className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
              Khám phá ngay
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Giao diện (UI) - Main Content */}
      <div className="space-y-20 pb-20 bg-slate-950">

        {/* Section 1: Tài nguyên mới cập nhật */}
        <section id="latest" className="container mx-auto px-4">
          <SectionHeader title="🔥 Tài nguyên mới cập nhật" link="/products" />
          <ProductGrid products={latestProducts.map(mapProduct)} />
        </section>

        {/* Section 2: Plugins Dựng Phim */}
        <section className="container mx-auto px-4">
          <SectionHeader title="🛠️ Plugins Dựng Phim" link="/category/plugin" />
          <ProductGrid products={plugins.map(mapProduct)} />
        </section>

        {/* Section 3: Project Templates */}
        <section className="container mx-auto px-4">
          <SectionHeader title="🎬 Project Templates" link="/category/template" />
          <ProductGrid products={templates.map(mapProduct)} />
        </section>

      </div>

      {/* Latest Blog Posts - Kept at bottom */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <SectionHeader title="Kiến thức & Hướng dẫn" link="/blog" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {posts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-900">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-800/50">
                    <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

// Sub-components for cleaner code

function SectionHeader({ title, link }: { title: string; link: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white relative z-10 flex items-center gap-2">
        {title}
      </h2>
      <Link href={link} className="text-sm font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors group">
        Xem tất cả
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

function ProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
        <Database className="mx-auto h-12 w-12 text-slate-600 mb-4" />
        <h3 className="text-xl font-medium text-slate-300">Chưa có sản phẩm nào</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
            thumbnail: product.thumbnail, // mapped above
          }}
        />
      ))}
    </div>
  );
}

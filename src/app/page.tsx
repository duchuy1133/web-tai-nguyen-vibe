import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight, Sparkles, Zap, DollarSign, Database } from "lucide-react";
import prisma from "@/lib/prisma";

// Server Component Fetching
async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Chợ tài nguyên hàng đầu cho Video Editors. Plugins, Templates và Fonts chất lượng cao hỗ trợ tối đa cho công việc sáng tạo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#products" className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
              Khám phá ngay
              <ArrowRight size={20} />
            </Link>
            <Link href="/vip" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 relative overflow-hidden group">
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-2">
                <Sparkles size={20} className="text-yellow-200" />
                <span>Trở thành VIP (Tải Free)</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Floating Effects */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-amber-500/20 blur-[60px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-orange-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-950/50">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Tài nguyên nổi bật</h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-8">
            <Link href="/" className="px-5 py-2 rounded-full text-sm font-medium transition-all bg-white text-slate-950 border border-transparent">
              Tất cả
            </Link>
            <Link href="/category/plugin" className="px-5 py-2 rounded-full text-sm font-medium transition-all bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800">
              Plugins
            </Link>
            <Link href="/category/template" className="px-5 py-2 rounded-full text-sm font-medium transition-all bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800">
              Mẫu (Template)
            </Link>
            <Link href="/category/luts" className="px-5 py-2 rounded-full text-sm font-medium transition-all bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800">
              Luts & Màu
            </Link>
            <Link href="/category/sound" className="px-5 py-2 rounded-full text-sm font-medium transition-all bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800">
              Âm thanh
            </Link>
          </div>
        </div>

        <ProductGrid products={products} />
      </section>

      {/* Value Props */}
      <section className="py-20 border-t border-slate-900">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="text-yellow-400" />}
            title="Tải xuống ngay lập tức"
            desc="Nhận link tải tốc độ cao qua email ngay sau khi thanh toán thành công."
          />
          <FeatureCard
            icon={<Sparkles className="text-purple-400" />}
            title="Chất lượng Premium"
            desc="Được chọn lọc kỹ càng từ những Creator hàng đầu trong ngành."
          />
          <FeatureCard
            icon={<DollarSign className="text-green-400" />}
            title="Thanh toán an toàn"
            desc="Hỗ trợ thanh toán qua chuyển khoản ngân hàng & QR Code tiện lợi."
          />
        </div>
      </section>
    </div>
  );
}

function ProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
        <Database className="mx-auto h-12 w-12 text-slate-600 mb-4" />
        <h3 className="text-xl font-medium text-slate-300">Chưa có sản phẩm nào</h3>
        <p className="text-slate-500">Vui lòng quay lại sau.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            title: product.title,
            // Mock conversion: Cents USD -> VND (approx x250)
            // Example: 2900 cents = $29.00 -> 29 * 25,000 = 725,000 VND
            price: (product.price / 100) * 25000,
            category: product.category,
            thumbnail: product.thumbnailUrl,
          }}
        />
      ))}
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors">
      <div className="w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center mb-4 text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

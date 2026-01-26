import prisma from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ShoppingCart,
    CreditCard,
    ChevronRight,
    CheckCircle2,
    FileBox,
    Layers,
    MonitorPlay,
    Calendar,
    Hash,
    ShieldCheck
} from "lucide-react";
import AddToCartButtons from "@/components/ui/AddToCartButtons";

// Force dynamic rendering since we are fetching based on ID
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

async function getProduct(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) return { title: "Sản phẩm không tồn tại" };

    return {
        title: `${product.title} | VibeDigital`,
        description: product.description,
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-12 pb-20">
            {/* Breadcrumbs */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center text-sm text-slate-400">
                    <Link href="/" className="hover:text-amber-400 transition-colors">Trang chủ</Link>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="uppercase tracking-wider font-medium text-slate-300">{product.category}</span>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="text-white truncate max-w-[200px] md:max-w-md">{product.title}</span>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left Column: Visuals */}
                    <div className="space-y-6">
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-orange-500/10 bg-slate-900 group">
                            <Image
                                src={product.thumbnailUrl}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Mock thumbnails gallery */}
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="aspect-video rounded-lg bg-slate-800 border border-slate-700/50 hover:border-amber-500 transition-colors cursor-pointer relative overflow-hidden opacity-70 hover:opacity-100">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MonitorPlay size={20} className="text-slate-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Info & Actions */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider mb-4">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                    <span className="ml-2 text-slate-300 font-medium">5.0 (24 reviews)</span>
                                </div>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <span className="flex items-center gap-1 text-green-400">
                                    <CheckCircle2 size={14} />
                                    Sẵn sàng tải về
                                </span>
                            </div>

                            <div className="text-4xl font-bold text-white mb-8 flex items-baseline gap-2">
                                {/* Mock price logic same as homepage */}
                                {formatVND((product.price / 100) * 25000)}
                                <span className="text-lg text-slate-500 font-normal line-through">
                                    {formatVND(((product.price / 100) * 25000) * 1.5)}
                                </span>
                            </div>

                            <AddToCartButtons product={{
                                id: product.id,
                                title: product.title,
                                price: (product.price / 100) * 25000,
                                category: product.category,
                                thumbnail: product.thumbnailUrl
                            }} />

                            <div className="flex items-center gap-4 text-xs text-slate-500 justify-center sm:justify-start">
                                <span className="flex items-center gap-1"><ShieldCheck size={14} /> Thanh toán bảo mật</span>
                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Support 24/7</span>
                            </div>
                        </div>

                        {/* Specs Table */}
                        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Thông số kỹ thuật</h3>
                            <div className="space-y-4">
                                <SpecRow icon={<FileBox size={18} />} label="Dung lượng" value="1.2 GB" />
                                <SpecRow icon={<Layers size={18} />} label="Định dạng" value=".prproj, .aep, .mogrt" />
                                <SpecRow icon={<MonitorPlay size={18} />} label="Tương thích" value="Premiere Pro CC 2024+" />
                                <SpecRow icon={<Hash size={18} />} label="Phiên bản" value="v2.1.0 (Stable)" />
                                <SpecRow icon={<Calendar size={18} />} label="Cập nhật lần cuối" value={new Date(product.updatedAt).toLocaleDateString('vi-VN')} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="mt-20 max-w-4xl">
                    <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-amber-500 pl-4">Mô tả chi tiết</h2>
                    <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed max-w-none
                        [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-orange-500 [&>h3]:mt-8 [&>h3]:mb-3
                        [&>p]:text-slate-300 [&>p]:mb-4 [&>p]:leading-7
                        [&>ul]:list-disc [&>ul]:list-inside [&>ul]:text-slate-300 [&>ul]:mb-6 [&>ul]:space-y-2 [&>ul]:pl-2
                        [&>li]:marker:text-amber-500
                        [&>strong]:text-white [&>strong]:font-semibold [&>strong]:text-amber-400/90
                    ">
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        <p className="mt-4">
                            Gói tài nguyên này được thiết kế dành riêng cho các video editor chuyên nghiệp và content creator.
                            Dễ dàng sử dụng chỉ với thao tác kéo thả, tiết kiệm hàng giờ đồng hồ chỉnh sửa thủ công.
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-400">
                            <li>Chất lượng 4K chuẩn điện ảnh.</li>
                            <li>Không cần cài đặt plugin thứ 3.</li>
                            <li>Hướng dẫn sử dụng chi tiết đi kèm.</li>
                            <li>Dễ dàng tùy chỉnh màu sắc và thông số.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpecRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="text-amber-500">{icon}</div>
                <span className="font-medium text-sm">{label}</span>
            </div>
            <span className="text-slate-200 font-medium text-sm text-right">{value}</span>
        </div>
    )
}

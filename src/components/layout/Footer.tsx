'use client';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                                V
                            </div>
                            <span className="text-xl font-bold text-white">VibeDigital</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Kho tài nguyên số cao cấp dành cho Video Editors và Creators chuyên nghiệp. Nâng tầm sản phẩm của bạn ngay hôm nay.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Khám phá</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/" className="hover:text-orange-500 transition-colors">Tất cả tài nguyên</Link></li>
                            <li><Link href="/category/plugin" className="hover:text-orange-500 transition-colors">Premiere Plugins</Link></li>
                            <li><Link href="/category/font" className="hover:text-orange-500 transition-colors">Fonts & Typography</Link></li>
                            <li><Link href="/category/stock" className="hover:text-orange-500 transition-colors">Stock Footage</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/vip" className="hover:text-orange-500 transition-colors">Trung tâm trợ giúp (VIP)</Link></li>
                            <li><Link href="/policy" className="hover:text-orange-500 transition-colors">Bản quyền (Licensing)</Link></li>
                            <li><Link href="/policy" className="hover:text-orange-500 transition-colors">Điều khoản sử dụng</Link></li>
                            <li><Link href="/policy" className="hover:text-orange-500 transition-colors">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Đăng ký nhận tin</h4>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <button
                                onClick={() => alert("Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông báo khi có tài nguyên mới.")}
                                className="bg-amber-500 hover:bg-amber-400 text-white p-2 rounded-lg transition-colors font-medium text-sm"
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>&copy; 2026 VibeDigital Assets. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-slate-300">Twitter</Link>
                        <Link href="#" className="hover:text-slate-300">Instagram</Link>
                        <Link href="#" className="hover:text-slate-300">YouTube</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

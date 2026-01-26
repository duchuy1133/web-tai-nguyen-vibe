'use client';

import { useCartStore } from "@/store/useCartStore";
import { formatVND } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createOrder } from "@/actions/checkout";
import { BANK_CONFIG } from "@/lib/bankConfig";
import {
    ShieldCheck,
    Lock,
    CreditCard,
    ChevronLeft,
    ShoppingBag,
    CheckCircle2,
    QrCode,
    Loader2
} from "lucide-react";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        setMounted(true);
        // Redirect if cart is empty and not success
        if (items.length === 0 && !orderSuccess) {
            // Optional: router.push('/'); 
        }
    }, [items.length, orderSuccess]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createOrder(
                formData.email,
                items.map(i => ({ id: i.id, price: i.price }))
            );

            if (result.success) {
                setOrderId(result.orderId!);
                setOrderSuccess(true);
                clearCart();
            } else {
                alert("Lỗi: " + result.error);
            }
        } catch (err) {
            console.error(err);
            alert("Đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    // SUCCESS STEP (TING TING)
    if (orderSuccess) {
        // VietQR QuickLink (Compact mode)
        // https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.jpg?amount=<AMOUNT>&addInfo=<INFO>
        // Note: total() returns VND Number.
        const qrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.BANK_ID}-${BANK_CONFIG.ACCOUNT_NO}-compact.jpg?amount=${total()}&addInfo=${orderId}`;

        return (
            <div className="min-h-screen pt-24 pb-20 bg-slate-950 flex items-center justify-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="text-green-500" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Đặt hàng thành công!</h1>
                        <p className="text-slate-400 mb-8">Mã đơn hàng: <span className="text-amber-500 font-mono font-bold">{orderId}</span></p>

                        <div className="bg-white p-4 rounded-xl inline-block mb-8 shadow-lg">
                            <Image
                                src={qrUrl}
                                alt="VietQR Payment"
                                width={300}
                                height={300}
                                className="mix-blend-multiply"
                                unoptimized
                            />
                        </div>

                        <p className="text-slate-300 font-medium mb-2">Vui lòng quét mã QR để thanh toán</p>
                        <p className="text-2xl font-bold text-orange-500 mb-8">{formatVND(total())}</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                            >
                                Về trang chủ
                            </Link>
                            <button
                                className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-600/25 transition-all"
                                onClick={() => alert("Hệ thống đang kiểm tra tiền về... (Giả lập: Đã nhận tiền!)")}
                            >
                                Đã thanh toán xong
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // CHECKOUT UI
    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-8 text-slate-400 hover:text-white w-fit transition-colors">
                    <ChevronLeft size={20} />
                    <Link href="/">Tiếp tục mua hàng</Link>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 flex items-center gap-3">
                    <CreditCard className="text-orange-500" />
                    Thanh toán an toàn
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* LEFT: FORM */}
                    <div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold text-white mb-6">Thông tin khách hàng</h2>
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-sm font-medium">Họ và tên</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                        placeholder="Nhập họ tên của bạn"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-sm font-medium">Email nhận sản phẩm</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                        placeholder="example@gmail.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Lock size={12} /> Link tải sẽ được gửi bảo mật qua email này.
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="mt-8 flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                            <ShieldCheck className="text-amber-500 shrink-0" size={24} />
                            <div>
                                <h3 className="font-bold text-amber-500 text-sm">Cam kết bảo hành</h3>
                                <p className="text-amber-500/80 text-sm mt-1">Hoàn tiền 100% nếu sản phẩm lỗi hoặc không đúng mô tả. Hỗ trợ kỹ thuật trọn đời.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ORDER SUMMARY */}
                    <div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                                <span>Đơn hàng của bạn</span>
                                <span className="text-slate-500 text-base font-normal">{items.length} sản phẩm</span>
                            </h2>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {items.length === 0 ? (
                                    <p className="text-slate-500 italic">Giỏ hàng đang trống.</p>
                                ) : (
                                    items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 bg-slate-800 rounded-lg overflow-hidden shrink-0">
                                                <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-slate-300 font-medium text-sm line-clamp-2">{item.title}</h4>
                                                <p className="text-slate-500 text-xs mt-1 uppercase">{item.category}</p>
                                                <p className="text-white font-bold text-sm mt-1">{formatVND(item.price)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t border-slate-800 pt-6 space-y-3">
                                <div className="flex justify-between text-slate-400">
                                    <span>Tạm tính</span>
                                    <span>{formatVND(total())}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Giảm giá</span>
                                    <span>0đ</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-slate-800">
                                    <span>Tổng cộng</span>
                                    <span className="text-orange-500">{formatVND(total())}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading || items.length === 0}
                                className="w-full mt-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <ShoppingBag size={20} />}
                                {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN & THANH TOÁN"}
                            </button>

                            <p className="text-xs text-center text-slate-500 mt-4">
                                Bằng việc thanh toán, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

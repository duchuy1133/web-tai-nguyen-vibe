'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { purchaseProduct } from "@/actions/checkout";
import { formatVND } from "@/lib/utils";
import {
    ShieldCheck,
    CreditCard,
    ShoppingBag,
    Loader2,
    Wallet,
    UserCircle,
    AlertCircle,
    ImageIcon,
    ArrowLeft
} from "lucide-react";

import { useCartStore } from '@/store/useCartStore';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const productId = searchParams.get('id');

    // Cart Store
    const { items: cartItems, total: cartTotal, clearCart } = useCartStore();

    // States
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Data States
    const [user, setUser] = useState<any>(null);
    const [balance, setBalance] = useState(0);
    const [singleProduct, setSingleProduct] = useState<any>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Derived State
    const isBuyNow = !!productId;
    const checkoutItems = isBuyNow ? (singleProduct ? [singleProduct] : []) : cartItems;
    const totalAmount = isBuyNow ? (singleProduct?.price || 0) : cartTotal();

    // Fetching Flag
    const isFetching = useRef(false);

    // --- NUCLEAR ERROR SUPPRESSION START ---
    useEffect(() => {
        const originalError = console.error;
        console.error = (...args) => {
            const errStr = args[0]?.toString() || '';
            if (errStr.includes('aborted') || errStr.includes('AbortError') || errStr.includes('signal is aborted') || errStr.includes('AuthSessionMissing')) return;
            originalError.apply(console, args);
        };
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason?.toString() || '';
            if (reason.includes('aborted') || reason.includes('AbortError') || reason.includes('signal is aborted')) event.preventDefault();
        };
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        return () => {
            console.error = originalError;
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        }
    }, []);
    // --- NUCLEAR ERROR SUPPRESSION END ---

    // FETCH DATA LOGIC
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            // 2. Lock
            if (isFetching.current) return;
            isFetching.current = true;
            if (isMounted) setFetchError(null);

            try {
                // Step A: Fetch Product (If Buy Now)
                if (isBuyNow) {
                    const { data: productData, error: productError } = await supabase
                        .from('products')
                        .select('*')
                        .eq('id', productId)
                        .single();

                    if (!isMounted) return;

                    if (productError || !productData) {
                        setFetchError("Không tìm thấy thông tin sản phẩm.");
                        setLoading(false);
                        return;
                    }
                    setSingleProduct(productData);
                } else {
                    // Cart Mode: Check if empty
                    if (cartItems.length === 0) {
                        setFetchError("Giỏ hàng đang trống. Vui lòng thêm sản phẩm.");
                        setLoading(false);
                        return;
                    }
                }

                // Step B: Fetch User
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (!isMounted) return;

                if (authUser) {
                    setUser(authUser);
                    // Step C: Fetch Balance
                    const { data: profile } = await supabase
                        .from('users')
                        .select('balance')
                        .eq('id', authUser.id)
                        .single();

                    if (isMounted) {
                        setBalance(profile?.balance || 0);
                    }
                }

            } catch (err: any) {
                const msg = err.message || err.toString();
                if (!msg.includes('aborted') && !msg.includes('AbortError')) {
                    console.warn("System Error:", err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    isFetching.current = false;
                }
            }
        };

        const timeoutId = setTimeout(fetchData, 100);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            isFetching.current = false;
        };
    }, [productId, isBuyNow]); // Removed cartItems dependency to avoid loop, check assumes cart static during checkout

    // HANDLE PAYMENT
    const handlePayment = async () => {
        if (!user) return alert("Vui lòng đăng nhập để thanh toán!");
        if (balance < totalAmount) return alert("Số dư ví không đủ. Vui lòng nạp thêm!");

        if (!confirm(`Xác nhận thanh toán tổng cộng ${formatVND(totalAmount)}?`)) return;

        setProcessing(true);
        try {
            let successCount = 0;
            let firstError = '';

            // Process Items Sequentially
            for (const item of checkoutItems) {
                const result = await purchaseProduct(user.id, item.id);
                if (result.success) {
                    successCount++;
                } else {
                    firstError = result.error || 'Lỗi không xác định';
                    console.error(`Failed to buy ${item.id}:`, result.error);
                }
            }

            if (successCount > 0) {
                // UPDATE NAVBAR BALANCE
                window.dispatchEvent(new Event('BALANCE_UPDATED'));

                if (successCount === checkoutItems.length) {
                    alert("Thanh toán thành công toàn bộ đơn hàng!");
                    if (!isBuyNow) clearCart(); // Clear cart if bought all
                    router.push('/profile');
                } else {
                    alert(`Thanh toán thành công ${successCount}/${checkoutItems.length} món. Lỗi: ${firstError}`);
                    router.push('/profile');
                }
            } else {
                alert(`Giao dịch thất bại: ${firstError}`);
            }

        } catch (error: any) {
            alert(`Lỗi hệ thống: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    // ERROR UI
    if (fetchError) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 pb-20 flex flex-col items-center justify-center text-center px-4">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h1 className="text-white text-2xl font-bold mb-2">Thông báo</h1>
                <p className="text-slate-400 mb-6">{fetchError}</p>
                <Link href="/" className="px-6 py-3 bg-slate-800 rounded-xl text-white font-bold hover:bg-slate-700 transition-colors">
                    Về trang chủ
                </Link>
            </div>
        )
    }

    // MAIN UI
    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-950">
            <div className="container mx-auto px-4 max-w-6xl">

                <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8">
                    <ArrowLeft size={18} className="mr-2" /> Tiếp tục mua sắm
                </Link>

                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
                    <CreditCard className="text-amber-500" /> Xác nhận thanh toán
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT: User Info & Payment Method */}
                    <div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                                    <div className="h-24 bg-slate-800 rounded"></div>
                                </div>
                            ) : user ? (
                                // LOGGED IN VIEW
                                <>
                                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Wallet className="text-amber-500" size={24} /> Phương thức thanh toán
                                    </h2>

                                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-400">Tài khoản ví</span>
                                            <span className="text-white font-medium">{user.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Số dư hiện tại</span>
                                            <span className="text-2xl font-bold text-amber-500">{formatVND(balance)}</span>
                                        </div>
                                    </div>

                                    {balance < totalAmount && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start gap-2">
                                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                            <div>
                                                <strong>Số dư không đủ!</strong>
                                                <p>Vui lòng nạp thêm tiền để thực hiện giao dịch này.</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // GUEST VIEW
                                <>
                                    <h2 className="text-xl font-bold text-white mb-4">Thông tin khách hàng</h2>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-amber-500/10 rounded-xl flex gap-3 text-sm border border-amber-500/20">
                                            <UserCircle className="text-amber-500 shrink-0" size={20} />
                                            <div className="text-amber-200">
                                                <p className="mb-1 font-bold text-amber-500">Bạn chưa đăng nhập!</p>
                                                <p>Vui lòng <Link href={`/login?next=/checkout${isBuyNow ? `?id=${productId}` : ''}`} className="underline font-bold text-white hover:text-amber-400">Đăng nhập ngay</Link> để thanh toán.</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Order Info */}
                    <div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6">Đơn hàng ({checkoutItems.length} sản phẩm)</h2>

                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-20 bg-slate-800 rounded"></div>
                                    <div className="h-20 bg-slate-800 rounded"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {checkoutItems.map((item: any, idx: number) => (
                                            <div key={`${item.id}-${idx}`} className="flex gap-4">
                                                <div className="relative w-16 h-16 bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                                                    <img
                                                        src={item.thumbnail || item.thumbnailUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-medium line-clamp-2 text-sm">{item.title}</h3>
                                                    <p className="text-slate-500 text-xs uppercase">{item.category}</p>
                                                    <p className="text-orange-400 font-bold text-sm">{formatVND(item.price)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-800 pt-4 mb-6">
                                        <div className="flex justify-between items-center text-white text-xl font-bold">
                                            <span>Tổng thanh toán</span>
                                            <span className="text-orange-500 text-2xl">{formatVND(totalAmount)}</span>
                                        </div>
                                    </div>

                                    {user ? (
                                        <button
                                            onClick={handlePayment}
                                            disabled={processing || balance < totalAmount}
                                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
                                        >
                                            {processing ? <Loader2 className="animate-spin" /> : <ShoppingBag size={20} />}
                                            {processing ? "ĐANG XỬ LÝ..." : "THANH TOÁN NGAY"}
                                        </button>
                                    ) : (
                                        <div className="w-full py-4 bg-slate-800 text-slate-500 font-bold rounded-xl text-center cursor-not-allowed border border-slate-700">
                                            Vui lòng đăng nhập để tiếp tục
                                        </div>
                                    )}

                                    <p className="text-center text-slate-500 text-xs mt-4 flex items-center justify-center gap-1">
                                        <ShieldCheck size={12} /> Giao dịch được bảo mật 100%
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpinnerWithText({ text }: { text: string }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-amber-500" size={40} />
            <span className="text-slate-400 font-medium">{text}</span>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><SpinnerWithText text="Đang tải trang thanh toán..." /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}

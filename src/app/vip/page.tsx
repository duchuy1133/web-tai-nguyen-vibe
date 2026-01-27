import { CheckCircle2, Crown, Zap, ShieldCheck, Gift, Infinity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "@/components/ui/CountdownTimer";

export default function VipPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-950">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold mb-6 animate-pulse">
                        <Crown size={20} />
                        <span>ƯU ĐÃI ĐẶC BIỆT THÁNG 2</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Trở thành <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Thành viên VIP</span> <br />
                        Tải Không Giới Hạn.
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        Sở hữu trọn bộ kho tài nguyên khổng lồ. Cập nhật liên tục. Thanh toán một lần, dùng trọn đời.
                    </p>
                </div>

                {/* Pricing Card */}
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl overflow-hidden relative">
                    {/* Glow Effect */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />

                    {/* Left: Benefits */}
                    <div className="space-y-6 relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-8">Quyền lợi đặc quyền</h2>
                        <div className="space-y-4">
                            <BenefitItem text="Tải xuống MIỄN PHÍ toàn bộ tài nguyên trên web" />
                            <BenefitItem text="Truy cập vĩnh viễn (Lifetime Access)" />
                            <BenefitItem text="Kho 5000+ Plugins, Templates, Luts cập nhật mới mỗi ngày" />
                            <BenefitItem text="Hỗ trợ kỹ thuật 1-1 qua Zalo/UltraViewer" />
                            <BenefitItem text="Yêu cầu tài nguyên theo ý muốn" />
                            <BenefitItem text="Không giới hạn tốc độ tải" />
                        </div>
                    </div>

                    {/* Right: Pricing & CTA */}
                    <div className="bg-slate-950/50 rounded-2xl p-8 border border-slate-800 text-center relative z-10 w-full">
                        <CountdownTimer />

                        <div className="mb-2 text-slate-400 text-sm uppercase tracking-widest">Gói Trọn Đời</div>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="text-2xl text-slate-500 line-through">1.990.000đ</span>
                            <span className="text-5xl font-bold text-white">499.000đ</span>
                        </div>

                        <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-lg relative group">
                            <div className="absolute inset-0 bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            {/* Real VietQR Code */}
                            <div className="relative w-64 h-64 bg-white rounded-lg overflow-hidden">
                                <Image
                                    src="https://img.vietqr.io/image/TCB-19030722538010-compact2.jpg?amount=499000&addInfo=VIP%20Trọn%20Đời&accountName=NGUYEN DUC HUY"
                                    alt="Mã QR Thanh Toán VIP"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>

                        <p className="text-slate-300 text-sm mb-1 font-medium">
                            Nội dung: <span className="text-amber-500">VIP + Email của bạn</span>
                        </p>
                        <p className="text-slate-500 text-xs mb-8">
                            (Ví dụ: VIP nguyenvan@gmail.com)
                        </p>

                        <a
                            href="https://zalo.me/0966205794"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" className="w-6 h-6 bg-white rounded-full p-0.5" alt="Zalo" />
                            LIÊN HỆ KÍCH HOẠT (Zalo)
                        </a>

                        <p className="mt-4 text-xs text-slate-500">
                            *Cam kết hoàn tiền trong 3 ngày nếu không hài lòng.
                        </p>
                    </div>
                </div>

                {/* Setup Steps */}
                <div className="max-w-4xl mx-auto mt-20 grid md:grid-cols-3 gap-8 text-center">
                    <Step number="1" title="Thanh toán" desc="Chuyển khoản theo mã QR hoặc STK ngân hàng." />
                    <Step number="2" title="Gửi biên lai" desc="Chụp ảnh màn hình gửi qua Zalo cho Admin." />
                    <Step number="3" title="Kích hoạt VIP" desc="Tài khoản được nâng cấp trong 5 phút. Tải thả ga!" />
                </div>

            </div>
        </div>
    );
}

function BenefitItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-1 rounded-full bg-green-500/20 text-green-500 mt-0.5">
                <CheckCircle2 size={16} />
            </div>
            <span className="text-slate-300 font-medium">{text}</span>
        </div>
    )
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4 border border-slate-700">
                {number}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm">{desc}</p>
        </div>
    )
}

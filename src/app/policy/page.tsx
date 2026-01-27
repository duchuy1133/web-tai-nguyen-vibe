export default function PolicyPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-950">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-10 border-l-4 border-amber-500 pl-4">
                    Chính sách & Điều khoản
                </h1>

                <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed max-w-none">

                    <h3>1. Điều khoản sử dụng</h3>
                    <p>
                        Chào mừng bạn đến với <strong>VibeDigital</strong>. Khi truy cập website của chúng tôi, bạn đồng ý với các điều khoản này.
                        Tất cả tài nguyên trên website được cung cấp "như nguyên bản" (as-is). Chúng tôi không chịu trách nhiệm về bất kỳ lỗi nào phát sinh trong quá trình sử dụng.
                    </p>

                    <h3>2. Bản quyền & Cấp phép (Licensing)</h3>
                    <p>
                        <ul>
                            <li><strong>Quyền sử dụng cá nhân:</strong> Bạn được phép sử dụng tài nguyên cho các dự án cá nhân hoặc thương mại của riêng bạn.</li>
                            <li><strong>Cấm bán lại:</strong> Nghiêm cấm hành vi bán lại, chia sẻ lại, hoặc phân phối tài nguyên dưới dạng gói (pack) hoặc trên các nền tảng khác.</li>
                            <li><strong>VIP Membership:</strong> Thành viên VIP có quyền truy cập và tải xuống tài nguyên không giới hạn trong thời gian hiệu lực của gói.</li>
                        </ul>
                    </p>

                    <h3>3. Chính sách bảo mật</h3>
                    <p>
                        Chúng tôi cam kết bảo mật thông tin cá nhân của bạn (Email, Tên). Chúng tôi không chia sẻ dữ liệu này cho bên thứ ba.
                        Thông tin thanh toán được xử lý trực tiếp qua ngân hàng, chúng tôi không lưu trữ thông tin thẻ của bạn.
                    </p>

                    <h3>4. Chính sách hoàn tiền</h3>
                    <p>
                        Do tính chất của sản phẩm kỹ thuật số (Digital Products), chúng tôi chỉ hỗ trợ hoàn tiền trong vòng <strong>3 ngày</strong> nếu:
                        <ul>
                            <li>Tài nguyên bị lỗi kỹ thuật không thể khắc phục.</li>
                            <li>Link tải bị hỏng và không thể khôi phục.</li>
                        </ul>
                        Vui lòng liên hệ Admin để được hỗ trợ chi tiết.
                    </p>

                    <div className="mt-12 p-6 bg-slate-900 rounded-xl border border-slate-800">
                        <p className="text-sm text-slate-400 mb-0">
                            Cập nhật lần cuối: 27/01/2026<br />
                            Mọi thắc mắc vui lòng liên hệ: support@vibedigital.com
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

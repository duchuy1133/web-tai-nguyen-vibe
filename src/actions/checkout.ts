'use server'

import prisma from "@/lib/prisma";

// Hàm thanh toán bằng Ví dư (Wallet Balance)
export async function purchaseProduct(userId: string, productId: string) {
    try {
        console.log(`Processing purchase: User ${userId} - Product ${productId}`);

        // 1. Lấy thông tin User và Product từ DB
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!user) return { success: false, error: "Không tìm thấy người dùng" };
        if (!product) return { success: false, error: "Sản phẩm không tồn tại" };

        // 2. Kiểm tra số dư
        if (user.balance < product.price) {
            return { success: false, error: "Số dư không đủ để thanh toán" };
        }

        // 3. Thực hiện Transaction (Trừ tiền + Tạo Order + Add vào Library/History nếu cần)
        const transactionResult = await prisma.$transaction(async (tx) => {
            // Trừ tiền user
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: product.price } },
            });

            if (updatedUser.balance < 0) {
                throw new Error("Số dư không đủ (Kiểm tra lại transaction)");
            }

            // Tạo Order thành công
            const newOrder = await tx.order.create({
                data: {
                    userEmail: user.email,
                    productId: productId,
                    status: 'COMPLETED',
                    transactionId: `WALLET-${Date.now()}`,
                }
            });

            return newOrder;
        });

        console.log("Purchase successful:", transactionResult.id);
        return { success: true, order: transactionResult };

    } catch (error: any) {
        console.error("Purchase error:", error);
        return { success: false, error: error.message || "Lỗi thanh toán ví" };
    }
}

export async function createOrder(email: string, items: any[]) {
    // Placeholder logic for cart - NOT USED in Quick Buy flow
    return { success: false, error: "Chức năng giỏ hàng tạm thời bị vô hiệu. Vui lòng mua ngay từng món." };
}

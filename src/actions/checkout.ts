'use server';

import prisma from "@/lib/prisma";

interface CheckoutItem {
    id: string; // Product ID
    price: number;
}

export async function createOrder(email: string, items: CheckoutItem[]) {
    if (!items.length) {
        return { success: false, error: "Giỏ hàng trống" };
    }

    // Generate a unique Transaction ID for this batch
    const transactionId = `ORD-${Date.now()}`;

    try {
        // Creating multiple orders because our schema maps 1 Order <-> 1 Product
        // We group them by transactionId
        await prisma.$transaction(
            items.map((item) =>
                prisma.order.create({
                    data: {
                        userEmail: email,
                        productId: item.id,
                        status: 'PENDING',
                        transactionId: transactionId,
                    },
                })
            )
        );

        return { success: true, orderId: transactionId };
    } catch (error) {
        console.error("Order process error:", error);
        return { success: false, error: "Lỗi xử lý đơn hàng" };
    }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, productId } = body;

        if (!userId || !productId) {
            return NextResponse.json(
                { error: "Missing userId or productId" },
                { status: 400 }
            );
        }

        // Start Transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch User (for Balance)
            const user = await tx.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new Error("USER_NOT_FOUND");
            }

            // 2. Fetch Product (for Price)
            const product = await tx.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new Error("PRODUCT_NOT_FOUND");
            }

            // 3. Check Balance
            if (user.balance < product.price) {
                throw new Error("INSUFFICIENT_BALANCE");
            }

            // 4. Deduct Balance
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    balance: {
                        decrement: product.price,
                    },
                },
            });

            // 5. Create Order
            const order = await tx.order.create({
                data: {
                    userEmail: user.email,
                    productId: product.id,
                    status: "COMPLETED",
                    transactionId: `TXN-${Date.now()}`,
                },
            });

            return {
                success: true,
                newBalance: updatedUser.balance,
                orderId: order.id,
                downloadLink: product.downloadLink, // Return link immediately
            };
        });

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Purchase error:", error);

        if (error.message === "USER_NOT_FOUND") {
            return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
        }
        if (error.message === "PRODUCT_NOT_FOUND") {
            return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
        }
        if (error.message === "INSUFFICIENT_BALANCE") {
            return NextResponse.json({ error: "Số dư không đủ. Vui lòng nạp thêm!" }, { status: 402 }); // 402 Payment Required
        }

        return NextResponse.json(
            { error: "Giao dịch thất bại. Vui lòng thử lại sau." },
            { status: 500 }
        );
    }
}

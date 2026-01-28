import prisma from "@/lib/prisma";

export async function getCurrentUser() {
    try {
        // Tạm thời lấy User đầu tiên trong DB để giả lập trạng thái đã đăng nhập
        // Khi có Supabase Auth thật, code sẽ là:
        /*
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        return await prisma.user.findUnique({ where: { email: user.email } });
        */

        const user = await prisma.user.findFirst();
        return user;
    } catch (error) {
        console.error("Failed to get current user:", error);
        return null;
    }
}

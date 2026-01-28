import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import PopularTags from "@/components/PopularTags";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeDigital | Premium Assets for Editors",
  description: "High-quality plugins, fonts, and templates for creative professionals.",
  keywords: ["premiere plugins", "fonts", "video templates", "editor assets"],
};

import CartDrawer from "@/components/cart/CartDrawer";

import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "bg-slate-950 text-slate-200 antialiased min-h-screen flex flex-col")}>
        <Navbar user={user} />
        <div className="pt-16">
          <PopularTags />
        </div>
        <CartDrawer />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

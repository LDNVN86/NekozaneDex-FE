import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { Header } from "@/shared/components/header";
// import { getCurrentUser } from "@/features/auth/server/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nekozanedex - Đọc Truyện Online",
  description:
    "Nền tảng đọc truyện online hàng đầu với hàng ngàn bộ truyện chất lượng cao. Cập nhật liên tục, giao diện đẹp mắt.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const user = await getCurrentUser();
  const user = {
    id: "10101010",
    email: "HelloWorld@gmail.com",
    username: "Bắn Tùm Lum",
    role: "sdasdasdasd",
    avatar_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIcvRzaIFXFDH97KSJHh179QIdId4Dovl5zQ&s",
    created_at: "currently",
  };

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header user={user} />
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

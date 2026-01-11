import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { TokenRefreshProvider } from "@/shared/components/token-refresh-provider";
import { Header } from "@/shared/components/header";
import { Toaster } from "@/shared/ui/sonner";
import "./globals.css";
import { getAuthFromCookie } from "@/features/auth/server";

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
  const authResult = await getAuthFromCookie();
  const user = authResult.success ? authResult.data : null;

  // Get current pathname to conditionally hide header for admin routes
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdminRoute = pathname.startsWith("/server/admin");

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TokenRefreshProvider>
            {!isAdminRoute && <Header user={user} />}
            <main className={isAdminRoute ? "" : "min-h-screen"}>
              {children}
            </main>
            <Toaster position="bottom-right" richColors />
          </TokenRefreshProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

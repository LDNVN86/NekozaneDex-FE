import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Nekozanedex
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2026 Nekozanedex. Nền tảng đọc truyện online hàng đầu.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/client/about"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Giới thiệu
            </Link>
            <Link
              href="/client/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Liên hệ
            </Link>
            <Link
              href="/client/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Điều khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

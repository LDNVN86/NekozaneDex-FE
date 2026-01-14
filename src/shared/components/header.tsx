"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Book,
  Search,
  Sun,
  Moon,
  Menu,
  User,
  LogIn,
  Heart,
  History,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/shared/ui/sheet";
import { cn } from "@/shared/lib/utils";
import { SearchSuggestions } from "@/shared/components/search-suggestions";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import type { AuthUser } from "@/features/auth/types/auth";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Thể loại", href: "/client/genres" },
  { name: "Xếp hạng", href: "/client/rankings" },
  { name: "Tìm kiếm", href: "/client/search" },
];

type HeaderProps = {
  user?: AuthUser | null;
};

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const isLoggedIn = Boolean(user);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Book className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-linear-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:inline">
              Nekozanedex
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <SearchSuggestions
              className="w-full"
              inputClassName="bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {/* Theme Toggle - Always show button to prevent layout shift */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                mounted && setTheme(theme === "dark" ? "light" : "dark")
              }
              className="shrink-0"
              disabled={!mounted}
            >
              {!mounted ? (
                // Placeholder icon while hydrating (use Moon as default to match common dark theme)
                <Moon className="h-5 w-5 animate-pulse" />
              ) : theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Chuyển đổi theme</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Menu người dùng</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/client/profile"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/client/profile?tab=bookmarks"
                        className="flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        Đánh dấu
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/client/profile?tab=history"
                        className="flex items-center gap-2"
                      >
                        <History className="h-4 w-4" />
                        Lịch sử đọc
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/server/admin"
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Quản trị
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/client/profile?tab=settings"
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-destructive"
                      disabled={isLoggingOut}
                      onSelect={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? "Đăng đăng xuất..." : "Đăng xuất"}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/auth/login"
                        className="flex items-center gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        Đăng nhập
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/auth/register"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Đăng ký
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
                <div className="flex flex-col gap-6 mt-6">
                  {/* Mobile Search */}
                  <SearchSuggestions className="w-full" />

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

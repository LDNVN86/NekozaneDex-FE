"use client";

import Link from "next/link";
import {
  Menu,
  User,
  Book,
  Heart,
  Search,
  History,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/shared/ui/sheet";
import { SearchSuggestions } from "@/shared/components/search-suggestions";
import { cn } from "@/shared/lib/utils";
import type { AuthUser } from "@/features/auth/types/auth";

const mobileNavigation = [
  { name: "Trang chủ", href: "/", icon: Book },
  { name: "Thể loại", href: "/client/genres", icon: Menu },
  { name: "Xếp hạng", href: "/client/rankings", icon: Heart },
  { name: "Tìm kiếm", href: "/client/stories", icon: Search },
];

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  user?: AuthUser | null;
  pathname: string;
  isLoggingOut: boolean;
  handleLogout: () => Promise<void>;
}

export function MobileMenu({
  isOpen,
  setIsOpen,
  isLoggedIn,
  user,
  pathname,
  isLoggingOut,
  handleLogout,
}: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[360px] p-0 border-l border-border/50"
      >
        <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>

        <div className="flex flex-col h-full">
          {/* Header Section with User Info */}
          <div className="p-5 border-b border-border/50 bg-gradient-to-br from-primary/10 to-transparent">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Khách</p>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-primary hover:underline"
                  >
                    Đăng nhập →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Search Section */}
          <div className="p-4 border-b border-border/30">
            <SearchSuggestions
              className="w-full"
              inputClassName="bg-muted/50 border-border/30"
            />
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                Điều hướng
              </p>
            </div>
            <nav className="px-3 space-y-1">
              {mobileNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            {isLoggedIn && (
              <>
                <div className="px-3 mb-2 mt-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                    Tài khoản
                  </p>
                </div>
                <nav className="px-3 space-y-1">
                  {[
                    {
                      name: "Trang cá nhân",
                      href: "/client/profile",
                      icon: User,
                    },
                    {
                      name: "Đánh dấu",
                      href: "/client/profile?tab=bookmarks",
                      icon: Heart,
                    },
                    {
                      name: "Lịch sử đọc",
                      href: "/client/profile?tab=history",
                      icon: History,
                    },
                    {
                      name: "Cài đặt",
                      href: "/client/profile?tab=settings",
                      icon: Settings,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                  {user?.role === "admin" && (
                    <Link
                      href="/server/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-500 hover:bg-amber-500/10 transition-all duration-200"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Quản trị
                    </Link>
                  )}
                </nav>
              </>
            )}
          </div>

          {/* Footer Section */}
          <div className="p-4 border-t border-border/30 mt-auto">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
              >
                <LogOut className="h-5 w-5" />
                {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    Đăng nhập
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    Đăng ký
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import Link from "next/link";
import {
  User,
  Heart,
  History,
  LayoutDashboard,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { AuthUser } from "@/features/auth/types/auth";

interface UserMenuProps {
  isLoggedIn: boolean;
  user?: AuthUser | null;
  isLoggingOut: boolean;
  handleLogout: () => Promise<void>;
}

export function UserMenu({
  isLoggedIn,
  user,
  isLoggingOut,
  handleLogout,
}: UserMenuProps) {
  return (
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
              <Link href="/client/profile" className="flex items-center gap-2">
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
                <Link href="/server/admin" className="flex items-center gap-2">
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
              onSelect={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/register" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Đăng ký
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

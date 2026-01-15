"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Book } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SearchSuggestions } from "@/shared/components/search-suggestions";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import type { AuthUser } from "@/features/auth/types/auth";
import type { Notification } from "@/features/notifications/server";

// Parts
import { DesktopNav } from "./header-parts/DesktopNav";
import { ThemeToggle } from "./header-parts/ThemeToggle";
import { UserMenu } from "./header-parts/UserMenu";
import { MobileMenu } from "./header-parts/MobileMenu";

type HeaderProps = {
  user?: AuthUser | null;
  notifications?: Notification[];
  unreadNotificationCount?: number;
};

export function Header({
  user,
  notifications = [],
  unreadNotificationCount = 0,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const isLoggedIn = Boolean(user);

  // Hide header on chapter reader pages for immersive reading
  const isReaderPage = /^\/client\/stories\/[^/]+\/\d+$/.test(pathname);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render header on reader pages
  if (isReaderPage) return null;

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
            <span className="text-xl font-bold bg-linear-gradient-to-r from-primary to-accent bg-clip-text hidden sm:inline">
              Nekozanedex
            </span>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav pathname={pathname} />

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <SearchSuggestions
              className="w-full"
              inputClassName="bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />

            {isLoggedIn && (
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadNotificationCount}
                currentUserId={user?.id}
              />
            )}

            <UserMenu
              isLoggedIn={isLoggedIn}
              user={user}
              isLoggingOut={isLoggingOut}
              handleLogout={handleLogout}
            />

            <MobileMenu
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isLoggedIn={isLoggedIn}
              user={user}
              pathname={pathname}
              isLoggingOut={isLoggingOut}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

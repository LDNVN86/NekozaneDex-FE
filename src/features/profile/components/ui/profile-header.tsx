"use client";

import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import type { ProfileUser } from "@/features/profile/interfaces";

interface ProfileHeaderProps {
  user: ProfileUser;
  bookmarkCount: number;
  historyCount: number;
}

export function ProfileHeader({
  user,
  bookmarkCount,
  historyCount,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 bg-card border rounded-xl">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-2xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Thành viên từ {new Date(user.joinedAt).toLocaleDateString("vi-VN")}
        </p>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{bookmarkCount}</p>
          <p className="text-sm text-muted-foreground">Đánh dấu</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{historyCount}</p>
          <p className="text-sm text-muted-foreground">Đã đọc</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, User, KeyRound, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { updateUserInfoAction, resetUserPasswordAction } from "./actions";
import type { AdminUser } from "@/features/admin/server/users";

interface EditUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Form state
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<"admin" | "reader">("reader");
  const [newPassword, setNewPassword] = React.useState("");

  // Reset form when user changes
  React.useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
      setNewPassword("");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsPending(true);

    // Build update data - only include changed fields
    const updateData: {
      username?: string;
      email?: string;
      role?: "admin" | "reader";
    } = {};

    if (username !== user.username) updateData.username = username;
    if (email !== user.email) updateData.email = email;
    if (role !== user.role) updateData.role = role;

    // Update user info if there are changes
    if (Object.keys(updateData).length > 0) {
      const result = await updateUserInfoAction(user.id, updateData);
      if (!result.success) {
        toast.error(result.error || "Không thể cập nhật thông tin");
        setIsPending(false);
        return;
      }
      toast.success("Đã cập nhật thông tin");
    }

    // Reset password if provided
    if (newPassword.trim()) {
      if (newPassword.length < 8) {
        toast.error("Mật khẩu phải có ít nhất 8 ký tự");
        setIsPending(false);
        return;
      }
      const pwResult = await resetUserPasswordAction(user.id, newPassword);
      if (!pwResult.success) {
        toast.error(pwResult.error || "Không thể đổi mật khẩu");
        setIsPending(false);
        return;
      }
      toast.success("Đã đổi mật khẩu");
    }

    setIsPending(false);
    onOpenChange(false);
    router.refresh();
  };

  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chỉnh sửa người dùng
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho {user.username}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username"
              minLength={3}
              maxLength={50}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select
              value={role}
              onValueChange={(value: "admin" | "reader") => setRole(value)}
              disabled={isAdmin}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reader">Reader</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {isAdmin && (
              <p className="text-xs text-muted-foreground">
                Không thể thay đổi vai trò Admin
              </p>
            )}
          </div>

          {/* Password Reset Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Đổi mật khẩu (tùy chọn)
              </span>
            </div>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Để trống nếu không đổi"
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {newPassword && newPassword.length < 8 && (
              <p className="text-xs text-destructive mt-1">
                Mật khẩu phải có ít nhất 8 ký tự
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

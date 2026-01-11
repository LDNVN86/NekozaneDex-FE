"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { changePasswordAction } from "@/features/profile/actions";

function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;
  return strength;
}

const STRENGTH_LABELS = ["", "Yếu", "Bình thường", "Tốt", "Rất mạnh"];

export function ChangePasswordCard() {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isChanging, setIsChanging] = React.useState(false);

  const passwordStrength = calculatePasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit =
    currentPassword && newPassword && confirmPassword && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);

    try {
      const formData = new FormData();
      formData.append("old_password", currentPassword);
      formData.append("new_password", newPassword);
      formData.append("confirm_password", confirmPassword);

      const result = await changePasswordAction(formData);

      if (result.success) {
        toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Đổi mật khẩu</CardTitle>
        <CardDescription>Cập nhật mật khẩu tài khoản của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <PasswordInput
            id="current-password"
            label="Mật khẩu hiện tại"
            placeholder="Nhập mật khẩu hiện tại"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showPassword}
            onToggleShow={() => setShowPassword(!showPassword)}
          />

          {/* New Password */}
          <PasswordInput
            id="new-password"
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={setNewPassword}
            show={showNewPassword}
            onToggleShow={() => setShowNewPassword(!showNewPassword)}
          />

          {/* Password Strength */}
          {newPassword && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Độ mạnh mật khẩu</Label>
                <span className="text-xs font-medium text-muted-foreground">
                  {STRENGTH_LABELS[passwordStrength]}
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    passwordStrength === 1 && "w-1/4 bg-red-500",
                    passwordStrength === 2 && "w-2/4 bg-orange-500",
                    passwordStrength === 3 && "w-3/4 bg-yellow-500",
                    passwordStrength === 4 && "w-full bg-green-500"
                  )}
                />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="space-y-2">
            <PasswordInput
              id="confirm-password"
              label="Xác nhận mật khẩu"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-destructive">Mật khẩu không khớp</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isChanging || !canSubmit}
          >
            {isChanging ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật mật khẩu"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Reusable password input component
function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  show,
  onToggleShow,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

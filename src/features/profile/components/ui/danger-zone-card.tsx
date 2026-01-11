"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";

export function DangerZoneCard() {
  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Account deletion requested");
  };

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive text-xl">
          Vùng nguy hiểm
        </CardTitle>
        <CardDescription className="text-destructive/70">
          Các hành động này không thể hoàn tác
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Xóa tài khoản
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa tài khoản?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này sẽ xóa vĩnh viễn tài khoản của bạn và tất cả dữ
                liệu liên quan. Điều này không thể được hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 my-4">
              <p className="text-sm text-destructive font-medium">
                Hãy chắc chắn trước khi tiếp tục
              </p>
            </div>
            <div className="flex gap-3">
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={handleDeleteAccount}
              >
                Xóa tài khoản
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

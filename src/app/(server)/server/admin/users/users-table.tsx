"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  User,
  Pencil,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { updateUserRoleAction, updateUserStatusAction } from "./actions";
import { EditUserDialog } from "./edit-user-dialog";
import type { AdminUser } from "@/features/admin/server/users";

interface UsersTableProps {
  users: AdminUser[];
  emptyMessage?: string;
}

export function UsersTable({
  users,
  emptyMessage = "Chưa có người dùng nào",
}: UsersTableProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState<string | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "admin" | "reader"
  ) => {
    setPending(userId);
    const result = await updateUserRoleAction(userId, newRole);
    setPending(null);

    if (result.success) {
      toast.success(
        `Đã cập nhật role thành ${newRole === "admin" ? "Admin" : "Reader"}`
      );
      router.refresh();
    } else {
      toast.error(result.error || "Không thể cập nhật role");
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    setPending(userId);
    const result = await updateUserStatusAction(userId, isActive);
    setPending(null);

    if (result.success) {
      toast.success(
        isActive ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản"
      );
      router.refresh();
    } else {
      toast.error(result.error || "Không thể cập nhật trạng thái");
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Người dùng
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Role
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
              Trạng thái
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
              Ngày tham gia
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-medium">{user.username}</span>
                </div>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">
                {user.email}
              </td>
              <td className="py-3 px-4">
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={
                    user.role === "admin"
                      ? "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
                      : ""
                  }
                >
                  {user.role === "admin" ? "Admin" : "Reader"}
                </Badge>
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <Badge
                  variant={user.is_active ? "default" : "destructive"}
                  className={
                    user.is_active
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-red-500/20 text-red-400"
                  }
                >
                  {user.is_active ? "Hoạt động" : "Vô hiệu"}
                </Badge>
              </td>
              <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                {formatDate(user.created_at)}
              </td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={pending === user.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(user)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.role === "admin" ? (
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, "reader")}
                      >
                        <ShieldOff className="h-4 w-4 mr-2" />
                        Chuyển thành Reader
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, "admin")}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Chuyển thành Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {user.is_active ? (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, false)}
                        className="text-destructive"
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Vô hiệu hóa
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, true)}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Kích hoạt
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}

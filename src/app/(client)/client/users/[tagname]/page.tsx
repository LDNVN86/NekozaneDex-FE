import { notFound } from "next/navigation";
import { getUserByTagName } from "@/features/users/server";
import { User, Calendar } from "lucide-react";
import { createMetadata } from "@/shared/lib/seo";

interface Props {
  params: Promise<{ tagname: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { tagname } = await params;
  const result = await getUserByTagName(tagname);

  if (!result.success) {
    return createMetadata({
      title: "Không tìm thấy người dùng",
    });
  }

  return createMetadata({
    title: `@${result.data.tag_name} - ${result.data.username}`,
    description: `Trang cá nhân của ${result.data.username}`,
  });
}

export default async function UserProfilePage({ params }: Props) {
  const { tagname } = await params;
  const result = await getUserByTagName(tagname);

  if (!result.success) {
    notFound();
  }

  const user = result.data;
  const memberSince = new Date(user.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8">
        {/* Avatar & Username */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-4 ring-primary/20">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground">@{user.tag_name}</p>
          {user.role === "admin" && (
            <span className="mt-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase">
              Admin
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Thành viên từ {memberSince}</span>
        </div>
      </div>
    </div>
  );
}

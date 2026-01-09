import { Suspense } from "react";
import { ProfileContent } from "@/features/profile/components/profile-content";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Đang tải...</div>}
    >
      <ProfileContent />
    </Suspense>
  );
}

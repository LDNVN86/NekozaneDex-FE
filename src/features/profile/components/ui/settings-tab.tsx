"use client";

import { ProfileInfoCard } from "./profile-info-card";
import { ChangePasswordCard } from "./change-password-card";
import { NotificationsCard } from "./notifications-card";
import { DangerZoneCard } from "./danger-zone-card";

interface SettingsTabProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export function SettingsTab({ user }: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <ProfileInfoCard user={user} />
      <ChangePasswordCard />
      <NotificationsCard />
      <DangerZoneCard />
    </div>
  );
}

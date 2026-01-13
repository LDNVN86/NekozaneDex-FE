"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { type StoryStatus, STORY_STATUS_OPTIONS } from "../../interface";

interface StatusSelectProps {
  defaultStatus?: StoryStatus;
  defaultPublished?: boolean;
}

const STATUS_COLORS: Record<StoryStatus, string> = {
  ongoing: "bg-blue-500",
  completed: "bg-green-500",
  hiatus: "bg-yellow-500",
};

export function StatusSelect({
  defaultStatus = "ongoing",
  defaultPublished = false,
}: StatusSelectProps) {
  const [status, setStatus] = React.useState<StoryStatus>(defaultStatus);
  const [isPublished, setIsPublished] = React.useState(defaultPublished);

  return (
    <div className="space-y-4">
      {/* Status Select */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-xs text-muted-foreground">
          Trạng thái
        </Label>
        <Select
          name="status"
          value={status}
          onValueChange={(v) => setStatus(v as StoryStatus)}
        >
          <SelectTrigger id="status" className="h-10 bg-input border-border/30">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`}
              />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {STORY_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Publish Toggle */}
      <div className="flex items-center justify-between p-3 bg-input/50 rounded-lg border border-border/30">
        <Label htmlFor="is_published" className="text-sm cursor-pointer">
          Công khai
        </Label>
        <input
          type="hidden"
          name="is_published"
          value={isPublished ? "true" : "false"}
        />
        <Switch
          id="is_published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
      </div>

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground">
        Cập nhật: {new Date().toLocaleDateString("vi-VN")}
      </p>
    </div>
  );
}

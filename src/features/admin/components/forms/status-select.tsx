"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { type StoryStatus, STORY_STATUS_OPTIONS } from "../../interface";

interface StatusSelectProps {
  defaultStatus?: StoryStatus;
  defaultPublished?: boolean;
}

export function StatusSelect({
  defaultStatus = "ongoing",
  defaultPublished = false,
}: StatusSelectProps) {
  const [status, setStatus] = React.useState<StoryStatus>(defaultStatus);
  const [isPublished, setIsPublished] = React.useState(defaultPublished);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Trạng thái</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status select */}
        <div className="space-y-2">
          <Label htmlFor="status">Tình trạng</Label>
          <Select
            name="status"
            value={status}
            onValueChange={(v) => setStatus(v as StoryStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue />
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

        {/* Publish toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="is_published">Xuất bản</Label>
            <p className="text-xs text-muted-foreground">
              Hiển thị công khai trên trang
            </p>
          </div>
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
      </CardContent>
    </Card>
  );
}

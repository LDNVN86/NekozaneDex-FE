"use client";

import * as React from "react";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { STATUS_CONFIG } from "../story-header-utils";

interface StoryCoverProps {
  title: string;
  coverImageUrl?: string;
  status: string;
}

export function StoryCover({ title, coverImageUrl, status }: StoryCoverProps) {
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.ongoing;

  return (
    <div className="shrink-0">
      <div className="relative w-full max-w-[240px] mx-auto lg:mx-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <img
          src={
            coverImageUrl ||
            `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(
              title
            )}`
          }
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge
            className={cn("text-xs font-medium border", statusConfig.color)}
          >
            {statusConfig.label}
          </Badge>
        </div>
      </div>
    </div>
  );
}

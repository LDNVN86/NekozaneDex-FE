"use client";

import * as React from "react";

interface StoryBackgroundProps {
  coverImageUrl?: string;
}

export function StoryBackground({ coverImageUrl }: StoryBackgroundProps) {
  return (
    <div className="absolute inset-0 -top-20 -mx-4 md:-mx-8 overflow-hidden -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-30"
        style={{ backgroundImage: `url(${coverImageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
    </div>
  );
}

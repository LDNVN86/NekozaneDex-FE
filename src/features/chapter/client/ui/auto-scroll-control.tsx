"use client";

import * as React from "react";
import { Play, Pause, Minus, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface AutoScrollControlProps {
  isScrolling: boolean;
  speed: number;
  onToggle: () => void;
  onSpeedChange: (speed: number) => void;
  isVisible?: boolean;
}

const MIN_SPEED = 1;
const MAX_SPEED = 10;

/**
 * Floating auto-scroll control panel for vertical reading mode.
 */
export function AutoScrollControl({
  isScrolling,
  speed,
  onToggle,
  onSpeedChange,
  isVisible = true,
}: AutoScrollControlProps) {
  const decreaseSpeed = () => onSpeedChange(Math.max(MIN_SPEED, speed - 1));
  const increaseSpeed = () => onSpeedChange(Math.min(MAX_SPEED, speed + 1));

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 z-50 flex items-center gap-2 p-2 rounded-full",
        "bg-black/80 backdrop-blur-sm border border-gray-700 shadow-lg",
        "transition-opacity duration-300",
        // Always visible when auto-scrolling, so user can stop it
        !isVisible && !isScrolling && "opacity-0 pointer-events-none",
      )}
    >
      {/* Play/Pause */}
      <Button
        variant={isScrolling ? "default" : "ghost"}
        size="icon"
        className="h-10 w-10 rounded-full"
        onClick={onToggle}
        title={isScrolling ? "Dừng cuộn" : "Tự động cuộn"}
      >
        {isScrolling ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      {/* Speed controls - only show when scrolling */}
      {isScrolling && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={decreaseSpeed}
            disabled={speed <= MIN_SPEED}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-4 text-center">{speed}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={increaseSpeed}
            disabled={speed >= MAX_SPEED}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

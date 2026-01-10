"use client";

import * as React from "react";
import { Settings, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Slider } from "@/shared/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface ReaderSettingsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function ReaderSettings({ zoom, onZoomChange }: ReaderSettingsProps) {
  const [open, setOpen] = React.useState(false);

  const handleZoomIn = () => onZoomChange(Math.min(150, zoom + 10));
  const handleZoomOut = () => onZoomChange(Math.max(50, zoom - 10));
  const handleZoomReset = () => onZoomChange(100);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-6">
          <h4 className="font-semibold text-center">Cài đặt đọc truyện</h4>

          {/* Zoom Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Phóng to: {zoom}%</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleZoomReset}
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Slider
              value={[zoom]}
              min={50}
              max={150}
              step={10}
              onValueChange={([v]) => onZoomChange(v)}
            />
          </div>

          {/* Keyboard Shortcuts */}
          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p className="font-medium mb-2">Phím tắt:</p>
            <p>← : Chương trước</p>
            <p>→ : Chương sau</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

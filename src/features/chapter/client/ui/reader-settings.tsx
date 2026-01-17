"use client";

import * as React from "react";
import { Settings, ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Slider } from "@/shared/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";

export type PageFitMode = "width" | "height" | "original";
export type ReadingMode = "vertical" | "horizontal" | "longstrip";
export type ColorFilter = "none" | "sepia" | "night";

interface ReaderSettingsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  pageFit: PageFitMode;
  onPageFitChange: (mode: PageFitMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  readingMode: ReadingMode;
  onReadingModeChange: (mode: ReadingMode) => void;
  // Visual filters
  brightness: number;
  onBrightnessChange: (value: number) => void;
  colorFilter: ColorFilter;
  onColorFilterChange: (filter: ColorFilter) => void;
}

const PAGE_FIT_OPTIONS: { value: PageFitMode; label: string }[] = [
  { value: "width", label: "Vừa chiều rộng" },
  { value: "height", label: "Vừa chiều cao" },
  { value: "original", label: "Kích thước gốc" },
];

const READING_MODE_OPTIONS: {
  value: ReadingMode;
  label: string;
  desc: string;
}[] = [
  { value: "vertical", label: "Dọc", desc: "Cuộn dọc" },
  { value: "horizontal", label: "Ngang", desc: "Lật trang" },
  { value: "longstrip", label: "Webtoon", desc: "Liên tục" },
];

const COLOR_FILTER_OPTIONS: {
  value: ColorFilter;
  label: string;
  desc: string;
}[] = [
  { value: "none", label: "Không", desc: "Mặc định" },
  { value: "sepia", label: "Sepia", desc: "Ấm mắt" },
  { value: "night", label: "Đêm", desc: "Đảo màu" },
];

export function ReaderSettings({
  zoom,
  onZoomChange,
  pageFit,
  onPageFitChange,
  isFullscreen,
  onToggleFullscreen,
  readingMode,
  onReadingModeChange,
  brightness,
  onBrightnessChange,
  colorFilter,
  onColorFilterChange,
}: ReaderSettingsProps) {
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
      <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto" align="end">
        <div className="space-y-4">
          <h4 className="font-semibold text-center sticky top-0 bg-popover pb-2">
            Cài đặt đọc truyện
          </h4>

          {/* Fullscreen Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Toàn màn hình</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFullscreen}
              className="gap-2"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4" />
                  Thoát
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4" />
                  Bật
                </>
              )}
            </Button>
          </div>

          {/* Reading Mode Toggle */}
          <div className="space-y-2">
            <span className="text-sm">Chế độ đọc</span>
            <div className="grid grid-cols-2 gap-2">
              {READING_MODE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={readingMode === option.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "text-xs h-10 flex flex-col gap-0.5",
                    readingMode === option.value && "bg-primary",
                  )}
                  onClick={() => onReadingModeChange(option.value)}
                >
                  <span className="font-medium">{option.label}</span>
                  <span className="text-[10px] opacity-70">{option.desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Page Fit Options */}
          <div className="space-y-2">
            <span className="text-sm">Chế độ hiển thị</span>
            <div className="grid grid-cols-3 gap-2">
              {PAGE_FIT_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={pageFit === option.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "text-xs h-8",
                    pageFit === option.value && "bg-primary",
                  )}
                  onClick={() => onPageFitChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

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

          {/* Brightness Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Độ sáng: {brightness}%</span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onBrightnessChange(100)}
              >
                Reset
              </Button>
            </div>
            <Slider
              value={[brightness]}
              min={50}
              max={150}
              step={5}
              onValueChange={([v]) => onBrightnessChange(v)}
            />
          </div>

          {/* Color Filter */}
          <div className="space-y-2">
            <span className="text-sm">Bộ lọc màu</span>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_FILTER_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={colorFilter === opt.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "text-xs h-10 flex flex-col gap-0.5",
                    colorFilter === opt.value && "bg-primary",
                  )}
                  onClick={() => onColorFilterChange(opt.value)}
                >
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-[10px] opacity-70">{opt.desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Keyboard & Gesture Shortcuts */}
          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p className="font-medium mb-2">Phím tắt & Cử chỉ:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <p>← → : Chuyển trang/chương</p>
              <p>F : Toàn màn hình</p>
              <p>Tap trái/phải : Lật trang</p>
              <p>Tap giữa : Ẩn/hiện menu</p>
              <p>Double-tap : Zoom 2x</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

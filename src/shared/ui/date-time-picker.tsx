"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { vi } from "date-fns/locale";
import { format } from "date-fns";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  minDate?: Date;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
  minDate,
  placeholder = "Chọn ngày và giờ",
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(value);
  const [hours, setHours] = React.useState(value ? value.getHours() : 12);
  const [minutes, setMinutes] = React.useState(value ? value.getMinutes() : 0);

  // Reset temp state when opening
  React.useEffect(() => {
    if (open) {
      setTempDate(value);
      setHours(value ? value.getHours() : 12);
      setMinutes(value ? value.getMinutes() : 0);
    }
  }, [open, value]);

  // Confirm selection
  const handleConfirm = () => {
    if (!tempDate) {
      onChange?.(undefined);
    } else {
      const newDate = new Date(tempDate);
      newDate.setHours(hours, minutes, 0, 0);
      onChange?.(newDate);
    }
    setOpen(false);
  };

  // Cancel selection
  const handleCancel = () => {
    setOpen(false);
  };

  // Generate hours and minutes options
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i);
  const minutesOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
          className
        )}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? (
          format(value, "dd/MM/yyyy HH:mm", { locale: vi })
        ) : (
          <span>{placeholder}</span>
        )}
      </Button>

      {/* Modal Dialog - Centered & Blocks Scroll */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Chọn ngày và giờ
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Calendar - Centered */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={tempDate}
                onSelect={setTempDate}
                disabled={(date) => (minDate ? date < minDate : false)}
                locale={vi}
                initialFocus
                className="rounded-md border"
              />
            </div>

            {/* Time Selector */}
            <div className="flex items-center justify-center gap-3 py-2 border rounded-md bg-muted/30">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Giờ:</span>
              <Select
                value={hours.toString()}
                onValueChange={(v) => setHours(parseInt(v))}
              >
                <SelectTrigger className="w-[75px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hoursOptions.map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-lg font-bold text-muted-foreground">:</span>
              <Select
                value={minutes.toString()}
                onValueChange={(v) => setMinutes(parseInt(v))}
              >
                <SelectTrigger className="w-[75px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {minutesOptions.map((m) => (
                    <SelectItem key={m} value={m.toString()}>
                      {m.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview */}
            {tempDate && (
              <div className="text-center text-sm text-muted-foreground">
                Thời gian đã chọn:{" "}
                <span className="font-medium text-foreground">
                  {format(
                    (() => {
                      const previewDate = new Date(tempDate);
                      previewDate.setHours(hours, minutes, 0, 0);
                      return previewDate;
                    })(),
                    "EEEE, dd/MM/yyyy 'lúc' HH:mm",
                    { locale: vi }
                  )}
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={!tempDate}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

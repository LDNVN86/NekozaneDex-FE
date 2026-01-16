"use client";

import * as React from "react";
import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface MediaPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onGifSelect?: (gifUrl: string) => void;
}

export function MediaPicker({ onEmojiSelect }: MediaPickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleEmojiSelect = (emoji: { native: string }) => {
    onEmojiSelect(emoji.native);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          title="Thêm emoji"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[352px] p-0"
        side="top"
        align="end"
        sideOffset={8}
      >
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          theme="dark"
          locale="vi"
          previewPosition="none"
          skinTonePosition="none"
          maxFrequentRows={2}
          perLine={9}
          emojiSize={24}
          emojiButtonSize={36}
        />
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { useState } from "react";
import Picker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiObject: any) => {
    onEmojiSelect(emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPicker(!showPicker)}
      >
        <Smile className="h-4 w-4 mr-2" />
        Cheer
      </Button>
      {showPicker && (
        <div className="absolute z-10 mt-2">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}
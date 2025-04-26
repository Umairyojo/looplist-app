"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmojiPicker } from "@/components/emoji-picker";
import { Badge } from "@/components/ui/badge";
import { Copy, Flame } from "lucide-react";

interface PublicBoardsProps {
  loops: any[];
  onCheer: (loopId: string, emoji: string) => void;
  onClone: (loopId: string) => void;
}

export function PublicBoards({ loops, onCheer, onClone }: PublicBoardsProps) {
  const handleAddCheer = (loopId: string, emoji: string) => {
    onCheer(loopId, emoji);
  };

  const handleCloneLoop = (loopId: string) => {
    onClone(loopId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loops.map((loop) => (
        <Card key={loop.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{loop.title}</h3>
              <span className="text-4xl">{loop.emoji || "📝"}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">
                {loop.streak || 0} day{loop.streak !== 1 ? "s" : ""} streak
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {loop.cheers?.map((emoji: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-base">
                  {emoji}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <EmojiPicker onEmojiSelect={(emoji: string) => handleAddCheer(loop.id, emoji)} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCloneLoop(loop.id)}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              Clone Loop
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
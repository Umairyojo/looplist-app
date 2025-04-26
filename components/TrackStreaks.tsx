'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Shadcn UI Button
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Shadcn UI Card
import { Calendar } from '@/components/ui/calendar'; // Shadcn UI Calendar (agar installed hai)

interface TrackStreaksProps {
  loops: any[];
  streaks: any[];
  onMarkDone: (loopId: string) => void;
}

export default function TrackStreaks({ loops, streaks, onMarkDone }: TrackStreaksProps) {
  const [selectedLoop, setSelectedLoop] = useState<any>(loops[0] || null);

  // Placeholder heatmap logic
  const generateHeatmap = () => {
    // GitHub-style heatmap logic (simplified)
    return streaks.map((streak) => (
      <div key={streak.id} className={`w-4 h-4 rounded-full ${streak.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
    ));
  };

  const currentStreak = streaks.filter((s) => s.status === 'Completed').length;
  const longestStreak = streaks.reduce((max, s) => (s.status === 'Completed' ? max + 1 : max), 0);
  const completionRate = ((currentStreak / streaks.length) * 100).toFixed(1) || 0;

  if (!selectedLoop) {
    return <div>No loops available</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Track Streaks for {selectedLoop.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            {loops.map((loop) => (
              <Button
                key={loop.id}
                onClick={() => setSelectedLoop(loop)}
                variant={selectedLoop.id === loop.id ? 'default' : 'outline'}
              >
                {loop.title}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{generateHeatmap()}</div>
          <div className="space-y-2">
            <p>Current Streak: {currentStreak} days</p>
            <p>Longest Streak: {longestStreak} days</p>
            <p>Completion Rate: {completionRate}%</p>
          </div>
          <Button onClick={() => onMarkDone(selectedLoop.id)} disabled={streaks.some((s) => s.date === new Date().toISOString().split('T')[0] && s.status === 'Completed')}>
            Mark Today as Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { PublicBoards } from "@/components/PublicBoards"; // Updated component

export default function PublicBoardsPage() {
  const [loading, setLoading] = useState(true);
  const [publicLoops, setPublicLoops] = useState<any[]>([]);

  useEffect(() => {
    const fetchPublicLoops = async () => {
      setLoading(true);
      const { data: loopsData, error } = await supabase
        .from("loops")
        .select("*, user_id (email)")
        .eq("is_public", true);

      if (error) {
        console.log("Error fetching public loops:", error.message);
      } else {
        // Fetch cheers for each loop
        const loopsWithCheers = await Promise.all(
          loopsData.map(async (loop: any) => {
            const { data: reactionsData } = await supabase
              .from("reactions")
              .select("emoji")
              .eq("loop_id", loop.id);
            return {
              ...loop,
              cheers: reactionsData?.map((reaction: any) => reaction.emoji) || [],
              streak: await calculateStreak(loop.id), // Streak calculate karo
            };
          })
        );
        setPublicLoops(loopsWithCheers);
      }
      setLoading(false);
    };

    fetchPublicLoops();
  }, []);

  const calculateStreak = async (loopId: string) => {
    const { data: streaksData, error } = await supabase
      .from("streaks")
      .select("date, status")
      .eq("loop_id", loopId)
      .order("date", { ascending: false });

    if (error || !streaksData) {
      console.log("Error fetching streaks:", error?.message);
      return 0;
    }

    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);

    for (const streak of streaksData) {
      const streakDate = new Date(streak.date);
      const diffDays = Math.floor(
        (currentDate.getTime() - streakDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0 && streak.status === "Completed") {
        streak += 1;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays > 1 || streak.status !== "Completed") {
        break;
      }
    }

    return streak;
  };

  const handleCheer = async (loopId: string, emoji: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase.from("reactions").insert({
        loop_id: loopId,
        user_id: session.user.id,
        emoji,
      });
      if (!error) {
        setPublicLoops((prevLoops) =>
          prevLoops.map((loop) =>
            loop.id === loopId && !loop.cheers.includes(emoji)
              ? { ...loop, cheers: [...loop.cheers, emoji] }
              : loop
          )
        );
      }
    }
  };

  const handleCloneLoop = async (loopId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from("loops").select("*").eq("id", loopId).single();
      const { error } = await supabase.from("loops").insert({
        user_id: session.user.id,
        title: data.title,
        frequency: data.frequency,
        start_date: new Date().toISOString().split("T")[0],
        is_public: false,
        emoji: data.emoji,
        cover_image: data.cover_image,
      });
      if (!error) {
        alert("Loop cloned to your account!");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <PublicBoards loops={publicLoops} onCheer={handleCheer} onClone={handleCloneLoop} />;
}
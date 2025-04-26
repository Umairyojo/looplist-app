"use client";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoopDashboard from "@/components/LoopDashboard"; // Adjust path as per your structure

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Dashboard Session:", session);

      if (!session) {
        router.push("/login");
        router.refresh();
      }
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth State Changed:", event, session);
        if (event === "SIGNED_OUT" || !session) {
          router.push("/login");
          router.refresh();
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <LoopDashboard onLogout={handleLogout} />;
}
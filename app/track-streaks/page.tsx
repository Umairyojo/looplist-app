'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import TrackStreaks from '@/components/TrackStreaks'; // v0.dev se generate kiya component

export default function TrackStreaksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loops, setLoops] = useState<any[]>([]);
  const [streaks, setStreaks] = useState<any[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: loopsData } = await supabase
        .from('loops')
        .select('*')
        .eq('user_id', session.user.id);
      setLoops(loopsData || []);

      const { data: streaksData } = await supabase
        .from('streaks')
        .select('*')
        .eq('loop_id', loopsData?.[0]?.id); // Placeholder: First loop ke streaks
      setStreaks(streaksData || []);

      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleMarkDone = async (loopId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('streaks').upsert({
      loop_id: loopId,
      date: today,
      status: 'Completed',
    });
    if (!error) {
      // Refresh streaks
      const { data } = await supabase.from('streaks').select('*').eq('loop_id', loopId);
      setStreaks(data || []);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <TrackStreaks loops={loops} streaks={streaks} onMarkDone={handleMarkDone} />;
}

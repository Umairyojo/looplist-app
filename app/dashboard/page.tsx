'use client';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Dashboard Session:', session);

      if (!session) {
        router.push('/login');
        router.refresh();
      }
      setLoading(false);
    };

    checkSession();

    // Auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth State Changed:', event, session);
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
        router.refresh();
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to LoopList Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Loops</h2>
          <p className="text-gray-600">You haven’t created any loops yet. Start by creating a new loop!</p>
          <a
            href="/create-loop"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create a New Loop
          </a>
        </div>
      </div>
    </div>
  );
}
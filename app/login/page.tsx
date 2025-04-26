'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        console.log('Login Error:', error.message);
      } else {
        console.log('Login Successful, Initial Session:', data.session);
        // Session ko explicitly set karo
        await supabase.auth.setSession(data.session);
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Session After Sync:', sessionData.session);
        if (sessionData.session) {
          router.push('/dashboard');
          router.refresh();
        } else {
          setError('Session not set, please try again.');
        }
      }
    } catch (err) {
      setError('Unexpected error occurred');
      console.log('Unexpected Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:3000/dashboard',
        },
      });
      if (error) {
        setError(error.message);
        console.log('Signup Error:', error.message);
      } else {
        console.log('Signup Successful, Initial Session:', data.session);
        await supabase.auth.setSession(data.session);
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Session After Sync:', sessionData.session);
        if (sessionData.session) {
          router.push('/dashboard');
          router.refresh();
        } else {
          setError('Session not set, please try again.');
        }
      }
    } catch (err) {
      setError('Unexpected error occurred');
      console.log('Unexpected Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth State Changed:', event, session);
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
        router.refresh();
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">LoopList</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              onClick={handleSignup}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            {error && (
              <p className="text-red-500 text-center mt-2">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
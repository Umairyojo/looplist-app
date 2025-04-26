'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { CreateLoopForm } from '@/components/CreateLoop'; // Updated import

export default function CreateLoopPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateLoop = async (formData: any) => {
    setError('');
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Handle cover image upload to Supabase Storage if needed
      let coverImageUrl = null;
      if (formData.coverImage) {
        const fileExt = formData.coverImage.name.split('.').pop();
        const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('loop-covers')
          .upload(fileName, formData.coverImage);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('loop-covers')
          .getPublicUrl(fileName);

        coverImageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from('loops').insert({
        user_id: session.user.id,
        title: formData.title,
        frequency: formData.frequency,
        start_date: formData.startDate.toISOString().split('T')[0],
        is_public: formData.visibility === 'public' || formData.visibility === 'friends',
        emoji: formData.emoji,
        cover_image: coverImageUrl,
      });

      if (error) {
        setError(error.message);
        console.log('Error creating loop:', error.message);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred');
      console.log('Unexpected Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return <CreateLoopForm onSubmit={handleCreateLoop} error={error} loading={loading} />;
}
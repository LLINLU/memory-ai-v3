import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types/database.types';

type UserDetails = Tables<'v_user_details'>;

interface UseUserDetailReturn {
  userDetails: UserDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserDetail(): UseUserDetailReturn {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    if (!user?.id) {
      setUserDetails(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('v_user_details')
        .select('*')
        .eq('user_id', user.id)
        .single();


      if (fetchError) {
        console.error('Error fetching user details:', fetchError);
        setError(fetchError.message);
        return;
      }

      setUserDetails(data);
    } catch (err) {
      console.error('Unexpected error fetching user details:', err);
      setError('ユーザー詳細の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [user?.id]);

  const refetch = async () => {
    await fetchUserDetails();
  };

  return {
    userDetails,
    loading,
    error,
    refetch,
  };
}

// ユーザー表示名を取得するヘルパー関数
export function getUserDisplayName(userDetails: UserDetails | null, userEmail?: string): string {
  if (userDetails?.username) {
    return userDetails.username;
  }
  
  if (userEmail) {
    return userEmail.split('@')[0];
  }
  
  return 'ユーザー';
} 
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Doctor } from '../types/database';

export const useDoctor = (doctorId: string) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', doctorId)
          .single();

        if (error) throw error;
        setDoctor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();

    // Set up real-time subscription
    const subscription = supabase
      .channel('doctor_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'doctors',
          filter: `id=eq.${doctorId}`
        },
        async (payload) => {
          if (payload.eventType === 'DELETE') {
            setDoctor(null);
          } else {
            const { data } = await supabase
              .from('doctors')
              .select('*')
              .eq('id', doctorId)
              .single();
            
            setDoctor(data);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [doctorId]);

  const updateDoctor = async (updates: Partial<Doctor>) => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .update(updates)
        .eq('id', doctorId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return { doctor, loading, error, updateDoctor };
};

export default useDoctor; 
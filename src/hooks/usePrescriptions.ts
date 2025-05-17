import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Prescription } from '../types/database';

export const usePrescriptions = (doctorId: string) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchPrescriptions = async () => {
      try {
        const { data, error } = await supabase
          .from('prescriptions')
          .select(`
            *,
            patient:patients(*)
          `)
          .eq('doctor_id', doctorId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPrescriptions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();

    // Set up real-time subscription
    const subscription = supabase
      .channel('prescriptions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prescriptions',
          filter: `doctor_id=eq.${doctorId}`
        },
        async (payload) => {
          // Refetch to get the latest data with joins
          const { data } = await supabase
            .from('prescriptions')
            .select(`
              *,
              patient:patients(*)
            `)
            .eq('doctor_id', doctorId)
            .order('created_at', { ascending: false });
          
          setPrescriptions(data || []);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [doctorId]);

  return { prescriptions, loading, error };
};

export default usePrescriptions; 
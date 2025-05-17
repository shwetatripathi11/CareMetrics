import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

const EditDoctorInfo = () => {
  const { doctor: authDoctor, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    specialty: '',
    working_hospital: ''
  });
  const [updateError, setUpdateError] = useState<string | null>(null);

  React.useEffect(() => {
    if (authDoctor) {
      setFormData({
        full_name: authDoctor.full_name,
        email: authDoctor.email,
        specialty: authDoctor.specialty || '',
        working_hospital: authDoctor.working_hospital || ''
      });
    }
  }, [authDoctor]);

  if (authLoading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-900/20">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!authDoctor) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-900/20">
        <div className="flex justify-center items-center h-32 text-red-400">
          Doctor not found
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    try {
      const { error } = await supabase
        .from('doctors')
        .update(formData)
        .eq('id', authDoctor.id)
        .single();

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-900/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Specialty
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Working Hospital
              </label>
              <input
                type="text"
                value={formData.working_hospital}
                onChange={(e) => setFormData({ ...formData, working_hospital: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          {updateError && (
            <div className="text-red-400 text-sm mt-2">{updateError}</div>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <p className="text-sm text-gray-400">Full Name</p>
            <p className="text-lg">{authDoctor.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-lg">{authDoctor.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Specialty</p>
            <p className="text-lg">{authDoctor.specialty || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Working Hospital</p>
            <p className="text-lg">{authDoctor.working_hospital || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Doctor Code</p>
            <p className="text-lg font-mono">{authDoctor.doctor_code}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EditDoctorInfo; 
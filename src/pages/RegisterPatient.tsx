import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const { doctor } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    date_of_birth: '',
    sa: '',
    working_hospital: doctor?.working_hospital || ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Generate a unique patient ID (you might want to implement your own logic)
      const patientId = `P${Date.now().toString().slice(-6)}`;

      const { error } = await supabase
        .from('patients')
        .insert({
          patient_id: patientId,
          ...formData
        });

      if (error) throw error;

      // Navigate to the patient list with success message
      navigate('/patients', {
        state: { message: 'Patient registered successfully!' }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 pt-28 px-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl border border-purple-900/20 p-8"
          >
            <h1 className="text-2xl font-bold mb-6">Register New Patient</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="Enter patient's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Special Attention
                  </label>
                  <input
                    type="text"
                    value={formData.sa}
                    onChange={(e) => setFormData({ ...formData, sa: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="Any special medical conditions"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Working Hospital
                  </label>
                  <input
                    type="text"
                    value={formData.working_hospital}
                    onChange={(e) => setFormData({ ...formData, working_hospital: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="Enter hospital name"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/patients')}
                  className="px-6 py-2 rounded-lg border border-purple-900/20 hover:bg-purple-900/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
                    hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02]
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registering...' : 'Register Patient'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPatient; 
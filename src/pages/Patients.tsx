import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, Search, Filter } from 'lucide-react';
import { supabase } from '../config/supabase';
import { Patient } from '../types/database';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AnimatedCard from '../components/animations/AnimatedCard';

const Patients = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<string>('');

  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      setSuccessMessage(message);
      window.history.replaceState({}, document.title);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [location]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPatients(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = !filterGender || patient.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Patients</h1>
              <p className="text-gray-400 mt-1">Manage your patient records</p>
            </div>

            <button
              onClick={() => navigate('/register-patient')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
                hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02]"
            >
              <UserPlus className="w-5 h-5" />
              Register New Patient
            </button>
          </div>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/20 text-green-400 p-4 rounded-lg border border-green-500/20"
            >
              {successMessage}
            </motion.div>
          )}

          <AnimatedCard>
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or ID..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-purple-900/20 rounded-xl 
                      focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-gray-800/50 border border-purple-900/20 rounded-xl 
                      focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-400 text-center py-8">
                  {error}
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  No patients found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-900/20">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Patient ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date of Birth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Special Attention
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Hospital
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient, index) => (
                        <motion.tr
                          key={patient.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          className="hover:bg-purple-900/20 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {patient.patient_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {patient.full_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                            {patient.gender || 'Not specified'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {patient.date_of_birth || 'Not specified'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {patient.sa || 'None'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {patient.working_hospital || 'Not specified'}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </AnimatedCard>
        </div>
      </main>
    </div>
  );
};

export default Patients; 
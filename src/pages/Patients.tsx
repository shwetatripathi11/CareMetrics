import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, Search, Filter, Trash2, X } from 'lucide-react';
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      setSuccessMessage(message);
      window.history.replaceState({}, document.title);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [location]);

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

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeleteClick = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation(); // Prevent row click event
    setPatientToDelete(patient);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientToDelete.id);

      if (error) throw error;

      // Remove patient from local state
      setPatients(patients.filter(p => p.id !== patientToDelete.id));
      setSuccessMessage('Patient deleted successfully');
      setDeleteModalOpen(false);
      setPatientToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete patient');
    } finally {
      setDeleteLoading(false);
    }
  };

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

          <AnimatePresence>
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
          </AnimatePresence>

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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
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
                          className="hover:bg-purple-900/20 transition-colors cursor-pointer"
                        >
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                          >
                            {patient.patient_id}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                          >
                            {patient.full_name}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm capitalize"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                          >
                            {patient.gender || 'Not specified'}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                          >
                            {patient.date_of_birth || 'Not specified'}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                          >
                            {patient.sa || 'None'}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                          >
                            {patient.working_hospital || 'Not specified'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={(e) => handleDeleteClick(e, patient)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                            >
                              <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                            </button>
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-900/20"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Delete Patient</h3>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete {patientToDelete?.full_name}? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Patient'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Patient } from '../types/database';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

const CreatePrescription = () => {
  const navigate = useNavigate();
  const { doctor } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([{ name: '', dosage: '', frequency: '' }]);
  const [formData, setFormData] = useState({
    patient_id: '',
    prescribing_institution: doctor?.working_hospital || '',
    notes: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('full_name');

        if (error) throw error;
        setPatients(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patients');
      }
    };

    fetchPatients();
  }, []);

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!doctor?.id) throw new Error('Doctor not found');

      const { error } = await supabase
        .from('prescriptions')
        .insert({
          patient_id: formData.patient_id,
          doctor_id: doctor.id,
          prescribing_institution: formData.prescribing_institution,
          status: 'Pending',
          prescription_details: {
            medications,
            notes: formData.notes
          }
        });

      if (error) throw error;

      navigate('/prescriptions', {
        state: { message: 'Prescription created successfully!' }
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
            <h1 className="text-2xl font-bold mb-6">Create New Prescription</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Patient
                </label>
                <select
                  required
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.full_name} ({patient.patient_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Prescribing Institution
                </label>
                <input
                  type="text"
                  required
                  value={formData.prescribing_institution}
                  onChange={(e) => setFormData({ ...formData, prescribing_institution: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="Enter hospital/clinic name"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-400">
                    Medications
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    + Add Medication
                  </button>
                </div>

                <div className="space-y-4">
                  {medications.map((medication, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-gray-700/30">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                            focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          placeholder="Medication name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Dosage
                        </label>
                        <input
                          type="text"
                          required
                          value={medication.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                            focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Frequency
                        </label>
                        <input
                          type="text"
                          required
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                            focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          placeholder="e.g., Twice daily"
                        />
                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(index)}
                            className="absolute -right-2 -top-2 p-1 rounded-full bg-red-500/20 text-red-400 
                              hover:bg-red-500/30 transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-purple-900/20 
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  rows={4}
                  placeholder="Enter any additional notes or instructions"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/prescriptions')}
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
                  {loading ? 'Creating...' : 'Create Prescription'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreatePrescription; 
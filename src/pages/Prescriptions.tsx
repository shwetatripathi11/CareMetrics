import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Patient } from '../types/database';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AnimatedCard from '../components/animations/AnimatedCard';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  prescribing_institution: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  prescription_details: {
    medications: Medication[];
    notes: string;
  };
  created_at: string;
  updated_at: string;
  patient: Patient;
}

const Prescriptions = () => {
  const { doctor } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([{ name: '', dosage: '', frequency: '' }]);
  const [formData, setFormData] = useState({
    patient_id: '',
    prescribing_institution: doctor?.working_hospital || '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patients
        const { data: patientsData, error: patientsError } = await supabase
          .from('patients')
          .select('*')
          .order('full_name');

        if (patientsError) throw patientsError;
        setPatients(patientsData || []);

        // Fetch prescriptions
        const { data: prescriptionsData, error: prescriptionsError } = await supabase
          .from('prescriptions')
          .select(`
            *,
            patient:patients(*)
          `)
          .order('created_at', { ascending: false });

        if (prescriptionsError) throw prescriptionsError;
        setPrescriptions(prescriptionsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      }
    };

    fetchData();
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

      const { error: submitError } = await supabase
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

      if (submitError) throw submitError;

      // Reset form
      setFormData({
        patient_id: '',
        prescribing_institution: doctor?.working_hospital || '',
        notes: ''
      });
      setMedications([{ name: '', dosage: '', frequency: '' }]);

      // Refresh prescriptions list
      const { data: newPrescriptions, error: fetchError } = await supabase
        .from('prescriptions')
        .select(`
          *,
          patient:patients(*)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPrescriptions(newPrescriptions || []);
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
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Prescriptions List */}
            <div className="lg:w-1/2">
              <AnimatedCard>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Prescriptions</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-purple-900/20">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Patient
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptions.map((prescription, index) => (
                          <motion.tr
                            key={prescription.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="hover:bg-purple-900/20 transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {prescription.patient?.full_name}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {format(new Date(prescription.created_at), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  prescription.status === 'Completed'
                                    ? 'bg-green-500/20 text-green-400'
                                    : prescription.status === 'Pending'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {prescription.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Prescription Form */}
            <div className="lg:w-1/2">
              <AnimatedCard>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Create New Prescription</h2>
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

                    <div className="flex justify-end">
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
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Prescriptions; 
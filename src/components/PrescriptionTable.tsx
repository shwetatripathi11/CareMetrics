import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import AnimatedCard from './animations/AnimatedCard';

interface Prescription {
  id: string;
  patient_id: string;
  patient_name: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  details: string;
}

const PrescriptionTable = () => {
  // Dummy data for now - replace with real data later
  const prescriptions: Prescription[] = [
    {
      id: '1',
      patient_id: 'P001',
      patient_name: 'John Doe',
      date: '2024-02-20',
      status: 'Pending',
      details: 'Regular checkup',
    },
    {
      id: '2',
      patient_id: 'P002',
      patient_name: 'Jane Smith',
      date: '2024-02-19',
      status: 'Completed',
      details: 'Follow-up',
    },
  ];

  return (
    <AnimatedCard className="overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Prescriptions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-900/20">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Patient ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20">
            {prescriptions.map((prescription, index) => (
              <motion.tr
                key={prescription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-purple-900/20 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {prescription.patient_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {prescription.patient_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {format(new Date(prescription.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {prescription.details}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimatedCard>
  );
};

export default PrescriptionTable; 
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Prescribe Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="card bg-gradient-to-br from-purple-600 to-purple-800 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => navigate('/prescriptions')}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/30 rounded-xl">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Prescribe</h3>
            <p className="text-purple-200/70 text-sm">Create new prescription</p>
          </div>
        </div>
      </motion.div>

      {/* Register Patient Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="card bg-gradient-to-br from-amber-500 to-amber-700 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate('/register-patient')}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/30 rounded-xl">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Register Patient</h3>
            <p className="text-amber-200/70 text-sm">Add new patient record</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickMenu; 
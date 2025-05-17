import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 right-0 left-0 lg:left-72 h-24 bg-gray-900/50 backdrop-blur-xl border-b border-purple-900/20 z-40"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, prescriptions..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-purple-900/20 rounded-xl 
                focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-4 p-3 relative bg-gray-800/50 border border-purple-900/20 rounded-xl 
            hover:border-purple-500/50 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          {/* Notification Badge */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header; 
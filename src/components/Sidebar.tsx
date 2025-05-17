import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { doctor, signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Patients', path: '/patients' },
    { icon: FileText, label: 'Prescriptions', path: '/prescriptions' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const sidebarVariants = {
    open: {
      width: '18rem',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      width: '5rem',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 h-screen bg-gray-800/50 border-r border-purple-900/20 backdrop-blur-xl z-50"
      initial="open"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-4 top-6 bg-gray-800 p-2 rounded-full border border-purple-900/20"
        >
          <Menu className="w-4 h-4 text-gray-400" />
        </button>

        {/* Logo */}
        <motion.div
          className="p-6"
          animate={{ x: isOpen ? 0 : -20, opacity: isOpen ? 1 : 0 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            MediDash
          </h1>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
                <Icon className="w-5 h-5" />
                <motion.span
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="p-4 mt-auto">
          <motion.div
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10"
            animate={{ x: isOpen ? 0 : -20, opacity: isOpen ? 1 : 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {doctor?.full_name?.charAt(0)}
              </span>
            </div>
            <motion.div
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium truncate">{doctor?.full_name}</p>
              <p className="text-xs text-gray-400 truncate">{doctor?.specialty}</p>
            </motion.div>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            onClick={signOut}
            className="mt-4 w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 transition-colors rounded-xl"
            animate={{ x: isOpen ? 0 : -20 }}
          >
            <LogOut className="w-5 h-5" />
            <motion.span
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="whitespace-nowrap"
            >
              Log Out
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 
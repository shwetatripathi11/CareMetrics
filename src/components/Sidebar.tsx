import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Menu,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { doctor } = useAuth();
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
      className="fixed top-0 left-0 h-screen bg-base-200 border-r border-base-300 backdrop-blur-xl z-50"
      initial="open"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-4 top-6 bg-base-300 p-2 rounded-full border border-base-300"
        >
          <Menu className="w-4 h-4 text-base-content" />
        </button>

        {/* Logo */}
        <motion.div
          className="p-6"
          animate={{ x: isOpen ? 0 : -20, opacity: isOpen ? 1 : 0 }}
        >
          <h1 className="text-2xl font-bold text-primary">MediDash</h1>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-primary/10 text-base-content/70 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <motion.span
                      animate={{ opacity: isOpen ? 1 : 0 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <motion.div
          className="p-4 m-4 rounded-xl bg-base-300 border border-base-300"
          animate={{ x: isOpen ? 0 : -20, opacity: isOpen ? 1 : 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-content font-medium">
                {doctor?.full_name?.charAt(0) || 'D'}
              </span>
            </div>
            <motion.div
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="flex-1 min-w-0"
            >
              <p className="font-medium truncate text-base-content">{doctor?.full_name}</p>
              <p className="text-sm text-base-content/70 truncate">{doctor?.specialty}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 
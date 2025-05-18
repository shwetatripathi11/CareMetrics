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
  const [isOpen, setIsOpen] = React.useState(false);
  const { doctor } = useAuth();
  const location = useLocation();

  // Close sidebar by default on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Patients', path: '/patients' },
    { icon: FileText, label: 'Prescriptions', path: '/prescriptions' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const sidebarVariants = {
    open: {
      width: '18rem',
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      width: '5rem',
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Handle click outside to close sidebar on mobile
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (window.innerWidth < 1024 && sidebar && !sidebar.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 bg-gray-800 p-2 rounded-full"
      >
        <Menu className="w-6 h-6 text-gray-200" />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        id="sidebar"
        className={`fixed top-0 left-0 h-screen bg-gray-800/80 border-r border-purple-900/20 backdrop-blur-sm z-50 lg:backdrop-blur-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        <div className="flex flex-col h-full">
          {/* Toggle Button (visible only on desktop) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:block absolute -right-4 top-6 bg-gray-700 p-2 rounded-full border border-purple-900/20"
          >
            <Menu className="w-4 h-4 text-gray-200" />
          </button>

          {/* Logo */}
          <motion.div
            className="p-6"
            animate={{ opacity: isOpen ? 1 : 0 }}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MediDash
            </h1>
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
                      onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'hover:bg-purple-500/10 text-gray-300 hover:text-purple-400'
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
            className="p-4 m-4 rounded-xl bg-gray-700/50 border border-purple-900/20"
            animate={{ opacity: isOpen ? 1 : 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {doctor?.full_name?.charAt(0) || 'D'}
                </span>
              </div>
              <motion.div
                animate={{ opacity: isOpen ? 1 : 0 }}
                className="flex-1 min-w-0"
              >
                <p className="font-medium truncate text-gray-200">{doctor?.full_name}</p>
                <p className="text-sm text-gray-400 truncate">{doctor?.specialty}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar; 
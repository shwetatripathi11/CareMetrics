import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, LogOut, Palette, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import AnimatedCard from '../components/animations/AnimatedCard';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// DaisyUI theme list
const themes = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave',
  'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua',
  'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk',
  'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim',
  'nord', 'sunset'
];

const Settings = () => {
  const { doctor, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-200">
      <Sidebar />
      <Header />
      
      <main className="lg:ml-72 pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-primary">Settings</h1>
            <p className="text-base-content/70 mt-2">Customize your dashboard experience</p>
          </motion.div>

          {/* Theme Settings */}
          <AnimatedCard>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-base-content">Theme Settings</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {themes.map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => setTheme(themeName)}
                    className={`relative p-4 rounded-xl border transition-all hover:scale-105 ${
                      theme === themeName
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-base-300 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize text-base-content">{themeName}</span>
                      {theme === themeName && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          <Check className="w-4 h-4 text-primary" />
                        </motion.div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedCard>

          {/* Account Settings */}
          <AnimatedCard>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <SettingsIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-base-content">Account Settings</h2>
              </div>
              
              <div className="space-y-6">
                {/* Doctor Info */}
                <div className="p-4 rounded-xl border border-base-300 bg-base-200">
                  <h3 className="text-sm text-base-content/70 mb-2">Account Information</h3>
                  <p className="text-lg font-medium text-base-content">{doctor?.full_name}</p>
                  <p className="text-base-content/70">{doctor?.email}</p>
                  <p className="text-base-content/70">{doctor?.specialty}</p>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                    bg-error/20 text-error hover:bg-error/30 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </main>
    </div>
  );
};

export default Settings; 
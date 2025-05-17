import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import PrescriptionChart from '../components/PrescriptionChart';
import AnimatedCard from '../components/animations/AnimatedCard';
import LoadingSpinner from '../components/animations/LoadingSpinner';
import QuickMenu from '../components/QuickMenu';
import PrescriptionTable from '../components/PrescriptionTable';
import EditDoctorInfo from '../components/EditDoctorInfo';

const Dashboard = () => {
  const { doctor, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const chartData = [
    { label: 'Completed', value: 45, color: '#10B981' },
    { label: 'Pending', value: 32, color: '#6366F1' },
    { label: 'Cancelled', value: 12, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <Header />
      
      {/* Main Content */}
      <main className="lg:ml-72 pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome back, {doctor?.full_name}
            </h1>
            <p className="text-gray-400 mt-2">Here's what's happening with your patients today.</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Patients"
              value="1,234"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
              color="purple"
            />
            <StatsCard
              title="Prescriptions"
              value="856"
              icon={FileText}
              trend={{ value: 8, isPositive: true }}
              color="pink"
            />
            <StatsCard
              title="Active Cases"
              value="432"
              icon={Activity}
              trend={{ value: 4, isPositive: false }}
              color="blue"
            />
            <StatsCard
              title="Recovery Rate"
              value="92%"
              icon={TrendingUp}
              trend={{ value: 6, isPositive: true }}
              color="green"
            />
          </div>

          {/* Quick Menu */}
          <QuickMenu />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PrescriptionChart
              title="Prescription Status"
              data={chartData}
            />
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
              <EditDoctorInfo />
            </AnimatedCard>
          </div>

          {/* Prescription Table */}
          <PrescriptionTable />

          {/* Background Gradients */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-900/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-900/20 to-transparent rounded-full blur-3xl" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 
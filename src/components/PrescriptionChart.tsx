import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from './animations/AnimatedCard';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface PrescriptionChartProps {
  data: ChartData[];
  title: string;
}

const PrescriptionChart: React.FC<PrescriptionChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <AnimatedCard className="p-6">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
            <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{
                  duration: 1,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              />
            </div>
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-25 blur-sm"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxValue) * 100}%` }}
              transition={{
                duration: 1,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Decorative gradient orb */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
    </AnimatedCard>
  );
};

export default PrescriptionChart; 
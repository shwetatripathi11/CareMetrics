import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import AnimatedCard from './animations/AnimatedCard';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'purple' | 'pink' | 'blue' | 'green';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'purple'
}) => {
  const colorVariants = {
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    pink: 'from-pink-500/20 to-pink-600/20 text-pink-400',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400',
  };

  return (
    <AnimatedCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <motion.p
            className="text-sm text-gray-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.p>
          <motion.h3
            className="text-2xl font-semibold mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {value}
          </motion.h3>
          {trend && (
            <motion.div
              className="flex items-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className={`text-sm ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </motion.div>
          )}
        </div>
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br ${colorVariants[color]}`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default StatsCard; 
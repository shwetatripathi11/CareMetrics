import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative w-12 h-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      >
        {/* Gradient rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderLeftColor: `rgba(139, 92, 246, ${0.4 + i * 0.2})`,
              borderTopColor: `rgba(236, 72, 153, ${0.4 + i * 0.2})`,
              animationDelay: `${i * 0.1}s`,
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.1,
            }}
          />
        ))}
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-[35%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 
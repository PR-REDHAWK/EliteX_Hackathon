import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import type { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  className?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, className = '' }) => {
  // Determine color theme based on risk level
  const getColor = () => {
    switch (level) {
      case 'High':
        return {
          stroke: '#EF4444',
          glow: 'glow-red',
          text: 'text-red-500',
          bg: 'rgba(239, 68, 68, 0.1)',
          icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
        };
      case 'Medium':
        return {
          stroke: '#F59E0B',
          glow: 'glow-amber',
          text: 'text-amber-500',
          bg: 'rgba(245, 158, 11, 0.1)',
          icon: <Shield className="w-6 h-6 text-amber-500" />,
        };
      case 'Low':
      default:
        return {
          stroke: '#22C55E',
          glow: 'glow-green',
          text: 'text-emerald-500',
          bg: 'rgba(34, 197, 94, 0.1)',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
        };
    }
  };

  const theme = getColor();

  // SVG parameters
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Arc represents only a portion of a circle (e.g. 75% or full circle)
  // Let's use a full circle but with a rotation to make it feel gauge-like
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Glowing Background Radial */}
        <div 
          className="absolute inset-0 rounded-full blur-xl transition-colors duration-500"
          style={{ backgroundColor: theme.stroke, opacity: 0.12 }}
        />

        {/* Custom SVG Gauge */}
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Details */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`p-2 rounded-full mb-0.5`}
            style={{ backgroundColor: theme.bg }}
          >
            {theme.icon}
          </motion.div>
          <motion.span 
            className="text-3xl font-extrabold tracking-tight text-white font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
            Risk Score
          </span>
        </div>
      </div>

      {/* Label Indicator */}
      <motion.div 
        className={`mt-4 px-4 py-1 rounded-full font-bold text-xs border tracking-wider uppercase ${theme.text}`}
        style={{ borderColor: `${theme.stroke}30`, backgroundColor: `${theme.stroke}10` }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        {level} Risk
      </motion.div>
    </div>
  );
};
export default RiskGauge;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, UserCheck } from 'lucide-react';

interface FaceScannerProps {
  onComplete: () => void;
  targetAge: number;
  childName: string;
}

export const FaceScanner: React.FC<FaceScannerProps> = ({ onComplete, targetAge, childName }) => {
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { text: 'Initializing biometric scanner...', progress: 15 },
    { text: 'Locking facial grid (86 landmark nodes)...', progress: 45 },
    { text: 'Analyzing bone structure & skin texture...', progress: 75 },
    { text: 'Running neural network age estimation...', progress: 95 },
    { text: `Estimation complete: Age ${targetAge}`, progress: 100 },
  ];

  useEffect(() => {
    // Increment progress and step through scanning
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 45); // Takes about 4.5 seconds

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Map progress to steps
    const currentProgress = progress;
    if (currentProgress < 20) setScanStep(0);
    else if (currentProgress < 50) setScanStep(1);
    else if (currentProgress < 75) setScanStep(2);
    else if (currentProgress < 98) setScanStep(3);
    else {
      setScanStep(4);
      // Auto-trigger completion 1 second after 100%
      const timer = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  // Generate mock facial landmark nodes for a cool high-tech grid
  const nodePoints = [
    { x: '35%', y: '30%' }, { x: '65%', y: '30%' }, // Eyes
    { x: '50%', y: '45%' }, // Nose
    { x: '42%', y: '60%' }, { x: '58%', y: '60%' }, { x: '50%', y: '63%' }, // Mouth
    { x: '50%', y: '20%' }, // Forehead
    { x: '25%', y: '45%' }, { x: '75%', y: '45%' }, // Cheeks
    { x: '30%', y: '70%' }, { x: '70%', y: '70%' }, { x: '50%', y: '80%' }, // Jaw
  ];

  return (
    <div className="flex flex-col items-center justify-between h-full bg-slate-950 p-6">
      {/* Top Header */}
      <div className="text-center w-full mt-2">
        <h2 className="text-lg font-bold text-white tracking-wide">AI Age Verification</h2>
        <p className="text-xs text-slate-400 mt-1">Analyzing camera feed of {childName}</p>
      </div>

      {/* Camera Viewport Simulation */}
      <div className="relative w-64 h-64 rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800 flex items-center justify-center my-6 shadow-inner ring-4 ring-[#00B9F1]/10">
        
        {/* Mock Face Outline (Biometric Mesh) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <svg className="w-48 h-48 text-[#00B9F1]" viewBox="0 0 100 100" fill="none">
            {/* Outer Head Contour */}
            <path
              d="M20,40 Q20,15 50,15 Q80,15 80,40 Q80,75 50,85 Q20,75 20,40 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            {/* Eye line */}
            <line x1="22" y1="42" x2="78" y2="42" stroke="currentColor" strokeWidth="0.5" />
            {/* Center vertical line */}
            <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Floating Scan Nodes */}
        {progress > 20 && nodePoints.map((pt, idx) => (
          <motion.div
            key={idx}
            className="absolute w-2.5 h-2.5 rounded-full bg-[#00B9F1] border border-white flex items-center justify-center"
            style={{ left: pt.x, top: pt.y }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.7, 1, 0.7],
              backgroundColor: progress >= 95 ? '#22C55E' : '#00B9F1'
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.1 }}
          >
            {/* Connected grid lines to next nodes (simulate triangulation) */}
            {idx > 0 && idx % 3 === 0 && (
              <div className="absolute w-12 h-[1px] bg-[#00B9F1]/20 transform origin-left -rotate-45" />
            )}
          </motion.div>
        ))}

        {/* Camera HUD Markers */}
        <div className="absolute inset-4 border-t-2 border-l-2 border-[#00B9F1]/60 w-6 h-6 rounded-tl-lg" />
        <div className="absolute inset-4 top-auto border-b-2 border-l-2 border-[#00B9F1]/60 w-6 h-6 rounded-bl-lg" />
        <div className="absolute inset-4 left-auto border-t-2 border-r-2 border-[#00B9F1]/60 w-6 h-6 rounded-tr-lg" />
        <div className="absolute inset-4 top-auto left-auto border-b-2 border-r-2 border-[#00B9F1]/60 w-6 h-6 rounded-br-lg" />

        {/* Glowing Laser Scan Line */}
        {progress < 100 && (
          <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#00B9F1] to-transparent shadow-[0_0_12px_#00B9F1] animate-scan-line opacity-80" />
        )}

        {/* Camera Indicator dot */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] text-slate-300 font-bold uppercase tracking-wider">REC</span>
        </div>

        {/* Completed Overlay */}
        <AnimatePresence>
          {progress === 100 && (
            <motion.div 
              className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                initial={{ scale: 0.5, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <UserCheck className="w-7 h-7 text-emerald-500" />
              </motion.div>
              <h3 className="text-sm font-bold text-emerald-500 tracking-wide">AI Verification Complete</h3>
              <p className="text-xs text-slate-300 mt-1">Age Estimated: <span className="font-extrabold text-white text-sm">{targetAge} Years</span></p>
              <p className="text-[10px] text-slate-400 mt-0.5">Tolerance check: ±1.2 years</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress HUD Panel */}
      <div className="w-full glass-paytm rounded-2xl p-4 border border-[#00B9F1]/20 shadow-md">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Processing Feed</span>
          <span className="text-[#00B9F1] font-extrabold">{progress}%</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-sky-400 to-[#00B9F1]"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        {/* HUD Subtitle Status text */}
        <div className="mt-3 flex items-center gap-2">
          <RefreshCw className={`w-3.5 h-3.5 text-[#00B9F1] ${progress < 100 ? 'animate-spin' : ''}`} />
          <span className="text-xs text-slate-200 tracking-wide transition-all duration-300">
            {steps[scanStep].text}
          </span>
        </div>
      </div>
    </div>
  );
};
export default FaceScanner;

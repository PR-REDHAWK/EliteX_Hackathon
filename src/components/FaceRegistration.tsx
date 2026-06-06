import React, { useState } from 'react';
import FaceCamera from './FaceCamera';
import { registerParentFace } from '../utils/faceRecognition';
import { ShieldCheck, UserCheck, RefreshCw, Sparkles, Camera, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface FaceRegistrationProps {
  onComplete?: () => void;
}

export const FaceRegistration: React.FC<FaceRegistrationProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCapture = (descriptor: Float32Array) => {
    try {
      registerParentFace(descriptor);
      setStatus('success');
      if (onComplete) {
        setTimeout(onComplete, 1800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save face descriptor.');
      setStatus('error');
    }
  };

  const handleStart = () => {
    setStatus('scanning');
    setErrorMsg('');
  };

  const handleRetry = () => {
    setStatus('scanning');
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-lg mx-auto glass border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden bg-slate-950/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B9F1]/5 rounded-full blur-3xl pointer-events-none" />
      
      {status === 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-6"
        >
          <div className="w-16 h-16 rounded-full bg-[#00B9F1]/10 border border-[#00B9F1]/20 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,185,241,0.15)]">
            <Camera className="w-7 h-7 text-[#00B9F1]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-white tracking-wide uppercase">Register Face ID</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Enroll your face profile to secure and lock your Parent Dashboard. This will store a 128-dimensional mathematical descriptor in local storage.
            </p>
          </div>

          <div className="glass rounded-2xl p-4 border border-slate-900 text-[11px] text-slate-400 text-left space-y-2 max-w-sm mx-auto">
            <div className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B9F1] shrink-0 mt-1.5" />
              <span>Make sure your face is well-lit and clearly visible.</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B9F1] shrink-0 mt-1.5" />
              <span>Remove glasses, hats, or masks before scanning.</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B9F1] shrink-0 mt-1.5" />
              <span>Hold still for 1.5 seconds once face tracking locks.</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full max-w-xs py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-extrabold text-white text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(0,185,241,0.25)] flex items-center justify-center gap-1.5 transition-all cursor-pointer mx-auto"
          >
            <span>Initialize Camera</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {status === 'scanning' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Face Enrollment Feed</h3>
            <p className="text-[10px] text-slate-450 mt-0.5">Position your face within the bounding grid</p>
          </div>

          <FaceCamera 
            isActive={true} 
            onCapture={handleCapture} 
            mode="register" 
          />

          <button
            onClick={() => setStatus('idle')}
            className="w-full py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {status === 'success' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-8"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-10 h-10 text-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1 text-emerald-400">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span className="text-xs uppercase font-extrabold tracking-widest">Success</span>
            </div>
            <h3 className="text-lg font-black text-white tracking-wide uppercase">Face Enrolled Successfully</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your biometric template is stored. The Parent Dashboard is now protected by hardware-level face authentication.
            </p>
          </div>

          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-mono text-slate-500">
            Descriptor ID: Float32Array[128]
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-8"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <UserCheck className="w-8 h-8 text-red-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-white tracking-wide uppercase">Registration Failed</h3>
            <p className="text-xs text-red-400 max-w-sm mx-auto leading-relaxed font-semibold">
              {errorMsg}
            </p>
          </div>

          <div className="flex gap-3 max-w-xs mx-auto">
            <button
              onClick={() => setStatus('idle')}
              className="flex-1 py-3 rounded-xl border border-slate-850 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default FaceRegistration;

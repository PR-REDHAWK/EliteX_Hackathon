import React, { useState, useEffect } from 'react';
import FaceCamera from './FaceCamera';
import FaceRegistration from './FaceRegistration';
import { verifyParentFace } from '../utils/faceRecognition';
import { ShieldCheck, ShieldAlert, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaceVerificationProps {
  onSuccess: () => void;
  onLogout: () => void;
}

export const FaceVerification: React.FC<FaceVerificationProps> = ({ onSuccess, onLogout }) => {

  const [verifyStatus, setVerifyStatus] = useState<'checking_setup' | 'verify_idle' | 'scanning' | 'success' | 'failed' | 'register_mode'>('checking_setup');
  const [distanceInfo, setDistanceInfo] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Check if a face descriptor exists on mount
  useEffect(() => {
    const descriptorExists = !!localStorage.getItem('parentFaceDescriptor');

    if (descriptorExists) {
      setVerifyStatus('scanning');
    } else {
      setVerifyStatus('register_mode');
    }
  }, []);

  const handleCapture = (descriptor: Float32Array) => {
    try {
      const result = verifyParentFace(descriptor);
      setDistanceInfo(result.distance);
      
      if (result.success) {
        setVerifyStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setVerifyStatus('failed');
        setErrorMsg(`Access Denied: Face mismatch. Confidence distance: ${result.distance.toFixed(3)} (Limit: < 0.600)`);
      }
    } catch (err: any) {
      setVerifyStatus('failed');
      setErrorMsg(err.message || 'An error occurred during verification.');
    }
  };

  const handleRetry = () => {
    setVerifyStatus('scanning');
    setDistanceInfo(null);
    setErrorMsg('');
  };

  const handleRegistrationComplete = () => {

    setVerifyStatus('success');
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-8 flex flex-col justify-center min-h-[500px]">
      <AnimatePresence mode="wait">
        
        {/* 1. Checking setup */}
        {verifyStatus === 'checking_setup' && (
          <motion.div
            key="checking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <RefreshCw className="w-8 h-8 text-[#00B9F1] animate-spin mx-auto mb-4" />
            <span className="text-xs text-slate-450 uppercase font-bold tracking-widest">Checking Biometric Profile...</span>
          </motion.div>
        )}

        {/* 2. Onboarding Registration Fallback */}
        {verifyStatus === 'register_mode' && (
          <motion.div
            key="register_fallback"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="p-4 bg-sky-500/10 border border-[#00B9F1]/20 rounded-2xl flex gap-3 text-xs leading-normal">
              <Sparkles className="w-5 h-5 text-[#00B9F1] shrink-0" />
              <div>
                <span className="text-white font-bold block mb-0.5">Biometric Profile Required</span>
                <p className="text-slate-400">
                  Welcome Vikram! Since this is your first time signing in, you must enroll your face to configure the hardware security lock.
                </p>
              </div>
            </div>
            
            <FaceRegistration onComplete={handleRegistrationComplete} />
            
            <button
              onClick={onLogout}
              className="w-full py-3 rounded-xl border border-slate-850 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Sign Out & Go Back
            </button>
          </motion.div>
        )}

        {/* 3. Scanning Verification Mode */}
        {verifyStatus === 'scanning' && (
          <motion.div
            key="scanning_mode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#00B9F1]/10 border border-[#00B9F1]/20 flex items-center justify-center mx-auto shadow-md">
                <KeyRound className="w-5 h-5 text-[#00B9F1]" />
              </div>
              <h3 className="text-lg font-black text-white tracking-wide uppercase">Identity Verification</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Scan your face to verify your identity and unlock the dashboard.
              </p>
            </div>

            <FaceCamera 
              isActive={true} 
              onCapture={handleCapture} 
              mode="verify" 
            />

            <div className="flex gap-4">
              <button
                onClick={onLogout}
                className="flex-1 py-3 rounded-xl border border-slate-850 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel / Sign Out
              </button>
            </div>
          </motion.div>
        )}

        {/* 4. Verification Successful */}
        {verifyStatus === 'success' && (
          <motion.div
            key="success_mode"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-10 h-10 text-emerald-500" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white uppercase tracking-wide">Identity Verified</h3>
              <p className="text-xs text-slate-400">Access granted. Unlocking Parent Dashboard...</p>
            </div>

            {distanceInfo !== null && (
              <span className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-mono text-emerald-400">
                Confidence Match: {distanceInfo.toFixed(3)}
              </span>
            )}
          </motion.div>
        )}

        {/* 5. Verification Failed */}
        {verifyStatus === 'failed' && (
          <motion.div
            key="failed_mode"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-red-500 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white uppercase tracking-wide">Verification Failed</h3>
              <p className="text-xs text-red-400 max-w-sm mx-auto leading-relaxed font-semibold">
                {errorMsg}
              </p>
            </div>

            <div className="flex gap-4 max-w-xs mx-auto">
              <button
                onClick={onLogout}
                className="flex-1 py-3 rounded-xl border border-slate-850 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-extrabold text-white text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(0,185,241,0.25)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Scan</span>
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
export default FaceVerification;

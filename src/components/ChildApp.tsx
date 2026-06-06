import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Shield, ArrowRight, ShieldCheck, ShieldX, KeyRound, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FaceScanner from './FaceScanner';

export const ChildApp: React.FC = () => {
  const {
    activeScenario,
    status,
    otpError,
    startTransaction,
    completeFaceScan,
    verifyOtp,
    resetTransaction,
  } = useApp();

  const [enteredOtp, setEnteredOtp] = useState<string[]>(Array(6).fill(''));
  const req = activeScenario.request;

  const handleOtpInput = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return; // Only numbers
    const newOtp = [...enteredOtp];
    newOtp[index] = val.slice(-1);
    setEnteredOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...enteredOtp];
      if (!newOtp[index] && index > 0) {
        newOtp[index - 1] = '';
        setEnteredOtp(newOtp);
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput?.focus();
      } else {
        newOtp[index] = '';
        setEnteredOtp(newOtp);
      }
    }
  };

  const handleVerify = () => {
    const code = enteredOtp.join('');
    if (code.length === 6) {
      const success = verifyOtp(code);
      if (!success) {
        // Clear OTP input on error
        setEnteredOtp(Array(6).fill(''));
        document.getElementById('otp-input-0')?.focus();
      }
    }
  };

  // Get matching game styling
  const getGameStyle = (gameName: string) => {
    if (gameName.toLowerCase().includes('roblox')) {
      return {
        bg: 'from-red-600 to-red-900',
        accent: 'bg-red-500',
        border: 'border-red-500/30',
        logo: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      };
    } else if (gameName.toLowerCase().includes('bgmi')) {
      return {
        bg: 'from-yellow-600 to-amber-900',
        accent: 'bg-amber-500',
        border: 'border-amber-500/30',
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      };
    } else {
      return {
        bg: 'from-emerald-600 to-green-950',
        accent: 'bg-emerald-500',
        border: 'border-emerald-500/30',
        logo: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      };
    }
  };

  const style = getGameStyle(req.gameName);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950">
      <AnimatePresence mode="wait">
        
        {/* IDLE SCREEN: In-Game Store Checkout */}
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between p-5"
          >
            {/* Store Header */}
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-6">
                <Gamepad2 className="w-4 h-4 text-sky-400" />
                <span>In-Game Store</span>
                <span className="text-slate-600">•</span>
                <span>Checkout</span>
              </div>

              {/* Game Poster / Card */}
              <div className={`rounded-3xl p-5 bg-gradient-to-br ${style.bg} border ${style.border} relative overflow-hidden shadow-lg mb-6`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <span className="text-[10px] bg-black/35 px-2 py-0.5 rounded-full text-white font-bold uppercase tracking-wider">
                    {req.gameName}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-2 leading-tight">
                    {req.itemName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-200 text-xs font-medium">Player:</span>
                    <span className="text-white text-xs font-bold">{req.childName.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* SecurePlay Guard Shield */}
              <div className="glass-paytm border border-sky-400/20 rounded-2xl p-4 flex gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center border border-sky-400/30 shrink-0">
                  <Shield className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-extrabold text-white">SecurePlay Guard Active</span>
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                    This transaction will undergo biometric age verification and real-time AI risk analysis.
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="glass rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-200 font-semibold">₹{req.purchaseAmount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Taxes & Fees</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="h-[1px] bg-slate-800" />
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white">Total Amount</span>
                  <span className="text-lg font-extrabold text-white">₹{req.purchaseAmount}</span>
                </div>
              </div>
            </div>

            {/* Slide / Buy Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={startTransaction}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-bold text-white text-sm shadow-[0_4px_20px_rgba(0,185,241,0.25)] flex items-center justify-center gap-2 tracking-wide mt-4"
            >
              <span>Verify & Pay</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* SCANNING SCREEN: Face Scanner */}
        {status === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between"
          >
            <FaceScanner
              targetAge={req.childAge}
              childName={req.childName}
              onComplete={completeFaceScan}
            />
          </motion.div>
        )}

        {/* ESTIMATING & ANALYZING SCREEN: AI processing HUD */}
        {(status === 'estimating' || status === 'analyzing') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
              {/* Spinning circular loader */}
              <div className="absolute inset-0 rounded-full border-[3px] border-slate-900" />
              <div className="absolute inset-0 rounded-full border-[3px] border-t-[#00B9F1] animate-spin" />
              <div className="w-14 h-14 rounded-full bg-[#00B9F1]/10 flex items-center justify-center border border-[#00B9F1]/20">
                <Shield className="w-6 h-6 text-[#00B9F1] animate-pulse" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white tracking-wide">
              {status === 'estimating' ? 'Running Model...' : 'Risk Assessment Engine'}
            </h3>
            
            <p className="text-xs text-slate-400 mt-2 max-w-[240px] leading-relaxed mx-auto">
              {status === 'estimating'
                ? 'Securing biometric record and mapping estimated minor parameters...'
                : 'Comparing purchase against historical spend, local time, and amount weights...'}
            </p>

            {/* Glowing HUD details */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-[260px] text-left">
              <div className="glass rounded-xl p-3 border border-slate-800">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold block">Biometrics</span>
                <span className="text-xs text-sky-400 font-extrabold mt-1 block">Age Verified</span>
              </div>
              <div className="glass rounded-xl p-3 border border-slate-800">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold block">Integrations</span>
                <span className="text-xs text-emerald-400 font-extrabold mt-1 block">API Linked</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* WAITING SCREEN: Checking parent response */}
        {status === 'waiting_parent' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-6"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {/* Radar Ring Animation */}
              <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-sky-400/5 border border-sky-400/20 animate-ping" />
                <div className="absolute inset-4 rounded-full bg-sky-400/5 border border-sky-400/20 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400/20 to-[#00B9F1]/20 flex items-center justify-center border border-[#00B9F1]/30">
                  <Loader2 className="w-8 h-8 text-[#00B9F1] animate-spin" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white tracking-wide">Waiting for Parent Approval</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-[220px] leading-normal">
                SecurePlay sent an alert with AI insights to your parent's dashboard.
              </p>

              {/* Details of request */}
              <div className="glass rounded-2xl p-4 w-full mt-8 text-left border border-slate-800">
                <span className="text-[8px] text-[#00B9F1] font-extrabold uppercase tracking-widest block mb-1">
                  PENDING REVIEW
                </span>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-400">Total Purchase:</span>
                  <span className="text-white font-bold">₹{req.purchaseAmount}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-400">Verified Age:</span>
                  <span className="text-white font-bold">{req.childAge} Years</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <span className={`font-bold ${req.riskLevel === 'High' ? 'text-red-500' : req.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {req.riskScore} / 100 ({req.riskLevel})
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest font-bold">
              SecurePlay Risk Intelligence Platform
            </p>
          </motion.div>
        )}

        {/* OTP ENTRY SCREEN: Child Enters OTP */}
        {status === 'otp_entry' && (
          <motion.div
            key="otp_entry"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-6"
          >
            <div>
              <div className="flex flex-col items-center text-center mt-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-sky-400/10 flex items-center justify-center border border-sky-400/20 mb-3">
                  <KeyRound className="w-6 h-6 text-[#00B9F1]" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">Enter Parent OTP</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-normal">
                  Ask your parent for the 6-digit verification code.
                </p>
              </div>

              {/* Code Input Box */}
              <div className="flex justify-between gap-2.5 max-w-[280px] mx-auto mb-4">
                {enteredOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-10 h-12 rounded-xl text-center text-xl font-bold bg-slate-900 border border-slate-800 text-white focus:border-[#00B9F1] focus:ring-1 focus:ring-[#00B9F1]/30 transition-all outline-none"
                  />
                ))}
              </div>

              {otpError && (
                <motion.p 
                  className="text-xs text-red-500 text-center font-semibold mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {otpError}
                </motion.p>
              )}
            </div>

            {/* Verify Button */}
            <div className="space-y-3">
              <button
                disabled={enteredOtp.join('').length < 6}
                onClick={handleVerify}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-bold text-white text-sm shadow-[0_4px_20px_rgba(0,185,241,0.25)] flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none tracking-wide"
              >
                <span>Verify OTP</span>
              </button>
              <button
                onClick={resetTransaction}
                className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                Cancel Purchase
              </button>
            </div>
          </motion.div>
        )}

        {/* APPROVED SUCCESS SCREEN */}
        {status === 'approved' && (
          <motion.div
            key="approved"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-6 bg-slate-950"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {/* Success Badge */}
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                {/* Glowing check background */}
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse-slow shadow-[0_0_25px_rgba(16,185,129,0.3)]" />
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-white tracking-wide">Purchase Approved</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-normal">
                OTP verified successfully. Your checkout has completed!
              </p>

              {/* Receipt card */}
              <div className="glass border border-slate-800 rounded-2xl p-4 w-full mt-8 text-left space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Receipt Detail</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-extrabold uppercase">SUCCESS</span>
                </div>
                <div className="h-[1px] bg-slate-800" />
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Game / Product:</span>
                  <span className="text-slate-200 font-semibold">{req.gameName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Item:</span>
                  <span className="text-slate-200 font-semibold">{req.itemName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Amount Charged:</span>
                  <span className="text-emerald-400 font-extrabold">₹{req.purchaseAmount}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Tx ID: SP_MOCK_{Math.floor(100000 + Math.random() * 900000)}</span>
                  <span>Just Now</span>
                </div>
              </div>
            </div>

            <button
              onClick={resetTransaction}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:to-emerald-600 font-bold text-white text-sm shadow-[0_4px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-1.5"
            >
              <span>Back to Store</span>
            </button>
          </motion.div>
        )}

        {/* BLOCKED SCREEN */}
        {status === 'blocked' && (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-6"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {/* Blocked Shield */}
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.25)] animate-pulse-slow" />
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center">
                  <ShieldX className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-white tracking-wide">Purchase Blocked</h3>
              
              <div className="glass border border-red-500/20 bg-red-950/10 rounded-2xl p-4 mt-6 text-left">
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-500 font-extrabold uppercase tracking-wider">AI Guard Intervention</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  This transaction was flagged as <span className="font-extrabold text-red-400">High Risk ({req.riskScore}/100)</span> and has been declined to protect your family's financial security.
                </p>
              </div>

              {/* Explanatory summary */}
              <p className="text-[11px] text-slate-400 mt-6 leading-relaxed max-w-[240px]">
                To approve future purchases, check in with your parent to review limits or request items during normal daytime hours.
              </p>
            </div>

            <button
              onClick={resetTransaction}
              className="w-full py-3.5 rounded-2xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 font-bold text-red-400 text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Back to Store</span>
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
export default ChildApp;

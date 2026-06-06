import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Shield, ArrowRight, ShieldCheck, ShieldX, KeyRound, Loader2, ShoppingBag, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChildApp: React.FC = () => {
  const {
    activeScenario,
    status,
    otpError,
    parentUsername,
    isRegistered,
    startTransaction,
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
        setEnteredOtp(Array(6).fill(''));
        document.getElementById('otp-input-0')?.focus();
      }
    }
  };

  // Get matching game styling
  const getGameStyle = (gameName: string) => {
    if (gameName.toLowerCase().includes('roblox')) {
      return {
        bg: 'from-red-600 to-red-950',
        accent: 'bg-red-500',
        text: 'text-red-400',
        border: 'border-red-500/20',
      };
    } else if (gameName.toLowerCase().includes('bgmi')) {
      return {
        bg: 'from-amber-600 to-amber-950',
        accent: 'bg-amber-500',
        text: 'text-amber-400',
        border: 'border-amber-500/20',
      };
    } else {
      return {
        bg: 'from-emerald-600 to-green-950',
        accent: 'bg-emerald-500',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
      };
    }
  };

  const style = getGameStyle(req.gameName);

  return (
    <div className="w-full min-h-[550px] glass rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        
        {/* IDLE SCREEN: Desktop Store Checkout */}
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 grid grid-cols-1 md:grid-cols-12"
          >
            {/* Left Column: Billing Details (7/12 width) */}
            <div className="md:col-span-7 p-8 space-y-6 flex flex-col justify-between border-r border-slate-900 bg-slate-950/45">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-8">
                  <Gamepad2 className="w-4.5 h-4.5 text-[#00B9F1]" />
                  <span>Store Checkout</span>
                  <span>/</span>
                  <span className="text-white">Billing Information</span>
                </div>

                <h3 className="text-lg font-black text-white tracking-wide mb-6">Saved Parent Payment Method</h3>
                
                {/* Mock Credit Card */}
                <div className="glass-paytm border border-sky-400/20 rounded-2xl p-5 relative overflow-hidden max-w-sm mb-6 shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">SecurePlay Verified Card</span>
                    <Lock className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-lg font-mono font-bold tracking-widest text-white mb-6">
                    •••• •••• •••• 4820
                  </div>
                  <div className="flex justify-between items-baseline text-[10px] text-slate-400 font-bold uppercase">
                    <div>
                      <span className="block text-[8px] text-slate-500 mb-0.5">Cardholder</span>
                      <span>Vikram Sharma</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 mb-0.5">Expires</span>
                      <span>09/29</span>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Billing Address</span>
                    <input 
                      type="text" 
                      disabled 
                      value="H-15, Connaught Place, New Delhi" 
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-400 select-none outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Postal Code</span>
                    <input 
                      type="text" 
                      disabled 
                      value="110001" 
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-400 select-none outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SecurePlay Warning Banner */}
              <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-400/10 bg-sky-400/5 mt-4">
                <Shield className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">SecurePlay Protection Enabled</h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                    This account is managed by parent restrictions. Attempting checkout will activate live age classification and parent OTP authorization.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Item (5/12 width) */}
            <div className="md:col-span-5 p-8 flex flex-col justify-between bg-slate-950">
              <div className="space-y-6">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  <span>Order Summary</span>
                </div>

                {/* Product Poster */}
                <div className={`rounded-2xl p-5 bg-gradient-to-br ${style.bg} border ${style.border} relative overflow-hidden shadow-lg`}>
                  <span className="text-[8px] bg-black/45 px-2 py-0.5 rounded-full text-white font-bold uppercase tracking-wider">
                    {req.gameName}
                  </span>
                  <h3 className="text-lg font-black text-white mt-3 leading-tight">
                    {req.itemName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-200">
                    <span>Account Profile:</span>
                    <span className="font-bold text-white">{req.childName.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Pricing Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-slate-200">₹{req.purchaseAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">SecurePlay Guard Fee</span>
                    <span className="text-emerald-400 font-bold">₹0</span>
                  </div>
                  <div className="h-[1px] bg-slate-900" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-white">Total Charge</span>
                    <span className="text-xl font-extrabold text-white">₹{req.purchaseAmount}</span>
                  </div>
                </div>
              </div>

              {/* Payment button */}
              <button
                onClick={startTransaction}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-extrabold text-white text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(0,185,241,0.25)] flex items-center justify-center gap-2 transition-all mt-6 cursor-pointer"
              >
                <span>Authorize & Complete Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}


        {/* ESTIMATING & ANALYZING SCREEN: Desktop AI HUD */}
        {(status === 'estimating' || status === 'analyzing') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[450px] bg-slate-950/30"
          >
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[3px] border-slate-900" />
              <div className="absolute inset-0 rounded-full border-[3px] border-t-[#00B9F1] animate-spin" />
              <div className="w-12 h-12 rounded-full bg-[#00B9F1]/10 flex items-center justify-center border border-[#00B9F1]/20">
                <Shield className="w-5 h-5 text-[#00B9F1] animate-pulse" />
              </div>
            </div>

            <h3 className="text-base font-extrabold text-white tracking-wide">
              {status === 'estimating' ? 'Running Age Detection Classifier' : 'Analyzing Spending Risk Matrices'}
            </h3>
            
            <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed mx-auto">
              {status === 'estimating'
                ? 'Securing face structure grid. Generating age estimates against model variables.'
                : 'Comparing purchase weights (₹' + req.purchaseAmount + ') against historical average values and velocities.'}
            </p>

            <div className="mt-8 flex gap-4 justify-center w-full max-w-md text-left">
              <div className="glass rounded-xl p-3.5 border border-slate-800 flex-1">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold block">Biometrics HUD</span>
                <span className="text-xs text-sky-400 font-extrabold mt-1 block">Mesh classification confirmed</span>
              </div>
              <div className="glass rounded-xl p-3.5 border border-slate-800 flex-1">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold block">Integrations</span>
                <span className="text-xs text-emerald-400 font-extrabold mt-1 block">API tunnel resolved</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* WAITING SCREEN: Desktop radar */}
        {status === 'waiting_parent' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-8 min-h-[450px]"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              
              {/* Radar Ring Animation */}
              <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#00B9F1]/5 border border-[#00B9F1]/20 animate-ping" />
                <div className="absolute inset-4 rounded-full bg-[#00B9F1]/5 border border-[#00B9F1]/20 animate-pulse" />
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400/15 to-[#00B9F1]/15 flex items-center justify-center border border-[#00B9F1]/25">
                  <Loader2 className="w-6 h-6 text-[#00B9F1] animate-spin" />
                </div>
              </div>

              <h3 className="text-lg font-black text-white tracking-wide">Waiting for Parent Approval</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
                SecurePlay sent a push alert notification to {isRegistered ? parentUsername : 'Vikram Sharma'}'s dashboard. Awaiting passcode generation.
              </p>

              {/* Transaction details card */}
              <div className="glass rounded-2xl p-4 w-full max-w-md mt-6 text-left border border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] text-[#00B9F1] font-extrabold uppercase tracking-widest block mb-0.5">
                    Order Details
                  </span>
                  <span className="text-xs text-white font-bold block">{req.itemName}</span>
                  <span className="text-[10px] text-slate-400">{req.gameName}</span>
                </div>
                
                <div className="text-right border-l border-slate-900 pl-4 space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="text-white font-bold">₹{req.purchaseAmount}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">AI Risk Score:</span>
                    <span className={`font-bold ${req.riskLevel === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {req.riskScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest font-bold mt-6">
              Awaiting parent decision... Check the "Parent Dashboard" tab on top.
            </p>
          </motion.div>
        )}

        {/* OTP PASSCODE ENTRY: Desktop OTP interface */}
        {status === 'otp_entry' && (
          <motion.div
            key="otp_entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-8 min-h-[450px]"
          >
            <div className="w-full max-w-md mx-auto space-y-6">
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#00B9F1]/10 flex items-center justify-center border border-[#00B9F1]/20 mb-3">
                  <KeyRound className="w-5 h-5 text-[#00B9F1]" />
                </div>
                <h3 className="text-lg font-black text-white tracking-wide">Enter Parent OTP Code</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[280px] leading-relaxed">
                  Input the 6-digit transaction passcode generated on the Parent Dashboard screen to complete order.
                </p>
              </div>

              {/* Pin input */}
              <div className="flex justify-between gap-3 max-w-[320px] mx-auto">
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
                    className="w-12 h-14 rounded-xl text-center text-2xl font-bold bg-slate-900 border border-slate-800 text-white focus:border-[#00B9F1] focus:ring-1 focus:ring-[#00B9F1]/30 transition-all outline-none"
                  />
                ))}
              </div>

              {otpError && (
                <motion.p 
                  className="text-xs text-red-500 text-center font-bold"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {otpError}
                </motion.p>
              )}
            </div>

            <div className="flex gap-4 max-w-md mx-auto w-full mt-8">
              <button
                onClick={resetTransaction}
                className="flex-1 py-3 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Cancel Order
              </button>
              <button
                disabled={enteredOtp.join('').length < 6}
                onClick={handleVerify}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-extrabold text-white text-xs tracking-wider uppercase shadow-[0_4px_25px_rgba(0,185,241,0.25)] flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <span>Verify & Complete</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* APPROVED SUCCESS PORTAL */}
        {status === 'approved' && (
          <motion.div
            key="approved"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 p-8 flex flex-col justify-between min-h-[450px] bg-slate-950/15"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full">
              
              <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-black text-white tracking-wide">Purchase Fully Approved</h3>
              <p className="text-xs text-slate-400 mt-1">
                Parent verification completed. Receipt details generated below.
              </p>

              {/* Large Invoice Portal */}
              <div className="glass border border-slate-800 rounded-2xl p-6 w-full mt-6 text-left space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-[#00B9F1] font-bold uppercase tracking-widest">TRANSACTION INVOICE</span>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-extrabold uppercase border border-emerald-500/25">COMPLETED</span>
                </div>
                
                <div className="h-[1px] bg-slate-900" />
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Purchaser</span>
                    <span className="text-slate-200 font-bold">{req.childName}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Product Item</span>
                    <span className="text-slate-200 font-bold">{req.itemName}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Game Platform</span>
                    <span className="text-slate-200 font-bold">{req.gameName}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Total Paid</span>
                    <span className="text-emerald-400 font-extrabold">₹{req.purchaseAmount}</span>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-900" />

                <div className="flex justify-between text-[9px] text-slate-500 font-medium">
                  <span>Receipt ID: SP_TX_{Math.floor(1000000 + Math.random() * 9000000)}</span>
                  <span>Date: June 6, 2026</span>
                </div>
              </div>
            </div>

            <button
              onClick={resetTransaction}
              className="max-w-md mx-auto w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:to-emerald-600 font-extrabold text-white text-xs tracking-widest uppercase transition-all cursor-pointer mt-6"
            >
              Return to game store
            </button>
          </motion.div>
        )}

        {/* BLOCKED SPLASH PORTAL */}
        {status === 'blocked' && (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 p-8 flex flex-col justify-between min-h-[450px]"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full">
              
              <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]" />
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                  <ShieldX className="w-7 h-7 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-black text-white tracking-wide">Checkout Blocked</h3>
              
              <div className="glass border border-red-500/20 bg-red-950/5 rounded-2xl p-5 mt-6 text-left w-full">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4.5 h-4.5 text-red-500" />
                  <span className="text-xs text-red-400 font-extrabold uppercase tracking-wider">SecurePlay Guard Action</span>
                </div>
                <p className="text-xs text-slate-350 leading-relaxed font-medium">
                  This transaction was flagged by AI as <span className="font-extrabold text-red-400">High Risk ({req.riskScore}/100)</span> and has been declined. {isRegistered ? parentUsername : 'Vikram Sharma'} has been notified.
                </p>
              </div>

              <p className="text-[10px] text-slate-500 mt-6 leading-relaxed max-w-sm">
                Limits are managed by the parent account. Request limits revision directly or attempt transactions during standard afternoon hours.
              </p>
            </div>

            <button
              onClick={resetTransaction}
              className="max-w-md mx-auto w-full py-3.5 rounded-xl border border-red-500/25 bg-red-500/5 hover:bg-red-500/10 font-bold text-red-400 text-xs tracking-widest uppercase transition-colors cursor-pointer mt-6"
            >
              Return to game store
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
export default ChildApp;

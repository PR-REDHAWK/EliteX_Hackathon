import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BarChart3, Bell, Shield, User, ChevronRight, 
  Fingerprint, Sparkles, Check, X, ShieldAlert, ArrowRight, 
  Trash2, ShieldCheck, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RiskGauge from './RiskGauge';
import AnalyticsCharts from './AnalyticsCharts';

export const ParentApp: React.FC = () => {
  const {
    activeScenario,
    status,
    otp,
    notifications,
    stats,
    triggerBiometrics,
    completeBiometrics,
    approveTransaction,
    rejectTransaction,
    resetTransaction,
    clearNotifications,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'notifications'>('home');
  const [bioStep, setBioStep] = useState(0); // 0: idle, 1: scanning, 2: success

  const req = activeScenario.request;

  // Handle biometric unlock sequence
  useEffect(() => {
    if (status === 'biometrics') {
      setBioStep(1);
      const timer = setTimeout(() => {
        setBioStep(2);
        const timer2 = setTimeout(() => {
          completeBiometrics();
        }, 800);
        return () => clearTimeout(timer2);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setBioStep(0);
    }
  }, [status]);

  // Translate risk levels to styling classes
  const getRiskStyle = (level: string) => {
    switch (level) {
      case 'High':
        return {
          text: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          badge: 'bg-red-500/10 text-red-400 border border-red-500/30'
        };
      case 'Medium':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
        };
      case 'Low':
      default:
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        };
    }
  };

  const riskStyle = getRiskStyle(req.riskLevel);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 relative">
      
      {/* Outer Scroll Container for Screens */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-16 flex flex-col">
        
        {/* HEADER SECTION (App Logo + Profile) */}
        {status !== 'biometrics' && status !== 'parent_decision' && status !== 'otp_entry' && (
          <div className="px-5 pt-4 pb-2 flex justify-between items-center bg-slate-950/40 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00B9F1] flex items-center justify-center shadow-lg">
                <Shield className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-extrabold text-white text-sm tracking-wide">
                SecurePlay <span className="text-[#00B9F1] text-[10px] uppercase font-bold tracking-widest bg-[#00B9F1]/10 px-1.5 py-0.5 rounded ml-1">Parent</span>
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* BIOMETRIC SECURITY LOCK MODAL */}
          {status === 'biometrics' && (
            <motion.div
              key="biometrics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-full max-w-[260px] glass rounded-3xl p-6 border border-slate-800 flex flex-col items-center shadow-2xl">
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full border-2 ${bioStep === 2 ? 'border-emerald-500 bg-emerald-500/10' : bioStep === 1 ? 'border-sky-500 animate-pulse' : 'border-slate-800'} transition-all`} />
                  {bioStep === 2 ? (
                    <Check className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <Fingerprint className={`w-10 h-10 ${bioStep === 1 ? 'text-[#00B9F1] animate-pulse-slow' : 'text-slate-500'}`} />
                  )}
                </div>

                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  {bioStep === 2 ? 'Identity Verified' : 'Parent Authentication'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                  {bioStep === 2 ? 'Access granted. Loading AI Risk analysis.' : 'Please scan fingerprint or look at the camera to authorize decision panel.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* AI DECISION REPORT PANEL */}
          {status === 'parent_decision' && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-5 space-y-5 flex flex-col"
            >
              {/* Back button */}
              <button 
                onClick={resetTransaction}
                className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1 -ml-1"
              >
                <X className="w-3.5 h-3.5" /> Close Analysis
              </button>

              {/* Child Info Card */}
              <div className="glass rounded-2xl p-4 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[8px] text-[#00B9F1] font-bold uppercase tracking-widest">
                    Requesting Account
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-1">{req.childName}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Age: {req.childAge} • Item: {req.itemName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest block">
                    Amount
                  </span>
                  <span className="text-lg font-extrabold text-[#00B9F1]">₹{req.purchaseAmount}</span>
                </div>
              </div>

              {/* SVG Gauge & Breakdown */}
              <div className="glass rounded-3xl p-5 border border-slate-800 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 flex justify-center">
                  <RiskGauge score={req.riskScore} level={req.riskLevel} />
                </div>
                
                {/* Score Indicators */}
                <div className="col-span-7 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    AI RISK EVALUATORS
                  </h4>
                  {Object.entries(req.riskBreakdown).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-semibold text-slate-300 capitalize">
                        <span>{key} Risk</span>
                        <span className={val > 70 ? 'text-red-400' : val > 40 ? 'text-amber-400' : 'text-emerald-400'}>{val}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${val > 70 ? 'bg-red-500' : val > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="glass-paytm border border-[#00B9F1]/20 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-[#00B9F1]" />
                  <span className="text-xs text-[#00B9F1] font-extrabold uppercase tracking-wider">AI Reasoning</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {req.explanation}
                </p>
              </div>

              {/* AI Recommendation Alert */}
              <div className={`p-4 rounded-2xl border ${riskStyle.bg} ${riskStyle.border} flex items-start gap-3`}>
                <div className="p-1 rounded-full bg-slate-900 shrink-0">
                  {req.recommendation === 'Reject' ? (
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[#00B9F1]" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    AI recommendation
                  </h4>
                  <p className="text-[10px] text-slate-300 mt-1 leading-normal">
                    The AI Engine suggests you <span className={`font-bold uppercase ${riskStyle.text}`}>{req.recommendation}</span> this transaction based on historical compliance.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={rejectTransaction}
                  className="py-3.5 rounded-2xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 font-bold text-red-400 text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X className="w-4 h-4" /> Reject Purchase
                </button>
                <button
                  onClick={approveTransaction}
                  className="py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-bold text-white text-sm shadow-[0_4px_25px_rgba(0,185,241,0.25)] flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Approve & OTP
                </button>
              </div>
            </motion.div>
          )}

          {/* OTP GENERATION PANEL */}
          {status === 'otp_entry' && (
            <motion.div
              key="otp_screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-5 space-y-6 flex flex-col justify-between"
            >
              {/* Back to feed */}
              <button 
                onClick={resetTransaction}
                className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1 -ml-1 self-start"
              >
                <X className="w-3.5 h-3.5" /> Back to Dashboard
              </button>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse-slow">
                  <ShieldCheck className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-base font-extrabold text-white tracking-wide">Purchase Authorized</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                  Provide this secure one-time passcode to {req.childName} to approve their transaction.
                </p>

                {/* Big OTP Card */}
                <div className="w-full glass border border-slate-700/60 rounded-3xl p-6 mt-8 relative overflow-hidden shadow-xl">
                  {/* Glowing BG accents */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#00B9F1]/5 rounded-full blur-xl" />
                  
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest block mb-3">
                    SECURE OTP PASSCODE
                  </span>
                  
                  {/* OTP Digits */}
                  <div className="flex justify-center gap-2.5 font-sans font-extrabold text-3xl text-white tracking-widest my-2 select-all">
                    {otp.split('').map((char, i) => (
                      <span key={i} className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl min-w-[44px]">
                        {char}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 mt-5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-[#00B9F1] animate-spin" />
                    <span>Expires in 1:59</span>
                  </div>
                </div>

                {/* Game / Price detail */}
                <div className="glass rounded-xl p-3 border border-slate-800 w-full mt-4 flex justify-between items-center text-xs">
                  <span className="text-slate-400">{req.gameName}</span>
                  <span className="text-white font-extrabold">₹{req.purchaseAmount}</span>
                </div>
              </div>

              {/* Share instructions */}
              <button 
                onClick={resetTransaction}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:to-emerald-600 font-bold text-white text-sm shadow-[0_4px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2"
              >
                <span>Done</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* MAIN TABS: HOME (Feed) */}
          {status !== 'biometrics' && status !== 'parent_decision' && status !== 'otp_entry' && activeTab === 'home' && (
            <motion.div
              key="home_tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 pt-3 space-y-5"
            >
              {/* Quick Summary Cards (Paytm Style layout) */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="glass rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Reviewed
                  </span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-xl font-extrabold text-white">{stats.purchasesReviewed}</span>
                    <span className="text-[9px] text-[#00B9F1] font-semibold">Checks</span>
                  </div>
                </div>
                <div className="glass rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Money Protected
                  </span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-xl font-extrabold text-emerald-400">₹{stats.moneyProtected}</span>
                  </div>
                </div>
              </div>

              {/* Pending Requests Alert */}
              {status === 'waiting_parent' && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-2xl p-4 bg-gradient-to-br from-red-500/10 to-amber-500/5 border border-red-500/30 glow-red"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                        1 High-Risk Request Pending
                      </span>
                    </div>
                    <span className="text-[9px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                      {req.riskLevel} Risk
                    </span>
                  </div>

                  {/* Tiny card preview */}
                  <div className="glass rounded-xl p-3 border border-slate-800/80 mt-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white">{req.childName}</h4>
                      <p className="text-[10px] text-slate-400">{req.gameName} • ₹{req.purchaseAmount}</p>
                    </div>
                    <button
                      onClick={triggerBiometrics}
                      className="text-[10px] bg-[#00B9F1] hover:bg-sky-500 text-white font-extrabold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-0.5 transition-colors"
                    >
                      <span>Analyze</span> <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Quick AI Insights Tips */}
              <div className="glass-paytm border border-[#00B9F1]/15 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-4.5 h-4.5 text-[#00B9F1] animate-pulse" />
                  <h4 className="text-xs font-extrabold text-[#00B9F1] uppercase tracking-wider">
                    Quick AI Intelligence
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {activeScenario.id === 'A' 
                    ? 'Aarav has attempted 3 purchases after 11 PM this month. AI recommends locking in-app stores during nighttime hours.' 
                    : activeScenario.id === 'B'
                      ? 'Riya Verma displays minor microtransaction spam behavior. High purchase frequency detected, consider checking weekly spend limits.'
                      : 'Kabir is verified as an Adult. Low profile activity detected, instant approvals are recommended.'
                  }
                </p>
              </div>

              {/* Recent Reviews Feed */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Recent Request Log
                </h4>
                
                {/* Mock Review Logs */}
                <div className="space-y-2.5">
                  <div className="glass rounded-xl p-3 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <h5 className="font-bold text-white">Siddharth Sen</h5>
                      <span className="text-[9px] text-slate-400">Minecraft • Approved via OTP</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-400">₹299</span>
                      <span className="text-[8px] text-slate-500 block">3h ago</span>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-3 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <h5 className="font-bold text-white">Riya Verma</h5>
                      <span className="text-[9px] text-slate-400">Free Fire • Blocked (High Risk)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-400">₹2,500</span>
                      <span className="text-[8px] text-slate-500 block">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* MAIN TABS: INSIGHTS (SVG Charts) */}
          {status !== 'biometrics' && status !== 'parent_decision' && status !== 'otp_entry' && activeTab === 'insights' && (
            <motion.div
              key="insights_tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 pt-3 space-y-4"
            >
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Spending Insights</h3>
              <AnalyticsCharts 
                activeScenario={activeScenario} 
                moneyProtected={stats.moneyProtected} 
              />
            </motion.div>
          )}

          {/* MAIN TABS: NOTIFICATIONS */}
          {status !== 'biometrics' && status !== 'parent_decision' && status !== 'otp_entry' && activeTab === 'notifications' && (
            <motion.div
              key="notifications_tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 pt-3 space-y-4 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Alert Center</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-bold uppercase transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                      <p className="text-xs font-semibold">All quiet. No notifications.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`glass rounded-xl p-3 border ${
                          notif.type === 'alert'
                            ? 'border-red-500/20 bg-red-950/5'
                            : notif.type === 'success'
                            ? 'border-emerald-500/20 bg-emerald-950/5'
                            : 'border-slate-800'
                        } flex gap-3 text-xs relative overflow-hidden`}
                      >
                        {/* Type Icon */}
                        <div className="mt-0.5">
                          {notif.type === 'alert' ? (
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                          ) : notif.type === 'success' ? (
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Bell className="w-4 h-4 text-sky-400" />
                          )}
                        </div>
                        {/* Text */}
                        <div className="space-y-0.5 pr-4">
                          <h5 className="font-extrabold text-slate-200">{notif.title}</h5>
                          <p className="text-[10px] text-slate-400 leading-normal">{notif.message}</p>
                          <span className="text-[8px] text-slate-500 block">{notif.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* BOTTOM TAB NAVIGATION BAR */}
      {status !== 'biometrics' && status !== 'parent_decision' && status !== 'otp_entry' && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur border-t border-slate-900 flex items-center justify-around z-30 select-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              activeTab === 'home' ? 'text-[#00B9F1]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              activeTab === 'insights' ? 'text-[#00B9F1]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all relative ${
              activeTab === 'notifications' ? 'text-[#00B9F1]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {notifications.some(n => !n.read) && (
              <span className="absolute top-0.5 right-4 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
            <Bell className="w-5 h-5" />
            <span>Alerts</span>
          </button>
        </div>
      )}

    </div>
  );
};
export default ParentApp;

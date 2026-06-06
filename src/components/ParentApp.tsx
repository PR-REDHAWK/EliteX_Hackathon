import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BarChart3, Bell, ChevronRight, 
  Sparkles, Shield, X, ShieldAlert, ArrowRight, 
  Trash2, ShieldCheck, Clock, Activity, LogOut, Lock, Mail, User as UserIcon,
  Settings, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RiskGauge from './RiskGauge';
import AnalyticsCharts from './AnalyticsCharts';
import FaceVerification from './FaceVerification';
import FaceRegistration from './FaceRegistration';

export const ParentApp: React.FC = () => {
  const {
    activeScenario,
    status,
    otp,
    notifications,
    stats,
    isRegistered,
    isLoggedIn,
    parentUsername,
    parentEmail,
    isFaceVerified,
    setFaceVerified,
    registerParent,
    loginParent,
    logoutParent,
    triggerBiometrics,
    approveTransaction,
    rejectTransaction,
    resetTransaction,
    clearNotifications,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'notifications' | 'settings'>('home');
  const [isRegisteringInSettings, setIsRegisteringInSettings] = useState(false);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(isRegistered ? 'login' : 'signup');
  const [usernameInput, setUsernameInput] = useState('vikram99');
  const [emailInput, setEmailInput] = useState('parent@secureplay.com');
  const [pswInput, setPswInput] = useState('parent123');
  const [confirmPswInput, setConfirmPswInput] = useState('parent123');
  const [loginInput, setLoginInput] = useState('vikram99');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (isRegistered) {
      setAuthMode('login');
    }
  }, [isRegistered]);

  const req = activeScenario.request;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !emailInput || !pswInput) {
      setAuthError('All fields are required.');
      return;
    }
    if (pswInput !== confirmPswInput) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthError('');
    registerParent(usernameInput, emailInput, pswInput);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput || !pswInput) {
      setAuthError('All fields are required.');
      return;
    }
    const success = loginParent(loginInput, pswInput);
    if (success) {
      setAuthError('');
    } else {
      setAuthError('Invalid username/email or password. Try registering first or autofill demo details.');
    }
  };

  const autofillDemo = () => {
    setUsernameInput('vikram99');
    setEmailInput('parent@secureplay.com');
    setPswInput('parent123');
    setConfirmPswInput('parent123');
    setLoginInput('vikram99');
    setAuthError('');
  };

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

  // RENDER AUTHENTICATION VIEW IF NOT LOGGED IN
  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-[550px] glass rounded-3xl border border-slate-800 flex overflow-hidden shadow-2xl bg-slate-950/20">
        
        {/* Left Side: Brand Promo Info (Widescreen only) */}
        <div className="hidden md:flex md:w-[45%] bg-slate-950/50 border-r border-slate-900 p-8 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B9F1]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-[#00B9F1] flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight leading-tight">
              SecurePlay Parent Portal
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Protect your family's savings from unauthorized in-game gaming microtransactions using dynamic age verification and real-time transaction risk scoring.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-[#00B9F1] shrink-0" />
              <div>
                <span className="text-white font-bold block">AI Risk Engine</span>
                <span className="text-slate-400">Contextual evaluation of transaction times, patterns, and spend velocities.</span>
              </div>
            </div>
            <div className="flex gap-3 text-xs">
              <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-white font-bold block">OTP Authorizations</span>
                <span className="text-slate-400">Generate secure verification codes instantly for valid purchases.</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
            Fintech AI Guardian Platform
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="flex-1 p-8 flex flex-col justify-center max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            {authMode === 'signup' ? (
              
              /* SIGN UP MODE */
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleRegister}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Create Parent Account</h3>
                  <p className="text-xs text-slate-400 mt-1">Register credentials to start managing transactions.</p>
                </div>

                {authError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400 font-bold">
                    {authError}
                  </div>
                )}

                <div className="space-y-3.5 text-xs">
                  {/* Username */}
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Username</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="E.g. vikram99"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-[#00B9F1] focus:ring-1 focus:ring-[#00B9F1]/20 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="E.g. parent@secureplay.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-[#00B9F1] focus:ring-1 focus:ring-[#00B9F1]/20 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={pswInput}
                        onChange={(e) => setPswInput(e.target.value)}
                        placeholder="Enter secure passcode"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-[#00B9F1] focus:ring-1 focus:ring-[#00B9F1]/20 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={confirmPswInput}
                        onChange={(e) => setConfirmPswInput(e.target.value)}
                        placeholder="Re-enter passcode"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-[#00B9F1] focus:ring-1 focus:ring-[#00B9F1]/20 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-extrabold text-white text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(0,185,241,0.25)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Register Credentials</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-[#00B9F1] hover:underline font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Already registered? Log In
                    </button>
                    <button
                      type="button"
                      onClick={autofillDemo}
                      className="text-slate-400 hover:text-white font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Autofill Mock values
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              
              /* LOG IN MODE */
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Parent Portal Login</h3>
                  <p className="text-xs text-slate-400 mt-1">Authenticate access to transaction decision reports.</p>
                </div>

                {authError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400 font-bold">
                    {authError}
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  {/* Email or Username */}
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Email or Username</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder="parent@secureplay.com or vikram99"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-[#00B9F1] focus:ring-1 focus:ring-[#00B9F1]/20 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={pswInput}
                        onChange={(e) => setPswInput(e.target.value)}
                        placeholder="parent123"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-[#00B9F1] focus:ring-1 focus:ring-[#00B9F1]/20 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-extrabold text-white text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(0,185,241,0.25)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Secure Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-[#00B9F1] hover:underline font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Need an account? Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={autofillDemo}
                      className="text-slate-400 hover:text-white font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Autofill Mock values
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    );
  }

  // RENDER FACE VERIFICATION LOCK SCREEN IF LOGGED IN BUT NOT FACE-VERIFIED
  if (!isFaceVerified) {
    return (
      <div className="w-full min-h-[550px] glass rounded-3xl border border-slate-800 flex items-center justify-center shadow-2xl bg-slate-950/20 p-6">
        <FaceVerification
          onSuccess={() => setFaceVerified(true)}
          onLogout={logoutParent}
        />
      </div>
    );
  }

  // RENDER MAIN DASHBOARD IF LOGGED IN AND FACE-VERIFIED
  return (
    <div className="w-full min-h-[550px] glass rounded-3xl border border-slate-800 flex overflow-hidden shadow-2xl relative">
      
      {/* 1. Left Sidebar Navigation Panel */}
      {status !== 'parent_decision' && status !== 'otp_entry' && (
        <aside className="w-56 bg-slate-950/45 border-r border-slate-900 p-5 flex flex-col justify-between select-none">
          <div className="space-y-6">
            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block pl-2">
              SaaS Navigation
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-[#00B9F1]/10 text-[#00B9F1] border border-[#00B9F1]/15'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Overview Feed</span>
              </button>
              
              <button
                onClick={() => setActiveTab('insights')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'insights'
                    ? 'bg-[#00B9F1]/10 text-[#00B9F1] border border-[#00B9F1]/15'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Spending Insights</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'bg-[#00B9F1]/10 text-[#00B9F1] border border-[#00B9F1]/15'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-3 right-4 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
                <Bell className="w-4 h-4" />
                <span>Alert Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#00B9F1]/10 text-[#00B9F1] border border-[#00B9F1]/15'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings & Security</span>
              </button>
            </nav>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 pl-2 text-[10px] text-slate-450">
              <Activity className="w-3.5 h-3.5 text-[#00B9F1]" />
              <span>User: {parentUsername}</span>
            </div>
            
            <button
              onClick={logoutParent}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-extrabold uppercase text-red-400 hover:bg-red-500/10 border border-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Secure Log Out</span>
            </button>
          </div>
        </aside>
      )}

      {/* 2. Main Dashboard panel workspace */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          
          {/* AI DECISION REPORT PANEL (DESKTOP) */}
          {status === 'parent_decision' && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 space-y-6 flex flex-col justify-between"
            >
              <div>
                {/* Back button */}
                <button 
                  onClick={resetTransaction}
                  className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1 -ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Close Risk Report
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                  {/* Left Column: Risk Gauge & Reasoning (5/12 width) */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="glass rounded-3xl p-5 border border-slate-800 flex flex-col items-center">
                      <span className="text-[9px] text-[#00B9F1] font-bold uppercase tracking-widest mb-4">AI EVALUATOR RADIAL</span>
                      <RiskGauge score={req.riskScore} level={req.riskLevel} />
                    </div>

                    <div className="glass-paytm border border-[#00B9F1]/20 rounded-2xl p-5">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Sparkles className="w-4.5 h-4.5 text-[#00B9F1] animate-pulse" />
                        <span className="text-xs text-[#00B9F1] font-extrabold uppercase tracking-wider">AI Insight & Analysis</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                        {req.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Profile details & evaluator bars (7/12 width) */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="glass rounded-2xl p-5 border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">Purchaser</span>
                        <h3 className="text-sm font-extrabold text-white">{req.childName}</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Verified Minor Profile • Age {req.childAge}</p>
                      </div>
                      <div className="text-right border-l border-slate-900 pl-6">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">Product Cost</span>
                        <span className="text-lg font-extrabold text-[#00B9F1]">₹{req.purchaseAmount}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{req.itemName}</p>
                      </div>
                    </div>

                    <div className="glass rounded-3xl p-5 border border-slate-800 space-y-3.5">
                      <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-900">
                        Evaluator Breakdown Metrics
                      </h4>
                      {Object.entries(req.riskBreakdown).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-350 capitalize">
                            <span>{key} Risk factor</span>
                            <span className={val > 70 ? 'text-red-400' : val > 40 ? 'text-amber-400' : 'text-emerald-400'}>{val}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                            <div
                              className={`h-full rounded-full ${val > 70 ? 'bg-red-500' : val > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI suggested action banner */}
                    <div className={`p-4 rounded-2xl border ${riskStyle.bg} ${riskStyle.border} flex items-start gap-3`}>
                      <ShieldAlert className="w-5 h-5 text-slate-300 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Smart Action suggested</h4>
                        <p className="text-[10px] text-slate-300 mt-1 leading-normal">
                          The system suggests you <span className={`font-bold uppercase ${riskStyle.text}`}>{req.recommendation}</span> this transaction due to minor age guidelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approve/Reject Footer actions */}
              <div className="flex gap-4 max-w-xl ml-auto w-full mt-6">
                <button
                  onClick={rejectTransaction}
                  className="flex-1 py-3 rounded-xl border border-red-500/35 bg-red-500/5 hover:bg-red-500/10 font-bold text-red-400 text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Decline Checkout
                </button>
                <button
                  onClick={approveTransaction}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-extrabold text-white text-xs tracking-wider uppercase shadow-[0_4px_25px_rgba(0,185,241,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Approve & Generate OTP
                </button>
              </div>
            </motion.div>
          )}

          {/* OTP GENERATION PANEL (DESKTOP) */}
          {status === 'otp_entry' && (
            <motion.div
              key="otp_screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-6 flex flex-col justify-between"
            >
              <button 
                onClick={resetTransaction}
                className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1 -ml-1 self-start cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Close Screen
              </button>

              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full my-6">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <ShieldCheck className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-lg font-black text-white tracking-wide">Checkout OTP passcode</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                  Provide this 6-digit transaction PIN code to {req.childName} to verify and complete order.
                </p>

                {/* Big OTP Card */}
                <div className="w-full glass border border-slate-700/60 rounded-3xl p-6 mt-6 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#00B9F1]/5 rounded-full blur-xl" />
                  
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest block mb-4">
                    SECURE AUTHORIZATION PIN
                  </span>
                  
                  <div className="flex justify-center gap-3 font-mono font-bold text-3xl text-white tracking-widest select-all">
                    {otp.split('').map((char, i) => (
                      <span key={i} className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[48px]">
                        {char}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 mt-5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-[#00B9F1] animate-spin" />
                    <span>Expires in 1:59</span>
                  </div>
                </div>

                <div className="glass rounded-xl p-3 border border-slate-800 w-full mt-4 flex justify-between items-center text-xs">
                  <span className="text-slate-400">{req.gameName} store Order</span>
                  <span className="text-white font-extrabold">₹{req.purchaseAmount}</span>
                </div>
              </div>

              <button 
                onClick={resetTransaction}
                className="max-w-md mx-auto w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:to-emerald-600 font-bold text-white text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Done</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* MAIN TABS: OVERVIEW FEED (Home) */}
          {status !== 'parent_decision' && status !== 'otp_entry' && activeTab === 'home' && (
            <motion.div
              key="home_tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reviewed Items</span>
                  <span className="text-2xl font-extrabold text-white mt-1.5">{stats.purchasesReviewed}</span>
                </div>
                <div className="glass rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protected Capital</span>
                  <span className="text-2xl font-extrabold text-emerald-400 mt-1.5">₹{stats.moneyProtected}</span>
                </div>
                <div className="glass rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Purchases Approved</span>
                  <span className="text-2xl font-extrabold text-[#00B9F1] mt-1.5">{stats.purchasesApproved}</span>
                </div>
                <div className="glass rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Risk Blocks</span>
                  <span className="text-2xl font-extrabold text-red-400 mt-1.5">{stats.highRiskBlocked}</span>
                </div>
              </div>

              {/* Alert Notification */}
              {status === 'waiting_parent' && (
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-2xl p-5 bg-gradient-to-br from-red-500/10 to-amber-500/5 border border-red-500/25 glow-red shadow-lg flex justify-between items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        1 High-Risk Request Awaiting Audit
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      Player {req.childName} is trying to purchase {req.itemName} for ₹{req.purchaseAmount} on {req.gameName}.
                    </p>
                  </div>
                  <button
                    onClick={triggerBiometrics}
                    className="text-xs bg-[#00B9F1] hover:bg-sky-500 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span>Analyze Order</span> <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Two-Column details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Left Column: Quick AI insights (7/12 width) */}
                <div className="md:col-span-7 glass-paytm border border-[#00B9F1]/15 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-[#00B9F1] animate-pulse" />
                      <h4 className="text-xs font-extrabold text-[#00B9F1] uppercase tracking-wider">
                        SaaS AI Security Insights
                      </h4>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                      {activeScenario.id === 'A' 
                        ? 'Aarav has attempted 3 purchases after 11 PM this month. AI recommends locking in-app stores during nighttime hours.' 
                        : activeScenario.id === 'B'
                          ? 'Riya Verma displays minor microtransaction spam behavior. High purchase frequency detected, consider checking weekly spend limits.'
                          : 'Kabir is verified as an Adult. Low profile activity detected, instant approvals are recommended.'
                      }
                    </p>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-6 leading-relaxed border-t border-slate-900/60 pt-3">
                    Recommendation model checks for minor age verification, transaction spike indices, and behavioral time indicators.
                  </p>
                </div>

                {/* Right Column: Recent Log History (5/12 width) */}
                <div className="md:col-span-5 glass rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4">
                  <h4 className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest">
                    Recent Verified Transactions
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="glass rounded-xl p-3 border border-slate-900 flex justify-between items-center text-xs">
                      <div>
                        <h5 className="font-bold text-white">Siddharth Sen</h5>
                        <span className="text-[9px] text-slate-400">Minecraft • Approved via OTP</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400">₹299</span>
                        <span className="text-[8px] text-slate-500 block mt-0.5">3h ago</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* MAIN TABS: SPENDING ANALYTICS */}
          {status !== 'parent_decision' && status !== 'otp_entry' && activeTab === 'insights' && (
            <motion.div
              key="insights_tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2">Spending Intelligence Diagnostics</h3>
              <AnalyticsCharts 
                activeScenario={activeScenario} 
                moneyProtected={stats.moneyProtected} 
              />
            </motion.div>
          )}

          {/* MAIN TABS: ALERT LOGS */}
          {status !== 'parent_decision' && status !== 'otp_entry' && activeTab === 'notifications' && (
            <motion.div
              key="notifications_tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Alert Center Notification Stream</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-bold uppercase transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Logs
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 col-span-2">
                    <Bell className="w-9 h-9 mx-auto mb-3 text-slate-700" />
                    <p className="text-xs font-semibold">Verification logs are empty.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`glass rounded-xl p-4 border ${
                        notif.type === 'alert'
                          ? 'border-red-500/20 bg-red-950/5'
                          : notif.type === 'success'
                          ? 'border-emerald-500/20 bg-emerald-950/5'
                          : 'border-slate-800'
                      } flex gap-4 text-xs`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'alert' ? (
                          <ShieldAlert className="w-5 h-5 text-red-500" />
                        ) : notif.type === 'success' ? (
                          <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Bell className="w-5 h-5 text-sky-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-extrabold text-slate-200">{notif.title}</h5>
                        <p className="text-[10px] text-slate-400 leading-normal">{notif.message}</p>
                        <span className="text-[8px] text-slate-500 block pt-1">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* MAIN TABS: SETTINGS & SECURITY */}
          {status !== 'parent_decision' && status !== 'otp_entry' && activeTab === 'settings' && (
            <motion.div
              key="settings_tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Settings & Hardware Security</h3>
              </div>

              {!isRegisteringInSettings ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: Security Status Card (7/12 width) */}
                  <div className="md:col-span-7 glass border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Parental Biometric Lock</span>
                        {localStorage.getItem('parentFaceDescriptor') ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold uppercase tracking-widest">
                            Enrolled & Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[9px] font-extrabold uppercase tracking-widest">
                            Not Enrolled
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-355 leading-relaxed font-semibold">
                        SecurePlay enforces hardware-level Face ID verification using your device camera. The dashboard remains fully locked after email login until a live face scan matches your registered template (Euclidean threshold &lt; 0.6).
                      </p>

                      <div className="h-[1px] bg-slate-900/60" />

                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Verification Model</span>
                          <span className="text-white font-bold">tiny_face_detector_model</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Resolution Parameters</span>
                          <span className="text-white font-bold">640x480 user-facing webcam</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Similarity Distance Limit</span>
                          <span className="text-[#00B9F1] font-bold">&lt; 0.600 threshold</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsRegisteringInSettings(true)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-[#00B9F1] hover:to-sky-500 font-extrabold text-white text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(0,185,241,0.25)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                      <span>{localStorage.getItem('parentFaceDescriptor') ? 'Re-register Face ID' : 'Enroll Face ID'}</span>
                    </button>
                  </div>

                  {/* Right Column: Account Management (5/12 width) */}
                  <div className="md:col-span-5 glass rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4">
                    <h4 className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest">
                      Registered Credentials
                    </h4>
                    
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Username</span>
                        <span className="text-white font-semibold block bg-slate-900 border border-slate-900/50 rounded-lg p-2">{parentUsername}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Email Address</span>
                        <span className="text-white font-semibold block bg-slate-900 border border-slate-900/50 rounded-lg p-2">{parentEmail}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Protected Sandbox Capital</span>
                        <span className="text-emerald-400 font-extrabold block bg-slate-900 border border-slate-900/50 rounded-lg p-2">₹{stats.moneyProtected}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-lg mx-auto">
                  <FaceRegistration 
                    onComplete={() => {
                      setIsRegisteringInSettings(false);
                      setFaceVerified(true);
                    }} 
                  />
                  <button
                    onClick={() => setIsRegisteringInSettings(false)}
                    className="w-full py-2.5 rounded-xl border border-slate-850 hover:bg-slate-900 text-xs font-bold text-slate-450 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Back to Settings
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
};
export default ParentApp;

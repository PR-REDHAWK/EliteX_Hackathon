import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import DeviceSimulator from './components/DeviceSimulator';
import ChildApp from './components/ChildApp';
import ParentApp from './components/ParentApp';
import { 
  Shield, User, RefreshCw, Gamepad2, 
  ShieldCheck, Sparkles, HelpCircle
} from 'lucide-react';
import { SCENARIOS } from './scenarios';

function WorkspaceManager() {
  const { activeScenario, status, otp, setScenario, resetTransaction, stats } = useApp();
  const [activeTab, setActiveTab] = useState<'kid' | 'parent'>('kid');

  const req = activeScenario.request;

  // Guide texts for Kid Section
  const getKidGuide = () => {
    switch (status) {
      case 'idle':
        return {
          step: 'Step 1: Start Purchase',
          desc: 'Click "Verify & Pay" on the Child Device to simulate Aarav triggering a game checkout.',
        };
      case 'scanning':
        return {
          step: 'Step 2: Face Recognition',
          desc: 'The AI camera feed is running facial triangulation. Wait for age classification.',
        };
      case 'estimating':
      case 'analyzing':
        return {
          step: 'Step 3: Uploading Signatures',
          desc: 'Securing biometrics and calculating time, amount, and pattern risk indicators.',
        };
      case 'waiting_parent':
        return {
          step: 'Step 4: Pending Approval',
          desc: 'Request sent to parent. Click "Parent Dashboard" in the top navbar to review the alert.',
        };
      case 'biometrics':
      case 'parent_decision':
        return {
          step: 'Step 5: Parent Reviewing',
          desc: 'The parent is analyzing the AI Risk Assessment report on their dashboard.',
        };
      case 'otp_entry':
        return {
          step: 'Step 6: OTP Authorization',
          desc: 'A parent OTP has been generated. Enter this 6-digit passcode into the keypad.',
        };
      case 'approved':
        return {
          step: 'Success: Approved Flow',
          desc: 'OTP verified! The transaction has completed successfully and items are delivered.',
        };
      case 'blocked':
        return {
          step: 'Success: Blocked Flow',
          desc: 'AI Guard declined the purchase. Family savings are preserved and card is secure.',
        };
    }
  };

  // Guide texts for Parent Section
  const getParentGuide = () => {
    switch (status) {
      case 'idle':
      case 'scanning':
      case 'estimating':
      case 'analyzing':
        return {
          step: 'Standby Mode',
          desc: 'Waiting for microtransaction signals. Go to "Kid Section" to initiate a checkout.',
        };
      case 'waiting_parent':
        return {
          step: '🚨 Push Alert Received',
          desc: 'A new transaction requires authorization. Tap "Analyze" inside the notification card below.',
        };
      case 'biometrics':
        return {
          step: 'Biometrics Verification',
          desc: 'Simulating FaceID/Fingerprint scan to authorize parent access to the risk console.',
        };
      case 'parent_decision':
        return {
          step: 'AI Risk Diagnostics',
          desc: 'Inspect the circular gauge and risk bars. Tap "Approve & OTP" or "Reject".',
        };
      case 'otp_entry':
        return {
          step: 'OTP Passcode Generated',
          desc: `Passcode: ${otp || '------'}. Provide this passcode to the child verbally or copy it.`,
        };
      case 'approved':
        return {
          step: 'Review Completed',
          desc: 'Microtransaction was approved via OTP verification. Log has been archived.',
        };
      case 'blocked':
        return {
          step: 'Capital Secured',
          desc: `Declined ₹${req.purchaseAmount} charge. Savings metric has updated.`,
        };
    }
  };

  const kidGuide = getKidGuide();
  const parentGuide = getParentGuide();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      
      {/* Premium Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-900 px-4 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-[#00B9F1] flex items-center justify-center shadow-[0_4px_15px_rgba(0,185,241,0.3)]">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
              SecurePlay
            </h1>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mt-1">
              AI Risk Intelligence
            </span>
          </div>
        </div>

        {/* Center: Window Switcher Tabs */}
        <nav className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('kid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kid'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>Kid Section</span>
          </button>
          
          <button
            onClick={() => setActiveTab('parent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'parent'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Parent Dashboard</span>
          </button>
        </nav>

        {/* Right Side: Scenario Pills & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-850">
            {SCENARIOS.map((scen) => (
              <button
                key={scen.id}
                onClick={() => setScenario(scen.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                  activeScenario.id === scen.id
                    ? 'bg-[#00B9F1] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Scen {scen.id}
              </button>
            ))}
          </div>

          <button
            onClick={resetTransaction}
            title="Reset Simulation"
            className="p-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        
        {activeTab === 'kid' ? (
          
          /* KID SECTION WORKSPACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center max-w-5xl mx-auto w-full">
            
            {/* Left Column: Details & Instructions (Window Card) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="glass rounded-3xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00B9F1]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
                  <Gamepad2 className="w-5 h-5 text-sky-400" />
                  <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Kid Workspace Panel
                  </h2>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-900/50 pb-2">
                    <span className="text-slate-400 font-medium">Minor Profile:</span>
                    <span className="text-white font-bold">{req.childName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-2">
                    <span className="text-slate-400 font-medium">Verified Age:</span>
                    <span className="text-white font-bold">{req.childAge} Years</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-2">
                    <span className="text-slate-400 font-medium">In-Game Store:</span>
                    <span className="text-white font-bold">{req.gameName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-2">
                    <span className="text-slate-400 font-medium">Item & Amount:</span>
                    <span className="text-white font-bold">{req.itemName} (₹{req.purchaseAmount})</span>
                  </div>
                </div>
              </div>

              {/* Demo Helper guide */}
              <div className="glass-paytm border border-[#00B9F1]/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#00B9F1] font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>{kidGuide?.step}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {kidGuide?.desc}
                </p>
              </div>
            </div>

            {/* Right Column: Simulator Viewport */}
            <div className="lg:col-span-7 flex justify-center">
              <DeviceSimulator title="Child App Simulator" theme="child" currentTime="11:42 PM">
                <ChildApp />
              </DeviceSimulator>
            </div>

          </div>
        ) : (
          
          /* PARENT DASHBOARD WORKSPACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center max-w-5xl mx-auto w-full">
            
            {/* Left Column: Details & Instructions (Window Card) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="glass rounded-3xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Parent Dashboard Monitor
                  </h2>
                </div>

                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="flex justify-between border-b border-slate-900/50 pb-2">
                    <span className="text-slate-400 font-medium">Money Protected:</span>
                    <span className="text-emerald-400 font-extrabold">₹{stats.moneyProtected}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-2">
                    <span className="text-slate-400 font-medium">AI Recommendations:</span>
                    <span className={`font-bold ${req.riskLevel === 'High' ? 'text-red-400' : req.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {req.recommendation} (Score: {req.riskScore})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-2">
                    <span className="text-slate-400 font-medium">Active Scenario ID:</span>
                    <span className="text-white font-bold">Scenario {activeScenario.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-2">
                    <span className="text-slate-400 font-medium">Review Decisions:</span>
                    <span className="text-white font-bold">{stats.purchasesReviewed} items logged</span>
                  </div>
                </div>
              </div>

              {/* Demo Helper guide */}
              <div className="glass-paytm border border-[#00B9F1]/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#00B9F1] font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>{parentGuide?.step}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {parentGuide?.desc}
                </p>
              </div>
            </div>

            {/* Right Column: Simulator Viewport */}
            <div className="lg:col-span-7 flex justify-center">
              <DeviceSimulator title="Parent Dashboard Simulator" theme="parent" currentTime="11:42 PM">
                <ParentApp />
              </DeviceSimulator>
            </div>

          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="text-center text-[10px] text-slate-500 font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 py-4 border-t border-slate-900 select-none">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>SecurePlay Fintech Inc. © 2026. All rights reserved.</span>
      </footer>

    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <WorkspaceManager />
    </AppProvider>
  );
}

export default App;

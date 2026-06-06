import React from 'react';
import { Sparkles, RefreshCw, Layers, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCENARIOS } from '../scenarios';

export const ControlPanel: React.FC = () => {
  const { activeScenario, status, setScenario, resetTransaction } = useApp();

  // Status message translation for demo help
  const getDemoStep = () => {
    switch (status) {
      case 'idle':
        return {
          step: 'Step 1: Initiate Transaction',
          desc: 'Click "Verify & Pay" on the CHILD DEVICE below to trigger the purchase simulation.',
        };
      case 'scanning':
      case 'estimating':
        return {
          step: 'Step 2: AI Age Verification',
          desc: 'The child\'s camera feed is analyzed in real time. Watch the biometric mesh estimate age.',
        };
      case 'analyzing':
        return {
          step: 'Step 3: AI Risk Processing',
          desc: 'Evaluating transaction properties (amount size, spending velocity, time, pattern risk).',
        };
      case 'waiting_parent':
        return {
          step: 'Step 4: Parent Push Notification',
          desc: 'Notice the alert on the PARENT DEVICE. Tap "Analyze" inside the notification card to inspect.',
        };
      case 'biometrics':
        return {
          step: 'Step 5: Parent Authentication',
          desc: 'Simulating FaceID/Fingerprint scan to authenticate the parent before decision panel opens.',
        };
      case 'parent_decision':
        return {
          step: 'Step 6: AI Risk Report & Decision',
          desc: 'Review the large circular gauge and breakdown. Select "Approve & OTP" or "Reject".',
        };
      case 'otp_entry':
        return {
          step: 'Step 7: OTP Verification',
          desc: 'The parent gets a 6-digit OTP. Type this code into the keypad on the CHILD DEVICE.',
        };
      case 'approved':
        return {
          step: 'Demo Success: Approved Flow',
          desc: 'The OTP verified successfully. The in-game store checkout has completed.',
        };
      case 'blocked':
        return {
          step: 'Demo Success: Protected Flow',
          desc: 'The transaction was blocked. Parent savings are preserved! Reset below to try another.',
        };
    }
  };

  const demoStep = getDemoStep();

  return (
    <div className="w-full glass rounded-3xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#00B9F1]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#00B9F1]" />
            <h1 className="text-xl font-black text-white tracking-tight">
              SecurePlay <span className="text-slate-400 font-normal">Interactive Demo Control</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-[500px]">
            Demonstrating AI age verification and parent OTP authorization to protect families from risky microtransactions.
          </p>
        </div>

        {/* Global Reset */}
        <button
          onClick={resetTransaction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 hover:text-white text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Grid of Scenarios & Demo Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Select Scenario */}
        <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">
              Select Demo Scenario
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {SCENARIOS.map((scen) => {
                const isActive = activeScenario.id === scen.id;
                return (
                  <button
                    key={scen.id}
                    onClick={() => setScenario(scen.id)}
                    className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                      isActive
                        ? 'border-[#00B9F1] bg-[#00B9F1]/5 glow-blue shadow-[0_4px_15px_rgba(0,185,241,0.1)]'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-extrabold text-white">Scenario {scen.id}</span>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          scen.request.riskLevel === 'High'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : scen.request.riskLevel === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {scen.request.riskLevel}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <span className="text-[10px] text-slate-200 font-bold block">
                        {scen.request.gameName.split(' ')[0]} • ₹{scen.request.purchaseAmount}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-medium line-clamp-1">
                        Age {scen.request.childAge} • {scen.request.recommendation}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Scenario Details */}
          <div className="p-3 bg-slate-900/50 rounded-2xl border border-slate-800/80 flex items-start gap-3 mt-2">
            <div className="w-8 h-8 rounded-full bg-slate-850 flex items-center justify-center shrink-0 border border-slate-750">
              <Layers className="w-4 h-4 text-[#00B9F1]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                Scenario {activeScenario.id} details
              </p>
              <p className="text-xs text-slate-300 mt-0.5 font-medium leading-relaxed">
                {activeScenario.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Demo Guide HUD */}
        <div className="lg:col-span-5 glass-paytm border border-[#00B9F1]/20 rounded-2xl p-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00B9F1] animate-pulse" />
              <span className="text-[10px] text-[#00B9F1] font-extrabold uppercase tracking-widest">
                Interactive HUD Guide
              </span>
            </div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider pt-1">
              {demoStep?.step}
            </h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {demoStep?.desc}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Flow status</span>
            <span className="text-white font-extrabold bg-[#00B9F1]/10 px-2 py-0.5 rounded border border-[#00B9F1]/20">
              {status}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ControlPanel;

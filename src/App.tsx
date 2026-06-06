import { AppProvider } from './context/AppContext';
import ControlPanel from './components/ControlPanel';
import DeviceSimulator from './components/DeviceSimulator';
import ChildApp from './components/ChildApp';
import ParentApp from './components/ParentApp';
import { ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

function DashboardSimulator() {
  return (
    <div className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Top Banner (Hackathon Branding) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 rounded-2xl glass border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Sparkles className="w-5 h-5 text-[#00B9F1] animate-pulse" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Hackathon Live Pitch Sandbox
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800/80">
          <ShieldAlert className="w-3.5 h-3.5 text-[#00B9F1]" />
          <span>Active Risk Model: <strong className="text-white">SecurePlay v1.0.4-AI</strong></span>
        </div>
      </div>

      {/* Control Panel (Scenario Selector & Instructions) */}
      <ControlPanel />

      {/* Side-by-Side Mobile Viewports */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-center max-w-4xl mx-auto w-full mt-2 pb-12">
        {/* Child Simulator (Left Side) */}
        <div className="flex justify-center">
          <DeviceSimulator title="Child Device Sim" theme="child" currentTime="11:42 PM">
            <ChildApp />
          </DeviceSimulator>
        </div>

        {/* Parent Simulator (Right Side) */}
        <div className="flex justify-center">
          <DeviceSimulator title="Parent Device Sim" theme="parent" currentTime="11:42 PM">
            <ParentApp />
          </DeviceSimulator>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="text-center text-[10px] text-slate-500 font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 pb-4">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>SecurePlay Fintech Inc. © 2026. All rights reserved.</span>
      </div>

    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <DashboardSimulator />
    </AppProvider>
  );
}

export default App;

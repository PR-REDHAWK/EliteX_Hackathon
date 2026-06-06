import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface DeviceSimulatorProps {
  children: React.ReactNode;
  title: string;
  theme?: 'child' | 'parent';
  currentTime?: string;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  children,
  title,
  theme = 'child',
  currentTime = '11:43 PM',
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* Device Label */}
      <div className="mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-slate-700/50 shadow-md">
        <span
          className={`w-2.5 h-2.5 rounded-full animate-pulse-slow ${
            theme === 'child' ? 'bg-[#00B9F1]' : 'bg-[#002E6E]'
          }`}
        />
        <span className="text-xs font-semibold tracking-widest text-slate-300 uppercase font-sans">
          {title}
        </span>
      </div>

      {/* Main Phone Frame */}
      <div className="relative w-[345px] h-[680px] rounded-[48px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl transition-all duration-300 ring-4 ring-slate-800/40 glow-blue overflow-hidden flex flex-col">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-center border border-slate-800/40 shadow-inner">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/55" />
          </div>
          <div className="w-12 h-1 bg-slate-900 rounded-full ml-3" />
        </div>

        {/* Status Bar */}
        <div className="h-11 px-6 pt-3 flex items-center justify-between text-xs font-semibold text-slate-300 select-none z-40 bg-slate-950/20 backdrop-blur-sm">
          <span>{currentTime}</span>
          <div className="flex items-center gap-2.5">
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px]">5G</span>
            <Battery className="w-4 h-4 text-slate-300 fill-current" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-slate-950">
          {children}
        </div>

        {/* Home Navigation Bar / Pill */}
        <div className="h-6 flex items-center justify-center z-40 bg-slate-950/20 backdrop-blur-sm select-none">
          <div className="w-28 h-1 bg-slate-700/60 rounded-full mb-1 hover:bg-slate-500 transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
export default DeviceSimulator;

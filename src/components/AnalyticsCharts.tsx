import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, ShieldAlert, Award, Clock } from 'lucide-react';
import type { Scenario } from '../types';

interface AnalyticsChartsProps {
  activeScenario: Scenario;
  moneyProtected: number;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ activeScenario, moneyProtected }) => {
  const isAarav = activeScenario.request.childName === 'Aarav Sharma';
  const isRiya = activeScenario.request.childName === 'Riya Verma';

  // Dynamic spending trends based on selected child scenario
  const monthlyData = isAarav 
    ? [800, 1200, 600, 950, 1500, 4999]  // Aarav (high recent Roblox attempt)
    : isRiya 
      ? [150, 320, 250, 450, 390, 199]    // Riya (BGMI gamer)
      : [300, 400, 299, 350, 450, 299];   // Kabir (Minecraft adult user)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Custom Area Chart configuration
  const chartHeight = 100;
  const chartWidth = 500; // Increased width for desktop
  const maxVal = Math.max(...monthlyData, 1000);
  
  // Calculate SVG points for a smooth line
  const points = monthlyData.map((val, idx) => {
    const x = (idx / (monthlyData.length - 1)) * chartWidth;
    const y = chartHeight - (val / maxVal) * (chartHeight - 15);
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    // Draw simple cubic curve line
    const prevPt = points[idx - 1];
    const cpX1 = prevPt.x + (pt.x - prevPt.x) / 2;
    const cpY1 = prevPt.y;
    const cpX2 = prevPt.x + (pt.x - prevPt.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
  }, '');

  // Fill path closing at the bottom
  const fillD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  // Risk distribution data
  const riskDistribution = [
    { label: 'Low Risk', count: 18, color: '#22C55E' },
    { label: 'Medium Risk', count: 8, color: '#F59E0B' },
    { label: 'High Risk', count: isAarav ? 7 : 4, color: '#EF4444' }
  ];
  const maxRiskCount = Math.max(...riskDistribution.map(r => r.count));

  // Favorite games breakdown
  const gamesData = [
    { name: 'Roblox', percentage: isAarav ? 75 : 30, color: 'bg-red-500' },
    { name: 'BGMI (Battlegrounds)', percentage: isRiya ? 80 : 35, color: 'bg-sky-500' },
    { name: 'Minecraft', percentage: !isAarav && !isRiya ? 65 : 15, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      
      {/* SaaS Dashboard Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Protected Money */}
        <div className="glass-paytm border border-[#00B9F1]/20 rounded-2xl p-5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Capital Protected
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl font-extrabold text-white">₹{moneyProtected.toLocaleString('en-IN')}</span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +18.2%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Protected from unauthorized minor charges.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#00B9F1]/10 flex items-center justify-center border border-[#00B9F1]/25">
            <ShieldCheck className="w-6 h-6 text-[#00B9F1]" />
          </div>
        </div>

        {/* Metric 2: AI Interventions */}
        <div className="glass rounded-2xl p-5 flex items-center justify-between border border-slate-800 shadow-md">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              AI Risk Blocks
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl font-extrabold text-red-400">{isAarav ? '11' : '8'}</span>
              <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 ml-1">
                HIGH RISK
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Transactions auto-flagged and rejected.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/25">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
        </div>

        {/* Metric 3: Success Compliance Rate */}
        <div className="glass rounded-2xl p-5 flex items-center justify-between border border-slate-800 shadow-md">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Verification Compliance
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl font-extrabold text-emerald-400">98.4%</span>
              <span className="text-xs text-slate-400">Rate</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Legitimate purchases verified via OTP.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Row 2: Spend Trend Area Chart & Risk Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Spending Trend Area Chart (2/3 width) */}
        <div className="glass rounded-2xl p-5 border border-slate-800 lg:col-span-2 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest">
                  Historical Spending Trend
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Microtransaction patterns for {activeScenario.request.childName} over the last 6 months.
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#00B9F1] bg-[#00B9F1]/10 px-2 py-0.5 rounded border border-[#00B9F1]/20">
                Monthly Profile
              </span>
            </div>

            {/* Custom SVG Area Chart */}
            <div className="relative h-36 w-full flex items-end">
              <svg 
                className="w-full h-28 overflow-visible" 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGlowDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00B9F1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00B9F1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid line */}
                <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                <line x1="0" y1={chartHeight / 4} x2={chartWidth} y2={chartHeight / 4} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

                {/* Gradient Fill */}
                <motion.path
                  d={fillD}
                  fill="url(#chartGlowDesktop)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />

                {/* Stroke Line */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="#00B9F1"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />

                {/* Dot marker */}
                {points.length > 0 && (
                  <motion.circle
                    cx={points[points.length - 1].x}
                    cy={points[points.length - 1].y}
                    r="5"
                    fill="#FFFFFF"
                    stroke="#00B9F1"
                    strokeWidth="3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: 'spring' }}
                  />
                )}
              </svg>
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-slate-400 font-bold px-2 border-t border-slate-900/40 pt-2.5 mt-2">
            {months.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        {/* Risk Distribution Bar Chart (1/3 width) */}
        <div className="glass rounded-2xl p-5 border border-slate-800 flex flex-col justify-between shadow-lg">
          <div>
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest mb-1">
              AI Risk Distribution
            </h4>
            <p className="text-[10px] text-slate-400 mb-6">
              Total checked requests categorized by risk intensity.
            </p>
          </div>

          <div className="flex justify-around items-end h-28 pt-2">
            {riskDistribution.map((risk, idx) => {
              const heightPct = (risk.count / maxRiskCount) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 w-10">
                  <span className="text-[10px] font-extrabold text-slate-300">{risk.count}</span>
                  <div className="w-full bg-slate-900 rounded-t-lg h-20 flex items-end overflow-hidden border border-slate-850">
                    <motion.div
                      className="w-full rounded-t-lg"
                      style={{ backgroundColor: risk.color }}
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.15 }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold tracking-wide">{risk.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 3: Game Distribution Breakdown */}
      <div className="glass rounded-2xl p-5 border border-slate-800 shadow-lg">
        <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest mb-4">
          Device Activity & Game Distribution
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gamesData.map((game, idx) => (
            <div key={idx} className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-white">{game.name} Store</span>
                <span className="text-[#00B9F1]">{game.percentage}% Share</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className={`h-full rounded-full ${game.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${game.percentage}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Active Today
                </span>
                <span>{game.percentage > 50 ? 'Spiking' : 'Stable'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default AnalyticsCharts;

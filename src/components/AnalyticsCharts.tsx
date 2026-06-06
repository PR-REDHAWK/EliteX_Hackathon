import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck } from 'lucide-react';
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
  const chartHeight = 80;
  const chartWidth = 260;
  const maxVal = Math.max(...monthlyData, 1000);
  
  // Calculate SVG points for a smooth line
  const points = monthlyData.map((val, idx) => {
    const x = (idx / (monthlyData.length - 1)) * chartWidth;
    const y = chartHeight - (val / maxVal) * (chartHeight - 10);
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
    { label: 'Low', count: 18, color: '#22C55E' },
    { label: 'Medium', count: 8, color: '#F59E0B' },
    { label: 'High', count: isAarav ? 7 : 4, color: '#EF4444' }
  ];
  const maxRiskCount = Math.max(...riskDistribution.map(r => r.count));

  // Favorite games breakdown
  const gamesData = [
    { name: 'Roblox', percentage: isAarav ? 75 : 30, color: 'bg-red-500' },
    { name: 'BGMI', percentage: isRiya ? 80 : 35, color: 'bg-sky-500' },
    { name: 'Minecraft', percentage: !isAarav && !isRiya ? 65 : 15, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Dynamic Savings Card */}
      <div className="glass-paytm border border-[#00B9F1]/20 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Total Money Protected
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-white">₹{moneyProtected.toLocaleString('en-IN')}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +15.4%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Saved by blocking unauthorized card charges.
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#00B9F1]/10 flex items-center justify-center border border-[#00B9F1]/30">
          <ShieldCheck className="w-6 h-6 text-[#00B9F1]" />
        </div>
      </div>

      {/* Monthly Spending Trend (Area Chart) */}
      <div className="glass rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Spend Trend: {activeScenario.request.childName.split(' ')[0]}
          </h4>
          <span className="text-[10px] font-bold text-[#00B9F1] bg-[#00B9F1]/10 px-2 py-0.5 rounded">
            Last 6 Months
          </span>
        </div>

        {/* Custom SVG Area Chart */}
        <div className="relative h-24 w-full flex items-end">
          <svg className="w-full h-20 overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00B9F1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#00B9F1" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid line */}
            <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

            {/* Gradient Fill under line */}
            <motion.path
              d={fillD}
              fill="url(#chartGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Stroke Line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="#00B9F1"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />

            {/* Interactive dot at the end */}
            {points.length > 0 && (
              <motion.circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="4"
                fill="#FFFFFF"
                stroke="#00B9F1"
                strokeWidth="2.5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
              />
            )}
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-2">
          {months.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>

      {/* Grid of Risk & Games */}
      <div className="grid grid-cols-2 gap-4">
        {/* Risk Distribution Bar Chart */}
        <div className="glass rounded-2xl p-3 flex flex-col justify-between">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Risk Matrix
          </h4>
          <div className="flex justify-around items-end h-16 pt-2">
            {riskDistribution.map((risk, idx) => {
              const heightPct = (risk.count / maxRiskCount) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 w-7">
                  <span className="text-[8px] font-extrabold text-slate-300">{risk.count}</span>
                  <div className="w-full bg-slate-900 rounded-t-sm h-12 flex items-end">
                    <motion.div
                      className="w-full rounded-t-sm"
                      style={{ backgroundColor: risk.color }}
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.15 }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold">{risk.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Favorite Games Breakdowns */}
        <div className="glass rounded-2xl p-3 flex flex-col justify-between">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Top Games
          </h4>
          <div className="space-y-2.5">
            {gamesData.map((game, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[9px] font-semibold text-slate-300">
                  <span>{game.name}</span>
                  <span>{game.percentage}%</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${game.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${game.percentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsCharts;

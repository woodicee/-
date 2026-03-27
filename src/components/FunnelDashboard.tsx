import React from 'react';
import { motion } from 'motion/react';
import { FUNNEL_DATA } from '../constants';
import { ArrowDown, TrendingUp } from 'lucide-react';

export default function FunnelDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black tracking-tighter text-white">全链路漏斗看板</h3>
          <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">Full-Link Conversion Funnel</p>
        </div>
        <div className="px-4 py-2 bg-rose-600/10 border border-rose-500/20 rounded-xl">
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">当前状态：大促活动期</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {FUNNEL_DATA.map((step, i) => (
          <React.Fragment key={step.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative w-full max-w-2xl"
            >
              <div 
                className={`jianghu-card p-6 rounded-3xl border border-slate-800/50 flex items-center justify-between relative overflow-hidden group`}
                style={{ 
                  width: `${100 - i * 10}%`,
                  margin: '0 auto'
                }}
              >
                <div className={`absolute inset-0 opacity-5 ${step.color}`} />
                
                <div className="flex items-center gap-4 relative z-10">
                  <span className="text-3xl">{step.icon}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{step.label}</h4>
                    <p className="text-2xl font-black tracking-tighter text-white">
                      {step.value.toLocaleString()} <span className="text-xs font-normal text-slate-500">{step.unit}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right relative z-10">
                  <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {i < FUNNEL_DATA.length - 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="flex flex-col items-center gap-2 py-2"
              >
                <div className="w-px h-8 bg-gradient-to-b from-slate-700 to-transparent" />
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-500">转化率 {FUNNEL_DATA[i+1].conversionRate}%</span>
                </div>
                <ArrowDown className="w-4 h-4 text-slate-700" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        <div className="jianghu-card p-6 rounded-3xl border border-slate-800/50">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">流量效率分析</h5>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">获客成本 (CAC)</span>
              <span className="text-sm font-bold text-white">¥12.5</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[65%]" />
            </div>
          </div>
        </div>
        <div className="jianghu-card p-6 rounded-3xl border border-slate-800/50">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">咨询转化分析</h5>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">平均客单价 (AOV)</span>
              <span className="text-sm font-bold text-white">¥285.0</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[82%]" />
            </div>
          </div>
        </div>
        <div className="jianghu-card p-6 rounded-3xl border border-slate-800/50">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">售后健康度</h5>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">退款拦截率</span>
              <span className="text-sm font-bold text-white">15.2%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[45%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

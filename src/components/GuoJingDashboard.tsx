import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { 
  ShieldAlert, 
  Zap, 
  Target, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  ChevronRight,
  Flame,
  Sword,
  ShieldCheck,
  BarChart3,
  Users,
  Package,
  DollarSign
} from 'lucide-react';
import { ROLES } from '../constants';
import { Role } from '../types';

interface AgentHealthCardProps {
  role: Role;
  load: number;
}

const AgentHealthCard: React.FC<AgentHealthCardProps> = ({ role, load }) => {
  const isOverloaded = load > 80;
  const isIdle = load < 20;

  return (
    <div className="jianghu-card p-4 rounded-2xl border border-white/5 relative group overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-inner ${role.color}`}>
            {role.avatar}
          </div>
          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-widest">{role.name}</h5>
            <p className="text-[9px] text-slate-500 uppercase font-bold">{role.title}</p>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
          isOverloaded ? 'text-warning bg-warning/10 border-warning/20' : 
          isIdle ? 'text-slate-500 bg-slate-500/10 border-slate-500/20' : 
          'text-tech-green bg-tech-green/10 border-tech-green/20'
        }`}>
          {isOverloaded ? '气血不足' : isIdle ? '闭目养神' : '内息平稳'}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
          <span className="text-slate-500">任务负载 · LOAD</span>
          <span className={isOverloaded ? 'text-warning' : 'text-tech-green'}>{load}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${load}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              isOverloaded ? 'bg-gradient-to-r from-warning to-orange-500' : 
              'bg-gradient-to-r from-tech-green to-emerald-500'
            }`}
          />
        </div>
      </div>

      {isOverloaded && (
        <div className="mt-3 flex items-center gap-2 text-[9px] text-warning italic animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          <span>任务堆积，建议加急处理</span>
        </div>
      )}
    </div>
  );
};

export default function GuoJingDashboard() {
  const radarRef = useRef<SVGSVGElement>(null);
  const [isCommanding, setIsCommanding] = useState(false);

  useEffect(() => {
    if (!radarRef.current) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;
    const levels = 5;
    const data = [
      { axis: "GMV达成", value: 0.85 },
      { axis: "利润率", value: 0.72 },
      { axis: "库存周转", value: 0.9 },
      { axis: "ROI", value: 0.65 },
      { axis: "客户满意", value: 0.95 },
      { axis: "风险控制", value: 0.8 }
    ];

    const svg = d3.select(radarRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const angleSlice = (Math.PI * 2) / data.length;
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 1]);

    // Draw levels
    for (let j = 0; j < levels; j++) {
      const levelFactor = radius * ((j + 1) / levels);
      g.selectAll(".levels")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", (d, i) => levelFactor * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y1", (d, i) => levelFactor * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("x2", (d, i) => levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2))
        .attr("y2", (d, i) => levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2))
        .attr("stroke", "rgba(212,175,55,0.05)")
        .attr("stroke-width", "1px");
    }

    // Draw axes
    const axis = g.selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(1) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("stroke", "rgba(212,175,55,0.1)")
      .attr("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(1.2) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => rScale(1.2) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("font-size", "10px")
      .attr("fill", "#94a3b8")
      .attr("font-weight", "bold")
      .text(d => d.axis);

    // Draw radar area
    const radarLine = d3.lineRadial<any>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    g.append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("fill", "rgba(212, 175, 55, 0.15)")
      .attr("stroke", "#D4AF37")
      .attr("stroke-width", "2px")
      .attr("filter", "drop-shadow(0 0 8px rgba(212,175,55,0.3))");

  }, []);

  const handleCommand = () => {
    setIsCommanding(true);
    setTimeout(() => setIsCommanding(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="jianghu-card p-6 rounded-3xl border border-white/5 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gold/10 rounded-xl">
              <BarChart3 className="w-5 h-5 text-gold" />
            </div>
            <span className="text-[10px] font-black text-tech-green uppercase tracking-widest">达成率 85%</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">总销售额 · TOTAL GMV</p>
          <p className="text-3xl font-serif font-black text-white tracking-tighter">¥2,040,000</p>
          <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gold w-[85%]" />
          </div>
        </div>
        <div className="jianghu-card p-6 rounded-3xl border border-white/5 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[10px] font-black text-tech-green uppercase tracking-widest">+2.4%</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">净利润率 · PROFIT MARGIN</p>
          <p className="text-3xl font-serif font-black text-white tracking-tighter">22.5%</p>
          <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[72%]" />
          </div>
        </div>
        <div className="jianghu-card p-6 rounded-3xl border border-white/5 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">健康</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">库存周转 · TURNOVER</p>
          <p className="text-3xl font-serif font-black text-white tracking-tighter">12.5 <span className="text-xs font-normal text-slate-500">次/年</span></p>
          <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[90%]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart Section */}
        <div className="lg:col-span-1">
          <div className="jianghu-card p-6 rounded-3xl border border-white/5 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gold/10 rounded-xl">
                <Target className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">全军态势图</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Strategic Radar</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              <svg ref={radarRef} className="w-full max-w-[280px]" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
                <div className="w-48 h-48 border border-gold rounded-full animate-ping" />
              </div>
            </div>
            <div className="mt-8 p-4 bg-gold/5 border border-gold/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-black text-gold uppercase tracking-widest">总指挥手记</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "当前 GMV 进度稳健，但 ROI 略有下滑。黄蓉需优化投放策略，洪七公注意电竞国度 9.2 寸屏补货节奏。"
              </p>
            </div>
          </div>
        </div>

        {/* Agent Health & Command Center */}
        <div className="lg:col-span-2 space-y-8">
          {/* Agent Health Grid */}
          <div className="jianghu-card p-6 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-tech-green/10 rounded-xl">
                  <Activity className="w-5 h-5 text-tech-green" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">英雄状态灯</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Agent Health</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLES.filter(r => r.id !== 'guojing').map((role, i) => (
                <AgentHealthCard 
                  key={role.id} 
                  role={role} 
                  load={i === 0 ? 85 : i === 2 ? 15 : 45 + Math.floor(Math.random() * 20)} 
                />
              ))}
            </div>
          </div>

          {/* Command Center */}
          <div className="jianghu-card p-8 rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Sword className="w-48 h-48" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-serif font-black text-gold mb-2 uppercase italic tracking-widest">指挥中心 · COMMAND</h4>
                <p className="text-xs text-slate-400 mb-6 font-serif italic">"为国为民，侠之大者；稳扎稳打，步步为营。"</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-gold/30 transition-colors group cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-xs text-slate-300">资源调配：将 30% 视频号预算转至抖音</span>
                    <ChevronRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-gold transition-colors" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-gold/30 transition-colors group cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-xs text-slate-300">风险预警：9.2 寸屏驱动兼容性紧急排查</span>
                    <ChevronRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-gold transition-colors" />
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <button 
                  onClick={handleCommand}
                  className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 transition-all duration-500 overflow-hidden group ${
                    isCommanding ? 'scale-95 shadow-[0_0_50px_rgba(212,175,55,0.4)]' : 'hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                  }`}
                >
                  <div className={`absolute inset-0 bg-[#D4AF37] transition-opacity duration-500 ${isCommanding ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}`} />
                  
                  {/* Animated Rings */}
                  <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping opacity-20" />
                  <div className="absolute inset-0 border-2 border-white/10 rounded-full animate-pulse opacity-40 scale-110" />
                  
                  <Flame className={`w-10 h-10 text-[#0F0F12] relative z-10 transition-transform duration-500 ${isCommanding ? 'scale-125 rotate-12' : 'group-hover:rotate-12'}`} />
                  <span className="text-[11px] font-black text-[#0F0F12] relative z-10 uppercase tracking-[0.2em]">降龙十八掌</span>
                  <span className="text-[8px] font-bold text-[#0F0F12]/60 relative z-10 uppercase tracking-widest">{isCommanding ? '正在加急...' : '一键催办'}</span>

                  {isCommanding && (
                    <motion.div 
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: -40, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <Zap className="w-20 h-20 text-white opacity-20" />
                    </motion.div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Instagram, 
  Sparkles, 
  Check, 
  ChevronRight,
  TrendingUp,
  Search,
  Users,
  MessageSquareText,
  Share2,
  Smartphone,
  Play,
  FileText,
  Music,
  Hash,
  Layers,
  Activity,
  Zap,
  MousePointer2,
  Eye,
  Heart,
  Bookmark,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Trophy,
  PenTool,
  AlertTriangle,
  Megaphone,
  Cpu,
  ArrowRight,
  Monitor,
  Download
} from 'lucide-react';

interface TaskCardProps {
  platform: 'RED' | 'WEB' | 'TIKTOK';
  stage: '生成中' | '待发布' | '数据抓取' | '维护中' | '已发布';
  title: string;
  details?: {
    storyboard?: string;
    coverSuggestion?: string;
    seoTags?: string[];
  };
  metrics?: { label: string; value: string }[];
  aiInsight?: string;
}

const TaskCard = ({ platform, stage, title, details, metrics, aiInsight }: TaskCardProps) => {
  const platformIcons = {
    RED: <Instagram className="w-4 h-4 text-rose-500" />,
    WEB: <Globe className="w-4 h-4 text-blue-400" />,
    TIKTOK: <Play className="w-4 h-4 text-emerald-400" />
  };

  const stageColors = {
    '生成中': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    '待发布': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    '数据抓取': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    '维护中': 'text-slate-500 bg-slate-500/10 border-slate-500/20',
    '已发布': 'text-tech-green bg-tech-green/10 border-tech-green/20'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="jianghu-card p-4 rounded-2xl border border-white/5 relative group overflow-hidden hover:border-gold/30 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {platformIcons[platform]}
          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${stageColors[stage]}`}>
            {stage}
          </span>
        </div>
        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">{platform} PIPELINE</span>
      </div>

      <h5 className="text-xs font-bold text-white mb-3 group-hover:text-gold transition-colors">{title}</h5>
      
      {details && (
        <div className="space-y-2 mb-4">
          {details.storyboard && (
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <p className="text-[8px] text-slate-500 uppercase font-black mb-1 flex items-center gap-1">
                <Layers className="w-2.5 h-2.5" /> 脚本分镜预览
              </p>
              <p className="text-[10px] text-slate-300 line-clamp-2 italic">{details.storyboard}</p>
            </div>
          )}
          {details.coverSuggestion && (
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <p className="text-[8px] text-slate-500 uppercase font-black mb-1 flex items-center gap-1">
                <PenTool className="w-2.5 h-2.5" /> 封面设计建议
              </p>
              <p className="text-[10px] text-slate-300">{details.coverSuggestion}</p>
            </div>
          )}
          {details.seoTags && (
            <div className="flex flex-wrap gap-1">
              {details.seoTags.map((tag, i) => (
                <span key={i} className="text-[8px] text-gold/60 bg-gold/5 px-1.5 py-0.5 rounded border border-gold/10">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {metrics && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {metrics.map((m, i) => (
            <div key={i} className="p-2 bg-white/5 rounded-lg border border-white/5">
              <p className="text-[8px] text-slate-500 uppercase font-black mb-0.5">{m.label}</p>
              <p className="text-xs font-mono font-bold text-slate-200">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {aiInsight && (
        <div className="p-2.5 bg-gold/5 border border-gold/10 rounded-xl flex items-start gap-2">
          <Sparkles className="w-3 h-3 text-gold shrink-0 mt-0.5" />
          <p className="text-[9px] text-slate-400 italic leading-relaxed">
            {aiInsight}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default function HuangRongDashboard() {
  const [events, setEvents] = useState([
    "OpenClaw: 每日 08:00 数据统计任务已完成，昨日新增粉丝 452 人。",
    "OpenClaw: 笔记《深夜电竞氛围感》发布成功，正在监控初始流量...",
    "OpenClaw: 心跳检查发现 3 条高意向评论，已自动标记为‘待转化’。",
    "OpenClaw: 正在为明日脚本《副屏安装教程》生成 AI 脚本初稿...",
    "OpenClaw: 检测到 1 条负面评论，已触发 2 小时冷处理预案。"
  ]);

  const scripts = [
    { theme: "赛博朋克副屏", core: "深夜电竞氛围感", gold: "让你的桌面会呼吸", priority: "high" },
    { theme: "纯白全家桶", core: "颜值即正义", gold: "白色是极客的浪漫", priority: "high" },
    { theme: "安装教程", core: "3分钟上手", gold: "小白也能变大神", priority: "medium" },
    { theme: "AIDA64 皮肤", core: "动态参数展示", gold: "数据也可以很美", priority: "medium" },
    { theme: "桌面改造", core: "极简主义", gold: "少即是多", priority: "low" },
    { theme: "开箱视频", core: "9.2寸巨幕", gold: "副屏里的天花板", priority: "high" },
    { theme: "走线艺术", core: "干净利落", gold: "强迫症的福音", priority: "medium" },
    { theme: "灯效同步", core: "神光同步", gold: "光影的魔术师", priority: "low" },
    { theme: "办公效率", core: "多屏协同", gold: "生产力翻倍", priority: "medium" },
    { theme: "品牌故事", core: "电竞国度初衷", gold: "为极致而生", priority: "low" },
  ];

  return (
    <div className="space-y-6 pb-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Section 1: 账号设置 & 自动化 (Account & Automation) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs font-black text-white uppercase tracking-widest">账号设置 · ACCOUNT</h4>
            </div>
            <ShieldCheck className="w-3 h-3 text-tech-green" />
          </div>

          <div className="jianghu-card p-5 rounded-2xl border border-white/5 bg-rose-500/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-gold/20 flex items-center justify-center text-2xl shadow-lg shadow-gold/5">
                🎋
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">电竞国度 CyberNation</h5>
                <p className="text-[10px] text-slate-500 font-mono">IP: 桌面美学专家</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic leading-relaxed border-l-2 border-gold/20 pl-3">
              "专注 2.1寸/9.2寸 AIDA64 副屏开发。让你的桌面会呼吸。"
            </p>
            <div className="flex gap-2">
              <div className="flex-1 h-6 rounded bg-[#D4AF37] flex items-center justify-center text-[8px] font-black text-black">GOLD</div>
              <div className="flex-1 h-6 rounded bg-[#00FFC3] flex items-center justify-center text-[8px] font-black text-black">CYBER</div>
              <div className="flex-1 h-6 rounded bg-[#0F0F12] border border-white/10 flex items-center justify-center text-[8px] font-black text-white">NIGHT</div>
            </div>
          </div>

          {/* Automation Monitor */}
          <div className="jianghu-card p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">自动化监控 · AUTOMATION</h5>
              <Zap className="w-3 h-3 text-gold" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] text-slate-300">Cron: 每日 08:00</span>
                </div>
                <span className="text-[8px] text-tech-green font-black">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-rose-400" />
                  <span className="text-[10px] text-slate-300">心跳: 每 2 小时</span>
                </div>
                <span className="text-[8px] text-tech-green font-black">RUNNING</span>
              </div>
            </div>
          </div>

          {/* KPI Tracker */}
          <div className="jianghu-card p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">KPI 进度 · GOALS</h5>
              <Trophy className="w-3 h-3 text-gold" />
            </div>
            <div className="space-y-4">
              {[
                { label: '1个月 (20k粉)', progress: 75 },
                { label: '3个月 (50k粉)', progress: 30 },
                { label: '6个月 (100k粉)', progress: 15 },
              ].map((goal, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase">
                    <span>{goal.label}</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: 内容规划 & 脚本 (Content & Scripts) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-gold" />
              <h4 className="text-xs font-black text-white uppercase tracking-widest">内容规划 · SCRIPTS</h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-[8px] text-slate-500 font-bold">HIGH</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[8px] text-slate-500 font-bold">MED</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {scripts.slice(0, 5).map((script, i) => (
                <div key={i} className="jianghu-card p-4 rounded-2xl border border-white/5 hover:border-gold/30 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">SCRIPT #{i+1}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                      script.priority === 'high' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 
                      script.priority === 'medium' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' : 
                      'text-slate-500 border-slate-500/20 bg-slate-500/5'
                    }`}>
                      {script.priority}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white mb-1 group-hover:text-gold transition-colors">{script.theme}</h5>
                  <p className="text-[10px] text-slate-400 mb-2">{script.core}</p>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-gold shrink-0" />
                    <p className="text-[9px] text-slate-300 italic">"{script.gold}"</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {scripts.slice(5, 10).map((script, i) => (
                <div key={i+5} className="jianghu-card p-4 rounded-2xl border border-white/5 hover:border-gold/30 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">SCRIPT #{i+6}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                      script.priority === 'high' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 
                      script.priority === 'medium' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' : 
                      'text-slate-500 border-slate-500/20 bg-slate-500/5'
                    }`}>
                      {script.priority}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white mb-1 group-hover:text-gold transition-colors">{script.theme}</h5>
                  <p className="text-[10px] text-slate-400 mb-2">{script.core}</p>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-gold shrink-0" />
                    <p className="text-[9px] text-slate-300 italic">"{script.gold}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: 特殊情况 & 意向抓取 (Incidents & Leads) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black text-white uppercase tracking-widest">应急响应 · RESPONSE</h4>
            </div>
            <Zap className="w-3 h-3 text-slate-500" />
          </div>

          <div className="jianghu-card p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">特殊情况处理预案</h5>
            </div>
            <div className="space-y-2">
              {[
                { label: '审核未通过', action: '立即检查敏感词并重发', color: 'text-amber-500' },
                { label: '负面评论', action: '2h内冷处理或专业回复', color: 'text-rose-500' },
                { label: '爆款流量', action: '增加互动频率，加强转化', color: 'text-tech-green' },
                { label: '私信咨询', action: '15min内响应，引流企微', color: 'text-blue-400' },
              ].map((item, i) => (
                <div key={i} className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <p className={`text-[9px] font-black uppercase mb-0.5 ${item.color}`}>{item.label}</p>
                  <p className="text-[10px] text-slate-400">{item.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leads Section */}
          <div className="jianghu-card p-5 rounded-2xl border border-gold/20 bg-gold/5 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-gold uppercase tracking-widest">意向线索抓取</h5>
              <span className="text-[9px] font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <div className="space-y-2">
              {[
                { user: "极客小王", text: "怎么买？求个链接", time: "2m ago" },
                { user: "桌面控", text: "9.2寸屏尺寸是多少？", time: "15m ago" },
                { user: "装机猿", text: "驱动支持 AIDA64 吗？", time: "1h ago" }
              ].map((item, i) => (
                <div key={i} className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gold font-bold">{item.user}</span>
                    <span className="text-[8px] text-slate-600 font-mono">{item.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 truncate">"{item.text}"</p>
                </div>
              ))}
            </div>
            <button className="w-full py-2 bg-gold/10 border border-gold/20 rounded-xl text-[9px] font-black text-gold uppercase tracking-widest hover:bg-gold/20 transition-all">
              查看全部线索
            </button>
          </div>
        </div>
      </div>

      {/* Wulin Express Event Stream */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-[#0F0F12] border-t border-white/5 flex items-center px-6 z-50 overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 mr-6 border-r border-white/10 pr-6">
          <Megaphone className="w-4 h-4 text-gold animate-bounce" />
          <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">武林快报 · EXPRESS</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {events.concat(events).map((event, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tech-green" />
                <span className="text-[10px] text-slate-400 font-medium">{event}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="shrink-0 ml-6 pl-6 border-l border-white/10 flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">OPENCLAW ACTIVE</span>
          <div className="w-2 h-2 rounded-full bg-tech-green animate-pulse" />
        </div>
      </div>
    </div>
  );
}

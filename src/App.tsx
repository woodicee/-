import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical, 
  Trash2, 
  ChevronRight,
  LayoutDashboard,
  Scroll,
  ShieldAlert,
  Sword,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  Network,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROLES } from './constants';
import { Task, TaskStatus, Priority } from './types';
import FunnelDashboard from './components/FunnelDashboard';
import CollaborationTopology from './components/CollaborationTopology';
import HuangRongDashboard from './components/HuangRongDashboard';
import GuoJingDashboard from './components/GuoJingDashboard';

type View = 'dashboard' | 'role' | 'funnel' | 'topology';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('jianghu_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskRoleId, setNewTaskRoleId] = useState(ROLES[0].id);

  useEffect(() => {
    localStorage.setItem('jianghu_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesRole = (view === 'role' && selectedRoleId) ? task.roleId === selectedRoleId : true;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    }).sort((a, b) => {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    });
  }, [tasks, selectedRoleId, searchQuery, view]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: '',
      roleId: newTaskRoleId,
      status: 'todo',
      priority: newTaskPriority,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus: Record<TaskStatus, TaskStatus> = {
          'todo': 'doing',
          'doing': 'done',
          'done': 'todo'
        };
        return { ...t, status: nextStatus[t.status] };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return <Circle className="w-5 h-5 text-slate-600" />;
      case 'doing': return <Clock className="w-5 h-5 text-[#D4AF37] animate-spin-slow" />;
      case 'done': return <CheckCircle2 className="w-5 h-5 text-[#00FFC3]" />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-[#FF4D4F] bg-[#FF4D4F]/10 border-[#FF4D4F]/20';
      case 'medium': return 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20';
      case 'low': return 'text-[#00FFC3] bg-[#00FFC3]/10 border-[#00FFC3]/20';
    }
  };

  const selectedRole = useMemo(() => ROLES.find(r => r.id === selectedRoleId), [selectedRoleId]);

  return (
    <div className="flex h-screen bg-[#0F0F12] text-slate-300 font-sans selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      {/* Sidebar */}
      <aside className="w-20 md:w-72 bg-[#0F0F12] border-r border-[#D4AF37]/10 flex flex-col z-30 transition-all duration-500">
        <div className="p-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#00FFC3] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <Sword className="w-6 h-6 text-[#0F0F12]" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-serif font-black tracking-tighter text-[#D4AF37] leading-none">江湖风云录</h1>
              <p className="text-[10px] font-mono text-[#00FFC3] tracking-[0.2em] uppercase mt-1">E-Commerce Ops</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="pb-2 px-3">
            <p className="hidden md:block text-[10px] font-bold text-slate-600 uppercase tracking-widest">指挥中心</p>
          </div>
          
          <div className="space-y-1">
            <button
              onClick={() => { setView('dashboard'); setSelectedRoleId(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                view === 'dashboard' ? 'bg-[#D4AF37]/10 text-[#D4AF37] shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]' : 'hover:bg-slate-800/50 text-slate-500'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 transition-transform duration-500 ${view === 'dashboard' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="hidden md:block font-bold text-sm">全员看板</span>
            </button>

            <button
              onClick={() => { setView('funnel'); setSelectedRoleId(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                view === 'funnel' ? 'bg-[#00FFC3]/10 text-[#00FFC3] shadow-[inset_0_0_20px_rgba(0,255,195,0.05)]' : 'hover:bg-slate-800/50 text-slate-500'
              }`}
            >
              <Filter className={`w-5 h-5 transition-transform duration-500 ${view === 'funnel' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="hidden md:block font-bold text-sm">转化漏斗</span>
            </button>

            <button
              onClick={() => { setView('topology'); setSelectedRoleId(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                view === 'topology' ? 'bg-[#D4AF37]/10 text-[#D4AF37] shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]' : 'hover:bg-slate-800/50 text-slate-500'
              }`}
            >
              <Network className={`w-5 h-5 transition-transform duration-500 ${view === 'topology' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="hidden md:block font-bold text-sm">Agent 拓扑</span>
            </button>
          </div>

          <div className="pt-6 pb-2 px-3">
            <p className="hidden md:block text-[10px] font-bold text-slate-600 uppercase tracking-widest">英雄榜 · 角色分工</p>
          </div>

          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => { setView('role'); setSelectedRoleId(role.id); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                view === 'role' && selectedRoleId === role.id ? 'bg-slate-800 text-white shadow-inner' : 'hover:bg-slate-800/50 text-slate-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0 transition-transform duration-500 group-hover:scale-110 ${role.color}`}>
                {role.avatar}
              </div>
              <div className="hidden md:block text-left overflow-hidden">
                <p className={`font-serif font-bold text-sm truncate ${selectedRoleId === role.id ? 'text-[#D4AF37]' : 'text-slate-300'}`}>
                  {role.name}
                </p>
                <p className="text-[10px] font-mono opacity-60 truncate uppercase tracking-tighter">{role.title}</p>
              </div>
              {selectedRoleId === role.id && (
                <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-6 bg-[#D4AF37] rounded-r-full shadow-[0_0_10px_#D4AF37]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#D4AF37]/10">
          <div className="hidden md:block jianghu-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-3 h-3 text-[#FF4D4F]" />
              <span className="text-[9px] font-black text-[#FF4D4F] uppercase tracking-tighter">风控预警</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight italic font-serif">
              "江湖险恶，电商多变。请各路英雄各司其职，共创大业。"
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0F0F12]">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#D4AF37]/5 blur-[120px] pointer-events-none rounded-full" />
        
        {/* Header */}
        <header className="h-20 border-b border-[#D4AF37]/10 flex items-center justify-between px-8 bg-[#0F0F12]/40 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-serif font-black tracking-tighter flex items-center gap-3 uppercase italic text-[#D4AF37]">
                {view === 'dashboard' ? '全员风云看板' : 
                 view === 'funnel' ? '全链路转化漏斗' :
                 view === 'topology' ? 'Agent 协作拓扑' :
                 selectedRole?.name}
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/50 rounded text-[#00FFC3] border border-[#00FFC3]/20 not-italic tracking-widest">
                  {view === 'role' && selectedRole ? selectedRole.title : 'OPS CENTER'}
                </span>
              </h2>
              {view === 'role' && selectedRole && (
                <p className="text-[11px] text-slate-500 font-serif italic mt-0.5 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-[#D4AF37]/30" />
                  {selectedRole.motto}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="搜索任务..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900/30 border border-[#D4AF37]/10 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[#D4AF37]/50 w-64 transition-all duration-300 text-slate-300 placeholder:text-slate-600"
              />
            </div>
            <button 
              onClick={() => setIsAddingTask(true)}
              className="bg-[#D4AF37] hover:bg-[#B8962F] text-[#0F0F12] px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              发布悬赏
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {/* Role Background Pattern */}
          {view === 'role' && selectedRole && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ 
                backgroundImage: selectedRole.pattern,
                backgroundSize: '60px 60px'
              }}
            />
          )}

          {/* Role Specific Stats */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={view === 'role' ? (selectedRoleId || 'global') : view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative z-10"
            >
              {view === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="jianghu-card p-5 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">总任务数 · TOTAL</span>
                      <Zap className="w-4 h-4 text-[#D4AF37] group-hover:animate-pulse" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-black tracking-tighter text-white">{tasks.length}</span>
                      <span className="text-[10px] font-mono text-slate-600 uppercase">Tasks</span>
                    </div>
                  </div>
                  <div className="jianghu-card p-5 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">已完成 · DONE</span>
                      <CheckCircle2 className="w-4 h-4 text-[#00FFC3] group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-black tracking-tighter text-white">
                        {tasks.filter(t => t.status === 'done').length}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 uppercase">Completed</span>
                    </div>
                  </div>
                  <div className="jianghu-card p-5 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">紧急任务 · CRITICAL</span>
                      <AlertTriangle className="w-4 h-4 text-[#FF4D4F] group-hover:animate-bounce" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-black tracking-tighter text-[#FF4D4F]">
                        {tasks.filter(t => t.priority === 'high' && t.status !== 'done').length}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">High Priority</span>
                    </div>
                  </div>
                  <div className="jianghu-card p-5 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">活跃英雄 · AGENTS</span>
                      <Target className="w-4 h-4 text-[#00FFC3] group-hover:rotate-45 transition-transform" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-black tracking-tighter text-white">7/7</span>
                      <span className="text-[10px] font-mono text-slate-600 uppercase">Online</span>
                    </div>
                  </div>
                </div>
              )}

              {view === 'funnel' && <FunnelDashboard />}
              {view === 'topology' && <CollaborationTopology />}

              {view === 'role' && selectedRole && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {selectedRole.stats.map((stat, i) => (
                      <div key={i} className="jianghu-card p-5 group flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                          {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-[#00FFC3]" />}
                          {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-[#FF4D4F]" />}
                          {stat.trend === 'neutral' && <Minus className="w-4 h-4 text-slate-500" />}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-serif font-black tracking-tighter text-white">{stat.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Role Responsibilities */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-10 p-8 rounded-[2rem] bg-slate-900/20 border border-[#D4AF37]/10 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                      <Scroll className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-[11px] font-mono font-black text-[#D4AF37] uppercase tracking-[0.3em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                            核心职责 · CORE DUTIES
                          </h3>
                          {selectedRole.specialSkill && (
                            <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black rounded-full border border-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                              {selectedRole.specialSkill}
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-serif font-bold text-slate-200 leading-tight max-w-3xl">
                          {selectedRole.responsibility}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2.5 lg:w-1/3">
                        {selectedRole.tasks.map((t, i) => (
                          <span key={i} className="px-4 py-2 bg-slate-800/30 border border-[#D4AF37]/5 rounded-xl text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest hover:border-[#D4AF37]/20 hover:text-slate-200 transition-all duration-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Huang Rong Specific Dashboard */}
                  {selectedRoleId === 'huangrong' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-12"
                    >
                      <HuangRongDashboard />
                    </motion.div>
                  )}

                  {/* Guo Jing Specific Dashboard */}
                  {selectedRoleId === 'guojing' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-12"
                    >
                      <GuoJingDashboard />
                    </motion.div>
                  )}
                </>
              )}

              {/* Task List (Only for Dashboard and Role views) */}
              {(view === 'dashboard' || view === 'role') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6 px-4">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-[0.2em]">
                        任务列表 · TASK LIST
                      </h3>
                      <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                        {filteredTasks.length} ITEMS
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Circle className="w-2 h-2" /> TODO</span>
                      <span className="flex items-center gap-2 text-[#D4AF37]"><Clock className="w-2 h-2" /> DOING</span>
                      <span className="flex items-center gap-2 text-[#00FFC3]"><CheckCircle2 className="w-2 h-2" /> DONE</span>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="jianghu-card p-5 flex items-center gap-6 group border-l-4 border-l-transparent hover:border-l-[#D4AF37] transition-all duration-500"
                        >
                          <button 
                            onClick={() => toggleTaskStatus(task.id)}
                            className="transition-transform active:scale-75 shrink-0"
                          >
                            {getStatusIcon(task.status)}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 mb-1.5">
                              <h4 className={`font-serif font-bold text-base truncate transition-all duration-500 ${task.status === 'done' ? 'text-slate-600 line-through' : 'text-slate-200'}`}>
                                {task.title}
                              </h4>
                              <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-md border uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              {view === 'dashboard' && (
                                <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm ${ROLES.find(r => r.id === task.roleId)?.color}`}>
                                    {ROLES.find(r => r.id === task.roleId)?.avatar}
                                  </div>
                                  <span className="text-[11px] font-serif font-bold text-slate-400">{ROLES.find(r => r.id === task.roleId)?.name}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 shrink-0">
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="p-2.5 hover:bg-[#FF4D4F]/10 text-slate-600 hover:text-[#FF4D4F] rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 hover:bg-slate-800 text-slate-600 rounded-xl transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-32 text-slate-800">
                        <Scroll className="w-20 h-20 mb-6 opacity-10" />
                        <p className="text-[10px] font-mono font-black uppercase tracking-[0.4em] opacity-30">天下太平 · 暂无悬赏</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Add Task Modal */}
        <AnimatePresence>
          {isAddingTask && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddingTask(false)}
                className="absolute inset-0 bg-[#0F0F12]/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-[#0F0F12] border border-[#D4AF37]/20 rounded-[2.5rem] p-10 shadow-2xl shadow-black overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                
                <h3 className="text-2xl font-serif font-black mb-8 text-[#D4AF37] tracking-tighter flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center border border-[#D4AF37]/20">
                    <Plus className="text-[#D4AF37] w-6 h-6" />
                  </div>
                  发布新悬赏
                </h3>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-3">任务内容 · CONTENT</label>
                    <input
                      autoFocus
                      type="text"
                      placeholder="输入任务描述..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTask()}
                      className="w-full bg-slate-900/50 border border-[#D4AF37]/10 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-slate-700 text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-3">优先级 · PRIORITY</label>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => setNewTaskPriority(p)}
                            className={`flex-1 py-2.5 rounded-xl border text-[10px] font-mono font-black uppercase transition-all duration-300 ${
                              newTaskPriority === p 
                                ? getPriorityColor(p) + ' border-current shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                                : 'bg-slate-900/50 border-slate-800 text-slate-600 hover:border-slate-700'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-3">指派英雄 · ASSIGN</label>
                      <select 
                        value={newTaskRoleId}
                        onChange={(e) => setNewTaskRoleId(e.target.value)}
                        className="w-full bg-slate-900/50 border border-[#D4AF37]/10 rounded-xl px-4 py-2.5 text-xs font-serif font-bold focus:outline-none focus:border-[#D4AF37] text-slate-300 appearance-none cursor-pointer"
                      >
                        {ROLES.map(r => (
                          <option key={r.id} value={r.id} className="bg-[#0F0F12]">{r.avatar} {r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setIsAddingTask(false)}
                      className="flex-1 py-4 rounded-2xl text-[11px] font-mono font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      onClick={addTask}
                      className="flex-[2] bg-[#D4AF37] hover:bg-[#B8962F] text-[#0F0F12] py-4 rounded-2xl text-[11px] font-mono font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#D4AF37]/10 active:scale-95"
                    >
                      确认发布
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

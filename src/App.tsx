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
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROLES } from './constants';
import { Task, TaskStatus, Priority } from './types';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('jianghu_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
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
      const matchesRole = selectedRoleId ? task.roleId === selectedRoleId : true;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    }).sort((a, b) => {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    });
  }, [tasks, selectedRoleId, searchQuery]);

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
      case 'todo': return <Circle className="w-5 h-5 text-slate-500" />;
      case 'doing': return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'done': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const selectedRole = useMemo(() => ROLES.find(r => r.id === selectedRoleId), [selectedRoleId]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-xl shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-rose-900/20">
            <Sword className="text-white w-6 h-6" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-lg tracking-tight text-rose-500 leading-none">江湖风云录</h1>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">E-COMMERCE OPS v1.0</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <button
            onClick={() => setSelectedRoleId(null)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              selectedRoleId === null ? 'bg-rose-600/10 text-rose-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden md:block font-bold text-sm">全员看板</span>
          </button>

          <div className="pt-6 pb-2 px-3">
            <p className="hidden md:block text-[10px] font-bold text-slate-600 uppercase tracking-widest">英雄榜 · 角色分工</p>
          </div>

          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                selectedRoleId === role.id ? 'bg-slate-800 text-white shadow-inner' : 'hover:bg-slate-800/50 text-slate-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0 ${role.color}`}>
                {role.avatar}
              </div>
              <div className="hidden md:block text-left overflow-hidden">
                <p className={`font-bold text-sm truncate ${selectedRoleId === role.id ? 'text-white' : 'text-slate-300'}`}>
                  {role.name}
                </p>
                <p className="text-[10px] opacity-60 truncate">{role.title}</p>
              </div>
              {selectedRoleId === role.id && (
                <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-6 bg-rose-500 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="hidden md:block bg-slate-800/30 rounded-xl p-3 border border-slate-800/50">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">风控预警</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight italic">
              "江湖险恶，电商多变。请各路英雄各司其职，共创大业。"
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(225,29,72,0.05),transparent_50%)]">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
                {selectedRole ? selectedRole.name : '全员看板'}
                <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 rounded text-slate-500">
                  {selectedRole ? selectedRole.title : 'OPS CENTER'}
                </span>
              </h2>
              {selectedRole && (
                <p className="text-[10px] text-rose-500/70 font-serif italic mt-0.5">
                  "{selectedRole.motto}"
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="搜索任务..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-rose-500/50 w-64 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsAddingTask(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-rose-900/40 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              发布悬赏
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {/* Role Background Pattern */}
          {selectedRole && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{ 
                backgroundImage: selectedRole.pattern,
                backgroundSize: '40px 40px'
              }}
            />
          )}

          {/* Role Specific Stats */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedRoleId || 'global'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10"
            >
              {selectedRole ? (
                selectedRole.stats.map((stat, i) => (
                  <div key={i} className="jianghu-card p-4 rounded-2xl border border-slate-800/50 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-2xl font-black tracking-tighter text-white">{stat.value}</span>
                      {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                      {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                      {stat.trend === 'neutral' && <Minus className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="jianghu-card p-4 rounded-2xl border border-slate-800/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">总任务数</span>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-2xl font-black tracking-tighter text-white">{tasks.length}</span>
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                  </div>
                  <div className="jianghu-card p-4 rounded-2xl border border-slate-800/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">已完成</span>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-2xl font-black tracking-tighter text-white">
                        {tasks.filter(t => t.status === 'done').length}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                  <div className="jianghu-card p-4 rounded-2xl border border-slate-800/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">紧急任务</span>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-2xl font-black tracking-tighter text-rose-500">
                        {tasks.filter(t => t.priority === 'high' && t.status !== 'done').length}
                      </span>
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </div>
                  </div>
                  <div className="jianghu-card p-4 rounded-2xl border border-slate-800/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">活跃英雄</span>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-2xl font-black tracking-tighter text-white">7/7</span>
                      <Target className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Role Responsibilities */}
          {selectedRole && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-6 rounded-3xl bg-slate-900/30 border border-slate-800/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <BarChart3 className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">核心职责 · CORE DUTIES</h3>
                    {selectedRole.specialSkill && (
                      <span className="px-2 py-0.5 bg-rose-600/20 text-rose-500 text-[9px] font-black rounded border border-rose-500/30 animate-pulse">
                        {selectedRole.specialSkill}
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-bold text-slate-200 leading-snug max-w-2xl">
                    {selectedRole.responsibility}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:w-1/3">
                  {selectedRole.tasks.map((t, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Task List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                任务列表 · {filteredTasks.length} 项
              </h3>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1"><Circle className="w-2 h-2" /> 待办</span>
                <span className="flex items-center gap-1 text-amber-500"><Clock className="w-2 h-2" /> 进行中</span>
                <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 className="w-2 h-2" /> 已完成</span>
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
                    className="jianghu-card p-4 rounded-2xl flex items-center gap-5 group border-l-4 border-l-transparent hover:border-l-rose-500"
                  >
                    <button 
                      onClick={() => toggleTaskStatus(task.id)}
                      className="transition-transform active:scale-75 shrink-0"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`font-bold text-sm truncate transition-all ${task.status === 'done' ? 'text-slate-600 line-through' : 'text-slate-200'}`}>
                          {task.title}
                        </h4>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-tighter ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {!selectedRoleId && (
                          <div className="flex items-center gap-1.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${ROLES.find(r => r.id === task.roleId)?.color}`}>
                              {ROLES.find(r => r.id === task.roleId)?.avatar}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">{ROLES.find(r => r.id === task.roleId)?.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-slate-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-2 hover:bg-rose-500/10 text-slate-600 hover:text-rose-500 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-800 text-slate-600 rounded-xl transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-slate-800">
                  <Scroll className="w-20 h-20 mb-6 opacity-10" />
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-30">天下太平 · 暂无悬赏</p>
                </div>
              )}
            </AnimatePresence>
          </div>
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
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl shadow-black overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
                
                <h3 className="text-2xl font-black mb-8 text-white tracking-tighter flex items-center gap-3">
                  <Plus className="text-rose-500" />
                  发布新悬赏
                </h3>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">任务内容 · CONTENT</label>
                    <input
                      autoFocus
                      type="text"
                      placeholder="输入任务描述..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTask()}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">优先级 · PRIORITY</label>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => setNewTaskPriority(p)}
                            className={`flex-1 py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${
                              newTaskPriority === p 
                                ? getPriorityColor(p) + ' border-current'
                                : 'bg-slate-800 border-slate-700 text-slate-500'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">指派英雄 · ASSIGN</label>
                      <select 
                        value={newTaskRoleId}
                        onChange={(e) => setNewTaskRoleId(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-rose-500"
                      >
                        {ROLES.map(r => (
                          <option key={r.id} value={r.id}>{r.avatar} {r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setIsAddingTask(false)}
                      className="flex-1 px-6 py-4 rounded-2xl border border-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all text-slate-400"
                    >
                      取消
                    </button>
                    <button 
                      onClick={addTask}
                      className="flex-1 px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-900/40 active:scale-95"
                    >
                      发布悬赏
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

'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Archive, ListTodo, Plus, Calendar } from 'lucide-react';
import useTaskStore from '../../../store/taskStore';
import useAuthStore from '../../../store/authStore';
import StatsCard from '../../../components/dashboard/StatsCard';
import { ActivityChart, PriorityChart, CategoryChart } from '../../../components/dashboard/Charts';
import TaskCard from '../../../components/tasks/TaskCard';
import TaskModal from '../../../components/tasks/TaskModal';
import { SkeletonList, SkeletonCard } from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { stats, fetchStats, fetchTasks, tasks, isLoading } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState('view');

  useEffect(() => {
    fetchStats();
    // Fetch today's tasks specifically (optional, we're using the stats endpoint for dashboard info)
    // but we can just use the `todayTasks` returned in stats.
  }, []);

  const st = stats?.stats || {};
  const todayTasks = stats?.todayTasks || [];
  const overdue = stats?.overdue || [];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-400">Here's what's happening with your tasks today.</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => { setSelectedTask(null); setTaskModalMode('edit'); setIsTaskModalOpen(true); }}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus size={16} /> New Task
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={st.total || 0}
          icon={ListTodo}
          gradient="bg-primary-500 text-primary-500"
          delay={0.1}
        />
        <StatsCard
          title="Completed"
          value={st.completed || 0}
          icon={CheckCircle}
          gradient="bg-success text-success"
          trend={st.total ? Math.round((st.completed / st.total) * 100) : 0}
          trendLabel="completion rate"
          delay={0.2}
        />
        <StatsCard
          title="In Progress"
          value={st.inProgress || 0}
          icon={Clock}
          gradient="bg-accent text-accent"
          delay={0.3}
        />
        <StatsCard
          title="Archived"
          value={st.archived || 0}
          icon={Archive}
          gradient="bg-slate-500 text-slate-500"
          delay={0.4}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-2xl p-5 border border-white/5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">Activity (Last 7 Days)</h3>
          <div className="h-[200px]">
            {stats?.last7 ? <ActivityChart data={stats.last7} /> : <div className="skeleton w-full h-full rounded-xl" />}
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass rounded-2xl p-5 border border-white/5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-4">Category Distribution</h3>
          <div className="h-[200px] flex-1 flex items-center justify-center">
            {stats?.byCategory && Object.keys(stats.byCategory).length > 0 ? (
              <CategoryChart data={stats.byCategory} />
            ) : (
              <p className="text-sm text-slate-500">No data available</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary-400" size={18} />
            <h2 className="text-lg font-bold text-white">Today's Tasks</h2>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs text-slate-300">{todayTasks.length}</span>
          </div>
          
          <div className="space-y-3">
            {!stats ? (
              <SkeletonList count={3} />
            ) : todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={(t) => { setSelectedTask(t); setTaskModalMode('view'); setIsTaskModalOpen(true); }}
                  onEdit={(t) => { setSelectedTask(t); setTaskModalMode('edit'); setIsTaskModalOpen(true); }}
                />
              ))
            ) : (
              <div className="glass rounded-2xl p-8 text-center border border-white/5 border-dashed">
                <CheckCircle size={32} className="text-success mx-auto mb-3 opacity-50" />
                <p className="text-white font-medium mb-1">You're all caught up!</p>
                <p className="text-sm text-slate-400">No tasks due today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Priority & Overdue */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="glass rounded-2xl p-5 border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-4">Tasks by Priority</h3>
            <div className="h-[180px]">
              {stats?.byPriority && Object.keys(stats.byPriority).length > 0 ? (
                <PriorityChart data={stats.byPriority} />
              ) : (
                <p className="text-sm text-slate-500 text-center mt-10">No active tasks</p>
              )}
            </div>
          </motion.div>

          {overdue.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="glass rounded-2xl p-5 border border-danger/30 bg-danger/5">
              <h3 className="text-sm font-semibold text-danger mb-3 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                </span>
                Overdue Tasks ({overdue.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {overdue.slice(0, 5).map(task => (
                  <button
                    key={task.id}
                    onClick={() => { setSelectedTask(task); setTaskModalMode('view'); setIsTaskModalOpen(true); }}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <p className="text-sm text-white font-medium truncate">{task.title}</p>
                    <p className="text-xs text-danger mt-0.5">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                  </button>
                ))}
                {overdue.length > 5 && (
                  <p className="text-xs text-slate-400 text-center pt-2">+ {overdue.length - 5} more</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          task={selectedTask || {}}
          mode={taskModalMode}
          onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
          onEdit={(t) => { setSelectedTask(t); setTaskModalMode('edit'); }}
        />
      )}
    </div>
  );
}

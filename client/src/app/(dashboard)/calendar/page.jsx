'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO
} from 'date-fns';
import useTaskStore from '../../../store/taskStore';
import TaskCard from '../../../components/tasks/TaskCard';
import TaskModal from '../../../components/tasks/TaskModal';
import { CATEGORY_COLORS, cn } from '../../../utils/helpers';
import { PageLoader } from '../../../components/common/Loader';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { tasks, fetchTasks, isLoading } = useTaskStore();
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState('view');

  // Fetch all tasks for calendar view (or we could fetch a specific date range if backend supported it)
  // For now, our local store fetches all when we do this without pagination limits
  useEffect(() => {
    fetchTasks({ limit: 1000, sort: 'dueDate', order: 'asc' });
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd   = endOfMonth(currentDate);
  // Get days to pad the start and end to form complete weeks (Sunday-Saturday)
  const startDate  = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate    = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays     = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Tasks for the selected date
  const tasksForSelectedDate = tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), selectedDate) && t.status !== 'archived');

  if (isLoading && tasks.length === 0) return <PageLoader />;

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full pb-10">
      {/* Calendar View (Left/Main) */}
      <div className="flex-1 glass rounded-2xl border border-white/5 p-4 md:p-6 flex flex-col h-full min-h-[600px]">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
              <CalendarIcon size={20} className="text-accent-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 rounded-lg hover:bg-white/10 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {calendarDays.map((day, i) => {
            const isCurrMonth = isSameMonth(day, currentDate);
            const isSelected  = isSameDay(day, selectedDate);
            const isTod       = isToday(day);
            const dayTasks    = tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day) && t.status !== 'archived');
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'relative min-h-[80px] p-2 flex flex-col rounded-xl border transition-all text-left group',
                  isSelected ? 'bg-primary-500/20 border-primary-500/50' : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10',
                  !isCurrMonth && 'opacity-40'
                )}
              >
                <span className={cn(
                  'text-sm font-medium mb-1 self-end w-7 h-7 flex items-center justify-center rounded-full',
                  isTod ? 'bg-primary-500 text-white' : isSelected ? 'text-primary-300' : 'text-slate-300'
                )}>
                  {format(day, 'd')}
                </span>
                
                {/* Task Indicators */}
                <div className="flex flex-wrap gap-1 mt-auto">
                  {dayTasks.slice(0, 3).map(t => (
                    <div key={t.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#6366F1' }} title={t.title} />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[10px] text-slate-400 leading-none">+{dayTasks.length - 3}</span>
                  )}
                </div>
                
                {/* Desktop detailed task preview (hidden on small screens) */}
                <div className="hidden md:flex flex-col gap-1 mt-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map(t => (
                    <div key={t.id} className="text-[10px] truncate px-1 py-0.5 rounded bg-dark-900/50 text-slate-300" style={{ borderLeft: `2px solid ${CATEGORY_COLORS[t.category] || '#6366F1'}` }}>
                      {t.title}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List (Right/Sidebar) */}
      <div className="w-full xl:w-96 shrink-0 flex flex-col gap-4 h-full">
        <div className="glass rounded-2xl border border-white/5 p-5 flex flex-col h-full max-h-[800px]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-white">
                {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
              </h3>
              <p className="text-sm text-slate-400">{tasksForSelectedDate.length} tasks scheduled</p>
            </div>
            <button
              onClick={() => { setSelectedTask(null); setTaskModalMode('edit'); setIsTaskModalOpen(true); }}
              className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center hover:bg-primary-500/30 transition-colors"
              title="Add task for this date"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 pb-4">
            {tasksForSelectedDate.length > 0 ? (
              tasksForSelectedDate.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={(t) => { setSelectedTask(t); setTaskModalMode('view'); setIsTaskModalOpen(true); }}
                  onEdit={(t) => { setSelectedTask(t); setTaskModalMode('edit'); setIsTaskModalOpen(true); }}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <CalendarIcon size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No tasks scheduled for this date.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          task={selectedTask || { dueDate: format(selectedDate, 'yyyy-MM-dd') }} // Pre-fill date if new
          mode={taskModalMode}
          onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
          onEdit={(t) => { setSelectedTask(t); setTaskModalMode('edit'); }}
        />
      )}
    </div>
  );
}

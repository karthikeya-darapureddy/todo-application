'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListTodo, Grip, List, ChevronLeft, ChevronRight } from 'lucide-react';
import useTaskStore from '../../../store/taskStore';
import TaskCard from '../../../components/tasks/TaskCard';
import TaskModal from '../../../components/tasks/TaskModal';
import SearchFilters from '../../../components/tasks/SearchFilters';
import EmptyState from '../../../components/common/EmptyState';
import { SkeletonList } from '../../../components/common/Loader';
import { cn } from '../../../utils/helpers';

export default function TasksPage() {
  const { tasks, isLoading, pagination, filters, fetchTasks, setFilters } = useTaskStore();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState('view');

  useEffect(() => {
    fetchTasks();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters({ page: newPage });
      fetchTasks({ page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasActiveFilters = filters.status || filters.priority || filters.category || filters.search;

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <ListTodo className="text-primary-400" />
            My Tasks
          </h1>
          <p className="text-sm text-slate-400">Manage, filter, and organize all your tasks.</p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          {/* View Toggle */}
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-1.5 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white')}
              title="Grid View"
            >
              <Grip size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-1.5 rounded-lg transition-colors', viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
          
          <button
            onClick={() => { setSelectedTask(null); setTaskModalMode('edit'); setIsTaskModalOpen(true); }}
            className="btn-primary flex items-center gap-2 flex-1 md:flex-none justify-center"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilters />

      {/* Content */}
      <div className="min-h-[400px]">
        {isLoading && tasks.length === 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'}>
            <SkeletonList count={viewMode === 'grid' ? 6 : 4} />
          </div>
        ) : tasks.length > 0 ? (
          <motion.div
            layout
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5'
                : 'flex flex-col gap-4'
            )}
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={(t) => { setSelectedTask(t); setTaskModalMode('view'); setIsTaskModalOpen(true); }}
                  onEdit={(t) => { setSelectedTask(t); setTaskModalMode('edit'); setIsTaskModalOpen(true); }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            title={hasActiveFilters ? 'No tasks found' : 'No tasks yet'}
            description={hasActiveFilters ? 'Try adjusting your filters or search query to find what you are looking for.' : 'Get started by creating your first task.'}
            action={hasActiveFilters ? undefined : () => { setSelectedTask(null); setTaskModalMode('edit'); setIsTaskModalOpen(true); }}
            actionLabel="Create Task"
            type={hasActiveFilters ? 'search' : 'tasks'}
          />
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <p className="text-sm text-slate-400 hidden sm:block">
            Showing <span className="font-medium text-white">{(pagination.page - 1) * filters.limit + 1}</span> to <span className="font-medium text-white">{Math.min(pagination.page * filters.limit, pagination.total)}</span> of <span className="font-medium text-white">{pagination.total}</span> tasks
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <div className="flex items-center gap-1 mx-2">
              <span className="text-sm font-medium text-white">{pagination.page}</span>
              <span className="text-sm text-slate-500">/ {pagination.pages}</span>
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

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

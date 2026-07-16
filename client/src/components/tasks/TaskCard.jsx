'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical, Edit2, Trash2, Archive, RotateCcw, Copy,
  Calendar, Tag, Clock, CheckCircle, Circle, AlertCircle,
} from 'lucide-react';
import useTaskStore from '../../store/taskStore';
import { PRIORITY_CONFIG, STATUS_CONFIG, CATEGORY_COLORS, fmtDate, dueDateLabel, isOverdue, cn } from '../../utils/helpers';

export default function TaskCard({ task, onEdit, onView }) {
  const [showMenu, setShowMenu] = useState(false);
  const { updateStatus, archiveTask, restoreTask, deleteTask, duplicateTask } = useTaskStore();

  const pCfg     = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const sCfg     = STATUS_CONFIG[task.status]     || STATUS_CONFIG.todo;
  const overdue  = isOverdue(task.dueDate, task.status);
  const catColor = CATEGORY_COLORS[task.category] || '#6366F1';
  const archived = task.status === 'archived';

  const handleStatus = async (status) => {
    await updateStatus(task.id, status);
    setShowMenu(false);
  };

  const STATUS_CYCLE = { todo: 'in-progress', 'in-progress': 'completed', completed: 'todo' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2 }}
      className={cn(
        'glass rounded-2xl p-5 card-hover border transition-all',
        archived ? 'border-slate-700/30 opacity-70' : 'border-white/5 hover:border-primary-500/30'
      )}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('badge', pCfg.class)}>{pCfg.label}</span>
          <span className={cn('badge', sCfg.class)}>{sCfg.label}</span>
          {overdue && <span className="badge bg-danger/15 text-danger border border-danger/30">⚠ Overdue</span>}
        </div>

        {/* Actions Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-8 z-40 w-48 glass rounded-xl border border-white/10 shadow-glass overflow-hidden"
                >
                  <div className="p-1">
                    {!archived && (
                      <>
                        <button onClick={() => { onEdit?.(task); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Edit2 size={13} /> Edit
                        </button>
                        {task.status !== 'completed' && (
                          <button onClick={() => handleStatus(STATUS_CYCLE[task.status] || 'todo')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <CheckCircle size={13} /> Mark {STATUS_CYCLE[task.status] === 'completed' ? 'Complete' : STATUS_CYCLE[task.status]}
                          </button>
                        )}
                        <button onClick={() => { duplicateTask(task.id); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Copy size={13} /> Duplicate
                        </button>
                        <button onClick={() => { archiveTask(task.id); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Archive size={13} /> Archive
                        </button>
                      </>
                    )}
                    {archived && (
                      <button onClick={() => { restoreTask(task.id); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <RotateCcw size={13} /> Restore
                      </button>
                    )}
                    <hr className="border-white/10 my-1" />
                    <button onClick={() => { deleteTask(task.id); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Category accent bar */}
      <div className="w-8 h-1 rounded-full mb-3" style={{ backgroundColor: catColor }} />

      {/* Title */}
      <button
        onClick={() => onView?.(task)}
        className={cn(
          'text-left text-base font-semibold leading-snug mb-2 hover:text-primary-300 transition-colors line-clamp-2',
          task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'
        )}
      >
        {task.title}
      </button>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-400 line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400">
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: catColor + '25', color: catColor }}
          >
            {task.category?.[0] || 'T'}
          </span>
          <span className="text-xs text-slate-400">{task.category}</span>
        </div>

        {task.dueDate && (
          <div className={cn(
            'flex items-center gap-1 text-xs',
            overdue ? 'text-danger' : 'text-slate-400'
          )}>
            <Calendar size={11} />
            {dueDateLabel(task.dueDate)}
          </div>
        )}
      </div>

      {/* Quick status toggle (click circle) */}
      {!archived && (
        <button
          onClick={() => handleStatus(task.status === 'completed' ? 'todo' : 'completed')}
          className="absolute bottom-4 right-4 hidden" // available as method
        />
      )}
    </motion.div>
  );
}

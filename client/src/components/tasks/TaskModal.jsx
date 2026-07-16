'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Calendar, Tag, Clock, CheckCircle, Archive, RotateCcw, Copy, Trash2 } from 'lucide-react';
import useTaskStore from '../../store/taskStore';
import TaskForm from './TaskForm';
import { PRIORITY_CONFIG, STATUS_CONFIG, CATEGORY_COLORS, fmtDate, timeAgo, cn } from '../../utils/helpers';

export default function TaskModal({ task, mode = 'view', onClose, onEdit }) {
  const { archiveTask, restoreTask, deleteTask, duplicateTask } = useTaskStore();
  const isEditMode = mode === 'edit';

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!task) return null;

  const pCfg    = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const sCfg    = STATUS_CONFIG[task.status]     || STATUS_CONFIG.todo;
  const catColor= CATEGORY_COLORS[task.category] || '#6366F1';

  const handleDelete = async () => {
    if (confirm('Delete this task? This cannot be undone.')) {
      await deleteTask(task.id);
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1,   opacity: 1, y: 0  }}
          exit={{ scale: 0.9,    opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg glass rounded-2xl border border-white/10 shadow-glass overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header Accent */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${catColor}, #8B5CF6)` }} />

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className={cn('badge', pCfg.class)}>{pCfg.label}</span>
              <span className={cn('badge', sCfg.class)}>{sCfg.label}</span>
            </div>
            <div className="flex items-center gap-1">
              {!isEditMode && (
                <>
                  <button onClick={() => onEdit?.(task)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Edit">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => { duplicateTask(task.id); onClose?.(); }} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Duplicate">
                    <Copy size={15} />
                  </button>
                  {task.status !== 'archived'
                    ? <button onClick={() => { archiveTask(task.id); onClose?.(); }} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Archive"><Archive size={15} /></button>
                    : <button onClick={() => { restoreTask(task.id); onClose?.(); }} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Restore"><RotateCcw size={15} /></button>
                  }
                  <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-danger/10 text-danger transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-1">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-5">
            {isEditMode ? (
              <TaskForm task={task} onSuccess={onClose} onCancel={onClose} />
            ) : (
              <div className="space-y-4">
                {/* Title */}
                <h2 className="text-xl font-bold text-white leading-tight">{task.title}</h2>

                {/* Description */}
                {task.description && (
                  <p className="text-slate-300 text-sm leading-relaxed">{task.description}</p>
                )}

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />
                      <span className="text-sm text-white">{task.category}</span>
                    </div>
                  </div>
                  {task.dueDate && (
                    <div className="glass rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1">Due Date</p>
                      <div className="flex items-center gap-1.5 text-sm text-white">
                        <Calendar size={13} /> {fmtDate(task.dueDate)}
                      </div>
                    </div>
                  )}
                  {task.reminder && (
                    <div className="glass rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1">Reminder</p>
                      <div className="flex items-center gap-1.5 text-sm text-white">
                        <Clock size={13} /> {fmtDate(task.reminder, 'MMM d, h:mm a')}
                      </div>
                    </div>
                  )}
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">Created</p>
                    <p className="text-sm text-white">{timeAgo(task.createdAt)}</p>
                  </div>
                </div>

                {/* Tags */}
                {task.tags?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {task.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {task.attachments?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Attachments</p>
                    <div className="space-y-1.5">
                      {task.attachments.map((url, i) => (
                        <a key={i} href={`http://localhost:5000${url}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-sm text-primary-400">
                          📎 {url.split('/').pop()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

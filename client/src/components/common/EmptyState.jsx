'use client';
import { motion } from 'framer-motion';
import { CheckSquare, Search, Plus, Archive } from 'lucide-react';

const ICONS = { tasks: CheckSquare, search: Search, archived: Archive };

export default function EmptyState({ type = 'tasks', title, description, action, actionLabel, icon: CustomIcon }) {
  const Icon = CustomIcon || ICONS[type] || CheckSquare;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/20 flex items-center justify-center mb-6">
        <Icon size={36} className="text-primary-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title || 'Nothing here yet'}</h3>
      <p className="text-slate-400 max-w-sm mb-6">{description || 'Get started by creating your first task.'}</p>
      {action && (
        <button onClick={action} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> {actionLabel || 'Create Task'}
        </button>
      )}
    </motion.div>
  );
}

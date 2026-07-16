'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { X, Plus, Loader2, Tag } from 'lucide-react';
import useTaskStore from '../../store/taskStore';
import { cn } from '../../utils/helpers';

const schema = z.object({
  title:       z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  status:      z.enum(['todo', 'in-progress', 'completed']).default('todo'),
  priority:    z.enum(['low', 'medium', 'high']).default('medium'),
  category:    z.string().min(1, 'Category is required'),
  tags:        z.string().optional(),
  dueDate:     z.string().optional(),
  reminder:    z.string().optional(),
});

const CATEGORIES = ['Work', 'Personal', 'Learning', 'Health', 'Finance', 'Other'];
const PRIORITIES = [
  { value: 'low',    label: 'Low',    color: 'text-success border-success/30 bg-success/10' },
  { value: 'medium', label: 'Medium', color: 'text-warning border-warning/30 bg-warning/10' },
  { value: 'high',   label: 'High',   color: 'text-danger  border-danger/30  bg-danger/10'  },
];
const STATUSES = [
  { value: 'todo',        label: 'To Do'       },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed'   },
];

export default function TaskForm({ task, onSuccess, onCancel }) {
  const { createTask, updateTask, isLoading } = useTaskStore();
  const isEdit = !!task?.id;

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title:       task?.title       || '',
      description: task?.description || '',
      status:      task?.status      || 'todo',
      priority:    task?.priority    || 'medium',
      category:    task?.category    || 'Work',
      tags:        task?.tags?.join(', ') || '',
      dueDate:     task?.dueDate     || '',
      reminder:    task?.reminder    || '',
    },
  });

  const priority = watch('priority');
  const status   = watch('status');

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    const result = isEdit ? await updateTask(task.id, payload) : await createTask(payload);
    if (result.success) {
      reset();
      onSuccess?.();
    }
  };

  const fieldCls = 'input-field';
  const labelCls = 'block text-sm font-medium text-slate-300 mb-1.5';
  const errCls   = 'text-danger text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div>
        <label className={labelCls}>Title <span className="text-danger">*</span></label>
        <input {...register('title')} className={cn(fieldCls, errors.title && 'border-danger/50')} placeholder="What needs to be done?" />
        {errors.title && <p className={errCls}>{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea {...register('description')} rows={3} className={cn(fieldCls, 'resize-none')} placeholder="Add more details…" />
      </div>

      {/* Priority */}
      <div>
        <label className={labelCls}>Priority</label>
        <div className="flex gap-2">
          {PRIORITIES.map(p => (
            <button
              key={p.value}
              type="button"
              onClick={() => setValue('priority', p.value)}
              className={cn(
                'flex-1 py-2 rounded-xl border text-sm font-medium transition-all',
                priority === p.value ? p.color : 'border-white/10 text-slate-400 bg-white/5 hover:bg-white/10'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className={labelCls}>Status</label>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => setValue('status', s.value)}
              className={cn(
                'flex-1 py-2 rounded-xl border text-sm font-medium transition-all',
                status === s.value
                  ? 'border-primary-500/50 bg-primary-500/15 text-primary-300'
                  : 'border-white/10 text-slate-400 bg-white/5 hover:bg-white/10'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category & Due Date (2-col) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category</label>
          <select {...register('category')} className={cn(fieldCls, 'cursor-pointer')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Due Date</label>
          <input type="date" {...register('dueDate')} className={fieldCls} />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className={cn(labelCls, 'flex items-center gap-1.5')}>
          <Tag size={13} /> Tags <span className="text-slate-500 font-normal">(comma separated)</span>
        </label>
        <input {...register('tags')} className={fieldCls} placeholder="design, frontend, urgent" />
      </div>

      {/* Reminder */}
      <div>
        <label className={labelCls}>Reminder</label>
        <input type="datetime-local" {...register('reminder')} className={fieldCls} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          {isEdit ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}

'use client';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, X, ChevronDown } from 'lucide-react';
import useTaskStore from '../../store/taskStore';
import { debounce, cn } from '../../utils/helpers';

const STATUSES   = ['todo', 'in-progress', 'completed', 'archived'];
const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['Work', 'Personal', 'Learning', 'Health', 'Finance', 'Other'];
const SORTS      = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate',   label: 'Due Date'     },
  { value: 'priority',  label: 'Priority'     },
  { value: 'title',     label: 'Title'        },
];

export default function SearchFilters({ onSearch }) {
  const { filters, setFilters, resetFilters, fetchTasks } = useTaskStore();
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters({ search: value });
      fetchTasks({ search: value });
    }, 400),
    []
  );

  const handleFilter = (key, value) => {
    const newVal = filters[key] === value ? '' : value;
    setFilters({ [key]: newVal });
    fetchTasks({ [key]: newVal });
  };

  const handleSort = (sort) => {
    const newOrder = filters.sort === sort && filters.order === 'desc' ? 'asc' : 'desc';
    setFilters({ sort, order: newOrder });
    fetchTasks({ sort, order: newOrder });
  };

  const handleReset = () => {
    resetFilters();
    fetchTasks({});
  };

  const hasFilters = filters.status || filters.priority || filters.category || filters.search;

  return (
    <div className="space-y-3">
      {/* Search & Filter Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title or description…"
            defaultValue={filters.search}
            onChange={e => debouncedSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
            showFilters || hasFilters
              ? 'bg-primary-500/15 border-primary-500/50 text-primary-300'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          )}
        >
          <Filter size={15} />
          <span className="hidden sm:inline">Filters</span>
          {hasFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
        </button>
        {hasFilters && (
          <button onClick={handleReset} className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Clear filters">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass rounded-xl border border-white/5 p-4 space-y-4"
        >
          {/* Status */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => handleFilter('status', s)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize',
                    filters.status === s
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  )}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Priority</p>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  onClick={() => handleFilter('priority', p)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize',
                    filters.priority === p
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => handleFilter('category', c)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    filters.category === c
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Sort By</p>
            <div className="flex flex-wrap gap-2">
              {SORTS.map(s => (
                <button
                  key={s.value}
                  onClick={() => handleSort(s.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    filters.sort === s.value
                      ? 'bg-secondary-500/20 border-secondary-500/50 text-secondary-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  )}
                >
                  <SortAsc size={11} className={filters.sort === s.value && filters.order === 'asc' ? 'rotate-180' : ''} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

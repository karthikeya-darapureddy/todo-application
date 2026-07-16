import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

/** Merge Tailwind class names safely */
export function cn(...inputs) { return twMerge(clsx(inputs)); }

/** Format a date string */
export function fmtDate(dateStr, fmt = 'MMM d, yyyy') {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), fmt); } catch { return dateStr; }
}

/** Relative time from now */
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }); } catch { return ''; }
}

/** Human-friendly due date label */
export function dueDateLabel(dateStr) {
  if (!dateStr) return null;
  try {
    const d = parseISO(dateStr);
    if (isToday(d))    return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    if (isPast(d))     return `Overdue (${format(d, 'MMM d')})`;
    return format(d, 'MMM d');
  } catch { return dateStr; }
}

/** Check if task is overdue */
export function isOverdue(dateStr, status) {
  if (!dateStr || status === 'completed' || status === 'archived') return false;
  try { return isPast(parseISO(dateStr)) && !isToday(parseISO(dateStr)); } catch { return false; }
}

/** Priority config */
export const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#EF4444', class: 'priority-high',   dot: 'bg-danger'   },
  medium: { label: 'Medium', color: '#F59E0B', class: 'priority-medium', dot: 'bg-warning'  },
  low:    { label: 'Low',    color: '#22C55E', class: 'priority-low',    dot: 'bg-success'  },
};

/** Status config */
export const STATUS_CONFIG = {
  'todo':        { label: 'To Do',       color: '#94A3B8', class: 'status-todo'        },
  'in-progress': { label: 'In Progress', color: '#06B6D4', class: 'status-in-progress' },
  'completed':   { label: 'Completed',   color: '#22C55E', class: 'status-completed'   },
  'archived':    { label: 'Archived',    color: '#64748B', class: 'status-archived'    },
};

/** Category colors */
export const CATEGORY_COLORS = {
  Work:     '#6366F1',
  Personal: '#8B5CF6',
  Learning: '#06B6D4',
  Health:   '#22C55E',
  Finance:  '#F59E0B',
};

/** Debounce function */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Truncate text */
export function truncate(str, maxLen = 80) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

/** Avatar placeholder URL */
export function avatarUrl(user) {
  if (user?.avatar) {
    if (user.avatar.startsWith('/uploads')) return `http://localhost:5000${user.avatar}`;
    return user.avatar;
  }
  const name = encodeURIComponent(user?.name || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=6366F1&color=fff&bold=true&size=128`;
}

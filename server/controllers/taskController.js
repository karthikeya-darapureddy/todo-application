const Store   = require('../storage/store');
const { successRes, errorRes, paginate } = require('../utils/helpers');

// ─── Get All Tasks (with search, filter, sort, pagination) ──────────
exports.getTasks = (req, res) => {
  try {
    const { search, status, priority, category, sort = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;

    let tasks = Store.getTasksByUser(req.user.id);

    // Search
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }

    // Filters
    if (status)   tasks = tasks.filter(t => t.status   === status);
    if (priority) tasks = tasks.filter(t => t.priority === priority);
    if (category) tasks = tasks.filter(t => t.category === category);

    // Sorting
    const validSorts = ['createdAt', 'updatedAt', 'dueDate', 'title', 'priority'];
    const sortBy     = validSorts.includes(sort) ? sort : 'createdAt';
    const dir        = order === 'asc' ? 1 : -1;

    const priorityOrder = { high: 3, medium: 2, low: 1 };
    tasks.sort((a, b) => {
      if (sortBy === 'priority') return dir * ((priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0));
      const va = a[sortBy] || '';
      const vb = b[sortBy] || '';
      return dir * (va < vb ? -1 : va > vb ? 1 : 0);
    });

    const result = paginate(tasks, page, limit);
    return successRes(res, result);
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Get Task By ID ──────────────────────────────────────────────────
exports.getTaskById = (req, res) => {
  try {
    const task = Store.getTaskById(req.params.id);
    if (!task)                   return errorRes(res, 'Task not found.', 404);
    if (task.userId !== req.user.id) return errorRes(res, 'Access denied.', 403);
    return successRes(res, { task });
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Create Task ─────────────────────────────────────────────────────
exports.createTask = (req, res) => {
  try {
    const { title, description, status, priority, category, tags, dueDate, reminder } = req.body;
    if (!title || !title.trim()) return errorRes(res, 'Task title is required.', 400);

    const attachments = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const task = Store.createTask({
      userId:      req.user.id,
      title:       title.trim(),
      description: description || '',
      status:      status   || 'todo',
      priority:    priority || 'medium',
      category:    category || 'Personal',
      tags:        Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      dueDate:     dueDate  || null,
      reminder:    reminder || null,
      attachments,
    });

    Store.logActivity(req.user.id, 'CREATE_TASK', `Created task: "${task.title}"`);
    return successRes(res, { task }, 'Task created!', 201);
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Update Task ─────────────────────────────────────────────────────
exports.updateTask = (req, res) => {
  try {
    const task = Store.getTaskById(req.params.id);
    if (!task)                   return errorRes(res, 'Task not found.', 404);
    if (task.userId !== req.user.id) return errorRes(res, 'Access denied.', 403);

    const { title, description, status, priority, category, tags, dueDate, reminder } = req.body;
    const updates = {};

    if (title !== undefined)       updates.title       = title.trim();
    if (description !== undefined) updates.description = description;
    if (status !== undefined)      updates.status      = status;
    if (priority !== undefined)    updates.priority    = priority;
    if (category !== undefined)    updates.category    = category;
    if (dueDate !== undefined)     updates.dueDate     = dueDate;
    if (reminder !== undefined)    updates.reminder    = reminder;
    if (tags !== undefined)        updates.tags        = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());

    if (req.files && req.files.length > 0) {
      updates.attachments = [...(task.attachments || []), ...req.files.map(f => `/uploads/${f.filename}`)];
    }

    const updated = Store.updateTask(task.id, updates);
    Store.logActivity(req.user.id, 'UPDATE_TASK', `Updated task: "${updated.title}"`);
    return successRes(res, { task: updated }, 'Task updated!');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Delete Task ─────────────────────────────────────────────────────
exports.deleteTask = (req, res) => {
  try {
    const task = Store.getTaskById(req.params.id);
    if (!task)                   return errorRes(res, 'Task not found.', 404);
    if (task.userId !== req.user.id) return errorRes(res, 'Access denied.', 403);

    Store.deleteTask(task.id);
    Store.logActivity(req.user.id, 'DELETE_TASK', `Deleted task: "${task.title}"`);
    return successRes(res, null, 'Task deleted!');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Update Task Status ──────────────────────────────────────────────
exports.updateStatus = (req, res) => {
  try {
    const task = Store.getTaskById(req.params.id);
    if (!task)                   return errorRes(res, 'Task not found.', 404);
    if (task.userId !== req.user.id) return errorRes(res, 'Access denied.', 403);

    const { status } = req.body;
    const validStatuses = ['todo', 'in-progress', 'completed', 'archived'];
    if (!validStatuses.includes(status)) return errorRes(res, `Invalid status. Use: ${validStatuses.join(', ')}`, 400);

    const updated = Store.updateTask(task.id, { status });
    Store.logActivity(req.user.id, 'STATUS_CHANGE', `"${task.title}" → ${status}`);
    return successRes(res, { task: updated }, 'Status updated!');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Archive Task ────────────────────────────────────────────────────
exports.archiveTask = (req, res) => {
  try {
    const task = Store.getTaskById(req.params.id);
    if (!task)                   return errorRes(res, 'Task not found.', 404);
    if (task.userId !== req.user.id) return errorRes(res, 'Access denied.', 403);

    const updated = Store.updateTask(task.id, { status: 'archived' });
    Store.logActivity(req.user.id, 'ARCHIVE_TASK', `Archived: "${task.title}"`);
    return successRes(res, { task: updated }, 'Task archived!');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Restore Task ────────────────────────────────────────────────────
exports.restoreTask = (req, res) => {
  try {
    const task = Store.getTaskById(req.params.id);
    if (!task)                   return errorRes(res, 'Task not found.', 404);
    if (task.userId !== req.user.id) return errorRes(res, 'Access denied.', 403);

    const updated = Store.updateTask(task.id, { status: 'todo' });
    Store.logActivity(req.user.id, 'RESTORE_TASK', `Restored: "${task.title}"`);
    return successRes(res, { task: updated }, 'Task restored!');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Duplicate Task ──────────────────────────────────────────────────
exports.duplicateTask = (req, res) => {
  try {
    const task = Store.getTaskById(req.params.id);
    if (!task)                   return errorRes(res, 'Task not found.', 404);
    if (task.userId !== req.user.id) return errorRes(res, 'Access denied.', 403);

    const { id, createdAt, updatedAt, ...rest } = task;
    const copy = Store.createTask({ ...rest, title: `${task.title} (Copy)`, status: 'todo' });
    Store.logActivity(req.user.id, 'DUPLICATE_TASK', `Duplicated: "${task.title}"`);
    return successRes(res, { task: copy }, 'Task duplicated!', 201);
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Dashboard Stats ─────────────────────────────────────────────────
exports.getStats = (req, res) => {
  try {
    const tasks = Store.getTasksByUser(req.user.id);

    const total     = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress= tasks.filter(t => t.status === 'in-progress').length;
    const todo      = tasks.filter(t => t.status === 'todo').length;
    const archived  = tasks.filter(t => t.status === 'archived').length;

    const today     = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.dueDate === today && t.status !== 'archived');

    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed' || t.status === 'archived') return false;
      return t.dueDate < today;
    });

    // Category distribution
    const byCategory = tasks.reduce((acc, t) => {
      if (t.status !== 'archived') {
        acc[t.category] = (acc[t.category] || 0) + 1;
      }
      return acc;
    }, {});

    // Priority distribution
    const byPriority = tasks.reduce((acc, t) => {
      if (t.status !== 'archived') {
        acc[t.priority] = (acc[t.priority] || 0) + 1;
      }
      return acc;
    }, {});

    // Completion over last 7 days
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr,
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        completed: tasks.filter(t => t.status === 'completed' && t.updatedAt?.split('T')[0] === dateStr).length,
        created: tasks.filter(t => t.createdAt?.split('T')[0] === dateStr).length,
      };
    });

    return successRes(res, {
      stats: { total, completed, inProgress, todo, archived, completionRate: total ? Math.round((completed / total) * 100) : 0 },
      todayTasks,
      overdue,
      byCategory,
      byPriority,
      last7,
    });
  } catch (err) {
    return errorRes(res, err.message);
  }
};

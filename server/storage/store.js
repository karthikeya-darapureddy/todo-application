/**
 * store.js — In-memory data store with JSON file persistence.
 * Acts as the "localStorage equivalent" on the server side.
 * Data is stored in server/data/store.json and loaded on startup.
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR  = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// ── Internal State ──────────────────────────────────────────────────
let _store = {
  users:    [],
  tasks:    [],
  activity: [],
};

// ── Persist to disk ─────────────────────────────────────────────────
function persist() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(_store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Persist error:', err.message);
  }
}

// ── Load from disk ───────────────────────────────────────────────────
function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw  = fs.readFileSync(DATA_FILE, 'utf-8');
      _store = { ..._store, ...JSON.parse(raw) };
      console.log('[Store] Loaded store.json —', _store.users.length, 'users,', _store.tasks.length, 'tasks');
    } else {
      console.log('[Store] No existing store.json — starting fresh.');
      seedDemoData();
      persist();
    }
  } catch (err) {
    console.error('[Store] Load error:', err.message);
  }
}

// ── ID Generator ─────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// ── Demo Seed Data ───────────────────────────────────────────────────
function seedDemoData() {
  const bcrypt = require('bcryptjs');
  const userId = uid();
  const now    = new Date();

  const hash = bcrypt.hashSync('Demo@1234', 10);
  _store.users.push({
    id: userId,
    name: 'Alex Johnson',
    email: 'demo@taskflow.io',
    password: hash,
    avatar: null,
    bio: 'Full-stack developer | Open-source enthusiast',
    isVerified: true,
    verificationToken: null,
    resetToken: null,
    resetTokenExpiry: null,
    createdAt: new Date(now - 30 * 86400000).toISOString(),
    updatedAt: now.toISOString(),
  });

  const taskTemplates = [
    ['Design landing page mockup',        'Work',     'high',   'in-progress'],
    ['Write unit tests for auth module',  'Work',     'medium', 'todo'],
    ['Read Clean Code — chapter 4',       'Learning', 'low',    'completed'],
    ['Morning workout session',           'Health',   'medium', 'completed'],
    ['Review Q3 budget report',           'Finance',  'high',   'todo'],
    ['Fix navbar responsive bug',         'Work',     'high',   'in-progress'],
    ['Prepare project presentation',      'Work',     'high',   'completed'],
    ['Buy groceries for the week',        'Personal', 'low',    'completed'],
    ['Complete JavaScript course',        'Learning', 'medium', 'in-progress'],
    ['Schedule dentist appointment',      'Health',   'medium', 'todo'],
    ['Deploy staging environment',        'Work',     'high',   'todo'],
    ['Update portfolio website',          'Personal', 'medium', 'completed'],
    ['Set up CI/CD pipeline',             'Work',     'medium', 'todo'],
    ['Research investment options',       'Finance',  'low',    'todo'],
    ['Practice meditation daily',         'Health',   'low',    'completed'],
    ['Refactor database queries',         'Work',     'medium', 'todo'],
    ['Learn Docker basics',               'Learning', 'medium', 'completed'],
    ['Plan weekend trip itinerary',       'Personal', 'low',    'archived'],
    ['Implement dark mode toggle',        'Work',     'low',    'archived'],
    ['Track monthly expenses',            'Finance',  'medium', 'todo'],
  ];

  taskTemplates.forEach(([title, category, priority, status], i) => {
    const daysOffset = (i % 7 - 3) * 3;
    const createdDays = Math.floor(Math.random() * 20);
    _store.tasks.push({
      id: uid(),
      userId,
      title,
      description: `Detailed description for "${title}". Keep track of progress and update status accordingly.`,
      status,
      priority,
      category,
      tags: [category.toLowerCase(), priority],
      dueDate: new Date(now.getTime() + daysOffset * 86400000).toISOString().split('T')[0],
      reminder: null,
      attachments: [],
      createdAt: new Date(now.getTime() - createdDays * 86400000).toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  console.log('[Store] Demo data seeded — user: demo@taskflow.io / Demo@1234');
}

// ══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════

const Store = {
  init() { load(); },

  // ── Users ─────────────────────────────────────────────────────────
  getUsers()           { return [..._store.users]; },
  getUserById(id)      { return _store.users.find(u => u.id === id) || null; },
  getUserByEmail(email){ return _store.users.find(u => u.email === email.toLowerCase()) || null; },
  getUserByResetToken(token) { return _store.users.find(u => u.resetToken === token) || null; },
  getUserByVerifyToken(token){ return _store.users.find(u => u.verificationToken === token) || null; },

  createUser(data) {
    const user = { id: uid(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    _store.users.push(user);
    persist();
    return user;
  },
  updateUser(id, updates) {
    const idx = _store.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    _store.users[idx] = { ..._store.users[idx], ...updates, updatedAt: new Date().toISOString() };
    persist();
    return _store.users[idx];
  },
  deleteUser(id) {
    _store.users = _store.users.filter(u => u.id !== id);
    _store.tasks = _store.tasks.filter(t => t.userId !== id);
    persist();
  },

  // ── Tasks ─────────────────────────────────────────────────────────
  getAllTasks()          { return [..._store.tasks]; },
  getTasksByUser(userId){ return _store.tasks.filter(t => t.userId === userId); },
  getTaskById(id)       { return _store.tasks.find(t => t.id === id) || null; },

  createTask(data) {
    const task = { id: uid(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    _store.tasks.push(task);
    persist();
    return task;
  },
  updateTask(id, updates) {
    const idx = _store.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    _store.tasks[idx] = { ..._store.tasks[idx], ...updates, updatedAt: new Date().toISOString() };
    persist();
    return _store.tasks[idx];
  },
  deleteTask(id) {
    _store.tasks = _store.tasks.filter(t => t.id !== id);
    persist();
  },

  // ── Activity ──────────────────────────────────────────────────────
  getActivity(userId)   { return _store.activity.filter(a => a.userId === userId).slice(0, 20); },
  logActivity(userId, action, detail) {
    _store.activity.unshift({ id: uid(), userId, action, detail, timestamp: new Date().toISOString() });
    _store.activity = _store.activity.slice(0, 200);
    persist();
  },

  uid,
};

module.exports = Store;

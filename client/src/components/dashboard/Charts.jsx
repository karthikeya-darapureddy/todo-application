'use client';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-900/95 border border-primary-500/30 rounded-xl p-3 shadow-glass">
      {label && <p className="text-xs text-slate-400 mb-2">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-xs text-slate-300">{p.name}:</span>
          <span className="text-xs font-semibold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Activity Area Chart ──────────────────────────────────────────────
export function ActivityChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#06B6D4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
        <Area type="monotone" dataKey="completed" name="Completed" stroke="#6366F1" strokeWidth={2} fill="url(#colorCompleted)" dot={{ fill: '#6366F1', r: 3 }} />
        <Area type="monotone" dataKey="created"   name="Created"   stroke="#06B6D4" strokeWidth={2} fill="url(#colorCreated)"   dot={{ fill: '#06B6D4', r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Priority Bar Chart ───────────────────────────────────────────────
export function PriorityChart({ data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: name === 'high' ? '#EF4444' : name === 'medium' ? '#F59E0B' : '#22C55E',
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" name="Tasks" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Category Pie Chart ───────────────────────────────────────────────
const PIE_COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444'];

export function CategoryChart({ data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={4}
          dataKey="value"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: '#94A3B8' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

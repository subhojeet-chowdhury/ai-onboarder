import React from 'react';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export function ExecutiveTab() {
  const { state } = useAppContext();
  
  const c = state.candidates.amelie;
  
  // Computed metrics
  const completionRate = c.milestone30DayReached ? 100 : c.badgeApproved ? 89 : c.status === 'Active Employee' ? 50 : 0;
  const avgApprovalTime = c.documentVerified ? '4.2s' : '-';
  const deflectionRate = state.tickets.length > 0 && state.tickets[0].status === 'Closed' ? 64 : 50;

  const trendData = [
    { month: 'Jan', velocity: 65 },
    { month: 'Feb', velocity: 68 },
    { month: 'Mar', velocity: 74 },
    { month: 'Apr', velocity: 80 },
    { month: 'May', velocity: 85 },
    { month: 'Jun', velocity: completionRate > 0 ? completionRate : 85 },
  ];

  const docData = [
    { name: 'ID Card', time: 1.2 },
    { name: 'Medical', time: c.documentVerified ? 4.2 : 5.8 },
    { name: 'Contract', time: 0.5 },
  ];

  const deflectionData = [
    { name: 'AI Handled', value: deflectionRate },
    { name: 'Escalated', value: 100 - deflectionRate },
  ];
  const PIE_COLORS = ['#8b5cf6', '#e5e7eb'];

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6">
         <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2"><TrendingUp size={24}/> Executive Analytics Hub</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 overflow-y-auto h-full pr-2">
            <div className="grid grid-cols-3 gap-6 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completion Velocity</h3>
                <div className="text-4xl font-light text-gray-800 mt-2 mb-1">{completionRate}%</div>
                <p className="text-[10px] text-blue-600 font-medium uppercase tracking-widest">Live Aggregate</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-green-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Approval Times</h3>
                <div className="text-4xl font-light text-gray-800 mt-2 mb-1">{avgApprovalTime}</div>
                <p className="text-[10px] text-green-600 font-medium uppercase tracking-widest">Oracle OCR Avg</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="text-purple-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Case Deflection</h3>
                <div className="text-4xl font-light text-gray-800 mt-2 mb-1">{deflectionRate}%</div>
                <p className="text-[10px] text-purple-600 font-medium uppercase tracking-widest">AI Self-Service</p>
            </div>
            </div>

            <div className="grid grid-cols-3 gap-6 shrink-0 mb-6">
            <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-6">Onboarding Velocity Trend</h3>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }} />
                    <Line type="monotone" dataKey="velocity" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Case Deflection</h3>
                <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={deflectionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {deflectionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    </PieChart>
                </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs mt-2">
                {deflectionData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                    <span className="text-gray-600">{entry.name} ({entry.value}%)</span>
                    </div>
                ))}
                </div>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-6 shrink-0 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-6">Document Processing Times (s)</h3>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={docData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} dx={-10} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="time" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-6">Resolution Time Distribution</h3>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                    { bucket: '< 1h', count: 45 },
                    { bucket: '1-4h', count: 30 },
                    { bucket: '4-12h', count: 15 },
                    { bucket: '> 12h', count: 5 }
                    ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}

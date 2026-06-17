import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, TrendingUp, AlertCircle, Send } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export function AdminTab() {
  const { state, dispatch } = useAppContext();
  const [subTab, setSubTab] = useState<'helpdesk' | 'executive'>('helpdesk');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleResolve = (ticketId: string) => {
    dispatch({ type: 'RESOLVE_TICKET', payload: { ticketId } });
    setSelectedTicket(null);
  };

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
    <div className="p-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-180px)]">
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setSubTab('helpdesk')} 
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${subTab === 'helpdesk' ? 'border-[#C74634] text-[#C74634]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Specialist Workbench
        </button>
        <button 
          onClick={() => setSubTab('executive')}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${subTab === 'executive' ? 'border-[#C74634] text-[#C74634]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Executive Analytics Hub
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {subTab === 'helpdesk' && (
          <div className="h-full flex gap-6">
             {/* Ticket Queue */}
             <div className="w-1/3 border-r border-gray-200 pr-6 overflow-y-auto">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Open Cases</h3>
                {state.tickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 italic">No tickets in queue.</div>
                ) : (
                  state.tickets.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => setSelectedTicket(t.id)}
                      className={`p-4 rounded-xl border mb-3 cursor-pointer transition ${selectedTicket === t.id ? 'bg-orange-50 border-orange-200' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-mono text-xs text-[#C74634] font-medium">{t.id}</span>
                         {t.status === 'Closed' ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Resolved</span>
                         ) : (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded flex items-center gap-1"><AlertCircle size={12}/> SLA: {t.slaDeadline}</span>
                         )}
                      </div>
                      <div className="text-sm font-medium text-gray-800 truncate">{t.category}</div>
                      <div className="text-xs text-gray-500 mt-1">Candidate: {state.candidates[t.candidateId].name}</div>
                    </div>
                  ))
                )}
             </div>

             {/* Specialist View */}
             <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-y-auto relative">
                {selectedTicket ? (() => {
                   const t = state.tickets.find(tick => tick.id === selectedTicket)!;
                   const cand = state.candidates[t.candidateId];
                   return (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                        <div className="border-b border-gray-100 pb-4 mb-4">
                           <h2 className="text-xl font-semibold text-gray-800">{t.id} - {cand.name}</h2>
                           <p className="text-sm text-gray-500">{t.category}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                             <div className="text-xs text-gray-400 mb-1">Attached Context Log</div>
                             <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded border border-gray-200">
                               timecard_log.csv<br/>
                               shifts_w42: [NIGHT, NIGHT, DAY]<br/>
                               cutoff_rule_FR: 25th_OM
                             </div>
                           </div>
                           <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                             <div className="text-xs text-blue-400 mb-1">AI Assistant Summary</div>
                             <div className="text-sm text-blue-800 leading-snug">
                               Candidate asks about missing night shift premium. Logs confirm shifts occurred post-25th cutoff. Draft generated according to French payroll regulations.
                             </div>
                           </div>
                        </div>

                        <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col">
                           <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Proposed Resolution (French)</label>
                           <textarea 
                             readOnly
                             className="flex-1 bg-white border border-gray-200 rounded-md p-3 text-sm focus:outline-none resize-none"
                             value="Bonjour Amélie, les primes de nuit coupent le 25 du mois. Les heures ultérieures seront payées le mois prochain. Cordialement."
                           />
                           
                           {t.status === 'Open' ? (
                             <button 
                               onClick={() => handleResolve(t.id)}
                               className="mt-4 shrink-0 bg-[#C74634] text-white py-3 rounded-md font-medium shadow-sm hover:bg-red-800 transition flex items-center justify-center gap-2"
                             >
                               <Send size={18} />
                               Approve & Send
                             </button>
                           ) : (
                              <div className="mt-4 shrink-0 bg-green-100 text-green-800 py-3 rounded-md font-medium text-center flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} /> Resolved & Sent
                              </div>
                           )}
                        </div>
                     </motion.div>
                   )
                })() : (
                   <div className="h-full flex items-center justify-center text-gray-400">
                     Select a ticket to review.
                   </div>
                )}
             </div>
          </div>
        )}

        {subTab === 'executive' && (
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

             <div className="grid grid-cols-2 gap-6 shrink-0 mb-6">
               <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
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
             </div>
           </motion.div>
        )}
      </div>
    </div>
  );
}

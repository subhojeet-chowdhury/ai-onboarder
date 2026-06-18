import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { AlertCircle, Send, CheckCircle2, MessageSquare, Paperclip, Search, Filter, Briefcase, Eye, Clock, Inbox } from 'lucide-react';

export function SpecialistTab() {
  const { state, dispatch } = useAppContext();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open');
  const [searchQuery, setSearchQuery] = useState('');

  const handleResolve = (ticketId: string) => {
    dispatch({ type: 'RESOLVE_TICKET', payload: { ticketId } });
  };

  const filteredTickets = state.tickets.filter((t) => {
    if (filter === 'open' && t.status !== 'Open') return false;
    if (filter === 'closed' && t.status !== 'Closed') return false;
    if (searchQuery && !t.id.toLowerCase().includes(searchQuery.toLowerCase()) && !t.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6">
         <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2"><Briefcase size={24}/> Specialist Workbench</h1>
         <div className="flex items-center gap-4">
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
             <div className="bg-white border border-gray-200 rounded-lg flex items-center p-1">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-md transition ${filter === 'all' ? 'bg-gray-100 font-medium' : 'text-gray-500 hover:text-gray-800'}`}
                >All</button>
                <button 
                  onClick={() => setFilter('open')}
                  className={`px-3 py-1 text-sm rounded-md transition ${filter === 'open' ? 'bg-gray-100 font-medium' : 'text-gray-500 hover:text-gray-800'}`}
                >Open</button>
                <button 
                  onClick={() => setFilter('closed')}
                  className={`px-3 py-1 text-sm rounded-md transition ${filter === 'closed' ? 'bg-gray-100 font-medium' : 'text-gray-500 hover:text-gray-800'}`}
                >Resolved</button>
             </div>
         </div>
      </div>

      <div className="h-full flex gap-6 overflow-hidden">
         {/* Ticket Queue */}
         <div className="w-1/3 flex flex-col border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden shrink-0">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
               <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Filter size={16}/> Queue ({filteredTickets.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-3">
                    <CheckCircle2 size={32} className="text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-600">No tickets found</h4>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                filteredTickets.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedTicket(t.id)}
                    className={`p-4 rounded-xl border mb-3 cursor-pointer transition relative overflow-hidden group ${selectedTicket === t.id ? 'bg-[#C74634]/5 border-[#C74634]/30 shadow-sm' : 'bg-white hover:border-[#C74634]/30 border-gray-200 shadow-sm'}`}
                  >
                    {selectedTicket === t.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C74634]"></div>}
                    <div className="flex justify-between items-start mb-2">
                       <span className="font-mono text-xs text-[#C74634] font-medium">{t.id}</span>
                       {t.status === 'Closed' ? (
                          <span className="text-[10px] uppercase tracking-wider font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Resolved</span>
                       ) : (
                          <span className="text-[10px] uppercase tracking-wider font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={12} className="inline" /> SLA: {t.slaDeadline}</span>
                       )}
                    </div>
                    <div className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-[#C74634] transition-colors">{t.category}</div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {state.candidates[t.candidateId].name.charAt(0)}
                      </div>
                      {state.candidates[t.candidateId].name}
                    </div>
                  </div>
                ))
              )}
            </div>
         </div>

         {/* Specialist View */}
         <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative flex flex-col">
            {selectedTicket ? (() => {
               const t = state.tickets.find(tick => tick.id === selectedTicket)!;
               const cand = state.candidates[t.candidateId];
               return (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={t.id} className="h-full flex flex-col">
                    {/* Header */}
                    <div className="border-b border-gray-100 p-6 flex justify-between items-start bg-white">
                       <div>
                         <div className="flex items-center gap-3 mb-2">
                           <h2 className="text-2xl font-bold text-gray-800">{t.id}</h2>
                           {t.status === 'Closed' ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-md font-medium flex items-center gap-1"><CheckCircle2 size={14}/> Resolved</span>
                           ) : (
                              <span className="text-xs bg-red-50 border border-red-100 text-red-700 px-2.5 py-1 rounded-md font-medium flex items-center gap-1"><AlertCircle size={14}/> Action Required</span>
                           )}
                         </div>
                         <p className="text-md text-gray-600 font-medium">{t.category}</p>
                         <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                           <span className="flex items-center gap-1">Requester: <strong>{cand.name}</strong> ({cand.country})</span>
                           <span>•</span>
                           <span>Role: {cand.role}</span>
                         </div>
                       </div>
                       <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"><Eye size={16}/> View Full Profile</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                      <div className="grid grid-cols-2 gap-6 mb-8">
                         <div className="bg-[#FAFAFA] p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                           <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Paperclip size={16} className="text-blue-500"/> Attached Context Log</h3>
                           <div className="font-mono text-[11px] leading-relaxed text-gray-700 bg-white p-3 rounded-lg border border-gray-200 shadow-inner">
                             {'>'} Retrieving timecard_log.csv...<br/>
                             {'>'} Parsing shifts_w42: [NIGHT, NIGHT, DAY]<br/>
                             {'>'} Validating against cutoff_rule_FR: 25th_OM<br/>
                             {'>'} RESULT: Shifts post-cutoff. Valid deferral.
                           </div>
                         </div>
                         <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
                           <h3 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2"><MessageSquare size={16} className="text-indigo-500"/> AI Assistant Summary</h3>
                           <div className="text-sm text-indigo-800 leading-relaxed font-medium bg-white/60 p-3 rounded-lg border border-indigo-100/50">
                             Candidate asks about missing night shift premium. Logs confirm shifts occurred post-25th cutoff. Draft generated according to French payroll regulations to explain the next-cycle payout.
                           </div>
                         </div>
                      </div>

                      <div className="flex-1 border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col shadow-inner">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                           <MessageSquare size={14} className="text-gray-400"/> Proposed Resolution Draft (French)
                         </label>
                         <textarea 
                           readOnly
                           className="flex-1 bg-white border border-gray-200 rounded-lg p-4 text-sm focus:outline-none resize-none shadow-sm text-gray-700 leading-relaxed min-h-[120px]"
                           value="Bonjour Amélie, les primes de nuit coupent le 25 du mois. Les heures ultérieures seront payées le mois prochain. Cordialement."
                         />
                         
                         {t.status === 'Open' ? (
                           <button 
                             onClick={() => handleResolve(t.id)}
                             className="mt-6 shrink-0 bg-[#C74634] text-white py-3.5 px-6 rounded-lg font-medium shadow-md hover:bg-red-800 hover:shadow-lg transition flex items-center justify-center gap-2 w-full md:w-auto self-end"
                           >
                             <Send size={18} />
                             Approve & Send Resolution
                           </button>
                         ) : (
                            <div className="mt-6 shrink-0 bg-green-50 border border-green-200 text-green-800 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 self-end">
                              <CheckCircle2 size={18} /> Resolution Sent Successfully
                            </div>
                         )}
                      </div>
                    </div>
                 </motion.div>
               )
            })() : (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 space-y-4">
                 <div className="bg-gray-50 p-6 rounded-full border border-gray-100 shadow-inner">
                    <Inbox size={48} className="text-gray-300" />
                 </div>
                 <h2 className="text-xl font-medium text-gray-600">No Ticket Selected</h2>
                 <p className="text-sm text-gray-400 max-w-sm text-center">Select a ticket from the queue on the left to review details, AI summaries, and approve draft resolutions.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

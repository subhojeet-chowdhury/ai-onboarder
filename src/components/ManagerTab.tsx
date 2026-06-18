import React from 'react';
import { useAppContext } from '../AppContext';
import { BadgeCheck, Users, Activity, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ManagerTab() {
  const { state, dispatch } = useAppContext();
  const c = state.candidates.amelie;

  const handleApproveBadge = () => {
    dispatch({ type: 'APPROVE_BADGE', payload: { candidateId: 'amelie' } });
  };

  const showBadgeCard = c.status === 'Active Employee' && c.preOnboardingDocs?.['badge']?.status === 'Uploaded' && !c.badgeApproved;
  
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Oracle Connection Hub</h1>
        <p className="text-sm text-gray-500 mt-1">Dr. Dupont's Workspace</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Activity size={16}/> Team Onboarding Velocity
            </h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="font-medium text-gray-700">Amélie Laurent</span>
                   <span className="font-medium text-blue-600">{showBadgeCard ? '80%' : c.badgeApproved ? '100%' : c.status === 'Active Employee' ? '40%' : '0%'}</span>
                 </div>
                 <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-blue-600 h-full" 
                      initial={{ width: 0 }}
                      animate={{ width: showBadgeCard ? '80%' : c.badgeApproved ? '100%' : c.status === 'Active Employee' ? '40%' : '0%' }}
                      transition={{ duration: 1 }}
                    />
                 </div>
              </div>
              
              <div className="flex-1 space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="font-medium text-gray-700">Stefan Meier</span>
                   <span className="font-medium text-teal-600">{state.candidates.stefan.status === 'Cleared' ? '10%' : '0%'}</span>
                 </div>
                 <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-teal-500 h-full" 
                      initial={{ width: 0 }}
                      animate={{ width: state.candidates.stefan.status === 'Cleared' ? '10%' : '0%' }}
                      transition={{ duration: 1 }}
                    />
                 </div>
              </div>
            </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <Users size={32} className="text-gray-400 mb-2" />
            <div className="text-3xl font-light text-gray-800">2</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">Active Onboardings</div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Users size={18}/> Detailed Team Status</h3>
        <div className="grid grid-cols-2 gap-6">
          {(Object.values(state.candidates) as any[]).map(cand => {
             const velocity = cand.id === 'amelie' ? (showBadgeCard ? 80 : cand.badgeApproved ? 100 : cand.status === 'Active Employee' ? 40 : 0) : (cand.status === 'Cleared' ? 10 : 0);
             return (
               <div key={cand.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                 <div className="flex justify-between items-center bg-gray-50 p-4 border-b border-gray-200">
                   <div>
                     <div className="font-semibold text-gray-800">{cand.name}</div>
                     <div className="text-xs text-gray-500">{cand.role}</div>
                   </div>
                   <div className="text-sm font-medium text-[#C74634] bg-red-50 px-2 py-1 rounded">{velocity}% Complete</div>
                 </div>
                 <div className="p-4 bg-white">
                    <ul className="text-sm space-y-3">
                      {Object.entries(cand.postOnboardingTasks || {}).map(([taskId, task]: any) => (
                        <li key={taskId} className="flex gap-3"> 
                          {task.status === 'Completed' ? <CheckCircle size={18} className="text-green-500"/> : <Clock size={18} className="text-gray-300"/>} 
                          <span className={task.status === 'Completed' ? "text-gray-800" : "text-gray-500"}>{task.label}</span>
                        </li>
                      ))}
                      <li className="flex gap-3"> 
                        {cand.preOnboardingDocs?.['badge']?.status === 'Uploaded' ? <CheckCircle size={18} className="text-green-500"/> : <Clock size={18} className="text-gray-300"/>} 
                        <span className={cand.preOnboardingDocs?.['badge']?.status === 'Uploaded' ? "text-gray-800" : "text-gray-500"}>ID Photo Uploaded</span>
                      </li>
                      <li className="flex gap-3 flex-col sm:flex-row sm:items-center"> 
                        <div className="flex gap-3 items-center">
                          {cand.badgeApproved ? <CheckCircle size={18} className="text-green-500"/> : <Clock size={18} className="text-gray-300"/>} 
                          <span className={cand.badgeApproved ? "text-gray-800" : "text-gray-500"}>Facility Cleanroom Security Badge Issued</span>
                        </div>
                        {cand.status === 'Active Employee' && cand.preOnboardingDocs?.['badge']?.status === 'Uploaded' && !cand.badgeApproved && cand.id === 'amelie' && (
                           <button onClick={handleApproveBadge} className="mt-2 sm:mt-0 ml-7 sm:ml-auto px-3 py-1 bg-[#C74634] text-white text-xs rounded shadow-sm hover:bg-red-800 transition">
                             Approve
                           </button>
                        )}
                      </li>
                    </ul>
                 </div>
               </div>
             )
          })}
        </div>
      </div>

      <AnimatePresence>
        {showBadgeCard && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-blue-200 rounded-xl shadow-lg p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border-2 border-blue-200">
                 <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Amélie" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                 <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                   Action Required: Approve Cleanroom Badge <BadgeCheck className="text-blue-600" size={20} />
                 </h2>
                 <p className="text-gray-600">Amélie Laurent has completed all prerequisites (80% overall). Verification photo attached.</p>
              </div>
            </div>
            <button 
              onClick={handleApproveBadge}
              className="bg-[#C74634] text-white px-6 py-3 rounded-md font-medium shadow-sm hover:bg-red-800 transition"
            >
              Approve Badge
            </button>
          </motion.div>
        )}

        {c.badgeApproved && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 border border-gray-200 p-6 rounded-xl text-center text-gray-500 italic">
             No pending actions required for your team.
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

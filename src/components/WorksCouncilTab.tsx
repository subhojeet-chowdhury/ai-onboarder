import React from 'react';
import { useAppContext } from '../AppContext';
import { Check, Info, ShieldAlert } from 'lucide-react';

export function WorksCouncilTab() {
  const { state, dispatch } = useAppContext();
  
  const handleApproveCouncil = (candidateId: string) => {
    dispatch({ type: 'APPROVE_COUNCIL', payload: { candidateId: candidateId as any } });
  };

  const deQueue = state.councilQueue.de;
  const ameliaStatus = state.candidates.amelie.status;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-6 border-b border-gray-200 pb-4">
         <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Works Council Gateways</h1>
         <p className="text-sm text-gray-500 mt-1">Regional compliance interfaces dynamically driven by AI Localization.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* French CSE */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-gray-200 p-4">
             <h2 className="font-semibold text-gray-800 flex items-center gap-2">
               <Info className="text-blue-500" size={18} />
               Comité Social et Économique (FR)
             </h2>
             <p className="text-xs text-gray-500 mt-1">Notification tracking only. No approval needed.</p>
          </div>
          <div className="p-4 flex-1">
             {(ameliaStatus === 'Cleared' || ameliaStatus === 'Active Employee') ? (
               <div className="bg-green-50 border border-green-200 p-3 rounded-md text-sm text-green-800 flex gap-3">
                 <Check size={18} className="mt-0.5" />
                 <div>
                    <strong>Category Logged:</strong> Laboratory Technician (Amélie Laurent). 
                    <br/>Data successfully synced to regional CSE portal. CDI contract automatically approved for delivery.
                 </div>
               </div>
             ) : (
                <div className="text-sm text-gray-400 italic text-center py-8">
                  Waiting for accepted French offers...
                </div>
             )}
          </div>
        </div>

        {/* German Betriebsrat */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-stretch">
          <div className="bg-slate-50 border-b border-gray-200 p-4">
             <h2 className="font-semibold text-gray-800 flex items-center gap-2">
               <ShieldAlert className="text-amber-500" size={18} />
               Betriebsrat (DE)
             </h2>
             <p className="text-xs text-gray-500 mt-1">Co-determination required. Contract delivery blocked until approval.</p>
          </div>
          <div className="p-4 flex-1 space-y-4">
             {deQueue.length === 0 ? (
               <div className="text-sm text-gray-400 italic text-center py-8">
                 No pending reviews...
               </div>
             ) : (
               deQueue.map(item => {
                 const cand = state.candidates[item.candidateId];
                 return (
                   <div key={item.id} className="border border-gray-200 rounded-md p-4 shadow-sm bg-white bg-gradient-to-br from-white to-gray-50">
                     <div className="flex justify-between items-start mb-3">
                       <div>
                         <h3 className="font-semibold text-gray-800">{cand.name}</h3>
                         <p className="text-xs text-gray-500">{cand.role} - {cand.offerDetails.baseComp}</p>
                       </div>
                       {item.status === 'Pending' ? (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 flex items-center rounded-sm font-medium">Action Required</span>
                       ) : (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 flex items-center rounded-sm font-medium">Approved</span>
                       )}
                     </div>
                     
                     {item.status === 'Pending' ? (
                       <button
                         onClick={() => handleApproveCouncil(item.candidateId)}
                         className="w-full bg-[#C74634] text-white py-2 rounded text-sm font-medium hover:bg-red-800 transition shadow-sm"
                       >
                         Approve Contract Delivery
                       </button>
                     ) : (
                       <div className="w-full bg-gray-100 text-gray-500 text-center py-2 rounded text-sm font-medium">
                         Contract Dispatched
                       </div>
                     )}
                   </div>
                 );
               })
             )}
          </div>
        </div>

      </div>
    </div>
  );
}

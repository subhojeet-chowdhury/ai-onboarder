import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Users, SplitSquareHorizontal, ShieldAlert, FileCheck2, ChevronDown, ChevronRight, FileText, Loader2, CheckCircle, Eye, X } from 'lucide-react';

import { getDummyDocText } from '../utils';

export function HiringTeamTab() {
  const { state, dispatch } = useAppContext();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isLocalizing, setIsLocalizing] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<{label: string} | null>(null);

  const getPassedSteps = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending': return ['Pending'];
      case 'Offer Accepted': return ['Pending', 'Offer Accepted'];
      case 'Validating Documents': return ['Pending', 'Offer Accepted', 'Validating Documents'];
      case 'Background Check': return ['Pending', 'Offer Accepted', 'Validating Documents', 'Background Check'];
      case 'Contract Generated': return ['Pending', 'Offer Accepted', 'Validating Documents', 'Background Check', 'Contract Generated'];
      case 'Pending Council': return ['Pending', 'Offer Accepted', 'Validating Documents', 'Background Check', 'Contract Generated', 'Pending Council'];
      case 'Cleared': return ['Pending', 'Offer Accepted', 'Validating Documents', 'Background Check', 'Contract Generated', 'Pending Council', 'Cleared'];
      case 'Active Employee': return ['Pending', 'Offer Accepted', 'Validating Documents', 'Background Check', 'Contract Generated', 'Pending Council', 'Cleared', 'Active Employee'];
      default: return [];
    }
  };

  const getStepsForCandidate = (c: any) => {
    const passed = getPassedSteps(c.status);
    return c.country === 'DE' 
      ? [
          { label: 'Offer', passed: passed.includes('Offer Accepted') },
          { label: 'Docs', passed: passed.includes('Validating Documents') },
          { label: 'BGC', passed: passed.includes('Background Check') },
          { label: 'Contract', passed: passed.includes('Contract Generated') },
          { label: 'Council', passed: passed.includes('Pending Council') || passed.includes('Cleared') },
          { label: 'Cleared', passed: passed.includes('Cleared') },
          { label: 'ID Creation', passed: passed.includes('Active Employee') },
          { label: 'Asset Prov.', passed: passed.includes('Active Employee') },
          { label: 'Active', passed: passed.includes('Active Employee') }
        ]
      : [
          { label: 'Offer', passed: passed.includes('Offer Accepted') },
          { label: 'Docs', passed: passed.includes('Validating Documents') },
          { label: 'BGC', passed: passed.includes('Background Check') },
          { label: 'Contract', passed: passed.includes('Contract Generated') },
          { label: 'Cleared', passed: passed.includes('Cleared') },
          { label: 'ID Creation', passed: passed.includes('Active Employee') },
          { label: 'Asset Prov.', passed: passed.includes('Active Employee') },
          { label: 'Active', passed: passed.includes('Active Employee') }
        ];
  };

  const candidates = Object.values(state.candidates) as any[];
  const readyToRun = candidates.some((c) => {
      const docs = Object.values(c.preOnboardingDocs || {}) as any[];
      if (c.status === 'Offer Accepted' && (docs.length === 0 || docs.every(d => d.status === 'Uploaded'))) {
          return true;
      }
      if (c.status === 'Validating Documents' && docs.length > 0 && docs.every(d => d.status === 'Uploaded')) {
          return true;
      }
      return false;
  });

  const handleRunAgent = () => {
    setIsLocalizing(true);
    let agentsStarted = 0;
    
    candidates.forEach((c) => {
      const docEntries = Object.entries(c.preOnboardingDocs || {});

      if (c.status === 'Offer Accepted') {
        if (docEntries.length === 0 || docEntries.every(([_, doc]: any) => doc.status === 'Uploaded')) {
          agentsStarted++;
          dispatch({ type: 'SET_STATUS', payload: { candidateId: c.id, status: 'Validating Documents' } });
          
          setTimeout(() => {
            if (docEntries.length > 0 && !c.docsFlagged) {
               // Flag one random document for review
               const randomIndex = Math.floor(Math.random() * docEntries.length);
               const [flaggedDocId] = docEntries[randomIndex];
               
               dispatch({ type: 'SET_DOC_STATUS', payload: { candidateId: c.id, docId: flaggedDocId, status: 'Needs Review' } });
               dispatch({ type: 'SET_DOCS_FLAGGED', payload: { candidateId: c.id, flagged: true } });
               setIsLocalizing(false);
            } else {
               // Proceed normally since flag is removed or no docs
               resumeAgent(c.id);
            }
          }, 3000);
        }
      } else if (c.status === 'Validating Documents') {
        if (docEntries.length > 0 && docEntries.every(([_, doc]: any) => doc.status === 'Uploaded')) {
           agentsStarted++;
           resumeAgent(c.id);
        }
      }
    });

    if (agentsStarted === 0) {
       setIsLocalizing(false);
    }
  };

  const resumeAgent = (candidateId: string, bypassingDocId?: string) => {
    // Check if the candidate has any outstanding Needs Review documents
    const c = state.candidates[candidateId];
    if (!c) return;
    
    const docs = Object.entries(c.preOnboardingDocs || {}) as [string, any][];
    if (docs.some(([id, d]) => id !== bypassingDocId && (d.status === 'Needs Review' || d.status === 'Rejected' || d.status === 'Pending'))) {
        return; // wait for all to be uploaded
    }

    setIsLocalizing(true);
    dispatch({ type: 'SET_STATUS', payload: { candidateId, status: 'Background Check' } });
    setTimeout(() => {
      dispatch({ type: 'TRIGGER_LOCALIZATION' });
      setIsLocalizing(false);
    }, 5000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">Pending</span>;
      case 'Offer Accepted': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium border border-blue-200">Offer Accepted</span>;
      case 'Validating Documents': return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium border border-orange-200 flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Validating</span>;
      case 'Background Check': return <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium border border-indigo-200 flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> BGC</span>;
      case 'Contract Generated': return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium border border-emerald-200 flex items-center gap-1.5">Contract Ready</span>;
      case 'Pending Council': return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium border border-amber-200">Pending Council (DE)</span>;
      case 'Cleared': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium border border-green-200">Cleared / Signed</span>;
      case 'Active Employee': return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium border border-purple-200">Active Employee</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Oracle Recruiting</h1>
          <p className="text-sm text-gray-500 mt-1">Global Pipeline Overview</p>
        </div>
        {readyToRun && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleRunAgent}
            disabled={isLocalizing}
            className="flex items-center gap-2 bg-[#C74634] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-800 transition disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLocalizing ? <Loader2 size={16} className="animate-spin" /> : <SplitSquareHorizontal size={16} />}
            {isLocalizing ? 'Running Agent...' : 'Run Localization Agent'}
          </motion.button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Candidate</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">E-Signature Meta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {candidates.map((c) => (
              <React.Fragment key={c.id}>
                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}>
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    {expandedRow === c.id ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                      {c.name.charAt(0)}
                    </div>
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{c.role}</td>
                  <td className="px-6 py-4 text-gray-600">{c.country}</td>
                  <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">
                    {c.signatureMeta ? (
                      <div>
                        <div>{c.signatureMeta.timestamp}</div>
                        <div>{c.signatureMeta.geo}</div>
                        <div>IP: {c.signatureMeta.ip}</div>
                      </div>
                    ) : (
                       <span className="text-gray-400">Awaiting signature...</span>
                    )}
                  </td>
                </tr>
                {expandedRow === c.id && (
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <td colSpan={5} className="px-14 py-4">
                      <div className="grid grid-cols-2 gap-8 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                        
                        <div className="col-span-2 mb-4">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-3"><SplitSquareHorizontal size={14}/>State Transitions</h4>
                          <div className="flex items-center gap-2 overflow-x-auto pb-2">
                             {getStepsForCandidate(c).map((step, idx, arr) => (
                               <React.Fragment key={idx}>
                                  <div className={`flex flex-col items-center gap-1 ${step.passed ? 'text-[#C74634]' : 'text-gray-400'}`}>
                                     <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${step.passed ? 'border-[#C74634] bg-red-50' : 'border-gray-300'}`}>
                                        {step.passed && <CheckCircle size={12} />}
                                     </div>
                                     <span className="text-[10px] uppercase font-semibold text-center leading-tight whitespace-nowrap">{step.label}</span>
                                  </div>
                                  {idx < arr.length - 1 && (
                                     <div className={`flex-grow h-[2px] min-w-[20px] ${arr[idx+1].passed ? 'bg-[#C74634]' : 'bg-gray-200'} mb-[18px]`}></div>
                                  )}
                               </React.Fragment>
                             ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-2"><FileText size={14}/>Offer Details</h4>
                          <div className="space-y-1.5 text-sm text-gray-800">
                            <div className="flex justify-between"><span className="text-gray-500">Base Compensation:</span> <span className="font-medium">{c.offerDetails.baseComp}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Shift Premium:</span> <span className="font-medium">{c.offerDetails.shiftPremium}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Allowances:</span> <span className="font-medium">{c.offerDetails.allowances}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Target Start Date:</span> <span className="font-medium">{c.offerDetails.startDate}</span></div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-2"><FileCheck2 size={14}/>Onboarding Tracker</h4>
                          <div className="space-y-1.5 text-sm text-gray-800">
                            <div className="flex justify-between"><span className="text-gray-500">Day 1 Activated:</span> <span className="font-medium">{c.day1Activated ? 'Yes' : 'Pending'}</span></div>
                            {c.country === 'DE' && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Works Council Check:</span> 
                                <span className="font-medium">{c.status === 'Cleared' || c.status === 'Active Employee' ? 'Approved' : 'Pending Review'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2 mt-2 pt-4 border-t border-gray-100">
                           <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-2"><FileText size={14}/>Pre-Onboarding Documents</h4>
                           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {Object.entries(c.preOnboardingDocs || {}).map(([docId, doc]: any) => (
                                <div key={docId} className="flex flex-col bg-gray-50 border border-gray-200 rounded-lg p-3">
                                   <div className="flex justify-between items-start mb-2 gap-2 h-10">
                                      <span className="text-[11px] font-semibold uppercase text-gray-700 leading-tight">{doc.label}</span>
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${doc.status === 'Uploaded' ? 'bg-green-100 text-green-700' : doc.status === 'Needs Review' ? 'bg-yellow-100 text-yellow-800' : doc.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {doc.status}
                                      </span>
                                   </div>
                                   {(doc.status === 'Uploaded' || doc.status === 'Needs Review') && (
                                     <div className="flex flex-col gap-1.5 mt-auto">
                                        <button 
                                           onClick={() => setViewingDoc({ label: doc.label })}
                                           className="text-xs border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 font-medium w-full text-center py-1.5 rounded flex justify-center items-center gap-1.5"
                                        >
                                           <Eye size={12}/> View
                                        </button>
                                        {doc.status === 'Needs Review' && (
                                          <>
                                            <button 
                                               onClick={() => {
                                                  dispatch({ type: 'SET_DOC_STATUS', payload: { candidateId: c.id, docId, status: 'Uploaded' } });
                                                  resumeAgent(c.id, docId);
                                               }}
                                               className="text-xs border border-green-200 bg-white text-green-600 hover:bg-green-50 font-medium w-full text-center py-1.5 rounded"
                                            >
                                               Pass
                                            </button>
                                            <button 
                                               onClick={() => dispatch({ type: 'REJECT_PRE_DOC', payload: { candidateId: c.id, docId } })}
                                               className="text-xs border border-red-200 bg-white text-red-600 hover:bg-red-50 font-medium w-full text-center py-1.5 rounded"
                                            >
                                               Reject (Re-upload)
                                            </button>
                                          </>
                                        )}
                                     </div>
                                   )}
                                </div>
                              ))}
                              {Object.keys(c.preOnboardingDocs || {}).length === 0 && (
                                 <span className="text-sm text-gray-400">No documents required.</span>
                              )}
                           </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
         <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
               <FileCheck2 className="text-blue-600" size={20} />
               French Pipeline
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              AI automatically generates the Contrat à Durée Indéterminée (CDI) directly since no pre-clearance is required for this standard transaction.
            </p>
         </div>
         
         <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
               <ShieldAlert className="text-amber-600" size={20} />
               German Pipeline (Betriebsrat)
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              In Germany, local labor regulations require the Works Council (Betriebsrat) to pre-clear the transaction. AI pauses contract delivery and routes a request to the Council workspace.
            </p>
         </div>
      </div>

      <AnimatePresence>
         {viewingDoc && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/60 z-[100] flex flex-col items-center justify-center p-4"
               onClick={() => setViewingDoc(null)}
            >
               <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white max-w-2xl w-full max-h-[80vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
               >
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                     <h3 className="font-semibold text-gray-800">{viewingDoc.label}</h3>
                     <button onClick={() => setViewingDoc(null)} className="text-gray-500 hover:text-gray-800"><X size={20}/></button>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center min-h-[300px]">
                     {getDummyDocText(viewingDoc.label)}
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}


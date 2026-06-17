import React from 'react';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { Users, SplitSquareHorizontal, ShieldAlert, FileCheck2, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { useState } from 'react';

export function HiringTeamTab() {
  const { state, dispatch } = useAppContext();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleTriggerLocalization = () => {
    dispatch({ type: 'TRIGGER_LOCALIZATION' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">Pending</span>;
      case 'Offer Accepted': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium border border-blue-200">Offer Accepted</span>;
      case 'Pending Council': return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium border border-amber-200">Pending Council (DE)</span>;
      case 'Cleared': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium border border-green-200">Cleared / CDI Generated</span>;
      case 'Active Employee': return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium border border-purple-200">Active Employee</span>;
      default: return null;
    }
  };

  const candidates = Object.values(state.candidates);
  const anyOffersAccepted = candidates.some(c => c.status === 'Offer Accepted');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Oracle Recruiting</h1>
          <p className="text-sm text-gray-500 mt-1">Global Pipeline Overview</p>
        </div>
        
        {anyOffersAccepted && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleTriggerLocalization}
            className="flex items-center gap-2 bg-[#C74634] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-800 transition"
          >
            <SplitSquareHorizontal size={16} />
            Run Localization Agent
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
                            <div className="flex justify-between"><span className="text-gray-500">Medical Document:</span> <span className="font-medium">{c.documentVerified ? 'Validated (OCR)' : 'Missing'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Security Badge:</span> <span className="font-medium">{c.badgeApproved ? 'Approved' : 'Pending'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Works Council Check:</span> <span className="font-medium">{c.country === 'FR' ? 'N/A (Notified)' : c.status === 'Cleared' ? 'Approved' : 'Pending Review'}</span></div>
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
               French Pipeline (CSE)
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              In France, the Comité Social et Économique (CSE) requires structural category tracking, but does not block contract generation. AI automatically generates the Contrat à Durée Indéterminée (CDI).
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
    </div>
  );
}

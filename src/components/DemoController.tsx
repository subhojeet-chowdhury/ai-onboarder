import React from 'react';
import { useAppContext } from '../AppContext';
import { RotateCcw, Play, ChevronRight } from 'lucide-react';

const DEMO_STEPS = [
  "Initial State (Offers sent)",
  "Amélie (FR) Accepts Offer",
  "Stefan (DE) Accepts Offer",
  "Localization Agent Bifurcation",
  "German Works Council Approval",
  "Day 1 Activation",
  "Medical Document OCR Upload",
  "Manager Approve Badge",
  "Late-Night AI Chat Support",
  "Help Desk Escalation & Ticket Creation",
  "Specialist Ticket Resolution",
  "Month 1 Continuous Learning"
];

export function DemoController() {
  const { state, dispatch } = useAppContext();

  const handleAdvance = () => {
    // If we want to simulate auto-progressing based on the step number
    const step = state.currentStep;
    switch(step) {
      case 0:
        dispatch({ type: 'ACCEPT_OFFER', payload: { candidateId: 'amelie' } });
        break;
      case 1:
        dispatch({ type: 'ACCEPT_OFFER', payload: { candidateId: 'stefan' } });
        break;
      case 2:
        dispatch({ type: 'TRIGGER_LOCALIZATION' });
        break;
      case 3:
        dispatch({ type: 'APPROVE_COUNCIL', payload: { candidateId: 'stefan' } });
        break;
      case 4:
        dispatch({ type: 'ACTIVATE_DAY_1' });
        break;
      case 5:
        dispatch({ type: 'UPLOAD_DOCUMENT', payload: { candidateId: 'amelie' } });
        break;
      case 6:
        dispatch({ type: 'APPROVE_BADGE', payload: { candidateId: 'amelie' } });
        break;
      case 7:
        dispatch({ type: 'SUBMIT_CHAT', payload: { candidateId: 'amelie', text: "Je n'ai pas reçu ma prime de nuit pour mon service de la semaine dernière.", response: 'Les primes de nuit coupent le 25 du mois. Toute heure ultérieure passera sur le cycle suivant.' } });
        break;
      case 8:
        dispatch({ type: 'ESCALATE_TICKET', payload: { candidateId: 'amelie' } });
        break;
      case 9:
        if (state.tickets.length > 0) {
           dispatch({ type: 'RESOLVE_TICKET', payload: { ticketId: state.tickets[0].id } });
        }
        break;
      case 10:
        dispatch({ type: 'TRIGGER_30_DAY', payload: { candidateId: 'amelie' } });
        break;
    }
    dispatch({ type: 'ADVANCE_STEP' });
  };

  return (
    <div className="bg-gray-900 text-white p-3 flex justify-between items-center z-50 sticky top-0 shadow-lg">
      <div className="flex flex-col">
         <span className="text-xs text-gray-400 font-mono">Demo Control Panel</span>
         <span className="font-medium text-sm">
           Step {state.currentStep + 1} of {DEMO_STEPS.length}: <span className="text-[#C74634]">{DEMO_STEPS[state.currentStep]}</span>
         </span>
      </div>
      
      <div className="flex gap-3">
         <button 
           onClick={() => dispatch({ type: 'RESET' })}
           className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 text-sm transition"
         >
           <RotateCcw size={14} /> Reset Demo
         </button>
         
         <button 
           onClick={handleAdvance}
           disabled={state.currentStep >= DEMO_STEPS.length - 1}
           className="flex items-center gap-1.5 px-4 py-1.5 bg-[#C74634] text-white rounded font-medium hover:bg-red-700 text-sm transition disabled:opacity-50"
         >
           Advance Step <ChevronRight size={16} />
         </button>
      </div>
    </div>
  );
}

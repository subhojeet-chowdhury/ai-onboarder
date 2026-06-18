import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, CandidateId, ChatMessage, LogItem } from './types';

const INITIAL_STATE: AppState = {
  currentStep: 0,
  activeTab: 'amelie',
  candidates: {
    amelie: {
      id: 'amelie',
      name: 'Amélie Laurent',
      role: 'Laboratory Technician',
      country: 'FR',
      status: 'Pending',
      offerDetails: {
        baseComp: '€42,000 / an',
        shiftPremium: '€2.50 / hr (Night)',
        allowances: '€150 (Paris Lab Allowance)',
        startDate: 'Nov 1, 2026',
      },
      offerAcceptedAt: null,
      signatureMeta: null,
      onboardingTasks: [
        { id: 't1', label: 'Review and sign Lab Uniform & Safety Policy', status: 'Pending' },
        { id: 't2', label: 'Upload a photo for cleanroom access badge', status: 'Pending' },
        { id: 't3', label: 'Complete Biohazard Level 2 Handling video module', status: 'Pending' },
      ],
      documentVerified: false,
      badgeApproved: false,
      day1Activated: false,
      milestone30DayReached: false,
      isAuthenticated: false,
      uniformSigned: false,
      videoWatched: false,
      photoUploaded: false,
    },
    stefan: {
      id: 'stefan',
      name: 'Stefan Meier',
      role: 'Laboratory Technician',
      country: 'DE',
      status: 'Pending',
      offerDetails: {
        baseComp: '€45,000 / Jahr',
        shiftPremium: '€3.00 / Std (Nachtschicht)',
        allowances: '€100 (Frankfurt Lab Allowance)',
        startDate: 'Nov 1, 2026',
      },
      offerAcceptedAt: null,
      signatureMeta: null,
      onboardingTasks: [],
      documentVerified: false,
      badgeApproved: false,
      day1Activated: false,
      milestone30DayReached: false,
      isAuthenticated: false,
      uniformSigned: false,
      videoWatched: false,
      photoUploaded: false,
    },
  },
  councilQueue: { de: [] },
  tickets: [],
  chatLogs: {
    amelie: [],
    stefan: [],
  },
  activityLog: [],
};

type Action =
  | { type: 'SET_TAB'; payload: string }
  | { type: 'LOGIN'; payload: { candidateId: CandidateId } }
  | { type: 'ACCEPT_OFFER'; payload: { candidateId: CandidateId } }
  | { type: 'TRIGGER_LOCALIZATION' }
  | { type: 'APPROVE_COUNCIL'; payload: { candidateId: CandidateId } }
  | { type: 'REJECT_TICKET'; payload: { candidateId: CandidateId } } // optional
  | { type: 'SIGN_UNIFORM'; payload: { candidateId: CandidateId } }
  | { type: 'WATCH_VIDEO'; payload: { candidateId: CandidateId } }
  | { type: 'ACTIVATE_DAY_1' }
  | { type: 'UPLOAD_DOCUMENT'; payload: { candidateId: CandidateId } }
  | { type: 'UPLOAD_PHOTO'; payload: { candidateId: CandidateId } }
  | { type: 'APPROVE_BADGE'; payload: { candidateId: CandidateId } }
  | { type: 'SUBMIT_CHAT'; payload: { candidateId: CandidateId; text: string; response?: string } }
  | { type: 'ESCALATE_TICKET'; payload: { candidateId: CandidateId } }
  | { type: 'RESOLVE_TICKET'; payload: { ticketId: string } }
  | { type: 'TRIGGER_30_DAY'; payload: { candidateId: CandidateId } }
  | { type: 'ADVANCE_STEP' }
  | { type: 'RESET' };

const getCurrentTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

function logEvent(state: AppState, actor: string, event: string): LogItem[] {
  return [
    { id: Math.random().toString(), timestamp: getCurrentTimestamp(), actor, event },
    ...state.activityLog,
  ];
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { 
        ...state, 
        activeTab: action.payload,
        candidates: {
          ...state.candidates,
          amelie: { ...state.candidates.amelie, isAuthenticated: false },
          stefan: { ...state.candidates.stefan, isAuthenticated: false }
        }
      };

    case 'LOGIN': {
      const { candidateId } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [candidateId]: {
            ...state.candidates[candidateId],
            isAuthenticated: true,
          },
        },
      };
    }

    case 'ACCEPT_OFFER': {
      const { candidateId } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [candidateId]: {
            ...state.candidates[candidateId],
            status: 'Offer Accepted',
            isAuthenticated: true,
            offerAcceptedAt: getCurrentTimestamp(),
            signatureMeta: {
              geo: candidateId === 'amelie' ? '48.8566° N, 2.3522° E (Paris)' : '50.1109° N, 8.6821° E (Frankfurt)',
              ip: `192.168.1.${candidateId === 'amelie' ? '45' : '82'}`,
              timestamp: getCurrentTimestamp(),
            },
          },
        },
        activityLog: logEvent(state, state.candidates[candidateId].name, 'Offer Accepted & E-Signed'),
      };
    }

    case 'TRIGGER_LOCALIZATION': {
      let newState = { ...state };
      if (newState.candidates.amelie.status === 'Offer Accepted') {
        newState.candidates.amelie.status = 'Cleared';
        newState.activityLog = logEvent(newState, 'Oracle Localization AI', 'Amélie routed to FR track: CDI generated, CSE notified.');
      }
      if (newState.candidates.stefan.status === 'Offer Accepted') {
        newState.candidates.stefan.status = 'Pending Council';
        newState.councilQueue.de.push({ id: 'de-req-1', candidateId: 'stefan', status: 'Pending' });
        newState.activityLog = logEvent(newState, 'Oracle Localization AI', 'Stefan routed to DE track: Blocked for Betriebsrat clearance.');
      }
      return newState;
    }

    case 'APPROVE_COUNCIL': {
      const { candidateId } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [candidateId]: {
            ...state.candidates[candidateId],
            status: 'Cleared',
          },
        },
        councilQueue: {
          de: state.councilQueue.de.map((item) =>
            item.candidateId === candidateId ? { ...item, status: 'Approved' } : item
          ),
        },
        activityLog: logEvent(state, 'German Betriebsrat', `${state.candidates[candidateId].name} approved. Contract delivered.`),
      };
    }

    case 'ACTIVATE_DAY_1': {
      return {
        ...state,
        candidates: {
          ...state.candidates,
          amelie: {
            ...state.candidates.amelie,
            status: 'Active Employee',
            day1Activated: true,
          },
        },
        activityLog: logEvent(state, 'Core HR Module', 'Amélie status changed to Active Employee (Day 1).'),
      };
    }

    case 'UPLOAD_DOCUMENT': {
      const { candidateId } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [candidateId]: {
            ...state.candidates[candidateId],
            documentVerified: true,
          },
        },
        activityLog: logEvent(state, 'Oracle Verification AI', `OCR validated medical doc for ${state.candidates[candidateId].name}.`),
      };
    }

    case 'UPLOAD_PHOTO': {
      const { candidateId } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [candidateId]: {
            ...state.candidates[candidateId],
            photoUploaded: true,
          },
        },
        activityLog: logEvent(state, state.candidates[candidateId].name, `Uploaded photo for badge.`),
      };
    }

    case 'APPROVE_BADGE': {
      const { candidateId } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [candidateId]: {
            ...state.candidates[candidateId],
            badgeApproved: true,
          },
        },
        activityLog: logEvent(state, 'Manager (Dr. Dupont)', `Badge approved for ${state.candidates[candidateId].name}. Sec payload sent.`),
      };
    }

    case 'SUBMIT_CHAT': {
      const { candidateId, text, response } = action.payload;
      const newMessages: ChatMessage[] = [
        { id: Math.random().toString(), sender: 'user', text, timestamp: getCurrentTimestamp() },
      ];
      if (response) {
         newMessages.push({ id: Math.random().toString(), sender: 'agent', text: response, timestamp: getCurrentTimestamp() });
      }
      return {
        ...state,
        chatLogs: {
          ...state.chatLogs,
          [candidateId]: [...state.chatLogs[candidateId], ...newMessages],
        },
      };
    }

    case 'SIGN_UNIFORM': {
      const { candidateId } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [candidateId]: {
            ...state.candidates[candidateId],
            uniformSigned: true,
          },
        },
        activityLog: logEvent(state, state.candidates[candidateId].name, `Signed Uniform & Safety Policy`),
      };
    }

    case 'WATCH_VIDEO': {
      const { candidateId } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [candidateId]: {
            ...state.candidates[candidateId],
            videoWatched: true,
          },
        },
        activityLog: logEvent(state, state.candidates[candidateId].name, `Completed Biohazard L2 Video`),
      };
    }

    case 'ESCALATE_TICKET': {
      const { candidateId } = action.payload;
      const newTicketId = `#TKT-FR-80291`;
      return {
        ...state,
        tickets: [
          ...state.tickets,
          {
            id: newTicketId,
            candidateId,
            status: 'Open',
            slaDeadline: '24 Hours',
            category: 'Payroll - Allowances - France',
          },
        ],
        chatLogs: {
          ...state.chatLogs,
          [candidateId]: [
            ...state.chatLogs[candidateId],
            { id: Math.random().toString(), sender: 'system', text: `Your inquiry has been routed to our regional payroll team. Reference Ticket: ${newTicketId}. Target Resolution Window: 24 Hours.`, timestamp: getCurrentTimestamp() },
          ],
        },
        activityLog: logEvent(state, 'HR Help Desk AI', `Case file created: ${newTicketId} for ${state.candidates[candidateId].name}. Context attached.`),
      };
    }

    case 'RESOLVE_TICKET': {
      const { ticketId } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      if (!ticket) return state;

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? { ...t, status: 'Closed' } : t)),
        chatLogs: {
          ...state.chatLogs,
          [ticket.candidateId]: [
            ...state.chatLogs[ticket.candidateId],
            { id: Math.random().toString(), sender: 'specialist', text: 'Bonjour Amélie, les primes de nuit coupent le 25 du mois. Les heures ultérieures seront payées le mois prochain. Cordialement.', timestamp: getCurrentTimestamp() },
          ],
        },
        activityLog: logEvent(state, 'French Payroll Specialist', `Ticket ${ticketId} resolved. Draft approved. SLA met.`),
      };
    }

    case 'TRIGGER_30_DAY': {
      const { candidateId } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [candidateId]: {
            ...state.candidates[candidateId],
            milestone30DayReached: true,
          },
        },
        activityLog: logEvent(state, 'Oracle Learning AI', `30-day milestone generated for ${state.candidates[candidateId].name}. Adv. Chem cert recommended.`),
      };
    }
    
    case 'ADVANCE_STEP': {
      return { ...state, currentStep: Math.min(state.currentStep + 1, 11) };
    }

    case 'RESET':
      return INITIAL_STATE;

    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

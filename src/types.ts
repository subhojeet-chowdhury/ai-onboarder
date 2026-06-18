export type CandidateId = 'amelie' | 'stefan';

export type CandidateStatus =
  | 'Pending'
  | 'Offer Accepted'
  | 'Validating Documents'
  | 'Background Check'
  | 'Contract Generated'
  | 'Pending Council'
  | 'Cleared'
  | 'Active Employee';

export interface Candidate {
  id: CandidateId;
  name: string;
  role: string;
  country: 'FR' | 'DE';
  status: CandidateStatus;
  offerDetails: {
    baseComp: string;
    shiftPremium: string;
    allowances: string;
    startDate: string;
  };
  offerAcceptedAt: string | null;
  signatureMeta: { geo: string; ip: string; timestamp: string } | null;
  preOnboardingDocs: Record<string, { status: 'Pending' | 'Uploaded' | 'Rejected', label: string }>;
  postOnboardingTasks: Record<string, { status: 'Pending' | 'Completed', label: string, type: 'video' | 'document' }>;
  documentVerified: boolean;
  badgeApproved: boolean;
  day1Activated: boolean;
  milestone30DayReached: boolean;
  isAuthenticated: boolean;
  uniformSigned: boolean;
  videoWatched: boolean;
  photoUploaded: boolean;
  contractSigned: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  candidateId: CandidateId;
  status: 'Open' | 'Closed';
  slaDeadline: string;
  category: string;
  resolutionText?: string;
}

export interface LogItem {
  id: string;
  timestamp: string;
  actor: string;
  event: string;
}

export interface AppState {
  currentStep: number;
  activeTab: string;
  candidates: Record<CandidateId, Candidate>;
  councilQueue: {
    de: { id: string; candidateId: CandidateId; status: 'Pending' | 'Approved' }[];
  };
  tickets: Ticket[];
  chatLogs: Record<CandidateId, ChatMessage[]>;
  activityLog: LogItem[];
}

export enum RiskLevel {
  LOW = 'Low Risk',
  MEDIUM = 'Medium Risk',
  HIGH = 'High Risk',
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  symptoms: string[];
  duration: string;
  timestamp: number;
}

export interface DoctorRecommendation {
  specialization: string;
  reason: string;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  explanation: string;
  recommendation: DoctorRecommendation;
  disclaimer: string;
  consultationSummary: string;
}

export interface HistoryItem extends PatientData {
  result: AnalysisResult;
  chatTranscript?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 'home' | 'triage' | 'reports' | 'about' | 'pharmacy' | 'orders' | 'profile';
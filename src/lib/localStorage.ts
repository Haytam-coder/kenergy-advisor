import { UserProfile, AnalyseResult, ChatMessage } from './types';

const KEYS = {
  profile: 'kenergy_user_profile',
  analysis: 'kenergy_analysis',
  chatHistory: 'kenergy_chat_history',
  onboardingStep: 'kenergy_onboarding_step',
};

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export function loadProfile(): UserProfile | null {
  const raw = localStorage.getItem(KEYS.profile);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveAnalysis(analysis: AnalyseResult): void {
  localStorage.setItem(KEYS.analysis, JSON.stringify(analysis));
}

export function loadAnalysis(): AnalyseResult | null {
  const raw = localStorage.getItem(KEYS.analysis);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AnalyseResult;
  } catch {
    return null;
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  const limited = messages.slice(-50);
  localStorage.setItem(KEYS.chatHistory, JSON.stringify(limited));
}

export function loadChatHistory(): ChatMessage[] {
  const raw = localStorage.getItem(KEYS.chatHistory);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveOnboardingStep(step: number): void {
  localStorage.setItem(KEYS.onboardingStep, String(step));
}

export function loadOnboardingStep(): number {
  const raw = localStorage.getItem(KEYS.onboardingStep);
  return raw ? parseInt(raw, 10) : 1;
}

export function clearAll(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

import { supabase } from './supabase';
import { UserProfile, AnalyseResult, ChatMessage } from './types';

const SESSION_KEY    = 'kenergy_session_id';
const LOCAL_PROFILE  = 'kenergy_profile_cache';
const LOCAL_ANALYSIS = 'kenergy_analysis_cache';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

async function upsert(data: Record<string, unknown>) {
  const id = getSessionId();
  const { error } = await supabase
    .from('sessions')
    .upsert({ id, ...data, updated_at: new Date().toISOString() });
  return !error;
}

async function getSession() {
  const id = getSessionId();
  const { data, error } = await supabase.from('sessions').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function saveProfile(profile: UserProfile) {
  if (typeof window !== 'undefined') localStorage.setItem(LOCAL_PROFILE, JSON.stringify(profile));
  await upsert({ profile });
}

export async function loadProfile(): Promise<UserProfile | null> {
  const session = await getSession();
  if (session?.profile) return session.profile;
  // Fallback: localStorage cache (works when Supabase is unavailable)
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_PROFILE);
    if (cached) { try { return JSON.parse(cached); } catch { /* ignore */ } }
  }
  return null;
}

export async function saveAnalysis(analysis: AnalyseResult) {
  if (typeof window !== 'undefined') localStorage.setItem(LOCAL_ANALYSIS, JSON.stringify(analysis));
  await upsert({ analysis });
}

export async function loadAnalysis(): Promise<AnalyseResult | null> {
  const session = await getSession();
  if (session?.analysis) return session.analysis;
  // Fallback: localStorage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_ANALYSIS);
    if (cached) { try { return JSON.parse(cached); } catch { /* ignore */ } }
  }
  return null;
}

export async function saveChatHistory(messages: ChatMessage[]) {
  await upsert({ chat_history: messages.slice(-50) });
}

export async function loadChatHistory(): Promise<ChatMessage[]> {
  const session = await getSession();
  return session?.chat_history ?? [];
}

export async function saveOnboardingStep(step: number) {
  await upsert({ onboarding_step: step });
}

export async function loadOnboardingStep(): Promise<number> {
  const session = await getSession();
  return session?.onboarding_step ?? 1;
}

export async function clearAll() {
  const id = getSessionId();
  await supabase.from('sessions').delete().eq('id', id);
  localStorage.removeItem(SESSION_KEY);
}

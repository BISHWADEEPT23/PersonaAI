export type Role = "user" | "model";

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  summary: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface LensData {
  title: string;
  subtitle: string;
  reflection: string;
  micro_anchor: string;
}

export interface StructuredAnalysis {
  transcribed_text: string;
  dominant_mood?: string;
  lenses: {
    stoic: LensData;
    compassion: LensData;
    temporal: LensData;
    somatic_offramp: LensData;
  };
}

export interface Interaction {
  id: string;
  userId?: string;
  content: string;
  cognitiveState: string | null;
  hasMedia: boolean;
  imageUrl?: string;
  audioUrl?: string;
  analysis: StructuredAnalysis | null;
  createdAt: number;
  isOffline?: boolean;
}

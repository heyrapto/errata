import { create } from 'zustand';
import { ChatMessage } from '@/types/api';
import { Lesson, TutorMode } from '@/types/lesson';

interface SessionState {
  activeSessionId: string | null;
  topic: string;
  mode: TutorMode;
  messages: ChatMessage[];
  currentLesson: Lesson | null;
  isLoading: boolean;
  isSpeaking: boolean;
  
  // Actions
  startNewSession: (topic: string, mode: TutorMode, sessionId?: string) => void;
  setSessionId: (id: string | null) => void;
  setLesson: (lesson: Lesson) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  setLoading: (loading: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  activeSessionId: null,
  topic: '',
  mode: 'beginner',
  messages: [],
  currentLesson: null,
  isLoading: false,
  isSpeaking: false,

  startNewSession: (topic, mode, sessionId) => set({
    activeSessionId: sessionId || crypto.randomUUID(),
    topic,
    mode,
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm EduAgent, your AI tutor. Let's study "${topic}" together using ${mode} mode. I'm preparing a customized lesson plan for us now!`,
        createdAt: new Date().toISOString(),
      }
    ],
    currentLesson: null,
    isLoading: false,
    isSpeaking: false,
  }),

  setSessionId: (id) => set({ activeSessionId: id }),
  setLesson: (lesson) => set({ currentLesson: lesson, topic: lesson.topic, mode: lesson.mode }),
  setMessages: (messages) => set({ messages }),
  
  addMessage: (msg) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: crypto.randomUUID(),
        role: msg.role,
        content: msg.content,
        createdAt: new Date().toISOString(),
      }
    ]
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  
  clearSession: () => set({
    activeSessionId: null,
    topic: '',
    mode: 'beginner',
    messages: [],
    currentLesson: null,
    isLoading: false,
    isSpeaking: false,
  }),
}));

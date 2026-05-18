'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSessionStore } from '@/store/session-store';
import { useLesson } from '@/hooks/use-lesson';
import { useQuiz } from '@/hooks/use-quiz';
import { TopicInput } from '@/components/tutor/topic-input';
import { LessonView } from '@/components/tutor/lesson-view';
import { ChatWindow } from '@/components/tutor/chat-window';
import { VoicePlayer } from '@/components/tutor/voice-player';
import { QuizCard } from '@/components/quiz/quiz-card';
import { Button } from '@/components/ui/button';
import { TutorMode } from '@/types/lesson';
import { 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Award, 
  ArrowLeft,
  GraduationCap
} from 'lucide-react';

export const unstable_instant = { prefetch: 'static' };

type TutorTab = 'lesson' | 'chat' | 'quiz';

export default function TutorWorkspacePage() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get('docId') || undefined;
  const initialTopic = searchParams.get('topic') || '';

  const { activeSessionId, startNewSession, currentLesson, clearSession, isLoading } = useSessionStore();
  const { generateLesson } = useLesson();
  const { activeQuiz, startQuiz, submitAnswers, isSubmitting } = useQuiz();
  
  const [activeTab, setActiveTab] = useState<TutorTab>('lesson');
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Auto-trigger if document select or topic search parameter is present
  useEffect(() => {
    if (initialTopic) {
      handleInitializeTutor(initialTopic, 'beginner');
    }
  }, [initialTopic]);

  const handleInitializeTutor = async (topic: string, mode: TutorMode) => {
    // 1. Ingest session state
    const newSessionId = crypto.randomUUID();
    startNewSession(topic, mode, newSessionId);
    
    // 2. Fetch full structured lesson via API
    const lesson = await generateLesson(topic, mode, documentId);
    
    // 3. Clear old quiz state
    if (lesson) {
      setActiveTab('lesson');
    }
  };

  const handleLoadQuiz = async () => {
    if (!currentLesson || !activeSessionId) return;

    setLoadingQuiz(true);
    try {
      const response = await fetch('/api/tutor/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          lessonId: currentLesson.id,
          topic: currentLesson.topic,
          lessonText: currentLesson.content.sections.map((s) => `${s.title}: ${s.body}`).join('\n\n'),
        }),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load quiz');
      }

      startQuiz(result.quiz);
      setActiveTab('quiz');
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleExitSession = () => {
    clearSession();
  };

  // 1. Entry Point: Input study subject
  if (!currentLesson) {
    return (
      <div className="py-8">
        <TopicInput onSubmit={handleInitializeTutor} isLoading={isLoading} />
      </div>
    );
  }

  // 2. Unified Lesson Workspace Layout
  return (
    <div className="space-y-6">
      {/* Action Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-900 pb-4.5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExitSession}
            className="h-8.5 text-neutral-450 hover:text-white"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Exit Workspace
          </Button>
          <span className="text-neutral-700 font-bold">|</span>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <GraduationCap className="h-4.5 w-4.5 text-emerald-400" />
            <span>Active Topic: <strong>{currentLesson.topic}</strong></span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-850 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('lesson')}
            className={`flex items-center gap-1.5 rounded px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'lesson'
                ? 'bg-neutral-950 text-emerald-400 shadow-lg border border-neutral-800'
                : 'text-neutral-450 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Textbook Lesson
          </button>
          
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 rounded px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-neutral-950 text-emerald-400 shadow-lg border border-neutral-800'
                : 'text-neutral-450 hover:text-white'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Tutor Chat
          </button>

          <button
            onClick={activeQuiz ? () => setActiveTab('quiz') : handleLoadQuiz}
            disabled={loadingQuiz}
            className={`flex items-center gap-1.5 rounded px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-neutral-950 text-emerald-400 shadow-lg border border-neutral-800'
                : 'text-neutral-450 hover:text-white'
            }`}
          >
            {loadingQuiz ? (
              <span className="h-3.5 w-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Award className="h-3.5 w-3.5" />
            )}
            Interactive Quiz
          </button>
        </div>
      </div>

      {/* Render Workspace Content according to active tab */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'lesson' && <LessonView lesson={currentLesson} />}
        
        {activeTab === 'chat' && (
          <div className="max-w-3xl mx-auto w-full">
            <ChatWindow />
          </div>
        )}
        
        {activeTab === 'quiz' && activeQuiz && (
          <QuizCard quiz={activeQuiz} onSubmit={submitAnswers} isSubmitting={isSubmitting} />
        )}
      </div>

      {/* Persistent Speech synthesize triggers */}
      <VoicePlayer />
    </div>
  );
}

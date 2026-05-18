'use client';

import { useState, useRef, useEffect } from 'react';
import { useSessionStore } from '@/store/session-store';
import { useChat } from '@/hooks/use-chat';
import { useVoice } from '@/hooks/use-voice';
import { MessageBubble } from './message-bubble';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChatWindow() {
  const { messages, isLoading } = useSessionStore();
  const { sendMessage, streamingMessage } = useChat();
  const { speak, stopSpeaking, isSpeaking, startListening, stopListening, isListening, transcript } = useVoice();
  const [inputText, setInputText] = useState('');
  const [voiceOutEnabled, setVoiceOutEnabled] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync vocal transcription from hook to local input box
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Autoscroll chat history
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const query = inputText;
    setInputText('');
    
    await sendMessage(query);
  };

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setVoiceOutEnabled(!voiceOutEnabled);
  };

  return (
    <div className="flex flex-col h-[600px] rounded-xl border border-neutral-850 bg-neutral-900/40 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-850 bg-neutral-950/20">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-semibold text-neutral-200">EduAgent Live Tutor Session</span>
        </div>

        {/* Vocal Audio controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoiceToggle}
            className="h-8 w-8 text-neutral-400 hover:text-white"
            title={voiceOutEnabled ? 'Mute AI speech output' : 'Enable AI speech output'}
          >
            {voiceOutEnabled ? <Volume2 className="h-4.5 w-4.5 text-emerald-400" /> : <VolumeX className="h-4.5 w-4.5" />}
          </Button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onSpeak={voiceOutEnabled ? speak : undefined} />
        ))}
        
        {/* Real-time Streaming message preview */}
        {streamingMessage && (
          <MessageBubble 
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingMessage,
              createdAt: new Date().toISOString()
            }} 
          />
        )}

        {/* Loading Spinner */}
        {isLoading && !streamingMessage && (
          <div className="flex items-center gap-2.5 text-sm text-neutral-400 bg-neutral-900/50 p-3.5 rounded-lg max-w-[200px] border border-neutral-850">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>EduAgent is thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSend} className="p-4 border-t border-neutral-850 bg-neutral-950/20 flex gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={isListening ? stopListening : startListening}
          className={cn(
            'shrink-0 border-neutral-800 transition-colors',
            isListening ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' : 'text-neutral-400 hover:text-white'
          )}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="h-4.5 w-4.5 animate-pulse" /> : <Mic className="h-4.5 w-4.5" />}
        </Button>
        
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? 'Listening...' : 'Ask your AI tutor a question or request an analogy...'}
          className="flex-1 bg-neutral-950 border-neutral-800"
          disabled={isLoading}
        />
        
        <Button 
          type="submit" 
          disabled={!inputText.trim() || isLoading}
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

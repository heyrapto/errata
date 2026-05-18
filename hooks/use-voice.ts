import { useState, useEffect, useRef } from 'react';
import { useSessionStore } from '@/store/session-store';

export function useVoice() {
  const { isSpeaking, setSpeaking } = useSessionStore();
  const [isListening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setListening(true);
          setTranscript('');
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setTranscript(resultText);
        };

        rec.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setListening(false);
        };

        rec.onend = () => {
          setListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Text-To-Speech (TTS)
  const speak = (text: string) => {
    if (typeof window === 'undefined') return;

    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    if (!text) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    // Pick a natural-sounding English voice if available
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Natural'));
    if (googleVoice) {
      utterance.voice = googleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  // Speech-To-Text (STT) Trigger
  const startListening = () => {
    if (!recognitionRef.current) {
      console.warn('Speech Recognition not supported in this browser.');
      return;
    }
    
    stopSpeaking(); // stop tutor voice when user speaks
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    startListening,
    stopListening,
    isListening,
    transcript,
    setTranscript,
  };
}

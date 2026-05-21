import { useState, useEffect, useRef } from 'react';
import { useSessionStore } from '@/store/session-store';

type BrowserSpeechRecognitionResult = {
  transcript: string;
};

type BrowserSpeechRecognitionEvent = {
  results: BrowserSpeechRecognitionResult[][];
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type BrowserWindow = Window & {
  SpeechRecognition?: new () => BrowserSpeechRecognition;
  webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
};

export function useVoice() {
  const { isSpeaking, setSpeaking } = useSessionStore();
  const [isListening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [preferredVoiceName, setPreferredVoiceName] = useState<string | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported =
    typeof window !== 'undefined' &&
    Boolean((window as BrowserWindow).SpeechRecognition || (window as BrowserWindow).webkitSpeechRecognition || window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserWindow = window as BrowserWindow;
      const SpeechRecognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setListening(true);
          setTranscript('');
        };

        rec.onresult = (event: BrowserSpeechRecognitionEvent) => {
          const resultText = event.results[0][0].transcript;
          setTranscript(resultText);
        };

        rec.onerror = (event: { error: string }) => {
          console.error('Speech recognition error:', event.error);
          setListening(false);
        };

        rec.onend = () => {
          setListening(false);
        };

        recognitionRef.current = rec;
      }

      const refreshPreferredVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (voice) =>
            voice.name.includes('Google US English') ||
            voice.name.includes('Natural') ||
            voice.name.toLowerCase().includes('microsoft')
        );

        setPreferredVoiceName(preferredVoice?.name ?? null);
      };

      refreshPreferredVoice();
      window.speechSynthesis.addEventListener('voiceschanged', refreshPreferredVoice);

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', refreshPreferredVoice);
        window.speechSynthesis.cancel();
        setSpeaking(false);
        recognitionRef.current?.stop?.();
        recognitionRef.current = null;
      };
    }

    return undefined;
  }, [setSpeaking]);

  // Text-To-Speech (TTS)
  const speak = (text: string) => {
    if (typeof window === 'undefined') return;
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    utteranceRef.current = null;

    if (!text) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    // Pick a natural-sounding English voice if available
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find((v) =>
      preferredVoiceName
        ? v.name === preferredVoiceName
        : v.name.includes('Google US English') || v.name.includes('Natural') || v.name.toLowerCase().includes('microsoft')
    );
    if (googleVoice) {
      utterance.voice = googleVoice;
    }

    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window === 'undefined') return;
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
  };

  // Speech-To-Text (STT) Trigger
  const startListening = (onTranscript?: (text: string) => void) => {
    if (!recognitionRef.current) {
      console.warn('Speech Recognition not supported in this browser.');
      return;
    }
    
    stopSpeaking(); // stop tutor voice when user speaks

    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        onTranscript?.(resultText);
      };
    }
    
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
    isSupported,
  };
}

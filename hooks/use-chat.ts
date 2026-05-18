import { useState } from 'react';
import { useSessionStore } from '@/store/session-store';

export function useChat() {
  const { messages, activeSessionId, mode, addMessage, setLoading } = useSessionStore();
  const [streamingMessage, setStreamingMessage] = useState('');

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || !activeSessionId) return;

    // 1. Add user message to global store
    addMessage({
      role: 'user',
      content: userText,
    });
    
    setLoading(true);
    setStreamingMessage('');

    try {
      // 2. Fetch streaming chat response
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          message: userText,
          mode,
          history: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      if (!response.body) {
        throw new Error('Response body is empty');
      }

      // 3. Read chunk stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantResponse += chunk;
        setStreamingMessage(assistantResponse);
      }

      // 4. Save final full reply to store
      addMessage({
        role: 'assistant',
        content: assistantResponse,
      });
      setStreamingMessage('');
    } catch (error) {
      console.error('Error streaming chat:', error);
      addMessage({
        role: 'assistant',
        content: "I'm sorry, I encountered a connection issue. Please try sending that again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    streamingMessage,
  };
}

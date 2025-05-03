'use client';

import * as React from 'react';
import { generateResponse } from '@/ai/flows/generate-response';
import { ChatDisplay } from '@/components/chat/chat-display';
import { ChatInput } from '@/components/chat/chat-input';
import type { ChatMessage } from '@/types/chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

const CHAT_HISTORY_KEY = 'personalai-chat-history';

export default function Home() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast()

  // Load chat history from local storage on initial mount
  React.useEffect(() => {
    // Ensure this only runs on the client side
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          if (Array.isArray(parsedHistory)) {
            setMessages(parsedHistory);
          } else {
            console.warn("Invalid chat history found in local storage.");
            localStorage.removeItem(CHAT_HISTORY_KEY); // Clear invalid data
          }
        }
      } catch (e) {
        console.error("Failed to parse chat history from local storage:", e);
        localStorage.removeItem(CHAT_HISTORY_KEY); // Clear corrupted data
      }
    }
  }, []);

  // Save chat history to local storage whenever messages change
  React.useEffect(() => {
    // Ensure this only runs on the client side
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat history to local storage:", e);
        // Potentially notify user about storage issue if persistent
        toast({
          variant: "destructive",
          title: "Storage Error",
          description: "Could not save chat history. Local storage might be full or disabled.",
        })
      }
    }
  }, [messages, toast]); // Add toast dependency


  const handleSendMessage = async (userMessage: string) => {
    const newUserMessage: ChatMessage = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Prepare chat history string for the AI
      const chatHistoryString = updatedMessages
        .slice(-10) // Limit history to last 10 messages for context
        .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        .join('\n');

      const aiResponse = await generateResponse({ message: userMessage, chatHistory: chatHistoryString });
      if (aiResponse && aiResponse.response) {
        const newAiMessage: ChatMessage = {
          role: 'ai',
          content: typeof aiResponse.response === 'string' ? aiResponse.response : JSON.stringify(aiResponse.response)
        };
        setMessages(prevMessages => [...prevMessages, newAiMessage]);
      } else {
        throw new Error('Received an empty or invalid response from the AI.');
      }

    } catch (err) {
      console.error('Error generating AI response:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: "destructive",
        title: "AI Error",
        description: `Failed to get response: ${errorMessage}`,
      })
      // Optionally remove the user message that failed or add an error state indicator
      // setMessages(prev => prev.slice(0, -1)); // Example: remove last user message

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <Card className="w-full max-w-3xl h-[95vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 backdrop-blur-sm">
          <CardTitle className="text-xl font-semibold text-center text-foreground">Personal AI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ChatDisplay messages={messages} isLoading={isLoading} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

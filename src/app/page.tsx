'use client';

import * as React from 'react';
import { generateResponse } from '@/ai/flows/generate-response';
import { ChatDisplay } from '@/components/chat/chat-display';
import { ChatInput } from '@/components/chat/chat-input';
import type { ChatMessage } from '@/types/chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // 👈 Added
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const CHAT_HISTORY_KEY = 'personalai-chat-history';

export default function Home() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  // Load chat history
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          if (Array.isArray(parsedHistory)) {
            setMessages(parsedHistory);
          } else {
            console.warn("Invalid chat history found in local storage.");
            localStorage.removeItem(CHAT_HISTORY_KEY);
          }
        }
      } catch (e) {
        console.error("Failed to parse chat history from local storage:", e);
        localStorage.removeItem(CHAT_HISTORY_KEY);
      }
    }
  }, []);

  // Save chat history
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat history to local storage:", e);
        toast({
          variant: "destructive",
          title: "Storage Error",
          description: "Could not save chat history. Local storage might be full or disabled.",
        });
      }
    }
  }, [messages, toast]);

  const handleSendMessage = async (userMessage: string) => {
    const newUserMessage: ChatMessage = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const chatHistoryString = updatedMessages
        .slice(-10)
        .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        .join('\n');

      const aiResponse = await generateResponse({ message: userMessage, chatHistory: chatHistoryString });
      if (aiResponse && aiResponse.response) {
        const newAiMessage: ChatMessage = {
          role: 'ai',
          content: typeof aiResponse.response === 'string' ? aiResponse.response : JSON.stringify(aiResponse.response),
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
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    }
    toast({
      variant: "default",
      title: "Chat Cleared",
      description: "Your chat history has been reset.",
    });
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <Card className="w-full max-w-3xl h-[95vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 backdrop-blur-sm flex items-center justify-between"> {/* 👈 Modified */}
          <CardTitle className="text-xl font-semibold text-foreground text-center w-full">Personal AI Assistant</CardTitle>
          <Button variant="outline" size="sm" onClick={handleClearChat} className="absolute right-4 top-4">
            Clear
          </Button>
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

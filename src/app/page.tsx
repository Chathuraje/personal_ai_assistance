// page.tsx
'use client';

import React from 'react';
import { generateResponse } from '@/ai/flows/generate-response';
import { ChatMessage } from '@/types/chat';
import { useToast } from "@/hooks/use-toast";
import LoginSection from '@/components/LoginSection';
import ChatSection from '@/components/ChatSection';

const CHAT_HISTORY_KEY = 'personalai-chat-history';
const USER_LOGIN_KEY = 'personalai-user-login';

export default function Home() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLoginData = localStorage.getItem(USER_LOGIN_KEY);
      if (storedLoginData) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: 'Please enter both username and password.',
      });
      return;
    }

    const loginData = { username, password };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (result.statusCode === 401) {
        toast({
          variant: 'destructive',
          title: 'Login Error',
          description: result.message || 'Invalid username or password.',
        });
        return;
      }

      if (result.statusCode === 500) {
        toast({
          variant: 'destructive',
          title: 'Login Error',
          description: result.message || 'An unknown error occurred.',
        });
        return;
      }

      // If success
      setIsLoggedIn(true);
      toast({
        variant: 'default',
        title: 'Login Successful',
        description: `Welcome, ${username}!`,
      });

    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred.',
      });
    }
  };



  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          if (Array.isArray(parsedHistory)) {
            setMessages(parsedHistory);
          } else {
            console.warn('Invalid chat history found in local storage.');
            localStorage.removeItem(CHAT_HISTORY_KEY);
          }
        }
      } catch (e) {
        console.error('Failed to parse chat history from local storage:', e);
        localStorage.removeItem(CHAT_HISTORY_KEY);
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save chat history to local storage:', e);
        toast({
          variant: 'destructive',
          title: 'Storage Error',
          description: 'Could not save chat history. Local storage might be full or disabled.',
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
        .map((msg) => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        .join('\n');

      const aiResponse = await generateResponse({ message: userMessage, chatHistory: chatHistoryString });
      if (aiResponse && aiResponse.response) {
        const newAiMessage: ChatMessage = {
          role: 'ai',
          content: typeof aiResponse.response === 'string' ? aiResponse.response : JSON.stringify(aiResponse.response),
        };
        setMessages((prevMessages) => [...prevMessages, newAiMessage]);
      } else {
        throw new Error('Received an empty or invalid response from the AI.');
      }
    } catch (err) {
      console.error('Error generating AI response:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'AI Error',
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
      variant: 'default',
      title: 'Chat Cleared',
      description: 'Your chat history has been reset.',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_LOGIN_KEY);
    setIsLoggedIn(false);
    toast({
      variant: 'default',
      title: 'Logged Out',
      description: 'You have been logged out.',
    });
  };

  if (!isLoggedIn) {
    return <LoginSection
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />;
  }

  return (
    <ChatSection
      messages={messages}
      isLoading={isLoading}
      handleClearChat={handleClearChat}
      handleLogout={handleLogout}
      handleSendMessage={handleSendMessage}
    />
  );
}

'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      inputRef.current?.focus(); // Keep focus on input after sending
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-3 p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm", // Removed border-t, added gap and padding
        "sticky bottom-0" // Make input sticky at the bottom
      )}
    >
      <Input
        ref={inputRef}
        type="text"
        placeholder="Ask Ai Assistant anything..." // Updated placeholder
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
        className={cn(
          "flex-1 h-11 rounded-full px-5", // Rounded full, increased height and padding
          "bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0" // Subtle background, no border, custom focus
        )}
        aria-label="Chat message input"
      />
      <Button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        aria-label="Send message"
        size="icon" // Use icon size
        className={cn(
          "rounded-full w-11 h-11 bg-gradient-to-br from-primary to-accent text-primary-foreground", // Round button, gradient background
          "hover:opacity-90 transition-opacity disabled:opacity-50 disabled:bg-muted" // Hover and disabled styles
        )}
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </form>
  );
}

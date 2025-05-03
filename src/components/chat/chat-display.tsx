'use client';

import * as React from 'react';
import type { ChatMessage } from '@/types/chat';
import { MessageBubble } from './message-bubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChatDisplayProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatDisplay({ messages, isLoading }: ChatDisplayProps) {
  // const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;

  React.useEffect(() => {
    // Scroll to bottom when messages change or loading state changes
    if (viewportRef.current) {
      // Use smooth scrolling
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 w-full" viewportRef={viewportRef}>
      <div className={cn(
        "p-6 space-y-5", // Increased padding and spacing
        "h-full" // Ensure it tries to take full height within ScrollArea
      )}>
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-end gap-3 mb-4 justify-start animate-pulse">
            <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
            <Skeleton className="h-14 w-2/5 rounded-xl bg-muted/80" />
          </div>
        )}
        {/* Add a small spacer at the bottom to ensure the last message isn't cut off */}
        <div className="h-4" />
      </div>
    </ScrollArea>
  );
}

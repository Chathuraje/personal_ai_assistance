'use client';

import type { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Added AvatarImage
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Define base animation classes
  const animationClasses = 'animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 ease-out';

  return (
    <div
      className={cn(
        'flex items-end gap-3 mb-4', // Use items-end for better alignment with avatars
        isUser ? 'justify-end' : 'justify-start',
        animationClasses // Apply animation
      )}
    >
      {!isUser && (
        <Avatar className="h-10 w-10 bg-gradient-to-br from-muted to-secondary shadow-md border border-border/50">
          <AvatarFallback className="bg-transparent text-foreground/80">
            <Bot className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl p-4 shadow-md', // Increased rounding and padding
          isUser
            ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground' // Gradient for user
            : 'bg-card/90 text-card-foreground border border-border/30' // Lighter background for AI with subtle border
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      {isUser && (
        <Avatar className="h-10 w-10 bg-gradient-to-br from-accent to-primary shadow-md border border-border/50">
          {/* You could add an AvatarImage here if user images are available */}
          <AvatarFallback className="bg-transparent text-primary-foreground/90">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

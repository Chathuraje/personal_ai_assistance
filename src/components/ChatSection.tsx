// ChatSection.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatDisplay } from '@/components/chat/chat-display';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/types/chat';

interface ChatSectionProps {
    messages: ChatMessage[];
    isLoading: boolean;
    handleClearChat: () => void;
    handleLogout: () => void;
    handleSendMessage: (userMessage: string) => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({
    messages,
    isLoading,
    handleClearChat,
    handleLogout,
    handleSendMessage,
}) => {
    return (
        <div className="flex flex-col h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
            <Card className="w-full max-w-3xl h-[95vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 backdrop-blur-sm flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-foreground text-center w-full">Personal AI Assistant</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleClearChat} className="absolute right-4 top-4">
                        Clear
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="absolute left-4 top-4">
                        Logout
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                    <ChatDisplay messages={messages} isLoading={isLoading} />
                    <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
};

export default ChatSection;

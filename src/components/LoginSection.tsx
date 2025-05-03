// LoginSection.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from "@/components/ui/toaster";

interface LoginSectionProps {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    handleLogin: () => void;
}

const LoginSection: React.FC<LoginSectionProps> = ({ username, setUsername, password, setPassword, handleLogin }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/30">
            <Card className="w-full max-w-md p-6 shadow-xl rounded-xl border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-center">Login to Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <Input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        className="w-full"
                        autoComplete='username'
                    />
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        className="w-full"
                        autoComplete='password'
                    />
                    <Button onClick={handleLogin} className="w-full">
                        Login
                    </Button>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
};

export default LoginSection;

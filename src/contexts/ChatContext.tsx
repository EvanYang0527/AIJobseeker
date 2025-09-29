import React, { createContext, useContext, useState } from 'react';
import { ChatMessage } from '../types';

interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  genderMode: 'standard' | 'gender-adapted';
  toggleChat: () => void;
  sendMessage: (message: string) => void;
  setGenderMode: (mode: 'standard' | 'gender-adapted') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'lumina',
      message: "Hi! I'm Lumina, your AI career companion. I'm here to guide you through your journey. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [genderMode, setGenderMode] = useState<'standard' | 'gender-adapted'>('standard');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Simulate Lumina's response
    setTimeout(() => {
      const responses = [
        "That's great! Let me help you with that.",
        "I understand your concern. Here's what I recommend...",
        "Excellent question! Based on your profile...",
        "That sounds like a wonderful opportunity. Let's explore it together.",
        "I'm here to support you through this process."
      ];
      
      const luminaResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'lumina',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, luminaResponse]);
    }, 1000);
  };

  const value = {
    messages,
    isOpen,
    genderMode,
    toggleChat,
    sendMessage,
    setGenderMode
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
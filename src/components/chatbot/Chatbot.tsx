import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { MessageCircle, X, Send, Settings, Star } from 'lucide-react';

export const Chatbot: React.FC = () => {
  const { messages, isOpen, genderMode, toggleChat, sendMessage, setGenderMode } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="neuro-fab"
      >
        <div className="relative">
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          <Star className="absolute -top-2 -right-2 w-4 h-4 text-white neuro-animate-pulse" />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 lg:w-96 h-96 neuro-card flex flex-col z-40 animate-slide-up">
          {/* Chat Header */}
          <div className="neuro-inset p-4 rounded-t-neuro">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 neuro-icon mr-3">
                  <span className="font-bold neuro-text-primary">S</span>
                </div>
                <div>
                  <h3 className="font-bold neuro-text-primary">Sarah</h3>
                  <p className="text-sm neuro-text-secondary">AI Career Companion</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="neuro-surface p-2 rounded-neuro-sm hover:shadow-neuro-hover transition-all"
              >
                <Settings className="w-5 h-5 neuro-text-secondary" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="neuro-inset p-3 border-b border-neuro-bg-dark">
              <div className="flex items-center justify-between">
                <span className="font-semibold neuro-text-primary">Mode:</span>
                <select
                  value={genderMode}
                  onChange={(e) => setGenderMode(e.target.value as 'standard' | 'gender-adapted')}
                  className="neuro-input text-sm"
                >
                  <option value="standard">Standard</option>
                  <option value="gender-adapted">Gender Adapted</option>
                </select>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neuro-bg-light">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-neuro transition-all duration-200 ${
                    message.sender === 'user'
                      ? 'neuro-surface ml-4'
                      : 'bg-gradient-to-br from-neuro-primary to-neuro-primary-light text-white shadow-neuro-primary mr-4'
                  }`}
                >
                  <p className="leading-relaxed">{message.message}</p>
                  {message.sender === 'lumina' && (
                    <Star className="w-3 h-3 text-white mt-1 inline-block opacity-70" />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-neuro-bg-dark">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 neuro-input"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="neuro-button-primary p-3 rounded-neuro-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ProgressBar } from './ProgressBar';
import { Chatbot } from '../chatbot/Chatbot';
import { ProgressStep } from '../../types';
import { 
  LogOut, 
  Building2, 
  Bell,
  Star,
  Target
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  steps: ProgressStep[];
  onStepClick: (stepId: string) => void;
  showPathwaysButton?: boolean;
  onPathwaysClick?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  steps,
  onStepClick,
  showPathwaysButton,
  onPathwaysClick
}) => {
  const { user, logout } = useAuth();

  const getTrackLabel = () => {
    switch (user?.selectedTrack) {
      case 'entrepreneur': return 'Business Development Track';
      case 'wage_employment_early': return 'Early Career Track';
      case 'wage_employment_mid': return 'Mid Career Track';
      case 'wage_employment_advanced': return 'Advanced Career Track';
      default: return 'Professional Development Platform';
    }
  };

  return (
    <div className="min-h-screen bg-neuro-bg overflow-x-hidden relative">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-8 h-8 neuro-icon neuro-animate-float">
          <Star className="w-4 h-4 text-neuro-primary" />
        </div>
        <div className="absolute top-1/3 right-20 w-12 h-12 neuro-icon neuro-animate-float" style={{ animationDelay: '0.5s' }}>
          <Target className="w-6 h-6 text-neuro-secondary" />
        </div>
      </div>

      {/* Header */}
      <header className="neuro-nav sticky top-0 z-40 mb-6">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center">
              <div className="w-12 h-12 neuro-icon mr-4">
                <Building2 className="w-6 h-6 text-neuro-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold neuro-text-primary">Lumina</h1>
                <p className="neuro-text-secondary text-sm hidden lg:block">{getTrackLabel()}</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative neuro-icon hidden sm:flex">
                <Bell className="w-5 h-5 text-neuro-text-light" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-neuro-error rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
              </button>

              {/* Sign Out Button */}
              <button
                onClick={logout}
                className="neuro-button flex items-center"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* Progress Bar */}
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <ProgressBar steps={steps} onStepClick={onStepClick} />
        </div>

        {/* Page Header */}
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex-1">
              <div className="neuro-card">
                <h2 className="text-2xl font-bold neuro-text-primary mb-2">{title}</h2>
                <p className="neuro-text-secondary hidden sm:block">
                  Personalized career development and progress tracking
                </p>
              </div>
            </div>
            
            {/* Pathways Button */}
            {showPathwaysButton && onPathwaysClick && (
              <div className="flex-shrink-0">
                <button
                  onClick={onPathwaysClick}
                  className="neuro-button-primary flex items-center px-6 py-3 rounded-neuro"
                >
                  <Target className="w-4 h-4 mr-2" />
                  <span>Pathways</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="neuro-surface rounded-neuro-lg overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
};
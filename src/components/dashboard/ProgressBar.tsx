import React from 'react';
import { Check, Circle, Star } from 'lucide-react';
import { ProgressStep } from '../../types';

interface ProgressBarProps {
  steps: ProgressStep[];
  onStepClick: (stepId: string) => void;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, onStepClick, className = '' }) => {
  return (
    <div className={`neuro-card ${className}`}>
      {/* Mobile: Vertical stack */}
      <div className="block sm:hidden space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center cursor-pointer group transition-all duration-200 hover:bg-neuro-bg-light rounded-neuro-sm p-3"
            onClick={() => onStepClick(step.id)}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-all duration-200 ${
                step.completed
                  ? 'bg-gradient-to-br from-neuro-success to-green-400 text-white shadow-neuro-success'
                  : step.current
                  ? 'bg-gradient-to-br from-neuro-primary to-neuro-primary-light text-white shadow-neuro-primary neuro-animate-pulse'
                  : 'neuro-surface neuro-text-muted group-hover:shadow-neuro-hover'
              }`}
            >
              {step.completed ? (
                <Check className="w-6 h-6" />
              ) : step.current ? (
                <Star className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <span
                className={`font-semibold transition-colors duration-200 ${
                  step.completed || step.current
                    ? 'neuro-text-primary'
                    : 'neuro-text-secondary group-hover:neuro-text-primary'
                }`}
              >
                {step.label}
              </span>
            </div>
            {step.current && (
              <div className="w-3 h-3 bg-neuro-primary rounded-full neuro-animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Desktop/Tablet: Horizontal */}
      <div className="hidden sm:flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className="flex flex-col items-center cursor-pointer group min-w-0 flex-shrink-0 transition-all duration-200 hover:scale-105"
              onClick={() => onStepClick(step.id)}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-200 ${
                  step.completed
                    ? 'bg-gradient-to-br from-neuro-success to-green-400 text-white shadow-neuro-success'
                    : step.current
                    ? 'bg-gradient-to-br from-neuro-primary to-neuro-primary-light text-white shadow-neuro-primary neuro-animate-pulse'
                    : 'neuro-surface neuro-text-muted group-hover:shadow-neuro-hover'
                }`}
              >
                {step.completed ? (
                  <Check className="w-8 h-8" />
                ) : step.current ? (
                  <Star className="w-8 h-8" />
                ) : (
                  <Circle className="w-8 h-8" />
                )}
              </div>
              <span
                className={`text-sm text-center font-semibold transition-colors duration-200 max-w-24 ${
                  step.completed || step.current
                    ? 'neuro-text-primary'
                    : 'neuro-text-secondary group-hover:neuro-text-primary'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 relative">
                <div className="neuro-progress-track">
                  <div
                    className={`neuro-progress-fill transition-all duration-500 ${
                      steps[index + 1].completed || steps[index + 1].current
                        ? 'w-full'
                        : 'w-0'
                    }`}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
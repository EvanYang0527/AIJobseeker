import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Target, ArrowRight } from 'lucide-react';

interface GoalSettingProps {
  onComplete: () => void;
}

export const GoalSetting: React.FC<GoalSettingProps> = ({ onComplete }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    businessIdea: user?.profile?.businessIdea || '',
    businessCategory: user?.profile?.businessCategory || '',
    experienceYears: user?.profile?.experienceYears || 0,
    timeCommitment: user?.profile?.timeCommitment || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experienceYears' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUser({
      profile: {
        ...user?.profile,
        ...formData
      },
      progress: {
        ...user?.progress!,
        completedSteps: [...(user?.progress?.completedSteps || []), 'goal-setting']
      }
    });
    
    onComplete();
  };

  return (
    <div className="neuro-card">
      <div className="mb-8">
        <div className="w-20 h-20 neuro-icon mx-auto mb-6">
          <Target className="w-10 h-10 text-neuro-primary" />
        </div>
        <h2 className="text-2xl font-bold neuro-text-primary text-center mb-4">Goal Setting</h2>
        <p className="neuro-text-secondary text-center max-w-2xl mx-auto">
          Tell us about your business goals and aspirations. Sarah, your AI companion, will help guide you through this process.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold neuro-text-primary mb-2">
            Business Idea (150 words max)
          </label>
          <textarea
            name="businessIdea"
            value={formData.businessIdea}
            onChange={handleChange}
            rows={4}
            maxLength={150}
            className="neuro-input resize-none"
            placeholder="Describe your business idea, target market, and value proposition..."
            required
          />
          <div className="text-right text-sm neuro-text-muted mt-1">
            {formData.businessIdea.length}/150 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold neuro-text-primary mb-2">
            Business Category
          </label>
          <select
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleChange}
            className="neuro-select"
            required
          >
            <option value="">Select a category</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Tech">Technology</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold neuro-text-primary mb-2">
            Experience in Years
          </label>
          <input
            type="number"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            min="0"
            max="50"
            className="neuro-input"
            placeholder="Years of relevant experience"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold neuro-text-primary mb-2">
            Time Commitment
          </label>
          <select
            name="timeCommitment"
            value={formData.timeCommitment}
            onChange={handleChange}
            className="neuro-select"
            required
          >
            <option value="">Select time commitment</option>
            <option value="2-4 weeks">2-4 weeks (Quick Start)</option>
            <option value="6-8 weeks">6-8 weeks (Accelerated)</option>
            <option value="2-3 months">2-3 months (Standard)</option>
            <option value="4-6 months">4-6 months (Comprehensive)</option>
            <option value="6+ months">6+ months (Extensive)</option>
          </select>
        </div>

        <div className="neuro-inset p-6 rounded-neuro">
          <div className="flex items-start">
            <div className="w-12 h-12 neuro-icon mr-4">
              <span className="neuro-text-primary font-semibold">L</span>
            </div>
            <div>
              <h4 className="font-semibold neuro-text-primary mb-2">Lumina's Tip</h4>
              <p className="neuro-text-secondary">
                Be specific about your business idea! The more details you provide, the better I can 
                tailor your training plan and connect you with relevant resources and mentors. Make sure to complete your SkillsCraft assessment first for personalized recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="neuro-button-primary flex items-center"
          >
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Target, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface GoalSettingProps {
  onComplete: () => void;
}

type SectionKey = 'businessIdea' | 'businessCategory' | 'experienceYears' | 'timeCommitment' | 'tip';

export const GoalSetting: React.FC<GoalSettingProps> = ({ onComplete }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    businessIdea: user?.profile?.businessIdea || '',
    businessCategory: user?.profile?.businessCategory || '',
    experienceYears: user?.profile?.experienceYears || 0,
    timeCommitment: user?.profile?.timeCommitment || ''
  });
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    businessIdea: true,
    businessCategory: true,
    experienceYears: true,
    timeCommitment: true,
    tip: true
  });

  const toggleSection = (section: SectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CollapsibleSection: React.FC<{ section: SectionKey; title: string; children: React.ReactNode }> = ({
    section,
    title,
    children
  }) => {
    const headingId = `${section}-heading`;
    const contentId = `${section}-content`;

    return (
      <div className="neuro-inset rounded-neuro p-4">
        <button
          type="button"
          onClick={() => toggleSection(section)}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={openSections[section]}
          aria-controls={contentId}
          aria-labelledby={headingId}
        >
          <span id={headingId} className="text-sm font-semibold neuro-text-primary">{title}</span>
          {openSections[section] ? (
            <ChevronUp className="w-4 h-4 text-neuro-text-light" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neuro-text-light" />
          )}
        </button>
        {openSections[section] && (
          <div id={contentId} className="mt-4 space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  };

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
        <h2 className="text-2xl font-bold neuro-text-primary text-center mb-4">Scope the idea</h2>
        <p className="neuro-text-secondary text-center max-w-2xl mx-auto">
          Tell us about your business goals and aspirations. Sarah, your AI companion, will help guide you through this process.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <CollapsibleSection section="businessIdea" title="Business Idea (1500 characters max)">
          <div>
            <label htmlFor="businessIdea" className="sr-only">
              Business Idea (1500 characters max)
            </label>
            <textarea
              id="businessIdea"
              name="businessIdea"
              value={formData.businessIdea}
              onChange={handleChange}
              rows={4}
              maxLength={1500}
              className="neuro-input resize-none"
              placeholder="Describe your business idea, target market, and value proposition..."
              aria-labelledby="businessIdea-heading"
              required
            />
            <div className="text-right text-sm neuro-text-muted">
              {formData.businessIdea.length}/1500 characters
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection section="businessCategory" title="Business Category">
          <label htmlFor="businessCategory" className="sr-only">
            Business Category
          </label>
          <select
            id="businessCategory"
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleChange}
            className="neuro-select"
            aria-labelledby="businessCategory-heading"
            required
          >
            <option value="">Select a category</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Tech">Technology</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
        </CollapsibleSection>

        <CollapsibleSection section="experienceYears" title="Experience in Years">
          <label htmlFor="experienceYears" className="sr-only">
            Experience in Years
          </label>
          <input
            id="experienceYears"
            type="number"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            min="0"
            max="50"
            className="neuro-input"
            placeholder="Years of relevant experience"
            aria-labelledby="experienceYears-heading"
            required
          />
        </CollapsibleSection>

        <CollapsibleSection section="timeCommitment" title="Time Commitment">
          <label htmlFor="timeCommitment" className="sr-only">
            Time Commitment
          </label>
          <select
            id="timeCommitment"
            name="timeCommitment"
            value={formData.timeCommitment}
            onChange={handleChange}
            className="neuro-select"
            aria-labelledby="timeCommitment-heading"
            required
          >
            <option value="">Select time commitment</option>
            <option value="2-4 weeks">2-4 weeks (Quick Start)</option>
            <option value="6-8 weeks">6-8 weeks (Accelerated)</option>
            <option value="2-3 months">2-3 months (Standard)</option>
            <option value="4-6 months">4-6 months (Comprehensive)</option>
            <option value="6+ months">6+ months (Extensive)</option>
          </select>
        </CollapsibleSection>

        <CollapsibleSection section="tip" title="Lumina's Tip">
          <div className="flex items-start">
            <div className="w-12 h-12 neuro-icon mr-4">
              <span className="neuro-text-primary font-semibold">L</span>
            </div>
            <div>
              <p className="neuro-text-secondary">
                Be specific about your business idea! The more details you provide, the better I can
                tailor your training plan and connect you with relevant resources and mentors. Make sure to complete your SkillsCraft assessment first for personalized recommendations.
              </p>
            </div>
          </div>
        </CollapsibleSection>

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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight, Compass, Lightbulb } from 'lucide-react';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { entrepreneurSteps } from './entrepreneurSteps';

const foundationalCourses = [
  {
    title: 'Entrepreneurship 101: Who Is Your Customer?',
    provider: 'MITx (edX)',
    duration: '6 weeks',
    focus: 'Customer discovery, value proposition design, and market validation fundamentals.'
  },
  {
    title: 'Business Foundations Specialization',
    provider: 'Wharton Online (Coursera)',
    duration: '4 courses · self-paced',
    focus: 'Accounting, operations, marketing, and management essentials for new founders.'
  },
  {
    title: 'Financial Accounting Fundamentals',
    provider: 'University of Virginia (Coursera)',
    duration: '4 weeks',
    focus: 'Reading financial statements, understanding cash flow, and managing startup finances.'
  },
  {
    title: 'Marketing Fundamentals for Entrepreneurs',
    provider: 'Google Digital Garage',
    duration: '10 modules',
    focus: 'Brand positioning, customer acquisition channels, and go-to-market basics.'
  },
  {
    title: 'Small Business Legal Basics',
    provider: 'U.S. SBA Learning Center',
    duration: 'Self-paced',
    focus: 'Business structures, permits, and compliance considerations for new ventures.'
  }
];

export const EntrepreneurFoundations: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = entrepreneurSteps.map(step => ({
    ...step,
    current: step.id === 'skillcraft-entrepreneurship-tasks',
    completed: user?.progress?.completedSteps?.includes(step.id) || false
  }));

  return (
    <DashboardLayout
      title="Entrepreneurship Track - Foundational Learning"
      steps={steps}
      onStepClick={(_stepId) => navigate('/entrepreneur/dashboard')}
    >
      <div className="bg-neuro-bg">
        <div className="p-8 space-y-8">
          <div className="neuro-card p-8 text-center space-y-4">
            <div className="w-20 h-20 neuro-icon mx-auto bg-gradient-to-br from-neuro-secondary to-pink-400">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold neuro-text-primary">Build Your Business Foundations</h2>
            <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
              These curated courses will help you strengthen the fundamentals needed before crafting a full business plan. Once you feel confident with the basics, you can jump back into the SkillCraft Entrepreneurship Tasks to continue your journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {foundationalCourses.map(course => (
              <div key={course.title} className="neuro-surface p-6 rounded-neuro-lg space-y-4 hover:shadow-neuro-hover transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold neuro-text-primary">{course.title}</h3>
                    <p className="text-sm text-neuro-secondary">{course.provider}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-neuro-secondary">
                  <span className="font-medium text-neuro-primary">Duration:</span>
                  <span>{course.duration}</span>
                </div>
                <p className="text-sm neuro-text-secondary leading-relaxed">{course.focus}</p>
              </div>
            ))}
          </div>

          <div className="neuro-inset p-6 rounded-neuro-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 neuro-icon bg-gradient-to-br from-neuro-success to-green-400">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold neuro-text-primary mb-1">Ready for Your Next Move?</h3>
                <p className="text-sm neuro-text-secondary">
                  Choose how you&apos;d like to continue. You can explore other career pathways or return to the entrepreneurship track when you feel prepared.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
              <button
                onClick={() => navigate('/career-exploration')}
                className="neuro-button flex items-center justify-center gap-2 px-6 py-3 rounded-neuro"
              >
                <Compass className="w-5 h-5" />
                <span>Visit Career Explorer</span>
              </button>
              <button
                onClick={() => navigate('/entrepreneur/dashboard')}
                className="neuro-button-primary flex items-center justify-center gap-2 px-6 py-3 rounded-neuro"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Continue to SkillCraft Entrepreneurship Tasks</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};


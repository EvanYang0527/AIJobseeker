import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Compass, 
  Search, 
  Briefcase,
  Star,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';

interface WageEmploymentOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  level: string;
}

const wageEmploymentOptions: WageEmploymentOption[] = [
  {
    id: 'pathfinder',
    title: 'Pathfinder',
    description: 'This track helps you set goals, build confidence, and map out the first steps toward your future.',
    icon: Compass,
    color: 'success',
    level: 'Entry Level'
  },
  {
    id: 'opportunity-seekers',
    title: 'Opportunity Seekers',
    description: 'This track connects you with training, certifications, and strategies to transition or find the right opportunity.',
    icon: Search,
    color: 'primary',
    level: 'Mid Level'
  },
  {
    id: 'workforce-ready',
    title: 'Workforce Ready',
    description: 'This track focuses on job matching, networking, and employer connections to launch your career.',
    icon: Briefcase,
    color: 'secondary',
    level: 'Advanced Level'
  }
];

export const WageEmploymentSubSelection: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleOptionSelect = (optionId: string) => {
    if (optionId === 'pathfinder') {
      updateUser({ 
        selectedTrack: 'pathfinder',
        profile: {
          ...user?.profile,
          careerLevel: 'entry'
        },
        progress: {
          currentStep: 0,
          completedSteps: ['career-assessment', 'track-recommendation', 'wage-employment-selection'],
          currentProgressBar: 1
        }
      });
      navigate('/pathfinder/dashboard');
    } else if (optionId === 'workforce-ready') {
      updateUser({ 
        selectedTrack: 'workforce-ready',
        profile: {
          ...user?.profile,
          careerLevel: 'advanced'
        },
        progress: {
          currentStep: 0,
          completedSteps: ['career-assessment', 'track-recommendation', 'wage-employment-selection'],
          currentProgressBar: 3
        }
      });
      navigate('/workforce-ready/dashboard');
    } else {
      updateUser({ 
        selectedTrack: 'opportunity-seekers',
        profile: {
          ...user?.profile,
          careerLevel: 'mid'
        },
        progress: {
          currentStep: 0,
          completedSteps: ['career-assessment', 'track-recommendation', 'wage-employment-selection'],
          currentProgressBar: 2
        }
      });
      navigate('/opportunity-seekers/dashboard');
    }
  };

  const handleBack = () => {
    navigate('/track-selection');
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success': return 'from-neuro-success to-green-400';
      case 'primary': return 'from-neuro-primary to-neuro-primary-light';
      case 'secondary': return 'from-neuro-secondary to-pink-400';
      default: return 'from-neuro-primary to-neuro-primary-light';
    }
  };

  return (
    <div className="min-h-screen bg-neuro-bg px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-12 h-12 neuro-icon neuro-animate-float">
          <Star className="w-6 h-6 text-neuro-primary" />
        </div>
        <div className="absolute top-40 right-32 w-16 h-16 neuro-icon neuro-animate-float" style={{ animationDelay: '1s' }}>
          <Briefcase className="w-8 h-8 text-neuro-secondary" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 neuro-icon mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-neuro-primary" />
          </div>
          <h1 className="text-4xl font-bold neuro-text-primary mb-2">Choose Your Path</h1>
          <p className="text-xl neuro-text-secondary max-w-2xl mx-auto">
            Select the wage employment track that best matches your current career stage and goals.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 max-w-7xl mx-auto">
          {wageEmploymentOptions.map((option, index) => {
            const Icon = option.icon;
            
            return (
              <div
                key={option.id}
                className="neuro-card cursor-pointer h-full flex flex-col hover:shadow-neuro-hover transition-all duration-300 hover:scale-105"
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 neuro-icon bg-gradient-to-br ${getColorClasses(option.color)}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="neuro-surface px-4 py-2 rounded-neuro-sm">
                    <span className="text-sm font-semibold neuro-text-primary">{option.level}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold neuro-text-primary mb-3">
                  {option.title}
                </h3>
                
                <p className="neuro-text-secondary leading-relaxed mb-6 flex-grow">
                  {option.description}
                </p>

                {/* Metrics Preview */}
                <div className="grid grid-cols-2 gap-3 mb-6 neuro-inset p-4 rounded-neuro-sm">
                  <div className="text-center">
                    <div className="font-bold neuro-text-primary">
                      {option.id === 'pathfinder' ? '92%' : 
                       option.id === 'opportunity-seekers' ? '87%' : '94%'}
                    </div>
                    <div className="text-sm neuro-text-secondary">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold neuro-text-primary">
                      {option.id === 'pathfinder' ? '8-12 weeks' : 
                       option.id === 'opportunity-seekers' ? '6-10 weeks' : '4-8 weeks'}
                    </div>
                    <div className="text-sm neuro-text-secondary">Duration</div>
                  </div>
                </div>
                
                {/* Call to Action Button */}
                <button className="w-full neuro-button-primary mt-auto">
                  <span>Start This Path</span>
                  <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="neuro-card mb-8">
          <h3 className="font-bold neuro-text-primary mb-4 text-2xl">Not Sure Which Path?</h3>
          <p className="neuro-text-secondary mb-6">
            Each path is designed to meet you where you are in your career journey. You can always switch paths later if your goals change.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 neuro-icon mx-auto mb-4">
                <Target className="w-8 h-8 text-neuro-success" />
              </div>
              <div className="font-bold neuro-text-primary">New to Career</div>
              <div className="neuro-text-secondary">Choose Pathfinder</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 neuro-icon mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-neuro-primary" />
              </div>
              <div className="font-bold neuro-text-primary">Career Change</div>
              <div className="neuro-text-secondary">Choose Opportunity Seekers</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 neuro-icon mx-auto mb-4">
                <Users className="w-8 h-8 text-neuro-secondary" />
              </div>
              <div className="font-bold neuro-text-primary">Job Ready</div>
              <div className="neuro-text-secondary">Choose Workforce Ready</div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={handleBack}
            className="neuro-button flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Track Selection
          </button>
        </div>
      </div>
    </div>
  );
};
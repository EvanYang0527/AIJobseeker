import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AssessmentQuestionnaire } from '../assessment/AssessmentQuestionnaire';
import { TrackOption } from '../../types';
import { 
  Lightbulb, 
  HelpCircle, 
  Briefcase, 
  ArrowRight, 
  Building2, 
  CheckCircle, 
  Clock,
  Users,
  Target,
  Zap,
  Award,
  TrendingUp,
  LogOut,
  Star
} from 'lucide-react';

const trackOptions: TrackOption[] = [
  {
    id: 'entrepreneurship',
    group: 'Business Development',
    label: 'Entrepreneurship Track',
    color: 'purple',
    description: 'Business launch path with mentorship, funding strategies, and networking resources'
  },
  {
    id: 'wage-employment',
    group: 'Wage Employment',
    label: 'Wage Employment Track',
    color: 'blue',
    description: 'Comprehensive employment pathway with skills assessment, job search strategies, and networking'
  }
];

const trackFeatures = {
  entrepreneurship: [
    'SkillsCraft cognitive assessment results',
    'Questions about user\'s prior experience',
    'Goal setting (business idea, time commitment)',
    'WOOP Report with AI-based custom training plan',
    'AI Mentor Program for ongoing guidance',
    'Comprehensive business launch support'
  ],
  'wage-employment': [
    'SkillsCraft RIASEC assessment',
    'Career guidance chatbot',
    'Advanced networking resources',
    'Job search strategies and training',
    'E-learning resources and skill development',
    'AI-powered job matching system'
  ]
};

const trackMetrics = {
  entrepreneurship: {
    completion: '87%',
    avgTime: '10-14 weeks',
    successRate: '73%',
    participants: '2,847'
  },
  'wage-employment': {
    completion: '85%',
    avgTime: '12-16 weeks',
    successRate: '91%', 
    participants: '4,082'
  }
};

const icons = {
  entrepreneurship: Lightbulb,
  'wage-employment': Briefcase
};

export const TrackSelection: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);

  const handleAssessmentComplete = (recommendedTrack: string, confidence: number) => {
    console.log(`Recommended track: ${recommendedTrack} with ${confidence}% confidence`);
    const trackMapping: Record<string, string> = {
      'entrepreneur': 'entrepreneurship',
      'early': 'wage-employment',
      'mid': 'wage-employment',
      'advanced': 'wage-employment'
    };
    const mappedTrack = trackMapping[recommendedTrack] || 'wage-employment';
    handleTrackSelect(mappedTrack as any);
  };

  const handleBackToSelection = () => {
    setShowQuestions(false);
  };

  const handleTrackSelect = (trackId: 'entrepreneurship' | 'wage-employment') => {
    if (trackId === 'wage-employment') {
      navigate('/wage-employment/selection');
    } else {
      setSelectedTrack(trackId);
      updateUser({ 
        selectedTrack: 'entrepreneur',
        progress: {
          currentStep: 0,
          completedSteps: ['self-select']
        }
      });
      navigate('/entrepreneur/dashboard');
    }
  };

  const handleQuestionsClick = () => {
    // This should not be accessible directly - users should go through career assessment first
    navigate('/career-assessment');
  };

  if (showQuestions) {
    return (
      <AssessmentQuestionnaire 
        onComplete={handleAssessmentComplete}
        onBack={handleBackToSelection}
      />
    );
  }

  const organizationStats = [
    { label: 'Total Enrolled', value: '12,237', trend: '+18%', icon: Users },
    { label: 'Completion Rate', value: '89.4%', trend: '+2.1%', icon: Target },
    { label: 'Job Placement', value: '73.2%', trend: '+5.8%', icon: TrendingUp },
    { label: 'Avg. Satisfaction', value: '4.7/5', trend: '+0.3', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-neuro-bg px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-12 h-12 neuro-icon neuro-animate-float">
          <Star className="w-6 h-6 text-neuro-primary" />
        </div>
        <div className="absolute top-40 right-32 w-16 h-16 neuro-icon neuro-animate-float" style={{ animationDelay: '1s' }}>
          <Lightbulb className="w-8 h-8 text-neuro-secondary" />
        </div>
        <div className="absolute bottom-32 left-1/4 w-10 h-10 neuro-icon neuro-animate-float" style={{ animationDelay: '2s' }}>
          <Star className="w-5 h-5 text-neuro-warning" />
        </div>
      </div>

      {/* Header */}
      <header className="neuro-nav -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 xl:gap-0">
            <div className="flex items-center">
              <div className="w-16 h-16 neuro-icon mr-4">
                <Building2 className="w-8 h-8 text-neuro-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neuro-text-primary">Welcome to Lumina, {user?.fullName}!</h1>
                <p className="neuro-text-secondary hidden sm:block">Your personal co-pilot from learning to earning</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="neuro-button flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-6 sm:py-8">
        {/* Assessment CTA */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold neuro-text-primary mb-4">Meet Lumina - Your Personal Co-pilot</h2>
            <p className="text-xl neuro-text-secondary max-w-2xl mx-auto mb-8">
              Your launchpad from learning to earning. Take our career assessment to get a personalized track recommendation.
            </p>
            
            <button
              onClick={() => navigate('/career-assessment')}
              className="neuro-button-primary inline-flex items-center px-8 py-4 text-xl rounded-neuro"
            >
              <HelpCircle className="w-6 h-6 mr-3" />
              <span>Start Career Assessment</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
          
          <div className="neuro-card max-w-2xl mx-auto">
            <div className="flex items-start">
              <div className="w-12 h-12 neuro-icon mr-4">
                <Zap className="w-6 h-6 text-neuro-primary" />
              </div>
              <div>
                <h3 className="font-bold neuro-text-primary mb-2 text-lg">AI-Powered Recommendation</h3>
                <p className="neuro-text-secondary">
                  Our intelligent assessment analyzes your skills, experience, and goals to recommend the best career track for your success.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Track Selection */}
        <div className="text-center mb-8">
          <div className="neuro-inset p-6 rounded-neuro mb-6">
            <h3 className="text-2xl font-bold neuro-text-primary mb-2">Self Select Option</h3>
            <p className="neuro-text-secondary">Already know which track is right for you? Choose directly below.</p>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {trackOptions.map((track, index) => {
              const Icon = icons[track.id];
              const features = trackFeatures[track.id];
              const metrics = trackMetrics[track.id];
              
              return (
                <div
                  key={track.id}
                  className="neuro-card cursor-pointer h-full flex flex-col hover:shadow-neuro-hover transition-all duration-300"
                  onClick={() => handleTrackSelect(track.id)}
                >
                  <div className="w-full flex justify-center mb-6">
                    {track.id === 'entrepreneurship' ? (
                      <img 
                        src="/src/assets/images/ENT_TrackSelection.png"
                        alt="Entrepreneurship Track"
                        className="w-48 h-48 object-contain"
                      />
                    ) : (
                      <img 
                        src="/src/assets/images/WAGEemp_TrackSelection.png"
                        alt="Wage Employment Track"
                        className="w-48 h-48 object-contain"
                      />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold neuro-text-primary mb-3">
                    {track.label}
                  </h3>
                  
                  <p className="neuro-text-secondary mb-6 leading-relaxed">
                    {track.description}
                  </p>

                  {/* Call to Action Button */}
                  <button className="w-3/4 mx-auto neuro-button-primary mt-auto py-4 rounded-neuro-lg">
                    <span>Begin Journey</span>
                    <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Stats */}
        {isAdmin && (
          <div className="neuro-card mb-8">
            <h3 className="font-bold neuro-text-primary mb-6 text-xl">Organization Overview</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {organizationStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 neuro-icon mx-auto mb-4">
                      <Icon className="w-8 h-8 text-neuro-primary" />
                    </div>
                    <div className="text-2xl font-bold neuro-text-primary">{stat.value}</div>
                    <div className="neuro-text-secondary">{stat.label}</div>
                    <div className="text-neuro-success font-semibold">{stat.trend}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Support Section */}
        <div className="text-center neuro-card">
          <h3 className="font-bold neuro-text-primary mb-4 text-2xl">Not Sure Which Track?</h3>
          <p className="neuro-text-secondary mb-6 max-w-2xl mx-auto">
            Our career assessment analyzes your skills and goals to provide personalized track recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/career-assessment')}
              className="neuro-button-primary inline-flex items-center px-6 py-3 rounded-neuro"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              <span>Start Assessment</span>
            </button>
            <button className="neuro-button inline-flex items-center px-6 py-3 rounded-neuro">
              <Users className="w-5 h-5 mr-2" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
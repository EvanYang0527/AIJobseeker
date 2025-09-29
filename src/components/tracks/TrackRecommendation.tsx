import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Target, 
  ArrowRight, 
  Lightbulb, 
  Briefcase, 
  Star,
  CheckCircle,
  TrendingUp,
  Users,
  Award,
  Brain,
  Sparkles
} from 'lucide-react';

export const TrackRecommendation: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  
  const recommendedTrack = searchParams.get('track') || 'wage-employment';
  const confidence = parseInt(searchParams.get('confidence') || '75');

  const trackOptions = {
    'entrepreneurship': {
      title: 'Entrepreneurship Track',
      description: 'Business launch pathway with mentorship, funding strategies, and networking resources',
      icon: Lightbulb,
      color: 'from-neuro-secondary to-pink-400',
      features: ['Business Plan Development', 'Funding Strategies', 'Mentorship Program', 'Networking Resources'],
      successRate: '87%',
      duration: '10-14 weeks'
    },
    'wage-employment': {
      title: 'Wage Employment Track',
      description: 'Comprehensive employment pathway with skills assessment, job search strategies, and networking',
      icon: Briefcase,
      color: 'from-neuro-primary to-neuro-primary-light',
      features: ['Skills Assessment', 'Job Search Strategies', 'Interview Preparation', 'Career Guidance'],
      successRate: '91%',
      duration: '12-16 weeks'
    }
  };

  const handleTrackSelect = (trackId: string) => {
    setSelectedTrack(trackId);
    
    if (trackId === 'entrepreneurship') {
      updateUser({ 
        selectedTrack: 'entrepreneur',
        progress: {
          currentStep: 0,
          completedSteps: ['career-assessment', 'track-recommendation']
        }
      });
      navigate('/entrepreneur/dashboard');
    } else {
      updateUser({ 
        selectedTrack: 'wage-employment',
        progress: {
          currentStep: 0,
          completedSteps: ['career-assessment', 'track-recommendation']
        }
      });
      navigate('/wage-employment/selection');
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
          <Sparkles className="w-8 h-8 text-neuro-secondary" />
        </div>
        <div className="absolute bottom-32 left-1/4 w-10 h-10 neuro-icon neuro-animate-float" style={{ animationDelay: '2s' }}>
          <Target className="w-5 h-5 text-neuro-warning" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-success to-green-400">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold neuro-text-primary mb-4">Assessment Complete!</h1>
          <p className="text-xl neuro-text-secondary max-w-2xl mx-auto">
            Based on your responses, we've identified the best career track for your goals and experience.
          </p>
        </div>

        {/* Confidence Score */}
        <div className="neuro-card mb-8 text-center">
          <div className="w-24 h-24 neuro-icon mx-auto mb-4 bg-gradient-to-br from-neuro-primary to-neuro-primary-light">
            <span className="text-2xl font-bold text-white">{confidence}%</span>
          </div>
          <h2 className="text-2xl font-bold neuro-text-primary mb-2">Match Confidence</h2>
          <p className="neuro-text-secondary">
            Our AI analysis shows a {confidence}% compatibility with your recommended track
          </p>
        </div>

        {/* Recommended Track */}
        <div className="neuro-card mb-8 bg-gradient-to-r from-neuro-bg-light to-neuro-bg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold neuro-text-primary mb-2">Recommended Track</h2>
            <div className="w-16 h-16 neuro-icon mx-auto mb-4 bg-gradient-to-br from-neuro-success to-green-400">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="neuro-surface p-8 rounded-neuro-lg mb-6 hover:shadow-neuro-hover transition-all duration-300">
            {(() => {
              const track = trackOptions[recommendedTrack as keyof typeof trackOptions];
              const Icon = track.icon;
              return (
                <div>
                  <div className="text-center mb-6">
                    <div className={`w-24 h-24 neuro-icon mx-auto mb-4 bg-gradient-to-br ${track.color}`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold neuro-text-primary mb-3">{track.title}</h3>
                    <p className="neuro-text-secondary text-lg">{track.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-bold neuro-text-primary mb-3">Why This Track?</h4>
                      <ul className="space-y-2">
                        {track.title.includes('Entrepreneurship') ? [
                          'Strong business acumen indicators',
                          'High risk tolerance',
                          'Leadership potential identified',
                          'Innovation mindset detected'
                        ] : [
                          'Excellent employment readiness',
                          'Strong professional skills',
                          'Career advancement potential',
                          'Industry alignment identified'
                        ].map((reason, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-neuro-success mr-3" />
                            <span className="neuro-text-secondary">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <div className="neuro-inset p-4 rounded-neuro text-center">
                        <div className="text-2xl font-bold text-neuro-success">
                          {track.title.includes('Entrepreneurship') ? '87%' : '91%'}
                        </div>
                        <div className="text-sm neuro-text-secondary">Success Rate</div>
                      </div>
                      <div className="neuro-inset p-4 rounded-neuro text-center">
                        <div className="text-2xl font-bold neuro-text-primary">
                          {track.title.includes('Entrepreneurship') ? '10-14 weeks' : '12-16 weeks'}
                        </div>
                        <div className="text-sm neuro-text-secondary">Duration</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            
            <button
              onClick={() => handleTrackSelect(recommendedTrack)}
              className="w-full neuro-button-primary text-xl py-6 hover:scale-105 transition-all duration-300 rounded-neuro-lg"
            >
              Accept Recommendation & Start Track
              <ArrowRight className="w-6 h-6 ml-3 inline-block" />
            </button>
          </div>
        </div>

        {/* Alternative Track */}
        <div className="neuro-card">
          <h3 className="text-xl font-bold neuro-text-primary mb-6 text-center">
            Not What You Expected? Choose Different Track
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(trackOptions)
              .filter(([key]) => key !== recommendedTrack)
              .map(([key, track]) => {
                const Icon = track.icon;
                return (
                  <div key={key} className="neuro-surface p-6 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 neuro-icon bg-gradient-to-br ${track.color} mr-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold neuro-text-primary">{track.title}</h4>
                        <p className="text-sm neuro-text-secondary">{track.successRate} success rate</p>
                      </div>
                    </div>
                    <p className="neuro-text-secondary mb-4">{track.description}</p>
                    <button
                      onClick={() => handleTrackSelect(key)}
                      className="w-full neuro-button hover:scale-105 transition-all duration-300"
                    >
                      Choose This Track
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Back to Assessment */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/career-assessment')}
            className="neuro-button flex items-center mx-auto"
          >
            ← Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
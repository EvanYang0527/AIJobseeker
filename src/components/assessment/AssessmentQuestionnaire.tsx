import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Target, Briefcase, TrendingUp, Award, HelpCircle, Star, Lightbulb } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: {
    id: string;
    text: string;
    weight: {
      entrepreneurship?: number;
      'wage-employment'?: number;
    };
  }[];
}

interface AssessmentQuestionnaireProps {
  onComplete: (recommendedTrack: string, confidence: number) => void;
  onBack: () => void;
}

const questions: Question[] = [
  {
    id: 'career_goal',
    text: 'What best describes your primary career goal?',
    type: 'single',
    options: [
      {
        id: 'start_business',
        text: 'Start my own business or become an entrepreneur',
        weight: { entrepreneurship: 10 }
      },
      {
        id: 'find_job',
        text: 'Find a good job with a stable company',
        weight: { 'wage-employment': 8 }
      },
      {
        id: 'advance_career',
        text: 'Advance in my current career path',
        weight: { 'wage-employment': 10 }
      },
      {
        id: 'executive_role',
        text: 'Transition to senior executive or leadership role',
        weight: { 'wage-employment': 10 }
      }
    ]
  },
  {
    id: 'experience_level',
    text: 'How would you describe your professional experience?',
    type: 'single',
    options: [
      {
        id: 'new_graduate',
        text: 'Recent graduate or new to the workforce',
        weight: { 'wage-employment': 10 }
      },
      {
        id: 'some_experience',
        text: '1-3 years of professional experience',
        weight: { 'wage-employment': 8, entrepreneurship: 5 }
      },
      {
        id: 'experienced',
        text: '4-10 years of professional experience',
        weight: { 'wage-employment': 10, entrepreneurship: 8 }
      },
      {
        id: 'senior_professional',
        text: '10+ years with leadership experience',
        weight: { 'wage-employment': 10, entrepreneurship: 9 }
      }
    ]
  },
  {
    id: 'risk_tolerance',
    text: 'How comfortable are you with taking risks?',
    type: 'single',
    options: [
      {
        id: 'risk_averse',
        text: 'I prefer stability and predictable outcomes',
        weight: { 'wage-employment': 8 }
      },
      {
        id: 'moderate_risk',
        text: 'I\'m comfortable with some calculated risks',
        weight: { 'wage-employment': 10, entrepreneurship: 5 }
      },
      {
        id: 'high_risk',
        text: 'I thrive on high-risk, high-reward opportunities',
        weight: { entrepreneurship: 10, 'wage-employment': 5 }
      },
      {
        id: 'very_high_risk',
        text: 'I love uncertainty and creating something from nothing',
        weight: { entrepreneurship: 10 }
      }
    ]
  },
  {
    id: 'leadership_style',
    text: 'Which statement best describes your preferred working style?',
    type: 'single',
    options: [
      {
        id: 'team_player',
        text: 'I prefer working as part of a team with clear guidance',
        weight: { 'wage-employment': 10 }
      },
      {
        id: 'independent_contributor',
        text: 'I work best independently with minimal supervision',
        weight: { 'wage-employment': 10, entrepreneurship: 8 }
      },
      {
        id: 'team_leader',
        text: 'I enjoy leading teams and managing projects',
        weight: { 'wage-employment': 8, entrepreneurship: 9 }
      },
      {
        id: 'visionary_leader',
        text: 'I love creating vision and building organizations from scratch',
        weight: { entrepreneurship: 10, 'wage-employment': 5 }
      }
    ]
  },
  {
    id: 'industry_interest',
    text: 'What type of work environment appeals to you most?',
    type: 'single',
    options: [
      {
        id: 'established_company',
        text: 'Established company with clear processes and benefits',
        weight: { 'wage-employment': 10 }
      },
      {
        id: 'growing_company',
        text: 'Growing company where I can advance quickly',
        weight: { 'wage-employment': 10 }
      },
      {
        id: 'startup_environment',
        text: 'Fast-paced startup or innovative company',
        weight: { entrepreneurship: 8, 'wage-employment': 8 }
      },
      {
        id: 'own_venture',
        text: 'My own business where I control everything',
        weight: { entrepreneurship: 10 }
      }
    ]
  },
  {
    id: 'financial_goals',
    text: 'What are your financial expectations?',
    type: 'single',
    options: [
      {
        id: 'stable_income',
        text: 'Steady, predictable income with good benefits',
        weight: { 'wage-employment': 10 }
      },
      {
        id: 'growing_salary',
        text: 'Gradually increasing salary with career progression',
        weight: { 'wage-employment': 10 }
      },
      {
        id: 'high_compensation',
        text: 'High compensation commensurate with expertise',
        weight: { 'wage-employment': 10 }
      },
      {
        id: 'unlimited_potential',
        text: 'Unlimited earning potential, willing to sacrifice short-term',
        weight: { entrepreneurship: 10 }
      }
    ]
  }
];

const trackInfo = {
  entrepreneurship: {
    title: 'Entrepreneurship Track',
    description: 'Business launch pathway with mentorship, funding strategies, and networking',
    color: 'secondary',
    icon: Target
  },
  'wage-employment': {
    title: 'Wage Employment Track',
    description: 'Comprehensive employment pathway with skills assessment and job placement',
    color: 'primary',
    icon: Briefcase
  }
};

export const AssessmentQuestionnaire: React.FC<AssessmentQuestionnaireProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendation, setRecommendation] = useState<{track: string; confidence: number} | null>(null);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const calculateRecommendation = () => {
    const scores = {
      entrepreneurship: 0,
      'wage-employment': 0
    };

    // Calculate weighted scores based on answers
    Object.entries(answers).forEach(([questionId, optionId]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(opt => opt.id === optionId);
      
      if (option?.weight) {
        Object.entries(option.weight).forEach(([track, weight]) => {
          scores[track as keyof typeof scores] += weight || 0;
        });
      }
    });

    // Find the track with highest score
    const maxScore = Math.max(...Object.values(scores));
    const recommendedTrack = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    
    // Calculate confidence based on score distribution
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const confidence = Math.round((maxScore / totalScore) * 100);

    return { track: recommendedTrack || 'wage-employment', confidence };
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = calculateRecommendation();
      setRecommendation(result);
      // Navigate to track recommendation page
      window.location.href = `/track-recommendation?track=${result.track}&confidence=${result.confidence}`;
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleCompleteAssessment = (selectedTrack?: string) => {
    const finalTrack = selectedTrack || recommendation?.track || 'wage-employment';
    const finalConfidence = recommendation?.confidence || 75;
    
    // Navigate to track recommendation page with results
    window.location.href = `/track-recommendation?track=${finalTrack}&confidence=${finalConfidence}`;
  };

  if (showResults && recommendation) {
    const recommendedTrackInfo = trackInfo[recommendation.track as keyof typeof trackInfo];
    const Icon = recommendedTrackInfo.icon;
    
    return (
      <div className="min-h-screen bg-neuro-bg px-4 py-8 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-12 h-12 neuro-icon neuro-animate-float">
            <Star className="w-6 h-6 text-neuro-primary" />
          </div>
          <div className="absolute top-40 right-32 w-16 h-16 neuro-icon neuro-animate-float" style={{ animationDelay: '1s' }}>
            <Lightbulb className="w-8 h-8 text-neuro-secondary" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 neuro-icon mx-auto mb-4">
              <Target className="w-10 h-10 text-neuro-primary" />
            </div>
            <h1 className="text-4xl font-bold neuro-text-primary mb-2">Assessment Complete!</h1>
            <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
              Based on your responses, we've identified the best career track for your goals and experience level.
            </p>
          </div>

          {/* Recommended Track */}
          <div className="neuro-card mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold neuro-text-primary mb-2">Recommended Track</h2>
              <div className="flex items-center justify-center mb-4">
                <div className="text-3xl font-bold text-neuro-primary mr-2">{recommendation.confidence}%</div>
                <div className="neuro-text-secondary">match confidence</div>
              </div>
            </div>

            <div className="neuro-surface p-6 rounded-neuro-lg mb-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 neuro-icon mr-4">
                  <Icon className="w-8 h-8 text-neuro-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold neuro-text-primary">{recommendedTrackInfo.title}</h3>
                  <p className="neuro-text-secondary">{recommendedTrackInfo.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleCompleteAssessment()}
                className="w-full neuro-button-primary"
              >
                Start This Track <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </button>
            </div>
          </div>

          {/* Alternative Tracks */}
          <div className="neuro-card mb-8">
            <h3 className="text-xl font-bold neuro-text-primary mb-4 text-center">
              Or Choose a Different Track
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(trackInfo)
                .filter(([key]) => key !== recommendation.track)
                .map(([key, track]) => {
                  const TrackIcon = track.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => handleCompleteAssessment(key)}
                      className="neuro-surface p-4 rounded-neuro hover:shadow-neuro-hover transition-all duration-200"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 neuro-icon mr-4">
                          <TrackIcon className="w-6 h-6 text-neuro-primary" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold neuro-text-primary">
                            {track.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm neuro-text-secondary text-left">
                        {track.description}
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={onBack}
              className="neuro-button flex items-center mx-auto"
            >
              ← Back to Track Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-neuro-bg px-4 py-8 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-12 h-12 neuro-icon neuro-animate-float">
          <Star className="w-6 h-6 text-neuro-primary" />
        </div>
        <div className="absolute top-40 right-32 w-16 h-16 neuro-icon neuro-animate-float" style={{ animationDelay: '1s' }}>
          <Lightbulb className="w-8 h-8 text-neuro-secondary" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 neuro-icon mx-auto mb-4">
            <HelpCircle className="w-10 h-10 text-neuro-primary" />
          </div>
          <h1 className="text-3xl font-bold neuro-text-primary mb-2">Career Assessment</h1>
          <p className="neuro-text-secondary">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="neuro-card mb-8">
          <div className="neuro-progress-track mb-4">
            <div 
              className="neuro-progress-fill transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center">
            <span className="font-bold neuro-text-primary">{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="neuro-card mb-8">
          <h2 className="text-xl font-bold neuro-text-primary mb-6">
            {currentQ.text}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(currentQ.id, option.id)}
                className={`w-full p-4 text-left rounded-neuro transition-all duration-200 ${
                  answers[currentQ.id] === option.id
                    ? 'neuro-inset bg-gradient-to-r from-neuro-primary/10 to-neuro-primary-light/10'
                    : 'neuro-surface hover:shadow-neuro-hover'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center transition-all duration-200 ${
                    answers[currentQ.id] === option.id
                      ? 'bg-gradient-to-br from-neuro-primary to-neuro-primary-light text-white shadow-neuro-primary'
                      : 'neuro-surface neuro-text-muted'
                  }`}>
                    {answers[currentQ.id] === option.id && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-semibold neuro-text-primary">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={currentQuestion === 0 ? onBack : previousQuestion}
            className="neuro-button flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentQuestion === 0 ? 'Back to Selection' : 'Previous'}
          </button>

          <button
            onClick={nextQuestion}
            disabled={!answers[currentQ.id]}
            className="neuro-button-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed py-4 px-8 rounded-neuro-lg"
          >
            {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
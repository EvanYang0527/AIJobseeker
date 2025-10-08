import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Star,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type QuestionId = 'main_goal' | 'job_clarity' | 'business_idea';

type TrackKey =
  | 'career-exploration'
  | 'pathfinder'
  | 'opportunity-seekers'
  | 'workforce-ready'
  | 'entrepreneur';

interface QuestionOption {
  id: string;
  text: string;
  description?: string;
  nextQuestionId?: QuestionId;
  result?: {
    track: TrackKey;
    route: string;
  };
}

interface Question {
  id: QuestionId;
  text: string;
  options: QuestionOption[];
}

interface AssessmentQuestionnaireProps {
  onComplete: (recommendedTrack: string, confidence: number) => void;
  onBack: () => void;
}

const questionMap: Record<QuestionId, Question> = {
  main_goal: {
    id: 'main_goal',
    text: 'What is your main goal?',
    options: [
      {
        id: 'explore_strengths',
        text: "Explore what I'm good at",
        result: { track: 'career-exploration', route: '/career-exploration' }
      },
      {
        id: 'start_business',
        text: 'Start or grow a business',
        nextQuestionId: 'business_idea'
      },
      {
        id: 'find_job',
        text: 'Find a job',
        nextQuestionId: 'job_clarity'
      }
    ]
  },
  job_clarity: {
    id: 'job_clarity',
    text: 'How clear are you about the job you want?',
    options: [
      {
        id: 'ready_to_apply',
        text: 'Ready to apply',
        description: 'You know the job you want and are prepared to submit applications.',
        result: { track: 'workforce-ready', route: '/workforce-ready/dashboard' }
      },
      {
        id: 'somewhat_clear',
        text: 'Somewhat clear',
        description: 'You have some direction but would like to sharpen your skills and plan.',
        result: { track: 'opportunity-seekers', route: '/opportunity-seekers/dashboard' }
      },
      {
        id: 'not_clear',
        text: 'Not clear',
        description: 'You need help understanding your strengths and potential career paths.',
        result: { track: 'pathfinder', route: '/pathfinder/dashboard' }
      }
    ]
  },
  business_idea: {
    id: 'business_idea',
    text: 'Do you already have a business idea?',
    options: [
      {
        id: 'idea_ready',
        text: 'Yes, I have one',
        result: { track: 'entrepreneur', route: '/entrepreneur/dashboard' }
      },
      {
        id: 'need_help',
        text: 'No, need help to start',
        result: { track: 'entrepreneur', route: '/entrepreneur/foundations' }
      }
    ]
  }
};

const longestPathLength = 2; // maximum number of steps in the branching questionnaire

export const AssessmentQuestionnaire: React.FC<AssessmentQuestionnaireProps> = ({ onComplete, onBack }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const savedAnswers = useMemo(() => {
    const existing = user?.profile?.assessmentResponses;
    if (existing && typeof existing === 'object') {
      return existing as Record<string, string>;
    }
    return {};
  }, [user?.profile?.assessmentResponses]);

  const [answers, setAnswers] = useState<Record<string, string>>(savedAnswers);
  const [currentQuestionId, setCurrentQuestionId] = useState<QuestionId>('main_goal');
  const [history, setHistory] = useState<QuestionId[]>([]);

  useEffect(() => {
    setAnswers(savedAnswers);
  }, [savedAnswers]);

  const persistAssessmentData = (nextAnswers: Record<string, string>, track?: TrackKey, confidence?: number) => {
    updateUser({
      profile: {
        ...user?.profile,
        assessmentResponses: nextAnswers,
        assessmentRecommendation:
          track && typeof confidence === 'number'
            ? { track, confidence }
            : user?.profile?.assessmentRecommendation
      }
    });
  };

  const applyTrackSelection = (track: TrackKey, nextAnswers: Record<string, string>) => {
    const baseProfile = {
      ...user?.profile,
      assessmentResponses: nextAnswers,
      assessmentRecommendation: { track, confidence: 100 }
    };

    switch (track) {
      case 'pathfinder':
        updateUser({
          selectedTrack: 'pathfinder',
          profile: {
            ...baseProfile,
            careerLevel: 'entry'
          },
          progress: {
            currentStep: 0,
            completedSteps: ['career-assessment', 'track-recommendation', 'wage-employment-selection'],
            currentProgressBar: 1
          }
        });
        break;
      case 'opportunity-seekers':
        updateUser({
          selectedTrack: 'opportunity-seekers',
          profile: {
            ...baseProfile,
            careerLevel: 'mid'
          },
          progress: {
            currentStep: 0,
            completedSteps: ['career-assessment', 'track-recommendation', 'wage-employment-selection'],
            currentProgressBar: 2
          }
        });
        break;
      case 'workforce-ready':
        updateUser({
          selectedTrack: 'workforce-ready',
          profile: {
            ...baseProfile,
            careerLevel: 'advanced'
          },
          progress: {
            currentStep: 0,
            completedSteps: ['career-assessment', 'track-recommendation', 'wage-employment-selection'],
            currentProgressBar: 3
          }
        });
        break;
      case 'entrepreneur':
        updateUser({
          selectedTrack: 'entrepreneur',
          profile: {
            ...baseProfile,
            careerLevel: 'advanced'
          },
          progress: {
            currentStep: 0,
            completedSteps: ['career-assessment']
          }
        });
        break;
      case 'career-exploration':
      default:
        updateUser({
          selectedTrack: 'career-exploration',
          profile: {
            ...baseProfile,
            careerLevel: 'entry'
          },
          progress: {
            currentStep: 0,
            completedSteps: ['career-assessment']
          }
        });
        break;
    }
  };

  const handleOptionSelect = (questionId: QuestionId, option: QuestionOption) => {
    setAnswers(prev => {
      const updatedAnswers = { ...prev, [questionId]: option.id };
      persistAssessmentData(updatedAnswers);

      if (option.result) {
        const { track, route } = option.result;
        persistAssessmentData(updatedAnswers, track, 100);
        applyTrackSelection(track, updatedAnswers);
        onComplete(track, 100);
        if (route.startsWith('http')) {
          window.location.href = route;
        } else {
          navigate(route);
        }
      } else if (option.nextQuestionId) {
        setHistory(prevHistory => [...prevHistory, questionId]);
        setCurrentQuestionId(option.nextQuestionId);
      }

      return updatedAnswers;
    });
  };

  const handlePrevious = () => {
    setHistory(prevHistory => {
      if (prevHistory.length === 0) {
        onBack();
        return prevHistory;
      }

      const newHistory = [...prevHistory];
      const previousQuestionId = newHistory.pop() || 'main_goal';
      setCurrentQuestionId(previousQuestionId);
      return newHistory;
    });
  };

  const currentQuestion = questionMap[currentQuestionId];
  const progress = Math.min(((history.length + 1) / longestPathLength) * 100, 100);

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
            Step {history.length + 1} of {longestPathLength}
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
          <h2 className="text-xl font-bold neuro-text-primary mb-6">{currentQuestion.text}</h2>

          <div className="space-y-4">
            {currentQuestion.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(currentQuestion.id, option)}
                className={`w-full p-4 text-left rounded-neuro transition-all duration-200 ${
                  answers[currentQuestion.id] === option.id
                    ? 'neuro-inset bg-gradient-to-r from-neuro-primary/10 to-neuro-primary-light/10'
                    : 'neuro-surface hover:shadow-neuro-hover'
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center transition-all duration-200 ${
                      answers[currentQuestion.id] === option.id
                        ? 'bg-gradient-to-br from-neuro-primary to-neuro-primary-light text-white shadow-neuro-primary'
                        : 'neuro-surface neuro-text-muted'
                    }`}
                  >
                    {answers[currentQuestion.id] === option.id && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold neuro-text-primary">{option.text}</div>
                    {option.description && (
                      <p className="text-sm neuro-text-secondary mt-1">{option.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button onClick={handlePrevious} className="neuro-button flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {history.length === 0 ? 'Back to Selection' : 'Previous'}
          </button>

          <div className="neuro-surface px-4 py-2 rounded-neuro flex items-center space-x-2">
            <Target className="w-4 h-4 text-neuro-primary" />
            <span className="text-sm neuro-text-secondary">
              Choose an option above to continue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

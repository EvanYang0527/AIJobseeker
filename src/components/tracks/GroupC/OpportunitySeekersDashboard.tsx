import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { ProgressStep } from '../../../types';
import { AssessmentResults } from '../../assessment/AssessmentResults';
import { 
  Brain, 
  Target, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Compass,
  FileText,
  Bot,
  Search,
  Lightbulb,
  Heart,
  Sparkles,
  Users,
  TrendingUp,
  Award,
  Clock,
  Zap,
  Network,
  Briefcase,
  BookOpen,
  PenTool,
  Globe,
  Calendar,
  ArrowLeft
} from 'lucide-react';

const opportunitySeekersSteps: ProgressStep[] = [
  { id: 'skillcraft-wage-employment', label: 'Skillcraft Wage Employment Tasks', completed: false, current: true },
  { id: 'goal-setting', label: 'Goal Setting', completed: false, current: false },
  { id: 'ai-training-plan', label: 'Gen AI Custom Training Plan + WOOP Report', completed: false, current: false },
  { id: 'job-search-strategies', label: 'Job Search Strategies', completed: false, current: false },
  { id: 'networking', label: 'Networking', completed: false, current: false }
];

export const OpportunitySeekersDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('skillcraft-wage-employment');
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [goalSettingData, setGoalSettingData] = useState({
    businessIdea: '',
    timeCommitment: '',
    careerGoals: '',
    skillsToImprove: ''
  });

  const handleStepClick = (stepId: string) => {
    const completedSteps = user?.progress?.completedSteps || [];
    const stepIndex = opportunitySeekersSteps.findIndex(step => step.id === stepId);
    const currentStepIndex = opportunitySeekersSteps.findIndex(step => step.id === currentStep);
    
    if (completedSteps.includes(stepId) || stepIndex <= currentStepIndex + 1) {
      setCurrentStep(stepId);
    }
  };

  const handleStartAssessment = () => {
    setAssessmentStarted(true);
    window.open('https://www.skillcraft.app/', '_blank');
  };

  const handleToggleResults = () => {
    setShowResults(!showResults);
  };

  const completeStep = (stepId: string, nextStepId?: string) => {
    const completedSteps = user?.progress?.completedSteps || [];
    if (!completedSteps.includes(stepId)) {
      updateUser({
        progress: {
          ...user?.progress!,
          completedSteps: [...completedSteps, stepId]
        }
      });
    }
    
    if (nextStepId) {
      setCurrentStep(nextStepId);
    }
  };

  const handleBackToSelection = () => {
    navigate('/wage-employment/selection');
  };

  const handleGoalSettingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      profile: {
        ...user?.profile,
        goalSettingData
      }
    });
    completeStep('goal-setting', 'ai-training-plan');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content: chatInput.trim()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Generate mock response after delay
    setTimeout(() => {
      const responses = [
        "That's a fantastic career transition goal! Based on your experience, I can help you create a strategic plan to make that shift successfully.",
        "I understand the challenges of career change! Many professionals feel uncertain, but your skills are more transferable than you think.",
        "Excellent question! For career transitions, I recommend focusing on skill bridging and networking. Let me help you create a plan.",
        "That's a smart approach! Your background gives you unique advantages in this transition. Here's how to leverage them...",
        "I love your proactive thinking! Career transitions require strategic planning, and I'm here to guide you through each step.",
        "Great insight! Many successful career changers started with similar concerns. Let me share some proven strategies...",
        "That's exactly the right mindset! Your willingness to learn and adapt will be key to your success in this transition.",
        "Perfect timing for this question! Based on current market trends, here's what I recommend for your career pivot..."
      ];

      const luminaResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'lumina' as const,
        content: responses[Math.floor(Math.random() * responses.length)]
      };

      setChatMessages(prev => [...prev, luminaResponse]);
    }, 1000);
  };

  const handleQuickMessage = (message: string) => {
    setChatInput(message);
    // Auto-send the quick message
    setTimeout(() => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(event);
      }
    }, 100);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'skillcraft-wage-employment':
        return (
          <div className="p-8 space-y-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-primary to-neuro-primary-light neuro-animate-float">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">SkillCraft: Wage Employment Tasks</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Specialized assessment focusing on employment readiness and workplace skills.
                </p>
              </div>

              {/* Assessment Overview */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4 neuro-animate-pulse">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold neuro-text-primary">Wage Employment Focus</h3>
                      <p className="text-sm neuro-text-secondary">Workplace readiness assessment</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Workplace readiness assessment',
                      'Professional communication skills',
                      'Team collaboration abilities',
                      'Industry-specific competencies'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-3">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-4 neuro-animate-pulse" style={{ animationDelay: '0.5s' }}>
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold neuro-text-primary">Career Mapping</h3>
                      <p className="text-sm neuro-text-secondary">Skills-to-jobs alignment</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Skills-to-jobs alignment',
                      'Industry pathway exploration',
                      'Growth opportunity identification',
                      'Salary expectation guidance'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-3">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assessment Results */}
              {showResults && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold neuro-text-primary mb-6 text-center">Your Assessment Results</h3>
                  <AssessmentResults isWageEmployment={true} />
                </div>
              )}

              {/* Action Section */}
              <div className="neuro-inset p-8 rounded-neuro-lg">
                <div className="text-center">
                  <h3 className="text-xl font-bold neuro-text-primary mb-4">Ready to Assess Your Employment Readiness?</h3>
                  <p className="text-lg neuro-text-secondary mb-8">
                    Complete the specialized wage employment assessment to understand your workplace strengths and career opportunities.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {!assessmentStarted ? (
                      <button 
                        onClick={handleStartAssessment}
                        className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                      >
                        <Brain className="w-6 h-6 mr-3" />
                        <span>Start Employment Assessment</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleToggleResults}
                        className="neuro-button bg-gradient-to-br from-neuro-success to-green-400 text-white inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                      >
                        <Target className="w-6 h-6 mr-3" />
                        <span>{showResults ? 'Hide My Results' : 'View My Results'}</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => completeStep('skillcraft-wage-employment', 'goal-setting')}
                      className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                    >
                      <span>Continue to Goal Setting</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'goal-setting':
        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card max-w-3xl mx-auto hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-secondary to-pink-400 neuro-animate-float">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Goal Setting: Business Idea & Time Commitment</h2>
                <p className="text-lg neuro-text-secondary">
                  Define your career transition goals and time investment for optimal results.
                </p>
              </div>

              <form onSubmit={handleGoalSettingSubmit} className="space-y-6">
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Business Idea or Career Vision 💡
                  </label>
                  <textarea
                    value={goalSettingData.businessIdea}
                    onChange={(e) => setGoalSettingData(prev => ({ ...prev, businessIdea: e.target.value }))}
                    rows={3}
                    className="neuro-input resize-none text-lg"
                    placeholder="Describe your ideal career direction or business idea..."
                    required
                  />
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Time Commitment ⏰
                  </label>
                  <select
                    value={goalSettingData.timeCommitment}
                    onChange={(e) => setGoalSettingData(prev => ({ ...prev, timeCommitment: e.target.value }))}
                    className="neuro-select text-lg"
                    required
                  >
                    <option value="">Select your available time commitment</option>
                    <option value="5-10 hours/week">5-10 hours per week</option>
                    <option value="10-20 hours/week">10-20 hours per week</option>
                    <option value="20-30 hours/week">20-30 hours per week</option>
                    <option value="30+ hours/week">30+ hours per week (intensive)</option>
                  </select>
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Career Goals 🚀
                  </label>
                  <textarea
                    value={goalSettingData.careerGoals}
                    onChange={(e) => setGoalSettingData(prev => ({ ...prev, careerGoals: e.target.value }))}
                    rows={3}
                    className="neuro-input resize-none text-lg"
                    placeholder="What are your specific career transition goals?"
                    required
                  />
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Skills to Improve 📈
                  </label>
                  <textarea
                    value={goalSettingData.skillsToImprove}
                    onChange={(e) => setGoalSettingData(prev => ({ ...prev, skillsToImprove: e.target.value }))}
                    rows={3}
                    className="neuro-input resize-none text-lg"
                    placeholder="What skills would you like to develop or improve?"
                    required
                  />
                </div>

                <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                  <button
                    type="submit"
                    className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                  >
                    <Target className="w-6 h-6 mr-3" />
                    <span>Set My Goals</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'ai-training-plan':
        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-secondary to-pink-400 neuro-animate-float">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Gen AI Custom Training Plan + WOOP Report</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  AI-generated personalized training plan with WOOP methodology for goal achievement.
                </p>
              </div>

              {/* WOOP Framework */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <h3 className="text-xl font-bold neuro-text-primary mb-6">WOOP Framework</h3>
                  <div className="space-y-4">
                    {[
                      { letter: 'W', word: 'Wish', desc: 'Your career aspiration' },
                      { letter: 'O', word: 'Outcome', desc: 'Expected results' },
                      { letter: 'O', word: 'Obstacle', desc: 'Potential challenges' },
                      { letter: 'P', word: 'Plan', desc: 'Action strategy' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-4 hover:scale-110 transition-all duration-300">
                          <span className="text-white font-bold">{item.letter}</span>
                        </div>
                        <div>
                          <span className="font-bold neuro-text-primary">{item.word}: </span>
                          <span className="neuro-text-secondary">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <h3 className="text-xl font-bold neuro-text-primary mb-6">AI Training Plan</h3>
                  <div className="space-y-4">
                    {[
                      'Personalized skill development',
                      'Industry-specific training modules',
                      'Timeline and milestones',
                      'Progress tracking system'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-8 h-8 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-3">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                <button
                  onClick={() => completeStep('ai-training-plan', 'job-search-strategies')}
                  className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <Bot className="w-6 h-6 mr-3" />
                  <span>Generate My Training Plan</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'job-search-strategies':
        return (
          <div className="p-8">
            <div className="neuro-card">
              <div className="text-center mb-8">
                <div className="w-20 h-20 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-success to-green-400">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Job Search Strategies & Support</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Comprehensive job search toolkit including resume optimization, portals, and interview preparation.
                </p>
              </div>

              {/* Job Search Components */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-4">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold neuro-text-primary">Resume & Applications</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      'AI-powered resume optimization',
                      'Cover letter templates',
                      'Application tracking system',
                      'Portfolio development'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-neuro-primary rounded-full mr-3"></div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold neuro-text-primary">Job Search Portals</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      'LinkedIn optimization',
                      'Industry-specific job boards',
                      'Company research tools',
                      'Salary negotiation guides'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-neuro-warning rounded-full mr-3"></div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold neuro-text-primary">Interview Support</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Mock interview sessions',
                      'Common questions database',
                      'Behavioral interview prep',
                      'Technical interview practice'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-neuro-success rounded-full mr-3"></div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold neuro-text-primary">Career Pathways</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Industry transition guides',
                      'Skills gap analysis',
                      'Career progression mapping',
                      'Salary growth projections'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-neuro-secondary rounded-full mr-3"></div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => completeStep('job-search-strategies', 'networking')}
                  className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg"
                >
                  <Search className="w-6 h-6 mr-3" />
                  <span>Access Job Search Tools</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'networking':
        return (
          <div className="p-8">
            <div className="neuro-card">
              <div className="text-center mb-8">
                <div className="w-20 h-20 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-warning to-yellow-400">
                  <Network className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Professional Networking</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Build meaningful professional connections and expand your career opportunities.
                </p>
              </div>

              {/* Networking Components */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold neuro-text-primary">Professional Events</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Industry meetups and conferences',
                      'Professional development workshops',
                      'Career transition seminars',
                      'Networking mixer events'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-neuro-primary rounded-full mr-3"></div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold neuro-text-primary">Online Communities</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      'LinkedIn professional groups',
                      'Industry-specific forums',
                      'Career transition support groups',
                      'Mentorship matching platform'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-neuro-success rounded-full mr-3"></div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-4">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold neuro-text-primary">Networking Skills</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Elevator pitch development',
                      'Professional conversation skills',
                      'Follow-up strategies',
                      'Personal branding workshop'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-neuro-warning rounded-full mr-3"></div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold neuro-text-primary">Success Tracking</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Connection quality metrics',
                      'Networking ROI analysis',
                      'Opportunity pipeline tracking',
                      'Relationship management tools'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-neuro-secondary rounded-full mr-3"></div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <button
                  onClick={() => completeStep('networking')}
                  className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg"
                >
                  <Network className="w-6 h-6 mr-3" />
                  <span>Start Networking</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                
                <button
                  onClick={() => {
                    updateUser({
                      selectedTrack: 'workforce-ready',
                      profile: {
                        ...user?.profile,
                        careerLevel: 'advanced'
                      }
                    });
                    navigate('/workforce-ready/dashboard');
                  }}
                  className="neuro-button bg-gradient-to-br from-neuro-secondary to-pink-400 text-white inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg"
                >
                  <Briefcase className="w-6 h-6 mr-3" />
                  <span>Continue to Workforce Ready</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="Opportunity Seekers Track - Career Transition & Growth"
      steps={opportunitySeekersSteps.map(step => ({
        ...step,
        current: step.id === currentStep,
        completed: user?.progress?.completedSteps?.includes(step.id) || false
      }))}
      onStepClick={handleStepClick}
    >
      <div className="bg-neuro-bg">
        {/* Back Button */}
        <div className="px-8 py-6 neuro-inset">
          <button
            onClick={handleBackToSelection}
            className="neuro-button flex items-center hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Track Selection
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-8 py-8 neuro-surface">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold neuro-text-primary">
                {opportunitySeekersSteps.filter(s => user?.progress?.completedSteps?.includes(s.id)).length}/{opportunitySeekersSteps.length}
              </div>
              <div className="text-sm neuro-text-secondary">Steps Completed</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-success">87%</div>
              <div className="text-sm neuro-text-secondary">Success Rate</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-primary">6-10 weeks</div>
              <div className="text-sm neuro-text-secondary">Duration</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-secondary">Mid Level</div>
              <div className="text-sm neuro-text-secondary">Track Level</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {renderStepContent()}
      </div>
    </DashboardLayout>
  );
};
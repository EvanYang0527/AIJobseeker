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
  ArrowLeft
} from 'lucide-react';

const pathfinderSteps: ProgressStep[] = [
  { id: 'skillcraft-riasec', label: 'SkillCraft RIASEC', completed: false, current: true },
  { id: 'assessment-questionnaire', label: 'Assessment Questionnaire', completed: false, current: false },
  { id: 'career-guidance-chatbot', label: 'Career Guidance Chatbot', completed: false, current: false }
];

export const PathfinderDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('skillcraft-riasec');
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState({
    workExperience: '',
    educationLevel: '',
    careerGoals: '',
    skillsConfidence: '',
    learningStyle: '',
    timeAvailable: ''
  });

  const handleStepClick = (stepId: string) => {
    const completedSteps = user?.progress?.completedSteps || [];
    const stepIndex = pathfinderSteps.findIndex(step => step.id === stepId);
    const currentStepIndex = pathfinderSteps.findIndex(step => step.id === currentStep);
    
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

  const handleQuestionnaireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      profile: {
        ...user?.profile,
        priorExperience: questionnaireData
      }
    });
    completeStep('assessment-questionnaire', 'career-guidance-chatbot');
  };

  const handleNextToOpportunity = () => {
    updateUser({
      selectedTrack: 'opportunity-seekers',
      profile: {
        ...user?.profile,
        careerLevel: 'mid'
      }
    });
    navigate('/opportunity-seekers/dashboard');
  };

  const handleBackToSelection = () => {
    navigate('/wage-employment/selection');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'skillcraft-riasec':
        return (
          <div className="p-8 space-y-8 bg-neuro-bg">
            {/* Main Assessment Card */}
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-primary to-neuro-primary-light neuro-animate-float">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">SkillCraft-RIASEC Assessment</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Discover your cognitive abilities and career interests to map your perfect career path.
                </p>
              </div>

              {/* Combined Assessment Overview */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4 neuro-animate-pulse">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold neuro-text-primary">SkillCraft Assessment</h3>
                      <p className="text-sm neuro-text-secondary">Cognitive abilities evaluation</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Cognitive abilities evaluation',
                      'Problem-solving skills',
                      'Learning potential assessment',
                      'Working memory capacity'
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
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-4 neuro-animate-pulse" style={{ animationDelay: '0.5s' }}>
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold neuro-text-primary">RIASEC Assessment</h3>
                      <p className="text-sm neuro-text-secondary">Career interest profiling</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Realistic (hands-on work)',
                      'Investigative (research & analysis)',
                      'Artistic (creative expression)',
                      'Social (helping people)',
                      'Enterprising (leadership)',
                      'Conventional (organization)'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-3">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                <button
                  onClick={handleStartAssessment}
                  className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <Brain className="w-6 h-6 mr-3" />
                  <span>Start Assessment</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>

              {assessmentStarted && (
                <div className="mt-8 text-center neuro-inset p-6 rounded-neuro-lg">
                  <button
                    onClick={handleToggleResults}
                    className="neuro-button inline-flex items-center px-8 py-4 rounded-neuro-lg hover:scale-105 transition-all duration-300"
                  >
                    {showResults ? 'Hide Results' : 'View Sample Results'}
                    <Target className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}

              {showResults && <AssessmentResults />}
            </div>

          </div>
        );

      case 'assessment-questionnaire':
        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card max-w-3xl mx-auto hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-warning to-yellow-400 neuro-animate-float">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Prior Experience Questionnaire</h2>
                <p className="text-lg neuro-text-secondary">
                  Help us understand your background to create a personalized career development plan.
                </p>
              </div>

              <form onSubmit={handleQuestionnaireSubmit} className="space-y-6">
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Work Experience 💼
                  </label>
                  <textarea
                    value={questionnaireData.workExperience}
                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, workExperience: e.target.value }))}
                    rows={3}
                    className="neuro-input resize-none text-lg"
                    placeholder="Describe any work experience, internships, or volunteer work you've had..."
                    required
                  />
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Education Level 🎓
                  </label>
                  <select
                    value={questionnaireData.educationLevel}
                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, educationLevel: e.target.value }))}
                    className="neuro-select text-lg"
                    required
                  >
                    <option value="">Select your education level</option>
                    <option value="high-school">High School Graduate</option>
                    <option value="some-college">Some College</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Career Goals 🎯
                  </label>
                  <textarea
                    value={questionnaireData.careerGoals}
                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, careerGoals: e.target.value }))}
                    rows={3}
                    className="neuro-input resize-none text-lg"
                    placeholder="What are your career aspirations and goals?"
                    required
                  />
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Skills Confidence 💪
                  </label>
                  <select
                    value={questionnaireData.skillsConfidence}
                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, skillsConfidence: e.target.value }))}
                    className="neuro-select text-lg"
                    required
                  >
                    <option value="">How confident are you in your current skills?</option>
                    <option value="very-confident">Very confident - I know my strengths</option>
                    <option value="somewhat-confident">Somewhat confident - I have some skills</option>
                    <option value="not-confident">Not very confident - I need to develop skills</option>
                    <option value="unsure">Unsure - I don't know what skills I have</option>
                  </select>
                </div>

                <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                  <button
                    type="submit"
                    className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                  >
                    <FileText className="w-6 h-6 mr-3" />
                    <span>Submit Questionnaire</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'career-guidance-chatbot':
        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300 min-h-[800px] flex flex-col">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-secondary to-pink-400 neuro-animate-float">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Career Guidance Chatbot</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Interactive career counseling to map your skills to real-world job opportunities.
                </p>
              </div>

              {/* Interactive Chat Interface */}
              <div className="flex-1 flex flex-col neuro-inset rounded-neuro-lg overflow-hidden">
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neuro-bg-light min-h-[500px]">
                  {/* Lumina's Welcome Message */}
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-md">
                      <div className="w-10 h-10 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-sm">L</span>
                      </div>
                      <div className="neuro-surface p-4 rounded-neuro">
                        <div className="font-bold neuro-text-primary mb-1">Lumina</div>
                        <p className="neuro-text-primary">
                          Hi! I'm Lumina, your career guidance companion. Based on your SkillCraft and RIASEC results, I can help you understand how your unique abilities translate into exciting career opportunities! 🌟
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lumina's Career Mapping Message */}
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-md">
                      <div className="w-10 h-10 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-sm">L</span>
                      </div>
                      <div className="neuro-surface p-4 rounded-neuro">
                        <div className="font-bold neuro-text-primary mb-1">Lumina</div>
                        <p className="neuro-text-primary mb-3">Here's how I'll help you map your career path:</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Search className="w-4 h-4 text-neuro-primary mr-2" />
                            <span className="neuro-text-secondary">Explore career options</span>
                          </div>
                          <div className="flex items-center">
                            <Target className="w-4 h-4 text-neuro-success mr-2" />
                            <span className="neuro-text-secondary">Match skills to jobs</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-neuro-secondary mr-2" />
                            <span className="neuro-text-secondary">Plan your growth path</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-neuro-warning mr-2" />
                            <span className="neuro-text-secondary">Build confidence</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lumina's Question */}
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-md">
                      <div className="w-10 h-10 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-sm">L</span>
                      </div>
                      <div className="neuro-surface p-4 rounded-neuro">
                        <div className="font-bold neuro-text-primary mb-1">Lumina</div>
                        <p className="neuro-text-primary">
                          What would you like to explore first? I can help you understand your assessment results, explore specific careers, or discuss your next steps! 💭
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input Area */}
                <div className="border-t border-neuro-bg-dark p-6">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask Lumina about your career path..."
                      className="flex-1 neuro-input text-lg py-4"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="neuro-button-primary px-6 py-4 rounded-neuro disabled:opacity-50"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {[
                      "What careers match my results?",
                      "How do I build confidence?",
                      "What are my next steps?",
                      "Help me understand my strengths"
                    ].map((suggestion, index) => (
                      <button 
                        key={index}
                        onClick={() => handleQuickMessage(suggestion)}
                        className="neuro-surface px-4 py-2 rounded-neuro text-sm neuro-text-secondary hover:neuro-text-primary transition-colors"
                      >
                        "{suggestion}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Complete Step Button */}
              <div className="text-center mt-8 neuro-inset p-8 rounded-neuro-lg">
                <button
                  onClick={() => completeStep('career-guidance-chatbot')}
                  className="neuro-button-primary inline-flex items-center px-12 py-6 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <CheckCircle className="w-6 h-6 mr-3" />
                  <span>Complete Career Guidance</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'next-opportunity':
        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card max-w-4xl mx-auto hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-success to-green-400 neuro-animate-float">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Ready for the Next Level?</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  You've completed the Pathfinder track! Ready to advance to Opportunity Seekers for more specialized training?
                </p>
              </div>

              <div className="neuro-surface p-10 rounded-neuro-lg mb-8 hover:shadow-neuro-hover transition-all duration-300">
                <h3 className="text-2xl font-bold neuro-text-primary mb-6 text-center">Your Pathfinder Journey Complete! 🎉</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold neuro-text-primary mb-4">What You've Accomplished ✅</h4>
                    <div className="space-y-3">
                      {[
                        'Discovered your cognitive strengths',
                        'Identified career interests (RIASEC)',
                        'Mapped prior experience',
                        'Built career confidence',
                        'Created development roadmap'
                      ].map((achievement, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 h-8 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-3">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="neuro-text-secondary">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold neuro-text-primary mb-4">Next: Opportunity Seekers 🔍</h4>
                    <div className="space-y-3">
                      {[
                        'Advanced skills training',
                        'Industry certifications',
                        'Professional networking',
                        'Job search strategies',
                        'Interview preparation'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 h-8 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-3">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <span className="neuro-text-secondary">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                <button
                  onClick={handleNextToOpportunity}
                  className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <Search className="w-6 h-6 mr-3" />
                  <span>Continue to Opportunity Seekers</span>
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
      title="Pathfinder Track - Entry Level Career Development"
      steps={pathfinderSteps.map(step => ({
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
                {pathfinderSteps.filter(s => user?.progress?.completedSteps?.includes(s.id)).length}/{pathfinderSteps.length}
              </div>
              <div className="text-sm neuro-text-secondary">Steps Completed</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-success">92%</div>
              <div className="text-sm neuro-text-secondary">Success Rate</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-primary">8-12 weeks</div>
              <div className="text-sm neuro-text-secondary">Duration</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-secondary">Entry Level</div>
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
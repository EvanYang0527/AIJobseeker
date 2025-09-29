import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { GoalSetting } from './GoalSetting';
import { ProgressStep } from '../../../types';
import { AssessmentResults } from '../../assessment/AssessmentResults';
import { 
  Brain, 
  Target, 
  MessageCircle, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Lightbulb,
  Users,
  TrendingUp,
  Building2,
  Zap,
  Network,
  FileText,
  Calendar,
  DollarSign,
  Briefcase,
  Globe,
  Heart,
  Coffee,
  Sparkles,
  Download,
  ExternalLink,
  BookOpen
} from 'lucide-react';

const entrepreneurSteps: ProgressStep[] = [
  { id: 'skillcraft-entrepreneurship-tasks', label: 'SkillCraft Entrepreneurship Tasks', completed: false, current: true },
  { id: 'assessment-questionnaire', label: 'Assessment Questionnaire', completed: false, current: false },
  { id: 'goal-setting', label: 'Goal Setting', completed: false, current: false },
  { id: 'business-plan-creation', label: 'Business Plan Creation', completed: false, current: false },
  { id: 'ai-mentor-program', label: 'AI Mentor Program', completed: false, current: false },
  { id: 'networking-funding', label: 'Networking and Funding Resources', completed: false, current: false },
  { id: 'skills-passport-certificate', label: 'Skills Passport Certificate', completed: false, current: false }
];

export const EntrepreneurDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState('skillcraft-entrepreneurship-tasks');
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'lumina' as const,
      content: "Welcome to your AI Business Mentor! I'm here to help you with business strategy, market analysis, team building, and funding guidance. What would you like to discuss today? 🚀"
    },
    {
      id: '2', 
      sender: 'lumina' as const,
      content: "I can help you with business strategy development, market analysis and validation, team building and leadership, and funding and investment guidance. What aspect of your business would you like to explore first?"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleStepClick = (stepId: string) => {
    const completedSteps = user?.progress?.completedSteps || [];
    const stepIndex = entrepreneurSteps.findIndex(step => step.id === stepId);
    const currentStepIndex = entrepreneurSteps.findIndex(step => step.id === currentStep);
    
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
        "That's an excellent question! Based on your business idea, I recommend focusing on market validation first. Have you conducted any customer interviews yet?",
        "Great point! For funding, I suggest starting with bootstrapping and then exploring angel investors. Your business model shows strong potential for investment.",
        "I love your entrepreneurial spirit! Let's break this down into actionable steps. What's your biggest challenge right now?",
        "Fantastic! Based on successful entrepreneurs I've mentored, here's what I recommend as your next priority...",
        "That's a smart approach! Let me help you create a strategic plan for that. What timeline are you working with?",
        "Excellent question! Many successful entrepreneurs face this same challenge. Here's how to tackle it systematically...",
        "I can definitely help with that! Let's start by understanding your target market better. Who is your ideal customer?",
        "That's a crucial business decision! Based on market trends, I recommend considering these factors..."
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
      case 'skillcraft-entrepreneurship-tasks':
        return (
          <div className="p-8 space-y-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-primary to-neuro-primary-light neuro-animate-float">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">SkillCraft Entrepreneurship Tasks</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Comprehensive cognitive assessment designed specifically for entrepreneurial success and business development.
                </p>
              </div>

              {/* Assessment Components */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { title: 'Cognitive Abilities', icon: Brain, color: 'from-neuro-primary to-neuro-primary-light', items: ['Problem-solving skills', 'Creative thinking', 'Decision-making speed', 'Pattern recognition'] },
                  { title: 'Risk Assessment', icon: Target, color: 'from-neuro-warning to-yellow-400', items: ['Risk tolerance evaluation', 'Decision under uncertainty', 'Strategic thinking', 'Opportunity recognition'] },
                  { title: 'Leadership Potential', icon: Users, color: 'from-neuro-success to-green-400', items: ['Team leadership skills', 'Communication abilities', 'Influence and persuasion', 'Emotional intelligence'] }
                ].map((component, index) => {
                  const Icon = component.icon;
                  return (
                    <div key={index} className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className={`w-16 h-16 neuro-icon bg-gradient-to-br ${component.color} mr-4 neuro-animate-pulse`} style={{ animationDelay: `${index * 0.2}s` }}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold neuro-text-primary">{component.title}</h3>
                          <p className="text-sm neuro-text-secondary">Assessment module</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {component.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center">
                            <div className="w-3 h-3 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-3">
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                            <span className="neuro-text-secondary text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Assessment Results */}
              {showResults && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold neuro-text-primary mb-6 text-center">Your Entrepreneurship Assessment Results</h3>
                  <AssessmentResults />
                </div>
              )}

              {/* Action Section */}
              <div className="neuro-inset p-8 rounded-neuro-lg">
                <div className="text-center">
                  <h3 className="text-xl font-bold neuro-text-primary mb-4">Ready to Discover Your Entrepreneurial Potential?</h3>
                  <p className="text-lg neuro-text-secondary mb-8">
                    Complete the comprehensive SkillCraft assessment to understand your entrepreneurial strengths and business development capabilities.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {!assessmentStarted ? (
                      <button 
                        onClick={handleStartAssessment}
                        className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                      >
                        <Brain className="w-6 h-6 mr-3" />
                        <span>Start Entrepreneurship Assessment</span>
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
                      onClick={() => completeStep('skillcraft-entrepreneurship-tasks', 'assessment-questionnaire')}
                      className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg hover:scale-105 transition-all duration-300"
                    >
                      <span>Continue to Assessment Questionnaire</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
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
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Assessment Questionnaire</h2>
                <p className="text-lg neuro-text-secondary">
                  Help us understand your entrepreneurial background and experience.
                </p>
              </div>

              <div className="space-y-6">
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Previous Business Experience 💼
                  </label>
                  <textarea
                    rows={3}
                    className="neuro-input resize-none text-lg"
                    placeholder="Describe any previous business or entrepreneurial experience..."
                  />
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Risk Tolerance 📊
                  </label>
                  <select className="neuro-select text-lg">
                    <option value="">Select your risk tolerance level</option>
                    <option value="low">Low - Prefer stable, predictable outcomes</option>
                    <option value="moderate">Moderate - Comfortable with calculated risks</option>
                    <option value="high">High - Thrive on uncertainty and challenges</option>
                  </select>
                </div>

                <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                  <button
                    onClick={() => completeStep('assessment-questionnaire', 'goal-setting')}
                    className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg hover:scale-105 transition-all duration-300"
                  >
                    <FileText className="w-6 h-6 mr-3" />
                    <span>Submit Assessment</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
                
                <div className="text-center mt-6">
                  <div className="neuro-inset p-4 rounded-neuro">
                    <p className="text-sm neuro-text-muted">
                      💡 <strong>Pro Tip:</strong> Complete the SkillCraft assessment first to get personalized business recommendations and unlock advanced mentorship features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'goal-setting':
        return <GoalSetting onComplete={() => completeStep('goal-setting', 'business-plan-creation')} />;

      case 'business-plan-creation':
        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-secondary to-pink-400 neuro-animate-float">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Business Plan Creation</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Comprehensive business plan development using the WOOP framework with AI-powered insights.
                </p>
              </div>

              {/* WOOP Framework Implementation */}
              <div className="space-y-8">
                {/* Wish Section */}
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-4">
                      <span className="text-white font-bold text-2xl">W</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold neuro-text-primary">Wish</h3>
                      <p className="neuro-text-secondary">Your business vision and aspirations</p>
                    </div>
                  </div>
                  
                  <div className="neuro-inset p-6 rounded-neuro mb-4">
                    <h4 className="font-bold neuro-text-primary mb-3">Wish Statement</h4>
                    <p className="neuro-text-primary text-lg mb-4">
                      "I want to create an AI-powered customer service platform that helps small businesses provide 24/7 support to their customers, increasing satisfaction and reducing operational costs."
                    </p>
                    <div className="neuro-surface p-4 rounded-neuro">
                      <h5 className="font-semibold neuro-text-primary mb-2">Rationale</h5>
                      <p className="neuro-text-secondary">
                        This addresses a critical pain point for small businesses who can't afford full-time customer service teams, while leveraging emerging AI technology to create a scalable solution.
                      </p>
                    </div>
                  </div>
                  
                  <div className="neuro-surface p-4 rounded-neuro bg-gradient-to-r from-neuro-primary/10 to-neuro-primary-light/10">
                    <h5 className="font-semibold neuro-text-primary mb-2">💡 Clarifying Question</h5>
                    <p className="neuro-text-secondary">
                      What specific industries or business sizes would you focus on initially to validate your solution?
                    </p>
                  </div>
                </div>

                {/* Outcome Section */}
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4">
                      <span className="text-white font-bold text-2xl">O</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold neuro-text-primary">Outcome</h3>
                      <p className="neuro-text-secondary">Expected positive results and success metrics</p>
                    </div>
                  </div>
                  
                  <div className="neuro-inset p-6 rounded-neuro mb-4">
                    <h4 className="font-bold neuro-text-primary mb-3">Positive Outcome</h4>
                    <p className="neuro-text-primary text-xl font-semibold mb-4 text-center bg-gradient-to-r from-neuro-success to-green-400 bg-clip-text text-transparent">
                      "Empowering 1000+ small businesses with affordable AI customer service"
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="font-semibold neuro-text-primary mb-3">Success Metrics</h5>
                        <div className="space-y-2">
                          {[
                            "100 paying customers within 12 months",
                            "$50K monthly recurring revenue by year 2",
                            "95% customer satisfaction rating",
                            "50% reduction in customer service costs for clients",
                            "24/7 response time under 30 seconds"
                          ].map((metric, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-6 h-6 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-3">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                              <span className="neuro-text-secondary">{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="neuro-surface p-4 rounded-neuro">
                        <h5 className="font-semibold neuro-text-primary mb-2">Rationale</h5>
                        <p className="neuro-text-secondary">
                          These outcomes focus on measurable business impact while ensuring customer value creation. The metrics balance growth targets with quality service delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="neuro-surface p-4 rounded-neuro bg-gradient-to-r from-neuro-success/10 to-green-400/10">
                    <h5 className="font-semibold neuro-text-primary mb-2">💡 Clarifying Question</h5>
                    <p className="neuro-text-secondary">
                      How will you measure customer satisfaction and what specific cost reduction targets are realistic for your target market?
                    </p>
                  </div>
                </div>

                {/* Obstacles Section */}
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-4">
                      <span className="text-white font-bold text-2xl">O</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold neuro-text-primary">Obstacles</h3>
                      <p className="neuro-text-secondary">Potential challenges and barriers to overcome</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-4">
                    <div className="neuro-inset p-6 rounded-neuro">
                      <h4 className="font-bold neuro-text-primary mb-4 flex items-center">
                        <div className="w-8 h-8 neuro-icon bg-gradient-to-br from-neuro-error to-red-400 mr-3">
                          <span className="text-white font-bold text-sm">I</span>
                        </div>
                        Internal Obstacles
                      </h4>
                      <div className="space-y-2">
                        {[
                          "Limited technical AI/ML expertise",
                          "Insufficient startup capital",
                          "Lack of business development experience",
                          "Time management with full-time commitments"
                        ].map((obstacle, index) => (
                          <div key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-neuro-error rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            <span className="neuro-text-secondary text-sm">{obstacle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="neuro-inset p-6 rounded-neuro">
                      <h4 className="font-bold neuro-text-primary mb-4 flex items-center">
                        <div className="w-8 h-8 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-3">
                          <span className="text-white font-bold text-sm">E</span>
                        </div>
                        External Obstacles
                      </h4>
                      <div className="space-y-2">
                        {[
                          "Competitive market with established players",
                          "Economic uncertainty affecting small business spending",
                          "Regulatory compliance for AI and data privacy",
                          "Customer education about AI benefits"
                        ].map((obstacle, index) => (
                          <div key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-neuro-warning rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            <span className="neuro-text-secondary text-sm">{obstacle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="neuro-inset p-6 rounded-neuro">
                      <h4 className="font-bold neuro-text-primary mb-4 flex items-center">
                        <div className="w-8 h-8 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-3">
                          <span className="text-white font-bold text-sm">C</span>
                        </div>
                        Capability Gaps
                      </h4>
                      <div className="space-y-2">
                        {[
                          "Machine learning model development",
                          "Enterprise sales and marketing",
                          "Customer success management",
                          "Scalable infrastructure design"
                        ].map((gap, index) => (
                          <div key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-neuro-secondary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            <span className="neuro-text-secondary text-sm">{gap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="neuro-surface p-4 rounded-neuro mb-4">
                    <h5 className="font-semibold neuro-text-primary mb-2">Rationale</h5>
                    <p className="neuro-text-secondary">
                      These obstacles represent the most critical barriers that could prevent business success. Addressing them proactively through planning and skill development is essential for sustainable growth.
                    </p>
                  </div>
                  
                  <div className="neuro-surface p-4 rounded-neuro bg-gradient-to-r from-neuro-warning/10 to-yellow-400/10">
                    <h5 className="font-semibold neuro-text-primary mb-2">💡 Clarifying Question</h5>
                    <p className="neuro-text-secondary">
                      Which of these obstacles do you feel most confident about overcoming, and which ones would you need the most support with?
                    </p>
                  </div>
                </div>

                {/* Plan Section */}
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-4">
                      <span className="text-white font-bold text-2xl">P</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold neuro-text-primary">Plan</h3>
                      <p className="neuro-text-secondary">Comprehensive action roadmap and business strategy</p>
                    </div>
                  </div>
                  
                  {/* Roadmap Steps */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold neuro-text-primary mb-6">Roadmap Steps</h4>
                    <div className="space-y-6">
                      {[
                        {
                          step: "Market Validation & MVP Development",
                          actions: [
                            "Conduct 50 customer interviews with small business owners",
                            "Build basic AI chatbot prototype using existing APIs",
                            "Test with 5 pilot customers for 30 days",
                            "Gather feedback and iterate on core features"
                          ],
                          measurement: "Customer feedback scores >4/5, 80% would recommend",
                          timeline: "Months 1-3"
                        },
                        {
                          step: "Product Development & Team Building",
                          actions: [
                            "Hire AI/ML developer and UX designer",
                            "Develop proprietary natural language processing",
                            "Build scalable cloud infrastructure",
                            "Create comprehensive onboarding system"
                          ],
                          measurement: "Platform handles 1000+ concurrent conversations",
                          timeline: "Months 4-8"
                        },
                        {
                          step: "Go-to-Market & Scale",
                          actions: [
                            "Launch digital marketing campaigns",
                            "Establish partnership with business associations",
                            "Implement customer success program",
                            "Expand to 3 additional market segments"
                          ],
                          measurement: "100 paying customers, $50K MRR",
                          timeline: "Months 9-12"
                        }
                      ].map((roadmapStep, index) => (
                        <div key={index} className="neuro-inset p-6 rounded-neuro">
                          <div className="flex items-start justify-between mb-4">
                            <h5 className="text-lg font-bold neuro-text-primary">{roadmapStep.step}</h5>
                            <span className="neuro-surface px-3 py-1 rounded-neuro-sm text-sm font-semibold text-neuro-primary">
                              {roadmapStep.timeline}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h6 className="font-semibold neuro-text-primary mb-3">Actions</h6>
                              <div className="space-y-2">
                                {roadmapStep.actions.map((action, actionIndex) => (
                                  <div key={actionIndex} className="flex items-start">
                                    <div className="w-4 h-4 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-3 mt-1">
                                      <div className="w-1 h-1 bg-white rounded-full"></div>
                                    </div>
                                    <span className="neuro-text-secondary text-sm">{action}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h6 className="font-semibold neuro-text-primary mb-3">Success Measurement</h6>
                              <div className="neuro-surface p-3 rounded-neuro">
                                <span className="neuro-text-secondary text-sm">{roadmapStep.measurement}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Business Plan Considerations */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold neuro-text-primary mb-6">Business Plan Considerations</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="neuro-inset p-6 rounded-neuro">
                        <h5 className="font-bold neuro-text-primary mb-4 flex items-center">
                          <DollarSign className="w-5 h-5 text-neuro-warning mr-2" />
                          Budget Considerations
                        </h5>
                        <div className="space-y-2">
                          {[
                            "Initial development: $75K-$100K",
                            "Monthly operational costs: $15K-$25K",
                            "Marketing budget: $20K-$30K",
                            "Emergency fund: 6 months runway"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-neuro-warning rounded-full mr-3 mt-2 flex-shrink-0"></span>
                              <span className="neuro-text-secondary text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="neuro-inset p-6 rounded-neuro">
                        <h5 className="font-bold neuro-text-primary mb-4 flex items-center">
                          <Building2 className="w-5 h-5 text-neuro-primary mr-2" />
                          Operations Considerations
                        </h5>
                        <div className="space-y-2">
                          {[
                            "Cloud infrastructure scaling strategy",
                            "24/7 system monitoring and support",
                            "Data security and privacy compliance",
                            "Customer onboarding automation"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-neuro-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                              <span className="neuro-text-secondary text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="neuro-inset p-6 rounded-neuro">
                        <h5 className="font-bold neuro-text-primary mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 text-neuro-success mr-2" />
                          Go-to-Market Considerations
                        </h5>
                        <div className="space-y-2">
                          {[
                            "Content marketing and SEO strategy",
                            "Partnership with business consultants",
                            "Free trial and freemium pricing model",
                            "Industry conference and trade show presence"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-neuro-success rounded-full mr-3 mt-2 flex-shrink-0"></span>
                              <span className="neuro-text-secondary text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Learning Plan */}
                  <div className="mb-6">
                    <h4 className="text-xl font-bold neuro-text-primary mb-6">Learning Plan</h4>
                    <div className="space-y-6">
                      {[
                        {
                          skill: "Machine Learning & AI Development",
                          why_needed: "Essential for building and improving the AI customer service algorithms",
                          course_list: [
                            {
                              title: "Machine Learning Specialization",
                              provider: "Coursera (Stanford)",
                              url: "https://coursera.org/specializations/machine-learning"
                            },
                            {
                              title: "Natural Language Processing with Python",
                              provider: "Udemy",
                              url: "https://udemy.com/course/nlp-natural-language-processing-with-python"
                            }
                          ],
                          fallback_queries: [
                            {"knowledge": "AI chatbot development tutorials"}
                          ]
                        },
                        {
                          skill: "Business Development & Sales",
                          why_needed: "Critical for customer acquisition and revenue generation",
                          course_list: [
                            {
                              title: "Sales and Marketing for Startups",
                              provider: "edX (MIT)",
                              url: "https://edx.org/course/entrepreneurship-and-innovation"
                            },
                            {
                              title: "B2B Sales Fundamentals",
                              provider: "LinkedIn Learning",
                              url: "https://linkedin.com/learning/b2b-sales-fundamentals"
                            }
                          ],
                          fallback_queries: [
                            {"knowledge": "Small business sales strategies"}
                          ]
                        },
                        {
                          skill: "Financial Management & Fundraising",
                          why_needed: "Required for managing cash flow and securing investment",
                          course_list: [
                            {
                              title: "Startup Financial Modeling",
                              provider: "Udacity",
                              url: "https://udacity.com/course/startup-financial-modeling"
                            },
                            {
                              title: "Venture Capital and Startup Funding",
                              provider: "Coursera (University of Pennsylvania)",
                              url: "https://coursera.org/learn/wharton-entrepreneurship-financing"
                            }
                          ],
                          fallback_queries: [
                            {"knowledge": "Startup funding strategies"}
                          ]
                        }
                      ].map((learningItem, index) => (
                        <div key={index} className="neuro-inset p-6 rounded-neuro">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h5 className="text-lg font-bold neuro-text-primary mb-2">{learningItem.skill}</h5>
                              <p className="neuro-text-secondary text-sm">{learningItem.why_needed}</p>
                            </div>
                            <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h6 className="font-semibold neuro-text-primary mb-3">Recommended Courses</h6>
                              <div className="space-y-3">
                                {learningItem.course_list.map((course, courseIndex) => (
                                  <div key={courseIndex} className="neuro-surface p-4 rounded-neuro flex items-center justify-between">
                                    <div>
                                      <div className="font-semibold neuro-text-primary">{course.title}</div>
                                      <div className="text-sm neuro-text-secondary">{course.provider}</div>
                                    </div>
                                    <a 
                                      href={course.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="neuro-button text-sm px-4 py-2 rounded-neuro flex items-center"
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      View Course
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h6 className="font-semibold neuro-text-primary mb-2">Alternative Learning</h6>
                              <div className="neuro-surface p-3 rounded-neuro">
                                <span className="neuro-text-secondary text-sm">
                                  Search for: {learningItem.fallback_queries[0].knowledge}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                <button
                  onClick={() => completeStep('business-plan-creation', 'ai-mentor-program')}
                  className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <FileText className="w-6 h-6 mr-3" />
                  <span>Create Business Plan</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'ai-mentor-program':
        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-warning to-yellow-400 neuro-animate-float">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Lumina - AI Business Mentor</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Interactive AI mentorship providing personalized guidance throughout your entrepreneurial journey.
                </p>
              </div>

              {/* Interactive Chat Interface */}
              <div className="neuro-inset rounded-neuro-lg overflow-hidden mb-8">
                {/* Chat Header */}
                <div className="neuro-surface p-4 border-b border-neuro-bg-dark">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-3">
                        <span className="font-bold text-white text-lg">L</span>
                      </div>
                      <div>
                        <h3 className="font-bold neuro-text-primary">Lumina</h3>
                        <p className="text-sm neuro-text-secondary">AI Business Mentor</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-neuro-success rounded-full neuro-animate-pulse"></div>
                      <span className="text-sm neuro-text-secondary">Online</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4 bg-neuro-bg-light">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md ${
                          message.sender === 'user'
                            ? 'neuro-surface ml-4'
                            : 'flex items-start'
                        }`}
                      >
                        {message.sender === 'lumina' && (
                          <div className="w-10 h-10 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-3 flex-shrink-0">
                            <span className="text-white font-bold text-sm">L</span>
                          </div>
                        )}
                        <div className={`p-4 rounded-neuro ${
                          message.sender === 'user' 
                            ? 'neuro-surface' 
                            : 'neuro-surface'
                        }`}>
                          {message.sender === 'lumina' && (
                            <div className="font-bold neuro-text-primary mb-1">Lumina</div>
                          )}
                          <p className="neuro-text-primary leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Lumina's Question */}
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-md">
                      <div className="w-10 h-10 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-sm">L</span>
                      </div>
                      <div className="neuro-surface p-4 rounded-neuro">
                        <div className="font-bold neuro-text-primary mb-1">Lumina</div>
                        <p className="neuro-text-primary">
                          What aspect of your business would you like to focus on today? I can help you refine your business plan, explore funding options, or work through any challenges you're facing! 💡
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-6 border-t border-neuro-bg-dark">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask Lumina about your business strategy..."
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
                      "Help me validate my business idea",
                      "What funding options do I have?",
                      "How do I build a strong team?",
                      "Create my business plan"
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

              <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                <button
                  onClick={() => completeStep('ai-mentor-program', 'networking-funding')}
                  className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  <span>Continue with Lumina</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'networking-funding':
        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-success to-green-400 neuro-animate-float">
                  <Network className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Networking and Funding Resources</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Connect with investors, mentors, and funding opportunities to grow your business.
                </p>
              </div>

              {/* Launch Support Components */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { title: 'Legal & Compliance', icon: FileText, color: 'from-neuro-primary to-neuro-primary-light', items: ['Business registration', 'Legal structure setup', 'Compliance guidance', 'Contract templates'] },
                  { title: 'Funding & Finance', icon: DollarSign, color: 'from-neuro-warning to-yellow-400', items: ['Funding strategy', 'Investor pitch deck', 'Financial projections', 'Grant applications'] },
                  { title: 'Marketing & Sales', icon: TrendingUp, color: 'from-neuro-secondary to-pink-400', items: ['Brand development', 'Digital marketing', 'Sales strategies', 'Customer acquisition'] },
                  { title: 'Operations Setup', icon: Building2, color: 'from-neuro-success to-green-400', items: ['Business processes', 'Technology stack', 'Team building', 'Vendor management'] },
                  { title: 'Networking Events', icon: Network, color: 'from-purple-500 to-purple-400', items: ['Entrepreneur meetups', 'Investor events', 'Industry conferences', 'Peer connections'] },
                  { title: 'Ongoing Support', icon: Heart, color: 'from-pink-500 to-pink-400', items: ['Monthly check-ins', 'Crisis management', 'Growth planning', 'Exit strategies'] }
                ].map((component, index) => {
                  const Icon = component.icon;
                  return (
                    <div key={index} className="neuro-surface p-6 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className={`w-14 h-14 neuro-icon bg-gradient-to-br ${component.color} mr-3 neuro-animate-pulse`} style={{ animationDelay: `${index * 0.1}s` }}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold neuro-text-primary">{component.title}</h3>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {component.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center">
                            <div className="w-2 h-2 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-3">
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                            <span className="neuro-text-secondary text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                <button
                  onClick={() => completeStep('networking-funding', 'skills-passport-certificate')}
                  className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <Network className="w-6 h-6 mr-3" />
                  <span>Access Funding Resources</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'skills-passport-certificate':
        return (
          <div className="p-8 space-y-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-success to-green-400 neuro-animate-float border-4 border-neuro-warning">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold neuro-text-primary mb-4">Congratulations!</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  You've successfully completed the Entrepreneurship track and earned your Business Development Skills Passport Certificate!
                </p>
              </div>

              {/* Achievement Summary */}
              <div className="neuro-surface p-8 rounded-neuro-lg mb-8 hover:shadow-neuro-hover transition-all duration-300">
                <h3 className="text-2xl font-bold neuro-text-primary mb-6 text-center">Your Entrepreneurial Journey Complete! 🎉</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold neuro-text-primary mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-neuro-success mr-3" />
                      Business Skills Mastered
                    </h4>
                    <div className="space-y-3">
                      {[
                        'Entrepreneurial mindset development',
                        'Business plan creation',
                        'Financial planning & projections',
                        'Market research & analysis',
                        'Leadership & team building',
                        'Funding strategy development'
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
                    <h4 className="text-xl font-bold neuro-text-primary mb-4 flex items-center">
                      <Star className="w-6 h-6 text-neuro-warning mr-3" />
                      Business Launch Ready
                    </h4>
                    <div className="space-y-3">
                      {[
                        'Validated business concept',
                        'Comprehensive business plan',
                        'Funding strategy in place',
                        'Mentor network established',
                        'Legal structure planned',
                        'Market entry strategy ready'
                      ].map((status, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 h-8 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-3">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <span className="neuro-text-secondary">{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Passport Certificate */}
              <div className="neuro-inset p-8 rounded-neuro-lg mb-8 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 border-4 border-neuro-success">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-3xl font-bold neuro-text-primary mb-6">Business Development Skills Passport</h3>
                  <p className="text-lg neuro-text-secondary mb-8">
                    Your official certification of entrepreneurial readiness and business development competency.
                  </p>
                  
                  <div className="neuro-surface p-8 rounded-neuro-lg mb-8 border-4 border-neuro-warning">
                    <div className="text-center">
                      <div className="w-20 h-20 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-success to-green-400">
                        <Building2 className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold neuro-text-primary mb-4">Certificate of Completion</h4>
                      <p className="text-lg neuro-text-secondary mb-4">This certifies that</p>
                      <p className="text-2xl font-bold neuro-text-primary mb-4">{user?.fullName}</p>
                      <p className="text-lg neuro-text-secondary mb-4">has successfully completed the</p>
                      <p className="text-2xl font-bold neuro-text-primary mb-4">Entrepreneurship Business Development Program</p>
                      <p className="text-lg neuro-text-secondary">Issued on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <button className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg hover:scale-105 transition-all duration-300">
                    <Download className="w-6 h-6 mr-3" />
                    <span>Download Certificate</span>
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>

              {/* Next Steps */}
              <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                <h3 className="text-2xl font-bold neuro-text-primary mb-6 text-center">What's Next?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                    <div className="w-16 h-16 neuro-icon mx-auto mb-4 bg-gradient-to-br from-neuro-primary to-neuro-primary-light">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold neuro-text-primary mb-2">Launch Your Business</h4>
                    <p className="neuro-text-secondary">Execute your business plan</p>
                  </div>
                  <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                    <div className="w-16 h-16 neuro-icon mx-auto mb-4 bg-gradient-to-br from-neuro-secondary to-pink-400">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold neuro-text-primary mb-2">Secure Funding</h4>
                    <p className="neuro-text-secondary">Apply for grants and investments</p>
                  </div>
                  <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                    <div className="w-16 h-16 neuro-icon mx-auto mb-4 bg-gradient-to-br from-neuro-success to-green-400">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold neuro-text-primary mb-2">Mentor Others</h4>
                    <p className="neuro-text-secondary">Share your entrepreneurial journey</p>
                  </div>
                </div>
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
      title="Entrepreneurship Track - Business Development Journey"
      steps={entrepreneurSteps.map(step => ({
        ...step,
        current: step.id === currentStep,
        completed: user?.progress?.completedSteps?.includes(step.id) || false
      }))}
      onStepClick={handleStepClick}
    >
      <div className="bg-neuro-bg">
        {/* Quick Stats Bar */}
        <div className="px-8 py-8 neuro-surface">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold neuro-text-primary">
                {entrepreneurSteps.filter(s => user?.progress?.completedSteps?.includes(s.id)).length}/{entrepreneurSteps.length}
              </div>
              <div className="text-sm neuro-text-secondary">Steps Completed</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-success">87%</div>
              <div className="text-sm neuro-text-secondary">Success Rate</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-primary">10-14 weeks</div>
              <div className="text-sm neuro-text-secondary">Duration</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-secondary">Business Track</div>
              <div className="text-sm neuro-text-secondary">Track Type</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {renderStepContent()}
      </div>
    </DashboardLayout>
  );
};
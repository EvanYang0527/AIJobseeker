import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { ProgressStep } from '../../../types';
import { 
  BookOpen, 
  Target, 
  Network, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  MessageCircle,
  Globe,
  FileText,
  Zap,
  Coffee,
  Building2,
  Phone,
  Mail,
  Linkedin,
  Download,
  ExternalLink,
  Sparkles,
  Heart,
  Lightbulb,
  ArrowLeft,
  Clock,
  Search,
  Plus
} from 'lucide-react';

const workforceReadySteps: ProgressStep[] = [
  { id: 'e-learning-resources', label: 'E-learning Resources & Pathways', completed: false, current: true },
  { id: 'job-matching', label: 'Job Matching', completed: false, current: false },
  { id: 'advanced-networking', label: 'Advanced Networking Resources', completed: false, current: false },
  { id: 'completion-certificate', label: 'Skills Passport Certificate', completed: false, current: false }
];

export const WorkforceReadyDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('e-learning-resources');

  const handleStepClick = (stepId: string) => {
    const completedSteps = user?.progress?.completedSteps || [];
    const stepIndex = workforceReadySteps.findIndex(step => step.id === stepId);
    const currentStepIndex = workforceReadySteps.findIndex(step => step.id === currentStep);
    
    if (completedSteps.includes(stepId) || stepIndex <= currentStepIndex + 1) {
      setCurrentStep(stepId);
    }
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'e-learning-resources':
        return (
          <div className="p-8 space-y-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-primary to-neuro-primary-light neuro-animate-float">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">E-learning Resources & Pathways</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Advanced learning modules and career pathway guidance for workforce-ready professionals.
                </p>
              </div>

              {/* Learning Categories */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4 neuro-animate-pulse">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold neuro-text-primary">Advanced Skills Training</h3>
                      <p className="text-sm neuro-text-secondary">Professional development modules</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      'Leadership development programs',
                      'Industry-specific certifications',
                      'Advanced technical skills',
                      'Project management training'
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
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-4 neuro-animate-pulse" style={{ animationDelay: '0.5s' }}>
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold neuro-text-primary">Career Pathways</h3>
                      <p className="text-sm neuro-text-secondary">Strategic career advancement</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      'Executive leadership tracks',
                      'Specialized career transitions',
                      'Industry expertise development',
                      'Professional certification paths'
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

              {/* Pathways Access */}
              <div className="neuro-inset p-8 rounded-neuro-lg mb-8">
                <div className="text-center">
                  <div className="w-20 h-20 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-warning to-yellow-400">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold neuro-text-primary mb-4">Explore Career Pathways</h3>
                  <p className="text-lg neuro-text-secondary mb-8 max-w-2xl mx-auto">
                    Access detailed career pathway guides and advanced learning resources tailored to your experience level.
                  </p>
                  
                  <button className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300">
                    <Target className="w-6 h-6 mr-3" />
                    <span>Access Pathways</span>
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => completeStep('e-learning-resources', 'job-matching')}
                  className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <BookOpen className="w-6 h-6 mr-3" />
                  <span>Continue to Job Matching</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'job-matching':
        return (
          <div className="p-8 space-y-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-warning to-yellow-400 neuro-animate-float">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Advanced Job Matching</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  AI-powered job matching system connecting you with premium opportunities.
                </p>
              </div>

              {/* Job Matching Features */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-4 neuro-animate-pulse">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold neuro-text-primary">Smart Matching</h3>
                      <p className="text-sm neuro-text-secondary">AI-powered recommendations</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      'AI-powered job recommendations',
                      'Skills-based opportunity matching',
                      'Salary optimization suggestions',
                      'Company culture fit analysis'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-3">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <span className="neuro-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4 neuro-animate-pulse" style={{ animationDelay: '0.5s' }}>
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold neuro-text-primary">Premium Access</h3>
                      <p className="text-sm neuro-text-secondary">Executive-level opportunities</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      'Executive-level positions',
                      'Hidden job market access',
                      'Direct employer connections',
                      'Exclusive recruitment events'
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
              </div>

              <div className="text-center neuro-inset p-8 rounded-neuro-lg">
                <button
                  onClick={() => completeStep('job-matching', 'advanced-networking')}
                  className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <Target className="w-6 h-6 mr-3" />
                  <span>Start Job Matching</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'advanced-networking':
        return (
          <div className="p-8 space-y-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-secondary to-pink-400 neuro-animate-float">
                  <Network className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Advanced Networking Resources</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Executive-level networking opportunities and strategic relationship building.
                </p>
              </div>

              {/* Advanced Networking Components */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { 
                    title: 'Executive Events', 
                    icon: Calendar, 
                    color: 'from-neuro-primary to-neuro-primary-light', 
                    items: ['C-suite networking dinners', 'Industry leadership summits', 'Board member introductions', 'Executive mentorship programs'] 
                  },
                  { 
                    title: 'Strategic Connections', 
                    icon: Users, 
                    color: 'from-neuro-success to-green-400', 
                    items: ['Industry thought leaders', 'Investment community access', 'Government liaison contacts', 'International business networks'] 
                  },
                  { 
                    title: 'Digital Presence', 
                    icon: Globe, 
                    color: 'from-neuro-warning to-yellow-400', 
                    items: ['LinkedIn premium optimization', 'Personal branding strategy', 'Thought leadership content', 'Professional portfolio curation'] 
                  },
                  { 
                    title: 'Relationship Management', 
                    icon: TrendingUp, 
                    color: 'from-neuro-secondary to-pink-400', 
                    items: ['CRM system for contacts', 'Follow-up automation tools', 'Networking ROI tracking', 'Relationship mapping strategies'] 
                  },
                  { 
                    title: 'Industry Access', 
                    icon: Building2, 
                    color: 'from-purple-500 to-purple-400', 
                    items: ['Exclusive industry events', 'Private member clubs', 'Professional associations', 'Trade organization access'] 
                  },
                  { 
                    title: 'Mentorship Network', 
                    icon: Award, 
                    color: 'from-pink-500 to-pink-400', 
                    items: ['Senior executive mentors', 'Industry veteran guidance', 'Peer advisory groups', 'Success coaching sessions'] 
                  }
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
                      <div className="space-y-3">
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

              <div className="text-center neuro-inset p-8 rounded-neuro-lg">
                <button
                  onClick={() => completeStep('advanced-networking', 'completion-certificate')}
                  className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                >
                  <Network className="w-6 h-6 mr-3" />
                  <span>Access Advanced Networking</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'completion-certificate':
        return (
          <div className="p-8 space-y-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-success to-green-400 neuro-animate-float border-4 border-neuro-warning">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold neuro-text-primary mb-4">Congratulations!</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  You've successfully completed the Workforce Ready track and earned your Skills Passport Certificate!
                </p>
              </div>

              {/* Achievement Summary */}
              <div className="neuro-surface p-8 rounded-neuro-lg mb-8 hover:shadow-neuro-hover transition-all duration-300">
                <h3 className="text-2xl font-bold neuro-text-primary mb-6 text-center">Your Achievements</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold neuro-text-primary mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-neuro-success mr-3" />
                      Skills Mastered
                    </h4>
                    <div className="space-y-3">
                      {[
                        'Advanced professional skills',
                        'Industry-specific expertise',
                        'Leadership capabilities',
                        'Strategic networking',
                        'Job market navigation'
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
                      Career Ready Status
                    </h4>
                    <div className="space-y-3">
                      {[
                        'Executive-level positioning',
                        'Premium job market access',
                        'Strategic network established',
                        'Professional brand developed',
                        'Career advancement ready'
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
                  <h3 className="text-3xl font-bold neuro-text-primary mb-6">Skills Passport Certificate</h3>
                  <p className="text-lg neuro-text-secondary mb-8">
                    Your official certification of workforce readiness and professional competency.
                  </p>
                  
                  <div className="neuro-surface p-8 rounded-neuro-lg mb-8 border-4 border-neuro-warning">
                    <div className="text-center">
                      <div className="w-20 h-20 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-success to-green-400">
                        <FileText className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold neuro-text-primary mb-4">Certificate of Completion</h4>
                      <p className="text-lg neuro-text-secondary mb-4">This certifies that</p>
                      <p className="text-2xl font-bold neuro-text-primary mb-4">{user?.fullName}</p>
                      <p className="text-lg neuro-text-secondary mb-4">has successfully completed the</p>
                      <p className="text-2xl font-bold neuro-text-primary mb-4">Workforce Ready Career Development Program</p>
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
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold neuro-text-primary mb-2">Apply for Jobs</h4>
                    <p className="neuro-text-secondary">Use your new skills and network</p>
                  </div>
                  <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                    <div className="w-16 h-16 neuro-icon mx-auto mb-4 bg-gradient-to-br from-neuro-secondary to-pink-400">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold neuro-text-primary mb-2">Mentor Others</h4>
                    <p className="neuro-text-secondary">Share your journey and help others</p>
                  </div>
                  <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                    <div className="w-16 h-16 neuro-icon mx-auto mb-4 bg-gradient-to-br from-neuro-success to-green-400">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold neuro-text-primary mb-2">Continue Growing</h4>
                    <p className="neuro-text-secondary">Keep developing your career</p>
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
      title="Workforce Ready Track - Advanced Career Launch"
      steps={workforceReadySteps.map(step => ({
        ...step,
        current: step.id === currentStep,
        completed: user?.progress?.completedSteps?.includes(step.id) || false
      }))}
      onStepClick={handleStepClick}
    >
      <div className="bg-neuro-bg">
        {/* Back Button */}
        <div className="neuro-inset px-8 py-6">
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
                {workforceReadySteps.filter(s => user?.progress?.completedSteps?.includes(s.id)).length}/{workforceReadySteps.length}
              </div>
              <div className="text-sm neuro-text-secondary">Steps Completed</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-success">94%</div>
              <div className="text-sm neuro-text-secondary">Success Rate</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-primary">4-8 weeks</div>
              <div className="text-sm neuro-text-secondary">Duration</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-secondary">Advanced Level</div>
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
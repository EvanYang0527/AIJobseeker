import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { ProgressStep } from '../../../types';
import { AssessmentResults } from '../../assessment/AssessmentResults';
import { NetworkingHub } from './NetworkingHub';
import { 
  Brain, 
  Users, 
  Network, 
  BookOpen, 
  Target, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Briefcase,
  TrendingUp,
  Clock,
  Star,
  FileText,
  Zap,
  ArrowLeft
} from 'lucide-react';

const wageEmploymentSteps: ProgressStep[] = [
  { id: 'skillcraft-riasec', label: 'SkillCraft RIASEC', completed: false, current: true },
  { id: 'assessment-questionnaire', label: 'Assessment Questionnaire', completed: false, current: false },
  { id: 'career-guidance', label: 'Career Guidance', completed: false, current: false },
  { id: 'job-search-strategies', label: 'Job Search Strategies', completed: false, current: false },
  { id: 'networking-resources', label: 'Networking Resources', completed: false, current: false }
];

export const WageEmploymentDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('skillcraft-riasec');
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [questionnaireResponse, setQuestionnaireResponse] = useState<string>(
    () => (user?.profile?.wageEmploymentQuestionnaire?.workExperience as string) || ''
  );

  useEffect(() => {
    const stored = (user?.profile?.wageEmploymentQuestionnaire?.workExperience as string) || '';
    setQuestionnaireResponse(prev => (prev === stored ? prev : stored));
  }, [user?.profile?.wageEmploymentQuestionnaire?.workExperience]);

  const persistWageQuestionnaire = (workExperience: string) => {
    updateUser({
      profile: {
        ...user?.profile,
        wageEmploymentQuestionnaire: { workExperience }
      }
    });
  };

  const handleWageQuestionnaireChange = (value: string) => {
    setQuestionnaireResponse(value);
    persistWageQuestionnaire(value);
  };

  const handleStepClick = (stepId: string) => {
    const completedSteps = user?.progress?.completedSteps || [];
    const stepIndex = wageEmploymentSteps.findIndex(step => step.id === stepId);
    const currentStepIndex = wageEmploymentSteps.findIndex(step => step.id === currentStep);
    
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'skillcraft-riasec':
        return (
          <div className="p-8 space-y-8">
            <div className="neuro-card">
              <div className="text-center mb-8">
                <div className="w-20 h-20 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-primary to-neuro-primary-light">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">SkillCraft RIASEC Assessment</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Combined cognitive abilities and career interest assessment for comprehensive career guidance.
                </p>
              </div>

              {/* Assessment Overview */}
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="neuro-surface p-6 rounded-neuro-lg">
                    <h3 className="text-xl font-bold neuro-text-primary mb-6 flex items-center">
                      <Brain className="w-6 h-6 mr-3" />
                      RIASEC Categories
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { title: 'Realistic', desc: 'Hands-on, practical work with tools and machines', duration: '8 min' },
                        { title: 'Investigative', desc: 'Research, analysis, and problem-solving activities', duration: '10 min' },
                        { title: 'Artistic', desc: 'Creative expression and innovative thinking', duration: '7 min' },
                        { title: 'Social', desc: 'Helping, teaching, and working with people', duration: '9 min' },
                        { title: 'Enterprising', desc: 'Leadership, persuasion, and business activities', duration: '8 min' },
                        { title: 'Conventional', desc: 'Organization, data management, and detail work', duration: '6 min' }
                      ].map((category, index) => (
                        <div key={index} className="neuro-inset p-4 rounded-neuro">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold neuro-text-primary">{category.title}</h4>
                            <span className="neuro-surface px-2 py-1 rounded-neuro-sm text-xs text-neuro-primary">
                              {category.duration}
                            </span>
                          </div>
                          <p className="text-sm neuro-text-secondary">{category.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="neuro-surface p-6 rounded-neuro-lg">
                    <h4 className="font-semibold neuro-text-primary mb-4">Assessment Benefits</h4>
                    <ul className="space-y-3 text-sm neuro-text-secondary">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-neuro-success mr-3 mt-0.5 flex-shrink-0" />
                        Identify your career interests
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-neuro-success mr-3 mt-0.5 flex-shrink-0" />
                        Match with suitable job roles
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-neuro-success mr-3 mt-0.5 flex-shrink-0" />
                        Personalized career guidance
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-neuro-success mr-3 mt-0.5 flex-shrink-0" />
                        Industry recommendations
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Assessment Results */}
              {showResults && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold neuro-text-primary mb-6">Your RIASEC Results</h3>
                  <AssessmentResults isWageEmployment={true} />
                </div>
              )}

              {/* Action Section */}
              <div className="neuro-inset p-6 rounded-neuro-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold neuro-text-primary mb-2">Ready to Discover Your Career Path?</h3>
                    <p className="neuro-text-secondary">
                      Complete the RIASEC assessment to unlock personalized career recommendations.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {!assessmentStarted ? (
                      <button 
                        onClick={handleStartAssessment}
                        className="neuro-button-primary flex items-center px-6 py-3 rounded-neuro"
                      >
                        <span>Start Assessment</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleToggleResults}
                        className="neuro-button bg-gradient-to-br from-neuro-success to-green-400 text-white flex items-center px-6 py-3 rounded-neuro"
                      >
                        <span>{showResults ? 'Hide Results' : 'View Results'}</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    )}
                    <button
                      onClick={() => completeStep('skillcraft-riasec', 'assessment-questionnaire')}
                      className="neuro-button-primary flex items-center px-6 py-3 rounded-neuro"
                    >
                      <span>Continue to Questionnaire</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
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
                  Help us understand your career background and preferences.
                </p>
              </div>

              <div className="space-y-6">
                <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                  <label className="block text-lg font-bold neuro-text-primary mb-3">
                    Work Experience 💼
                  </label>
                  <textarea
                    rows={3}
                    className="neuro-input resize-none text-lg"
                    placeholder="Describe your work experience and career background..."
                    value={questionnaireResponse}
                    onChange={e => handleWageQuestionnaireChange(e.target.value)}
                    required
                  />
                </div>

                <div className="text-center neuro-inset p-6 rounded-neuro-lg">
                  <button
                    onClick={() => completeStep('assessment-questionnaire', 'career-guidance')}
                    className="neuro-button-primary inline-flex items-center px-10 py-5 text-xl rounded-neuro-lg hover:scale-105 transition-all duration-300"
                  >
                    <FileText className="w-6 h-6 mr-3" />
                    <span>Submit Questionnaire</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'career-guidance':
        return (
          <div className="p-8">
            <div className="neuro-card">
              <div className="text-center mb-8">
                <div className="w-20 h-20 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-secondary to-pink-400">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Career Guidance Chatbot</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Interactive AI-powered career counseling based on your assessment results.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <h3 className="text-xl font-bold neuro-text-primary mb-6">Career Recommendations</h3>
                  <ul className="space-y-4">
                    {[
                      'Software Developer',
                      'Data Analyst',
                      'Project Manager',
                      'Marketing Specialist'
                    ].map((career, index) => (
                      <li key={index} className="flex items-center neuro-inset p-3 rounded-neuro">
                        <Star className="w-5 h-5 text-neuro-warning mr-3" />
                        <span className="neuro-text-primary font-medium">{career}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="neuro-surface p-6 rounded-neuro-lg">
                  <h3 className="text-xl font-bold neuro-text-primary mb-6">Next Steps</h3>
                  <ul className="space-y-4">
                    {[
                      'Complete skills assessment',
                      'Update your resume',
                      'Build your LinkedIn profile',
                      'Start networking'
                    ].map((step, index) => (
                      <li key={index} className="flex items-center neuro-inset p-3 rounded-neuro">
                        <CheckCircle className="w-5 h-5 text-neuro-success mr-3" />
                        <span className="neuro-text-primary font-medium">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => completeStep('career-guidance', 'job-search-strategies')}
                  className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg"
                >
                  Continue to Job Search
                  <ArrowRight className="w-6 h-6 ml-3" />
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
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Job Search Strategies</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Learn effective job search techniques and strategies to land your ideal position.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold neuro-text-primary mb-6">Search Strategies</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Online Job Boards', desc: 'Leverage major job platforms effectively', icon: Network },
                      { title: 'Company Research', desc: 'Target specific companies and roles', icon: Target },
                      { title: 'Application Optimization', desc: 'Tailor resumes and cover letters', icon: FileText },
                      { title: 'Interview Preparation', desc: 'Master common interview questions', icon: Users }
                    ].map((strategy, index) => {
                      const Icon = strategy.icon;
                      return (
                        <div key={index} className="neuro-surface p-6 rounded-neuro-lg">
                          <div className="flex items-start">
                            <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold neuro-text-primary mb-2">{strategy.title}</h4>
                              <p className="neuro-text-secondary">{strategy.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold neuro-text-primary mb-6">Success Metrics</h3>
                  <div className="space-y-4">
                    {[
                      { metric: 'Application Response Rate', value: '15-20%', status: 'good' },
                      { metric: 'Interview Conversion', value: '25-30%', status: 'excellent' },
                      { metric: 'Average Search Time', value: '3-6 months', status: 'normal' },
                      { metric: 'Offer Success Rate', value: '40-50%', status: 'good' }
                    ].map((item, index) => (
                      <div key={index} className="neuro-surface p-4 rounded-neuro">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold neuro-text-primary">{item.metric}</span>
                          <span className={`font-bold ${
                            item.status === 'excellent' ? 'text-neuro-success' :
                            item.status === 'good' ? 'text-neuro-primary' :
                            'neuro-text-secondary'
                          }`}>
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => completeStep('job-search-strategies', 'networking-resources')}
                  className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg"
                >
                  Continue to Networking
                  <ArrowRight className="w-6 h-6 ml-3" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'networking-resources':
        return (
          <div className="p-8">
            <div className="neuro-card">
              <div className="text-center mb-8">
                <div className="w-20 h-20 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-success to-green-400">
                  <Network className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Networking Resources</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Build your professional network and connect with industry professionals.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold neuro-text-primary mb-6">Search Strategies</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Online Job Boards', desc: 'Leverage major job platforms effectively', icon: Network },
                      { title: 'Company Research', desc: 'Target specific companies and roles', icon: Target },
                      { title: 'Application Optimization', desc: 'Tailor resumes and cover letters', icon: FileText },
                      { title: 'Interview Preparation', desc: 'Master common interview questions', icon: Users }
                    ].map((strategy, index) => {
                      const Icon = strategy.icon;
                      return (
                        <div key={index} className="neuro-surface p-6 rounded-neuro-lg">
                          <div className="flex items-start">
                            <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold neuro-text-primary mb-2">{strategy.title}</h4>
                              <p className="neuro-text-secondary">{strategy.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold neuro-text-primary mb-6">Success Metrics</h3>
                  <div className="space-y-4">
                    {[
                      { metric: 'Application Response Rate', value: '15-20%', status: 'good' },
                      { metric: 'Interview Conversion', value: '25-30%', status: 'excellent' },
                      { metric: 'Average Search Time', value: '3-6 months', status: 'normal' },
                      { metric: 'Offer Success Rate', value: '40-50%', status: 'good' }
                    ].map((item, index) => (
                      <div key={index} className="neuro-surface p-4 rounded-neuro">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold neuro-text-primary">{item.metric}</span>
                          <span className={`font-bold ${
                            item.status === 'excellent' ? 'text-neuro-success' :
                            item.status === 'good' ? 'text-neuro-primary' :
                            'neuro-text-secondary'
                          }`}>
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => completeStep('networking-resources')}
                  className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg"
                >
                  Complete Track
                  <ArrowRight className="w-6 h-6 ml-3" />
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
      title="Wage Employment Track - Professional Development"
      steps={wageEmploymentSteps.map(step => ({
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
                {wageEmploymentSteps.filter(s => user?.progress?.completedSteps?.includes(s.id)).length}/{wageEmploymentSteps.length}
              </div>
              <div className="text-sm neuro-text-secondary">Steps Completed</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-success">91%</div>
              <div className="text-sm neuro-text-secondary">Success Rate</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-primary">18 hrs</div>
              <div className="text-sm neuro-text-secondary">Time Invested</div>
            </div>
            <div className="text-center neuro-card p-6 hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-lg font-bold text-neuro-warning">8 weeks</div>
              <div className="text-sm neuro-text-secondary">Est. Completion</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {renderStepContent()}
      </div>
    </DashboardLayout>
  );
};
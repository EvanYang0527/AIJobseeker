import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight, Compass, Lightbulb, ExternalLink } from 'lucide-react';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { entrepreneurSteps } from './entrepreneurSteps';

const foundationalCourses = [
  {
    title: 'Becoming an Entrepreneur',
    provider: 'MIT (edX)',
    link: 'https://www.edx.org/course/becoming-an-entrepreneur',
    duration: '6 weeks (1–3 hrs/week)',
    category: 'Startup',
    description:
      'Introduces the full entrepreneurial journey including identifying opportunities, understanding customers, designing and testing offerings, and planning business logistics.',
    whyRecommended:
      'Ideal for beginners who want a step-by-step overview of what entrepreneurship involves before committing.'
  },
  {
    title: 'Entrepreneurship: From Business Idea to Action',
    provider: 'King’s College London (FutureLearn)',
    link: 'https://www.futurelearn.com/courses/entrepreneurship-idea-to-action',
    duration: '4 weeks (4 hrs/week)',
    category: 'Startup',
    description:
      'Guides learners through turning ideas into action — including market research, pitching, and developing a minimum viable product.',
    whyRecommended:
      'Helps those with vague or early ideas explore viability and practical next steps.'
  },
  {
    title: 'GET Ahead',
    provider: 'International Labour Organization (ILO)',
    link: 'https://www.ilo.org/resource/get-ahead-resources',
    duration: 'Self-paced',
    category: 'Startup / Soft Skills',
    description:
      'Gender-sensitive entrepreneurship training designed for people with basic literacy or numeracy, focusing on business management and soft skills.',
    whyRecommended:
      'Accessible and inclusive program designed for absolute beginners exploring entrepreneurship.'
  },
  {
    title: 'Starting a Small Business',
    provider: 'HP LIFE',
    link: 'https://www.life-global.org/course/17-starting-a-small-business',
    duration: '1 hour',
    category: 'Startup',
    description:
      'Interactive course teaching entrepreneurial thinking, business planning, and success metrics using HP LIFE tools.',
    whyRecommended:
      'A short, hands-on course perfect for trying out business planning in a low-commitment way.'
  },
  {
    title: 'Fundamentals of Starting and Running a Business',
    provider: 'YALI (Young African Leaders Initiative)',
    link: 'https://yali.state.gov/courses/course-959/',
    duration: '~1.5 hours',
    category: 'Startup',
    description:
      'Covers the critical aspects of entrepreneurship — from developing a business, identifying markets, and pitching to investors.',
    whyRecommended:
      'Clear and motivational introduction for first-time entrepreneurs seeking a practical understanding.'
  }
];

const bonusCourse = {
  title: 'Growth Mindsets for Teachers and Learners',
  provider: 'Alison',
  link: 'https://alison.com/course/growth-mindsets-for-teachers-and-learners',
  duration: '3–4 hours',
  category: 'Mindset',
  description:
    'Introduces the concept of a growth mindset and how adopting it can improve learning and adaptability.',
  whyRecommended: 'Develops the resilience and openness needed for entrepreneurial success.'
};

export const EntrepreneurFoundations: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = entrepreneurSteps.map(step => ({
    ...step,
    current: step.id === 'skillcraft-entrepreneurship-tasks',
    completed: user?.progress?.completedSteps?.includes(step.id) || false
  }));

  return (
    <DashboardLayout
      title="Entrepreneurship Track - Foundational Learning"
      steps={steps}
      onStepClick={(_stepId) => navigate('/entrepreneur/dashboard')}
    >
      <div className="bg-neuro-bg">
        <div className="p-8 space-y-8">
          <div className="neuro-card p-8 text-center space-y-4">
            <div className="w-20 h-20 neuro-icon mx-auto bg-gradient-to-br from-neuro-secondary to-pink-400">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold neuro-text-primary">Build Your Business Foundations</h2>
            <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
              These curated courses will help you strengthen the fundamentals needed before crafting a full business plan. Once you feel confident with the basics, you can jump back into the SkillCraft Entrepreneurship Tasks to continue your journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {foundationalCourses.map(course => (
              <div key={course.title} className="neuro-surface p-6 rounded-neuro-lg space-y-4 hover:shadow-neuro-hover transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold neuro-text-primary">{course.title}</h3>
                    <p className="text-sm text-neuro-secondary">{course.provider}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-neuro-secondary">
                  <span className="font-medium text-neuro-primary">Duration:</span>
                  <span>{course.duration}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="font-medium text-neuro-primary">Category:</span>
                  <span>{course.category}</span>
                </div>
                <p className="text-sm neuro-text-secondary leading-relaxed">{course.description}</p>
                <div className="space-y-3">
                  <div className="text-sm text-neuro-secondary bg-neuro-bg/60 border border-neuro-border rounded-neuro p-3">
                    <span className="block font-semibold text-neuro-primary">Why we like it:</span>
                    <span>{course.whyRecommended}</span>
                  </div>
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neuro-button-primary inline-flex items-center justify-center gap-2 px-4 py-2 rounded-neuro"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open course</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="neuro-surface p-6 rounded-neuro-lg space-y-4 border border-dashed border-neuro-primary/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold neuro-text-primary">Bonus Pick: {bonusCourse.title}</h3>
                <p className="text-sm text-neuro-secondary">{bonusCourse.provider}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neuro-secondary">
              <span className="font-medium text-neuro-primary">Duration:</span>
              <span>{bonusCourse.duration}</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-medium text-neuro-primary">Category:</span>
              <span>{bonusCourse.category}</span>
            </div>
            <p className="text-sm neuro-text-secondary leading-relaxed">{bonusCourse.description}</p>
            <div className="space-y-3">
              <div className="text-sm text-neuro-secondary bg-neuro-bg/60 border border-neuro-border rounded-neuro p-3">
                <span className="block font-semibold text-neuro-primary">Why we like it:</span>
                <span>{bonusCourse.whyRecommended}</span>
              </div>
              <a
                href={bonusCourse.link}
                target="_blank"
                rel="noopener noreferrer"
                className="neuro-button inline-flex items-center justify-center gap-2 px-4 py-2 rounded-neuro"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open bonus course</span>
              </a>
            </div>
          </div>

          <div className="neuro-inset p-6 rounded-neuro-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 neuro-icon bg-gradient-to-br from-neuro-success to-green-400">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold neuro-text-primary mb-1">Ready for Your Next Move?</h3>
                <p className="text-sm neuro-text-secondary">
                  Choose how you&apos;d like to continue. You can explore other career pathways or return to the entrepreneurship track when you feel prepared.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
              <button
                onClick={() => navigate('/career-exploration')}
                className="neuro-button flex items-center justify-center gap-2 px-6 py-3 rounded-neuro"
              >
                <Compass className="w-5 h-5" />
                <span>Visit Career Explorer</span>
              </button>
              <button
                onClick={() => navigate('/entrepreneur/dashboard')}
                className="neuro-button-primary flex items-center justify-center gap-2 px-6 py-3 rounded-neuro"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Continue to SkillCraft Entrepreneurship Tasks</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Lightbulb, Rocket, Target } from 'lucide-react';

const foundationalCourses = [
  {
    title: 'Entrepreneurship Foundations',
    focus: 'Mindset & Opportunity Discovery',
    description:
      'Learn how to spot real customer problems, validate ideas quickly, and build the entrepreneurial mindset you need to launch confidently.',
    outcome: 'Define a clear value proposition and opportunity statement.'
  },
  {
    title: 'Business Model & Planning Basics',
    focus: 'Business Model Design',
    description:
      'Explore simple frameworks like the Business Model Canvas to map customers, offerings, revenue streams, and key partners.',
    outcome: 'Draft a one-page business model you can iterate on with mentors.'
  },
  {
    title: 'Small Business Finance 101',
    focus: 'Financial Literacy',
    description:
      'Understand pricing, startup costs, break-even analysis, and cashflow essentials tailored for first-time founders.',
    outcome: 'Build a lightweight financial plan and weekly cash tracker.'
  },
  {
    title: 'Marketing & Customer Discovery',
    focus: 'Customer Insights',
    description:
      'Master practical research tools to interview early adopters, size your market, and craft messaging that resonates.',
    outcome: 'Create a customer persona and outreach script for pilots.'
  },
  {
    title: 'Regulatory & Operational Readiness',
    focus: 'Launch Readiness',
    description:
      'Learn the essentials of licensing, permits, compliance, and operational workflows to move from idea to first launch.',
    outcome: 'Assemble a launch checklist and operating rhythm for day one.'
  }
];

export const EntrepreneurFoundations: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neuro-bg px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="neuro-card p-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-neuro-secondary to-pink-400 rounded-full opacity-20" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-br from-neuro-primary to-neuro-primary-light rounded-full opacity-10" />
          <div className="relative z-10">
            <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-primary to-neuro-primary-light">
              <Lightbulb className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold neuro-text-primary mb-4">Start with Business Foundations</h1>
            <p className="text-lg neuro-text-secondary max-w-3xl mx-auto">
              You indicated that you&apos;re still shaping your business idea. Master these core lessons first so that your SkillCraft Entrepreneurship journey is grounded in practical knowledge and real-world readiness.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {foundationalCourses.map(course => (
            <div key={course.title} className="neuro-card p-6 flex flex-col space-y-4 hover:shadow-neuro-hover transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold neuro-text-primary">{course.title}</h2>
                    <p className="text-sm font-medium text-neuro-secondary/80 uppercase tracking-wide">{course.focus}</p>
                  </div>
                </div>
                <Rocket className="w-6 h-6 text-neuro-primary" />
              </div>
              <p className="neuro-text-secondary leading-relaxed">{course.description}</p>
              <div className="neuro-inset p-4 rounded-neuro flex items-start space-x-3">
                <Target className="w-5 h-5 text-neuro-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold neuro-text-primary">Outcome</p>
                  <p className="text-sm neuro-text-secondary">{course.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="neuro-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold neuro-text-primary">Ready to choose your next step?</h3>
              <p className="neuro-text-secondary">
                You can explore alternative pathways or continue with SkillCraft Entrepreneurship tasks when you feel confident.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate('/career-exploration')}
              className="neuro-button flex items-center justify-center px-6 py-3 rounded-neuro-lg font-semibold"
            >
              Explore Career Explorer
            </button>
            <button
              onClick={() => navigate('/entrepreneur/dashboard')}
              className="neuro-button-primary flex items-center justify-center px-6 py-3 rounded-neuro-lg font-semibold"
            >
              Continue to SkillCraft Tasks
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurFoundations;

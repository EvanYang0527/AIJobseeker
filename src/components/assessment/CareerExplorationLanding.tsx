import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Compass, Lightbulb, Map, Star } from 'lucide-react';

export const CareerExplorationLanding: React.FC = () => {
  const navigate = useNavigate();

  const explorationHighlights = [
    {
      title: 'Discover Your Strengths',
      description:
        'Identify the skills and interests that energize you with guided self-reflection exercises.',
      icon: Lightbulb
    },
    {
      title: 'Explore New Industries',
      description:
        'Dive into curated industry spotlights to understand where your talents can shine the brightest.',
      icon: Map
    },
    {
      title: 'Build a Personal Action Plan',
      description:
        'Turn insights into next steps with a structured roadmap designed to build your confidence.',
      icon: Compass
    }
  ];

  return (
    <div className="min-h-screen bg-neuro-bg px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-16 w-12 h-12 neuro-icon neuro-animate-float">
          <Star className="w-6 h-6 text-neuro-primary" />
        </div>
        <div className="absolute bottom-24 right-20 w-16 h-16 neuro-icon neuro-animate-float" style={{ animationDelay: '1s' }}>
          <Lightbulb className="w-8 h-8 text-neuro-secondary" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate('/track-selection')} className="neuro-button flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Track Selection
          </button>
        </div>

        <div className="neuro-card p-8 mb-10 text-center">
          <div className="w-24 h-24 neuro-icon mx-auto mb-6">
            <Compass className="w-12 h-12 text-neuro-primary" />
          </div>
          <h1 className="text-4xl font-bold neuro-text-primary mb-4">Welcome to Career Exploration</h1>
          <p className="text-lg neuro-text-secondary max-w-3xl mx-auto">
            You chose to explore what you&apos;re good at—great decision! We&apos;ll help you uncover your strengths,
            understand new opportunities, and build confidence in your next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {explorationHighlights.map(highlight => {
            const Icon = highlight.icon;
            return (
              <div key={highlight.title} className="neuro-card p-6 text-left">
                <div className="w-12 h-12 neuro-icon mb-4">
                  <Icon className="w-6 h-6 text-neuro-primary" />
                </div>
                <h3 className="text-xl font-semibold neuro-text-primary mb-2">{highlight.title}</h3>
                <p className="text-sm neuro-text-secondary leading-relaxed">{highlight.description}</p>
              </div>
            );
          })}
        </div>

        <div className="neuro-card p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-left">
            <h2 className="text-2xl font-bold neuro-text-primary mb-2">Ready to start exploring?</h2>
            <p className="neuro-text-secondary max-w-xl">
              Jump into the Career Explorer track for guided activities, reflection prompts, and curated resources that help
              you learn more about yourself and where you can thrive.
            </p>
          </div>
          <button
            onClick={() => navigate('/pathfinder/dashboard')}
            className="neuro-button-primary inline-flex items-center px-6 py-4 text-lg rounded-neuro"
          >
            Start Career Explorer Track
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

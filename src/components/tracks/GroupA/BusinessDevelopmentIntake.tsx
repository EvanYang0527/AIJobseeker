import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FileText, ArrowRight, Lightbulb } from 'lucide-react';

export interface BusinessDevelopmentIntakeValues {
  ideaName: string;
  summary: string;
  problem: string;
  whyItMatters: string;
  mainCustomer: string;
  painPoint: string;
  ideaHelp: string;
  existingOptions: string;
  edge: string;
  offering: string;
  revenueModel: string;
  partners: string;
  needs: string;
  success: string;
}

interface BusinessDevelopmentIntakeProps {
  onComplete: () => void;
}

const defaultValues: BusinessDevelopmentIntakeValues = {
  ideaName: '',
  summary: '',
  problem: '',
  whyItMatters: '',
  mainCustomer: '',
  painPoint: '',
  ideaHelp: '',
  existingOptions: '',
  edge: '',
  offering: '',
  revenueModel: '',
  partners: '',
  needs: '',
  success: ''
};

export const BusinessDevelopmentIntake: React.FC<BusinessDevelopmentIntakeProps> = ({ onComplete }) => {
  const { user, updateUser } = useAuth();

  const storedValues = useMemo(() => {
    const intake = (user?.profile as Record<string, unknown> | undefined)?.businessDevelopmentIntake;
    if (intake && typeof intake === 'object') {
      const record = intake as Partial<BusinessDevelopmentIntakeValues>;
      return { ...defaultValues, ...record };
    }
    return defaultValues;
  }, [user]);

  const [formData, setFormData] = useState<BusinessDevelopmentIntakeValues>(storedValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateUser({
      profile: {
        ...user?.profile,
        businessIdea: formData.summary || formData.ideaName,
        businessDevelopmentIntake: formData
      },
      progress: {
        ...user?.progress!,
        completedSteps: user?.progress?.completedSteps || []
      }
    });

    onComplete();
  };

  return (
    <div className="p-8 bg-neuro-bg">
      <div className="neuro-card max-w-4xl mx-auto hover:shadow-neuro-hover transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-warning to-yellow-400 neuro-animate-float">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold neuro-text-primary mb-4">
            Entrepreneur Intake: Assessment &amp; Idea Scope
          </h2>
          <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
            Capture the essentials of your business concept so Lumina can tailor the Business Development Track to your goals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="neuro-surface p-8 rounded-neuro-lg space-y-6">
            <header>
              <h3 className="text-2xl font-semibold neuro-text-primary mb-2">1. Your Idea</h3>
              <p className="neuro-text-secondary text-sm">Summarize the core of what you want to build.</p>
            </header>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  Idea Name
                </label>
                <input
                  name="ideaName"
                  value={formData.ideaName}
                  onChange={handleChange}
                  className="neuro-input"
                  placeholder="Give your idea a memorable name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  One sentence summary
                </label>
                <input
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  className="neuro-input"
                  placeholder="Explain your idea in a single sentence"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  The problem
                </label>
                <textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  rows={3}
                  className="neuro-input resize-none"
                  placeholder="Describe the customer problem or gap you have spotted"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  Why it matters
                </label>
                <textarea
                  name="whyItMatters"
                  value={formData.whyItMatters}
                  onChange={handleChange}
                  rows={3}
                  className="neuro-input resize-none"
                  placeholder="Why is this the right moment to solve this?"
                  required
                />
              </div>
            </div>
          </section>

          <section className="neuro-surface p-8 rounded-neuro-lg space-y-6">
            <header>
              <h3 className="text-2xl font-semibold neuro-text-primary mb-2">2. Who It’s For</h3>
              <p className="neuro-text-secondary text-sm">Clarify the audience that benefits most.</p>
            </header>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  Main customer or user
                </label>
                <input
                  name="mainCustomer"
                  value={formData.mainCustomer}
                  onChange={handleChange}
                  className="neuro-input"
                  placeholder="Who is the primary customer or user?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  Their biggest pain point
                </label>
                <textarea
                  name="painPoint"
                  value={formData.painPoint}
                  onChange={handleChange}
                  rows={3}
                  className="neuro-input resize-none"
                  placeholder="What do they struggle with today?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  How your idea helps
                </label>
                <textarea
                  name="ideaHelp"
                  value={formData.ideaHelp}
                  onChange={handleChange}
                  rows={3}
                  className="neuro-input resize-none"
                  placeholder="Explain how you make life easier or better"
                  required
                />
              </div>
            </div>
          </section>

          <section className="neuro-surface p-8 rounded-neuro-lg space-y-6">
            <header>
              <h3 className="text-2xl font-semibold neuro-text-primary mb-2">3. What Makes It Different</h3>
              <p className="neuro-text-secondary text-sm">Show how you stand out.</p>
            </header>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  Existing options
                </label>
                <textarea
                  name="existingOptions"
                  value={formData.existingOptions}
                  onChange={handleChange}
                  rows={3}
                  className="neuro-input resize-none"
                  placeholder="How do people solve this today?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  Your edge
                </label>
                <textarea
                  name="edge"
                  value={formData.edge}
                  onChange={handleChange}
                  rows={3}
                  className="neuro-input resize-none"
                  placeholder="Why is your approach better or more appealing?"
                  required
                />
              </div>
            </div>
          </section>

          <section className="neuro-surface p-8 rounded-neuro-lg space-y-6">
            <header>
              <h3 className="text-2xl font-semibold neuro-text-primary mb-2">4. How It Works</h3>
              <p className="neuro-text-secondary text-sm">Outline the mechanics of the solution.</p>
            </header>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  What you will offer
                </label>
                <select
                  name="offering"
                  value={formData.offering}
                  onChange={handleChange}
                  className="neuro-select"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                  <option value="app">App</option>
                  <option value="platform">Platform</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  How you’ll earn money
                </label>
                <input
                  name="revenueModel"
                  value={formData.revenueModel}
                  onChange={handleChange}
                  className="neuro-input"
                  placeholder="Sell, subscribe, partner, or something else?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  Who you might work with
                </label>
                <textarea
                  name="partners"
                  value={formData.partners}
                  onChange={handleChange}
                  rows={3}
                  className="neuro-input resize-none"
                  placeholder="List key partners, suppliers, or collaborators"
                  required
                />
              </div>
            </div>
          </section>

          <section className="neuro-surface p-8 rounded-neuro-lg space-y-6">
            <header>
              <h3 className="text-2xl font-semibold neuro-text-primary mb-2">5. Next Steps</h3>
              <p className="neuro-text-secondary text-sm">Clarify what you need to move forward.</p>
            </header>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  What do you need right now?
                </label>
                <textarea
                  name="needs"
                  value={formData.needs}
                  onChange={handleChange}
                  rows={3}
                  className="neuro-input resize-none"
                  placeholder="Money, skills, team, feedback, or something else?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold neuro-text-primary mb-2">
                  What success looks like
                </label>
                <textarea
                  name="success"
                  value={formData.success}
                  onChange={handleChange}
                  rows={3}
                  className="neuro-input resize-none"
                  placeholder="How will you know it’s working?"
                  required
                />
              </div>
            </div>
          </section>

          <div className="neuro-inset p-6 rounded-neuro flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start">
              <div className="w-12 h-12 neuro-icon mr-4">
                <Lightbulb className="w-6 h-6 text-neuro-primary mx-auto my-3" />
              </div>
              <div>
                <h4 className="font-semibold neuro-text-primary mb-1">Lumina’s Tip</h4>
                <p className="neuro-text-secondary text-sm">
                  Paint a vivid, concrete picture. Detailed answers help Lumina personalize your mentorship, resources, and AI-generated plans.
                </p>
              </div>
            </div>
            <button type="submit" className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg">
              Submit &amp; Continue <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

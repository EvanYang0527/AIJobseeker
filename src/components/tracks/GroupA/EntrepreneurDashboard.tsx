import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { GoalSetting } from './GoalSetting';
import { ProgressStep, User } from '../../../types';
import { WoopIntakeSummary, WoopWish, WoopOutcome, WoopObstacles, WoopPlan } from '../../../types/woop';
import { AzureChatMessage, callAzureChatCompletion, parseAzureJSON } from '../../../utils/azureOpenAI';
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
  Loader2,
  AlertCircle
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

const formatPromptValue = (value: unknown): string => {
  if (value === undefined || value === null) {
    return 'Not provided by the user.';
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : 'Not provided by the user.';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    console.error('Failed to stringify prompt value', error, value);
    return String(value);
  }
};

const buildWoopIntakePrompt = (user: User | null) => {
  const profile = user?.profile ?? {};
  const skillcraftText = profile.skillcraftResults
    ? formatPromptValue(profile.skillcraftResults)
    : 'No SkillCraft PDF text was provided by the user. Capture this gap under assumptions.';

  const toReadableLabel = (key: string) =>
    key
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

  const extendedProfile = (profile as unknown) as Record<string, unknown>;

  const getRecordFromProfile = (key: string) => {
    const value = extendedProfile?.[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return undefined;
  };

  const assessmentResponses =
    getRecordFromProfile('assessmentResponses') ||
    getRecordFromProfile('assessmentQuestionnaire') ||
    getRecordFromProfile('assessmentAnswers');

  const goalSettingData = getRecordFromProfile('goalSettingData');
  const wageQuestionnaire = getRecordFromProfile('wageEmploymentQuestionnaire');

  const goalSettingLinesSections: string[] = [
    'USER OVERVIEW',
    `Full name: ${formatPromptValue(user?.fullName)}`,
    `User location: ${formatPromptValue(user?.location)}`,
    `Primary contact email: ${formatPromptValue(user?.email)}`,
    `Phone number: ${formatPromptValue(user?.phoneNumber)}`,
    `Selected track: ${formatPromptValue(user?.selectedTrack)}`,
    '',
    'GOAL SETTING RESPONSES',
    `Business idea summary: ${formatPromptValue(profile.businessIdea)}`,
    `Business category: ${formatPromptValue(profile.businessCategory)}`,
    `Relevant experience in years: ${formatPromptValue(
      profile.experienceYears !== undefined ? profile.experienceYears : null,
    )}`,
    `Preferred time commitment: ${formatPromptValue(profile.timeCommitment)}`,
    `Career goals: ${formatPromptValue(extendedProfile?.careerGoals ?? goalSettingData?.careerGoals)}`,
    `Skills to improve: ${formatPromptValue(extendedProfile?.skillsToImprove ?? goalSettingData?.skillsToImprove)}`,
    `Career level: ${formatPromptValue(extendedProfile?.careerLevel)}`,
    `Has work experience: ${formatPromptValue(extendedProfile?.hasWorkExperience)}`,
    '',
    'ASSESSMENT QUESTIONNAIRE RESPONSES',
  ];

  if (assessmentResponses) {
    Object.entries(assessmentResponses).forEach(([key, value]) => {
      goalSettingLinesSections.push(`${toReadableLabel(key)}: ${formatPromptValue(value)}`);
    });
  } else {
    goalSettingLinesSections.push('Assessment questionnaire responses: Not provided by the user.');
  }

  if (goalSettingData) {
    goalSettingLinesSections.push(
      '',
      'EXTENDED GOAL SETTING (Opportunity Track)',
      `Business idea or career vision: ${formatPromptValue(goalSettingData.businessIdea)}`,
      `Time commitment: ${formatPromptValue(goalSettingData.timeCommitment)}`,
      `Career goals: ${formatPromptValue(goalSettingData.careerGoals)}`,
      `Skills to improve: ${formatPromptValue(goalSettingData.skillsToImprove)}`
    );
  }

  if (wageQuestionnaire) {
    goalSettingLinesSections.push(
      '',
      'WAGE EMPLOYMENT QUESTIONNAIRE',
      `Work experience summary: ${formatPromptValue(wageQuestionnaire.workExperience)}`
    );
  }

  goalSettingLinesSections.push(
    '',
    'PROGRESS SNAPSHOT',
    `Current step index: ${formatPromptValue(user?.progress?.currentStep)}`,
    `Completed steps: ${formatPromptValue(user?.progress?.completedSteps)}`,
  );

  const goalSettingLines = goalSettingLinesSections.join('\n');

  return `ROLE
You are the Intake Summarizer for the Entrepreneur WOOP Plan Coach.

OBJECTIVE
Ingest the attached SkillCraft report (PDF text below) and the goal-setting text captured from the user. Produce a single, durable JSON summary we can reuse for subsequent W-O-O-P business-plan steps. DO NOT retrieve any data. Do NOT search for courses. Do NOT fabricate facts. If information is missing or unclear, add it to "assumptions" and set "confidence":"low".

INPUTS
[SKILLCRAFT_PDF]
${skillcraftText}

[GOAL_SETTING_TEXT]
${goalSettingLines}

RULES
- Use ONLY these inputs; no outside knowledge.
- Normalize skills/personality into consistent fields (see schema).
- Extract measurable constraints (e.g., hours/week, budget bands) if present.
- Prefer short, decision-ready bullets in arrays.
- If you infer mappings (e.g., personality -> risk), mark them under "derived_insights" and include a brief rationale.
- Output VALID JSON that conforms EXACTLY to the schema below. Output JSON only—no additional text.

OUTPUT JSON SCHEMA
{
  "user_profile": {
    "name": "string|null",
    "persona": "aspiring_entrepreneur|existing_entrepreneur|unemployed_youth|experienced_worker|general_jobseeker|null",
    "region": "string|null",
    "language": "string|null",
    "stage": "idea|MVP|early_revenue|scaling|null",
    "timezone": "string|null"
  },
  "summary": "string: a paragraph includes all key information",
  "goal_setting": {
    "primary_goal": "string",
    "timeframe": "24h|4w|3m|12m|none|null",
    "previous_experience": ["string", "..."],
    "current_skills": ["string", "..."],
    "target_roles_or_markets": ["string", "..."],
    "current_challenges": ["string", "..."],
    "time_commitment_hours_per_week": "number|null",
    "budget_usd_cap": "number|null",
    "constraints": ["string", "..."]
  },
  "skillcraft_summary": {
    "top_skills": [
      {"name": "string", "evidence": "string"}
    ],
    "personality": {
      "extraversion": "low|medium|high|null",
      "agreeableness": "low|medium|high|null",
      "conscientiousness": "low|medium|high|null",
      "emotional_regulation": "low|medium|high|null",
      "openness": "low|medium|high|null",
      "notes": "string"
    },
    "source_doc": "SkillCraft PDF"
  },
  "derived_insights": {
    "strengths": ["string", "..."],
    "risks": ["string", "..."],
    "capability_gaps": ["string", "..."],
    "learning_topics": ["string", "..."],
    "personality_implications": ["string", "..."]
  },
  "availability": {
    "weekly_windows": [{"day":"Mon|Tue|...","start_local":"HH:MM","end_local":"HH:MM"}],
    "notes": "string"
  },
  "normalizations": {
    "skills_taxonomy": [{"raw":"string","normalized":"string"}],
    "personality_mapping_notes": "string"
  },
  "assumptions": ["string", "..."],
  "confidence": "high|medium|low",
  "tokens_estimate": 0
}

VALIDATION
- If a required field is truly absent, set it to null and explain in "assumptions".
- Keep arrays compact and specific.

RETURN
Return JSON only that matches the schema.
`;
};

const WOOP_WISH_PROMPT = `You are the Entrepreneur WOOP Plan Coach.
We are now focusing on the **Wish** part of WOOP.

TASK:
- Extract and clearly phrase the user’s *most meaningful business wish* from their inputs.
- Ensure the wish is ambitious yet feasible within the user’s stage, skills, and constraints.
- Reframe vague desires (e.g., “see if this can be real”) into a concrete, motivational statement.
- If multiple wishes are implied, help the user prioritize the ONE most impactful wish.
- Output in short, plain language (1–2 sentences).

RULES:
- Use only user-provided inputs (profile, goals, skills, challenges).
- Do not fabricate market data, funding sources, or business outcomes.
- If clarity is missing, include a clarifying question to the user.
- Keep tone encouraging but decision-oriented.
- No long explanations; just the final wish statement (+ clarifying question if needed).

OUTPUT FORMAT:
{
  "wish_statement": "string",
  "rationale": "short note on why this is the most impactful wish",
  "clarifying_question": "string|null"
}
`;

const WOOP_OUTCOME_PROMPT = `You are the Entrepreneur WOOP Plan Coach.
We are now focusing on the **Outcome** part of WOOP.

TASK:
- Translate the user’s wish into **specific, measurable outcomes** that show what success looks like.
- Outcomes should be **concrete, positive, and motivating** (e.g., “50 paying customers in 8 weeks”).
- Identify **1–3 key metrics or benchmarks** aligned with the user’s stage, skills, and constraints.
- If user inputs are vague (e.g., “see if this is real”), reframe into outcomes that are observable and testable.
- If clarity is missing (e.g., no numbers, no timeframe), add a clarifying question for the user.

RULES:
- Use ONLY user-provided inputs; do not invent market sizes, industry averages, or external benchmarks.
- Outcomes must be realistic given time/budget constraints, but still stretch the user.
- Keep language concise and decision-ready.

OUTPUT FORMAT:
{
  "positive_outcome": "string (short, motivating phrase)",
  "success_metrics": ["metric 1", "metric 2", "..."],
  "rationale": "short note on why these outcomes are meaningful",
  "clarifying_question": "string|null"
}
`;

const WOOP_OBSTACLE_PROMPT = `You are the Entrepreneur WOOP Plan Coach.
We are now focusing on the **Obstacle** part of WOOP.

TASK:
- Identify the **main internal obstacles** (e.g., skills, habits, confidence gaps) and **external obstacles** (e.g., permits, money, time, market uncertainty) that could prevent the user from achieving their wish and outcome.
- Phrase obstacles as **realistic, specific blockers** — not generic (“failure” or “competition”).
- Distinguish between **capability gaps** (skills/knowledge missing) and **practical risks** (time, budget, permits, demand).
- Limit to the **top 3–5 obstacles** to keep it actionable.
- If input is unclear, include a clarifying question for the user.

RULES:
- Use ONLY user-provided inputs (profile, skills, challenges, constraints).
- Do not add fabricated risks beyond what is plausible from the data.
- Keep phrasing short, concrete, and decision-ready.

OUTPUT FORMAT:
{
  "internal_obstacles": ["string", "..."],
  "external_obstacles": ["string", "..."],
  "capability_gaps": ["string", "..."],
  "rationale": "short note on why these obstacles are critical to address",
  "clarifying_question": "string|null"
}
`;

const WOOP_PLAN_PROMPT = `You are the Entrepreneur WOOP Plan Coach.
We are now focusing on the **Plan** part of WOOP.

TASK:
- Propose a **step-by-step business roadmap** that addresses the user’s wish, outcome, and obstacles.
- Each step should be small, concrete, and time-bounded (what to do, when, and how).
- Define what to measure at each step to confirm progress.
- Highlight **budget, operational, and go-to-market (GTM)** considerations relevant to their stage.

LEARNING PLAN:
- Identify the **critical skills** the user must develop to achieve outcomes and overcome obstacles.
- For each skill, generate a **set of 10 concrete courses
- Do NOT fabricate course names or details. Always rely on retrieval.

RULES:
- Use ONLY user-provided inputs (skills, goals, obstacles).
- Explicitly emphasize that course lists come from retrieval, not model invention.
- Keep all business steps and learning plan items concise, decision-ready, and aligned with the user’s stage (idea, MVP, early revenue, scaling).

OUTPUT FORMAT:
{
  "roadmap_steps": [
    {"step": "string", "actions": ["string", "..."], "measurement": "string", "timeline": "string"}
  ],
  "business_plan": {
    "budget_considerations": ["string", "..."],
    "ops_considerations": ["string", "..."],
    "gtm_considerations": ["string", "..."]
  }
}
`;

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
  const [woopSummary, setWoopSummary] = useState<WoopIntakeSummary | null>(null);
  const [woopWish, setWoopWish] = useState<WoopWish | null>(null);
  const [woopOutcome, setWoopOutcome] = useState<WoopOutcome | null>(null);
  const [woopObstacles, setWoopObstacles] = useState<WoopObstacles | null>(null);
  const [woopPlan, setWoopPlan] = useState<WoopPlan | null>(null);
  const [woopLoading, setWoopLoading] = useState(false);
  const [woopError, setWoopError] = useState<string | null>(null);

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

  const handleGenerateWoopReport = async () => {
    if (woopLoading) {
      return;
    }

    setWoopLoading(true);
    setWoopError(null);

    try {
      const conversationHistory: AzureChatMessage[] = [];

      const runStep = async <T,>(prompt: string, label: string, maxTokens?: number) => {
        const messages: AzureChatMessage[] = [...conversationHistory, { role: 'user', content: prompt }];
        const responseText = await callAzureChatCompletion(messages, {
          maxTokens: maxTokens ?? 900
        });

        conversationHistory.push({ role: 'user', content: prompt });
        conversationHistory.push({ role: 'assistant', content: responseText });

        try {
          return parseAzureJSON<T>(responseText);
        } catch (error) {
          console.error(`Failed to parse ${label} response`, error, responseText);
          throw new Error(`Unable to parse ${label} response into JSON.`);
        }
      };

      const intakePrompt = buildWoopIntakePrompt(user);
      const intake = await runStep<WoopIntakeSummary>(intakePrompt, 'intake summary', 1600);
      setWoopSummary(intake);

      const wish = await runStep<WoopWish>(WOOP_WISH_PROMPT, 'wish', 600);
      setWoopWish(wish);

      const outcome = await runStep<WoopOutcome>(WOOP_OUTCOME_PROMPT, 'outcome', 700);
      setWoopOutcome(outcome);

      const obstacles = await runStep<WoopObstacles>(WOOP_OBSTACLE_PROMPT, 'obstacles', 700);
      setWoopObstacles(obstacles);

      const plan = await runStep<WoopPlan>(WOOP_PLAN_PROMPT, 'plan', 900);
      setWoopPlan(plan);
    } catch (error) {
      if (error instanceof Error) {
        setWoopError(error.message);
      } else {
        setWoopError('An unknown error occurred while generating the WOOP report.');
      }
    } finally {
      setWoopLoading(false);
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

      case 'business-plan-creation': {
        const hasWoopReport =
          Boolean(woopSummary && woopWish && woopOutcome && woopObstacles && woopPlan);
        const readableTimeframe = (() => {
          if (!woopSummary) return 'Not specified';
          switch (woopSummary.goal_setting.timeframe) {
            case '24h':
              return '24 hours';
            case '4w':
              return '4 weeks';
            case '3m':
              return '3 months';
            case '12m':
              return '12 months';
            case 'none':
              return 'None specified';
            default:
              return 'Not specified';
          }
        })();
        const goalSetting = woopSummary?.goal_setting;
        const topSkills = woopSummary?.skillcraft_summary.top_skills ?? [];
        const personality = woopSummary?.skillcraft_summary.personality;
        const derivedInsights = woopSummary?.derived_insights;
        const availability = woopSummary?.availability;
        const assumptions = woopSummary?.assumptions ?? [];
        const normalizedSkills = woopSummary?.normalizations?.skills_taxonomy ?? [];
        const strengths = derivedInsights?.strengths ?? [];
        const risks = derivedInsights?.risks ?? [];
        const capabilityGaps = derivedInsights?.capability_gaps ?? [];
        const learningTopics = derivedInsights?.learning_topics ?? [];
        const personalityImplications = derivedInsights?.personality_implications ?? [];
        const availabilityWindows = availability?.weekly_windows ?? [];
        const roadmapSteps = woopPlan?.roadmap_steps ?? [];
        const budgetConsiderations = woopPlan?.business_plan?.budget_considerations ?? [];
        const opsConsiderations = woopPlan?.business_plan?.ops_considerations ?? [];
        const gtmConsiderations = woopPlan?.business_plan?.gtm_considerations ?? [];

        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-primary to-neuro-primary-light neuro-animate-float">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Business Plan Creation</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Generate an Azure OpenAI-powered WOOP business plan tailored to your entrepreneurial goals.
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-semibold neuro-text-primary">Automated WOOP report</h3>
                  <p className="text-sm md:text-base neuro-text-secondary">
                    Azure OpenAI is called five times: first to assemble a structured intake summary, then once for each WOOP pillar (Wish, Outcome, Obstacles, Plan) while preserving conversation history.
                  </p>
                </div>
                <button
                  onClick={handleGenerateWoopReport}
                  disabled={woopLoading}
                  className={`neuro-button-primary inline-flex items-center justify-center px-6 py-3 rounded-neuro-lg text-base font-semibold transition-all duration-300 ${
                    woopLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  {woopLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate WOOP Report
                    </>
                  )}
                </button>
              </div>

              {woopError && (
                <div className="neuro-inset p-5 rounded-neuro border border-neuro-error/40 bg-neuro-error/10 text-neuro-error mb-6 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Azure OpenAI request failed</p>
                    <p className="text-sm opacity-80">{woopError}</p>
                  </div>
                </div>
              )}

              {woopLoading && (
                <div className="neuro-inset p-6 rounded-neuro flex items-start space-x-4 mb-6">
                  <Loader2 className="w-6 h-6 text-neuro-primary animate-spin mt-1" />
                  <div>
                    <p className="font-semibold neuro-text-primary">Generating WOOP plan...</p>
                    <p className="text-sm neuro-text-secondary">
                      Azure OpenAI is synthesizing your SkillCraft data and goals across sequential calls. This may take a few moments.
                    </p>
                  </div>
                </div>
              )}

              {hasWoopReport ? (
                <div className="space-y-8">
                  <div className="neuro-surface p-8 rounded-neuro-lg space-y-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-4">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold neuro-text-primary">WOOP Intake Summary</h3>
                        <p className="neuro-text-secondary">
                          Structured profile synthesized from SkillCraft insights and goal-setting inputs.
                        </p>
                      </div>
                    </div>
                    <p className="neuro-text-primary leading-relaxed">{woopSummary?.summary}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="neuro-inset p-5 rounded-neuro space-y-3">
                        <h4 className="font-semibold neuro-text-primary">Goal Setting</h4>
                        <div className="text-sm neuro-text-secondary space-y-2">
                          <div>
                            <span className="font-semibold text-neuro-primary">Primary goal:</span>{' '}
                            {goalSetting?.primary_goal || 'Not specified'}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Timeframe:</span>{' '}
                            {readableTimeframe}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Previous experience:</span>
                            {goalSetting?.previous_experience?.length ? (
                              <ul className="list-disc list-inside space-y-1 mt-1">
                                {goalSetting.previous_experience.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="italic text-xs mt-1">No previous experience noted.</p>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Current skills:</span>
                            {goalSetting?.current_skills?.length ? (
                              <ul className="list-disc list-inside space-y-1 mt-1">
                                {goalSetting.current_skills.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="italic text-xs mt-1">No skills captured.</p>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Current challenges:</span>
                            {goalSetting?.current_challenges?.length ? (
                              <ul className="list-disc list-inside space-y-1 mt-1">
                                {goalSetting.current_challenges.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="italic text-xs mt-1">No challenges captured.</p>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Constraints:</span>
                            {goalSetting?.constraints?.length ? (
                              <ul className="list-disc list-inside space-y-1 mt-1">
                                {goalSetting.constraints.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="italic text-xs mt-1">No constraints noted.</p>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Time commitment:</span>{' '}
                            {goalSetting?.time_commitment_hours_per_week != null
                              ? `${goalSetting.time_commitment_hours_per_week} hrs/week`
                              : 'Not specified'}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Budget cap:</span>{' '}
                            {goalSetting?.budget_usd_cap != null
                              ? `$${goalSetting.budget_usd_cap.toLocaleString()}`
                              : 'Not specified'}
                          </div>
                        </div>
                      </div>

                      <div className="neuro-inset p-5 rounded-neuro space-y-3">
                        <h4 className="font-semibold neuro-text-primary">SkillCraft Highlights</h4>
                        <div className="text-sm neuro-text-secondary space-y-2">
                          <div>
                            <span className="font-semibold text-neuro-primary">Top skills:</span>
                            {topSkills.length ? (
                              <ul className="list-disc list-inside space-y-1 mt-1">
                                {topSkills.map((skill, index) => (
                                  <li key={index}>
                                    <span className="font-semibold text-neuro-primary">{skill.name}:</span>{' '}
                                    {skill.evidence}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="italic text-xs mt-1">No SkillCraft skills provided.</p>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Personality notes:</span>
                            <p className="mt-1">{personality?.notes || 'Not provided.'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-wide">
                            <div>
                              Extraversion:{' '}
                              <span className="text-neuro-primary font-semibold normal-case">
                                {personality?.extraversion ?? 'n/a'}
                              </span>
                            </div>
                            <div>
                              Agreeableness:{' '}
                              <span className="text-neuro-primary font-semibold normal-case">
                                {personality?.agreeableness ?? 'n/a'}
                              </span>
                            </div>
                            <div>
                              Conscientiousness:{' '}
                              <span className="text-neuro-primary font-semibold normal-case">
                                {personality?.conscientiousness ?? 'n/a'}
                              </span>
                            </div>
                            <div>
                              Emotional regulation:{' '}
                              <span className="text-neuro-primary font-semibold normal-case">
                                {personality?.emotional_regulation ?? 'n/a'}
                              </span>
                            </div>
                            <div>
                              Openness:{' '}
                              <span className="text-neuro-primary font-semibold normal-case">
                                {personality?.openness ?? 'n/a'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Source:</span>{' '}
                            {woopSummary?.skillcraft_summary.source_doc}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="neuro-inset p-5 rounded-neuro space-y-4">
                        <h4 className="font-semibold neuro-text-primary">Derived Insights</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            { title: 'Strengths', items: strengths },
                            { title: 'Risks', items: risks },
                            { title: 'Capability gaps', items: capabilityGaps },
                            { title: 'Learning topics', items: learningTopics },
                            { title: 'Personality implications', items: personalityImplications }
                          ].map((section) => (
                            <div key={section.title}>
                              <h5 className="font-semibold text-neuro-primary text-sm mb-1">{section.title}</h5>
                              {section.items.length ? (
                                <ul className="list-disc list-inside space-y-1 text-sm neuro-text-secondary">
                                  {section.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs italic neuro-text-secondary">Not provided.</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="neuro-inset p-5 rounded-neuro space-y-4">
                        <h4 className="font-semibold neuro-text-primary">Logistics & Confidence</h4>
                        <div className="text-sm neuro-text-secondary space-y-3">
                          <div>
                            <span className="font-semibold text-neuro-primary">Assumptions:</span>
                            {assumptions.length ? (
                              <ul className="list-disc list-inside space-y-1 mt-1">
                                {assumptions.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="italic text-xs mt-1">No assumptions captured.</p>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Confidence:</span>{' '}
                            {woopSummary?.confidence ?? 'Not specified'}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Availability:</span>
                            {availabilityWindows.length ? (
                              <ul className="list-disc list-inside space-y-1 mt-1">
                                {availabilityWindows.map((window, index) => (
                                  <li key={`${window.day}-${index}`}>
                                    {window.day}: {window.start_local} - {window.end_local}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="italic text-xs mt-1">No availability provided.</p>
                            )}
                            {availability?.notes && (
                              <p className="text-xs mt-2 italic">{availability.notes}</p>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-neuro-primary">Normalized skills:</span>
                            {normalizedSkills.length ? (
                              <ul className="list-disc list-inside space-y-1 mt-1">
                                {normalizedSkills.map((item, index) => (
                                  <li key={index}>
                                    {item.raw} → <span className="font-semibold text-neuro-primary">{item.normalized}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="italic text-xs mt-1">No skill mappings captured.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Wish Section */}
                    <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-4">
                          <span className="text-white font-bold text-2xl">W</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold neuro-text-primary">Wish</h3>
                          <p className="neuro-text-secondary">Ambitious yet achievable business aspiration</p>
                        </div>
                      </div>

                      <div className="neuro-inset p-6 rounded-neuro mb-4">
                        <h4 className="font-bold neuro-text-primary mb-3">Wish Statement</h4>
                        <p className="neuro-text-primary text-lg mb-4">{woopWish?.wish_statement}</p>
                        <div className="neuro-surface p-4 rounded-neuro">
                          <h5 className="font-semibold neuro-text-primary mb-2">Rationale</h5>
                          <p className="neuro-text-secondary">{woopWish?.rationale}</p>
                        </div>
                      </div>

                      {woopWish?.clarifying_question && (
                        <div className="neuro-surface p-4 rounded-neuro bg-gradient-to-r from-neuro-primary/10 to-neuro-primary-light/10">
                          <h5 className="font-semibold neuro-text-primary mb-2">💡 Clarifying Question</h5>
                          <p className="neuro-text-secondary">{woopWish.clarifying_question}</p>
                        </div>
                      )}
                    </div>

                    {/* Outcome Section */}
                    <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-4">
                          <span className="text-white font-bold text-2xl">O</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold neuro-text-primary">Outcome</h3>
                          <p className="neuro-text-secondary">Visible signals of success</p>
                        </div>
                      </div>

                      <div className="neuro-inset p-6 rounded-neuro mb-4">
                        <h4 className="font-bold neuro-text-primary mb-3">Positive Outcome</h4>
                        <p className="neuro-text-primary text-xl font-semibold mb-4 text-center bg-gradient-to-r from-neuro-success to-green-400 bg-clip-text text-transparent">
                          {woopOutcome?.positive_outcome}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <h5 className="font-semibold neuro-text-primary mb-3">Success Metrics</h5>
                            <div className="space-y-2">
                              {(woopOutcome?.success_metrics ?? []).length ? (
                                woopOutcome?.success_metrics.map((metric, index) => (
                                  <div key={index} className="flex items-center">
                                    <div className="w-6 h-6 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-3">
                                      <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="neuro-text-secondary">{metric}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm neuro-text-secondary italic">No metrics provided.</p>
                              )}
                            </div>
                          </div>

                          <div className="neuro-surface p-4 rounded-neuro">
                            <h5 className="font-semibold neuro-text-primary mb-2">Rationale</h5>
                            <p className="neuro-text-secondary">{woopOutcome?.rationale}</p>
                          </div>
                        </div>
                      </div>

                      {woopOutcome?.clarifying_question && (
                        <div className="neuro-surface p-4 rounded-neuro bg-gradient-to-r from-neuro-success/10 to-green-400/10">
                          <h5 className="font-semibold neuro-text-primary mb-2">💡 Clarifying Question</h5>
                          <p className="neuro-text-secondary">{woopOutcome.clarifying_question}</p>
                        </div>
                      )}
                    </div>

                    {/* Obstacles Section */}
                    <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-4">
                          <span className="text-white font-bold text-2xl">O</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold neuro-text-primary">Obstacles</h3>
                          <p className="neuro-text-secondary">Key blockers to anticipate</p>
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
                            {(woopObstacles?.internal_obstacles ?? []).length ? (
                              woopObstacles?.internal_obstacles.map((item, index) => (
                                <div key={index} className="flex items-start">
                                  <span className="w-2 h-2 bg-neuro-error rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                  <span className="neuro-text-secondary text-sm">{item}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm neuro-text-secondary italic">No internal obstacles identified.</p>
                            )}
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
                            {(woopObstacles?.external_obstacles ?? []).length ? (
                              woopObstacles?.external_obstacles.map((item, index) => (
                                <div key={index} className="flex items-start">
                                  <span className="w-2 h-2 bg-neuro-warning rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                  <span className="neuro-text-secondary text-sm">{item}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm neuro-text-secondary italic">No external obstacles identified.</p>
                            )}
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
                            {(woopObstacles?.capability_gaps ?? []).length ? (
                              woopObstacles?.capability_gaps.map((item, index) => (
                                <div key={index} className="flex items-start">
                                  <span className="w-2 h-2 bg-neuro-secondary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                  <span className="neuro-text-secondary text-sm">{item}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm neuro-text-secondary italic">No capability gaps identified.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="neuro-surface p-4 rounded-neuro mb-4">
                        <h5 className="font-semibold neuro-text-primary mb-2">Rationale</h5>
                        <p className="neuro-text-secondary">{woopObstacles?.rationale}</p>
                      </div>

                      {woopObstacles?.clarifying_question && (
                        <div className="neuro-surface p-4 rounded-neuro bg-gradient-to-r from-neuro-warning/10 to-yellow-400/10">
                          <h5 className="font-semibold neuro-text-primary mb-2">💡 Clarifying Question</h5>
                          <p className="neuro-text-secondary">{woopObstacles.clarifying_question}</p>
                        </div>
                      )}
                    </div>

                    {/* Plan Section */}
                    <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-4">
                          <span className="text-white font-bold text-2xl">P</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold neuro-text-primary">Plan</h3>
                          <p className="neuro-text-secondary">Step-by-step roadmap and business considerations</p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-xl font-bold neuro-text-primary mb-6">Roadmap Steps</h4>
                        <div className="space-y-6">
                          {roadmapSteps.length ? (
                            roadmapSteps.map((step, index) => (
                              <div key={index} className="neuro-inset p-6 rounded-neuro">
                                <div className="flex items-start justify-between mb-4">
                                  <h5 className="text-lg font-bold neuro-text-primary">{step.step}</h5>
                                  <span className="neuro-surface px-3 py-1 rounded-neuro-sm text-sm font-semibold text-neuro-primary">
                                    {step.timeline || 'Timeline TBD'}
                                  </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                    <h6 className="font-semibold neuro-text-primary mb-3">Actions</h6>
                                    <div className="space-y-2">
                                      {step.actions?.length ? (
                                        step.actions.map((action, actionIndex) => (
                                          <div key={actionIndex} className="flex items-start">
                                            <div className="w-4 h-4 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-3 mt-1">
                                              <div className="w-1 h-1 bg-white rounded-full"></div>
                                            </div>
                                            <span className="neuro-text-secondary text-sm">{action}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-sm neuro-text-secondary italic">No actions provided.</p>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h6 className="font-semibold neuro-text-primary mb-3">Success Measurement</h6>
                                    <div className="neuro-surface p-3 rounded-neuro">
                                      <span className="neuro-text-secondary text-sm">{step.measurement || 'No measurement specified.'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm neuro-text-secondary italic">No roadmap steps provided.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold neuro-text-primary mb-6">Business Plan Considerations</h4>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="neuro-inset p-6 rounded-neuro">
                            <h5 className="font-bold neuro-text-primary mb-4 flex items-center">
                              <DollarSign className="w-5 h-5 text-neuro-warning mr-2" />
                              Budget Considerations
                            </h5>
                            <div className="space-y-2">
                              {budgetConsiderations.length ? (
                                budgetConsiderations.map((item, index) => (
                                  <div key={index} className="flex items-start">
                                    <span className="w-2 h-2 bg-neuro-warning rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span className="neuro-text-secondary text-sm">{item}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm neuro-text-secondary italic">No budget notes provided.</p>
                              )}
                            </div>
                          </div>

                          <div className="neuro-inset p-6 rounded-neuro">
                            <h5 className="font-bold neuro-text-primary mb-4 flex items-center">
                              <Building2 className="w-5 h-5 text-neuro-primary mr-2" />
                              Operations Considerations
                            </h5>
                            <div className="space-y-2">
                              {opsConsiderations.length ? (
                                opsConsiderations.map((item, index) => (
                                  <div key={index} className="flex items-start">
                                    <span className="w-2 h-2 bg-neuro-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span className="neuro-text-secondary text-sm">{item}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm neuro-text-secondary italic">No operations notes provided.</p>
                              )}
                            </div>
                          </div>

                          <div className="neuro-inset p-6 rounded-neuro">
                            <h5 className="font-bold neuro-text-primary mb-4 flex items-center">
                              <TrendingUp className="w-5 h-5 text-neuro-secondary mr-2" />
                              GTM Considerations
                            </h5>
                            <div className="space-y-2">
                              {gtmConsiderations.length ? (
                                gtmConsiderations.map((item, index) => (
                                  <div key={index} className="flex items-start">
                                    <span className="w-2 h-2 bg-neuro-secondary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span className="neuro-text-secondary text-sm">{item}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm neuro-text-secondary italic">No GTM notes provided.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                !woopLoading && (
                  <div className="neuro-inset p-8 rounded-neuro text-center text-neuro-secondary">
                    <p className="text-lg font-semibold neuro-text-primary mb-2">No WOOP plan generated yet</p>
                    <p className="text-sm">
                      Click &ldquo;Generate WOOP Report&rdquo; to run the Azure OpenAI workflow and populate your personalized business plan.
                    </p>
                  </div>
                )
              )}

              {hasWoopReport && (
                <div className="text-center neuro-inset p-6 rounded-neuro-lg mt-8">
                  <button
                    onClick={() => completeStep('business-plan-creation', 'ai-mentor-program')}
                    className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg hover:scale-105 transition-all duration-300"
                  >
                    <FileText className="w-6 h-6 mr-3" />
                    <span>Mark WOOP Plan as Complete</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      }

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

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { BusinessDevelopmentIntake, LearningPlanRecommendation, User, VentureStage } from '../../../types';
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
  AlertCircle,
  BookOpen,
  Clock,
  RefreshCw,
  Compass
} from 'lucide-react';
import { entrepreneurSteps } from './entrepreneurSteps';

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

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : 'Not provided by the user.';
  }

  try {
    const asObject = value as Record<string, unknown>;
    if (asObject && Object.keys(asObject).length === 0) {
      return 'Not provided by the user.';
    }

    return JSON.stringify(value, null, 2);
  } catch (error) {
    console.error('Failed to stringify prompt value', error, value);
    return String(value);
  }
};

const getFirstFilledValue = (...values: unknown[]) => {
  for (const value of values) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      continue;
    }

    if (Array.isArray(value) && value.length === 0) {
      continue;
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      if (Object.keys(record).length === 0) {
        continue;
      }
    }

    return value;
  }

  return null;
};

const assessmentOptionLabels: Record<string, Record<string, string>> = {
  career_goal: {
    start_business: 'Start my own business or become an entrepreneur',
    find_job: 'Find a good job with a stable company',
    advance_career: 'Advance in my current career path',
    executive_role: 'Transition to senior executive or leadership role'
  },
  experience_level: {
    new_graduate: 'Recent graduate or new to the workforce',
    some_experience: '1-3 years of professional experience',
    experienced: '4-10 years of professional experience',
    senior_professional: '10+ years with leadership experience'
  },
  risk_tolerance: {
    risk_averse: 'I prefer stability and predictable outcomes',
    moderate_risk: "I'm comfortable with some calculated risks",
    high_risk: 'I thrive on high-risk, high-reward opportunities',
    very_high_risk: 'I love uncertainty and creating something from nothing'
  },
  leadership_style: {
    team_player: 'I prefer working as part of a team with clear guidance',
    independent_contributor: 'I work best independently with minimal supervision',
    team_leader: 'I enjoy leading teams and managing projects',
    visionary_leader: 'I love creating vision and building organizations from scratch'
  },
  industry_interest: {
    established_company: 'Established company with clear processes and benefits',
    growing_company: 'Growing company where I can advance quickly',
    startup_environment: 'Fast-paced startup or innovative company',
    own_venture: 'My own business where I control everything'
  },
  financial_goals: {
    stable_income: 'Steady, predictable income with good benefits',
    growing_salary: 'Gradually increasing salary with career progression',
    high_compensation: 'High compensation commensurate with expertise',
    unlimited_potential: 'Unlimited earning potential, willing to sacrifice short-term'
  }
};

const normalizeVentureStage = (stage: string | null | undefined): VentureStage => {
  switch (stage) {
    case 'MVP':
    case 'early_revenue':
    case 'scaling':
      return stage;
    default:
      return 'idea';
  }
};

const parseNumericTimeCommitment = (value?: string | null): number | null => {
  if (!value) {
    return null;
  }

  const match = value.match(/\d+/);
  if (!match) {
    return null;
  }

  const parsed = Number.parseInt(match[0], 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const formatDifficultyLabel = (difficulty: string | null | undefined) => {
  if (!difficulty) {
    return 'All levels';
  }

  return difficulty
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

type BusinessDevelopmentIntakeFormState = {
  ideaName: string;
  ideaSummary: string;
  ideaProblem: string;
  ideaImportance: string;
  mainCustomer: string;
  customerPainPoint: string;
  ideaBenefit: string;
  existingOptions: string;
  differentiator: string;
  offeringType: string;
  revenueApproach: string;
  potentialPartners: string;
  immediateNeeds: string;
  successDefinition: string;
};

const createInitialBusinessIntakeForm = (
  intake?: BusinessDevelopmentIntake | null
): BusinessDevelopmentIntakeFormState => ({
  ideaName: intake?.ideaName ?? '',
  ideaSummary: intake?.ideaSummary ?? '',
  ideaProblem: intake?.ideaProblem ?? '',
  ideaImportance: intake?.ideaImportance ?? '',
  mainCustomer: intake?.mainCustomer ?? '',
  customerPainPoint: intake?.customerPainPoint ?? '',
  ideaBenefit: intake?.ideaBenefit ?? '',
  existingOptions: intake?.existingOptions ?? '',
  differentiator: intake?.differentiator ?? '',
  offeringType: intake?.offeringType ?? '',
  revenueApproach: intake?.revenueApproach ?? '',
  potentialPartners: intake?.potentialPartners ?? '',
  immediateNeeds: intake?.immediateNeeds ?? '',
  successDefinition: intake?.successDefinition ?? ''
});

const buildWoopIntakePrompt = (user: User | null) => {
  const profile = user?.profile ?? {};
  const skillcraftText = "Processing Speed (96.46): Very fast on timed connection tasks; Visual–Spatial (100.00): Top performance on short-term visual memory (longest Corsi span reached the benchmark);Problem Solving (77.78): Strong learning from feedback in the maze (most of the scored trials were correct);Attention (92.0): High sustained attention and target accuracy;Concentration (72.22): Good digit memory; backward span (harder) and forward span averaged to a solid score;Persistence (83.33): Stuck with the motor task for a substantial portion of time; good perseverance;Emotional Intelligence;Self-Awareness (83.33): Clear sense of one’s feelings and internal states;Self-Management (40.0): More variability with regulating emotions/impulses under pressure;Social Awareness (75.0): Strong capacity to read others and social cues;Extraversion (79.17): Tends toward outgoing/energetic;Agreeableness (70.83): Cooperative and considerate;Conscientiousness (66.67): Organized and goal-directed;Emotional Stability (62.5): Generally calm/resilient with some stress sensitivity;Openness (66.67): Curious and receptive to new ideas/experiences;Growth Mindset (56.25): Moderately growth-oriented beliefs (some room to strengthen “abilities can improve with effort”).";

  const toReadableLabel = (key: string) =>
    key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
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

  type GoalSettingRecord = {
    businessIdea?: unknown;
    businessCategory?: unknown;
    experienceYears?: unknown;
    timeCommitment?: unknown;
    careerGoals?: unknown;
    skillsToImprove?: unknown;
  };

  type WageQuestionnaireRecord = {
    workExperience?: unknown;
  };

  type PriorExperienceRecord = {
    workExperience?: unknown;
    educationLevel?: unknown;
    careerGoals?: unknown;
    skillsConfidence?: unknown;
    learningStyle?: unknown;
    timeAvailable?: unknown;
  };

  type BusinessDevelopmentIntakeRecord = {
    ideaName?: unknown;
    ideaSummary?: unknown;
    ideaProblem?: unknown;
    ideaImportance?: unknown;
    mainCustomer?: unknown;
    customerPainPoint?: unknown;
    ideaBenefit?: unknown;
    existingOptions?: unknown;
    differentiator?: unknown;
    offeringType?: unknown;
    revenueApproach?: unknown;
    potentialPartners?: unknown;
    immediateNeeds?: unknown;
    successDefinition?: unknown;
  };

  const goalSettingData = getRecordFromProfile('goalSettingData') as GoalSettingRecord | undefined;
  const wageQuestionnaire = getRecordFromProfile('wageEmploymentQuestionnaire') as
    | WageQuestionnaireRecord
    | undefined;
  const priorExperience = getRecordFromProfile('priorExperience') as PriorExperienceRecord | undefined;
  const businessDevelopmentIntake = getRecordFromProfile('businessDevelopmentIntake') as
    | BusinessDevelopmentIntakeRecord
    | undefined;

  const businessIdeaValue = getFirstFilledValue(
    businessDevelopmentIntake?.ideaSummary,
    profile.businessIdea,
    goalSettingData?.businessIdea,
    extendedProfile?.businessIdea,
    priorExperience?.careerGoals
  );

  const careerLevelValue = getFirstFilledValue(
    extendedProfile?.careerLevel,
    priorExperience?.educationLevel
  );

  const hasWorkExperienceValue = getFirstFilledValue(
    extendedProfile?.hasWorkExperience,
    priorExperience?.workExperience ? 'Yes - ' + priorExperience.workExperience : null
  );

  const goalSettingLinesSections: string[] = [
    'USER OVERVIEW',
    `Full name: ${formatPromptValue(user?.fullName)}`,
    `User location: ${formatPromptValue(user?.location)}`,
    `Primary contact email: ${formatPromptValue(user?.email)}`,
    `Phone number: ${formatPromptValue(user?.phoneNumber)}`,
    `Selected track: ${formatPromptValue(user?.selectedTrack)}`,
    '',
    'BUSINESS DEVELOPMENT INTAKE RESPONSES',
  ];

  const appendIntakeValue = (label: string, value: unknown) => {
    goalSettingLinesSections.push(`${label}: ${formatPromptValue(value)}`);
  };

  appendIntakeValue('Idea name', businessDevelopmentIntake?.ideaName);
  appendIntakeValue('One sentence summary', businessIdeaValue);
  appendIntakeValue('The problem', businessDevelopmentIntake?.ideaProblem);
  appendIntakeValue('Why it matters', businessDevelopmentIntake?.ideaImportance);
  appendIntakeValue('Main customer or user', businessDevelopmentIntake?.mainCustomer);
  appendIntakeValue('Their biggest pain point', businessDevelopmentIntake?.customerPainPoint);
  appendIntakeValue('How your idea helps', businessDevelopmentIntake?.ideaBenefit);
  appendIntakeValue('Existing options', businessDevelopmentIntake?.existingOptions);
  appendIntakeValue('Your edge', businessDevelopmentIntake?.differentiator);
  appendIntakeValue('What you will offer', businessDevelopmentIntake?.offeringType);
  appendIntakeValue("How you'll earn money", businessDevelopmentIntake?.revenueApproach);
  appendIntakeValue('Who you might work with', businessDevelopmentIntake?.potentialPartners);
  appendIntakeValue('What do you need right now?', businessDevelopmentIntake?.immediateNeeds);
  appendIntakeValue('What success looks like', businessDevelopmentIntake?.successDefinition);
  appendIntakeValue('Career level', careerLevelValue);
  appendIntakeValue('Has work experience', hasWorkExperienceValue);

  goalSettingLinesSections.push('', 'ASSESSMENT QUESTIONNAIRE RESPONSES');

  if (assessmentResponses && Object.keys(assessmentResponses).length > 0) {
    Object.entries(assessmentResponses).forEach(([key, value]) => {
      const valueLabel =
        typeof value === 'string'
          ? assessmentOptionLabels[key]?.[value] ?? value
          : value;
      goalSettingLinesSections.push(`${toReadableLabel(key)}: ${formatPromptValue(valueLabel)}`);
    });
  } else {
    goalSettingLinesSections.push('Assessment questionnaire responses: Not provided by the user.');
  }

  if (goalSettingData) {
    goalSettingLinesSections.push(
      '',
      'Scope the Idea (Opportunity Track)',
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

  if (priorExperience) {
    goalSettingLinesSections.push(
      '',
      'PRIOR EXPERIENCE SNAPSHOT',
      `Work experience: ${formatPromptValue(priorExperience.workExperience)}`,
      `Education level: ${formatPromptValue(priorExperience.educationLevel)}`,
      `Career goals: ${formatPromptValue(priorExperience.careerGoals)}`,
      `Skills confidence: ${formatPromptValue(priorExperience.skillsConfidence)}`,
      `Preferred learning style: ${formatPromptValue(priorExperience.learningStyle)}`,
      `Time available: ${formatPromptValue(priorExperience.timeAvailable)}`
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
Ingest the attached SkillCraft report (PDF text below) and the intake text captured from the user. Produce a single, durable JSON summary we can reuse for subsequent W-O-O-P business-plan steps. DO NOT retrieve any data. Do NOT search for courses. Do NOT fabricate facts. If information is missing or unclear, add it to "assumptions" and set "confidence":"low".

INPUTS
[SKILLCRAFT_PDF]
${skillcraftText}

[INTAKE_TEXT]
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
- The **business_plan** property MUST strictly adhere to the King’s Trust (Prince’s Trust) Business Plan JSON Schema provided below.

OUTPUT FORMAT:
{
  "roadmap_steps": [
    {"step": "string", "actions": ["string", "..."], "measurement": "string", "timeline": "string"}
  ],
  "business_plan": "King's Trust business plan object matching the schema below"
}

BUSINESS PLAN JSON SCHEMA (for the business_plan property only):
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/kings-trust-business-plan.schema.json",
  "title": "King's Trust (Prince's Trust) Business Plan",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "getting_started",
    "section_1_executive_summary",
    "section_2_owner_background",
    "section_3_products_services",
    "section_4_market",
    "section_5_market_research",
    "section_6_marketing_strategy",
    "section_7_competitor_analysis",
    "section_8_operations_logistics",
    "section_9_costs_pricing_strategy",
    "section_10_financial_forecasts",
    "section_11_backup_plan"
  ],
  "properties": {
    "metadata": {
      "type": "object",
      "description": "Optional metadata for your system.",
      "additionalProperties": false,
      "properties": {
        "version": { "type": "string", "default": "1.0.0" },
        "generated_at": { "type": "string", "format": "date-time" },
        "authoring_tool": { "type": "string" }
      }
    },
    "getting_started": {
      "type": "object",
      "title": "Whose plan is this?",
      "additionalProperties": false,
      "required": ["business_name", "owners", "business_contacts"],
      "properties": {
        "business_name": { "type": "string", "minLength": 1 },
        "owners": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "required": ["name"],
            "additionalProperties": false,
            "properties": {
              "name": { "type": "string" },
              "role": { "type": "string" },
              "email": { "type": "string", "format": "email" },
              "phone": { "type": "string" }
            }
          }
        },
        "business_contacts": {
          "type": "object",
          "required": ["address"],
          "additionalProperties": false,
          "properties": {
            "address": { "type": "string" },
            "postcode": { "type": "string" },
            "telephone": { "type": "string" },
            "email": { "type": "string", "format": "email" }
          }
        },
        "home_contacts": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "address": { "type": "string" },
            "postcode": { "type": "string" },
            "telephone": { "type": "string" },
            "email": { "type": "string", "format": "email" }
          }
        }
      }
    },
    "section_1_executive_summary": {
      "type": "object",
      "title": "Section 1 – Executive Summary",
      "additionalProperties": false,
      "required": ["business_summary", "business_aims", "financial_summary", "elevator_pitch"],
      "properties": {
        "business_summary": { "type": "string" },
        "business_aims": { "type": "string" },
        "financial_summary": { "type": "string" },
        "elevator_pitch": {
          "type": "object",
          "required": ["business_name", "strapline", "pitch"],
          "additionalProperties": false,
          "properties": {
            "business_name": { "type": "string" },
            "strapline": { "type": "string" },
            "pitch": { "type": "string" }
          }
        }
      }
    },
    "section_2_owner_background": {
      "type": "object",
      "title": "Section 2 – Owner’s Background",
      "additionalProperties": false,
      "required": ["motivation"],
      "properties": {
        "motivation": { "type": "string" },
        "work_experience": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "employer": { "type": "string" },
              "role": { "type": "string" },
              "dates": { "type": "string" },
              "responsibilities": { "type": "string" }
            }
          }
        },
        "qualifications_education": { "type": "string" },
        "training_completed": {
          "type": "array",
          "items": { "type": "string" }
        },
        "training_planned": {
          "type": "array",
          "items": { "type": "string" }
        },
        "hobbies_interests": { "type": "string" },
        "additional_information": { "type": "string" }
      }
    },
    "section_3_products_services": {
      "type": "object",
      "title": "Section 3 – Products and Services",
      "additionalProperties": false,
      "required": ["selling_type", "basic_description"],
      "properties": {
        "selling_type": {
          "type": "string",
          "enum": ["product", "service", "both"]
        },
        "basic_description": { "type": "string" },
        "offerings": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "description"],
            "additionalProperties": false,
            "properties": {
              "name": { "type": "string" },
              "description": { "type": "string" },
              "launch_phase": { "type": "string", "enum": ["start", "later"] },
              "planned_start_date": { "type": "string", "format": "date" }
            }
          }
        },
        "rollout_rationale": { "type": "string" },
        "additional_information": { "type": "string" }
      }
    },
    "section_4_market": {
      "type": "object",
      "title": "Section 4 – The Market",
      "additionalProperties": false,
      "required": ["customer_type", "typical_customer"],
      "properties": {
        "customer_type": {
          "type": "string",
          "enum": ["individuals", "businesses", "both"]
        },
        "typical_customer": { "type": "string" },
        "customer_locations": { "type": "string" },
        "buying_triggers": { "type": "string" },
        "choice_factors": { "type": "string" },
        "previous_sales": {
          "type": "object",
          "required": ["has_sold"],
          "additionalProperties": false,
          "properties": {
            "has_sold": { "type": "boolean" },
            "details": { "type": "string" }
          }
        },
        "waiting_customers": {
          "type": "object",
          "required": ["has_waiting_customers"],
          "additionalProperties": false,
          "properties": {
            "has_waiting_customers": { "type": "boolean" },
            "details": { "type": "string" }
          }
        },
        "additional_information": { "type": "string" }
      }
    },
    "section_5_market_research": {
      "type": "object",
      "title": "Section 5 – Market Research",
      "additionalProperties": false,
      "properties": {
        "desk_research_findings": { "type": "string" },
        "field_research_questionnaires": { "type": "string" },
        "field_research_test_trading": { "type": "string" },
        "additional_information": { "type": "string" }
      }
    },
    "section_6_marketing_strategy": {
      "type": "object",
      "title": "Section 6 – Marketing Strategy",
      "additionalProperties": false,
      "properties": {
        "activities": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["activity", "rationale"],
            "additionalProperties": false,
            "properties": {
              "activity": { "type": "string" },
              "rationale": { "type": "string" },
              "estimated_cost": { "type": "number", "minimum": 0 },
              "notes": { "type": "string" }
            }
          }
        },
        "total_estimated_cost": { "type": "number", "minimum": 0 }
      }
    },
    "section_7_competitor_analysis": {
      "type": "object",
      "title": "Section 7 – Competitor Analysis",
      "additionalProperties": false,
      "properties": {
        "competitors": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "name": { "type": "string" },
              "location": { "type": "string" },
              "product_service": { "type": "string" },
              "price": { "type": "string" },
              "strengths": { "type": "string" },
              "weaknesses": { "type": "string" },
              "business_size": { "type": "string" }
            }
          }
        },
        "swot": {
          "type": "object",
          "required": ["strengths", "weaknesses", "opportunities", "threats"],
          "additionalProperties": false,
          "properties": {
            "strengths": { "type": "string" },
            "weaknesses": { "type": "string" },
            "opportunities": { "type": "string" },
            "threats": { "type": "string" }
          }
        },
        "usp": { "type": "string" }
      }
    },
    "section_8_operations_logistics": {
      "type": "object",
      "title": "Section 8 – Operations and Logistics",
      "additionalProperties": false,
      "properties": {
        "production": { "type": "string" },
        "delivery": { "type": "string" },
        "payment_methods_terms": { "type": "string" },
        "suppliers": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "name": { "type": "string" },
              "location": { "type": "string" },
              "items_required": { "type": "string" },
              "prices": { "type": "string" },
              "payment_arrangements": { "type": "string" },
              "reason_for_choice": { "type": "string" }
            }
          }
        },
        "premises": { "type": "string" },
        "equipment": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "item": { "type": "string" },
              "already_owned": { "type": "boolean" },
              "condition": { "type": "string", "enum": ["new", "second_hand"] },
              "purchased_from": { "type": "string" },
              "price": { "type": "number", "minimum": 0 }
            }
          }
        },
        "transport": { "type": "string" },
        "legal_requirements": { "type": "string" },
        "insurance": { "type": "string" },
        "management_staff": { "type": "string" },
        "additional_information": { "type": "string" }
      }
    },
    "section_9_costs_pricing_strategy": {
      "type": "object",
      "title": "Section 9 – Costs and Pricing Strategy",
      "additionalProperties": false,
      "properties": {
        "pricing_table": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "product_service_name": { "type": "string" },
              "units_in_calc": { "type": "number", "minimum": 0 },
              "components": { "type": "string" },
              "total_cost": { "type": "number", "minimum": 0 },
              "cost_per_unit": { "type": "number", "minimum": 0 },
              "price_per_unit": { "type": "number", "minimum": 0 },
              "profit_margin_amount": { "type": "number" },
              "profit_margin_percent": { "type": "number" },
              "markup_percent": { "type": "number" }
            }
          }
        }
      }
    },
    "section_10_financial_forecasts": {
      "type": "object",
      "title": "Section 10 – Financial Forecasts",
      "additionalProperties": false,
      "required": ["sales_and_costs_forecast", "personal_survival_budget", "cashflow_forecast", "startup_costs_table"],
      "properties": {
        "sales_and_costs_forecast": {
          "type": "array",
          "minItems": 12,
          "maxItems": 12,
          "items": {
            "type": "object",
            "required": ["month_name", "sales_forecast", "costs_forecast"],
            "additionalProperties": false,
            "properties": {
              "month_index": { "type": "integer", "minimum": 1, "maximum": 12 },
              "month_name": { "type": "string" },
              "sales_forecast": { "type": "number", "minimum": 0 },
              "costs_forecast": { "type": "number", "minimum": 0 },
              "assumptions": { "type": "string" }
            }
          }
        },
        "personal_survival_budget": {
          "type": "object",
          "additionalProperties": false,
          "required": ["costs", "income"],
          "properties": {
            "costs": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["category", "monthly_cost"],
                "additionalProperties": false,
                "properties": {
                  "category": { "type": "string" },
                  "monthly_cost": { "type": "number", "minimum": 0 }
                }
              }
            },
            "income": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["source", "monthly_amount"],
                "additionalProperties": false,
                "properties": {
                  "source": { "type": "string" },
                  "monthly_amount": { "type": "number", "minimum": 0 }
                }
              }
            }
          }
        },
        "cashflow_forecast": {
          "type": "array",
          "minItems": 12,
          "maxItems": 12,
          "items": {
            "type": "object",
            "required": ["month_name", "money_in", "money_out"],
            "additionalProperties": false,
            "properties": {
              "month_index": { "type": "integer", "minimum": 1, "maximum": 12 },
              "month_name": { "type": "string" },
              "money_in": {
                "type": "object",
                "required": ["total"],
                "additionalProperties": false,
                "properties": {
                  "princes_trust_funding": { "type": "number", "minimum": 0 },
                  "other_funding": { "type": "number", "minimum": 0 },
                  "own_funds": { "type": "number", "minimum": 0 },
                  "sales_income": { "type": "number", "minimum": 0 },
                  "other": { "type": "number", "minimum": 0 },
                  "total": { "type": "number", "minimum": 0 }
                }
              },
              "money_out": {
                "type": "object",
                "required": ["total"],
                "additionalProperties": false,
                "properties": {
                  "trust_loan_repayments": { "type": "number", "minimum": 0 },
                  "personal_drawings": { "type": "number", "minimum": 0 },
                  "other": { "type": "number", "minimum": 0 },
                  "total": { "type": "number", "minimum": 0 }
                }
              },
              "opening_balance": { "type": "number" },
              "closing_balance": { "type": "number" }
            }
          }
        },
        "startup_costs_table": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["item", "calculation", "total_cost"],
            "additionalProperties": false,
            "properties": {
              "item": { "type": "string" },
              "calculation": { "type": "string" },
              "total_cost": { "type": "number", "minimum": 0 }
            }
          }
        }
      }
    },
    "section_11_backup_plan": {
      "type": "object",
      "title": "Section 11 – Back-up Plan",
      "additionalProperties": false,
      "properties": {
        "short_term_plan": { "type": "string" },
        "long_term_plan": { "type": "string" },
        "plan_b": { "type": "string" },
        "plan_b_additional": { "type": "string" }
      }
    }
  }
}
`;

export const EntrepreneurDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('skillcraft-entrepreneurship-tasks');
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [hasAcknowledgedBusinessPlan, setHasAcknowledgedBusinessPlan] = useState(false);
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
  const [learningPlan, setLearningPlan] = useState<LearningPlanRecommendation | null>(null);
  const [learningPlanLoading, setLearningPlanLoading] = useState(false);
  const [learningPlanError, setLearningPlanError] = useState<string | null>(null);
  const [businessIntakeForm, setBusinessIntakeForm] = useState<BusinessDevelopmentIntakeFormState>(() =>
    createInitialBusinessIntakeForm(user?.profile?.businessDevelopmentIntake ?? null)
  );

  useEffect(() => {
    setBusinessIntakeForm(createInitialBusinessIntakeForm(user?.profile?.businessDevelopmentIntake ?? null));
  }, [user?.profile?.businessDevelopmentIntake]);

  const handleBusinessIntakeChange = (
    field: keyof BusinessDevelopmentIntakeFormState,
    value: string
  ) => {
    setBusinessIntakeForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const ventureStage = normalizeVentureStage(woopSummary?.user_profile.stage);

  const preferredSkill = useMemo(() => {
    const learningTopics = woopSummary?.derived_insights?.learning_topics ?? [];
    if (learningTopics.length > 0) {
      return learningTopics[0];
    }

    const normalizedSkills = woopSummary?.normalizations?.skills_taxonomy ?? [];
    if (normalizedSkills.length > 0) {
      return normalizedSkills[0].normalized || normalizedSkills[0].raw;
    }

    const topSkills = woopSummary?.skillcraft_summary?.top_skills ?? [];
    if (topSkills.length > 0) {
      return topSkills[0].name;
    }

    if (user?.profile?.skillsToImprove) {
      const [firstSkill] = user.profile.skillsToImprove.split(',');
      if (firstSkill) {
        return firstSkill.trim();
      }
    }

    return 'Entrepreneurship Fundamentals';
  }, [user, woopSummary]);

  const backgroundSummary = useMemo(() => {
    return (
      user?.profile?.priorExperience?.workExperience ||
      user?.profile?.businessIdea ||
      user?.profile?.careerGoals ||
      woopSummary?.summary ||
      null
    );
  }, [user, woopSummary]);

  const region = useMemo(() => {
    if (woopSummary?.user_profile.region) {
      return woopSummary.user_profile.region;
    }
    if (user?.location) {
      return user.location;
    }
    return null;
  }, [user, woopSummary]);

  const timeCommitment = useMemo(() => {
    const fromWoop = woopSummary?.goal_setting.time_commitment_hours_per_week;
    if (typeof fromWoop === 'number') {
      return fromWoop;
    }

    const parsed = parseNumericTimeCommitment(user?.profile?.timeCommitment);
    return parsed ?? 0;
  }, [user, woopSummary]);

  const learningPlanContext = useMemo(
    () => ({
      skill: preferredSkill,
      user_info: {
        stage: ventureStage,
        region,
        background: backgroundSummary,
      },
      time_commitment_hours_per_week: timeCommitment,
    }),
    [preferredSkill, ventureStage, region, backgroundSummary, timeCommitment],
  );

  const fetchLearningPlan = useCallback(
    async (force = false) => {
      if (learningPlanLoading) {
        return;
      }

      if (learningPlan && !force) {
        return;
      }

      const ragflowBaseUrl = import.meta.env.VITE_RAGFLOW_BACKEND_URL;
      const ragflowApiKey = import.meta.env.VITE_RAGFLOW_BACKEND_API_KEY;
      const chatId = '697bf57c9a2111f0895b1a0199edd48c';

      if (!ragflowBaseUrl || !ragflowApiKey) {
        setLearningPlanError('Learning plan API configuration is missing.');
        return;
      }

      setLearningPlanLoading(true);
      setLearningPlanError(null);

      try {
        const normalizedBaseUrl = ragflowBaseUrl.replace(/\/$/, '');
        const endpoint = `${normalizedBaseUrl}/api/v1/chats_openai/${chatId}/chat/completions`;

        const userStage = learningPlanContext.user_info.stage;
        const userRegion = learningPlanContext.user_info.region ?? 'Maryland, USA';
        const userBackground =
          learningPlanContext.user_info.background ??
          'High school education with prior experience cooking at family events and no formal business background';
        const timeCommitmentHours = Math.max(learningPlanContext.time_commitment_hours_per_week, 0);

        const prompt = `Find 15 relevant courses (title, provider, URL) to develop the following skill: ${learningPlanContext.skill}\n\nThe user is at the ${userStage} stage of starting a food pop-up business in ${userRegion}, with the following background: ${userBackground}. To achieve their goals, they need to develop broader business skills in Business Financial Management, Regulatory Compliance & Permits, and Small Business Marketing & Customer Acquisition. The user can commit approximately ${timeCommitmentHours} hours per week to focused learning and skill development.\nGenerate a structured learning plan for business skills, tailored to the user’s profile and weekly time commitment.\n\nRetrieve real courses (title, provider, URL, difficulty, estimated hours). Do NOT invent.\nRank courses by fit (difficulty × user stage × time commitment).\nBuild a sequenced plan (what to take first, next, etc.) and specify how many hours the user should spend on EACH course.\nAfter the plan, also return ALL 15 retrieved courses (even those not chosen), for transparency.\nReturn VALID JSON only using the schema below (no extra text).\n{ "skill": "string", "user_info": { "stage": "idea|MVP|early_revenue|scaling", "region": "string|null", "background": "string|null" }, "time_commitment_hours_per_week": 0, "learning_plan": { "plan_summary": "string", "weekly_hours": 0, "total_duration_weeks": 0, "sequence": [ { "order": 1, "course_title": "string", "provider_name": "string", "url": "string", "difficulty": "beginner|intermediate|advanced|null", "estimated_hours": 0, "planned_weekly_hours": 0, "expected_duration_weeks": 0, "why_chosen": "string" } ] }, "all_relevant_courses": [ { "course_title": "string", "provider_name": "string", "url": "string", "difficulty": "beginner|intermediate|advanced|null", "estimated_hours": 0 } ], "assumptions": ["string", "..."], "confidence": "high|medium|low" }`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ragflowApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            stream: false,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Learning plan request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content || typeof content !== 'string') {
          throw new Error('Learning plan response did not include valid content.');
        }

        const parsed = JSON.parse(content) as LearningPlanRecommendation;
        setLearningPlan(parsed);
      } catch (error) {
        if (error instanceof Error) {
          setLearningPlanError(error.message);
        } else {
          setLearningPlanError('An unknown error occurred while fetching the learning plan.');
        }
      } finally {
        setLearningPlanLoading(false);
      }
    },
    [learningPlan, learningPlanContext, learningPlanLoading],
  );

  useEffect(() => {
    if (currentStep === 'learning-plan-recommendations') {
      void fetchLearningPlan();
    }
  }, [currentStep, fetchLearningPlan]);

  useEffect(() => {
    setLearningPlan(null);
  }, [learningPlanContext]);

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
          maxTokens: maxTokens ?? 900,
          responseFormat: { type: 'json_object' }
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

  const handleBusinessIntakeSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const sanitizedIntake = Object.entries(businessIntakeForm).reduce(
      (acc, [key, value]) => {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
          acc[key as keyof BusinessDevelopmentIntake] = trimmed;
        }
        return acc;
      },
      {} as BusinessDevelopmentIntake
    );

    const questionnaireResponses = Object.entries(businessIntakeForm).reduce(
      (acc, [key, value]) => {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
          acc[key] = trimmed;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    updateUser({
      profile: {
        ...user?.profile,
        businessIdea: sanitizedIntake.ideaSummary || sanitizedIntake.ideaName || user?.profile?.businessIdea,
        businessDevelopmentIntake: sanitizedIntake,
        assessmentQuestionnaire: {
          ...(user?.profile?.assessmentQuestionnaire ?? {}),
          ...questionnaireResponses
        }
      }
    });

    completeStep('assessment-questionnaire', 'business-plan-creation');
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
            {!hasAcknowledgedBusinessPlan && (
              <div className="neuro-inset p-6 rounded-neuro-lg border border-neuro-primary/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold neuro-text-primary mb-2">
                      Do you already have a business plan?
                    </h3>
                    <p className="neuro-text-secondary text-sm sm:text-base">
                      If you&apos;re just getting started, we recommend reviewing a few foundational
                      entrepreneurship courses before diving into SkillCraft tasks.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setHasAcknowledgedBusinessPlan(true)}
                      className="neuro-button flex-1 px-6 py-3 rounded-neuro"
                    >
                      Yes, let&apos;s continue
                    </button>
                    <button
                      onClick={() => navigate('/entrepreneur/foundations')}
                      className="neuro-button-primary flex-1 px-6 py-3 rounded-neuro"
                    >
                      No, show foundational learning
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                      <span>Continue to Assessment &amp; Idea Scope</span>
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
            <div className="neuro-card max-w-4xl mx-auto hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-warning to-yellow-400 neuro-animate-float">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Assessment &amp; Idea Scope</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Capture the essentials of your business idea so we can tailor resources, mentors, and funding pathways to your needs.
                </p>
              </div>

              <form onSubmit={handleBusinessIntakeSubmit} className="space-y-8">
                <section className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold neuro-text-primary">1. Your Idea</h3>
                    <p className="text-sm neuro-text-secondary mt-2">
                      Summarize the opportunity and why it matters right now.
                    </p>
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">Idea Name</label>
                    <input
                      className="neuro-input"
                      placeholder="What do you call your idea?"
                      value={businessIntakeForm.ideaName}
                      onChange={event => handleBusinessIntakeChange('ideaName', event.target.value)}
                      required
                    />
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">One sentence summary</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="Describe your idea in a single, powerful sentence."
                      value={businessIntakeForm.ideaSummary}
                      onChange={event => handleBusinessIntakeChange('ideaSummary', event.target.value)}
                      required
                    />
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">The problem</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="What pain or challenge are you solving?"
                      value={businessIntakeForm.ideaProblem}
                      onChange={event => handleBusinessIntakeChange('ideaProblem', event.target.value)}
                      required
                    />
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">Why it matters</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="Why is solving this problem urgent or valuable now?"
                      value={businessIntakeForm.ideaImportance}
                      onChange={event => handleBusinessIntakeChange('ideaImportance', event.target.value)}
                      required
                    />
                  </div>
                </section>

                <section className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold neuro-text-primary">2. Who It’s For</h3>
                    <p className="text-sm neuro-text-secondary mt-2">
                      Clarify the audience you’re serving and their biggest struggle.
                    </p>
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">Main customer or user</label>
                    <input
                      className="neuro-input"
                      placeholder="Who benefits the most from your idea?"
                      value={businessIntakeForm.mainCustomer}
                      onChange={event => handleBusinessIntakeChange('mainCustomer', event.target.value)}
                      required
                    />
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">Their biggest pain point</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="What challenge do they face today?"
                      value={businessIntakeForm.customerPainPoint}
                      onChange={event => handleBusinessIntakeChange('customerPainPoint', event.target.value)}
                      required
                    />
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">How your idea helps</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="Explain in simple terms how life gets better or easier."
                      value={businessIntakeForm.ideaBenefit}
                      onChange={event => handleBusinessIntakeChange('ideaBenefit', event.target.value)}
                      required
                    />
                  </div>
                </section>

                <section className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold neuro-text-primary">3. What Makes It Different</h3>
                    <p className="text-sm neuro-text-secondary mt-2">
                      Show how you stand apart from what exists today.
                    </p>
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">Existing options</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="How do people solve this problem right now?"
                      value={businessIntakeForm.existingOptions}
                      onChange={event => handleBusinessIntakeChange('existingOptions', event.target.value)}
                      required
                    />
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">Your edge</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="What makes your approach better, faster, or more appealing?"
                      value={businessIntakeForm.differentiator}
                      onChange={event => handleBusinessIntakeChange('differentiator', event.target.value)}
                      required
                    />
                  </div>
                </section>

                <section className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold neuro-text-primary">4. How It Works</h3>
                    <p className="text-sm neuro-text-secondary mt-2">
                      Outline your offer, revenue model, and collaborators.
                    </p>
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">What you will offer</label>
                    <input
                      className="neuro-input"
                      placeholder="Product, service, app, platform, or something else?"
                      value={businessIntakeForm.offeringType}
                      onChange={event => handleBusinessIntakeChange('offeringType', event.target.value)}
                      required
                    />
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">How you'll earn money</label>
                    <input
                      className="neuro-input"
                      placeholder="Sell, subscribe, partner, or another revenue path?"
                      value={businessIntakeForm.revenueApproach}
                      onChange={event => handleBusinessIntakeChange('revenueApproach', event.target.value)}
                      required
                    />
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">Who you might work with</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="Key partners, suppliers, or helpers."
                      value={businessIntakeForm.potentialPartners}
                      onChange={event => handleBusinessIntakeChange('potentialPartners', event.target.value)}
                    />
                  </div>
                </section>

                <section className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold neuro-text-primary">5. Next Steps</h3>
                    <p className="text-sm neuro-text-secondary mt-2">
                      Clarify what support you need and what success means to you.
                    </p>
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">What do you need right now?</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="Money, skills, team, feedback, or something else?"
                      value={businessIntakeForm.immediateNeeds}
                      onChange={event => handleBusinessIntakeChange('immediateNeeds', event.target.value)}
                      required
                    />
                  </div>

                  <div className="neuro-surface p-6 rounded-neuro-lg space-y-3">
                    <label className="block text-sm font-semibold neuro-text-primary">What success looks like</label>
                    <textarea
                      className="neuro-input resize-none"
                      rows={3}
                      placeholder="How will you know the idea is working?"
                      value={businessIntakeForm.successDefinition}
                      onChange={event => handleBusinessIntakeChange('successDefinition', event.target.value)}
                      required
                    />
                  </div>
                </section>

                <div className="neuro-inset p-6 rounded-neuro flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 neuro-icon flex items-center justify-center text-lg font-semibold text-neuro-primary">
                      L
                    </div>
                    <p className="text-sm neuro-text-secondary text-left">
                      <strong className="text-neuro-primary">Lumina’s tip:</strong> The more detail you provide, the easier it is to match you with accelerators, funding, and mentors who fit your vision.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg hover:scale-105 transition-all duration-300"
                  >
                    <FileText className="w-6 h-6 mr-3" />
                    <span>Save &amp; Continue</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

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
        const businessPlan = woopPlan?.business_plan;
        const gettingStarted = businessPlan?.getting_started;
        const executiveSummary = businessPlan?.section_1_executive_summary;
        const ownerBackground = businessPlan?.section_2_owner_background;
        const productsServices = businessPlan?.section_3_products_services;
        const market = businessPlan?.section_4_market;
        const marketResearch = businessPlan?.section_5_market_research;
        const marketingStrategy = businessPlan?.section_6_marketing_strategy;
        const competitorAnalysis = businessPlan?.section_7_competitor_analysis;
        const operationsLogistics = businessPlan?.section_8_operations_logistics;
        const costsPricing = businessPlan?.section_9_costs_pricing_strategy;
        const financialForecasts = businessPlan?.section_10_financial_forecasts;
        const backupPlan = businessPlan?.section_11_backup_plan;

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
                          Structured profile synthesized from SkillCraft insights and your intake responses.
                        </p>
                      </div>
                    </div>
                    <p className="neuro-text-primary leading-relaxed">{woopSummary?.summary}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="neuro-inset p-5 rounded-neuro space-y-3">
                        <h4 className="font-semibold neuro-text-primary">Assessment &amp; Idea Scope</h4>
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
                        <h4 className="text-xl font-bold neuro-text-primary mb-6">King's Trust Business Plan</h4>
                        {businessPlan ? (
                          <div className="space-y-6">
                            {businessPlan.metadata && (
                              <div className="neuro-inset p-6 rounded-neuro">
                                <h5 className="font-bold neuro-text-primary mb-3">Metadata</h5>
                                <div className="grid sm:grid-cols-3 gap-4 text-sm neuro-text-secondary">
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Version:</span>{' '}
                                    {businessPlan.metadata.version?.trim() || '1.0.0'}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Generated at:</span>{' '}
                                    {businessPlan.metadata.generated_at?.trim() || 'Not provided.'}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Authoring tool:</span>{' '}
                                    {businessPlan.metadata.authoring_tool?.trim() || 'Not provided.'}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="grid lg:grid-cols-2 gap-6">
                              <div className="neuro-inset p-6 rounded-neuro space-y-4">
                                <h5 className="font-bold neuro-text-primary">Getting Started</h5>
                                <div className="space-y-2 text-sm neuro-text-secondary">
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Business name:</span>{' '}
                                    {gettingStarted?.business_name?.trim() || 'Not provided.'}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Business contact:</span>
                                    <div className="mt-2 space-y-1">
                                      <div>
                                        <span className="font-semibold">Address:</span>{' '}
                                        {gettingStarted?.business_contacts.address?.trim() || 'Not provided.'}
                                      </div>
                                      {gettingStarted?.business_contacts.postcode && (
                                        <div>
                                          <span className="font-semibold">Postcode:</span>{' '}
                                          {gettingStarted.business_contacts.postcode}
                                        </div>
                                      )}
                                      {gettingStarted?.business_contacts.telephone && (
                                        <div>
                                          <span className="font-semibold">Telephone:</span>{' '}
                                          {gettingStarted.business_contacts.telephone}
                                        </div>
                                      )}
                                      {gettingStarted?.business_contacts.email && (
                                        <div>
                                          <span className="font-semibold">Email:</span>{' '}
                                          {gettingStarted.business_contacts.email}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Home contact:</span>
                                    {gettingStarted?.home_contacts ? (
                                      <div className="mt-2 space-y-1">
                                        <div>
                                          <span className="font-semibold">Address:</span>{' '}
                                          {gettingStarted.home_contacts.address?.trim() || 'Not provided.'}
                                        </div>
                                        {gettingStarted.home_contacts.postcode && (
                                          <div>
                                            <span className="font-semibold">Postcode:</span>{' '}
                                            {gettingStarted.home_contacts.postcode}
                                          </div>
                                        )}
                                        {gettingStarted.home_contacts.telephone && (
                                          <div>
                                            <span className="font-semibold">Telephone:</span>{' '}
                                            {gettingStarted.home_contacts.telephone}
                                          </div>
                                        )}
                                        {gettingStarted.home_contacts.email && (
                                          <div>
                                            <span className="font-semibold">Email:</span>{' '}
                                            {gettingStarted.home_contacts.email}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm italic mt-1">Not provided.</p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h6 className="font-semibold text-neuro-primary mb-2">Owners</h6>
                                  {gettingStarted?.owners?.length ? (
                                    <div className="space-y-3">
                                      {gettingStarted.owners.map((owner, index) => (
                                        <div key={`${owner.name}-${index}`} className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary">
                                          <div>
                                            <span className="font-semibold text-neuro-primary">Name:</span>{' '}
                                            {owner.name?.trim() || 'Not provided.'}
                                          </div>
                                          {owner.role && (
                                            <div>
                                              <span className="font-semibold text-neuro-primary">Role:</span>{' '}
                                              {owner.role}
                                            </div>
                                          )}
                                          {owner.email && (
                                            <div>
                                              <span className="font-semibold text-neuro-primary">Email:</span>{' '}
                                              {owner.email}
                                            </div>
                                          )}
                                          {owner.phone && (
                                            <div>
                                              <span className="font-semibold text-neuro-primary">Phone:</span>{' '}
                                              {owner.phone}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm italic neuro-text-secondary">No owners captured.</p>
                                  )}
                                </div>
                              </div>

                              <div className="neuro-inset p-6 rounded-neuro space-y-4">
                                <h5 className="font-bold neuro-text-primary">Executive Summary</h5>
                                <div className="space-y-3 text-sm neuro-text-secondary">
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Business summary:</span>
                                    <p className="mt-1">{executiveSummary?.business_summary?.trim() || 'Not provided.'}</p>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Business aims:</span>
                                    <p className="mt-1">{executiveSummary?.business_aims?.trim() || 'Not provided.'}</p>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Financial summary:</span>
                                    <p className="mt-1">{executiveSummary?.financial_summary?.trim() || 'Not provided.'}</p>
                                  </div>
                                </div>
                                {executiveSummary?.elevator_pitch && (
                                  <div className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                    <h6 className="font-semibold text-neuro-primary">Elevator pitch</h6>
                                    <div>
                                      <span className="font-semibold">Name:</span>{' '}
                                      {executiveSummary.elevator_pitch.business_name?.trim() || 'Not provided.'}
                                    </div>
                                    <div>
                                      <span className="font-semibold">Strapline:</span>{' '}
                                      {executiveSummary.elevator_pitch.strapline?.trim() || 'Not provided.'}
                                    </div>
                                    <div>
                                      <span className="font-semibold">Pitch:</span>
                                      <p className="mt-1">{executiveSummary.elevator_pitch.pitch?.trim() || 'Not provided.'}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                              <div className="neuro-inset p-6 rounded-neuro space-y-4">
                                <h5 className="font-bold neuro-text-primary">Owner Background</h5>
                                <div className="text-sm neuro-text-secondary space-y-2">
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Motivation:</span>
                                    <p className="mt-1">{ownerBackground?.motivation?.trim() || 'Not provided.'}</p>
                                  </div>
                                  {ownerBackground?.qualifications_education && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Qualifications & education:</span>
                                      <p className="mt-1">{ownerBackground.qualifications_education}</p>
                                    </div>
                                  )}
                                  {ownerBackground?.hobbies_interests && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Hobbies & interests:</span>
                                      <p className="mt-1">{ownerBackground.hobbies_interests}</p>
                                    </div>
                                  )}
                                  {ownerBackground?.additional_information && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Additional information:</span>
                                      <p className="mt-1">{ownerBackground.additional_information}</p>
                                    </div>
                                  )}
                                </div>
                                {ownerBackground?.work_experience?.length ? (
                                  <div>
                                    <h6 className="font-semibold text-neuro-primary mb-2">Work experience</h6>
                                    <div className="space-y-3">
                                      {ownerBackground.work_experience.map((experience, index) => (
                                        <div key={index} className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                          {experience.employer && (
                                            <div>
                                              <span className="font-semibold">Employer:</span>{' '}
                                              {experience.employer}
                                            </div>
                                          )}
                                          {experience.role && (
                                            <div>
                                              <span className="font-semibold">Role:</span>{' '}
                                              {experience.role}
                                            </div>
                                          )}
                                          {experience.dates && (
                                            <div>
                                              <span className="font-semibold">Dates:</span>{' '}
                                              {experience.dates}
                                            </div>
                                          )}
                                          {experience.responsibilities && (
                                            <div>
                                              <span className="font-semibold">Responsibilities:</span>
                                              <p className="mt-1">{experience.responsibilities}</p>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm italic neuro-text-secondary">No work experience listed.</p>
                                )}
                                {(ownerBackground?.training_completed?.length || ownerBackground?.training_planned?.length) && (
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    {ownerBackground?.training_completed?.length ? (
                                      <div>
                                        <h6 className="font-semibold text-neuro-primary mb-2">Training completed</h6>
                                        <ul className="list-disc list-inside text-sm neuro-text-secondary space-y-1">
                                          {ownerBackground.training_completed.map((item, index) => (
                                            <li key={index}>{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : null}
                                    {ownerBackground?.training_planned?.length ? (
                                      <div>
                                        <h6 className="font-semibold text-neuro-primary mb-2">Training planned</h6>
                                        <ul className="list-disc list-inside text-sm neuro-text-secondary space-y-1">
                                          {ownerBackground.training_planned.map((item, index) => (
                                            <li key={index}>{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : null}
                                  </div>
                                )}
                              </div>

                              <div className="neuro-inset p-6 rounded-neuro space-y-4">
                                <h5 className="font-bold neuro-text-primary">Products & Services</h5>
                                <div className="text-sm neuro-text-secondary space-y-2">
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Selling type:</span>{' '}
                                    {productsServices?.selling_type || 'Not provided.'}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Description:</span>
                                    <p className="mt-1">{productsServices?.basic_description?.trim() || 'Not provided.'}</p>
                                  </div>
                                  {productsServices?.rollout_rationale && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Rollout rationale:</span>
                                      <p className="mt-1">{productsServices.rollout_rationale}</p>
                                    </div>
                                  )}
                                  {productsServices?.additional_information && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Additional information:</span>
                                      <p className="mt-1">{productsServices.additional_information}</p>
                                    </div>
                                  )}
                                </div>
                                {productsServices?.offerings?.length ? (
                                  <div>
                                    <h6 className="font-semibold text-neuro-primary mb-2">Offerings</h6>
                                    <div className="space-y-3">
                                      {productsServices.offerings.map((offering, index) => (
                                        <div key={`${offering.name}-${index}`} className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                          <div>
                                            <span className="font-semibold">Name:</span>{' '}
                                            {offering.name}
                                          </div>
                                          <div>
                                            <span className="font-semibold">Description:</span>
                                            <p className="mt-1">{offering.description}</p>
                                          </div>
                                          {offering.launch_phase && (
                                            <div>
                                              <span className="font-semibold">Launch phase:</span>{' '}
                                              {offering.launch_phase}
                                            </div>
                                          )}
                                          {offering.planned_start_date && (
                                            <div>
                                              <span className="font-semibold">Planned start:</span>{' '}
                                              {offering.planned_start_date}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm italic neuro-text-secondary">No offerings detailed.</p>
                                )}
                              </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                              <div className="neuro-inset p-6 rounded-neuro space-y-4">
                                <h5 className="font-bold neuro-text-primary">Market Overview</h5>
                                <div className="text-sm neuro-text-secondary space-y-2">
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Customer type:</span>{' '}
                                    {market?.customer_type || 'Not provided.'}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-neuro-primary">Typical customer:</span>
                                    <p className="mt-1">{market?.typical_customer?.trim() || 'Not provided.'}</p>
                                  </div>
                                  {market?.customer_locations && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Customer locations:</span>
                                      <p className="mt-1">{market.customer_locations}</p>
                                    </div>
                                  )}
                                  {market?.buying_triggers && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Buying triggers:</span>
                                      <p className="mt-1">{market.buying_triggers}</p>
                                    </div>
                                  )}
                                  {market?.choice_factors && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Choice factors:</span>
                                      <p className="mt-1">{market.choice_factors}</p>
                                    </div>
                                  )}
                                  {market?.additional_information && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Additional information:</span>
                                      <p className="mt-1">{market.additional_information}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                  {market?.previous_sales && (
                                    <div className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                      <h6 className="font-semibold text-neuro-primary">Previous sales</h6>
                                      <div>
                                        <span className="font-semibold">Has sold:</span>{' '}
                                        {market.previous_sales.has_sold ? 'Yes' : 'No'}
                                      </div>
                                      {market.previous_sales.details && (
                                        <div>
                                          <span className="font-semibold">Details:</span>
                                          <p className="mt-1">{market.previous_sales.details}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {market?.waiting_customers && (
                                    <div className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                      <h6 className="font-semibold text-neuro-primary">Waiting customers</h6>
                                      <div>
                                        <span className="font-semibold">Has waiting customers:</span>{' '}
                                        {market.waiting_customers.has_waiting_customers ? 'Yes' : 'No'}
                                      </div>
                                      {market.waiting_customers.details && (
                                        <div>
                                          <span className="font-semibold">Details:</span>
                                          <p className="mt-1">{market.waiting_customers.details}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="neuro-inset p-6 rounded-neuro space-y-4">
                                <h5 className="font-bold neuro-text-primary">Market Research & Competition</h5>
                                <div className="text-sm neuro-text-secondary space-y-2">
                                  {marketResearch?.desk_research_findings && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Desk research findings:</span>
                                      <p className="mt-1">{marketResearch.desk_research_findings}</p>
                                    </div>
                                  )}
                                  {marketResearch?.field_research_questionnaires && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Questionnaires:</span>
                                      <p className="mt-1">{marketResearch.field_research_questionnaires}</p>
                                    </div>
                                  )}
                                  {marketResearch?.field_research_test_trading && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Test trading:</span>
                                      <p className="mt-1">{marketResearch.field_research_test_trading}</p>
                                    </div>
                                  )}
                                  {marketResearch?.additional_information && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Additional information:</span>
                                      <p className="mt-1">{marketResearch.additional_information}</p>
                                    </div>
                                  )}
                                  {!marketResearch && (
                                    <p className="text-sm italic">No market research details provided.</p>
                                  )}
                                </div>
                                <div className="space-y-4">
                                  {marketingStrategy?.activities?.length ? (
                                    <div>
                                      <h6 className="font-semibold text-neuro-primary mb-2">Marketing activities</h6>
                                      <div className="space-y-3">
                                        {marketingStrategy.activities.map((activity, index) => (
                                          <div key={index} className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                            <div>
                                              <span className="font-semibold">Activity:</span>{' '}
                                              {activity.activity}
                                            </div>
                                            <div>
                                              <span className="font-semibold">Rationale:</span>
                                              <p className="mt-1">{activity.rationale}</p>
                                            </div>
                                            {activity.estimated_cost != null && (
                                              <div>
                                                <span className="font-semibold">Estimated cost:</span>{' '}
                                                {`$${activity.estimated_cost.toLocaleString()}`}
                                              </div>
                                            )}
                                            {activity.notes && (
                                              <div>
                                                <span className="font-semibold">Notes:</span>
                                                <p className="mt-1">{activity.notes}</p>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm italic neuro-text-secondary">No marketing activities listed.</p>
                                  )}
                                  {marketingStrategy?.total_estimated_cost != null && (
                                    <div className="text-sm neuro-text-secondary">
                                      <span className="font-semibold text-neuro-primary">Total estimated cost:</span>{' '}
                                      {`$${marketingStrategy.total_estimated_cost.toLocaleString()}`}
                                    </div>
                                  )}
                                  {competitorAnalysis?.competitors?.length ? (
                                    <div>
                                      <h6 className="font-semibold text-neuro-primary mb-2">Competitors</h6>
                                      <div className="space-y-3">
                                        {competitorAnalysis.competitors.map((competitor, index) => (
                                          <div key={index} className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                            {competitor.name && (
                                              <div>
                                                <span className="font-semibold">Name:</span>{' '}
                                                {competitor.name}
                                              </div>
                                            )}
                                            {competitor.location && (
                                              <div>
                                                <span className="font-semibold">Location:</span>{' '}
                                                {competitor.location}
                                              </div>
                                            )}
                                            {competitor.product_service && (
                                              <div>
                                                <span className="font-semibold">Offering:</span>{' '}
                                                {competitor.product_service}
                                              </div>
                                            )}
                                            {competitor.price && (
                                              <div>
                                                <span className="font-semibold">Price:</span>{' '}
                                                {competitor.price}
                                              </div>
                                            )}
                                            {competitor.strengths && (
                                              <div>
                                                <span className="font-semibold">Strengths:</span>
                                                <p className="mt-1">{competitor.strengths}</p>
                                              </div>
                                            )}
                                            {competitor.weaknesses && (
                                              <div>
                                                <span className="font-semibold">Weaknesses:</span>
                                                <p className="mt-1">{competitor.weaknesses}</p>
                                              </div>
                                            )}
                                            {competitor.business_size && (
                                              <div>
                                                <span className="font-semibold">Business size:</span>{' '}
                                                {competitor.business_size}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm italic neuro-text-secondary">No competitors documented.</p>
                                  )}
                                  {competitorAnalysis?.swot && (
                                    <div className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                      <h6 className="font-semibold text-neuro-primary">SWOT</h6>
                                      <div>
                                        <span className="font-semibold">Strengths:</span>
                                        <p className="mt-1">{competitorAnalysis.swot.strengths}</p>
                                      </div>
                                      <div>
                                        <span className="font-semibold">Weaknesses:</span>
                                        <p className="mt-1">{competitorAnalysis.swot.weaknesses}</p>
                                      </div>
                                      <div>
                                        <span className="font-semibold">Opportunities:</span>
                                        <p className="mt-1">{competitorAnalysis.swot.opportunities}</p>
                                      </div>
                                      <div>
                                        <span className="font-semibold">Threats:</span>
                                        <p className="mt-1">{competitorAnalysis.swot.threats}</p>
                                      </div>
                                    </div>
                                  )}
                                  {competitorAnalysis?.usp && (
                                    <div className="text-sm neuro-text-secondary">
                                      <span className="font-semibold text-neuro-primary">Unique selling point:</span>
                                      <p className="mt-1">{competitorAnalysis.usp}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                              <div className="neuro-inset p-6 rounded-neuro space-y-4">
                                <h5 className="font-bold neuro-text-primary">Operations & Logistics</h5>
                                <div className="text-sm neuro-text-secondary space-y-2">
                                  {operationsLogistics?.production && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Production:</span>
                                      <p className="mt-1">{operationsLogistics.production}</p>
                                    </div>
                                  )}
                                  {operationsLogistics?.delivery && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Delivery:</span>
                                      <p className="mt-1">{operationsLogistics.delivery}</p>
                                    </div>
                                  )}
                                  {operationsLogistics?.payment_methods_terms && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Payment methods & terms:</span>
                                      <p className="mt-1">{operationsLogistics.payment_methods_terms}</p>
                                    </div>
                                  )}
                                  {operationsLogistics?.premises && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Premises:</span>
                                      <p className="mt-1">{operationsLogistics.premises}</p>
                                    </div>
                                  )}
                                  {operationsLogistics?.transport && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Transport:</span>
                                      <p className="mt-1">{operationsLogistics.transport}</p>
                                    </div>
                                  )}
                                  {operationsLogistics?.legal_requirements && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Legal requirements:</span>
                                      <p className="mt-1">{operationsLogistics.legal_requirements}</p>
                                    </div>
                                  )}
                                  {operationsLogistics?.insurance && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Insurance:</span>
                                      <p className="mt-1">{operationsLogistics.insurance}</p>
                                    </div>
                                  )}
                                  {operationsLogistics?.management_staff && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Management & staff:</span>
                                      <p className="mt-1">{operationsLogistics.management_staff}</p>
                                    </div>
                                  )}
                                  {operationsLogistics?.additional_information && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Additional information:</span>
                                      <p className="mt-1">{operationsLogistics.additional_information}</p>
                                    </div>
                                  )}
                                </div>
                                {(operationsLogistics?.suppliers?.length || operationsLogistics?.equipment?.length) ? (
                                  <div className="space-y-4">
                                    {operationsLogistics?.suppliers?.length ? (
                                      <div>
                                        <h6 className="font-semibold text-neuro-primary mb-2">Suppliers</h6>
                                        <div className="space-y-3">
                                          {operationsLogistics.suppliers.map((supplier, index) => (
                                            <div key={index} className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                              {supplier.name && (
                                                <div>
                                                  <span className="font-semibold">Name:</span>{' '}
                                                  {supplier.name}
                                                </div>
                                              )}
                                              {supplier.location && (
                                                <div>
                                                  <span className="font-semibold">Location:</span>{' '}
                                                  {supplier.location}
                                                </div>
                                              )}
                                              {supplier.items_required && (
                                                <div>
                                                  <span className="font-semibold">Items required:</span>
                                                  <p className="mt-1">{supplier.items_required}</p>
                                                </div>
                                              )}
                                              {supplier.prices && (
                                                <div>
                                                  <span className="font-semibold">Prices:</span>{' '}
                                                  {supplier.prices}
                                                </div>
                                              )}
                                              {supplier.payment_arrangements && (
                                                <div>
                                                  <span className="font-semibold">Payment arrangements:</span>
                                                  <p className="mt-1">{supplier.payment_arrangements}</p>
                                                </div>
                                              )}
                                              {supplier.reason_for_choice && (
                                                <div>
                                                  <span className="font-semibold">Reason for choice:</span>
                                                  <p className="mt-1">{supplier.reason_for_choice}</p>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : null}
                                    {operationsLogistics?.equipment?.length ? (
                                      <div>
                                        <h6 className="font-semibold text-neuro-primary mb-2">Equipment</h6>
                                        <div className="space-y-3">
                                          {operationsLogistics.equipment.map((item, index) => (
                                            <div key={index} className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary space-y-1">
                                              {item.item && (
                                                <div>
                                                  <span className="font-semibold">Item:</span>{' '}
                                                  {item.item}
                                                </div>
                                              )}
                                              {item.already_owned != null && (
                                                <div>
                                                  <span className="font-semibold">Already owned:</span>{' '}
                                                  {item.already_owned ? 'Yes' : 'No'}
                                                </div>
                                              )}
                                              {item.condition && (
                                                <div>
                                                  <span className="font-semibold">Condition:</span>{' '}
                                                  {item.condition}
                                                </div>
                                              )}
                                              {item.purchased_from && (
                                                <div>
                                                  <span className="font-semibold">Purchased from:</span>{' '}
                                                  {item.purchased_from}
                                                </div>
                                              )}
                                              {item.price != null && (
                                                <div>
                                                  <span className="font-semibold">Price:</span>{' '}
                                                  {`$${item.price.toLocaleString()}`}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                ) : (
                                  <p className="text-sm italic neuro-text-secondary">No suppliers or equipment listed.</p>
                                )}
                              </div>

                              <div className="neuro-inset p-6 rounded-neuro space-y-4">
                                <h5 className="font-bold neuro-text-primary">Costs & Pricing</h5>
                                {costsPricing?.pricing_table?.length ? (
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm neuro-text-secondary border-separate border-spacing-y-2">
                                      <thead>
                                        <tr className="text-left text-neuro-primary">
                                          <th className="px-3 py-2">Product/Service</th>
                                          <th className="px-3 py-2">Units</th>
                                          <th className="px-3 py-2">Total cost</th>
                                          <th className="px-3 py-2">Price/unit</th>
                                          <th className="px-3 py-2">Margin %</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {costsPricing.pricing_table.map((entry, index) => (
                                          <tr key={index} className="neuro-surface">
                                            <td className="px-3 py-2 font-semibold text-neuro-primary">{entry.product_service_name || '—'}</td>
                                            <td className="px-3 py-2">{entry.units_in_calc ?? '—'}</td>
                                            <td className="px-3 py-2">{entry.total_cost != null ? `$${entry.total_cost.toLocaleString()}` : '—'}</td>
                                            <td className="px-3 py-2">{entry.price_per_unit != null ? `$${entry.price_per_unit.toLocaleString()}` : '—'}</td>
                                            <td className="px-3 py-2">{entry.profit_margin_percent != null ? `${entry.profit_margin_percent}%` : '—'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p className="text-sm italic neuro-text-secondary">No pricing table entries provided.</p>
                                )}
                              </div>
                            </div>

                            <div className="neuro-inset p-6 rounded-neuro space-y-4">
                              <h5 className="font-bold neuro-text-primary">Financial Forecasts</h5>
                              {financialForecasts ? (
                                <div className="space-y-6">
                                  <div>
                                    <h6 className="font-semibold text-neuro-primary mb-2">Sales & costs forecast</h6>
                                    {financialForecasts.sales_and_costs_forecast?.length ? (
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm neuro-text-secondary">
                                          <thead className="text-neuro-primary">
                                            <tr>
                                              <th className="px-3 py-2 text-left">Month</th>
                                              <th className="px-3 py-2 text-left">Sales</th>
                                              <th className="px-3 py-2 text-left">Costs</th>
                                              <th className="px-3 py-2 text-left">Assumptions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {financialForecasts.sales_and_costs_forecast.map((entry, index) => (
                                              <tr key={index} className={index % 2 === 0 ? 'bg-neuro-bg/40' : ''}>
                                                <td className="px-3 py-2 font-semibold text-neuro-primary">{entry.month_name}</td>
                                                <td className="px-3 py-2">{`$${entry.sales_forecast.toLocaleString()}`}</td>
                                                <td className="px-3 py-2">{`$${entry.costs_forecast.toLocaleString()}`}</td>
                                                <td className="px-3 py-2">{entry.assumptions || '—'}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <p className="text-sm italic neuro-text-secondary">No sales forecast provided.</p>
                                    )}
                                  </div>

                                  <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary">
                                      <h6 className="font-semibold text-neuro-primary mb-2">Personal survival budget</h6>
                                      <div className="mb-3">
                                        <p className="font-semibold text-neuro-primary">Costs</p>
                                        <ul className="list-disc list-inside space-y-1 mt-1">
                                          {financialForecasts.personal_survival_budget.costs.map((item, index) => (
                                            <li key={index}>
                                              <span className="font-semibold">{item.category}:</span>{' '}
                                              {`$${item.monthly_cost.toLocaleString()}`}/mo
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <p className="font-semibold text-neuro-primary">Income</p>
                                        <ul className="list-disc list-inside space-y-1 mt-1">
                                          {financialForecasts.personal_survival_budget.income.map((item, index) => (
                                            <li key={index}>
                                              <span className="font-semibold">{item.source}:</span>{' '}
                                              {`$${item.monthly_amount.toLocaleString()}`}/mo
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    <div className="neuro-surface p-4 rounded-neuro text-sm neuro-text-secondary">
                                      <h6 className="font-semibold text-neuro-primary mb-2">Cashflow forecast</h6>
                                      {financialForecasts.cashflow_forecast?.length ? (
                                        <div className="overflow-x-auto">
                                          <table className="min-w-full text-sm">
                                            <thead className="text-neuro-primary">
                                              <tr>
                                                <th className="px-3 py-2 text-left">Month</th>
                                                <th className="px-3 py-2 text-left">Money in</th>
                                                <th className="px-3 py-2 text-left">Money out</th>
                                                <th className="px-3 py-2 text-left">Closing balance</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {financialForecasts.cashflow_forecast.map((entry, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-neuro-bg/40' : ''}>
                                                  <td className="px-3 py-2 font-semibold text-neuro-primary">{entry.month_name}</td>
                                                  <td className="px-3 py-2">{`$${entry.money_in.total.toLocaleString()}`}</td>
                                                  <td className="px-3 py-2">{`$${entry.money_out.total.toLocaleString()}`}</td>
                                                  <td className="px-3 py-2">{entry.closing_balance != null ? `$${entry.closing_balance.toLocaleString()}` : '—'}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      ) : (
                                        <p className="text-sm italic">No cashflow forecast provided.</p>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h6 className="font-semibold text-neuro-primary mb-2">Startup costs</h6>
                                    {financialForecasts.startup_costs_table?.length ? (
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm neuro-text-secondary">
                                          <thead className="text-neuro-primary">
                                            <tr>
                                              <th className="px-3 py-2 text-left">Item</th>
                                              <th className="px-3 py-2 text-left">Calculation</th>
                                              <th className="px-3 py-2 text-left">Total cost</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {financialForecasts.startup_costs_table.map((entry, index) => (
                                              <tr key={index} className={index % 2 === 0 ? 'bg-neuro-bg/40' : ''}>
                                                <td className="px-3 py-2 font-semibold text-neuro-primary">{entry.item}</td>
                                                <td className="px-3 py-2">{entry.calculation}</td>
                                                  <td className="px-3 py-2">{`$${entry.total_cost.toLocaleString()}`}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <p className="text-sm italic neuro-text-secondary">No startup costs itemized.</p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm italic neuro-text-secondary">Financial forecasts not provided.</p>
                              )}
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                              <div className="neuro-inset p-6 rounded-neuro space-y-3">
                                <h5 className="font-bold neuro-text-primary">Backup Plan</h5>
                                <div className="text-sm neuro-text-secondary space-y-2">
                                  {backupPlan?.short_term_plan && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Short-term plan:</span>
                                      <p className="mt-1">{backupPlan.short_term_plan}</p>
                                    </div>
                                  )}
                                  {backupPlan?.long_term_plan && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Long-term plan:</span>
                                      <p className="mt-1">{backupPlan.long_term_plan}</p>
                                    </div>
                                  )}
                                  {backupPlan?.plan_b && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Plan B:</span>
                                      <p className="mt-1">{backupPlan.plan_b}</p>
                                    </div>
                                  )}
                                  {backupPlan?.plan_b_additional && (
                                    <div>
                                      <span className="font-semibold text-neuro-primary">Additional Plan B details:</span>
                                      <p className="mt-1">{backupPlan.plan_b_additional}</p>
                                    </div>
                                  )}
                                  {!backupPlan && <p className="text-sm italic">No backup plan provided.</p>}
                                </div>
                              </div>

                              <div className="neuro-inset p-6 rounded-neuro">
                                <h5 className="font-bold neuro-text-primary mb-3">Full JSON Export</h5>
                                <p className="text-sm neuro-text-secondary mb-3">
                                  Copy this JSON to share the plan or validate it with third-party tools.
                                </p>
                                <div className="neuro-surface p-4 rounded-neuro max-h-80 overflow-auto text-xs font-mono text-left whitespace-pre-wrap">
                                  {JSON.stringify(businessPlan, null, 2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm neuro-text-secondary italic">Business plan not available.</p>
                        )}
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
                    onClick={() => completeStep('business-plan-creation', 'learning-plan-recommendations')}
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

      case 'learning-plan-recommendations': {
        const activePlan = learningPlan;
        const stageDisplay = activePlan?.user_info.stage ?? learningPlanContext.user_info.stage;
        const regionDisplay = activePlan?.user_info.region ?? learningPlanContext.user_info.region;
        const backgroundDisplay = activePlan?.user_info.background ?? learningPlanContext.user_info.background;
        const skillDisplay = activePlan?.skill ?? learningPlanContext.skill;
        const weeklyHours = activePlan?.learning_plan.weekly_hours ?? Math.max(learningPlanContext.time_commitment_hours_per_week, 0);
        const totalDuration = activePlan?.learning_plan.total_duration_weeks ?? null;
        const planSummary = activePlan?.learning_plan.plan_summary ??
          'We will request your personalized learning journey once the recommendation service is available.';
        const sequence = activePlan?.learning_plan.sequence ?? [];
        const courses = activePlan?.all_relevant_courses ?? [];
        const assumptions = activePlan?.assumptions ?? [];
        const confidence = activePlan?.confidence ?? null;
        const confidenceConfig = {
          high: { label: 'High confidence', gradient: 'from-neuro-success to-green-400' },
          medium: { label: 'Medium confidence', gradient: 'from-neuro-warning to-yellow-400' },
          low: { label: 'Developing confidence', gradient: 'from-neuro-error to-red-400' }
        } as const;
        const confidenceDisplay = confidence
          ? confidenceConfig[confidence]
          : { label: 'Confidence pending', gradient: 'from-neuro-secondary to-pink-400' };

        return (
          <div className="p-8 bg-neuro-bg">
            <div className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 neuro-icon mx-auto mb-6 bg-gradient-to-br from-neuro-secondary to-pink-400 neuro-animate-float">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold neuro-text-primary mb-4">Personalized Learning Path</h2>
                <p className="text-lg neuro-text-secondary max-w-2xl mx-auto">
                  Curated course recommendations aligned with your venture stage, available time, and top skill gaps.
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-semibold neuro-text-primary">Learning focus: {skillDisplay}</h3>
                  <p className="text-sm md:text-base neuro-text-secondary">
                    Updated automatically using the latest insights from your WOOP plan and SkillCraft results.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => fetchLearningPlan(true)}
                    disabled={learningPlanLoading}
                    className={`neuro-surface inline-flex items-center px-6 py-3 rounded-neuro-lg text-sm font-semibold transition-all duration-300 ${
                      learningPlanLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-neuro-hover hover:scale-105'
                    }`}
                  >
                    {learningPlanLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh plan
                      </>
                    )}
                  </button>
                </div>
              </div>

              {learningPlanLoading && !learningPlan ? (
                <div className="neuro-inset p-8 rounded-neuro text-center text-neuro-secondary">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                  <p className="text-lg font-semibold neuro-text-primary">Gathering your personalized learning path...</p>
                  <p className="text-sm">This may take a few moments while we analyze your latest goals and availability.</p>
                </div>
              ) : learningPlanError ? (
                <div className="neuro-inset p-8 rounded-neuro text-center">
                  <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-neuro-error" />
                    <p className="text-lg font-semibold neuro-text-primary">Unable to load learning plan</p>
                    <p className="text-sm neuro-text-secondary max-w-lg">{learningPlanError}</p>
                    <button
                      onClick={() => fetchLearningPlan(true)}
                      className="neuro-button-primary inline-flex items-center px-6 py-3 rounded-neuro-lg text-sm font-semibold"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try again
                    </button>
                  </div>
                </div>
              ) : learningPlan ? (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="neuro-surface p-6 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 mr-3">
                          <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider neuro-text-muted">Focus Skill</p>
                          <p className="text-lg font-semibold neuro-text-primary">{skillDisplay}</p>
                        </div>
                      </div>
                      <p className="text-sm neuro-text-secondary">
                        Courses selected to deepen your capability in this priority area.
                      </p>
                    </div>
                    <div className="neuro-surface p-6 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-3">
                          <Compass className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider neuro-text-muted">Venture Stage</p>
                          <p className="text-lg font-semibold neuro-text-primary capitalize">{stageDisplay.replace(/_/g, ' ')}</p>
                        </div>
                      </div>
                      <p className="text-sm neuro-text-secondary">
                        {regionDisplay ? `Tailored for founders operating in ${regionDisplay}.` : 'Optimized for your current growth stage.'}
                      </p>
                    </div>
                    <div className="neuro-surface p-6 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 neuro-icon bg-gradient-to-br from-neuro-warning to-yellow-400 mr-3">
                          <Clock className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider neuro-text-muted">Weekly Focus</p>
                          <p className="text-lg font-semibold neuro-text-primary">{weeklyHours} hrs/week</p>
                        </div>
                      </div>
                      <p className="text-sm neuro-text-secondary">
                        {totalDuration
                          ? `Structured for ${totalDuration} weeks of progress.`
                          : 'Designed around your available time commitment.'}
                      </p>
                    </div>
                    <div className="neuro-surface p-6 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 neuro-icon bg-gradient-to-br from-neuro-success to-green-400 mr-3">
                          <Briefcase className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider neuro-text-muted">Founder Background</p>
                          <p className="text-lg font-semibold neuro-text-primary">
                            {backgroundDisplay ? backgroundDisplay : 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm neuro-text-secondary">
                        Baseline context used to personalize each recommendation.
                      </p>
                    </div>
                  </div>

                  <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                    <h3 className="text-2xl font-bold neuro-text-primary mb-4">Learning plan overview</h3>
                    <p className="neuro-text-secondary leading-relaxed">{planSummary}</p>
                  </div>

                  <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light mr-4">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold neuro-text-primary">Recommended sequence</h3>
                        <p className="neuro-text-secondary">Follow these courses in order to build momentum week by week.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {sequence.length ? (
                        sequence.map(item => (
                          <div key={`${item.order}-${item.course_title}`} className="neuro-inset p-6 rounded-neuro">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                                  {item.order}
                                </div>
                                <div>
                                  <h4 className="text-xl font-semibold neuro-text-primary mb-2">{item.course_title}</h4>
                                  <p className="text-sm neuro-text-secondary mb-2">{item.provider_name}</p>
                                  <p className="neuro-text-secondary text-sm leading-relaxed">{item.why_chosen}</p>
                                  <div className="flex flex-wrap gap-3 mt-4 text-xs font-semibold uppercase tracking-wide">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-neuro-bg text-neuro-secondary">
                                      {formatDifficultyLabel(item.difficulty)}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-neuro-bg text-neuro-secondary">
                                      {item.estimated_hours} hrs total
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-neuro-bg text-neuro-secondary">
                                      {item.planned_weekly_hours} hrs/week
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-neuro-bg text-neuro-secondary">
                                      {item.expected_duration_weeks} weeks
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center lg:items-start gap-3">
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="neuro-button-primary inline-flex items-center px-4 py-2 rounded-neuro-lg text-sm"
                                >
                                  View course
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="neuro-inset p-6 rounded-neuro text-center text-sm neuro-text-secondary">
                          No sequence available yet. Refresh the plan once recommendations are ready.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                      <h3 className="text-2xl font-bold neuro-text-primary mb-4">Additional course options</h3>
                      <div className="space-y-4">
                        {courses.length ? (
                          courses.map(course => (
                            <div key={`${course.course_title}-${course.provider_name}`} className="neuro-inset p-5 rounded-neuro">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <h4 className="font-semibold neuro-text-primary">{course.course_title}</h4>
                                  <p className="text-sm neuro-text-secondary">{course.provider_name}</p>
                                  <div className="flex flex-wrap gap-3 mt-3 text-xs font-semibold uppercase tracking-wide text-neuro-secondary">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-neuro-bg">
                                      {formatDifficultyLabel(course.difficulty)}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-neuro-bg">
                                      {course.estimated_hours} hrs
                                    </span>
                                  </div>
                                </div>
                                <a
                                  href={course.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="neuro-surface inline-flex items-center px-4 py-2 rounded-neuro-lg text-sm hover:shadow-neuro-hover transition-all duration-300"
                                >
                                  Explore
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm neuro-text-secondary">
                            No optional courses were returned. Refresh the plan to check for new opportunities.
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                        <h3 className="text-2xl font-bold neuro-text-primary mb-4">Planning assumptions</h3>
                        <ul className="space-y-3">
                          {assumptions.length ? (
                            assumptions.map((assumption, index) => (
                              <li key={`${index}-${assumption}`} className="flex items-start gap-3">
                                <div className="w-6 h-6 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                                <span className="neuro-text-secondary leading-relaxed">{assumption}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm neuro-text-secondary">No assumptions were provided.</li>
                          )}
                        </ul>
                      </div>
                      <div className="neuro-surface p-8 rounded-neuro-lg hover:shadow-neuro-hover transition-all duration-300">
                        <h3 className="text-2xl font-bold neuro-text-primary mb-4">Recommendation confidence</h3>
                        <div className={`neuro-inset p-6 rounded-neuro bg-gradient-to-br ${confidenceDisplay.gradient} text-white`}>
                          <p className="text-lg font-semibold">{confidenceDisplay.label}</p>
                          <p className="text-sm opacity-90 mt-2">
                            Confidence is determined by the quality of data we have about your goals, stage, and skill gaps.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="neuro-inset p-8 rounded-neuro text-center text-sm neuro-text-secondary">
                  Generate your WOOP plan first to unlock tailored learning recommendations.
                </div>
              )}

              <div className="text-center neuro-inset p-6 rounded-neuro-lg mt-8">
                <button
                  onClick={() => completeStep('learning-plan-recommendations', 'ai-mentor-program')}
                  disabled={learningPlanLoading || !learningPlan}
                  className={`neuro-button-primary inline-flex items-center px-8 py-4 text-lg rounded-neuro-lg transition-all duration-300 ${
                    learningPlanLoading || !learningPlan ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  <span>Continue to AI Mentor</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
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
                <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                  <div className="neuro-surface rounded-neuro-md p-6">
                    <h4 className="text-xl font-semibold neuro-text-primary mb-3">Courses Completed</h4>
                    <ul className="space-y-2 neuro-text-secondary">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-neuro-success" />
                        <span>Market Research &amp; Opportunity Validation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-neuro-success" />
                        <span>Financial Modeling for Startups</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-neuro-success" />
                        <span>Pitch Deck Design &amp; Storytelling</span>
                      </li>
                    </ul>
                  </div>

                  <div className="neuro-surface rounded-neuro-md p-6">
                    <h4 className="text-xl font-semibold neuro-text-primary mb-3">Business Plan Summary</h4>
                    <p className="neuro-text-secondary mb-2">
                      <span className="font-semibold neuro-text-primary">Venture:</span> FreshLoop, a mobile marketplace connecting
                      local farmers with urban consumers through subscription produce boxes.
                    </p>
                    <p className="neuro-text-secondary mb-2">
                      <span className="font-semibold neuro-text-primary">Value Proposition:</span> Reduces food waste while providing
                      affordable, sustainably sourced groceries to city residents.
                    </p>
                    <p className="neuro-text-secondary">
                      <span className="font-semibold neuro-text-primary">Traction:</span> 250 pilot subscribers, 15 farm partners, and a
                      92% customer satisfaction score.
                    </p>
                  </div>

                  <div className="neuro-surface rounded-neuro-md p-6">
                    <h4 className="text-xl font-semibold neuro-text-primary mb-3">Network &amp; Funding Resources</h4>
                    <ul className="space-y-2 neuro-text-secondary">
                      <li>
                        <span className="font-semibold neuro-text-primary">Mentors:</span> Access to the GrowthHub Founders Circle and
                        monthly strategy calls with industry experts.
                      </li>
                      <li>
                        <span className="font-semibold neuro-text-primary">Funding Leads:</span> Shortlisted for the Green Cities Impact
                        Fund and invited to pitch at the Metro Startup Showcase.
                      </li>
                      <li>
                        <span className="font-semibold neuro-text-primary">Community:</span> Active participation in the City Innovators
                        Network with 40+ peer founders.
                      </li>
                    </ul>
                  </div>
                </div>

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

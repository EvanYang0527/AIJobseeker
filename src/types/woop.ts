export interface WoopIntakeSummary {
  user_profile: {
    name: string | null;
    persona: 'aspiring_entrepreneur' | 'existing_entrepreneur' | 'unemployed_youth' | 'experienced_worker' | 'general_jobseeker' | null;
    region: string | null;
    language: string | null;
    stage: 'idea' | 'MVP' | 'early_revenue' | 'scaling' | null;
    timezone: string | null;
  };
  summary: string;
  goal_setting: {
    primary_goal: string;
    timeframe: '24h' | '4w' | '3m' | '12m' | 'none' | null;
    previous_experience: string[];
    current_skills: string[];
    target_roles_or_markets: string[];
    current_challenges: string[];
    time_commitment_hours_per_week: number | null;
    budget_usd_cap: number | null;
    constraints: string[];
  };
  skillcraft_summary: {
    top_skills: Array<{
      name: string;
      evidence: string;
    }>;
    personality: {
      extraversion: 'low' | 'medium' | 'high' | null;
      agreeableness: 'low' | 'medium' | 'high' | null;
      conscientiousness: 'low' | 'medium' | 'high' | null;
      emotional_regulation: 'low' | 'medium' | 'high' | null;
      openness: 'low' | 'medium' | 'high' | null;
      notes: string;
    };
    source_doc: string;
  };
  derived_insights: {
    strengths: string[];
    risks: string[];
    capability_gaps: string[];
    learning_topics: string[];
    personality_implications: string[];
  };
  availability: {
    weekly_windows: Array<{
      day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
      start_local: string;
      end_local: string;
    }>;
    notes: string;
  };
  normalizations: {
    skills_taxonomy: Array<{
      raw: string;
      normalized: string;
    }>;
    personality_mapping_notes: string;
  };
  assumptions: string[];
  confidence: 'high' | 'medium' | 'low';
  tokens_estimate: number;
}

export interface WoopWish {
  wish_statement: string;
  rationale: string;
  clarifying_question: string | null;
}

export interface WoopOutcome {
  positive_outcome: string;
  success_metrics: string[];
  rationale: string;
  clarifying_question: string | null;
}

export interface WoopObstacles {
  internal_obstacles: string[];
  external_obstacles: string[];
  capability_gaps: string[];
  rationale: string;
  clarifying_question: string | null;
}

export interface WoopPlan {
  roadmap_steps: Array<{
    step: string;
    actions: string[];
    measurement: string;
    timeline: string;
  }>;
  business_plan: {
    budget_considerations: string[];
    ops_considerations: string[];
    gtm_considerations: string[];
  };
}

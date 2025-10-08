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
  business_plan: KingsTrustBusinessPlan;
}

export interface KingsTrustBusinessPlan {
  metadata?: {
    version?: string;
    generated_at?: string;
    authoring_tool?: string;
  };
  getting_started: {
    business_name: string;
    owners: Array<{
      name: string;
      role?: string;
      email?: string;
      phone?: string;
    }>;
    business_contacts: {
      address: string;
      postcode?: string;
      telephone?: string;
      email?: string;
    };
    home_contacts?: {
      address?: string;
      postcode?: string;
      telephone?: string;
      email?: string;
    };
  };
  section_1_executive_summary: {
    business_summary: string;
    business_aims: string;
    financial_summary: string;
    elevator_pitch: {
      business_name: string;
      strapline: string;
      pitch: string;
    };
  };
  section_2_owner_background: {
    motivation: string;
    work_experience?: Array<{
      employer?: string;
      role?: string;
      dates?: string;
      responsibilities?: string;
    }>;
    qualifications_education?: string;
    training_completed?: string[];
    training_planned?: string[];
    hobbies_interests?: string;
    additional_information?: string;
  };
  section_3_products_services: {
    selling_type: 'product' | 'service' | 'both';
    basic_description: string;
    offerings?: Array<{
      name: string;
      description: string;
      launch_phase?: 'start' | 'later';
      planned_start_date?: string;
    }>;
    rollout_rationale?: string;
    additional_information?: string;
  };
  section_4_market: {
    customer_type: 'individuals' | 'businesses' | 'both';
    typical_customer: string;
    customer_locations?: string;
    buying_triggers?: string;
    choice_factors?: string;
    previous_sales?: {
      has_sold: boolean;
      details?: string;
    };
    waiting_customers?: {
      has_waiting_customers: boolean;
      details?: string;
    };
    additional_information?: string;
  };
  section_5_market_research: {
    desk_research_findings?: string;
    field_research_questionnaires?: string;
    field_research_test_trading?: string;
    additional_information?: string;
  };
  section_6_marketing_strategy: {
    activities?: Array<{
      activity: string;
      rationale: string;
      estimated_cost?: number;
      notes?: string;
    }>;
    total_estimated_cost?: number;
  };
  section_7_competitor_analysis: {
    competitors?: Array<{
      name?: string;
      location?: string;
      product_service?: string;
      price?: string;
      strengths?: string;
      weaknesses?: string;
      business_size?: string;
    }>;
    swot: {
      strengths: string;
      weaknesses: string;
      opportunities: string;
      threats: string;
    };
    usp?: string;
  };
  section_8_operations_logistics: {
    production?: string;
    delivery?: string;
    payment_methods_terms?: string;
    suppliers?: Array<{
      name?: string;
      location?: string;
      items_required?: string;
      prices?: string;
      payment_arrangements?: string;
      reason_for_choice?: string;
    }>;
    premises?: string;
    equipment?: Array<{
      item?: string;
      already_owned?: boolean;
      condition?: 'new' | 'second_hand';
      purchased_from?: string;
      price?: number;
    }>;
    transport?: string;
    legal_requirements?: string;
    insurance?: string;
    management_staff?: string;
    additional_information?: string;
  };
  section_9_costs_pricing_strategy: {
    pricing_table?: Array<{
      product_service_name?: string;
      units_in_calc?: number;
      components?: string;
      total_cost?: number;
      cost_per_unit?: number;
      price_per_unit?: number;
      profit_margin_amount?: number;
      profit_margin_percent?: number;
      markup_percent?: number;
    }>;
  };
  section_10_financial_forecasts: {
    sales_and_costs_forecast: Array<{
      month_index?: number;
      month_name: string;
      sales_forecast: number;
      costs_forecast: number;
      assumptions?: string;
    }>;
    personal_survival_budget: {
      costs: Array<{
        category: string;
        monthly_cost: number;
      }>;
      income: Array<{
        source: string;
        monthly_amount: number;
      }>;
    };
    cashflow_forecast: Array<{
      month_index?: number;
      month_name: string;
      money_in: {
        princes_trust_funding?: number;
        other_funding?: number;
        own_funds?: number;
        sales_income?: number;
        other?: number;
        total: number;
      };
      money_out: {
        trust_loan_repayments?: number;
        personal_drawings?: number;
        other?: number;
        total: number;
      };
      opening_balance?: number;
      closing_balance?: number;
    }>;
    startup_costs_table: Array<{
      item: string;
      calculation: string;
      total_cost: number;
    }>;
  };
  section_11_backup_plan: {
    short_term_plan?: string;
    long_term_plan?: string;
    plan_b?: string;
    plan_b_additional?: string;
  };
}

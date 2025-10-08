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

export interface WoopPlanOwner {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface WoopPlanContact {
  address: string;
  postcode?: string;
  telephone?: string;
  email?: string;
}

export interface WoopPlanHomeContact {
  address?: string;
  postcode?: string;
  telephone?: string;
  email?: string;
}

export interface WoopPlanGettingStarted {
  business_name: string;
  owners: WoopPlanOwner[];
  business_contacts: WoopPlanContact;
  home_contacts?: WoopPlanHomeContact;
}

export interface WoopPlanElevatorPitch {
  business_name: string;
  strapline: string;
  pitch: string;
}

export interface WoopPlanExecutiveSummary {
  business_summary: string;
  business_aims: string;
  financial_summary: string;
  elevator_pitch: WoopPlanElevatorPitch;
}

export interface WoopPlanWorkExperienceEntry {
  employer?: string;
  role?: string;
  dates?: string;
  responsibilities?: string;
}

export interface WoopPlanOwnerBackground {
  motivation: string;
  work_experience?: WoopPlanWorkExperienceEntry[];
  qualifications_education?: string;
  training_completed?: string[];
  training_planned?: string[];
  hobbies_interests?: string;
  additional_information?: string;
}

export interface WoopPlanOffering {
  name: string;
  description: string;
  launch_phase?: 'start' | 'later';
  planned_start_date?: string;
}

export interface WoopPlanProductsServices {
  selling_type: 'product' | 'service' | 'both';
  basic_description: string;
  offerings?: WoopPlanOffering[];
  rollout_rationale?: string;
  additional_information?: string;
}

export interface WoopPlanPreviousSales {
  has_sold: boolean;
  details?: string;
}

export interface WoopPlanWaitingCustomers {
  has_waiting_customers: boolean;
  details?: string;
}

export interface WoopPlanMarket {
  customer_type: 'individuals' | 'businesses' | 'both';
  typical_customer: string;
  customer_locations?: string;
  buying_triggers?: string;
  choice_factors?: string;
  previous_sales: WoopPlanPreviousSales;
  waiting_customers: WoopPlanWaitingCustomers;
  additional_information?: string;
}

export interface WoopPlanMarketResearch {
  desk_research_findings?: string;
  field_research_questionnaires?: string;
  field_research_test_trading?: string;
  additional_information?: string;
}

export interface WoopPlanMarketingActivity {
  activity: string;
  rationale: string;
  estimated_cost?: number;
  notes?: string;
}

export interface WoopPlanMarketingStrategy {
  activities?: WoopPlanMarketingActivity[];
  total_estimated_cost?: number;
}

export interface WoopPlanCompetitorEntry {
  name?: string;
  location?: string;
  product_service?: string;
  price?: string;
  strengths?: string;
  weaknesses?: string;
  business_size?: string;
}

export interface WoopPlanSWOT {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export interface WoopPlanCompetitorAnalysis {
  competitors?: WoopPlanCompetitorEntry[];
  swot: WoopPlanSWOT;
  usp?: string;
}

export interface WoopPlanSupplier {
  name?: string;
  location?: string;
  items_required?: string;
  prices?: string;
  payment_arrangements?: string;
  reason_for_choice?: string;
}

export interface WoopPlanEquipmentItem {
  item?: string;
  already_owned?: boolean;
  condition?: 'new' | 'second_hand';
  purchased_from?: string;
  price?: number;
}

export interface WoopPlanOperationsLogistics {
  production?: string;
  delivery?: string;
  payment_methods_terms?: string;
  suppliers?: WoopPlanSupplier[];
  premises?: string;
  equipment?: WoopPlanEquipmentItem[];
  transport?: string;
  legal_requirements?: string;
  insurance?: string;
  management_staff?: string;
  additional_information?: string;
}

export interface WoopPlanPricingEntry {
  product_service_name?: string;
  units_in_calc?: number;
  components?: string;
  total_cost?: number;
  cost_per_unit?: number;
  price_per_unit?: number;
  profit_margin_amount?: number;
  profit_margin_percent?: number;
  markup_percent?: number;
}

export interface WoopPlanCostsPricingStrategy {
  pricing_table?: WoopPlanPricingEntry[];
}

export interface WoopPlanSalesCostForecastEntry {
  month_index?: number;
  month_name: string;
  sales_forecast: number;
  costs_forecast: number;
  assumptions?: string;
}

export interface WoopPlanPersonalSurvivalBudgetEntry {
  category: string;
  monthly_cost: number;
}

export interface WoopPlanPersonalSurvivalIncomeEntry {
  source: string;
  monthly_amount: number;
}

export interface WoopPlanMoneyIn {
  princes_trust_funding?: number;
  other_funding?: number;
  own_funds?: number;
  sales_income?: number;
  other?: number;
  total: number;
}

export interface WoopPlanMoneyOut {
  trust_loan_repayments?: number;
  personal_drawings?: number;
  other?: number;
  total: number;
}

export interface WoopPlanCashflowEntry {
  month_index?: number;
  month_name: string;
  money_in: WoopPlanMoneyIn;
  money_out: WoopPlanMoneyOut;
  opening_balance?: number;
  closing_balance?: number;
}

export interface WoopPlanStartupCostEntry {
  item: string;
  calculation: string;
  total_cost: number;
}

export interface WoopPlanFinancialForecasts {
  sales_and_costs_forecast: WoopPlanSalesCostForecastEntry[];
  personal_survival_budget: {
    costs: WoopPlanPersonalSurvivalBudgetEntry[];
    income: WoopPlanPersonalSurvivalIncomeEntry[];
  };
  cashflow_forecast: WoopPlanCashflowEntry[];
  startup_costs_table: WoopPlanStartupCostEntry[];
}

export interface WoopPlanBackupPlan {
  short_term_plan?: string;
  long_term_plan?: string;
  plan_b?: string;
  plan_b_additional?: string;
}

export interface WoopPlanMetadata {
  version?: string;
  generated_at?: string;
  authoring_tool?: string;
}

export interface WoopPlan {
  metadata?: WoopPlanMetadata;
  getting_started: WoopPlanGettingStarted;
  section_1_executive_summary: WoopPlanExecutiveSummary;
  section_2_owner_background: WoopPlanOwnerBackground;
  section_3_products_services: WoopPlanProductsServices;
  section_4_market: WoopPlanMarket;
  section_5_market_research: WoopPlanMarketResearch;
  section_6_marketing_strategy: WoopPlanMarketingStrategy;
  section_7_competitor_analysis: WoopPlanCompetitorAnalysis;
  section_8_operations_logistics: WoopPlanOperationsLogistics;
  section_9_costs_pricing_strategy: WoopPlanCostsPricingStrategy;
  section_10_financial_forecasts: WoopPlanFinancialForecasts;
  section_11_backup_plan: WoopPlanBackupPlan;
}

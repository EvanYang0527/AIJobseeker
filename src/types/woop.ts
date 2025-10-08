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
  metadata?: BusinessPlanMetadata;
  getting_started: BusinessPlanGettingStarted;
  section_1_executive_summary: BusinessPlanExecutiveSummary;
  section_2_owner_background: BusinessPlanOwnerBackground;
  section_3_products_services: BusinessPlanProductsServices;
  section_4_market: BusinessPlanMarket;
  section_5_market_research?: BusinessPlanMarketResearch;
  section_6_marketing_strategy?: BusinessPlanMarketingStrategy;
  section_7_competitor_analysis?: BusinessPlanCompetitorAnalysis;
  section_8_operations_logistics?: BusinessPlanOperationsLogistics;
  section_9_costs_pricing_strategy?: BusinessPlanCostsPricingStrategy;
  section_10_financial_forecasts: BusinessPlanFinancialForecasts;
  section_11_backup_plan?: BusinessPlanBackupPlan;
}

export interface BusinessPlanMetadata {
  version?: string;
  generated_at?: string;
  authoring_tool?: string;
}

export interface BusinessPlanContact {
  address: string;
  postcode?: string;
  telephone?: string;
  email?: string;
}

export interface BusinessPlanOwner {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface BusinessPlanGettingStarted {
  business_name: string;
  owners: BusinessPlanOwner[];
  business_contacts: BusinessPlanContact;
  home_contacts?: BusinessPlanContact;
}

export interface BusinessPlanElevatorPitch {
  business_name: string;
  strapline: string;
  pitch: string;
}

export interface BusinessPlanExecutiveSummary {
  business_summary: string;
  business_aims: string;
  financial_summary: string;
  elevator_pitch: BusinessPlanElevatorPitch;
}

export interface BusinessPlanWorkExperience {
  employer?: string;
  role?: string;
  dates?: string;
  responsibilities?: string;
}

export interface BusinessPlanOwnerBackground {
  motivation: string;
  work_experience?: BusinessPlanWorkExperience[];
  qualifications_education?: string;
  training_completed?: string[];
  training_planned?: string[];
  hobbies_interests?: string;
  additional_information?: string;
}

export type BusinessPlanSellingType = 'product' | 'service' | 'both';

export interface BusinessPlanOffering {
  name: string;
  description: string;
  launch_phase?: 'start' | 'later';
  planned_start_date?: string;
}

export interface BusinessPlanProductsServices {
  selling_type: BusinessPlanSellingType;
  basic_description: string;
  offerings?: BusinessPlanOffering[];
  rollout_rationale?: string;
  additional_information?: string;
}

export type BusinessPlanCustomerType = 'individuals' | 'businesses' | 'both';

export interface BusinessPlanPreviousSales {
  has_sold: boolean;
  details?: string;
}

export interface BusinessPlanWaitingCustomers {
  has_waiting_customers: boolean;
  details?: string;
}

export interface BusinessPlanMarket {
  customer_type: BusinessPlanCustomerType;
  typical_customer: string;
  customer_locations?: string;
  buying_triggers?: string;
  choice_factors?: string;
  previous_sales?: BusinessPlanPreviousSales;
  waiting_customers?: BusinessPlanWaitingCustomers;
  additional_information?: string;
}

export interface BusinessPlanMarketResearch {
  desk_research_findings?: string;
  field_research_questionnaires?: string;
  field_research_test_trading?: string;
  additional_information?: string;
}

export interface BusinessPlanMarketingActivity {
  activity: string;
  rationale: string;
  estimated_cost?: number;
  notes?: string;
}

export interface BusinessPlanMarketingStrategy {
  activities?: BusinessPlanMarketingActivity[];
  total_estimated_cost?: number;
}

export interface BusinessPlanCompetitor {
  name?: string;
  location?: string;
  product_service?: string;
  price?: string;
  strengths?: string;
  weaknesses?: string;
  business_size?: string;
}

export interface BusinessPlanSwot {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export interface BusinessPlanCompetitorAnalysis {
  competitors?: BusinessPlanCompetitor[];
  swot?: BusinessPlanSwot;
  usp?: string;
}

export interface BusinessPlanSupplier {
  name?: string;
  location?: string;
  items_required?: string;
  prices?: string;
  payment_arrangements?: string;
  reason_for_choice?: string;
}

export interface BusinessPlanEquipmentItem {
  item?: string;
  already_owned?: boolean;
  condition?: 'new' | 'second_hand';
  purchased_from?: string;
  price?: number;
}

export interface BusinessPlanOperationsLogistics {
  production?: string;
  delivery?: string;
  payment_methods_terms?: string;
  suppliers?: BusinessPlanSupplier[];
  premises?: string;
  equipment?: BusinessPlanEquipmentItem[];
  transport?: string;
  legal_requirements?: string;
  insurance?: string;
  management_staff?: string;
  additional_information?: string;
}

export interface BusinessPlanPricingTableEntry {
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

export interface BusinessPlanCostsPricingStrategy {
  pricing_table?: BusinessPlanPricingTableEntry[];
}

export interface BusinessPlanSalesCostForecastEntry {
  month_index?: number;
  month_name: string;
  sales_forecast: number;
  costs_forecast: number;
  assumptions?: string;
}

export interface BusinessPlanPersonalSurvivalBudgetEntry {
  category: string;
  monthly_cost: number;
}

export interface BusinessPlanPersonalSurvivalIncomeEntry {
  source: string;
  monthly_amount: number;
}

export interface BusinessPlanPersonalSurvivalBudget {
  costs: BusinessPlanPersonalSurvivalBudgetEntry[];
  income: BusinessPlanPersonalSurvivalIncomeEntry[];
}

export interface BusinessPlanCashflowMoneyIn {
  princes_trust_funding?: number;
  other_funding?: number;
  own_funds?: number;
  sales_income?: number;
  other?: number;
  total: number;
}

export interface BusinessPlanCashflowMoneyOut {
  trust_loan_repayments?: number;
  personal_drawings?: number;
  other?: number;
  total: number;
}

export interface BusinessPlanCashflowEntry {
  month_index?: number;
  month_name: string;
  money_in: BusinessPlanCashflowMoneyIn;
  money_out: BusinessPlanCashflowMoneyOut;
  opening_balance?: number;
  closing_balance?: number;
}

export interface BusinessPlanStartupCostEntry {
  item: string;
  calculation: string;
  total_cost: number;
}

export interface BusinessPlanFinancialForecasts {
  sales_and_costs_forecast: BusinessPlanSalesCostForecastEntry[];
  personal_survival_budget: BusinessPlanPersonalSurvivalBudget;
  cashflow_forecast: BusinessPlanCashflowEntry[];
  startup_costs_table: BusinessPlanStartupCostEntry[];
}

export interface BusinessPlanBackupPlan {
  short_term_plan?: string;
  long_term_plan?: string;
  plan_b?: string;
  plan_b_additional?: string;
}

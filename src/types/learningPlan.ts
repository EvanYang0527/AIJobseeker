export type LearningPlanDifficulty = 'beginner' | 'intermediate' | 'advanced' | null;

export type VentureStage = 'idea' | 'MVP' | 'early_revenue' | 'scaling';

export interface LearningPlanSequenceItem {
  order: number;
  course_title: string;
  provider_name: string;
  url: string;
  difficulty: LearningPlanDifficulty;
  estimated_hours: number;
  planned_weekly_hours: number;
  expected_duration_weeks: number;
  why_chosen: string;
}

export interface LearningPlanCourseSummary {
  course_title: string;
  provider_name: string;
  url: string;
  difficulty: LearningPlanDifficulty;
  estimated_hours: number;
}

export interface LearningPlanRecommendation {
  skill: string;
  user_info: {
    stage: VentureStage;
    region: string | null;
    background: string | null;
  };
  time_commitment_hours_per_week: number;
  learning_plan: {
    plan_summary: string;
    weekly_hours: number;
    total_duration_weeks: number;
    sequence: LearningPlanSequenceItem[];
  };
  all_relevant_courses: LearningPlanCourseSummary[];
  assumptions: string[];
  confidence: 'high' | 'medium' | 'low';
}

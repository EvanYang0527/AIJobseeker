// KPI Definitions and Calculation Formulas
// Production-ready specifications for all dashboard metrics

export interface KPIDefinition {
  id: string;
  name: string;
  description: string;
  category: 'job_seekers' | 'entrepreneurs' | 'shared';
  formula: string;
  sqlQuery: string;
  unit: 'percentage' | 'number' | 'currency' | 'ratio' | 'days';
  target?: number;
  benchmark?: number;
  aggregationLevel: 'individual' | 'cohort' | 'regional' | 'national';
  updateFrequency: 'real-time' | 'daily' | 'weekly' | 'monthly';
  privacyLevel: 'public' | 'internal' | 'restricted';
}

export const KPI_DEFINITIONS: KPIDefinition[] = [
  // Job Seekers KPIs
  {
    id: 'js_placement_rate',
    name: 'Job Placement Rate',
    description: 'Percentage of job seekers who secured employment within 6 months of program completion',
    category: 'job_seekers',
    formula: '(Placed Job Seekers / Total Completed Job Seekers) * 100',
    sqlQuery: `
      SELECT 
        (COUNT(CASE WHEN p.placement_date IS NOT NULL 
               AND p.placement_date <= js.completion_date + INTERVAL '6 months' 
               THEN 1 END) * 100.0 / COUNT(*)) as placement_rate
      FROM job_seekers js
      LEFT JOIN placements p ON js.user_id = p.user_id
      WHERE js.completion_date >= CURRENT_DATE - INTERVAL '12 months'
        AND js.status = 'completed'
    `,
    unit: 'percentage',
    target: 75,
    benchmark: 68,
    aggregationLevel: 'cohort',
    updateFrequency: 'weekly',
    privacyLevel: 'public'
  },
  {
    id: 'js_time_to_placement',
    name: 'Average Time to Placement',
    description: 'Average number of days from program start to job placement',
    category: 'job_seekers',
    formula: 'AVG(Placement Date - Program Start Date)',
    sqlQuery: `
      SELECT 
        AVG(p.placement_date - js.start_date) as avg_time_to_placement_days
      FROM job_seekers js
      INNER JOIN placements p ON js.user_id = p.user_id
      WHERE p.placement_date >= CURRENT_DATE - INTERVAL '12 months'
        AND p.placement_date IS NOT NULL
    `,
    unit: 'days',
    target: 120,
    benchmark: 135,
    aggregationLevel: 'cohort',
    updateFrequency: 'weekly',
    privacyLevel: 'public'
  },
  {
    id: 'js_retention_rate',
    name: '6-Month Job Retention Rate',
    description: 'Percentage of placed job seekers still employed after 6 months',
    category: 'job_seekers',
    formula: '(Retained Placements / Total Placements) * 100',
    sqlQuery: `
      SELECT 
        (COUNT(CASE WHEN p.retention_6_months = true THEN 1 END) * 100.0 / COUNT(*)) as retention_rate
      FROM placements p
      WHERE p.placement_date >= CURRENT_DATE - INTERVAL '18 months'
        AND p.placement_date <= CURRENT_DATE - INTERVAL '6 months'
    `,
    unit: 'percentage',
    target: 85,
    benchmark: 78,
    aggregationLevel: 'cohort',
    updateFrequency: 'monthly',
    privacyLevel: 'public'
  },
  {
    id: 'js_skills_gap_closure',
    name: 'Skills Gap Closure Rate',
    description: 'Percentage improvement in skills assessment scores from start to completion',
    category: 'job_seekers',
    formula: '((Final Score - Initial Score) / Initial Score) * 100',
    sqlQuery: `
      SELECT 
        AVG(((final_assessment.score - initial_assessment.score) * 100.0 / initial_assessment.score)) as skills_improvement
      FROM job_seekers js
      INNER JOIN assessments initial_assessment ON js.user_id = initial_assessment.user_id 
        AND initial_assessment.assessment_type = 'initial_skills'
      INNER JOIN assessments final_assessment ON js.user_id = final_assessment.user_id 
        AND final_assessment.assessment_type = 'final_skills'
      WHERE js.completion_date >= CURRENT_DATE - INTERVAL '12 months'
    `,
    unit: 'percentage',
    target: 70,
    benchmark: 65,
    aggregationLevel: 'individual',
    updateFrequency: 'monthly',
    privacyLevel: 'internal'
  },
  {
    id: 'js_program_completion',
    name: 'Program Completion Rate',
    description: 'Percentage of enrolled job seekers who complete all required modules',
    category: 'job_seekers',
    formula: '(Completed Participants / Total Enrolled) * 100',
    sqlQuery: `
      SELECT 
        (COUNT(CASE WHEN js.status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) as completion_rate
      FROM job_seekers js
      WHERE js.enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
    `,
    unit: 'percentage',
    target: 90,
    benchmark: 82,
    aggregationLevel: 'cohort',
    updateFrequency: 'weekly',
    privacyLevel: 'public'
  },
  {
    id: 'js_salary_improvement',
    name: 'Average Salary Improvement',
    description: 'Average increase in salary compared to pre-program employment',
    category: 'job_seekers',
    formula: 'AVG(Post-Program Salary - Pre-Program Salary)',
    sqlQuery: `
      SELECT 
        AVG(p.salary - COALESCE(js.previous_salary, 0)) as avg_salary_improvement
      FROM job_seekers js
      INNER JOIN placements p ON js.user_id = p.user_id
      WHERE p.placement_date >= CURRENT_DATE - INTERVAL '12 months'
        AND p.salary IS NOT NULL
    `,
    unit: 'currency',
    target: 8000,
    benchmark: 6500,
    aggregationLevel: 'cohort',
    updateFrequency: 'monthly',
    privacyLevel: 'internal'
  },

  // Entrepreneurs KPIs
  {
    id: 'ent_learning_completion',
    name: 'Learning Module Completion Rate',
    description: 'Percentage of entrepreneurs completing all learning modules',
    category: 'entrepreneurs',
    formula: '(Completed Modules / Total Required Modules) * 100',
    sqlQuery: `
      SELECT 
        (COUNT(CASE WHEN em.completion_date IS NOT NULL THEN 1 END) * 100.0 / 
         COUNT(*)) as learning_completion_rate
      FROM entrepreneurs e
      INNER JOIN entrepreneur_modules em ON e.user_id = em.user_id
      WHERE e.enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
    `,
    unit: 'percentage',
    target: 85,
    benchmark: 78,
    aggregationLevel: 'cohort',
    updateFrequency: 'weekly',
    privacyLevel: 'public'
  },
  {
    id: 'ent_networking_engagement',
    name: 'Networking Engagement Rate',
    description: 'Percentage of entrepreneurs actively participating in networking events',
    category: 'entrepreneurs',
    formula: '(Active Networkers / Total Entrepreneurs) * 100',
    sqlQuery: `
      SELECT 
        (COUNT(DISTINCT CASE WHEN me.attendance_date >= CURRENT_DATE - INTERVAL '3 months' 
               THEN e.user_id END) * 100.0 / COUNT(DISTINCT e.user_id)) as networking_engagement
      FROM entrepreneurs e
      LEFT JOIN mentorship_events me ON e.user_id = me.user_id
      WHERE e.enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
    `,
    unit: 'percentage',
    target: 80,
    benchmark: 72,
    aggregationLevel: 'cohort',
    updateFrequency: 'monthly',
    privacyLevel: 'public'
  },
  {
    id: 'ent_businesses_registered',
    name: 'New Businesses Registered',
    description: 'Number of formal businesses registered by program participants',
    category: 'entrepreneurs',
    formula: 'COUNT(Registered Businesses)',
    sqlQuery: `
      SELECT 
        COUNT(*) as businesses_registered
      FROM businesses b
      INNER JOIN entrepreneurs e ON b.owner_id = e.user_id
      WHERE b.registration_date >= CURRENT_DATE - INTERVAL '12 months'
        AND b.status = 'active'
    `,
    unit: 'number',
    target: 200,
    benchmark: 150,
    aggregationLevel: 'national',
    updateFrequency: 'weekly',
    privacyLevel: 'public'
  },
  {
    id: 'ent_jobs_created',
    name: 'Jobs Created by New Businesses',
    description: 'Total employment opportunities created by participant businesses',
    category: 'entrepreneurs',
    formula: 'SUM(Employee Count per Business)',
    sqlQuery: `
      SELECT 
        SUM(b.employee_count) as total_jobs_created
      FROM businesses b
      INNER JOIN entrepreneurs e ON b.owner_id = e.user_id
      WHERE b.registration_date >= CURRENT_DATE - INTERVAL '12 months'
        AND b.status = 'active'
        AND b.employee_count > 0
    `,
    unit: 'number',
    target: 500,
    benchmark: 380,
    aggregationLevel: 'national',
    updateFrequency: 'monthly',
    privacyLevel: 'public'
  },
  {
    id: 'ent_funding_accessed',
    name: 'Total Funding Accessed',
    description: 'Cumulative funding secured by program participants (in millions)',
    category: 'entrepreneurs',
    formula: 'SUM(Funding Amount) / 1,000,000',
    sqlQuery: `
      SELECT 
        SUM(f.amount) / 1000000.0 as total_funding_millions
      FROM funding f
      INNER JOIN businesses b ON f.business_id = b.id
      INNER JOIN entrepreneurs e ON b.owner_id = e.user_id
      WHERE f.funding_date >= CURRENT_DATE - INTERVAL '12 months'
        AND f.status = 'approved'
    `,
    unit: 'currency',
    target: 5.0,
    benchmark: 3.2,
    aggregationLevel: 'national',
    updateFrequency: 'monthly',
    privacyLevel: 'public'
  },
  {
    id: 'ent_program_roi',
    name: 'Program Return on Investment',
    description: 'Economic value generated per dollar of program investment',
    category: 'entrepreneurs',
    formula: '(Economic Value Generated / Program Investment Cost)',
    sqlQuery: `
      SELECT 
        (SUM(b.annual_revenue) + SUM(f.amount)) / 
        (SELECT SUM(program_cost) FROM interventions WHERE track = 'entrepreneur') as program_roi
      FROM businesses b
      INNER JOIN entrepreneurs e ON b.owner_id = e.user_id
      LEFT JOIN funding f ON b.id = f.business_id
      WHERE b.registration_date >= CURRENT_DATE - INTERVAL '12 months'
    `,
    unit: 'ratio',
    target: 4.0,
    benchmark: 2.8,
    aggregationLevel: 'national',
    updateFrequency: 'monthly',
    privacyLevel: 'internal'
  },
  {
    id: 'ent_business_survival',
    name: '12-Month Business Survival Rate',
    description: 'Percentage of businesses still operating after 12 months',
    category: 'entrepreneurs',
    formula: '(Active Businesses after 12 months / Total Businesses) * 100',
    sqlQuery: `
      SELECT 
        (COUNT(CASE WHEN b.status = 'active' THEN 1 END) * 100.0 / COUNT(*)) as survival_rate
      FROM businesses b
      INNER JOIN entrepreneurs e ON b.owner_id = e.user_id
      WHERE b.registration_date >= CURRENT_DATE - INTERVAL '24 months'
        AND b.registration_date <= CURRENT_DATE - INTERVAL '12 months'
    `,
    unit: 'percentage',
    target: 75,
    benchmark: 65,
    aggregationLevel: 'cohort',
    updateFrequency: 'monthly',
    privacyLevel: 'public'
  },

  // Shared/Cross-Track KPIs
  {
    id: 'shared_total_enrollment',
    name: 'Total Program Enrollment',
    description: 'Combined enrollment across all tracks',
    category: 'shared',
    formula: 'COUNT(Job Seekers) + COUNT(Entrepreneurs)',
    sqlQuery: `
      SELECT 
        (SELECT COUNT(*) FROM job_seekers WHERE enrollment_date >= CURRENT_DATE - INTERVAL '12 months') +
        (SELECT COUNT(*) FROM entrepreneurs WHERE enrollment_date >= CURRENT_DATE - INTERVAL '12 months') as total_enrollment
    `,
    unit: 'number',
    target: 10000,
    benchmark: 8500,
    aggregationLevel: 'national',
    updateFrequency: 'daily',
    privacyLevel: 'public'
  },
  {
    id: 'shared_demographic_diversity',
    name: 'Demographic Diversity Index',
    description: 'Measure of demographic representation across gender, age, and education',
    category: 'shared',
    formula: '1 - SUM((Group_i / Total)^2) for all demographic groups',
    sqlQuery: `
      WITH demographics AS (
        SELECT gender, age_group, education_level, COUNT(*) as group_count
        FROM (
          SELECT gender, age_group, education_level FROM job_seekers 
          WHERE enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
          UNION ALL
          SELECT gender, age_group, education_level FROM entrepreneurs 
          WHERE enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
        ) combined
        GROUP BY gender, age_group, education_level
      ),
      total AS (SELECT SUM(group_count) as total_participants FROM demographics)
      SELECT 
        1 - SUM(POWER(group_count * 1.0 / total_participants, 2)) as diversity_index
      FROM demographics, total
    `,
    unit: 'ratio',
    target: 0.85,
    benchmark: 0.78,
    aggregationLevel: 'national',
    updateFrequency: 'monthly',
    privacyLevel: 'internal'
  },
  {
    id: 'shared_regional_coverage',
    name: 'Regional Coverage Rate',
    description: 'Percentage of regions with active program participants',
    category: 'shared',
    formula: '(Regions with Participants / Total Regions) * 100',
    sqlQuery: `
      WITH active_regions AS (
        SELECT DISTINCT region_id FROM (
          SELECT region_id FROM job_seekers WHERE enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
          UNION
          SELECT region_id FROM entrepreneurs WHERE enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
        ) combined
      )
      SELECT 
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM regions)) as regional_coverage
      FROM active_regions
    `,
    unit: 'percentage',
    target: 95,
    benchmark: 87,
    aggregationLevel: 'national',
    updateFrequency: 'monthly',
    privacyLevel: 'public'
  }
];

// Sample SQL Queries for Common Policy Questions
export const POLICY_QUERIES = {
  employment_vs_entrepreneurship_by_gender: `
    WITH job_seeker_outcomes AS (
      SELECT 
        js.gender,
        COUNT(*) as total_js,
        COUNT(CASE WHEN p.placement_date IS NOT NULL THEN 1 END) as placed_js
      FROM job_seekers js
      LEFT JOIN placements p ON js.user_id = p.user_id
      WHERE js.enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY js.gender
    ),
    entrepreneur_outcomes AS (
      SELECT 
        e.gender,
        COUNT(*) as total_ent,
        COUNT(CASE WHEN b.status = 'active' THEN 1 END) as active_businesses
      FROM entrepreneurs e
      LEFT JOIN businesses b ON e.user_id = b.owner_id
      WHERE e.enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY e.gender
    )
    SELECT 
      COALESCE(js.gender, ent.gender) as gender,
      js.total_js,
      js.placed_js,
      (js.placed_js * 100.0 / js.total_js) as js_success_rate,
      ent.total_ent,
      ent.active_businesses,
      (ent.active_businesses * 100.0 / ent.total_ent) as ent_success_rate
    FROM job_seeker_outcomes js
    FULL OUTER JOIN entrepreneur_outcomes ent ON js.gender = ent.gender
    ORDER BY gender;
  `,

  regional_performance_comparison: `
    SELECT 
      r.region_name,
      COUNT(DISTINCT js.user_id) as job_seekers,
      COUNT(DISTINCT e.user_id) as entrepreneurs,
      COUNT(DISTINCT p.id) as placements,
      COUNT(DISTINCT b.id) as businesses,
      AVG(p.salary) as avg_placement_salary,
      SUM(b.employee_count) as jobs_created
    FROM regions r
    LEFT JOIN job_seekers js ON r.id = js.region_id 
      AND js.enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
    LEFT JOIN entrepreneurs e ON r.id = e.region_id 
      AND e.enrollment_date >= CURRENT_DATE - INTERVAL '12 months'
    LEFT JOIN placements p ON js.user_id = p.user_id
    LEFT JOIN businesses b ON e.user_id = b.owner_id AND b.status = 'active'
    GROUP BY r.id, r.region_name
    ORDER BY (COUNT(DISTINCT js.user_id) + COUNT(DISTINCT e.user_id)) DESC;
  `,

  intervention_effectiveness: `
    SELECT 
      i.intervention_name,
      i.track,
      COUNT(DISTINCT ui.user_id) as participants,
      AVG(CASE 
        WHEN i.track = 'job_seeker' THEN 
          CASE WHEN p.placement_date IS NOT NULL THEN 1 ELSE 0 END
        WHEN i.track = 'entrepreneur' THEN 
          CASE WHEN b.status = 'active' THEN 1 ELSE 0 END
      END) * 100 as success_rate,
      i.cost_per_participant,
      (i.cost_per_participant / NULLIF(AVG(CASE 
        WHEN i.track = 'job_seeker' THEN 
          CASE WHEN p.placement_date IS NOT NULL THEN 1 ELSE 0 END
        WHEN i.track = 'entrepreneur' THEN 
          CASE WHEN b.status = 'active' THEN 1 ELSE 0 END
      END), 0)) as cost_per_success
    FROM interventions i
    LEFT JOIN user_interventions ui ON i.id = ui.intervention_id
    LEFT JOIN placements p ON ui.user_id = p.user_id AND i.track = 'job_seeker'
    LEFT JOIN businesses b ON ui.user_id = b.owner_id AND i.track = 'entrepreneur'
    WHERE ui.participation_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY i.id, i.intervention_name, i.track, i.cost_per_participant
    ORDER BY success_rate DESC;
  `
};
-- AI Jobseeker Tool - Complete Database Schema
-- Production-ready PostgreSQL schema with indexes, constraints, and privacy considerations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Regions table for geographic organization
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_name VARCHAR(100) NOT NULL UNIQUE,
    region_code VARCHAR(10) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL DEFAULT 'South Africa',
    population INTEGER,
    economic_indicators JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Demographics and shared user information
CREATE TABLE shared_demographics (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE, -- PII: Restricted access
    gender VARCHAR(50),
    age_group VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 18 AND 24 THEN '18-24'
            WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 25 AND 34 THEN '25-34'
            WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 35 AND 44 THEN '35-44'
            WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 45 AND 54 THEN '45-54'
            ELSE '55+'
        END
    ) STORED,
    education_level VARCHAR(100),
    region_id UUID REFERENCES regions(id),
    disability_status BOOLEAN DEFAULT FALSE,
    language_preference VARCHAR(10) DEFAULT 'en',
    consent_data_processing BOOLEAN NOT NULL DEFAULT FALSE,
    consent_research BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Privacy constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_gender CHECK (gender IN ('Male', 'Female', 'Non-binary', 'Prefer not to say')),
    CONSTRAINT valid_education CHECK (education_level IN ('Primary', 'Secondary', 'High School', 'Some College', 'Bachelor''s', 'Master''s', 'PhD', 'Other'))
);

-- Job Seekers pathway tracking
CREATE TABLE job_seekers (
    user_id UUID PRIMARY KEY REFERENCES shared_demographics(user_id) ON DELETE CASCADE,
    track_level VARCHAR(20) NOT NULL CHECK (track_level IN ('early', 'mid', 'advanced')),
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_date DATE,
    completion_date DATE,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'active', 'completed', 'dropped', 'suspended')),
    previous_employment_status VARCHAR(50),
    previous_salary DECIMAL(10,2), -- PII: Restricted access
    target_industry VARCHAR(100),
    skills_assessment_score DECIMAL(5,2),
    program_completion_percentage DECIMAL(5,2) DEFAULT 0,
    case_manager_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Entrepreneur pathway tracking
CREATE TABLE entrepreneurs (
    user_id UUID PRIMARY KEY REFERENCES shared_demographics(user_id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_date DATE,
    completion_date DATE,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'active', 'completed', 'dropped', 'suspended')),
    business_idea TEXT,
    business_category VARCHAR(100),
    experience_years INTEGER DEFAULT 0,
    time_commitment VARCHAR(50),
    skillcraft_score DECIMAL(5,2),
    program_completion_percentage DECIMAL(5,2) DEFAULT 0,
    mentor_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Learning modules and curriculum
CREATE TABLE learning_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_name VARCHAR(200) NOT NULL,
    module_code VARCHAR(50) UNIQUE NOT NULL,
    track_type VARCHAR(20) NOT NULL CHECK (track_type IN ('job_seeker', 'entrepreneur', 'shared')),
    track_level VARCHAR(20) CHECK (track_level IN ('early', 'mid', 'advanced', 'all')),
    module_order INTEGER NOT NULL,
    duration_hours DECIMAL(4,2),
    content_type VARCHAR(50) CHECK (content_type IN ('video', 'interactive', 'assessment', 'workshop', 'reading')),
    is_mandatory BOOLEAN DEFAULT TRUE,
    prerequisites JSONB, -- Array of prerequisite module IDs
    learning_objectives TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User progress through learning modules
CREATE TABLE user_module_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES shared_demographics(user_id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES learning_modules(id),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    assessment_score DECIMAL(5,2),
    time_spent_minutes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
    
    UNIQUE(user_id, module_id)
);

-- Mentorship and networking events
CREATE TABLE mentorship_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('mentorship', 'networking', 'workshop', 'webinar', 'conference')),
    track_focus VARCHAR(20) CHECK (track_focus IN ('job_seeker', 'entrepreneur', 'both')),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    location VARCHAR(200),
    is_virtual BOOLEAN DEFAULT FALSE,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    facilitator_name VARCHAR(200),
    description TEXT,
    cost DECIMAL(8,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Event participation tracking
CREATE TABLE event_participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES shared_demographics(user_id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES mentorship_events(id),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    attendance_date TIMESTAMP WITH TIME ZONE,
    attendance_status VARCHAR(20) DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'no_show', 'cancelled')),
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comments TEXT,
    
    UNIQUE(user_id, event_id)
);

-- Business entities created by entrepreneurs
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES entrepreneurs(user_id),
    business_name VARCHAR(200) NOT NULL,
    business_type VARCHAR(100),
    industry VARCHAR(100),
    registration_number VARCHAR(100) UNIQUE,
    registration_date DATE,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'registered', 'active', 'inactive', 'closed')),
    employee_count INTEGER DEFAULT 0,
    annual_revenue DECIMAL(12,2),
    business_address TEXT,
    website_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Funding and investment tracking
CREATE TABLE funding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    funding_type VARCHAR(50) NOT NULL CHECK (funding_type IN ('grant', 'loan', 'investment', 'crowdfunding', 'personal')),
    funding_source VARCHAR(200),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    funding_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'approved', 'disbursed', 'rejected', 'cancelled')),
    terms_and_conditions TEXT,
    repayment_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job placements for job seekers
CREATE TABLE placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES job_seekers(user_id),
    employer_name VARCHAR(200) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    employment_type VARCHAR(50) CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'temporary', 'internship')),
    placement_date DATE NOT NULL,
    salary DECIMAL(10,2), -- PII: Restricted access
    currency VARCHAR(3) DEFAULT 'ZAR',
    location VARCHAR(200),
    is_remote BOOLEAN DEFAULT FALSE,
    retention_3_months BOOLEAN,
    retention_6_months BOOLEAN,
    retention_12_months BOOLEAN,
    job_satisfaction_rating INTEGER CHECK (job_satisfaction_rating BETWEEN 1 AND 5),
    placement_source VARCHAR(100), -- How they found the job
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Program interventions and their effectiveness
CREATE TABLE interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intervention_name VARCHAR(200) NOT NULL,
    intervention_type VARCHAR(100) NOT NULL,
    track VARCHAR(20) NOT NULL CHECK (track IN ('job_seeker', 'entrepreneur', 'both')),
    description TEXT,
    target_demographic JSONB, -- JSON object with targeting criteria
    cost_per_participant DECIMAL(8,2),
    duration_weeks INTEGER,
    success_metrics JSONB, -- JSON array of success criteria
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User participation in interventions
CREATE TABLE user_interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES shared_demographics(user_id) ON DELETE CASCADE,
    intervention_id UUID NOT NULL REFERENCES interventions(id),
    participation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completion_date DATE,
    outcome_achieved BOOLEAN,
    outcome_metrics JSONB, -- JSON object with specific outcomes
    cost_actual DECIMAL(8,2),
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comments TEXT,
    
    UNIQUE(user_id, intervention_id)
);

-- Assessments and test results
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES shared_demographics(user_id) ON DELETE CASCADE,
    assessment_type VARCHAR(50) NOT NULL CHECK (assessment_type IN ('skillcraft', 'riasec', 'initial_skills', 'final_skills', 'personality', 'aptitude')),
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    percentile_rank DECIMAL(5,2),
    detailed_results JSONB, -- JSON object with detailed breakdown
    recommendations TEXT[],
    assessor_id UUID,
    is_baseline BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log for data access and changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Admin user who performed action
    target_user_id UUID, -- User whose data was accessed/modified
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for efficient querying
    INDEX idx_audit_timestamp (timestamp),
    INDEX idx_audit_target_user (target_user_id),
    INDEX idx_audit_action (action)
);

--
-- INDEXES FOR PERFORMANCE
--

-- Demographics indexes
CREATE INDEX idx_demographics_region ON shared_demographics(region_id);
CREATE INDEX idx_demographics_age_group ON shared_demographics(age_group);
CREATE INDEX idx_demographics_gender ON shared_demographics(gender);
CREATE INDEX idx_demographics_education ON shared_demographics(education_level);
CREATE INDEX idx_demographics_created_at ON shared_demographics(created_at);

-- Job seekers indexes
CREATE INDEX idx_job_seekers_track_level ON job_seekers(track_level);
CREATE INDEX idx_job_seekers_status ON job_seekers(status);
CREATE INDEX idx_job_seekers_enrollment_date ON job_seekers(enrollment_date);
CREATE INDEX idx_job_seekers_completion_date ON job_seekers(completion_date);

-- Entrepreneurs indexes
CREATE INDEX idx_entrepreneurs_status ON entrepreneurs(status);
CREATE INDEX idx_entrepreneurs_enrollment_date ON entrepreneurs(enrollment_date);
CREATE INDEX idx_entrepreneurs_business_category ON entrepreneurs(business_category);

-- Placements indexes
CREATE INDEX idx_placements_user_id ON placements(user_id);
CREATE INDEX idx_placements_placement_date ON placements(placement_date);
CREATE INDEX idx_placements_industry ON placements(industry);
CREATE INDEX idx_placements_employment_type ON placements(employment_type);

-- Businesses indexes
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_industry ON businesses(industry);
CREATE INDEX idx_businesses_registration_date ON businesses(registration_date);

-- Events and participation indexes
CREATE INDEX idx_events_event_date ON mentorship_events(event_date);
CREATE INDEX idx_events_track_focus ON mentorship_events(track_focus);
CREATE INDEX idx_participation_user_id ON event_participation(user_id);
CREATE INDEX idx_participation_attendance_date ON event_participation(attendance_date);

-- Module progress indexes
CREATE INDEX idx_module_progress_user_id ON user_module_progress(user_id);
CREATE INDEX idx_module_progress_completion_date ON user_module_progress(completion_date);

-- Composite indexes for common queries
CREATE INDEX idx_job_seekers_region_status ON job_seekers(status) INCLUDE (user_id);
CREATE INDEX idx_entrepreneurs_region_status ON entrepreneurs(status) INCLUDE (user_id);
CREATE INDEX idx_placements_date_retention ON placements(placement_date, retention_6_months);

--
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
--

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shared_demographics_updated_at BEFORE UPDATE ON shared_demographics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_seekers_updated_at BEFORE UPDATE ON job_seekers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entrepreneurs_updated_at BEFORE UPDATE ON entrepreneurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_placements_updated_at BEFORE UPDATE ON placements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

--
-- VIEWS FOR COMMON QUERIES
--

-- Job seeker outcomes view
CREATE VIEW job_seeker_outcomes AS
SELECT 
    js.user_id,
    sd.region_id,
    sd.gender,
    sd.age_group,
    sd.education_level,
    js.track_level,
    js.enrollment_date,
    js.completion_date,
    js.status,
    p.placement_date,
    p.salary,
    p.retention_6_months,
    CASE WHEN p.placement_date IS NOT NULL THEN TRUE ELSE FALSE END as is_placed,
    CASE WHEN js.completion_date IS NOT NULL THEN 
        EXTRACT(DAYS FROM (js.completion_date - js.enrollment_date))
    END as program_duration_days,
    CASE WHEN p.placement_date IS NOT NULL AND js.enrollment_date IS NOT NULL THEN
        EXTRACT(DAYS FROM (p.placement_date - js.enrollment_date))
    END as time_to_placement_days
FROM job_seekers js
JOIN shared_demographics sd ON js.user_id = sd.user_id
LEFT JOIN placements p ON js.user_id = p.user_id;

-- Entrepreneur outcomes view
CREATE VIEW entrepreneur_outcomes AS
SELECT 
    e.user_id,
    sd.region_id,
    sd.gender,
    sd.age_group,
    sd.education_level,
    e.enrollment_date,
    e.completion_date,
    e.status,
    e.business_category,
    b.registration_date,
    b.status as business_status,
    b.employee_count,
    b.annual_revenue,
    CASE WHEN b.id IS NOT NULL THEN TRUE ELSE FALSE END as has_business,
    COALESCE(f.total_funding, 0) as total_funding_received
FROM entrepreneurs e
JOIN shared_demographics sd ON e.user_id = sd.user_id
LEFT JOIN businesses b ON e.user_id = b.owner_id
LEFT JOIN (
    SELECT business_id, SUM(amount) as total_funding
    FROM funding 
    WHERE status = 'disbursed'
    GROUP BY business_id
) f ON b.id = f.business_id;

--
-- SAMPLE DATA INSERTS
--

-- Insert sample regions
INSERT INTO regions (region_name, region_code, population) VALUES
('Western Cape', 'WC', 6844272),
('Gauteng', 'GP', 15810388),
('KwaZulu-Natal', 'KZN', 11513575),
('Eastern Cape', 'EC', 6712276);

-- The sample CSV data will be provided separately for data loading
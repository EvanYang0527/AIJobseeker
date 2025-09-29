# Privacy & Data Governance Rules
## AI Jobseeker Tool Admin Dashboard

### Data Suppression Thresholds

#### Minimum Count Rules
- **Individual Level**: Never display individual records in admin interface
- **Small Groups**: Suppress any aggregation with N < 5 participants
- **Regional Data**: Suppress regional breakdowns with N < 10 participants  
- **Demographic Slices**: Suppress intersectional demographics with N < 15 participants
- **Employer Data**: Suppress employer-specific data with N < 3 placements

#### Suppression Display
```
- Counts < 5: Display as "< 5"
- Percentages with small denominators: Display as "Insufficient data"
- Charts with suppressed data: Show "Data suppressed for privacy" annotation
- Tables: Replace suppressed cells with "—" or "N/A"
```

### PII Handling & Access Control

#### Restricted Fields (Admin Only)
- `date_of_birth` - Only age_group derived field visible to most users
- `previous_salary` - Only salary ranges visible in reports
- `current_salary` - Aggregated statistics only
- `phone_number` - Masked display (XXX-XXX-1234)
- `email` - Domain statistics only, not individual emails

#### Role-Based Data Access
```typescript
interface DataAccessRules {
  'super_admin': {
    pii_access: true,
    individual_records: true,
    salary_data: true,
    export_raw_data: true
  },
  'policy_analyst': {
    pii_access: false,
    individual_records: false,
    salary_data: 'aggregated_only',
    export_raw_data: false
  },
  'program_manager': {
    pii_access: false,
    individual_records: false,
    salary_data: 'ranges_only',
    export_raw_data: false
  },
  'regional_coordinator': {
    pii_access: false,
    individual_records: false,
    salary_data: false,
    export_raw_data: false,
    region_filter: 'assigned_regions_only'
  }
}
```

### Anonymization Strategies

#### Data Aggregation Rules
1. **Geographic Aggregation**: 
   - Suppress municipality level if N < 20
   - Roll up to provincial level automatically
   - Never display GPS coordinates

2. **Temporal Aggregation**:
   - Monthly minimum for trend analysis
   - Quarterly preferred for small cohorts
   - Annual for demographic breakdowns

3. **Demographic Intersections**:
   - Maximum 2 demographic dimensions simultaneously
   - Auto-suppress rare combinations
   - Provide "Other" category for small groups

#### K-Anonymity Implementation
```sql
-- Example: Ensure k=5 anonymity for demographic reporting
WITH demographic_groups AS (
  SELECT 
    age_group,
    gender,
    education_level,
    region_id,
    COUNT(*) as group_size
  FROM shared_demographics 
  GROUP BY age_group, gender, education_level, region_id
  HAVING COUNT(*) >= 5
)
SELECT * FROM demographic_groups;
```

### Audit Logging Requirements

#### Logged Actions
- All PII field access attempts
- Data export operations
- Filter changes that narrow to small cohorts
- Individual record views (if permitted by role)
- Report generation with parameters
- Dashboard page visits with filters

#### Audit Log Schema
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'view', 'export', 'filter', 'report'
  resource_type VARCHAR(50), -- 'dashboard', 'report', 'individual_record'
  resource_id UUID,
  pii_accessed BOOLEAN DEFAULT FALSE,
  filter_parameters JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Retention policy: 7 years for compliance
  CONSTRAINT audit_retention CHECK (timestamp > CURRENT_TIMESTAMP - INTERVAL '7 years')
);
```

### Data Retention & Deletion

#### Retention Periods
- **Active Participants**: Retain while enrolled + 5 years
- **Completed Programs**: 7 years from completion
- **Dropped Participants**: 3 years from last activity
- **Audit Logs**: 7 years (compliance requirement)
- **Aggregated Reports**: Indefinite (no PII)

#### Right to Erasure Implementation
```sql
-- Anonymization procedure for data subject requests
CREATE OR REPLACE FUNCTION anonymize_user_data(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Replace PII with anonymized values
  UPDATE shared_demographics 
  SET 
    email = 'anonymized_' || target_user_id::text || '@deleted.local',
    phone_number = NULL,
    full_name = 'Anonymized User',
    date_of_birth = NULL
  WHERE user_id = target_user_id;
  
  -- Remove salary information
  UPDATE job_seekers 
  SET previous_salary = NULL 
  WHERE user_id = target_user_id;
  
  UPDATE placements 
  SET salary = NULL 
  WHERE user_id = target_user_id;
  
  -- Log the anonymization
  INSERT INTO audit_log (admin_user_id, action_type, resource_type, resource_id)
  VALUES (NULL, 'anonymize', 'user_record', target_user_id);
END;
$$ LANGUAGE plpgsql;
```

### Export Controls & Watermarking

#### Export Restrictions
- **CSV Exports**: Maximum 1000 rows, aggregated data only
- **PDF Reports**: Watermarked with user ID and timestamp
- **Excel Files**: Password protected, expiry date embedded
- **API Access**: Rate limited, logged, requires API key

#### Watermarking Implementation
```typescript
interface ExportWatermark {
  generated_by: string; // Admin user ID
  generated_at: string; // ISO timestamp
  data_period: string; // Date range of data
  suppression_applied: boolean;
  export_id: string; // Unique export identifier
  expires_at: string; // Data freshness expiry
}

// Add to all exported files
const watermark = {
  generated_by: currentUser.id,
  generated_at: new Date().toISOString(),
  data_period: `${startDate} to ${endDate}`,
  suppression_applied: true,
  export_id: generateUUID(),
  expires_at: addDays(new Date(), 30).toISOString()
};
```

### Consent Management

#### Data Processing Consent
- **Required**: Explicit consent for program participation data
- **Optional**: Consent for research and longitudinal studies
- **Granular**: Separate consent for different data uses
- **Revocable**: Users can withdraw consent, triggering anonymization

#### Consent Tracking
```sql
CREATE TABLE consent_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES shared_demographics(user_id),
  consent_type VARCHAR(50) NOT NULL, -- 'program_data', 'research', 'marketing'
  consent_given BOOLEAN NOT NULL,
  consent_date TIMESTAMP WITH TIME ZONE NOT NULL,
  consent_method VARCHAR(50), -- 'web_form', 'paper', 'verbal'
  withdrawn_date TIMESTAMP WITH TIME ZONE,
  legal_basis VARCHAR(100), -- GDPR legal basis
  
  -- Ensure current consent status is tracked
  UNIQUE(user_id, consent_type, consent_date)
);
```

### Cross-Border Data Transfer

#### Data Residency Rules
- **Primary Storage**: All data stored within South Africa
- **Backup Locations**: African Union countries only
- **Processing**: No processing outside Africa without explicit consent
- **Analytics**: Aggregated data only for international research

#### Transfer Safeguards
```typescript
interface DataTransferSafeguards {
  destination_country: string;
  legal_basis: 'adequacy_decision' | 'standard_contractual_clauses' | 'consent';
  data_types: string[]; // Only aggregated, anonymized data
  purpose: string;
  retention_period: string;
  deletion_certificate_required: boolean;
}
```

### Incident Response Procedures

#### Data Breach Classification
- **Level 1**: Unauthorized access to aggregated data (< 24h response)
- **Level 2**: Unauthorized access to PII (< 4h response)  
- **Level 3**: Data exfiltration or system compromise (< 1h response)

#### Breach Response Workflow
1. **Detection**: Automated alerts + manual reporting
2. **Assessment**: Impact analysis within 1 hour
3. **Containment**: Immediate access revocation
4. **Investigation**: Forensic analysis of access logs
5. **Notification**: Regulatory notification within 72 hours
6. **Remediation**: System hardening and user notification
7. **Review**: Post-incident review and policy updates

### Compliance Monitoring

#### Automated Compliance Checks
```sql
-- Daily compliance monitoring queries
-- Check for potential privacy violations

-- 1. Detect small group reporting
SELECT 
  'Small group detected' as alert_type,
  COUNT(*) as group_size,
  age_group, gender, region_id
FROM shared_demographics 
GROUP BY age_group, gender, region_id
HAVING COUNT(*) BETWEEN 1 AND 4;

-- 2. Monitor excessive PII access
SELECT 
  admin_user_id,
  COUNT(*) as pii_access_count,
  DATE(timestamp) as access_date
FROM audit_log 
WHERE pii_accessed = TRUE 
  AND timestamp >= CURRENT_DATE - INTERVAL '1 day'
GROUP BY admin_user_id, DATE(timestamp)
HAVING COUNT(*) > 50; -- Threshold for investigation

-- 3. Check data retention compliance
SELECT 
  'Retention violation' as alert_type,
  COUNT(*) as expired_records
FROM shared_demographics sd
LEFT JOIN job_seekers js ON sd.user_id = js.user_id
LEFT JOIN entrepreneurs e ON sd.user_id = e.user_id
WHERE (
  (js.completion_date IS NOT NULL AND js.completion_date < CURRENT_DATE - INTERVAL '7 years')
  OR (e.completion_date IS NOT NULL AND e.completion_date < CURRENT_DATE - INTERVAL '7 years')
  OR (js.status = 'dropped' AND js.updated_at < CURRENT_DATE - INTERVAL '3 years')
  OR (e.status = 'dropped' AND e.updated_at < CURRENT_DATE - INTERVAL '3 years')
);
```

### Privacy Impact Assessment

#### Regular PIA Reviews
- **Quarterly**: Review data collection practices
- **Annually**: Full privacy impact assessment
- **Ad-hoc**: Before implementing new features
- **Incident-driven**: After any privacy incidents

#### PIA Checklist
- [ ] Data minimization principles applied
- [ ] Purpose limitation enforced
- [ ] Storage limitation implemented  
- [ ] Accuracy measures in place
- [ ] Security measures adequate
- [ ] Accountability measures documented
- [ ] Individual rights procedures established
- [ ] Cross-border transfer safeguards active
- [ ] Vendor privacy agreements current
- [ ] Staff privacy training completed
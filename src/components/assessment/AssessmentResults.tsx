import React from 'react';
import { Brain, Target, TrendingUp, Award, BarChart3, Clock, Zap, Users, Eye, Heart, CheckCircle } from 'lucide-react';

interface WageEmploymentResults {
  assessment_report: {
    candidate_id: string;
    date: string;
    summary: string;
    skills: {
      problem_solving_and_learning_ability: {
        description: string;
        indicators: string[];
      };
    };
    personality: {
      [key: string]: {
        traits: string[];
      };
    };
    resources: {
      more_info: string;
    };
  };
}

interface AssessmentResultsProps {
  results?: WageEmploymentResults;
  isWageEmployment?: boolean;
}

// Helper functions for score colors and labels
const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-neuro-success';
  if (score >= 60) return 'text-neuro-primary';
  if (score >= 40) return 'text-neuro-warning';
  return 'text-neuro-error';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'Developing';
};

// Wage Employment placeholder data
const wageEmploymentResults: WageEmploymentResults = {
  assessment_report: {
    candidate_id: "AB",
    date: "2025-09-16",
    summary: "SkillCraft assessments provide insights into skills, mindset, and personality traits. Results are indicative and may vary with training and experience.",
    skills: {
      problem_solving_and_learning_ability: {
        description: "The ability to identify patterns and formulate information for problem solving as well as learning potential when faced with new and unfamiliar problems.",
        indicators: [
          "Ability to solve complex problems using logical reasoning"
        ]
      }
    },
    personality: {
      introversion: {
        traits: [
          "Reserved / Shy / Quiet",
          "Good listener / Thoughtful",
          "Generally likes working with things / tasks",
          "May be withdrawn"
        ]
      },
      extraversion: {
        traits: [
          "Social / Friendly",
          "Likes attention",
          "Generally likes working with people",
          "May be too talkative"
        ]
      },
      independence: {
        traits: [
          "Has strong opinions",
          "Assertive and direct",
          "Willing to disagree",
          "May be too confrontational and challenging"
        ]
      },
      agreeableness: {
        traits: [
          "Accommodating",
          "Helpful",
          "Trusting",
          "Dislikes conflict and may be too willing to agree"
        ]
      },
      spontaneous: {
        traits: [
          "Likes freedom from the rules",
          "Flexible and adaptable",
          "Laid back",
          "May be impulsive and disorganised"
        ]
      },
      conscientious: {
        traits: [
          "Well planned and organised",
          "Reliable",
          "Self-Disciplined",
          "May be too structured and inflexible"
        ]
      },
      emotional: {
        traits: [
          "Passionate and excitable",
          "Feels strongly about things",
          "Easily shows their emotions",
          "May get too stressed and anxious"
        ]
      },
      composed: {
        traits: [
          "Calm and collected",
          "Even tempered",
          "Don't easily show their emotions",
          "May be uninspiring and lacking in passion"
        ]
      },
      traditionality: {
        traits: [
          "Prefers familiarity, stability and routine",
          "Ideas are usually practical",
          "Likes analysis and evidence",
          "May be resistant to change"
        ]
      },
      openness: {
        traits: [
          "Likes new ideas",
          "Enjoys variety and new experiences",
          "Curious",
          "May lack focus and follow through"
        ]
      }
    },
    resources: {
      more_info: "https://www.sayouth.mobi"
    }
  }
};

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ results, isWageEmployment = false }) => {
  if (isWageEmployment) {
    const data = results as WageEmploymentResults || wageEmploymentResults;
    const report = data.assessment_report;

    return (
      <div className="space-y-6">
        {/* Assessment Complete Header */}
        <div className="neuro-card bg-gradient-to-r from-neuro-bg-light to-neuro-bg">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 neuro-icon mr-4">
              <Brain className="w-8 h-8 text-neuro-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold neuro-text-primary">Assessment Complete</h3>
              <p className="neuro-text-secondary">Your comprehensive SkillsCraft evaluation results</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center neuro-surface p-4 rounded-neuro">
              <div className="text-2xl font-bold text-neuro-primary">95%</div>
              <div className="text-sm neuro-text-secondary">Completion Rate</div>
            </div>
            <div className="text-center neuro-surface p-4 rounded-neuro">
              <div className="text-2xl font-bold text-neuro-success">8.2/10</div>
              <div className="text-sm neuro-text-secondary">Overall Score</div>
            </div>
            <div className="text-center neuro-surface p-4 rounded-neuro">
              <div className="text-2xl font-bold text-neuro-secondary">45min</div>
              <div className="text-sm neuro-text-secondary">Time Spent</div>
            </div>
            <div className="text-center neuro-surface p-4 rounded-neuro">
              <div className="text-2xl font-bold text-neuro-warning">12</div>
              <div className="text-sm neuro-text-secondary">Assessments</div>
            </div>
          </div>
        </div>

        {/* Personality Assessment Table */}
        <div className="neuro-card">
          <h4 className="text-xl font-bold neuro-text-primary mb-6 text-center">Personality</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personality trait cards with neumorphic design */}
            {Object.entries(report.personality).map(([trait, data], index) => {
              const colors = [
                'from-neuro-primary to-blue-400',
                'from-neuro-success to-green-400',
                'from-neuro-secondary to-pink-400',
                'from-neuro-warning to-yellow-400',
                'from-purple-500 to-purple-400',
                'from-indigo-500 to-indigo-400',
                'from-red-500 to-red-400',
                'from-teal-500 to-teal-400',
                'from-amber-500 to-amber-400',
                'from-cyan-500 to-cyan-400'
              ];
              
              return (
                <div key={trait} className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
                  <div className={`w-12 h-12 neuro-icon bg-gradient-to-br ${colors[index % colors.length]} mb-4`}>
                    <span className="text-white font-bold text-lg">{trait[0].toUpperCase()}</span>
                  </div>
                  <h5 className="font-bold neuro-text-primary mb-4 text-xl capitalize">{trait}</h5>
                  <ul className="space-y-3 text-sm neuro-text-secondary">
                    {data.traits.map((traitDesc, traitIndex) => (
                      <li key={traitIndex} className="flex items-start">
                        <span className="w-2 h-2 bg-neuro-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        {traitDesc}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 text-center text-sm neuro-text-muted neuro-inset p-4 rounded-neuro">
            For more information on opportunities go to <span className="font-semibold">www.sayouth.mobi</span>
          </div>
        </div>
      </div>
    );
  }

  // Legacy entrepreneur/career discovery results
  const legacyResults = {
    bretMetadata: {
      riskBehaviour: "moderate risk taker",
      meanParcelsCollected: 7.2,
      total: 850,
      completed: true
    },
    cptMetadata: {
      percentCorrect: 87.5,
      meanRT: 245,
      probHits: 0.92
    },
    digitSpanMetadata: {
      fML: 6.2,
      bML: 5.8,
      MS: 11.0
    },
    tmtMetadata: {
      trailATime: 32.5,
      trailBTime: 68.2,
      combinedErrors: 2
    }
  };

  // Calculate scores
  const calculateBigFiveScores = () => {
    return {
      openness: Math.floor(Math.random() * 30) + 60,
      conscientiousness: Math.floor(Math.random() * 30) + 65,
      extraversion: Math.floor(Math.random() * 30) + 55,
      agreeableness: Math.floor(Math.random() * 30) + 70,
      neuroticism: Math.floor(Math.random() * 30) + 45
    };
  };

  const calculateRiasecScores = () => {
    return {
      realistic: Math.floor(Math.random() * 30) + 60,
      investigative: Math.floor(Math.random() * 30) + 70,
      artistic: Math.floor(Math.random() * 30) + 45,
      social: Math.floor(Math.random() * 30) + 75,
      enterprising: Math.floor(Math.random() * 30) + 65,
      conventional: Math.floor(Math.random() * 30) + 50
    };
  };

  const bigFiveScores = calculateBigFiveScores();
  const riasecScores = calculateRiasecScores();

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="neuro-card bg-gradient-to-r from-neuro-bg-light to-neuro-bg">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 neuro-icon mr-4">
            <Brain className="w-8 h-8 text-neuro-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold neuro-text-primary">Assessment Complete</h3>
            <p className="neuro-text-secondary">Your comprehensive SkillsCraft evaluation results</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center neuro-surface p-4 rounded-neuro">
            <div className="text-2xl font-bold text-neuro-primary">95%</div>
            <div className="text-sm neuro-text-secondary">Completion Rate</div>
          </div>
          <div className="text-center neuro-surface p-4 rounded-neuro">
            <div className="text-2xl font-bold text-neuro-success">8.2/10</div>
            <div className="text-sm neuro-text-secondary">Overall Score</div>
          </div>
          <div className="text-center neuro-surface p-4 rounded-neuro">
            <div className="text-2xl font-bold text-neuro-secondary">45min</div>
            <div className="text-sm neuro-text-secondary">Time Spent</div>
          </div>
          <div className="text-center neuro-surface p-4 rounded-neuro">
            <div className="text-2xl font-bold text-neuro-warning">12</div>
            <div className="text-sm neuro-text-secondary">Assessments</div>
          </div>
        </div>
      </div>

      {/* Cognitive Assessment Results */}
      <div className="neuro-card">
        <h4 className="text-lg font-bold neuro-text-primary mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-neuro-primary" />
          Cognitive Assessment Results
        </h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="neuro-surface p-4 rounded-neuro">
            <h5 className="font-semibold neuro-text-primary mb-2">Working Memory</h5>
            <div className="flex items-center justify-between">
              <span className="text-sm neuro-text-secondary">Digit Span Score</span>
              <span className="font-semibold text-neuro-primary">{legacyResults.digitSpanMetadata?.MS || 11.0}</span>
            </div>
            <div className="w-full neuro-inset rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-neuro-primary to-neuro-primary-light h-2 rounded-full transition-all duration-500" style={{ width: `${(legacyResults.digitSpanMetadata?.MS || 11.0) * 8}%` }}></div>
            </div>
          </div>
          
          <div className="neuro-surface p-4 rounded-neuro">
            <h5 className="font-semibold neuro-text-primary mb-2">Attention</h5>
            <div className="flex items-center justify-between">
              <span className="text-sm neuro-text-secondary">CPT Accuracy</span>
              <span className="font-semibold text-neuro-success">{legacyResults.cptMetadata?.percentCorrect || 87.5}%</span>
            </div>
            <div className="w-full neuro-inset rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-neuro-success to-green-400 h-2 rounded-full transition-all duration-500" style={{ width: `${legacyResults.cptMetadata?.percentCorrect || 87.5}%` }}></div>
            </div>
          </div>
          
          <div className="neuro-surface p-4 rounded-neuro">
            <h5 className="font-semibold neuro-text-primary mb-2">Processing Speed</h5>
            <div className="flex items-center justify-between">
              <span className="text-sm neuro-text-secondary">TMT Combined</span>
              <span className="font-semibold text-neuro-secondary">{Math.round((legacyResults.tmtMetadata?.trailATime || 32.5) + (legacyResults.tmtMetadata?.trailBTime || 68.2))}s</span>
            </div>
            <div className="w-full neuro-inset rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-neuro-secondary to-pink-400 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Assessment */}
      <div className="neuro-card">
        <h4 className="text-xl font-bold neuro-text-primary mb-6 text-center">Personality</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personality trait cards */}
          {[
            { name: 'Introversion', traits: ['Reserved / Shy / Quiet', 'Good listener / Thoughtful', 'Generally likes working with things / tasks', 'May be withdrawn'], color: 'from-neuro-primary to-blue-400' },
            { name: 'Extraversion', traits: ['Social / Friendly', 'Likes attention', 'Generally likes working with people', 'May be too talkative'], color: 'from-neuro-success to-green-400' },
            { name: 'Independence', traits: ['Has strong opinions', 'Assertive and direct', 'Willing to disagree', 'May be too confrontational and challenging'], color: 'from-neuro-secondary to-pink-400' },
            { name: 'Agreeableness', traits: ['Accommodating', 'Helpful', 'Trusting', 'Dislikes conflict and may be too willing to agree'], color: 'from-neuro-warning to-yellow-400' },
            { name: 'Spontaneous', traits: ['Likes freedom from the rules', 'Flexible and adaptable', 'Laid back', 'May be impulsive and disorganised'], color: 'from-purple-500 to-purple-400' },
            { name: 'Conscientious', traits: ['Well planned and organised', 'Reliable', 'Self-Disciplined', 'May be too structured and inflexible'], color: 'from-indigo-500 to-indigo-400' },
            { name: 'Emotional', traits: ['Passionate and excitable', 'Feels strongly about things', 'Easily shows their emotions', 'May get too stressed and anxious'], color: 'from-red-500 to-red-400' },
            { name: 'Composed', traits: ['Calm and collected', 'Even tempered', 'Don\'t easily show their emotions', 'May be uninspiring and lacking in passion'], color: 'from-teal-500 to-teal-400' },
            { name: 'Traditionality', traits: ['Prefers familiarity, stability and routine', 'Ideas are usually practical', 'Likes analysis and evidence', 'May be resistant to change'], color: 'from-amber-500 to-amber-400' },
            { name: 'Openness', traits: ['Likes new ideas', 'Enjoys variety and new experiences', 'Curious', 'May lack focus and follow through'], color: 'from-cyan-500 to-cyan-400' }
          ].map((trait, index) => (
            <div key={trait.name} className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
              <div className={`w-12 h-12 neuro-icon bg-gradient-to-br ${trait.color} mb-4`}>
                <span className="text-white font-bold text-lg">{trait.name[0]}</span>
              </div>
              <h5 className="font-bold neuro-text-primary mb-4 text-xl">{trait.name}</h5>
              <ul className="space-y-3 text-sm neuro-text-secondary">
                {trait.traits.map((traitDesc, traitIndex) => (
                  <li key={traitIndex} className="flex items-start">
                    <span className="w-2 h-2 bg-neuro-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    {traitDesc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center text-sm neuro-text-muted neuro-inset p-4 rounded-neuro">
          For more information on opportunities go to <span className="font-semibold">www.sayouth.mobi</span>
        </div>
      </div>

      {/* RIASEC Career Interests */}
      <div className="neuro-card">
        <h4 className="text-lg font-bold neuro-text-primary mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-neuro-secondary" />
          Career Interest Profile (RIASEC)
        </h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(riasecScores).map(([interest, score]) => (
            <div key={interest} className="neuro-surface p-4 rounded-neuro">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold capitalize neuro-text-primary">{interest}</h5>
                <span className="text-lg font-bold neuro-text-primary">{score}%</span>
              </div>
              <div className="w-full neuro-inset rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    score >= 70 ? 'bg-gradient-to-r from-neuro-success to-green-400' : 
                    score >= 50 ? 'bg-gradient-to-r from-neuro-primary to-neuro-primary-light' : 
                    'bg-gradient-to-r from-neuro-text-muted to-gray-400'
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <p className="text-xs mt-2 neuro-text-muted">
                {interest === 'realistic' && 'Hands-on, practical work'}
                {interest === 'investigative' && 'Research and analysis'}
                {interest === 'artistic' && 'Creative expression'}
                {interest === 'social' && 'Helping and teaching'}
                {interest === 'enterprising' && 'Leadership and business'}
                {interest === 'conventional' && 'Organization and data'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Profile */}
      <div className="neuro-card">
        <h4 className="text-lg font-bold neuro-text-primary mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-neuro-warning" />
          Risk & Decision Making Profile
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="neuro-surface p-4 rounded-neuro">
            <h5 className="font-semibold neuro-text-primary mb-2">Risk Behaviour</h5>
            <div className="text-2xl font-bold text-neuro-warning mb-1">
              {legacyResults.bretMetadata?.riskBehaviour || "Moderate Risk Taker"}
            </div>
            <p className="text-sm neuro-text-secondary">
              Average parcels collected: {legacyResults.bretMetadata?.meanParcelsCollected || 7.2}
            </p>
          </div>
          
          <div className="neuro-surface p-4 rounded-neuro">
            <h5 className="font-semibold neuro-text-primary mb-2">Decision Making</h5>
            <div className="text-2xl font-bold text-neuro-primary mb-1">
              Strategic
            </div>
            <p className="text-sm neuro-text-secondary">
              Balanced approach to risk and reward
            </p>
          </div>
        </div>
      </div>

      {/* Additional Assessments */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="neuro-card">
          <h4 className="text-lg font-bold neuro-text-primary mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-neuro-success" />
            Growth Mindset
          </h4>
          <div className="text-center">
            <div className="text-3xl font-bold text-neuro-success mb-2">85%</div>
            <p className="neuro-text-secondary">Strong growth orientation and learning mindset</p>
          </div>
        </div>
        
        <div className="neuro-card">
          <h4 className="text-lg font-bold neuro-text-primary mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-neuro-secondary" />
            Proactive Personality
          </h4>
          <div className="text-center">
            <div className="text-3xl font-bold text-neuro-secondary mb-2">78%</div>
            <p className="neuro-text-secondary">High initiative and proactive behavior</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="neuro-card bg-gradient-to-r from-neuro-bg-light to-neuro-bg">
        <h4 className="text-lg font-bold neuro-text-primary mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-neuro-success" />
          Personalized Recommendations
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold neuro-text-primary mb-2">Strengths to Leverage</h5>
            <ul className="space-y-1 neuro-text-secondary">
              <li>• Strong analytical and investigative abilities</li>
              <li>• Excellent social and interpersonal skills</li>
              <li>• High growth mindset and adaptability</li>
              <li>• Balanced risk-taking approach</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold neuro-text-primary mb-2">Areas for Development</h5>
            <ul className="space-y-1 neuro-text-secondary">
              <li>• Enhance creative problem-solving skills</li>
              <li>• Build entrepreneurial confidence</li>
              <li>• Develop leadership communication</li>
              <li>• Strengthen decision-making speed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
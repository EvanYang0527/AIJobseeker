import { extractJsonString } from './azureOpenAI';

type OpenAIChatRole = 'system' | 'user' | 'assistant';

interface OpenAIMessage {
  role: OpenAIChatRole;
  content: string;
}

interface OpenAIChatCompletionResponse {
  choices?: Array<{
    message?: {
      role?: OpenAIChatRole;
      content?: string;
    };
  }>;
}

const CHAT_ID = '697bf57c9a2111f0895b1a0199edd48c';
const PROMPT = `Find 15 relevant courses (title, provider, URL) to develop the following skill

The user is at the idea stage of starting a food pop-up business in Maryland, USA, with a high school education and prior experience cooking at family events but no formal business background. To achieve their goals, they need to develop broader business skills in Business Financial Management, Regulatory Compliance & Permits, and Small Business Marketing & Customer Acquisition. The user can commit approximately 5–8 hours per week to focused learning and skill development. Generate a structured learning plan for business skills, tailored to the user’s profile and weekly time commitment.

Retrieve real courses (title, provider, URL, difficulty, estimated hours). Do NOT invent.
Rank courses by fit (difficulty × user stage × time commitment).
Build a sequenced plan (what to take first, next, etc.) and specify how many hours the user should spend on EACH course.
After the plan, also return ALL 15 retrieved courses (even those not chosen), for transparency.
Return VALID JSON only using the schema below (no extra text).
{ "skill": "string", "user_info": { "stage": "idea|MVP|early_revenue|scaling", "region": "string|null", "background": "string|null" }, "time_commitment_hours_per_week": 0, "learning_plan": { "plan_summary": "string", "weekly_hours": 0, "total_duration_weeks": 0, "sequence": [ { "order": 1, "course_title": "string", "provider_name": "string", "url": "string", "difficulty": "beginner|intermediate|advanced|null", "estimated_hours": 0, "planned_weekly_hours": 0, "expected_duration_weeks": 0, "why_chosen": "string" } ] }, "all_relevant_courses": [ { "course_title": "string", "provider_name": "string", "url": "string", "difficulty": "beginner|intermediate|advanced|null", "estimated_hours": 0 } ], "assumptions": ["string", "..."], "confidence": "high|medium|low" }`;

export interface LearningCourse {
  course_title: string;
  provider_name: string;
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  estimated_hours: number;
}

export interface LearningPlanSequenceItem extends LearningCourse {
  order: number;
  planned_weekly_hours: number;
  expected_duration_weeks: number;
  why_chosen: string;
}

export interface LearningPlan {
  plan_summary: string;
  weekly_hours: number;
  total_duration_weeks: number;
  sequence: LearningPlanSequenceItem[];
}

export interface LearningCourseRecommendationsResponse {
  skill: string;
  user_info: {
    stage: 'idea' | 'MVP' | 'early_revenue' | 'scaling';
    region: string | null;
    background: string | null;
  };
  time_commitment_hours_per_week: number;
  learning_plan: LearningPlan;
  all_relevant_courses: LearningCourse[];
  assumptions: string[];
  confidence: 'high' | 'medium' | 'low';
}

const buildRequestPayload = (): { model: string; messages: OpenAIMessage[]; stream: false } => ({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: PROMPT,
    },
  ],
  stream: false,
});

export const fetchLearningCourseRecommendations = async (signal?: AbortSignal) => {
  const baseUrl = import.meta.env.VITE_RAGFLOW_BACKEND_URL;
  const apiKey = import.meta.env.VITE_RAGFLOW_BACKEND_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error('RAGFlow environment variables are not configured.');
  }

  const response = await fetch(`${baseUrl}/api/v1/chats_openai/${CHAT_ID}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(buildRequestPayload()),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RAGFlow request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = (await response.json()) as OpenAIChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('RAGFlow response did not include any content.');
  }

  try {
    const jsonString = extractJsonString(content);
    return JSON.parse(jsonString) as LearningCourseRecommendationsResponse;
  } catch (error) {
    console.error('Failed to parse RAGFlow response', error, content);
    throw new Error('Unable to parse course recommendations from RAGFlow response.');
  }
};

export { PROMPT as LEARNING_COURSES_PROMPT };

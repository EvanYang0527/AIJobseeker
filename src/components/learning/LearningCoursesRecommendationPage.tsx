import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchLearningCourseRecommendations,
  LEARNING_COURSES_PROMPT,
  LearningCourse,
  LearningCourseRecommendationsResponse,
} from '../../utils/ragflow';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Loader2,
  RefreshCcw,
} from 'lucide-react';

const formatNumber = (value: number) => {
  if (Number.isNaN(value)) {
    return '0';
  }

  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(1);
};

const renderCourseLink = (course: LearningCourse) => (
  <a
    href={course.url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-neuro-primary hover:text-neuro-primary-light font-semibold inline-flex items-center gap-2"
  >
    <span>{course.course_title}</span>
    <ExternalLink className="w-4 h-4" />
  </a>
);

const stageLabels: Record<LearningCourseRecommendationsResponse['user_info']['stage'], string> = {
  idea: 'Idea stage entrepreneur',
  MVP: 'MVP stage entrepreneur',
  early_revenue: 'Early revenue stage entrepreneur',
  scaling: 'Scaling stage entrepreneur',
};

export const LearningCoursesRecommendationPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<LearningCourseRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadRecommendations = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchLearningCourseRecommendations(signal);
      if (signal?.aborted) {
        return;
      }

      setRecommendations(result);
      setLastUpdated(new Date());
    } catch (fetchError) {
      if (signal?.aborted) {
        return;
      }

      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        return;
      }

      console.error('Failed to fetch learning course recommendations', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch learning course recommendations.');
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const initiateFetch = useCallback(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    void loadRecommendations(controller.signal);
  }, [loadRecommendations]);

  useEffect(() => {
    initiateFetch();
    return () => abortControllerRef.current?.abort();
  }, [initiateFetch]);

  const userDetails = useMemo(() => {
    if (!recommendations) {
      return null;
    }

    const { user_info: userInfo, time_commitment_hours_per_week: weeklyHours } = recommendations;
    return {
      stage: stageLabels[userInfo.stage],
      region: userInfo.region ?? 'Not specified',
      background: userInfo.background ?? 'Not specified',
      weeklyHours,
    };
  }, [recommendations]);

  return (
    <div className="min-h-screen bg-neuro-bg-light py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold neuro-text-primary">Learning Course Recommendations</h1>
            <p className="neuro-text-secondary max-w-3xl mt-2">
              Retrieve a live course plan for building business fundamentals tailored to aspiring food pop-up entrepreneurs in
              Maryland. This page calls the RAGFlow chat completion API to generate recommendations, ensuring every course is
              sourced from the knowledge base.
            </p>
            <details className="mt-4 neuro-inset rounded-neuro p-4">
              <summary className="cursor-pointer font-semibold neuro-text-primary flex items-center gap-2">
                <Info className="w-4 h-4" /> Prompt sent to RAGFlow
              </summary>
              <pre className="mt-3 whitespace-pre-wrap text-sm neuro-text-secondary bg-neuro-bg-dark/40 p-4 rounded-neuro overflow-x-auto">
                {LEARNING_COURSES_PROMPT}
              </pre>
            </details>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {lastUpdated && (
              <div className="text-sm neuro-text-secondary">
                Last updated{' '}
                <time dateTime={lastUpdated.toISOString()}>
                  {lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </time>
              </div>
            )}
            <button
              onClick={initiateFetch}
              disabled={loading}
              className="neuro-button-primary inline-flex items-center gap-2 px-5 py-3 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
              <span>{loading ? 'Refreshing' : 'Refresh plan'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="neuro-inset border border-red-200/60 bg-red-50/80 text-red-700 rounded-neuro p-5 flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-semibold text-red-800">Could not load recommendations</h2>
              <p className="text-sm mt-1">
                {error}
              </p>
              <button
                onClick={initiateFetch}
                className="mt-3 neuro-button inline-flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> Try again
              </button>
            </div>
          </div>
        )}

        {loading && !recommendations && (
          <div className="neuro-inset p-10 rounded-neuro flex flex-col items-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-neuro-primary animate-spin" />
            <div>
              <h2 className="text-xl font-semibold neuro-text-primary">Generating learning plan...</h2>
              <p className="neuro-text-secondary max-w-lg">
                Contacting the RAGFlow chat completion API to retrieve real courses and build a structured path. This may take a
                few moments.
              </p>
            </div>
          </div>
        )}

        {recommendations && (
          <div className="space-y-8">
            <section className="grid lg:grid-cols-3 gap-6">
              <div className="neuro-card p-6 space-y-3">
                <h2 className="text-lg font-semibold neuro-text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Skill focus
                </h2>
                <p className="text-2xl font-bold neuro-text-primary">{recommendations.skill}</p>
                <p className="neuro-text-secondary text-sm">
                  {recommendations.learning_plan.plan_summary}
                </p>
              </div>

              <div className="neuro-card p-6 space-y-3">
                <h3 className="text-lg font-semibold neuro-text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Learner profile
                </h3>
                <ul className="space-y-2 text-sm neuro-text-secondary">
                  <li><strong className="neuro-text-primary">Stage:</strong> {userDetails?.stage ?? 'Unknown'}</li>
                  <li><strong className="neuro-text-primary">Region:</strong> {userDetails?.region ?? 'Unknown'}</li>
                  <li><strong className="neuro-text-primary">Background:</strong> {userDetails?.background ?? 'Unknown'}</li>
                  <li>
                    <strong className="neuro-text-primary">Weekly focus:</strong> {formatNumber(userDetails?.weeklyHours ?? 0)}
                    {' '}hours/week
                  </li>
                </ul>
              </div>

              <div className="neuro-card p-6 space-y-3">
                <h3 className="text-lg font-semibold neuro-text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Plan pacing
                </h3>
                <ul className="space-y-2 text-sm neuro-text-secondary">
                  <li>
                    <strong className="neuro-text-primary">Recommended weekly hours:</strong>{' '}
                    {formatNumber(recommendations.learning_plan.weekly_hours)}
                  </li>
                  <li>
                    <strong className="neuro-text-primary">Total duration:</strong>{' '}
                    {formatNumber(recommendations.learning_plan.total_duration_weeks)} weeks
                  </li>
                  <li>
                    <strong className="neuro-text-primary">Confidence:</strong>{' '}
                    <span className="uppercase tracking-wide">{recommendations.confidence}</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="neuro-inset p-6 rounded-neuro space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl font-semibold neuro-text-primary flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Sequenced learning plan
                </h2>
                <p className="text-sm neuro-text-secondary">
                  Courses are ranked by fit (difficulty × user stage × time commitment) and structured sequentially.
                </p>
              </div>

              <ol className="space-y-4">
                {recommendations.learning_plan.sequence.map((item) => (
                  <li key={item.order} className="neuro-surface p-5 rounded-neuro-lg">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-neuro bg-neuro-primary/10 text-neuro-primary text-sm font-semibold mb-2">
                          Step {item.order}
                        </span>
                        <div className="space-y-1">
                          {renderCourseLink(item)}
                          <p className="text-sm neuro-text-secondary">{item.provider_name}</p>
                          <p className="text-sm neuro-text-secondary">
                            Difficulty: {item.difficulty ?? 'Not specified'} · Estimated hours: {formatNumber(item.estimated_hours)}
                          </p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4 text-sm">
                        <div className="neuro-inset p-3 rounded-neuro">
                          <p className="font-semibold neuro-text-primary">Planned weekly hours</p>
                          <p className="neuro-text-secondary">{formatNumber(item.planned_weekly_hours)} hrs</p>
                        </div>
                        <div className="neuro-inset p-3 rounded-neuro">
                          <p className="font-semibold neuro-text-primary">Duration</p>
                          <p className="neuro-text-secondary">{formatNumber(item.expected_duration_weeks)} weeks</p>
                        </div>
                        <div className="neuro-inset p-3 rounded-neuro sm:col-span-3 lg:col-span-1">
                          <p className="font-semibold neuro-text-primary">Why chosen</p>
                          <p className="neuro-text-secondary text-sm leading-relaxed">{item.why_chosen}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="neuro-inset p-6 rounded-neuro space-y-6">
              <h2 className="text-xl font-semibold neuro-text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> All retrieved courses ({recommendations.all_relevant_courses.length})
              </h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {recommendations.all_relevant_courses.map((course, index) => (
                  <div key={`${course.course_title}-${index}`} className="neuro-surface p-4 rounded-neuro space-y-2">
                    {renderCourseLink(course)}
                    <p className="text-sm neuro-text-secondary">{course.provider_name}</p>
                    <div className="text-xs neuro-text-secondary uppercase tracking-wide">
                      Difficulty: {course.difficulty ?? 'Not specified'} · Hours: {formatNumber(course.estimated_hours)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {!!recommendations.assumptions.length && (
              <section className="neuro-inset p-6 rounded-neuro space-y-4">
                <h2 className="text-lg font-semibold neuro-text-primary flex items-center gap-2">
                  <Info className="w-5 h-5" /> Assumptions logged by the model
                </h2>
                <ul className="list-disc list-inside space-y-2 text-sm neuro-text-secondary">
                  {recommendations.assumptions.map((assumption, index) => (
                    <li key={index}>{assumption}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningCoursesRecommendationPage;

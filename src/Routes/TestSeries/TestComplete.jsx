import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTestResult } from '../../hooks/api';

export const TestComplete = () => {
  const { sessionId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getTestResult(sessionId);
        setResult(data);
      } catch (err) {
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading results…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-red-700 text-sm max-w-md mx-auto mb-6">
            {error}
          </div>
          <Link
            to="/test-series"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Test Series
          </Link>
        </div>
      </div>
    );
  }

  const r = result?.result;
  const status = result?.status;
  const percentage = r?.percentage ?? 0;

  // Color based on score
  const getScoreColor = () => {
    if (percentage >= 80) return { ring: 'text-green-500', bg: 'bg-green-50', label: 'Excellent!' };
    if (percentage >= 60) return { ring: 'text-blue-500', bg: 'bg-blue-50', label: 'Good' };
    if (percentage >= 40) return { ring: 'text-amber-500', bg: 'bg-amber-50', label: 'Average' };
    return { ring: 'text-red-500', bg: 'bg-red-50', label: 'Needs Improvement' };
  };

  const scoreStyle = getScoreColor();

  // SVG circle params
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Status badge */}
        <div className="text-center mb-8">
          {status === 'submitted' ? (
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submitted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time Expired
            </span>
          )}
        </div>

        {/* Score card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Results</h1>

          {/* Score circle */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-100" />
              <circle
                cx="60" cy="60" r={radius}
                stroke="currentColor" strokeWidth="8" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className={`${scoreStyle.ring} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreStyle.ring}`}>{percentage}%</span>
              <span className="text-gray-400 text-xs mt-0.5">{scoreStyle.label}</span>
            </div>
          </div>

          {/* Score details */}
          <div className="text-sm text-gray-500 mb-6">
            Score: <span className="text-gray-900 font-semibold">{r?.totalScore}</span> / {r?.attemptedQuestions + r?.unansweredQuestions}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-2xl font-bold text-green-600">{r?.correctAnswers ?? 0}</div>
              <div className="text-gray-500 text-xs mt-1">Correct</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="text-2xl font-bold text-red-600">{r?.wrongAnswers ?? 0}</div>
              <div className="text-gray-500 text-xs mt-1">Wrong</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{r?.attemptedQuestions ?? 0}</div>
              <div className="text-gray-500 text-xs mt-1">Attempted</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="text-2xl font-bold text-amber-600">{r?.unansweredQuestions ?? 0}</div>
              <div className="text-gray-500 text-xs mt-1">Unanswered</div>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="text-center">
          <Link
            to="/test-series"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Test Series
          </Link>
        </div>
      </div>
    </div>
  );
};

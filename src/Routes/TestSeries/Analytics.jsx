import { useState, useEffect } from 'react';
import { getMyAnalytics } from '../../hooks/api';
import { Award, Target, CheckCircle2, XCircle } from 'lucide-react';

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getMyAnalytics();
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load performance analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Loading your analytics…</p>
      </div>
    );
  }

  const attempts = data?.testPerformance || [];

  const totalAttempts = attempts.length;
  const avgAccuracy = totalAttempts > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / totalAttempts)
    : 0;
  const totalCorrect = attempts.reduce((sum, a) => sum + (a.correctAnswers || 0), 0);
  const totalWrong = attempts.reduce((sum, a) => sum + (a.incorrectAnswers || 0), 0);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Performance Analytics</h1>
        <p className="text-gray-500 text-sm">View your test series performance metrics and attempt history</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-2">
            <Award className="w-4 h-4 text-blue-600" />
            Tests Attempted
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalAttempts}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-2">
            <Target className="w-4 h-4 text-green-600" />
            Avg. Accuracy
          </div>
          <div className="text-2xl font-bold text-green-600">{avgAccuracy}%</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Correct Answers
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalCorrect}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            Wrong Answers
          </div>
          <div className="text-2xl font-bold text-red-500">{totalWrong}</div>
        </div>
      </div>

      {/* Attempts List */}
      {attempts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center flex flex-col items-center">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No test history yet</h3>
          <p className="text-gray-500 text-sm max-w-sm">Complete mock test sessions in the Test Series section to generate accuracy charts and breakdown statistics.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-sm font-bold text-gray-900">Attempt History</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {attempts.map((item, idx) => (
              <div key={item.attemptUuid || idx} className="p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Attempt #{totalAttempts - idx}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'In progress'}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{item.score} / {item.maxScore}</div>
                    <div className="text-xs text-gray-400">Score ({Math.round(item.percentage || 0)}%)</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-green-600">{Math.round(item.accuracy || 0)}%</div>
                    <div className="text-xs text-gray-400">Accuracy</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

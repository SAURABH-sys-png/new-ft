import { Link, useLocation } from 'react-router-dom';

export const TestComplete = () => {
  const location = useLocation();
  const auto = location.state?.auto;
  const submitError = location.state?.error;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20 pb-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {auto ? "Time's up!" : 'Test submitted'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {auto
              ? 'Your test has been automatically submitted because the time ran out. Your answers have been saved.'
              : 'Your test has been submitted successfully. Your answers have been recorded.'}
          </p>

          {submitError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-6 text-left">
              <p className="font-medium text-xs">Note: {submitError}</p>
              <p className="text-xs mt-1">Your progress was saved during the test via autosave.</p>
            </div>
          )}

          <Link
            to="/test-series"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            Back to exams
          </Link>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getExams, getTests } from '../../hooks/api';

export const TestsList = () => {
  const { examUuid } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allExams, allTests] = await Promise.all([getExams(), getTests()]);
        const currentExam = allExams.find((e) => e.uuid === examUuid);
        if (!currentExam) {
          setError('Exam not found.');
          setLoading(false);
          return;
        }
        setExam(currentExam);
        setTests(allTests.filter((t) => t.examUuid === examUuid));
      } catch (err) {
        setError(err.message || 'Failed to load tests.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examUuid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading tests…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-6 py-4 mt-8">
            {error}
          </div>
          <Link to="/test-series" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <Link
            to="/test-series"
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 font-medium mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All exams
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {exam?.title}
          </h1>
          {exam?.description && (
            <p className="text-gray-500 mt-2 text-base max-w-2xl">{exam.description}</p>
          )}
        </div>
      </div>

      {/* Tests list */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {tests.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">No tests available</h2>
            <p className="text-sm text-gray-500">Tests for this exam haven't been added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={test.uuid}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Test number */}
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  {/* Test info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate">{test.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {test.questions?.length || 0} questions
                      </span>
                      {test.timeReq && (
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {test.timeReq} min
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(`/test-series/${examUuid}/${test.uuid}`)}
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors duration-200 flex-shrink-0 whitespace-nowrap"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

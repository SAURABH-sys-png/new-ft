import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExams, getTests, createTestSession } from '../../hooks/api';

export const TestsList = () => {
  const { examUuid } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingTest, setStartingTest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsData, testsData] = await Promise.all([getExams(), getTests()]);
        const currentExam = examsData.find((e) => e.uuid === examUuid);
        setExam(currentExam || null);
        // Filter tests belonging to this exam and that are published
        const examTests = testsData.filter(
          (t) => t.examUuid === examUuid && t.isPublished
        );
        setTests(examTests);
      } catch (err) {
        setError(err.message || 'Failed to load tests');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examUuid]);

  const handleStartTest = async (testUuid) => {
    setStartingTest(testUuid);
    setError('');
    try {
      const session = await createTestSession(testUuid);
      navigate(`/test-session/${session.sessionId}`);
    } catch (err) {
      setError(err.message || 'Failed to start test');
    } finally {
      setStartingTest(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading tests…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/test-series/explore')}
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm mb-6 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Exams
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {exam?.title || 'Tests'}
          </h1>
          {exam?.description && (
            <p className="text-gray-500 text-sm">{exam.description}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-red-700 text-sm mb-6">
            {error}
          </div>
        )}

        {tests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <p className="text-gray-500 text-sm">No published tests available for this exam yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => (
              <div
                key={test.uuid}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <h3 className="text-gray-900 font-semibold truncate">{test.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {test.questions?.length || 0} question{test.questions?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleStartTest(test.uuid)}
                  disabled={startingTest === test.uuid}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  {startingTest === test.uuid ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Starting…
                    </span>
                  ) : (
                    'Start Test'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExams } from '../../hooks/api';

export const ExamsList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams();
        setExams(data);
      } catch (err) {
        setError(err.message || 'Failed to load exams.');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading exams…</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Test Series
          </h1>
          <p className="text-gray-500 mt-2 text-base max-w-2xl">
            Choose an exam category to browse available tests and start practicing.
          </p>
        </div>
      </div>

      {/* Exams grid */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {exams.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">No exams available</h2>
            <p className="text-sm text-gray-500">Check back later for new exam categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Link
                key={exam.uuid}
                to={`/test-series/${exam.uuid}`}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Accent strip */}
                <div className="h-1.5 bg-blue-600" />

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {exam.title}
                  </h3>

                  {exam.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-grow">
                      {exam.description}
                    </p>
                  )}

                  {!exam.description && <div className="flex-grow" />}

                  <div className="flex items-center text-blue-600 font-medium text-sm mt-auto pt-4 border-t border-gray-100">
                    View tests
                    <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const QuickRevision = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Quick Revision</h1>
        <p className="text-gray-500 text-sm">Review important concepts and incorrect answers</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center flex flex-col items-center">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Start a test to generate revision material</h3>
        <p className="text-gray-500 text-sm max-w-sm">Your quick revision notes and flashcards will appear here based on your test performance.</p>
      </div>
    </div>
  );
};

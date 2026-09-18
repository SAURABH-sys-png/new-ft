import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useStory } from '../../hooks/useStories';

export const StoryPost = () => {
  const { id } = useParams();
  const { story, loading, error } = useStory(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Story not found</h2>
        <p className="text-lg text-gray-600 mb-8">The story you are looking for does not exist or has been removed.</p>
        <Link
          to="/sstories"
          className="px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full transition-colors duration-300"
        >
          Back to SSB Stories
        </Link>
      </div>
    );
  }

  const isRecommended = story.recommendation?.toLowerCase().includes('recommended');

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Hero Section */}
      <main
        className="relative pt-24 pb-16 flex flex-col justify-end w-full bg-cover bg-center bg-no-repeat shadow-lg"
        style={{
          backgroundImage: `url('https://picsum.photos/seed/${story.name?.replace(/\s+/g, '') || id}/1920/1080')`,
          minHeight: '62vh',
        }}
      >
        {/* Cinematic gradient — deeper blue on left matching the brand */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/80 to-transparent z-0" />

        <div className="relative z-10 px-4 md:px-8 w-full max-w-screen-md mx-auto flex flex-col pt-16">
          {/* Back link */}
          <Link
            to="/sstories"
            className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to SSB Stories
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {story.entry && (
              <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {story.entry}
              </span>
            )}
            {story.recommendation && (
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border shadow-sm ${
                  isRecommended
                    ? 'text-white bg-emerald-600/90 border-emerald-500/30'
                    : 'text-white bg-slate-600/90 border-slate-500/30'
                }`}
              >
                {story.recommendation}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            {story.name}
            {story.entry ? ` – ${story.entry} SSB Interview Experience` : ' – SSB Interview Experience'}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center text-blue-100 gap-x-6 gap-y-2 mt-2 text-sm font-medium">
            {story.date && (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(story.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            )}
            {story.ssb && (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {story.ssb}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Story Content */}
      <section className="py-16 px-4 md:px-8 flex-grow">
        <div className="max-w-screen-md mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] -mt-24 relative z-20">
          {/* Summary pull-quote, if available */}
          {story.summary && (
            <blockquote className="border-l-4 border-blue-600 bg-gradient-to-r from-blue-50/80 to-transparent p-5 mb-8 rounded-r-2xl text-base italic text-gray-700 font-medium leading-relaxed">
              {story.summary}
            </blockquote>
          )}

          <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown>{story.data}</ReactMarkdown>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-500">Inspired by this story? There are many more waiting for you.</p>
            <Link
              to="/sstories"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              More Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

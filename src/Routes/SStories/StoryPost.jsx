import { useParams, Link } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, MapPin, Calendar, Award, ShieldCheck, BookOpen } from 'lucide-react';
import { useStory } from '../../hooks/useStories';

export const StoryPost = () => {
  const { id } = useParams();
  const { story, loading, error } = useStory(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 text-center">
        <h2 className="font-sans text-3xl font-extrabold text-slate-900 mb-2">Story Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">The SSB experience story you requested could not be located.</p>
        <Link
          to="/sstories"
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to SSB Stories
        </Link>
      </div>
    );
  }

  const isRecommended = story.recommendation?.toLowerCase().includes('recommended') || story.recommendation?.toLowerCase().includes('attempt');

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 font-sans pt-20">
      
      {/* 1. ARTICLE HERO HEADER */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Back navigation */}
          <Link
            to="/sstories"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-600 mb-6 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to SSB Stories</span>
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {story.entry && (
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-bold uppercase tracking-wider">
                {story.entry}
              </span>
            )}
            {story.recommendation && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                  isRecommended
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {story.recommendation}
              </span>
            )}
          </div>

          {/* Candidate Name Title */}
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight mb-4">
            {story.name}
          </h1>

          {/* Meta details */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
            {story.ssb && (
              <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                <MapPin className="w-4 h-4 text-amber-600" />
                {story.ssb}
              </span>
            )}
            {story.date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(story.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. ARTICLE BODY CONTENT */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex-grow">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-12 shadow-xl shadow-slate-200/40">
          
          {/* Summary Callout Box */}
          {story.summary && (
            <div className="mb-8 p-6 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-slate-900">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                Key Takeaway & Summary
              </h3>
              <p className="font-sans text-sm sm:text-base leading-relaxed font-medium text-slate-800 italic">
                "{story.summary}"
              </p>
            </div>
          )}

          {/* Main Story Content */}
          <div className="prose prose-slate prose-lg max-w-none font-sans text-slate-800 leading-relaxed space-y-4">
            <ReactMarkdown>{story.data}</ReactMarkdown>
          </div>

          {/* Bottom Footer CTA */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Verified Candidate Experience • DEFENCE ROGER</span>
            </div>

            <Link
              to="/sstories"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Explore More Success Stories</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

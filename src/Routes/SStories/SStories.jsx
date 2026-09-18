import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStories } from '../../hooks/useStories';

const ENTRY_FILTERS = ['All', 'NDA', 'CDS', 'AFCAT', 'TES', 'SSC Tech', 'Other'];

const RECOMMENDATION_BADGE = {
  '1st attempt': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  '2nd attempt': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  '3rd attempt': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
};

function getRecommendationStyle(recommendation) {
  if (!recommendation) return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' };
  const lower = recommendation.toLowerCase();
  for (const key of Object.keys(RECOMMENDATION_BADGE)) {
    if (lower.includes(key)) return RECOMMENDATION_BADGE[key];
  }
  return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
}

function getEntryCategory(entry) {
  if (!entry) return 'Other';
  const e = entry.toUpperCase();
  if (e.includes('NDA')) return 'NDA';
  if (e.includes('CDS')) return 'CDS';
  if (e.includes('AFCAT')) return 'AFCAT';
  if (e.includes('TES')) return 'TES';
  if (e.includes('SSC')) return 'SSC Tech';
  return 'Other';
}

export const SStories = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { stories, loading } = useStories();

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      const matchFilter = activeFilter === 'All' || getEntryCategory(s.entry) === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.ssb?.toLowerCase().includes(q) ||
        s.entry?.toLowerCase().includes(q) ||
        s.summary?.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [stories, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Hero */}
      <main
        className="relative pt-24 pb-0 flex flex-col justify-between w-full bg-cover bg-center bg-no-repeat shadow-lg"
        style={{ backgroundImage: "url('/images/Sudan_Block.jpg')", minHeight: '70vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-slate-900/85 z-0 pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 w-full max-w-screen-xl mx-auto flex flex-col items-center text-center pt-16 md:pt-24 flex-grow">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real Experiences · Real Officers
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.08]">
            SSB Success Stories
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl font-light leading-relaxed">
            Read first-hand accounts from candidates who cleared their SSB interviews. Learn their strategies, mindset, and the lessons that made the difference.
          </p>

          {/* Search */}
          <div className="relative w-full max-w-lg mb-16">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, SSB centre, entry…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/95 backdrop-blur-sm text-slate-900 text-sm placeholder:text-slate-400 border border-white/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
        </div>

        {/* Filter tab bar */}
        <div className="relative z-10 w-full bg-white mt-auto rounded-t-xl md:rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="max-w-screen-xl mx-auto px-4">
            <ul className="flex items-center justify-start md:justify-center overflow-x-auto py-5 gap-8 hide-scrollbar text-[15px] font-medium text-gray-500">
              {ENTRY_FILTERS.map((f) => (
                <li key={f} className="flex-shrink-0">
                  <button
                    onClick={() => setActiveFilter(f)}
                    className={`hover:text-blue-600 transition-colors pb-1 border-b-2 ${
                      activeFilter === f ? 'text-blue-600 border-blue-600' : 'border-transparent'
                    }`}
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Stories Grid */}
      <section className="py-20 px-4 md:px-8 flex-grow">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {activeFilter === 'All' ? 'All Stories' : `${activeFilter} Stories`}
            </h2>
            {!loading && (
              <span className="text-sm text-slate-500 font-medium">
                {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">No stories found</p>
              <p className="text-slate-500 text-sm">Try a different filter or search term.</p>
              <button
                onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                className="mt-6 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((story, index) => {
                const recStyle = getRecommendationStyle(story.recommendation);
                return (
                  <Link
                    to={`/sstory/${story.id}`}
                    key={story.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
                  >
                    <div className="h-48 bg-slate-200 overflow-hidden relative flex-shrink-0">
                      <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-300 z-10" />
                      <img
                        src={`https://picsum.photos/seed/${story.name?.replace(/\s+/g, '') || index + 400}/800/600`}
                        alt={`${story.name} SSB story cover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <span className="text-[11px] font-bold text-white bg-blue-700/90 px-2.5 py-1 rounded-full uppercase tracking-wider shadow backdrop-blur-sm">
                          {story.entry || 'SSB'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      {story.recommendation && (
                        <div className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wide mb-3 ${recStyle.bg} ${recStyle.text} ${recStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${recStyle.dot}`} />
                          {story.recommendation}
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {story.name}
                      </h3>

                      {story.ssb && (
                        <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {story.ssb}
                        </p>
                      )}

                      <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">
                        {story.summary || story.data?.slice(0, 180)}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="text-xs font-medium text-slate-400">
                          {story.date
                            ? new Date(story.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : ''}
                        </span>
                        <div className="flex items-center text-blue-600 font-bold text-sm">
                          Read story
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRight, ShieldCheck, Award, Sparkles, BookOpen } from 'lucide-react';
import { useStories } from '../../hooks/useStories';
import SlidingEaseVerticalBars from '../../components/hero/SlidingEaseVerticalBars';
import ParallaxComponent from '../../components/ui/ParallaxComponent';

const ENTRY_FILTERS = ['All', 'NDA', 'CDS', 'AFCAT', 'TES', 'SSC Tech', 'Other'];

const RECOMMENDATION_BADGE = {
  '1st attempt': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  '2nd attempt': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  '3rd attempt': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
};

function getRecommendationStyle(recommendation) {
  if (!recommendation) return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  const lower = recommendation.toLowerCase();
  for (const key of Object.keys(RECOMMENDATION_BADGE)) {
    if (lower.includes(key)) return RECOMMENDATION_BADGE[key];
  }
  return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
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
    <div className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 font-sans pt-20">
      
      {/* 1. HERO SECTION (Light Theme Canvas + Grid Lines) */}
      <ParallaxComponent>
        <section className="relative min-h-[50vh] w-full flex flex-col justify-center overflow-hidden py-16 bg-white border-b border-slate-200">
          <SlidingEaseVerticalBars backgroundColor="#FFFFFF" lineColor="#F1F5F9" barColor="#CBD5E1" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto w-full">
            <h1 className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-[1.1]">
              SSB SUCCESS <span className="text-amber-600">STORIES</span>
            </h1>

            <p className="font-sans text-base sm:text-xl text-slate-600 max-w-3xl mx-auto mt-5 leading-relaxed font-medium">
              Read first-hand accounts from candidates who cleared their SSB interviews. Learn their strategies, mindset, and the lessons that made the difference.
            </p>

            {/* Search Input Box */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates, SSB boards, or entry schemes..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white shadow-sm font-medium transition-all"
              />
            </div>
          </div>
        </section>
      </ParallaxComponent>

      {/* 2. FILTER TABS & MAIN CONTENT GRID */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
        
        {/* Entry Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-fit mx-auto">
          {ENTRY_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Header Stats */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-8">
          <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>{activeFilter === 'All' ? 'All Experiences' : `${activeFilter} Entry Experiences`}</span>
          </h2>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {filtered.length} {filtered.length === 1 ? 'Story' : 'Stories'} Available
          </span>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-lg">No SSB Stories Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              No matching stories found for your search query or filter selection. Try adjusting your parameters.
            </p>
            <button
              onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((story, index) => {
              const recStyle = getRecommendationStyle(story.recommendation);
              return (
                <Link
                  key={story.id}
                  to={`/sstory/${story.id}`}
                  className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Card Cover Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${story.name?.replace(/\s+/g, '') || index + 500}/800/600`}
                      alt={`${story.name} SSB Story`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase tracking-wider border border-slate-700">
                        {story.entry || 'SSB'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                    <div>
                      {story.recommendation && (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10.5px] font-mono font-bold uppercase tracking-wider mb-3 ${recStyle.bg} ${recStyle.text} ${recStyle.border}`}>
                          <Award className="w-3 h-3" />
                          <span>{story.recommendation}</span>
                        </div>
                      )}

                      <h3 className="font-display font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                        {story.name}
                      </h3>

                      {story.ssb && (
                        <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{story.ssb}</span>
                        </p>
                      )}

                      <p className="font-sans text-slate-600 text-xs mt-3 line-clamp-3 leading-relaxed">
                        {story.summary || story.data?.slice(0, 160)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {story.date ? new Date(story.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Verified'}
                      </span>
                      <span className="font-bold text-slate-900 group-hover:text-amber-600 flex items-center gap-1 transition-colors">
                        Read Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-600" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

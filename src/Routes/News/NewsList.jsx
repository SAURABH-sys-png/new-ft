import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Shield, Bell, Tag, Search, BookOpen, Clock } from 'lucide-react';

const DEFENSE_NEWS_ARTICLES = [
  {
    id: 'nda-2-2026-notification',
    title: 'UPSC NDA & NA (II) 2026 Official Notification & Eligibility Details Out',
    category: 'Exam Notification',
    date: '2026-09-18',
    readTime: '4 min read',
    excerpt: 'UPSC releases official notification for National Defence Academy & Naval Academy Examination (II) 2026. Check age eligibility, educational criteria, and SSB interview dates.',
    image: 'https://picsum.photos/seed/nda2026/800/500',
    tags: ['UPSC NDA', 'Eligibility', 'Notification'],
    trending: true,
  },
  {
    id: 'cds-2-2026-ssb-dates',
    title: 'CDS 2 2026 SSB Interview Call-up Letters Released for IMA, AFA, INA & OTA',
    category: 'SSB Updates',
    date: '2026-09-15',
    readTime: '5 min read',
    excerpt: 'Indian Army, Navy & Air Force release SSB interview center selection links and call-up letters for recommended written examination cleared candidates.',
    image: 'https://picsum.photos/seed/cds2026/800/500',
    tags: ['CDS 2026', 'SSB Call-Up', 'Center Selection'],
    trending: true,
  },
  {
    id: 'afcat-2-2026-admit-card',
    title: 'AFCAT 2 2026 Examination Results & Cutoff Analysis Announced',
    category: 'Air Force Entry',
    date: '2026-09-10',
    readTime: '3 min read',
    excerpt: 'Indian Air Force publishes AFCAT 2 cutoff scores along with AFSB interview registration steps for Flying, Technical, and Ground Duty branches.',
    image: 'https://picsum.photos/seed/afcat2026/800/500',
    tags: ['AFCAT', 'AFSB', 'Cutoff'],
    trending: false,
  },
  {
    id: '15-olqs-ssb-preparation-guide',
    title: 'Mastering 15 Officer Like Qualities (OLQs) for SSB Interview Recommendation',
    category: 'SSB Prep Guide',
    date: '2026-09-05',
    readTime: '7 min read',
    excerpt: 'A comprehensive breakdown by AIR 496 Saurabh on how SSB psychologists, GTOs, and interviewing officers evaluate Factor I to Factor IV qualities.',
    image: 'https://picsum.photos/seed/olqguide/800/500',
    tags: ['15 OLQs', 'Psychology', 'GTO'],
    trending: true,
  },
  {
    id: 'ppdt-screening-masterclass-2026',
    title: 'PPDT Screening Strategy: Story Writing & Perception Mastery in Stage I',
    category: 'Screening',
    date: '2026-08-28',
    readTime: '6 min read',
    excerpt: 'Learn how to write positive, action-oriented PPDT stories and lead group discussions effectively to clear Day 1 Screening at Selection Boards.',
    image: 'https://picsum.photos/seed/ppdtstory/800/500',
    tags: ['PPDT', 'Stage 1', 'OIR Test'],
    trending: false,
  },
];

export const NewsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Exam Notification', 'SSB Updates', 'Air Force Entry', 'SSB Prep Guide', 'Screening'];

  const filteredNews = DEFENSE_NEWS_ARTICLES.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-sans tracking-tight mb-4">
            Defense News & Notifications
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto font-sans font-medium">
            Stay updated with verified UPSC NDA, CDS, AFCAT notifications, SSB call-up schedules, and candidate preparation strategies.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 mb-10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
                  {article.category}
                </span>
                {article.trending && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-mono font-extrabold px-2 py-1 rounded-md uppercase">
                    Trending
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-slate-500 text-xs font-mono font-medium mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors font-sans leading-snug mb-2.5">
                    {article.title}
                  </h2>

                  <p className="text-slate-600 text-xs leading-relaxed font-medium line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[9.5px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/news/${article.id}`}
                    className="inline-flex items-center text-xs font-bold text-amber-700 hover:text-amber-900 gap-1 group/btn"
                  >
                    Read
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsList;

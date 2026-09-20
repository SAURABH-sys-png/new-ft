import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ShieldCheck, Share2, Tag, Bookmark } from 'lucide-react';

export const NewsArticle = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/news" className="inline-flex items-center text-slate-600 hover:text-amber-700 font-bold text-xs font-mono uppercase tracking-wider mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Defense News
        </Link>

        {/* Main Article Container */}
        <article className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-6 md:p-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase">
              UPSC Official Announcement
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              Verified
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-sans tracking-tight mb-6 leading-tight">
            Official Defense Examination Notification & Eligibility Updates 2026
          </h1>

          <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-slate-200 text-xs text-slate-500 font-mono font-semibold gap-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                By Saurabh (AIR 496)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Sept 18, 2026
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                5 min read
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-amber-600 rounded-full hover:bg-slate-100 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-amber-600 rounded-full hover:bg-slate-100 transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Article Hero Image */}
          <div className="rounded-2xl overflow-hidden mb-8 border border-slate-200 bg-slate-100 h-72 md:h-96">
            <img
              src={`https://picsum.photos/seed/${id || 'defense'}/1200/600`}
              alt="Defense News Article"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Body */}
          <div className="prose prose-slate max-w-none font-sans text-slate-700 text-base leading-relaxed space-y-6">
            <p className="text-lg font-medium text-slate-900 leading-relaxed">
              The Union Public Service Commission (UPSC) and Armed Forces Selection Boards have released updated guidelines and entry notifications for Indian defense aspirants aiming for NDA, CDS, AFCAT, and INET entries.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 font-sans mt-8 mb-4">
              1. Key Entry Eligibility Criteria
            </h2>
            <p>
              Candidates preparing for the upcoming written examinations must verify their exact Date of Birth (DOB) and educational qualification parameters:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>NDA (National Defence Academy):</strong> Unmarried male/female candidates born between Jan 2, 2008, and Jan 1, 2011 (16.5 to 19.5 years).</li>
              <li><strong>CDS (Combined Defence Services):</strong> Graduates aged 19 to 24 years for IMA, INA, and AFA; up to 25 years for OTA.</li>
              <li><strong>AFCAT (Air Force Common Admission Test):</strong> Flying Branch (20 to 24 years), Ground Duty Technical & Non-Technical (20 to 26 years).</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 font-sans mt-8 mb-4">
              2. 5-Day SSB Selection Board Preparation
            </h2>
            <p>
              Candidates who clear the written cutoff will receive call-up letters for Selection Centers in Allahabad, Bhopal, Bengaluru, Kapurthala, Dehradun, and Gandhinagar. The 5-day evaluation rigorously tests 15 Officer Like Qualities (OLQs) through Stage I Screening and Stage II Psychological & GTO tasks.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-8">
              <h3 className="text-amber-950 font-bold text-lg mb-2 font-sans">
                💡 Pro Tip from Founder Saurabh (AIR 496):
              </h3>
              <p className="text-amber-900 text-sm leading-relaxed">
                "Consistently focus on practical intelligence and genuine social adaptability during PPDT group discussions. Clear, concise articulation without dominating fellow candidates creates an outstanding first impression."
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsArticle;

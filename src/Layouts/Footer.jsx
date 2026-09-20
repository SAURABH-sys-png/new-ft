import { Link } from 'react-router-dom';
import { ChevronUp, Shield, Mail } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full bg-[#0B132B] text-slate-300 border-t border-slate-800/80 pt-14 pb-10 font-sans mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* TOP GRID COLUMNS MATCHING REFERENCE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800/80">
                    
                    {/* Column 1: Brand Info */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3 text-white">
                            <Logo size="md" dark={true} />
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-normal">
                            Your platform for defence exam eligibility, PYQs, mock tests, and SSB preparation.
                        </p>
                        <div className="pt-2 text-xs text-slate-400 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                            <span>Founded by <strong>Saurabh</strong> (AIR 496, SSB Recommended)</span>
                        </div>
                    </div>

                    {/* Column 2: NAVIGATE */}
                    <div>
                        <h4 className="text-xs font-mono tracking-widest text-slate-400 font-bold uppercase mb-4">
                            NAVIGATE
                        </h4>
                        <ul className="space-y-2.5 text-sm font-medium">
                            <li>
                                <Link to="/news" className="text-slate-300 hover:text-white transition-colors">
                                    Blogs
                                </Link>
                            </li>
                            <li>
                                <Link to="/calculator" className="text-slate-300 hover:text-white transition-colors">
                                    Calculator
                                </Link>
                            </li>
                            <li>
                                <Link to="/sstories" className="text-slate-300 hover:text-white transition-colors">
                                    SSB Stories
                                </Link>
                            </li>
                            <li>
                                <Link to="/mocks" className="text-slate-300 hover:text-white transition-colors">
                                    PYQs & Mocks
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: EXAMS */}
                    <div>
                        <h4 className="text-xs font-mono tracking-widest text-slate-400 font-bold uppercase mb-4">
                            EXAMS
                        </h4>
                        <ul className="space-y-2.5 text-sm text-slate-300 font-medium">
                            <li>
                                <Link to="/calculator" className="hover:text-white transition-colors">NDA</Link>
                            </li>
                            <li>
                                <Link to="/calculator" className="hover:text-white transition-colors">CDS</Link>
                            </li>
                            <li>
                                <Link to="/calculator" className="hover:text-white transition-colors">AFCAT</Link>
                            </li>
                            <li>
                                <Link to="/ssb-documents" className="hover:text-white transition-colors">SSB Interview</Link>
                            </li>
                            <li>
                                <Link to="/calculator" className="hover:text-white transition-colors">TES Entry</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: RESOURCES */}
                    <div>
                        <h4 className="text-xs font-mono tracking-widest text-slate-400 font-bold uppercase mb-4">
                            RESOURCES
                        </h4>
                        <ul className="space-y-2.5 text-sm text-slate-300 font-medium">
                            <li>
                                <Link to="/test-series" className="hover:text-white transition-colors">
                                    Test Series
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@defenceroger.in" className="hover:text-white transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <Link to="/ssb-documents" className="hover:text-white transition-colors">
                                    SSB Documents
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* BOTTOM BAR MATCHING REFERENCE SCREENSHOT */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
                    {/* Left: Copyright */}
                    <p className="text-slate-400">
                        © 2026 DefenceRoger. All rights reserved.
                    </p>

                    {/* Center / Right: Exam Tag Pills & Scroll to Top */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono font-medium">
                                NDA 2026
                            </span>
                            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono font-medium">
                                CDS 2026
                            </span>
                            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono font-medium">
                                AFCAT
                            </span>
                            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono font-medium">
                                SSB
                            </span>
                            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono font-medium">
                                UPSC
                            </span>
                        </div>

                        {/* Scroll To Top Button */}
                        <button
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                            className="ml-2 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 cursor-pointer"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            </div>
        </footer>
    );
};

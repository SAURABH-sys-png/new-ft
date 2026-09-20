import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, Menu, X, User, LogOut, Award, Calculator, BookOpen, Compass, FileText, Home as HomeIcon } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export const Header = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        setIsUserMenuOpen(false);
        await logout();
        navigate('/');
    };

    const handleHomeClick = (e) => {
        setIsMobileMenuOpen(false);
        if (location.pathname === '/') {
            e?.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleAnchorClick = (e, sectionId) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        if (location.pathname === '/') {
            const elem = document.getElementById(sectionId);
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/', { state: { scrollTo: sectionId } });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md py-3'
                    : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-3.5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Brand Logo - DefenceRoger */}
                <Logo size="md" onClick={handleHomeClick} />

                {/* Desktop Navigation - Spacious & Symmetrical */}
                <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/90 shadow-2xs">
                    <Link
                        to="/"
                        onClick={handleHomeClick}
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                        <HomeIcon className="w-3.5 h-3.5 text-blue-600" />
                        Home
                    </Link>
                    <Link
                        to="/calculator"
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                        <Calculator className="w-3.5 h-3.5 text-blue-600" />
                        Eligibility
                    </Link>
                    <a
                        href="/#ssb-prep"
                        onClick={(e) => handleAnchorClick(e, 'ssb-prep')}
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        SSB Suite
                    </a>
                    <a
                        href="/#olq"
                        onClick={(e) => handleAnchorClick(e, 'olq')}
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                        <Compass className="w-3.5 h-3.5 text-blue-600" />
                        15 OLQs
                    </a>
                    <Link
                        to="/mocks"
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        PYQs & Mocks
                    </Link>
                    <Link
                        to="/test-series"
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        Test Series
                    </Link>
                    <Link
                        to="/news"
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white px-3 py-1.5 rounded-full transition-all shadow-2xs"
                    >
                        News
                    </Link>
                    <Link
                        to="/ssb-documents"
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white px-3 py-1.5 rounded-full transition-all shadow-2xs"
                    >
                        Docs
                    </Link>
                    <Link
                        to="/sstories"
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white px-3 py-1.5 rounded-full transition-all shadow-2xs"
                    >
                        Stories
                    </Link>
                </nav>

                {/* User Auth Buttons */}
                <div className="hidden xl:flex items-center gap-3 shrink-0">
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3.5 py-1.5 rounded-full hover:bg-blue-100 transition-all text-xs font-bold shadow-sm"
                            >
                                <User className="w-3.5 h-3.5 text-blue-600" />
                                <span>{user?.username || 'Candidate'}</span>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
                                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                                        <p className="font-bold text-slate-900">{user?.username}</p>
                                        <p className="text-slate-500 text-[10px] truncate">{user?.email || user?.mobileNumber}</p>
                                    </div>
                                    {user?.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link
                                        to="/test-series"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium"
                                    >
                                        My Test Series
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold border-t border-slate-100 mt-1"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg transition-colors hover:bg-slate-100"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-105"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="xl:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="xl:hidden bg-white/98 border-b border-slate-200 backdrop-blur-xl px-4 pt-4 pb-6 space-y-3 text-slate-800 shadow-xl">
                    <Link
                        to="/"
                        onClick={handleHomeClick}
                        className="block text-sm font-medium hover:text-blue-600 py-2 cursor-pointer"
                    >
                        Home
                    </Link>
                    <Link
                        to="/calculator"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium hover:text-blue-600 py-2"
                    >
                        Eligibility Calculator
                    </Link>
                    <a
                        href="/#ssb-prep"
                        onClick={(e) => handleAnchorClick(e, 'ssb-prep')}
                        className="block text-sm font-medium hover:text-blue-600 py-2 cursor-pointer"
                    >
                        SSB Prep Suite
                    </a>
                    <a
                        href="/#olq"
                        onClick={(e) => handleAnchorClick(e, 'olq')}
                        className="block text-sm font-medium hover:text-blue-600 py-2 cursor-pointer"
                    >
                        15 OLQs Breakdown
                    </a>
                    <Link
                        to="/test-series"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium hover:text-blue-600 py-2"
                    >
                        Test Series
                    </Link>
                    <Link
                        to="/sstories"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium hover:text-blue-600 py-2"
                    >
                        SSB Stories
                    </Link>
                    <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium hover:text-blue-600 py-2"
                    >
                        About
                    </Link>
                    <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-center py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm"
                            >
                                Sign Out ({user?.username})
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-slate-800 font-semibold text-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow"
                                >
                                    Create Account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

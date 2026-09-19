import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Header = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const getNavLinkClass = (path) => {
        const isActive = path === '/' ? location.pathname === '/' : (path !== '#' && location.pathname.startsWith(path));
        const commonClass = "block py-3 px-4 rounded-lg md:p-0 transition-all";
        const activeClass = "text-blue-700 bg-white md:bg-transparent md:text-white md:font-bold md:underline md:underline-offset-8 md:decoration-2";
        const inactiveClass = "text-white hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-200";
        return `${commonClass} ${isActive ? activeClass : inactiveClass}`;
    };

    const handleLogout = async () => {
        setIsUserMenuOpen(false);
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-700 to-blue-600 fixed w-full z-50 top-0 start-0 border-b border-blue-800 shadow-lg">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 md:px-6">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse transition-transform hover:scale-105">
                    <img src="/logo.png" alt="DefenceRoger Logo" className="h-10 w-10 object-contain drop-shadow-md rounded-full bg-white/10 p-0.5" />
                    <span className="self-center text-2xl text-white font-extrabold tracking-tight whitespace-nowrap drop-shadow-md font-logo">DefenceRoger</span>
                </a>
                
                <div className="flex items-center md:order-2 space-x-3 md:space-x-4 relative">
                    {isAuthenticated ? (
                        <>
                            <button 
                                type="button" 
                                className="flex text-sm bg-blue-800 rounded-full md:me-0 focus:ring-4 focus:ring-blue-300 transition-transform hover:scale-105" 
                                id="user-menu-button" 
                                aria-expanded={isUserMenuOpen} 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <span className="sr-only">Open user menu</span>
                                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white/50 shadow-sm flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {(user?.username || 'U').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </button>
                            
                            {/* Dropdown menu */}
                            <div 
                                className={`z-50 ${isUserMenuOpen ? 'block' : 'hidden'} absolute top-[115%] right-0 bg-white border border-gray-100 rounded-xl shadow-2xl w-48 overflow-hidden transition-all`} 
                                id="user-dropdown"
                            >
                                <div className="px-4 py-3 text-sm bg-gray-50 border-b border-gray-100">
                                    <span className="block text-gray-900 font-bold">{user?.username || 'User'}</span>
                                    <span className="block text-gray-500 truncate text-xs mt-0.5">{user?.email || user?.mobileNumber || ''}</span>
                                </div>
                                <ul className="py-1 text-sm text-gray-700 font-medium" aria-labelledby="user-menu-button">
                                    {user?.role === 'admin' && (
                                        <li>
                                            <Link to="/admin" className="flex items-center px-4 py-2.5 hover:bg-blue-50 hover:text-blue-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>Admin Panel</Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link to="/test-series" className="flex items-center px-4 py-2.5 hover:bg-blue-50 hover:text-blue-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>Test Series</Link>
                                    </li>
                                    <li className="border-t border-gray-100 mt-1">
                                        <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors">Sign out</button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-sm bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg border border-white/20 transition-colors"
                        >
                            Sign in
                        </Link>
                    )}
                    
                    <button 
                        type="button" 
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white/50 ml-1 transition-colors" 
                        aria-controls="navbar-user" 
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
                
                <div className={`items-center justify-between ${isMobileMenuOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1 transition-all duration-300 ease-in-out`} id="navbar-user">
                    <ul className="w-full font-medium flex flex-col p-4 md:p-0 mt-4 border border-blue-500/30 rounded-xl bg-blue-800/95 backdrop-blur-md md:flex-row md:space-x-6 lg:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent gap-2 md:gap-0 shadow-inner md:shadow-none">
                        <li>
                            <Link to="/" className={getNavLinkClass('/')} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        </li>
                        <li>
                            <Link to="/sstories" className={getNavLinkClass('/sstories')} onClick={() => setIsMobileMenuOpen(false)}>SSB Stories</Link>
                        </li>
                        <li>
                            <Link to="#" className={getNavLinkClass('#')} onClick={() => setIsMobileMenuOpen(false)}>PYQs & Mocks</Link>
                        </li>
                        <li>
                            <Link to="/test-series" className={getNavLinkClass('/test-series')} onClick={() => setIsMobileMenuOpen(false)}>Test Series</Link>
                        </li>
                        <li>
                            <Link to="/calculator" className={getNavLinkClass('/calculator')} onClick={() => setIsMobileMenuOpen(false)}>Eligibility Calculator</Link>
                        </li>
                        <li>
                            <Link to="#" className={getNavLinkClass('#')} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

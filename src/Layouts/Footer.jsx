import { Link } from 'react-router-dom';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'SSB Stories', path: '/sstories' },
        { name: 'Test Series', path: '/test-series' },
        { name: 'Eligibility Calculator', path: '/calculator' },
    ];

    const resources = [
        { name: 'About Us', path: '/about' },
        { name: 'PYQs & Mocks', path: '#' },
        { name: 'Blog', path: '/' },
    ];

    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
            <div className="max-w-screen-xl mx-auto px-4 md:px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
                            <img src="/logo.png" alt="DefenceRoger" className="h-9 w-9 rounded-full ring-2 ring-slate-700 group-hover:ring-blue-500 transition-all" />
                            <span className="text-xl font-bold text-white tracking-tight">DefenceRoger</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            India's platform for defence exam preparation. Practice with realistic mock tests, PYQs, and learn from real SSB experiences.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-slate-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-px bg-blue-500 transition-all duration-200" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Resources</h4>
                        <ul className="space-y-2.5">
                            {resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-slate-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-px bg-blue-500 transition-all duration-200" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Connect</h4>
                        <a
                            href="mailto:support@defenceroger.com"
                            className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
                        >
                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            support@defenceroger.com
                        </a>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Have feedback or found a bug? We'd love to hear from you.
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                        © {currentYear} DefenceRoger. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-600">
                        Built for aspirants, by aspirants.
                    </p>
                </div>
            </div>
        </footer>
    );
};

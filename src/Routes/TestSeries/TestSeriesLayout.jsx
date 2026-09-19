import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BarChart2, Compass, BookOpen, Settings } from 'lucide-react';

export const TestSeriesLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: 'Explore', path: '/test-series/explore', icon: Compass },
    { name: 'Analytics', path: '/test-series/analytics', icon: BarChart2 },
    { name: 'Quick Revision', path: '/test-series/revision', icon: BookOpen },
    { name: 'Settings', path: '/test-series/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Test Series</h2>
          <p className="text-xs text-gray-500">Welcome, {user?.username || 'User'}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Highlight current tab or sub-routes of explore
            const isActive = location.pathname === item.path || (item.path === '/test-series/explore' && location.pathname.startsWith('/test-series/explore/'));
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex overflow-x-auto gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/test-series/explore' && location.pathname.startsWith('/test-series/explore/'));
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

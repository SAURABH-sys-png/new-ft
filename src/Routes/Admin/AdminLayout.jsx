import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, FileText, ClipboardList, HelpCircle, Users, LogOut } from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Exams', path: '/admin/exams', icon: FileText },
    { name: 'Tests', path: '/admin/tests', icon: ClipboardList },
    { name: 'Questions', path: '/admin/questions', icon: HelpCircle },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
          <p className="text-xs text-gray-500">Welcome, {user?.username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
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
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex overflow-x-auto gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                location.pathname === item.path
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

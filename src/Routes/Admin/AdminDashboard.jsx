import { useState, useEffect } from 'react';
import { getPlatformAnalytics } from '../../hooks/api';
import { Users, UserCheck, UserPlus } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPlatformAnalytics();
        setStats(data);
      } catch (err) {
        setError('Failed to load platform analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUsers || 0}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats?.activeUsers || 0}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Recent Signups (30d)</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.recentSignups || 0}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

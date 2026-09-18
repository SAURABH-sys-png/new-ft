import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, updateUserActiveStatus, deleteUser } from '../../hooks/api';

export const AdminUsers = () => {
  const [usersData, setUsersData] = useState({ users: [], pagination: {} });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsersData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uuid, newRole) => {
    try {
      await updateUserRole(uuid, newRole);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleActiveToggle = async (uuid, currentStatus) => {
    try {
      await updateUserActiveStatus(uuid, !currentStatus);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (uuid) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await deleteUser(uuid);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center">Loading...</td></tr>
              ) : usersData.users.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center">No users found</td></tr>
              ) : (
                usersData.users.map(u => (
                  <tr key={u.uuid} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{u.username}</div>
                      <div className="text-xs text-gray-400">{u.email || u.mobileNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.uuid, e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 p-1"
                      >
                        <option value="user">User</option>
                        <option value="contributor">Contributor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleActiveToggle(u.uuid, u.isActive)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleDelete(u.uuid)} className="text-red-600 hover:text-red-800 font-medium text-xs">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

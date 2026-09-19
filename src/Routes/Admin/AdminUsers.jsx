import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, updateUserActiveStatus, deleteUser, getUser, getUserAnalytics, updateUserVerification, grantTestSeriesAccess, revokeTestSeriesAccess } from '../../hooks/api';

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

  const [selectedUserUuid, setSelectedUserUuid] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [tsForm, setTsForm] = useState({ testSeriesUuid: '', expiresAt: '' });

  const openDetails = async (uuid) => {
    setSelectedUserUuid(uuid);
    setDetailsLoading(true);
    try {
      const u = await getUser(uuid);
      let a = null;
      try {
        a = await getUserAnalytics(uuid);
      } catch {
        // Analytics might not exist
      }
      setUserDetails(u);
      setUserAnalytics(a);
    } catch (err) {
      alert('Failed to fetch user details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedUserUuid(null);
    setUserDetails(null);
    setUserAnalytics(null);
    setTsForm({ testSeriesUuid: '', expiresAt: '' });
  };

  const handleVerificationToggle = async (type, currentValue) => {
    try {
      const updated = await updateUserVerification(selectedUserUuid, { [type]: !currentValue });
      setUserDetails(updated);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update verification');
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!tsForm.testSeriesUuid) return;
    try {
      const updated = await grantTestSeriesAccess(selectedUserUuid, { 
        testSeriesUuid: tsForm.testSeriesUuid,
        expiresAt: tsForm.expiresAt || undefined
      });
      setUserDetails(updated);
      setTsForm({ testSeriesUuid: '', expiresAt: '' });
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to grant access');
    }
  };

  const handleRevokeAccess = async (testSeriesUuid) => {
    if (!confirm('Are you sure you want to revoke this access?')) return;
    try {
      const updated = await revokeTestSeriesAccess(selectedUserUuid, testSeriesUuid);
      setUserDetails(updated);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to revoke access');
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
                      <button onClick={() => openDetails(u.uuid)} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Details</button>
                      <button onClick={() => handleDelete(u.uuid)} className="text-red-600 hover:text-red-800 font-medium text-xs">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUserUuid && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            
            {detailsLoading ? (
              <p>Loading details...</p>
            ) : userDetails ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg border-b pb-2 mb-2">Profile</h3>
                  <p><strong>Username:</strong> {userDetails.username}</p>
                  <p><strong>Email:</strong> {userDetails.email}</p>
                  <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
                  <p><strong>Role:</strong> {userDetails.role}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg border-b pb-2 mb-2">Verifications</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!userDetails.isEmailVerified}
                        onChange={() => handleVerificationToggle('isEmailVerified', userDetails.isEmailVerified)}
                      />
                      Email Verified
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!userDetails.isMobileVerified}
                        onChange={() => handleVerificationToggle('isMobileVerified', userDetails.isMobileVerified)}
                      />
                      Mobile Verified
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg border-b pb-2 mb-2">Test Series Access</h3>
                  {userDetails.testSeriesAccess && userDetails.testSeriesAccess.length > 0 ? (
                    <ul className="mb-4 space-y-2">
                      {userDetails.testSeriesAccess.map((access, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <div>
                            <span className="font-medium text-sm">Series: {access.testSeriesUuid}</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${access.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{access.status}</span>
                            <div className="text-xs text-gray-500">Expires: {access.expiresAt ? new Date(access.expiresAt).toLocaleDateString() : 'Never'}</div>
                          </div>
                          {access.status === 'active' && (
                            <button onClick={() => handleRevokeAccess(access.testSeriesUuid)} className="text-xs text-red-600 hover:underline">Revoke</button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">No access granted.</p>
                  )}
                  
                  <form onSubmit={handleGrantAccess} className="flex gap-2 items-end">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Test Series UUID</label>
                      <input required type="text" value={tsForm.testSeriesUuid} onChange={e => setTsForm({ ...tsForm, testSeriesUuid: e.target.value })} className="border px-2 py-1 rounded text-sm w-40" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Expires At (Optional)</label>
                      <input type="datetime-local" value={tsForm.expiresAt} onChange={e => setTsForm({ ...tsForm, expiresAt: e.target.value })} className="border px-2 py-1 rounded text-sm" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Grant Access</button>
                  </form>
                </div>

                <div>
                  <h3 className="font-semibold text-lg border-b pb-2 mb-2">Analytics Summary</h3>
                  {userAnalytics ? (
                    <p className="text-sm">Found analytics record. Tests taken: {userAnalytics.testPerformance?.length || 0}</p>
                  ) : (
                    <p className="text-sm text-gray-500">No analytics data available.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-red-500">User not found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

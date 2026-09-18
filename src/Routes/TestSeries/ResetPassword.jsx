import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authResetPassword } from '../../hooks/api';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get('uuid') || '';
  const resetToken = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!uuid || !resetToken) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }

    setLoading(true);
    try {
      await authResetPassword(uuid, resetToken, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="DefenceRoger" className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-extrabold text-gray-900 font-logo">DefenceRoger</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Set a new password</h1>
          <p className="text-gray-500 mt-1 text-sm">Choose a strong password for your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Password updated</h2>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been reset successfully.
              </p>
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="reset-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  New password
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label htmlFor="reset-confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm new password
                </label>
                <input
                  id="reset-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

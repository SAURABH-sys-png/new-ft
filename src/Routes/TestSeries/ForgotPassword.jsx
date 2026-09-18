import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authForgotPassword } from '../../hooks/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await authForgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      // API returns 200 regardless for security, but handle network errors
      setError(err.message || 'Something went wrong. Please try again.');
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
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Reset your password</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 mb-6">
                If an account exists with that email, we've sent a password reset link.
              </p>
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to sign in
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
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}
        </div>

        {!sent && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login as apiLogin } from '../../utils/api';
import { useI18n } from '../../i18n';

export default function Login() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiLogin(email, password);
      login(response.token, response.user);
      
      // Redirect based on role
      if (response.user.role === 'ADMIN') {
        navigate('/app/admin');
      } else if (response.user.role === 'MANAGER') {
        navigate('/app/manager/approvals');
      } else {
        navigate('/app/employee');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@geocustody.com', password: 'admin123' },
    { role: 'Manager', email: 'manager@geocustody.com', password: 'manager123' },
    { role: 'Employee', email: 'john@geocustody.com', password: 'employee123' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10" />

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo - Apple Style */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 bg-accent-600 rounded-apple-2xl flex items-center justify-center shadow-apple">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="currentColor">
              <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
            </svg>
          </div>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('login') || 'Welcome'}
          </h1>
          <p className="text-base text-gray-600">
            Sign in to GeoCustody to manage your assets
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-apple-2xl shadow-apple border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert - Apple Style */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-apple px-4 py-3 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Email Field - Apple Style */}
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>

            {/* Password Field - Apple Style */}
            <div>
              <label htmlFor="password" className="label">{t('password') || 'Password'}</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Sign In Button - Apple Style */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-lg w-full mt-8"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loading w-4 h-4" />
                  {t('loading') || 'Signing in...'}
                </span>
              ) : (
                t('login') || 'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">Demo Credentials</span>
            </div>
          </div>

          {/* Demo Credentials - Apple Style */}
          <div className="space-y-2">
            {demoCredentials.map((cred) => (
              <button
                key={cred.role}
                type="button"
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
                className="card-interactive w-full flex flex-col items-start p-3 mb-0 hover:bg-gray-50"
              >
                <span className="font-semibold text-gray-900 text-sm">{cred.role}</span>
                <span className="text-xs text-gray-500 mt-1">{cred.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Link - Apple Style */}
        <p className="mt-8 text-center text-sm text-gray-600">
          <Link to="/" className="text-accent-600 hover:text-accent-700 font-medium transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

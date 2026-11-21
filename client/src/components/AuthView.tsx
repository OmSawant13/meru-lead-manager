import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  TrendingUp,
  Columns3,
  Zap,
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register, demoLogin } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && name.trim().length < 2) {
      setError('Please provide a name of at least 2 characters.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
        showToast('Welcome back! Signed in successfully.');
      } else {
        await register(name.trim(), email.trim(), password);
        showToast('Account created! Welcome to LeadFlow.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Authentication failed. Please check credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await demoLogin();
      showToast('Logged in as Demo User (Aarav Sharma).');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to login with demo user. Run `npm run db:setup`.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Product Value & Highlights */}
        <div className="lg:col-span-6 space-y-6 text-white text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Meru Technosoft Developer Screening</span>
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              LeadFlow <span className="text-indigo-400">CRM</span>
            </h1>
            <p className="mt-3 text-base text-slate-300 max-w-md mx-auto lg:mx-0 leading-relaxed">
              A high-performance pipeline manager built with React 18, TypeScript, Express, and Prisma.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3 pt-2 text-sm text-slate-300">
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Columns3 className="w-4 h-4" />
              </div>
              <span>Dual-view Table & Kanban Pipeline board</span>
            </div>

            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>Interactive KPI metrics & conversion analytics</span>
            </div>

            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <span>Debounced search, CSV export & slide-over dossier</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl shadow-2xl p-7 sm:p-8 border border-slate-100">
            {/* Quick Demo Reviewer Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100/90">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 mr-1 text-indigo-600" />
                  For Screening Evaluators
                </span>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                  1-Click Access
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Skip typing credentials. Log in as <strong>Aarav Sharma</strong> with 8 pre-seeded leads across all pipeline stages.
              </p>
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <span>Launch Demo Account</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </button>
            </div>

            {/* Form Switcher Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
                className={`flex-1 py-2 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                  isLogin
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                }}
                className={`flex-1 py-2 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                  !isLogin
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aarav Sharma"
                      required={!isLogin}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                {isSubmitting
                  ? 'Processing...'
                  : isLogin
                  ? 'Sign In with Email'
                  : 'Create My Account'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-slate-400">
              {isLogin ? "Don't have an account yet?" : 'Already registered?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-2 cursor-pointer"
              >
                {isLogin ? 'Create one now' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

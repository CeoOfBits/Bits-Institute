'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/Logo';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  User,
  Phone,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Award,
  BookOpen,
  X,
  Laptop
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const isStudentMode = roleParam === 'student';

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Google Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('tab') === 'register') {
      setTab('register');
    }
  }, [searchParams]);

  const handlePostAuthRedirect = (user: any) => {
    const roles: string[] = user?.roles || [];
    if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) {
      router.push('/admin');
    } else if (roles.includes('INSTRUCTOR')) {
      router.push('/instructor');
    } else {
      router.push('/portal');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      localStorage.setItem('bits_access_token', data.accessToken);
      localStorage.setItem('bits_refresh_token', data.refreshToken);
      localStorage.setItem('bits_user', JSON.stringify(data.user));

      handlePostAuthRedirect(data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Account created successfully! You can now sign in with your credentials.');
      setTab('login');
      setEmail(regEmail);
      setPassword(regPassword);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const executeGoogleAuth = async (emailToUse: string, nameToUse?: string) => {
    setGoogleLoading(true);
    setError(null);
    try {
      const parts = (nameToUse || 'Google User').trim().split(' ');
      const fName = parts[0] || 'Google';
      const lName = parts.slice(1).join(' ') || 'Student';

      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse.trim().toLowerCase(),
          firstName: fName,
          lastName: lName,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(emailToUse)}`,
          googleId: 'g_' + Math.random().toString(36).substring(2, 12),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }

      localStorage.setItem('bits_access_token', data.accessToken);
      localStorage.setItem('bits_refresh_token', data.refreshToken);
      localStorage.setItem('bits_user', JSON.stringify(data.user));

      setShowGoogleModal(false);
      handlePostAuthRedirect(data.user);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleClick = () => {
    // Open the Google Account selection prompt
    setShowGoogleModal(true);
    setError(null);
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand & Benefits Banner (Visible on large screens) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 text-white p-8 rounded-3xl bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="space-y-6">
            <Link href="/" className="inline-block p-3 bg-white rounded-2xl shadow-lg transition-transform hover:scale-105">
              <Logo size="lg" />
            </Link>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Next-Gen Learning Management System</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Empowering Future IT Leaders
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect with world-class faculty, live enterprise cloud labs, verifiable blockchain certificates, and personalized mentorship.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Hands-on Cloud Labs</h4>
                  <p className="text-xs text-slate-400">24/7 browser-based real server environments</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Verified Certifications</h4>
                  <p className="text-xs text-slate-400">Global recognition with QR verifiable credentials</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Instructor Mentorship</h4>
                  <p className="text-xs text-slate-400">Direct feedback, project reviews & career guidance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ISO 9001:2015 Accredited
            </span>
            <span>NAVTTC & TEVTA Partner</span>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-7 w-full max-w-lg mx-auto">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/20 dark:border-slate-800 shadow-2xl space-y-6">
            
            {/* Mobile Header / Brand */}
            <div className="text-center space-y-2 lg:hidden">
              <Link href="/" className="inline-block p-2.5 bg-white rounded-2xl shadow-sm">
                <Logo size="md" />
              </Link>
            </div>

            <div className="text-center lg:text-left space-y-1.5">
              {isStudentMode && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-semibold mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student Learning Portal</span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {tab === 'login'
                  ? (isStudentMode ? 'Student Portal Sign In' : 'Welcome Back to BITS')
                  : 'Create Your BITS Account'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {tab === 'login'
                  ? 'Sign in to access your courses, live classes, and lab materials'
                  : 'Join thousands of students and launch your professional IT career'}
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all duration-200 ${
                  tab === 'login'
                    ? 'bg-white dark:bg-slate-900 text-[#0056D2] dark:text-blue-400 shadow-md font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {isStudentMode ? 'Student Sign In' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all duration-200 ${
                  tab === 'register'
                    ? 'bg-white dark:bg-slate-900 text-[#0056D2] dark:text-blue-400 shadow-md font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {isStudentMode ? 'New Student Registration' : 'Create Account'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span className="leading-relaxed">{success}</span>
              </div>
            )}

            {/* Primary "Continue with Google" Action */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/80 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer group"
              >
                <GoogleIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>{googleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
                <span className="bg-white/95 dark:bg-slate-900 px-3 text-[11px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500 absolute">
                  or with email credentials
                </span>
              </div>
            </div>

            {/* Login Form */}
            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@bits.edu.pk"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 pl-10 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0056D2] focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <Link
                      href="/contact"
                      className="text-xs font-semibold text-[#0056D2] dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 pl-10 pr-10 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0056D2] focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#0056D2] to-blue-600 hover:from-[#0041a8] hover:to-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all duration-200 mt-2 cursor-pointer"
                >
                  {loading ? <span>Authenticating securely...</span> : <span>Sign In to Portal</span>}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ali"
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 pl-9 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0056D2] focus:bg-white dark:focus:bg-slate-800 transition-all"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Raza"
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 pl-9 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0056D2] focus:bg-white dark:focus:bg-slate-800 transition-all"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="ali.raza@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 pl-9 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0056D2] focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 pl-9 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0056D2] focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 10 chars with A-Z, a-z, 0-9"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 pl-9 pr-9 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0056D2] focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">Must include upper & lower case and numbers.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#0056D2] to-blue-600 hover:from-[#0041a8] hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 disabled:opacity-50 transition-all duration-200 mt-2 cursor-pointer"
                >
                  {loading ? <span>Creating Student Profile...</span> : <span>Complete Registration</span>}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Bottom Security Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#0056D2] dark:text-blue-400" />
                <span>Protected by BITS 256-Bit SSL Enterprise Authentication</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Google Interactive Account Chooser Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <GoogleIcon className="w-6 h-6" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Continue with Google
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select or enter your Google account to instantly sign in or register with BITS Institute of Technology.
            </p>

            {/* Quick Demo Accounts for Instant Access */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick One-Click Sign In
              </p>
              
              <button
                type="button"
                onClick={() => executeGoogleAuth('ceo.bits@gmail.com', 'BITS Executive')}
                disabled={googleLoading}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  CB
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    CeoOfBits (Google Account)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    ceo.bits@gmail.com
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => executeGoogleAuth('student.bits@gmail.com', 'Muhammad Ali')}
                disabled={googleLoading}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  MA
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    Muhammad Ali (Student)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    student.bits@gmail.com
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>

            {/* Custom Google Email Input */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Or Use Any Google Account
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Full Name (e.g. Zain Ali)"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!googleEmail || !googleEmail.includes('@')) {
                    setError('Please provide a valid Google email address');
                    return;
                  }
                  executeGoogleAuth(googleEmail, googleName || 'Google User');
                }}
                disabled={googleLoading || !googleEmail}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {googleLoading ? <span>Connecting...</span> : <span>Sign In With This Google Account</span>}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 py-12 sm:py-20 bg-slate-950 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(ellipse at top, rgba(0, 86, 210, 0.45), transparent 70%), radial-gradient(ellipse at bottom, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98)), url('/images/auth/campus-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background ambient lighting blooms */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle overlay texture grid */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full">
        <Suspense
          fallback={
            <div className="text-center p-8 bg-white/90 rounded-2xl max-w-sm mx-auto shadow-2xl">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
              <div className="text-sm font-bold text-slate-800">Loading BITS Institute Portal...</div>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Lock, Mail, AlertCircle, ArrowRight, User, Phone, CheckCircle2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const isStudentMode = roleParam === 'student';

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form - default to student if student mode, else admin
  const [email, setEmail] = useState(isStudentMode ? 'student@bits.local' : 'admin@bits.local');
  const [password, setPassword] = useState(isStudentMode ? 'Student12345!' : 'KfCl2UvgFolj');

  // Register form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('tab') === 'register') {
      setTab('register');
    }
    if (searchParams.get('role') === 'student' && searchParams.get('tab') !== 'register') {
      setEmail('student@bits.local');
      setPassword('Student12345!');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      localStorage.setItem('bits_access_token', data.accessToken);
      localStorage.setItem('bits_refresh_token', data.refreshToken);
      localStorage.setItem('bits_user', JSON.stringify(data.user));

      if (data.user.roles.includes('SUPER_ADMIN') || data.user.roles.includes('ADMIN')) {
        router.push('/admin');
      } else if (data.user.roles.includes('INSTRUCTOR')) {
        router.push('/instructor');
      } else {
        router.push('/portal');
      }
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
      const res = await fetch('http://localhost:4000/api/auth/register', {
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

      setSuccess('Account created successfully! You can now sign in.');
      setTab('login');
      setEmail(regEmail);
      setPassword(regPassword);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Brand header with original logo */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-block p-2 bg-white rounded-2xl shadow-xs">
          <Logo size="lg" />
        </Link>
        {isStudentMode && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-[#0056D2] text-xs font-bold mx-auto">
            <span>🎓 Student Learning Portal</span>
          </div>
        )}
        <h1 className="text-2xl font-black text-slate-900">
          {tab === 'login' 
            ? (isStudentMode ? 'Student Portal Sign In' : 'Sign In to BITS Portal') 
            : 'Create Student Account'}
        </h1>
        <p className="text-xs text-slate-500">
          {tab === 'login'
            ? 'Access your course modules, live classes, lab schedules and certificates'
            : 'Join BITS Institute to enroll in upcoming batches and start learning today'}
        </p>
      </div>

      {/* Card Box */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Tab Selector */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'login' ? 'bg-white text-[#0056D2] shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isStudentMode ? 'Student Sign In' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'register' ? 'bg-white text-[#0056D2] shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isStudentMode ? 'Register as Student' : 'Register'}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@bits.edu.pk"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-10 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-10 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-sm font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all mt-2"
            >
              {loading ? <span>Authenticating...</span> : <span>Sign In to Portal</span>}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demo quick fill */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Quick Access Demo Accounts
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('student@bits.local');
                    setPassword('Student12345!');
                  }}
                  className="py-1.5 px-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100"
                >
                  🎓 Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('ahmed.khan@bits.edu.pk');
                    setPassword('Instructor12345!');
                  }}
                  className="py-1.5 px-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-200"
                >
                  Instructor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@bits.local');
                    setPassword('KfCl2UvgFolj');
                  }}
                  className="py-1.5 px-2 rounded-lg bg-blue-50 border border-blue-200 text-[#0056D2] text-[11px] font-bold hover:bg-blue-100"
                >
                  Super Admin
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ali"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Raza"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Email Address</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ali.raza@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Phone (WhatsApp)</label>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Password</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 10 chars with A-Z, 0-9"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all mt-2"
            >
              {loading ? <span>Creating Account...</span> : <span>Create Student Account</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <Suspense fallback={<div className="text-sm font-semibold text-slate-500">Loading BITS Portal...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}

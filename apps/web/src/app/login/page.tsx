'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
  ShieldCheck,
  Terminal,
} from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: any) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
              locale?: string;
            },
          ) => void;
        };
      };
    };
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

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

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get('tab') === 'register') {
      setTab('register');
    }
  }, [searchParams]);

  // Handle post authentication redirection based on server-verified roles
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

  // Authenticate Google ID token with backend API
  const handleGoogleToken = async (idToken: string) => {
    setGoogleLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }

      localStorage.setItem('bits_access_token', data.accessToken);
      localStorage.setItem('bits_refresh_token', data.refreshToken);
      localStorage.setItem('bits_user', JSON.stringify(data.user));

      handlePostAuthRedirect(data.user);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Initialize Google Identity Services (GIS)
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const scriptId = 'google-gsi-client';
    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: { credential: string }) => {
            if (response.credential) {
              handleGoogleToken(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonContainerRef.current) {
          window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'center',
            width: 320,
          });
        }
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else {
      initGsi();
    }
  }, []);

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError(
        'Google OAuth Client ID is not configured yet. Please configure NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.',
      );
      return;
    }

    if (window.google?.accounts?.id) {
      setError(null);
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One-Tap prompt is suppressed, fall back to standard trigger
          const renderedBtn = googleButtonContainerRef.current?.querySelector('div[role="button"]') as HTMLElement | null;
          if (renderedBtn) {
            renderedBtn.click();
          }
        }
      });
    } else {
      setError('Google Identity Services library is loading. Please try again in a moment.');
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative backdrop-blur-2xl bg-slate-900/85 border border-cyan-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.18)] space-y-6">
        
        {/* Top Logo & Cyber Header */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-block p-2.5 bg-white rounded-2xl shadow-lg transition-transform hover:scale-105"
          >
            <Logo size="md" />
          </Link>

          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-[11px] font-semibold tracking-wide">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>CYBER DEFENSE & IT ACADEMY</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {tab === 'login'
                ? (isStudentMode ? 'Student Portal Sign In' : 'Sign In to BITS Portal')
                : 'Create Student Account'}
            </h1>
            <p className="text-xs text-slate-300">
              {tab === 'login'
                ? 'Access your ethical hacking labs, course modules & live classes'
                : 'Join BITS Institute to begin your cybersecurity & tech journey'}
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-slate-950/70 p-1 text-xs font-bold border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
              tab === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
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
            className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
              tab === 'register'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isStudentMode ? 'New Student Registration' : 'Create Account'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-relaxed">{success}</span>
          </div>
        )}

        {/* Continue with Google Action */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-950/80 border border-slate-700/80 hover:border-cyan-400 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-cyan-500/10 disabled:opacity-60 cursor-pointer group"
          >
            <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
            <span>{googleLoading ? 'Verifying with Google...' : 'Continue with Google'}</span>
          </button>

          {/* Hidden container for GIS button rendering when needed */}
          <div ref={googleButtonContainerRef} className="hidden" aria-hidden="true" />

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900/90 px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-400 absolute">
              or continue with email
            </span>
          </div>
        </div>

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@bits.edu.pk"
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
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
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 pr-10 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all duration-200 mt-2 cursor-pointer"
            >
              {loading ? <span>Authenticating securely...</span> : <span>Sign In to Portal</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ali"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-2 pl-8 text-xs text-white focus:outline-none focus:border-cyan-400 transition-all"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Raza"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-2 pl-8 text-xs text-white focus:outline-none focus:border-cyan-400 transition-all"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ali.raza@example.com"
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-2 pl-8 text-xs text-white focus:outline-none focus:border-cyan-400 transition-all"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Phone (WhatsApp)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-2 pl-8 text-xs text-white focus:outline-none focus:border-cyan-400 transition-all"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 10 chars (A-Z, a-z, 0-9)"
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-2 pl-8 pr-8 text-xs text-white focus:outline-none focus:border-cyan-400 transition-all"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white transition-colors"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all duration-200 mt-2 cursor-pointer"
            >
              {loading ? <span>Creating Profile...</span> : <span>Complete Student Registration</span>}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Bottom Security Footer */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Secured by BITS 256-Bit SSL Enterprise Authentication</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 py-12 sm:py-16 bg-slate-950 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4), rgba(2, 6, 23, 0.85)), url('/images/auth/cyber-security-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Cyan & emerald ambient hacker glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber subtle scanline backdrop */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <Suspense
          fallback={
            <div className="text-center p-8 bg-slate-900/90 border border-cyan-500/30 rounded-2xl max-w-sm mx-auto shadow-2xl">
              <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-3" />
              <div className="text-sm font-bold text-white">Loading BITS Cyber Portal...</div>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}

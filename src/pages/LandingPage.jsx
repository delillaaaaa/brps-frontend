import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Brain, Shield, ChevronRight, BarChart3, Users, Zap, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col select-none">
      {/* Top Header */}
      <header className="sticky top-0 left-0 right-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-50 select-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-lg tracking-tight shrink-0">BRPS Health</span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
            </button>

            {/* Go to Dashboard Actions */}
            <Link
              to="/login"
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] sm:text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 cursor-pointer shrink-0"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100/50 dark:border-teal-900/50">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">Predictive Employee Wellness</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
              Combatting Workplace <span className="text-teal-600 dark:text-teal-400">Burnout</span> Before It Starts
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Empower your career and team with the Burnout Risk Prediction System (BRPS). Our advanced machine learning diagnostic evaluates workload stress and generates highly personalized clinical-grade recommendations.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 max-w-md">
              <Link
                to="/register"
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Start Risk Assessment</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all text-center cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Floating Hero Custom SVG Illustration */}
          <div className="flex justify-center select-none relative animate-float">
            <div className="absolute inset-0 bg-teal-200/25 dark:bg-teal-950/10 rounded-full blur-3xl opacity-60 max-w-sm mx-auto"></div>
            <svg
              viewBox="0 0 500 500"
              className="w-full max-w-md relative z-10 filter drop-shadow-xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Core Dashboard Frame */}
              <rect x="50" y="80" width="400" height="340" rx="24" className="fill-white dark:fill-slate-900 transition-colors" />
              <rect x="70" y="110" width="360" height="40" rx="10" className="fill-slate-50 dark:fill-slate-800/50 transition-colors" />
              
              {/* Tiny Mock UI Elements */}
              <circle cx="95" cy="130" r="6" className="fill-teal-500 dark:fill-teal-400" />
              <rect x="115" y="125" width="80" height="10" rx="5" className="fill-slate-200 dark:fill-slate-700 transition-colors" />
              
              <rect x="70" y="170" width="220" height="220" rx="16" className="fill-sky-100/40 dark:fill-sky-950/20 transition-colors" />
              <rect x="310" y="170" width="120" height="100" rx="16" className="fill-teal-50 dark:fill-teal-950/20 transition-colors" />
              <rect x="310" y="290" width="120" height="100" rx="16" className="fill-rose-50 dark:fill-rose-950/20 transition-colors" />
              
              {/* Glowing Pulse Chart Line in Mock UI */}
              <path
                d="M 90 290 Q 130 200 170 300 T 250 210"
                className="stroke-teal-500 dark:stroke-teal-400"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="250" cy="210" r="10" className="fill-teal-500 dark:fill-teal-400 animate-pulse" />

              {/* Heart SVG badge icon floating */}
              <g transform="translate(340, 200) scale(0.8)">
                <rect x="0" y="0" width="50" height="50" rx="12" className="fill-teal-500 dark:fill-teal-400" />
                <path
                  d="M25 35.7l-1.4-1.3C18.6 29.8 15 26.6 15 22.7c0-3.1 2.4-5.5 5.5-5.5 1.8 0 3.5.8 4.5 2.1 1-1.3 2.7-2.1 4.5-2.1 3.1 0 5.5 2.4 5.5 5.5 0 3.9-3.6 7.1-8.6 11.7L25 35.7z"
                  fill="#FFFFFF"
                />
              </g>
            </svg>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800/80 py-20 select-none">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                End-to-End Predictive Health Pipeline
              </h2>
              <p className="text-slate-400 dark:text-slate-500 max-w-lg mx-auto text-sm">
                A simple workflow that collects occupational indicators, performs diagnostics, and recommends recovery plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 text-left space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">AI Cognitive Predictive Model</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Processes workplace stress, week ratios, and occupation logs to identify potential high-risk stress spikes.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 text-left space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Real-Time Dashboards</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Keep tabs on historical assessments, compare index ratios, and see health improvements instantly in key visuals.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 text-left space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">HR and Self-Care Solutions</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Clear recommendations on work flexibility and tailored self-care advice to secure healthy professional work boundaries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* System Stats Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 select-none">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-1">
              <span className="block text-3xl font-extrabold text-teal-600 dark:text-teal-400">99.8%</span>
              <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs uppercase tracking-wider">Model Accuracy</span>
            </div>
            <div className="text-center space-y-1">
              <span className="block text-3xl font-extrabold text-teal-600 dark:text-teal-400">10k+</span>
              <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs uppercase tracking-wider">Active Employees</span>
            </div>
            <div className="text-center space-y-1">
              <span className="block text-3xl font-extrabold text-teal-600 dark:text-teal-400">&lt; 3s</span>
              <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs uppercase tracking-wider">Response Speed</span>
            </div>
            <div className="text-center space-y-1">
              <span className="block text-3xl font-extrabold text-teal-600 dark:text-teal-400">24/7</span>
              <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs uppercase tracking-wider">Wellness Tracking</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 dark:bg-black text-slate-400 dark:text-slate-500 py-10 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="font-bold text-white dark:text-slate-100">BRPS Health System</span>
          </div>
          <p>© 2026 BRPS System. All rights reserved. Professional healthcare dashboard solution.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

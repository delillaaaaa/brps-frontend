import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Brain, Shield, ChevronRight, BarChart3, Users, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 select-none">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-bold text-slate-800 text-lg">BRPS Health</span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 cursor-pointer"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100/50">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
              <span className="text-xs font-semibold text-teal-700">Predictive Employee Wellness</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Combatting Workplace <span className="text-teal-600">Burnout</span> Before It Starts
            </h1>
            <p className="text-base text-slate-500 max-w-lg leading-relaxed">
              Empower your career and team with the Burnout Risk Prediction System (BRPS). Our advanced machine learning diagnostic evaluates workload stress and generates highly personalized clinical-grade recommendations.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-2 group cursor-pointer"
              >
                <span>Start Risk Assessment</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Floating Hero Custom SVG Illustration */}
          <div className="flex justify-center select-none relative animate-float">
            <div className="absolute inset-0 bg-teal-200/25 rounded-full blur-3xl opacity-60 max-w-sm mx-auto"></div>
            <svg
              viewBox="0 0 500 500"
              className="w-full max-w-md relative z-10 filter drop-shadow-xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Core Dashboard Frame */}
              <rect x="50" y="80" width="400" height="340" rx="24" fill="#FFFFFF" />
              <rect x="70" y="110" width="360" height="40" rx="10" fill="#F8FAFC" />
              
              {/* Tiny Mock UI Elements */}
              <circle cx="95" cy="130" r="6" fill="#01A3B0" />
              <rect x="115" y="125" width="80" height="10" rx="5" fill="#E2E8F0" />
              
              <rect x="70" y="170" width="220" height="220" rx="16" fill="#EAF2FE" />
              <rect x="310" y="170" width="120" height="100" rx="16" fill="#E6F7F0" />
              <rect x="310" y="290" width="120" height="100" rx="16" fill="#FFF1F2" />
              
              {/* Glowing Pulse Chart Line in Mock UI */}
              <path
                d="M 90 290 Q 130 200 170 300 T 250 210"
                stroke="#01A3B0"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="250" cy="210" r="10" fill="#01A3B0" className="animate-pulse" />

              {/* Heart SVG badge icon floating */}
              <g transform="translate(340, 200) scale(0.8)">
                <rect x="0" y="0" width="50" height="50" rx="12" fill="#01A3B0" />
                <path
                  d="M25 35.7l-1.4-1.3C18.6 29.8 15 26.6 15 22.7c0-3.1 2.4-5.5 5.5-5.5 1.8 0 3.5.8 4.5 2.1 1-1.3 2.7-2.1 4.5-2.1 3.1 0 5.5 2.4 5.5 5.5 0 3.9-3.6 7.1-8.6 11.7L25 35.7z"
                  fill="#FFFFFF"
                />
              </g>
            </svg>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="bg-white border-y border-slate-100 py-20 select-none">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                End-to-End Predictive Health Pipeline
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto text-sm">
                A simple workflow that collects occupational indicators, performs diagnostics, and recommends recovery plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">AI Cognitive Predictive Model</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Processes workplace stress, week ratios, and occupation logs to identify potential high-risk stress spikes.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Real-Time Dashboards</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Keep tabs on historical assessments, compare index ratios, and see health improvements instantly in key visuals.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">HR and Self-Care Solutions</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
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
              <span className="block text-3xl font-extrabold text-teal-600">99.8%</span>
              <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Model Accuracy</span>
            </div>
            <div className="text-center space-y-1">
              <span className="block text-3xl font-extrabold text-teal-600">10k+</span>
              <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Active Employees</span>
            </div>
            <div className="text-center space-y-1">
              <span className="block text-3xl font-extrabold text-teal-600">&lt; 3s</span>
              <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Response Speed</span>
            </div>
            <div className="text-center space-y-1">
              <span className="block text-3xl font-extrabold text-teal-600">24/7</span>
              <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Wellness Tracking</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="font-bold text-white">BRPS Health System</span>
          </div>
          <p>© 2026 BRPS System. All rights reserved. Professional healthcare dashboard solution.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { Activity, Mail, Lock, User, Calendar, Users, ArrowRight, ChevronLeft } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdayDate, setBirthdayDate] = useState('');
  const [gender, setGender] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !birthdayDate || !gender) {
      toast.warning('Please fill in all details');
      return;
    }

    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters long');
      return;
    }

    setFormLoading(true);
    try {
      await register(email, password, name, birthdayDate, gender);
      toast.success('Registration successful! Session started.');
      navigate('/setup-profile');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Email might already exist.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background patterns */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="max-w-md w-full relative z-10 flex flex-col space-y-4 my-8">
        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm cursor-pointer self-start transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>

        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl shadow-slate-100 dark:shadow-none flex flex-col">
          {/* Logo Header */}
          <div className="flex flex-col items-center space-y-3 mb-8">
            <Link to="/" className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-inner">
              <Activity className="w-6 h-6 animate-pulse" />
            </Link>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Create Account</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                Burnout Risk Prediction System
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            {/* Birthday Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Birthday Date</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={birthdayDate}
                  onChange={(e) => setBirthdayDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            {/* Gender Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gender</label>
              <div className="relative">
                <Users className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 flex items-center justify-center space-x-2 shrink-0 pt-3 cursor-pointer"
            >
              {formLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Register & Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Navigation to Login */}
          <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-550 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-350 cursor-pointer">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

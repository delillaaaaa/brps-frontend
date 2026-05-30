import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { 
  Briefcase, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  MapPin,
  User
} from 'lucide-react';

const SetupProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [department, setDepartment] = useState('');
  const [yearsExperience, setYearsExperience] = useState(0);
  
  const [workHours, setWorkHours] = useState(40);
  const [remoteRatio, setRemoteRatio] = useState(0.5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill profile values if they exist
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setJobRole(user.job_role || '');
      setDepartment(user.department || '');
      setYearsExperience(user.years_experience || 0);
      setWorkHours(user.work_hours_per_week || 40);
      setRemoteRatio(user.remote_ratio !== undefined && user.remote_ratio !== null ? user.remote_ratio : 0.5);
    }
  }, [user]);

  const validateStep1 = () => {
    if (!name.trim()) {
      toast.warning('Please specify your full name');
      return false;
    }
    if (!jobRole.trim()) {
      toast.warning('Please specify your job role');
      return false;
    }
    if (!department.trim()) {
      toast.warning('Please specify your department');
      return false;
    }
    if (yearsExperience < 0) {
      toast.warning('Years of experience cannot be negative');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setIsSubmitting(true);
    try {
      const response = await api.put('/api/users/profile', {
        name: name,
        birthday_date: user?.birthday_date,
        gender: user?.gender,
        job_role: jobRole,
        department: department,
        years_experience: Number(yearsExperience),
        work_hours_per_week: Number(workHours),
        remote_ratio: Number(remoteRatio),
      });

      if (response.data && response.data.success) {
        toast.success('Work profile configured successfully!');
        await refreshProfile();
        navigate('/dashboard');
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      toast.error(error.message || 'Error occurred while updating work profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none p-8 relative z-10 flex flex-col">
        {/* Step Indicator Headers */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm transition-all duration-300 ${step >= 1 ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </span>
            <span className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${step >= 1 ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}>Professional</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-slate-100 dark:bg-slate-800 relative overflow-hidden rounded-full">
            <div className="absolute inset-y-0 left-0 bg-teal-500 transition-all duration-300" style={{ width: step === 1 ? '0%' : '100%' }} />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm transition-all duration-300 ${step === 2 ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
              2
            </span>
            <span className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${step === 2 ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}>Work Habits</span>
          </div>
        </div>

        <div className="text-left space-y-1 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Complete Work Profile</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Tell us about your current occupation to calibrate our AI burnout risk metrics.
          </p>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left flex-1">
          {step === 1 ? (
            <div className="space-y-5 animate-fade-in" style={{ animation: 'fadeIn 0.25s ease-out' }}>
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
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Job Role Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Role / Title</label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Department Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Engineering / Product"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Years Experience Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Years of Experience</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="60"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="e.g. 5"
                  className="w-full px-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in" style={{ animation: 'fadeIn 0.25s ease-out' }}>
              {/* Work Hours Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weekly Work Hours</label>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg">{workHours} hrs / week</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="1"
                    value={workHours}
                    onChange={(e) => setWorkHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Standard full-time is usually 40 hours.</p>
              </div>

              {/* Remote Ratio Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Remote Work Ratio</label>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg">{Math.round(remoteRatio * 100)}% Remote</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={remoteRatio}
                    onChange={(e) => setRemoteRatio(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold px-1">
                  <span>0% (On-site)</span>
                  <span>50% (Hybrid)</span>
                  <span>100% (Fully Remote)</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-850">
            {step === 2 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-sm rounded-xl transition-all flex items-center space-x-2 cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step === 1 ? (
              <button
                key="continue-btn"
                type="button"
                onClick={handleNext}
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 flex items-center space-x-2 cursor-pointer shrink-0 ml-auto"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                key="submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 flex items-center space-x-2 cursor-pointer shrink-0 ml-auto"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete Configuration</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default SetupProfilePage;

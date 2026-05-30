import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { 
  User, 
  Mail, 
  Calendar, 
  Users, 
  Briefcase, 
  MapPin, 
  Clock, 
  Save, 
  Activity,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const ProfilePage = () => {
  const { refreshProfile } = useAuth();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdayDate, setBirthdayDate] = useState('');
  const [gender, setGender] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [department, setDepartment] = useState('');
  const [yearsExperience, setYearsExperience] = useState(0);
  const [workHours, setWorkHours] = useState(40);
  const [remoteRatio, setRemoteRatio] = useState(0.5);

  // Password Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/users/profile');
      if (response.data && response.data.success) {
        const p = response.data.data;
        setName(p.name || '');
        setEmail(p.email || ''); // Read-only or displayed
        // Handle potential ISO string or date string to yyyy-MM-dd
        if (p.birthday_date) {
          setBirthdayDate(p.birthday_date.split('T')[0]);
        }
        setGender(p.gender || '');
        setJobRole(p.job_role || '');
        setDepartment(p.department || '');
        setYearsExperience(p.years_experience || 0);
        setWorkHours(p.work_hours_per_week || 40);
        setRemoteRatio(p.remote_ratio !== undefined && p.remote_ratio !== null ? p.remote_ratio : 0.5);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put('/api/users/profile', {
        name,
        birthday_date: birthdayDate,
        gender,
        job_role: jobRole,
        department,
        years_experience: Number(yearsExperience),
        work_hours_per_week: Number(workHours),
        remote_ratio: Number(remoteRatio)
      });

      if (response.data && response.data.success) {
        toast.success('Profile updated successfully!');
        await refreshProfile();
        // Refresh local inputs too
        await fetchProfileData();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword) {
      toast.warning('Current password is required');
      return;
    }
    if (!newPassword) {
      toast.warning('New password is required');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning('New password and confirmation do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await api.put('/api/auth/update-password', {
        old_password: oldPassword,
        new_password: newPassword
      });

      if (response.data && response.data.success) {
        toast.success('Password updated successfully!');
        // Clear fields
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Form content */}
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8 text-left select-none">
        <div className="space-y-8 animate-fade-in" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          
          {/* Header section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 flex items-center justify-between shadow-sm shadow-slate-100/50 dark:shadow-none">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Account Profile</h1>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Manage your personal and occupational health variables.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-650 dark:text-teal-400 shadow-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl" />
              <div className="h-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Card 1: Personal Information */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none space-y-5">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center space-x-2">
                  <User className="w-4.5 h-4.5 text-teal-655 dark:text-teal-400" />
                  <span>Personal Credentials</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Birthday */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Birthday Date</label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        required
                        value={birthdayDate}
                        onChange={(e) => setBirthdayDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gender</label>
                    <div className="relative">
                      <Users className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <select
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Registered Email (Disabled) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Login Email (Read-only)</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        disabled
                        value={email}
                        className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-sm focus:outline-none font-medium select-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Professional Information */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none space-y-5">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center space-x-2">
                  <Briefcase className="w-4.5 h-4.5 text-teal-655 dark:text-teal-400" />
                  <span>Work Parameters</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Job Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Job Role / Title</label>
                    <div className="relative">
                      <Briefcase className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        placeholder="e.g. Senior Developer"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Department</label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Engineering"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Years of Experience</label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setYearsExperience(Math.max(0, yearsExperience - 1))}
                        className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold transition-all cursor-pointer select-none"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        required
                        min="0"
                        max="60"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(Math.max(0, parseInt(e.target.value) || 0))}
                        className="flex-1 text-center py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setYearsExperience(Math.min(60, yearsExperience + 1))}
                        className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold transition-all cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  {/* Hours per week */}
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider">Weekly Work Hours</label>
                      <span className="text-xs font-bold text-teal-650 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-1 rounded-md">{workHours} hrs / week</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                      <input
                        type="range"
                        min="10"
                        max="80"
                        step="1"
                        value={workHours}
                        onChange={(e) => setWorkHours(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                    </div>
                  </div>

                  {/* Remote Ratio */}
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider">Remote Work Ratio</label>
                      <span className="text-xs font-bold text-teal-655 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-1 rounded-md">{Math.round(remoteRatio * 100)}% Remote</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-slate-400 shrink-0" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={remoteRatio}
                        onChange={(e) => setRemoteRatio(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 flex items-center space-x-2 cursor-pointer shrink-0"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* Card 3: Change Password */}
          {!isLoading && (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none space-y-5">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center space-x-2">
                  <Lock className="w-4.5 h-4.5 text-teal-650 dark:text-teal-400" />
                  <span>Update Password</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Old Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 transition-colors cursor-pointer"
                      >
                        {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 transition-colors cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 flex items-center space-x-2 cursor-pointer shrink-0"
                  >
                    {isUpdatingPassword ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default ProfilePage;

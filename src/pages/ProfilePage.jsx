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
  Activity
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

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Form content */}
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8 text-left select-none">
        <div className="max-w-4xl space-y-8 animate-fade-in" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          
          {/* Header section */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between shadow-sm shadow-slate-100/50">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Account Profile</h1>
              <p className="text-sm text-slate-400 font-medium">Manage your personal and occupational health variables.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-44 bg-white border border-slate-100 rounded-3xl" />
              <div className="h-64 bg-white border border-slate-100 rounded-3xl" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Card 1: Personal Information */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 space-y-5">
                <h3 className="font-bold text-slate-700 text-sm border-b border-slate-50 pb-3 flex items-center space-x-2">
                  <User className="w-4.5 h-4.5 text-teal-600" />
                  <span>Personal Credentials</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Birthday */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Birthday Date</label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        required
                        value={birthdayDate}
                        onChange={(e) => setBirthdayDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                    <div className="relative">
                      <Users className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <select
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium appearance-none cursor-pointer"
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
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Login Email (Read-only)</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        disabled
                        value={email}
                        className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 text-sm focus:outline-none font-medium select-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Professional Information */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 space-y-5">
                <h3 className="font-bold text-slate-700 text-sm border-b border-slate-50 pb-3 flex items-center space-x-2">
                  <Briefcase className="w-4.5 h-4.5 text-teal-600" />
                  <span>Work Parameters</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Job Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Role / Title</label>
                    <div className="relative">
                      <Briefcase className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        placeholder="e.g. Senior Developer"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Engineering"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Years of Experience</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="60"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  {/* Hours per week */}
                  <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Work Hours</label>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">{workHours} hrs / week</span>
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
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                    </div>
                  </div>

                  {/* Remote Ratio */}
                  <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remote Work Ratio</label>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">{Math.round(remoteRatio * 100)}% Remote</span>
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
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
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

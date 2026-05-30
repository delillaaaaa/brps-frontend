import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { 
  Plus, 
  Activity, 
  Trash2, 
  ChevronRight, 
  Heart, 
  Brain, 
  Smile, 
  Frown,
  Calendar,
  AlertCircle
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [assessments, setAssessments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch fresh profile and assessments concurrently
      const [profileRes, assessmentsRes] = await Promise.all([
        api.get('/api/users/profile'),
        api.get('/api/burnout-assessments')
      ]);

      if (profileRes.data.success) {
        setProfile(profileRes.data.data);
      }
      if (assessmentsRes.data.success) {
        // Sort assessments by date descending
        const sorted = (assessmentsRes.data.data || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setAssessments(sorted);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Could not retrieve recent wellness records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this assessment record?')) return;

    try {
      const response = await api.delete(`/api/burnout-assessments/${id}`);
      if (response.data.success) {
        toast.success('Assessment record deleted');
        setAssessments((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      toast.error(error.message || 'Error occurred while deleting record');
    }
  };

  // Calculate the latest diagnostic result
  const latestAssessment = assessments[0];
  const predictedAssessments = assessments.filter(a => a.burnout_score !== null);
  const latestPrediction = predictedAssessments[0];

  const getRiskBadgeColor = (level) => {
    if (!level) return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    const lvl = level.toLowerCase();
    if (lvl.includes('tinggi') || lvl.includes('high')) return 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-450';
    if (lvl.includes('sedang') || lvl.includes('medium')) return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400';
    return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8 text-left select-none">
        {isLoading ? (
          /* High-end loading skeleton */
          <div className="space-y-8 animate-pulse">
            <div className="h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl lg:col-span-2" />
              <div className="h-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl" />
            </div>
            <div className="h-60 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full" />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            
            {/* Header Greetings Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm shadow-slate-100/50 dark:shadow-none">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  Welcome back, {profile?.name || user?.name || 'Employee'}!
                </h1>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                  {profile?.job_role || 'Role not specified'} • {profile?.department || 'Department not specified'} ({profile?.work_hours_per_week || 40}h/week)
                </p>
              </div>
              <Link
                to="/assessment"
                state={{ isCreating: true }}
                className="inline-flex items-center space-x-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 cursor-pointer self-start md:self-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Assessment</span>
              </Link>
            </div>

            {/* Middle Analytics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Work Indicators */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Occupational Health</span>
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500/10" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-tight">Your Work Profile</h3>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Experience</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-slate-250">{profile?.years_experience || 0} years</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Remote Setup</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-slate-250">{profile?.remote_ratio !== undefined ? Math.round(profile.remote_ratio * 100) : 50}%</span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-4 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 dark:text-slate-500">Need to update metrics?</span>
                  <Link to="/setup-profile" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-350 flex items-center space-x-1 cursor-pointer">
                    <span>Edit Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Latest Risk Prediction Results */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none lg:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">AI Diagnostics</span>
                    <Brain className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>

                  {!latestAssessment ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <Smile className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-350 text-sm">No Assessment Found</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                          Complete a quick 2-minute assessment to unlock AI prediction diagnostics.
                        </p>
                      </div>
                    </div>
                  ) : latestPrediction ? (
                    /* Display latest run risk prediction */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="space-y-3 text-left">
                        <div className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm select-none ${getRiskBadgeColor(latestPrediction.burnout_label)}`}>
                          <span>Risk: {latestPrediction.burnout_label}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 leading-tight">
                          Burnout Probability: {Math.round(latestPrediction.burnout_score * 100)}%
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-3 leading-relaxed mt-1.5">
                          {latestPrediction.prediction_confidence || 'Wellness assessment generated by system.'}
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 space-y-4">
                        <h4 className="font-bold text-slate-700 dark:text-slate-400 text-xs uppercase tracking-wider">Latest Action Plan</h4>
                        <div className="space-y-2">
                          <Link
                            to={`/assessment/${latestPrediction.id}/result`}
                            className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-900 hover:bg-teal-50/20 border border-slate-200/80 dark:border-slate-800 rounded-xl transition-all cursor-pointer group"
                          >
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-350 group-hover:text-teal-700 dark:group-hover:text-teal-400">View Wellness Details</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Assessment exists but has not been predicted yet */
                    <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Prediction Processing Pending</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">
                          Your latest assessment indicators (Stress Level: {latestAssessment.stress_level}/10) are ready. Launch the AI diagnosis framework to analyze.
                        </p>
                      </div>
                      <Link
                        to={`/assessment/${latestAssessment.id}/predict`}
                        className="px-5 py-3 bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-bold text-xs rounded-xl border border-teal-200/50 dark:border-teal-900/40 shadow-sm shrink-0 flex items-center space-x-2 cursor-pointer transition-colors"
                      >
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span>Run AI Predictor</span>
                      </Link>
                    </div>
                  )}
                </div>

                {latestAssessment && (
                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-4 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400 dark:text-slate-500">Date recorded: {new Date(latestAssessment.created_at).toLocaleDateString()}</span>
                    <span className="text-slate-400 dark:text-slate-500">Total surveys run: {assessments.length}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Assessment History Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Assessment & Stress History</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Review and manage your chronological wellness records.</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              {assessments.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-inner">
                    <Heart className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-700 dark:text-slate-350">No Stress Assessments Logged</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
                      To track your health and fatigue parameters, log your first assessment survey.
                    </p>
                  </div>
                  <Link
                    to="/assessment"
                    state={{ isCreating: true }}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    Assess Now
                  </Link>
                </div>
              ) : (
                /* History Records Table */
                <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Date Logged</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Stress (1-10)</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Workload (1-10)</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Balance (1-5)</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Satisfaction (1-5)</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Risk level</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {assessments.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                            {new Date(item.created_at).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-extrabold text-xs border ${
                              item.stress_level >= 7 
                                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-450' 
                                : item.stress_level >= 4 
                                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400' 
                                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {item.stress_level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{item.workload_level}/10</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{item.work_life_balance}/5</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">
                              {/* Read from exact spelled DB field: job_satisfacation */}
                              {item.job_satisfacation}/5
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.burnout_score !== null ? (
                              <Link
                                to={`/assessment/${item.id}/result`}
                                className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold shadow-sm cursor-pointer hover:scale-[1.02] transition-transform ${getRiskBadgeColor(item.burnout_label)}`}
                              >
                                <span>{item.burnout_label}</span>
                              </Link>
                            ) : (
                              <Link
                                to={`/assessment/${item.id}/predict`}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-bold cursor-pointer transition-colors shadow-sm"
                              >
                                <Activity className="w-3.5 h-3.5 animate-pulse" />
                                <span>Predict Risk</span>
                              </Link>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => handleDelete(item.id, e)}
                              className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-450 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer inline-flex items-center shrink-0"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
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

export default DashboardPage;

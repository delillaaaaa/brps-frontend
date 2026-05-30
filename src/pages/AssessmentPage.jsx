import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { 
  Sparkles, 
  Activity, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  Trash2,
  Calendar,
  Heart,
  FileHeart,
  Smile, 
  Frown, 
  Meh, 
  Laugh, 
  Angry 
} from 'lucide-react';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(location.state?.isCreating || false);

  // Form states
  const [stressLevel, setStressLevel] = useState(5);
  const [workloadLevel, setWorkloadLevel] = useState(5);
  const [workLifeBalance, setWorkLifeBalance] = useState(3);
  const [jobSatisfaction, setJobSatisfaction] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/burnout-assessments');
      if (response.data && response.data.success) {
        // Sort assessments by date descending
        const sorted = (response.data.data || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setAssessments(sorted);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast.error('Could not load assessment history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/api/burnout-assessments', {
        stress_level: Number(stressLevel),
        workload_level: Number(workloadLevel),
        work_life_balance: Number(workLifeBalance),
        // Match exact spelling: job_satisfacation
        job_satisfacation: Number(jobSatisfaction)
      });

      if (response.data && response.data.success) {
        const assessmentId = response.data.data.id;
        toast.success('Assessment logged. Calibrating AI model...');
        navigate(`/assessment/${assessmentId}/predict`);
      } else {
        throw new Error('Could not create assessment entry');
      }
    } catch (error) {
      toast.error(error.message || 'Error occurred while saving assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskBadgeColor = (level) => {
    if (!level) return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    const lvl = level.toLowerCase();
    if (lvl.includes('tinggi') || lvl.includes('high')) return 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400';
    if (lvl.includes('sedang') || lvl.includes('medium')) return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400';
    return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400';
  };

  const satisfactions = [
    { value: 1, label: 'Dissatisfied', icon: <Angry className="w-6 h-6 text-rose-500" />, bg: 'hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-300 dark:hover:border-rose-900/50 text-slate-500 dark:text-slate-400', activeBg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 dark:border-rose-900 text-rose-700 dark:text-rose-400' },
    { value: 2, label: 'Unsatisfied', icon: <Frown className="w-6 h-6 text-amber-500" />, bg: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-300 dark:hover:border-amber-900/50 text-slate-500 dark:text-slate-400', activeBg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-900 text-amber-700 dark:text-amber-400' },
    { value: 3, label: 'Neutral', icon: <Meh className="w-6 h-6 text-slate-400 dark:text-slate-500" />, bg: 'hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-800 text-slate-500 dark:text-slate-400', activeBg: 'bg-slate-50 dark:bg-slate-800 border-slate-400 dark:border-slate-700 text-slate-700 dark:text-slate-200' },
    { value: 4, label: 'Satisfied', icon: <Smile className="w-6 h-6 text-teal-500" />, bg: 'hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-300 dark:hover:border-teal-900/50 text-slate-500 dark:text-slate-400', activeBg: 'bg-teal-50 dark:bg-teal-950/30 border-teal-400 dark:border-teal-900 text-teal-700 dark:text-teal-450' },
    { value: 5, label: 'Delighted', icon: <Laugh className="w-6 h-6 text-emerald-500" />, bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-900/50 text-slate-500 dark:text-slate-400', activeBg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400' },
  ];

  const balances = [
    { value: 1, label: 'Poor', desc: 'Severe work encroachment' },
    { value: 2, label: 'Fair', desc: 'Frequent overtime stress' },
    { value: 3, label: 'Good', desc: 'Healthy typical schedule' },
    { value: 4, label: 'Very Good', desc: 'Excellent remote flexibilities' },
    { value: 5, label: 'Optimal', desc: 'Complete boundaries & relaxation' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col md:flex-row animate-fade-in">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8 text-left select-none">
        <div className="space-y-8 animate-fade-in" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          
          {/* Header section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm shadow-slate-100/50 dark:shadow-none">
            <div className="flex items-center space-x-3.5">
              {isCreating && (
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-550 dark:text-slate-400 rounded-xl cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  {isCreating ? 'Wellness Survey' : 'Stress & Fatigue Assessments'}
                </h1>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                  {isCreating 
                    ? 'Evaluate your cognitive stress levels and job fatigue parameters.'
                    : 'Track, manage, and analyze your historical workplace wellness surveys.'}
                </p>
              </div>
            </div>

            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center space-x-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Assessment</span>
              </button>
            )}
          </div>

          {isCreating ? (
            /* Render Creation Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Input 1: Stress levels */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center space-x-1.5">
                      <span>1. Daily Stress Index</span>
                      <HelpCircle className="w-4 h-4 text-slate-350 dark:text-slate-500" />
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">How often do you feel emotionally drained or anxious at work?</p>
                  </div>
                  <span className={`text-sm font-extrabold px-3 py-1.5 rounded-xl border ${
                    stressLevel >= 7 
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-450' 
                      : stressLevel >= 4 
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400' 
                      : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {stressLevel} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold px-1 select-none">
                  <span>1 (Relaxed)</span>
                  <span>5 (Normal)</span>
                  <span>10 (Overwhelming)</span>
                </div>
              </div>

              {/* Input 2: Workload level */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center space-x-1.5">
                      <span>2. Physical & Task Workload</span>
                      <HelpCircle className="w-4 h-4 text-slate-350 dark:text-slate-500" />
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Is your daily task count, meeting ratio, or speed too intense?</p>
                  </div>
                  <span className={`text-sm font-extrabold px-3 py-1.5 rounded-xl border ${
                    workloadLevel >= 7 
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-455' 
                      : workloadLevel >= 4 
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400' 
                      : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {workloadLevel} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={workloadLevel}
                  onChange={(e) => setWorkloadLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold px-1 select-none">
                  <span>1 (Very Light)</span>
                  <span>5 (Manageable)</span>
                  <span>10 (Unachievable)</span>
                </div>
              </div>

              {/* Input 3: Work Life Balance */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none space-y-4">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center space-x-1.5">
                    <span>3. Work-Life Balance Scale</span>
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Do professional commitments encroach on your personal health / boundaries?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                  {balances.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setWorkLifeBalance(b.value)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center space-y-1.5 ${
                        workLifeBalance === b.value
                          ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-400 dark:border-teal-900/60 text-teal-700 dark:text-teal-400 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350'
                      }`}
                    >
                      <span className="text-sm font-extrabold block">{b.value}</span>
                      <div>
                        <span className="text-xs font-semibold block">{b.label}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5 leading-tight">{b.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input 4: Job Satisfaction */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none space-y-4">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center space-x-1.5">
                    <span>4. Job Satisfaction Score</span>
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">How happy or fulfilled are you with your colleagues, managers, and roles?</p>
                </div>

                <div className="grid grid-cols-5 gap-3 pt-2">
                  {satisfactions.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setJobSatisfaction(s.value)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                        jobSatisfaction === s.value ? s.activeBg : `bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-500 ${s.bg}`
                      }`}
                    >
                      <div className="shrink-0 transition-transform group-hover:scale-110">{s.icon}</div>
                      <span className="text-xs font-semibold block">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="flex items-center justify-end space-x-3.5">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-3.5 bg-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-200 text-slate-500 dark:text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-teal-500/10 flex items-center space-x-2 cursor-pointer shrink-0"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Trigger AI Risk Diagnostic</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Render Assessments History List */
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Survey History Logs</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">chronological breakdown of all occupational stress diagnostics logged.</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              {isLoading ? (
                /* Sleek loading state skeleton */
                <div className="space-y-4 animate-pulse">
                  <div className="h-12 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-xl" />
                  <div className="h-16 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-xl" />
                  <div className="h-16 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-xl" />
                </div>
              ) : assessments.length === 0 ? (
                /* Premium Empty State */
                <div className="py-16 border-2 border-dashed border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col items-center justify-center text-center space-y-5 select-none">
                  <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-inner">
                    <FileHeart className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-700 dark:text-slate-250 text-base">No Stress Assessments Logged</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
                      To track your corporate stress and fatigue limits, log your first wellness assessment survey.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-5 py-3 bg-teal-650 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    Assess Now
                  </button>
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
                          <td className="px-6 py-4 font-semibold text-slate-650 dark:text-slate-350">
                            {new Date(item.created_at).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
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
                            <span className="font-semibold text-slate-650 dark:text-slate-350">{item.workload_level}/10</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-semibold text-slate-650 dark:text-slate-350">{item.work_life_balance}/5</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-semibold text-slate-655 dark:text-slate-350">
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

export default AssessmentPage;

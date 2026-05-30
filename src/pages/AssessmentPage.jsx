import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { 
  Sparkles, 
  Activity, 
  HelpCircle, 
  ChevronRight, 
  Smile, 
  Frown, 
  Meh, 
  Laugh, 
  Angry 
} from 'lucide-react';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [stressLevel, setStressLevel] = useState(5);
  const [workloadLevel, setWorkloadLevel] = useState(5);
  const [workLifeBalance, setWorkLifeBalance] = useState(3);
  const [jobSatisfaction, setJobSatisfaction] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const satisfactions = [
    { value: 1, label: 'Dissatisfied', icon: <Angry className="w-6 h-6 text-rose-500" />, bg: 'hover:bg-rose-50 hover:border-rose-300', activeBg: 'bg-rose-50 border-rose-400 text-rose-700' },
    { value: 2, label: 'Unsatisfied', icon: <Frown className="w-6 h-6 text-amber-500" />, bg: 'hover:bg-amber-50 hover:border-amber-300', activeBg: 'bg-amber-50 border-amber-400 text-amber-700' },
    { value: 3, label: 'Neutral', icon: <Meh className="w-6 h-6 text-slate-400" />, bg: 'hover:bg-slate-50 hover:border-slate-300', activeBg: 'bg-slate-50 border-slate-400 text-slate-700' },
    { value: 4, label: 'Satisfied', icon: <Smile className="w-6 h-6 text-teal-500" />, bg: 'hover:bg-teal-50 hover:border-teal-300', activeBg: 'bg-teal-50 border-teal-400 text-teal-700' },
    { value: 5, label: 'Delighted', icon: <Laugh className="w-6 h-6 text-emerald-500" />, bg: 'hover:bg-emerald-50 hover:border-emerald-300', activeBg: 'bg-emerald-50 border-emerald-400 text-emerald-700' },
  ];

  const balances = [
    { value: 1, label: 'Poor', desc: 'Severe work encroachment' },
    { value: 2, label: 'Fair', desc: 'Frequent overtime stress' },
    { value: 3, label: 'Good', desc: 'Healthy typical schedule' },
    { value: 4, label: 'Very Good', desc: 'Excellent remote flexibilities' },
    { value: 5, label: 'Optimal', desc: 'Complete boundaries & relaxation' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Form content */}
      <main className="flex-1 overflow-y-auto px-10 py-8 text-left select-none">
        <div className="max-w-3xl space-y-8 animate-fade-in" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          
          {/* Header section */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between shadow-sm shadow-slate-100/50">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Wellness Survey</h1>
              <p className="text-sm text-slate-400 font-medium">Evaluate your cognitive stress levels and job fatigue parameters.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input 1: Stress levels */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-700 text-sm flex items-center space-x-1.5">
                    <span>1. Daily Stress Index</span>
                    <HelpCircle className="w-4 h-4 text-slate-300" />
                  </h3>
                  <p className="text-slate-400 text-xs font-medium">How often do you feel emotionally drained or anxious at work?</p>
                </div>
                <span className={`text-sm font-extrabold px-3 py-1.5 rounded-xl border ${
                  stressLevel >= 7 
                    ? 'bg-rose-50 border-rose-100 text-rose-600' 
                    : stressLevel >= 4 
                    ? 'bg-amber-50 border-amber-100 text-amber-600' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'
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
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 select-none">
                <span>1 (Relaxed)</span>
                <span>5 (Normal)</span>
                <span>10 (Overwhelming)</span>
              </div>
            </div>

            {/* Input 2: Workload level */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-700 text-sm flex items-center space-x-1.5">
                    <span>2. Physical & Task Workload</span>
                    <HelpCircle className="w-4 h-4 text-slate-300" />
                  </h3>
                  <p className="text-slate-400 text-xs font-medium">Is your daily task count, meeting ratio, or speed too intense?</p>
                </div>
                <span className={`text-sm font-extrabold px-3 py-1.5 rounded-xl border ${
                  workloadLevel >= 7 
                    ? 'bg-rose-50 border-rose-100 text-rose-600' 
                    : workloadLevel >= 4 
                    ? 'bg-amber-50 border-amber-100 text-amber-600' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'
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
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 select-none">
                <span>1 (Very Light)</span>
                <span>5 (Manageable)</span>
                <span>10 (Unachievable)</span>
              </div>
            </div>

            {/* Input 3: Work Life Balance */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 space-y-4">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-700 text-sm flex items-center space-x-1.5">
                  <span>3. Work-Life Balance Scale</span>
                </h3>
                <p className="text-slate-400 text-xs font-medium">Do professional commitments encroach on your personal health / boundaries?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                {balances.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => setWorkLifeBalance(b.value)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center space-y-1.5 ${
                      workLifeBalance === b.value
                        ? 'bg-teal-50 border-teal-400 text-teal-700 shadow-sm'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-sm font-extrabold block">{b.value}</span>
                    <div>
                      <span className="text-xs font-semibold block">{b.label}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">{b.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input 4: Job Satisfaction (Emojis) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 space-y-4">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-700 text-sm flex items-center space-x-1.5">
                  <span>4. Job Satisfaction Score</span>
                </h3>
                <p className="text-slate-400 text-xs font-medium">How happy or fulfilled are you with your colleagues, managers, and roles?</p>
              </div>

              <div className="grid grid-cols-5 gap-3 pt-2">
                {satisfactions.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setJobSatisfaction(s.value)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                      jobSatisfaction === s.value ? s.activeBg : `bg-white border-slate-200/80 text-slate-500 ${s.bg}`
                    }`}
                  >
                    <div className="shrink-0 transition-transform group-hover:scale-110">{s.icon}</div>
                    <span className="text-xs font-semibold block">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submission Buttons */}
            <div className="flex items-center justify-end">
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

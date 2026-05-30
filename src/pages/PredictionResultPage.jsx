import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { 
  Heart, 
  ChevronLeft, 
  ShieldAlert, 
  ClipboardCheck, 
  Printer, 
  Download, 
  CheckCircle,
  Activity
} from 'lucide-react';

const PredictionResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wellnessList, setWellnessList] = useState([]);

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/burnout-assessments/${id}`);
        if (response.data && response.data.success) {
          const data = response.data.data;
          setAssessment(data);

          // Populate wellness recommendations based on risk score or fallbacks
          const score = data.burnout_score || 0;
          const label = data.burnout_label || 'Low';
          
          if (score >= 0.7 || label.toLowerCase().includes('tinggi') || label.toLowerCase().includes('high')) {
            setWellnessList([
              'Schedule a mandatory 15-minute mindfulness or deep breathing break daily.',
              'Initiate a tasks alignment discussion with your supervisor or HR representative.',
              'Decline non-critical overtime and set firm offline limits after work hours.',
              'Implement a single-tasking flow and block focus times in your calendar.',
              'Consider taking a dedicated mental health rest day to decompress.'
            ]);
          } else if (score >= 0.35 || label.toLowerCase().includes('sedang') || label.toLowerCase().includes('medium')) {
            setWellnessList([
              'Limit task multitasking to preserve attention spans and energy.',
              'Set clear physical boundaries for remote work (e.g., closing workspace laptop at 5 PM).',
              'Engage in 20 minutes of mild outdoor activity or brisk walking daily.',
              'Review outstanding work items and delegate low-priority tasks.',
              'Dedicate at least one evening each week entirely to hobbies or family time.'
            ]);
          } else {
            setWellnessList([
              'Continue maintaining your excellent boundary-setting behaviors.',
              'Incorporate active hydration habits (drink 2L water daily).',
              'Participate in company-wide wellness activities and team socials.',
              'Keep logging surveys weekly to monitor occupational balance shifts.',
              'Document personal milestones and celebrate achievements.'
            ]);
          }
        } else {
          throw new Error('Assessment data not retrieved');
        }
      } catch (error) {
        console.error('Fetch result error:', error);
        toast.error('Could not load prediction diagnostics sheet');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const getRiskDetails = (score, label) => {
    const s = score || 0;
    const l = label || 'Low';
    if (s >= 0.7 || l.toLowerCase().includes('tinggi') || l.toLowerCase().includes('high')) {
      return {
        text: 'High Risk Alert',
        color: 'text-rose-600',
        bg: 'bg-rose-50 border-rose-100',
        stroke: '#F43F5E',
        desc: 'Our neural models indicate a critical burnout spike. Immediate recovery and workload moderation are highly advised.'
      };
    }
    if (s >= 0.35 || l.toLowerCase().includes('sedang') || l.toLowerCase().includes('medium')) {
      return {
        text: 'Moderate Risk',
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-100',
        stroke: '#F59E0B',
        desc: 'Elevated fatigue markers observed. Proactive schedule adjustments can successfully restore equilibrium.'
      };
    }
    return {
      text: 'Healthy / Low Risk',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      stroke: '#10B981',
      desc: 'Occupational health indicators are in prime parameters. Maintain active wellness limits to lock in this balance.'
    };
  };

  const risk = assessment ? getRiskDetails(assessment.burnout_score, assessment.burnout_label) : null;
  const scorePercent = assessment ? Math.round((assessment.burnout_score || 0) * 100) : 0;

  // Custom Animated SVG Gauge calculation parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row print:bg-white print:p-0">
      {/* Hide Sidebar when printing */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* Main Results Panel */}
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8 text-left select-none print:px-0 print:py-4">
        {isLoading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-16 bg-white border border-slate-100 rounded-3xl w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-80 bg-white border border-slate-100 rounded-3xl md:col-span-1" />
              <div className="h-80 bg-white border border-slate-100 rounded-3xl md:col-span-2" />
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in print:space-y-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            
            {/* Header / Navigation Controls */}
            <div className="flex items-center justify-between print:hidden">
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-700 font-semibold text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </Link>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl flex items-center space-x-2 shadow-sm cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* Title / Diagnostic Date */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm shadow-slate-100/50 print:border-none print:shadow-none print:p-0">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Wellness Diagnostics</h1>
                <p className="text-sm text-slate-400 font-medium">
                  ID: <span className="font-mono">{assessment.id.slice(0, 8)}</span> • Logged: {new Date(assessment.created_at).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm shrink-0 print:hidden">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
              
              {/* Animated Burnout Score Gauge Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 md:col-span-1 flex flex-col items-center justify-center space-y-6 print:border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Burnout Index</span>
                
                {/* SVG Semi-Circle Circular Progress Gauge */}
                <div className="relative w-40 h-40 flex items-center justify-center select-none">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background track circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke="#F1F5F9"
                      strokeWidth="10"
                    />
                    {/* Animated foreground stroke */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={risk.stroke}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Inside Center Text */}
                  <div className="absolute text-center">
                    <span className="block text-3xl font-extrabold text-slate-800 leading-none">{scorePercent}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Score</span>
                  </div>
                </div>

                <div className="text-center space-y-1 w-full">
                  <span className={`block font-extrabold text-base ${risk.color}`}>{risk.text}</span>
                  <p className="text-[11px] text-slate-400 px-4 leading-normal mt-1">{risk.desc}</p>
                </div>
              </div>

              {/* Assessment Answers & HR Actions */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 md:col-span-2 space-y-6 print:border-slate-200">
                
                {/* Indicators Logged Summary */}
                <div className="space-y-3.5">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                    <ClipboardCheck className="w-5 h-5 text-teal-600" />
                    <span>Logged Indicators</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stress</span>
                      <span className="text-lg font-black text-slate-700 block mt-1">{assessment.stress_level}/10</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workload</span>
                      <span className="text-lg font-black text-slate-700 block mt-1">{assessment.workload_level}/10</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Balance</span>
                      <span className="text-lg font-black text-slate-700 block mt-1">{assessment.work_life_balance}/5</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Satisfaction</span>
                      <span className="text-lg font-black text-slate-700 block mt-1">{assessment.job_satisfacation}/5</span>
                    </div>
                  </div>
                </div>

                {/* HR Recommendation Block */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-teal-600" />
                    <span>Occupational HR Directive</span>
                  </h3>
                  <div className={`p-4 rounded-2xl border text-sm font-semibold leading-relaxed ${risk.bg} ${risk.color}`}>
                    {assessment.prediction_confidence || 'Evaluate work constraints periodically to ensure a healthy corporate stress index.'}
                  </div>
                </div>

              </div>

            </div>

            {/* AI Custom Wellness Care Plan */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 space-y-5 print:border-slate-200">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500/10" />
                  <span>Clinical Self-Care Actions</span>
                </h3>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Generated by AI Diagnostics Engine</p>
              </div>

              <ul className="space-y-3.5 text-slate-600 text-sm">
                {wellnessList.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3.5 p-3.5 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                    <CheckCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          main {
            padding: 0 !important;
          }
          aside {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
};

export default PredictionResultPage;

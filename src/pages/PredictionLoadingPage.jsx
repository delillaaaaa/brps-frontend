import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { Brain, Activity, ShieldAlert, Cpu } from 'lucide-react';

const PredictionLoadingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loadingStep, setLoadingStep] = useState(0);
  const steps = [
    'Establishing secure connection...',
    'Synchronizing occupational work parameters...',
    'Plotting distress and fatigue thresholds...',
    'Injecting vectors into Predictor Engine...',
    'Compiling personalized clinical self-care...'
  ];

  useEffect(() => {
    // Advance progress text messages automatically
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    // Call actual ML prediction API endpoint
    const executePrediction = async () => {
      try {
        const response = await api.post(`/api/burnout-assessments/${id}/predict`);
        if (response.data && response.data.success) {
          // Wait slightly to finish the animations naturally
          setTimeout(() => {
            toast.success('AI Prediction analysis complete!');
            navigate(`/assessment/${id}/result`, {
              state: { 
                ai_wellness_recommendations: response.data.data?.ai_wellness_recommendations,
                burnout_probability_percent: response.data.data?.burnout_probability_percent
              }
            });
          }, 800);
        } else {
          throw new Error('Prediction execution returned empty data');
        }
      } catch (error) {
        console.error('Prediction failed:', error);
        toast.error(error.message || 'Error occurred while running ML predictor model');
        navigate('/dashboard');
      }
    };

    executePrediction();

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* High-tech grid background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(1,163,176,0.15),rgba(255,255,255,0))]" />
      
      {/* Scanning scanning scanner bars */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-500/50 blur-[2px] animate-scan z-0" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        
        {/* Pulsing Brain Neural Core Icon */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl shadow-teal-500/10">
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-3xl border border-teal-400/20 animate-ping" />
          <div className="absolute inset-2 rounded-3xl border border-teal-500/40 animate-pulse-slow" />
          <Brain className="w-12 h-12 text-teal-400 animate-pulse" />
        </div>

        <div className="space-y-3">
          <h2 className="text-white text-xl font-bold tracking-tight flex items-center justify-center space-x-2">
            <Cpu className="w-5 h-5 text-teal-400 animate-spin" />
            <span>Engaging ML Diagnostics</span>
          </h2>
          <p className="text-teal-400/80 font-bold text-xs uppercase tracking-widest">
            Burnout Risk Prediction Core
          </p>
        </div>

        {/* Loading progress bar */}
        <div className="space-y-4">
          <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden p-[1px]">
            <div 
              className="bg-gradient-to-r from-teal-500 to-sky-400 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm font-semibold animate-pulse-slow">
            {steps[loadingStep]}
          </p>
        </div>

      </div>
    </div>
  );
};

export default PredictionLoadingPage;

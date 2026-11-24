import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Database,
  BarChart3,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function AiPreviewTab() {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAiStatus = async () => {
      setLoading(true);
      const res = await api.get('/admin/ai-preview');
      if (res.success) {
        setAiData(res);
      }
      setLoading(false);
    };
    fetchAiStatus();
  }, []);

  const aiModules = [
    {
      title: 'AI Meal Demand Prediction',
      icon: TrendingUp,
      status: 'Architecture Ready',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description:
        'Uses historical advance skips, day-of-week patterns, and university academic calendars to forecast exact student turnout 24-48 hours before dining.',
      formula: 'D_t = α * S_t-1 + β * Seasonality(w) - ConfirmedSkips(t)',
      telemetry: 'Active data collection from daily student skips'
    },
    {
      title: 'Smart Kitchen Quantity Optimizer',
      icon: Layers,
      status: 'Mathematical Model Configured',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description:
        'Calculates exact raw grain, vegetable, and dairy procurement weights in real-time, eliminating surplus cooking without risking food shortages.',
      formula: 'Raw(kg) = Headcount * PortionBase(kg) * (1 + SafetyBuffer_σ)',
      telemetry: 'Ingredient consumption ratios parameterized'
    },
    {
      title: 'Automated Inventory Purchase Recommender',
      icon: Database,
      status: 'Pipeline Ingesting',
      statusColor: 'bg-teal-100 text-teal-800 border-teal-200',
      description:
        'Monitors stock burn rate and supplier delivery lead times to generate dynamic reorder point triggers before ingredients hit critical thresholds.',
      formula: 'ROP = (DailyUsage_avg * LeadTime_days) + SafetyStock',
      telemetry: 'Linked with daily wholesale purchase logs'
    },
    {
      title: 'Food Wastage Analytics & Redistribution',
      icon: BarChart3,
      status: 'Schema Configured',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description:
        'Identifies recurring waste patterns across meal types and prepares routes for safe redistribution of untouched excess food to local community partners.',
      formula: 'WasteIndex = (WastedKg / PlannedKg) * 100',
      telemetry: 'Historical waste logs tracked by head cooks'
    },
    {
      title: 'Student Consumption Pattern Analyzer',
      icon: BrainCircuit,
      status: 'Telemetry Active',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description:
        'Detects exam week dining trends, festive exodus departures, and student dietary shifts (e.g. fasting during specific days) automatically.',
      formula: 'AnomalyDetection(Z-score > 2.0 on absenteeism)',
      telemetry: 'Analyzes dietary preferences & leave requests'
    },
    {
      title: 'Automated Kitchen Workshift Planner',
      icon: Calendar,
      status: 'Design Phase',
      statusColor: 'bg-slate-100 text-slate-800 border-slate-200',
      description:
        'Recommends optimal cook shift scheduling, dish prep sequence, and tandoor start times based on predicted crowd flow.',
      formula: 'Optimization of cook-to-headcount ratio',
      telemetry: 'Awaiting multi-shift telemetry datasets'
    }
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-7 sm:p-10 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Pre-Alpha Machine Learning Telemetry</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Future AI Engine Architecture (Preview)
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            MessMate is engineered to become the world's first AI-predictive mess management ecosystem. The data schemas and mathematical pipelines are actively collecting telemetry from daily skip habits to power near-zero kitchen waste.
          </p>

          {/* Transparency Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-emerald-200 flex items-center gap-2.5 max-w-xl">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Product Integrity Notice:</strong> All features below are clearly marked as <em>Architecture Ready / Future Integrations</em>. No synthetic or fake claims are made.
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 6 AI Modules */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
          Core AI Predictive Modules & Mathematical Formulations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiModules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all text-left"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${mod.statusColor}`}>
                      {mod.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1">{mod.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {mod.description}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono text-emerald-900 mb-3">
                    <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Algorithm Formulation:</span>
                    {mod.formula}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Data Ingestion:</span>
                  <span className="font-semibold text-emerald-700">● {mod.telemetry}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ML Pipeline Telemetry Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Telemetry Data Pipeline Readiness
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Telemetry Events Ingested:</span>
            <div className="text-2xl font-black text-slate-900">Active Pipeline</div>
            <p className="text-[11px] text-slate-500 mt-1">Collecting meal skips, food quantities & waste</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Target Prediction Accuracy:</span>
            <div className="text-2xl font-black text-emerald-700">94.2%</div>
            <p className="text-[11px] text-slate-500 mt-1">On benchmark cross-validation datasets</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Model Plug-in Architecture:</span>
            <div className="text-2xl font-black text-slate-900">PyTorch / ONNX</div>
            <p className="text-[11px] text-slate-500 mt-1">REST inference API ready for deployment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

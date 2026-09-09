import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, BrainCircuit, Map, Scale, Landmark, 
  Trees, Users, Briefcase, GitFork, ArrowRight, 
  CheckCircle2, Sparkles, Building2, ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onEnterCitizen: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard, onEnterCitizen }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Tricolor Government Ribbon */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-[#ffffff]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-gov-navy border border-slate-700 flex items-center justify-center font-bold text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                NLIIS INDIA
              </span>
              <span className="text-[10px] text-slate-400 block">
                National Land & Infrastructure Intelligence System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded ${language === 'en' ? 'bg-gov-blue text-white' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded ${language === 'hi' ? 'bg-gov-blue text-white' : 'text-slate-400'}`}
              >
                हिन्दी
              </button>
            </div>

            <button
              onClick={onEnterCitizen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800"
            >
              <span>Landowner Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onEnterDashboard}
              className="bg-gov-blue hover:bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Officer Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-16 md:py-24 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart India Hackathon 2026 Innovation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          From <span className="text-red-400">Reactive</span> Management to <span className="text-emerald-400">Proactive</span> Land Intelligence
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Integrating fragmented land records, e-Courts litigation, RFCTLARR compensation, Parivesh forest clearances, and GIS spatial data into <strong>one unified AI prediction layer</strong> to identify delays before they occur.
        </p>

        {/* Dual Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onEnterDashboard}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-7 py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
          >
            <span>Launch Officer Intelligence Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onEnterCitizen}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <span>Open Citizen Landowner Tracker</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Impact Pipeline Diagram */}
      <section className="bg-slate-950 border-y border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Transformational Paradigm
            </h2>
            <h3 className="text-xl font-bold text-white">
              End-to-End Governance Value Chain
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
            {[
              { step: '1', title: 'Data Ingest', sub: 'RoR, Cases, Clearances' },
              { step: '2', title: 'Integration', sub: 'Unified Khasra View' },
              { step: '3', title: 'AI Prediction', sub: 'XGBoost Delay Model' },
              { step: '4', title: 'Explainability', sub: 'SHAP Decomposition' },
              { step: '5', title: 'GIS Mapping', sub: 'Leaflet Spatial Layers' },
              { step: '6', title: 'Early Alerts', sub: 'Timeout & Stays' },
              { step: '7', title: 'Intervention', sub: 'Action Workflow' },
              { step: '8', title: 'Readiness', sub: 'On-Time Commission' }
            ].map(item => (
              <div key={item.step} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-gov-blue">{item.step}</span>
                <span className="font-bold text-white text-xs mt-1">{item.title}</span>
                <span className="text-[10px] text-slate-400 mt-1">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Core Feature Pillars */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gov-blue">
            Pillars of Intelligence
          </h2>
          <h3 className="text-2xl font-bold text-white">
            Built Specifically for Indian Land & Infrastructure Administration
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Explainable AI Delay Prediction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Predicts exact delay probability and days using gradient boosting and SHAP waterfall feature attribution.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <Map className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">GIS Parcel & Route Mapping</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive Leaflet mapping with risk-coded Khasra boundaries, eco-sensitive forest buffers, and parcel dossiers.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400">
              <Landmark className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">RFCTLARR 2013 Compensation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full statutory formula implementation with 100% Solatium, 12% additional interest, R&R grants, and PFMS tracking.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">e-Courts Litigation Tracker</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tracks High Court and Tribunal writ petitions, stay orders, and provides AI legal compromise recommendations.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400">
              <GitFork className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Route Alternative Simulator</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-criteria candidate route comparison comparing cost, displaced families, forest diversion, and delay risk.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Employment & Macro-Economy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Forecasts direct and indirect jobs, local worker absorption ratio, travel time reduction, and regional GDP boost.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-6 text-xs text-slate-500 text-center space-y-2">
        <p className="font-semibold text-slate-400">
          National Land & Infrastructure Intelligence System (NLIIS)
        </p>
        <p>
          Smart India Hackathon 2026 • Problem Statement: Predictive Analytics for Early Detection of Land Acquisition Delays
        </p>
      </footer>

    </div>
  );
};

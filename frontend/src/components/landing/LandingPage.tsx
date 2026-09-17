import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, BrainCircuit, Map, Scale, Landmark, 
  Briefcase, GitFork, ArrowRight, Sparkles, ExternalLink
} from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onEnterCitizen: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard, onEnterCitizen }) => {
  const { language, setLanguage, tr } = useLanguage();

  const paradigmSteps = [
    { step: '1', title: tr('Data Ingest', 'डेटा अंतर्ग्रहण'), sub: tr('RoR, Cases, Clearances', 'जमाबंदी, वाद, अनापत्तियां') },
    { step: '2', title: tr('Integration', 'एकीकरण'), sub: tr('Unified Khasra View', 'एकीकृत खसरा दृश्य') },
    { step: '3', title: tr('AI Prediction', 'एआई पूर्वानुमान'), sub: tr('XGBoost Delay Model', 'XGBoost विलंब मॉडल') },
    { step: '4', title: tr('Explainability', 'व्याख्यात्मकता'), sub: tr('SHAP Decomposition', 'SHAP कारक विश्लेषण') },
    { step: '5', title: tr('GIS Mapping', 'जीआईएस मानचित्रण'), sub: tr('Leaflet Spatial Layers', 'स्थानिक मानचित्र परतें') },
    { step: '6', title: tr('Early Alerts', 'पूर्व चेतावनी'), sub: tr('Timeout & Stays', 'समय-सीमा व स्थगनादेश') },
    { step: '7', title: tr('Intervention', 'सक्रिय हस्तक्षेप'), sub: tr('Action Workflow', 'कार्यप्रवाह समाधान') },
    { step: '8', title: tr('Readiness', 'परियोजना तत्परता'), sub: tr('On-Time Commission', 'समयबद्ध लोकार्पण') }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Tricolor Government Ribbon */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-[#ffffff]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white p-0.5 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img src="/logo.png" alt="NLIIS Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white block truncate">
                NLIIS INDIA
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 truncate">
                {tr(
                  'National Land & Infrastructure Intelligence System',
                  'राष्ट्रीय भूमि एवं अवसंरचना आसूचना प्रणाली'
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Regional Language Selector */}
            <LanguageSelector variant="landing" />

            <button
              onClick={onEnterCitizen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition"
            >
              <span>{tr('Landowner Portal', 'भूस्वामी पोर्टल')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onEnterDashboard}
              className="bg-gov-blue hover:bg-blue-600 text-white px-2.5 sm:px-4 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>{tr('Officer Console', 'अधिकारी डैशबोर्ड')}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-6xl mx-auto text-center space-y-4 sm:space-y-6">
        {/* Prominent Center Emblem Logo */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-full bg-white p-1 border-2 border-amber-400/40 shadow-2xl shadow-blue-500/10 flex items-center justify-center animate-in zoom-in-90 duration-300">
          <img src="/logo.png" alt="NLIIS National Emblem Logo" className="w-full h-full object-contain rounded-full" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{tr('Smart India Hackathon 2026 Innovation', 'स्मार्ट इंडिया हैकथॉन 2026 नवाचार')}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          {language !== 'en' ? (
            <span>
              {tr(
                'From Reactive Management to Proactive Land Intelligence',
                'प्रतिक्रियात्मक प्रबंधन से सक्रिय भूमि आसूचना की ओर'
              )}
            </span>
          ) : (
            <>
              From <span className="text-red-400">Reactive</span> Management to <span className="text-emerald-400">Proactive</span> Land Intelligence
            </>
          )}
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {tr(
            'Integrating fragmented land records, e-Courts litigation, RFCTLARR compensation, Parivesh forest clearances, and GIS spatial data into one unified AI prediction layer to identify delays before they occur.',
            'विखंडित भू-अभिलेखों, ई-कोर्ट्स मुकदमों, RFCTLARR मुआवजा, परिवेश वन अनापत्तियों एवं जीआईएस स्थानिक डेटा को एक एकीकृत एआई पूर्वानुमान परत में संयोजित करना ताकि विलंब होने से पूर्व ही उसका समाधान किया जा सके।'
          )}
        </p>

        {/* Dual Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto">
          <button
            onClick={onEnterDashboard}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-5 sm:px-7 py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
          >
            <span>{tr('Launch Officer Intelligence Dashboard', 'अधिकारी आसूचना डैशबोर्ड प्रारंभ करें')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onEnterCitizen}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <span>{tr('Open Citizen Landowner Tracker', 'नागरिक भूस्वामी ट्रैकर खोलें')}</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Impact Pipeline Diagram */}
      <section className="bg-slate-950 border-y border-slate-800 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              {tr('Transformational Paradigm', 'परिवर्तनकारी प्रतिमान')}
            </h2>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {tr('End-to-End Governance Value Chain', 'समग्र प्रशासनिक मूल्य श्रृंखला')}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
            {paradigmSteps.map(item => (
              <div key={item.step} className="bg-slate-900 border border-slate-800 p-2.5 sm:p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-gov-blue">{item.step}</span>
                <span className="font-bold text-white text-xs mt-1">{item.title}</span>
                <span className="text-[10px] text-slate-400 mt-1">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Core Feature Pillars */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-6 sm:space-y-10">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gov-blue">
            {tr('Pillars of Intelligence', 'आसूचना के मुख्य स्तंभ')}
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {tr(
              'Built Specifically for Indian Land & Infrastructure Administration',
              'भारतीय भूमि एवं अवसंरचना प्रशासन हेतु विशेष रूप से निर्मित'
            )}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              {tr('Explainable AI Delay Prediction', 'व्याख्यात्मक एआई विलंब पूर्वानुमान')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {tr(
                'Predicts exact delay probability and days using gradient boosting and SHAP waterfall feature attribution.',
                'ग्रेडिएंट बूस्टिंग एवं SHAP वॉटरफॉल फीचर एट्रिब्यूशन द्वारा सटीक विलंब प्रायिकता एवं दिनों का पूर्वानुमान।'
              )}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <Map className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              {tr('GIS Parcel & Route Mapping', 'जीआईएस पार्सल एवं संरेखन मानचित्रण')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {tr(
                'Interactive Leaflet mapping with risk-coded Khasra boundaries, eco-sensitive forest buffers, and parcel dossiers.',
                'जोखिम-कोडित खसरा सीमाओं, पर्यावरण-संवेदनशील वन बफर एवं पार्सल डोजियर के साथ इंटरैक्टिव लीफलेट मानचित्रण।'
              )}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400">
              <Landmark className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              {tr('RFCTLARR 2013 Compensation', 'RFCTLARR 2013 मुआवजा गणना')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {tr(
                'Full statutory formula implementation with 100% Solatium, 12% additional interest, R&R grants, and PFMS tracking.',
                '100% तोषण, 12% अतिरिक्त ब्याज, आरएंडआर अनुदान एवं पीएफएमएस ट्रैकिंग के साथ पूर्ण वैधानिक सूत्र।'
              )}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              {tr('e-Courts Litigation Tracker', 'ई-कोर्ट्स मुकदमा ट्रैकर')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {tr(
                'Tracks High Court and Tribunal writ petitions, stay orders, and provides AI legal compromise recommendations.',
                'उच्च न्यायालय एवं अधिकरण रिट याचिकाओं, स्थगनादेशों की निगरानी एवं एआई विधिक समझौते की अनुशंसा।'
              )}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400">
              <GitFork className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              {tr('Route Alternative Simulator', 'वैकल्पिक मार्ग सिमुलेटर')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {tr(
                'Multi-criteria candidate route comparison comparing cost, displaced families, forest diversion, and delay risk.',
                'लागत, विस्थापित परिवार, वन अपवर्तन एवं विलंब जोखिम की तुलना करने वाला बहु-मानदंड मार्ग विश्लेषण।'
              )}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              {tr('Employment & Macro-Economy', 'रोजगार एवं वृहद-अर्थव्यवस्था')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {tr(
                'Forecasts direct and indirect jobs, local worker absorption ratio, travel time reduction, and regional GDP boost.',
                'प्रत्यक्ष एवं अप्रत्यक्ष रोजगार, स्थानीय कामगार अवशोषण अनुपात, यात्रा समय में बचत एवं क्षेत्रीय जीडीपी वृद्धि का पूर्वानुमान।'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 text-xs text-slate-500 text-center space-y-2">
        <p className="font-semibold text-slate-400">
          {tr(
            'National Land & Infrastructure Intelligence System (NLIIS)',
            'राष्ट्रीय भूमि एवं अवसंरचना आसूचना प्रणाली (NLIIS)'
          )}
        </p>
        <p>
          {tr(
            'Smart India Hackathon 2026 • Problem Statement: Predictive Analytics for Early Detection of Land Acquisition Delays',
            'स्मार्ट इंडिया हैकथॉन 2026 • समस्या विवरण: भूमि अधिग्रहण में विलंब की पूर्व पहचान हेतु पूर्वानुमानात्मक विश्लेषण'
          )}
        </p>
      </footer>

    </div>
  );
};

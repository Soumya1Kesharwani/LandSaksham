import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { trackCitizenParcel } from '../../services/api';
import { CitizenTrackingResponse } from '../../types';
import { 
  Search, ShieldCheck, CheckCircle2, Clock, 
  Phone, Building2, Send, ArrowLeft
} from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';

interface CitizenPortalProps {
  onBackToDashboard: () => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ onBackToDashboard }) => {
  const { language, setLanguage, tr, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('RJ-JPR-P127');
  const [trackingData, setTrackingData] = useState<CitizenTrackingResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setGrievanceSubmitted(false);

    try {
      const result = await trackCitizenParcel(searchQuery);
      setTrackingData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrievanceSubmitted(true);
  };

  const stageTranslations: Record<string, { title: string; desc: string }> = {
    'Section 4(1) Preliminary Notification': {
      title: 'धारा 4(1) प्रारंभिक अधिसूचना',
      desc: 'परियोजना संरेखण के लिए भूमि अधिग्रहण का प्राथमिक शासकीय राजपत्र प्रकाशन।'
    },
    'Section 11 Public Notice & Objections': {
      title: 'धारा 11 सार्वजनिक सूचना एवं आपत्तियां',
      desc: '60-दिवसीय वैधानिक सार्वजनिक आपत्ति एवं दावा निपटान चरण।'
    },
    'Section 19 Final Declaration': {
      title: 'धारा 19 अंतिम अधिग्रहण घोषणा',
      desc: 'पुनर्वास एवं पुनर्व्यवस्थापन योजना (R&R) की राज्य सरकार द्वारा संस्वीकृति।'
    },
    'Section 23 Compensation Award & Solatium': {
      title: 'धारा 23 मुआवजा अवार्ड एवं तोषण निर्धारण',
      desc: '100% तोषण एवं 12% ब्याज सहित वैधानिक मुआवजा गणना।'
    },
    'Section 38 Physical Possession & Land Takeover': {
      title: 'धारा 38 भौतिक कब्जा एवं नामांतरण प्रविष्टि',
      desc: 'पूर्ण भुगतान के उपरांत भूमि का आधिपत्य एवं राजस्व अभिलेख में नाम हस्तांतरण।'
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-slate-100 flex flex-col font-sans overflow-x-hidden">
      
      {/* Citizen Header */}
      <header className="bg-gov-navy text-white border-b border-slate-800 py-3 sm:py-4 px-3 sm:px-6 shadow-md w-full max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white p-0.5 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              <img src="/logo.png" alt="NLIIS Citizen Portal Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-tight truncate">
                {tr(
                  'Citizen Landowner Transparency & Status Portal',
                  'भूस्वामी पारदर्शिता एवं स्थिति ट्रैकिंग पोर्टल'
                )}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                {tr(
                  'Public Tracking for Project-Affected Landowners & Beneficiaries',
                  'खसरा नंबर अथवा पार्सल आईडी द्वारा भूमि अधिग्रहण एवं मुआवजा प्रगति देखें'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0">
            {/* Regional Language Selector */}
            <LanguageSelector variant="citizen" />

            <button
              onClick={onBackToDashboard}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded flex items-center gap-1.5 transition border border-white/20 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{tr('Officer Console', 'अधिकारी डैशबोर्ड')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tracker Container */}
      <main className="max-w-4xl w-full mx-auto p-3 sm:p-6 pb-20 flex-1 space-y-4 sm:space-y-6 min-w-0 overflow-x-hidden">
        
        {/* Search Box */}
        <div className="bg-white dark:bg-[#111c38] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {tr(
                'Track Your Land Acquisition & Compensation Status',
                'अपनी भूमि अधिग्रहण एवं मुआवजा स्थिति जानें'
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr(
                'Enter your Khasra Number (e.g. 142/1) or Parcel ID (e.g. RJ-JPR-P127)',
                'अपना खसरा नंबर (उदा. 142/1) या पार्सल आईडी (उदा. RJ-JPR-P127) दर्ज करें'
              )}
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={tr("e.g. 142/1 or RJ-JPR-P127", "उदा. 142/1 या RJ-JPR-P127")}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs sm:text-sm bg-white dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-gov-blue outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto justify-center bg-gov-navy hover:bg-slate-800 text-white px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>{tr('Check Status', 'स्थिति खोजें')}</span>
            </button>
          </form>

          {/* Sample quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            <span>{tr('Try searching:', 'डेमो खोज:')}</span>
            <button
              type="button"
              onClick={() => { setSearchQuery('RJ-JPR-P127'); }}
              className="text-gov-blue dark:text-blue-400 hover:underline font-mono"
            >
              RJ-JPR-P127 ({tr('Khasra', 'खसरा')} 142/1 {tr('Mahapura', 'महापुरा')})
            </button>
          </div>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            
            {/* Land Summary Card */}
            <div className="bg-white dark:bg-[#111c38] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-gov-navy dark:text-blue-300 px-2 py-0.5 rounded">
                      {trackingData.parcel_id}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {tr('Khasra No.', 'खसरा संख्या')} {trackingData.khasra_no} • {t(trackingData.village, trackingData.village)}, {t(trackingData.tehsil, trackingData.tehsil)}
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t(trackingData.district, trackingData.district)}, {t(trackingData.state, trackingData.state)} • {t(trackingData.project_name, trackingData.project_name)}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 dark:text-slate-400 block">{tr('Recorded Owner', 'पंजीकृत खातेदार')}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{trackingData.owner_name_masked}</span>
                </div>
              </div>

              {/* 5-Stage Timeline Visual */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {tr('5-Stage Acquisition Progress Timeline', 'भूमि अधिग्रहण प्रगति चरण (5-चरणीय)')}
                </h4>

                <div className="space-y-2">
                  {trackingData.stages.map((stage, idx) => {
                    const isPassed = stage.status === 'Completed';
                    const isCurrent = stage.status === 'In Progress' || stage.status === 'Pending Action';
                    const trInfo = stageTranslations[stage.title];

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 sm:p-3 rounded-lg border flex items-start gap-2.5 sm:gap-3 transition ${
                          isPassed
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                            : (isCurrent ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-1 ring-amber-200 dark:ring-amber-800/50 text-amber-950 dark:text-amber-200' : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 opacity-80')
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (isCurrent ? (
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 animate-pulse" />
                          ) : (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {stage.stage_no}
                            </div>
                          ))}
                        </div>

                        <div className="flex-1 text-xs min-w-0">
                          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-2">
                            <strong className="text-slate-900 dark:text-white font-bold text-xs sm:text-sm truncate">
                              {tr(stage.title, trInfo?.title || stage.title)}
                            </strong>
                            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono shrink-0">{stage.date}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                            {tr(stage.description, trInfo?.desc || stage.description)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Action Box */}
              <div className="bg-blue-50 dark:bg-blue-950/50 border-l-4 border-gov-blue dark:border-blue-500 p-3 sm:p-4 rounded-r-lg space-y-1 text-xs text-slate-800 dark:text-slate-200">
                <strong className="text-gov-navy dark:text-blue-300 text-xs uppercase tracking-wider block">
                  {tr('Action Required from Landowner:', 'भूस्वामी हेतु आवश्यक आगामी कार्रवाई:')}
                </strong>
                <p className="leading-relaxed">
                  {tr(
                    trackingData.next_action_for_landowner,
                    'कृपया उप-तहसीलदार सांगानेर कार्यालय में प्रपत्र 12-B जमा कराएं तथा वारिसाना नामांतरण के लिए 2 सह-खातेदारों के बैंक खाते का ई-केवाईसी पूरा करें।'
                  )}
                </p>
              </div>

              {/* Contact Helpdesk Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-gov-navy dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      {tr('Designated LAO Office', 'नामित एलएओ कार्यालय')}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {tr(
                        trackingData.designated_lao_office,
                        'विशेष भूमि अधिग्रहण अधिकारी (एनएच-48), कलेक्ट्रेट परिसर, जयपुर'
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gov-navy dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      {tr('Toll Free Helpline', 'हेल्पलाइन नंबर')}
                    </span>
                    <span className="font-mono font-bold text-gov-blue dark:text-blue-400">{trackingData.helpline_number}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grievance Submission Form */}
            <div className="bg-white dark:bg-[#111c38] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {tr(
                  'Submit Landowner Grievance or Compensation Inquiry',
                  'ऑनलाइन आपत्ति या सहायता अनुरोध दर्ज करें'
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {tr(
                  'Directly routed to the Special LAO and Sub-Divisional Magistrate for resolution.',
                  'सीधे संबंधित भूमि अधिग्रहण अधिकारी (LAO) एवं उपखंड अधिकारी को प्रेषित किया जाएगा।'
                )}
              </p>

              {grievanceSubmitted ? (
                <div className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    {tr(
                      'Grievance submitted successfully. Tracking Reference: GRV-2026-8942',
                      'आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है। संदर्भ संख्या: GRV-2026-8942'
                    )}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleGrievanceSubmit} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    placeholder={tr(
                      'Describe your compensation discrepancy or mutation inquiry...',
                      'अपनी आपत्ति या समस्या का विवरण लिखें...'
                    )}
                    value={grievanceText}
                    onChange={e => setGrievanceText(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-xs bg-white dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-gov-blue outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto justify-center bg-gov-navy hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{tr('Submit Grievance', 'आपत्ति दर्ज करें')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Citizen Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 text-center border-t border-slate-800 pb-20 md:pb-4">
        {tr(
          'National Land & Infrastructure Intelligence System (NLIIS) • Public Transparency Portal • Smart India Hackathon 2026',
          'राष्ट्रीय भूमि एवं अवसंरचना आसूचना प्रणाली (NLIIS) • नागरिक पारदर्शिता पोर्टल • स्मार्ट इंडिया हैकथॉन 2026'
        )}
      </footer>

    </div>
  );
};

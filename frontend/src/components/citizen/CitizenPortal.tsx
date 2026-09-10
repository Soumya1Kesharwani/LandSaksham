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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Citizen Header */}
      <header className="bg-gov-navy text-white border-b border-slate-800 py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              <img src="/logo.png" alt="NLIIS Citizen Portal Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">
                {tr(
                  'Citizen Landowner Transparency & Status Portal',
                  'भूस्वामी पारदर्शिता एवं स्थिति ट्रैकिंग पोर्टल'
                )}
              </h1>
              <p className="text-xs text-slate-300">
                {tr(
                  'Public Tracking for Project-Affected Landowners & Beneficiaries',
                  'खसरा नंबर अथवा पार्सल आईडी द्वारा भूमि अधिग्रहण एवं मुआवजा प्रगति देखें'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Regional Language Selector */}
            <LanguageSelector variant="citizen" />

            <button
              onClick={onBackToDashboard}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition border border-white/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{tr('Officer Console', 'अधिकारी डैशबोर्ड')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tracker Container */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 flex-1 space-y-6">
        
        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              {tr(
                'Track Your Land Acquisition & Compensation Status',
                'अपनी भूमि अधिग्रहण एवं मुआवजा स्थिति जानें'
              )}
            </h2>
            <p className="text-xs text-slate-500">
              {tr(
                'Enter your Khasra Number (e.g. 142/1) or Parcel ID (e.g. RJ-JPR-P127)',
                'अपना खसरा नंबर (उदा. 142/1) या पार्सल आईडी (उदा. RJ-JPR-P127) दर्ज करें'
              )}
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={tr("e.g. 142/1 or RJ-JPR-P127", "उदा. 142/1 या RJ-JPR-P127")}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-blue outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gov-navy hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>{tr('Check Status', 'स्थिति खोजें')}</span>
            </button>
          </form>

          {/* Sample quick tags */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>{tr('Try searching:', 'डेमो खोज:')}</span>
            <button
              type="button"
              onClick={() => { setSearchQuery('RJ-JPR-P127'); }}
              className="text-gov-blue hover:underline font-mono"
            >
              RJ-JPR-P127 ({tr('Khasra', 'खसरा')} 142/1 {tr('Mahapura', 'महापुरा')})
            </button>
          </div>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            
            {/* Land Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm bg-slate-100 text-gov-navy px-2.5 py-0.5 rounded">
                      {trackingData.parcel_id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {tr('Khasra No.', 'खसरा संख्या')} {trackingData.khasra_no} • {t(trackingData.village, trackingData.village)}, {t(trackingData.tehsil, trackingData.tehsil)}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {t(trackingData.district, trackingData.district)}, {t(trackingData.state, trackingData.state)} • {t(trackingData.project_name, trackingData.project_name)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">{tr('Recorded Owner', 'पंजीकृत खातेदार')}</span>
                  <span className="font-bold text-slate-900 text-sm">{trackingData.owner_name_masked}</span>
                </div>
              </div>

              {/* 5-Stage Timeline Visual */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
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
                        className={`p-3 rounded-lg border flex items-start gap-3 transition ${
                          isPassed
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                            : (isCurrent ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200' : 'bg-slate-50 border-slate-200 opacity-60')
                        }`}
                      >
                        <div className="mt-0.5">
                          {isPassed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (isCurrent ? (
                            <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                              {stage.stage_no}
                            </div>
                          ))}
                        </div>

                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900">
                              {tr(stage.title, trInfo?.title || stage.title)}
                            </strong>
                            <span className="text-[11px] font-semibold text-slate-500 font-mono">{stage.date}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">
                            {tr(stage.description, trInfo?.desc || stage.description)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Action Box */}
              <div className="bg-blue-50 border-l-4 border-gov-blue p-4 rounded-r-lg space-y-1 text-xs text-slate-800">
                <strong className="text-gov-navy text-xs uppercase tracking-wider block">
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
                <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-gov-navy shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      {tr('Designated LAO Office', 'नामित एलएओ कार्यालय')}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {tr(
                        trackingData.designated_lao_office,
                        'विशेष भूमि अधिग्रहण अधिकारी (एनएच-48), कलेक्ट्रेट परिसर, जयपुर'
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gov-navy shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      {tr('Toll Free Helpline', 'हेल्पलाइन नंबर')}
                    </span>
                    <span className="font-mono font-bold text-gov-blue">{trackingData.helpline_number}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grievance Submission Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                {tr(
                  'Submit Landowner Grievance or Compensation Inquiry',
                  'ऑनलाइन आपत्ति या सहायता अनुरोध दर्ज करें'
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {tr(
                  'Directly routed to the Special LAO and Sub-Divisional Magistrate for resolution.',
                  'सीधे संबंधित भूमि अधिग्रहण अधिकारी (LAO) एवं उपखंड अधिकारी को प्रेषित किया जाएगा।'
                )}
              </p>

              {grievanceSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
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
                    className="w-full border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-gov-blue outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-gov-navy hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
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
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 text-center border-t border-slate-800">
        {tr(
          'National Land & Infrastructure Intelligence System (NLIIS) • Public Transparency Portal • Smart India Hackathon 2026',
          'राष्ट्रीय भूमि एवं अवसंरचना आसूचना प्रणाली (NLIIS) • नागरिक पारदर्शिता पोर्टल • स्मार्ट इंडिया हैकथॉन 2026'
        )}
      </footer>

    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { trackCitizenParcel } from '../../services/api';
import { CitizenTrackingResponse } from '../../types';
import { 
  Search, ShieldCheck, CheckCircle2, Clock, AlertCircle, 
  MapPin, Phone, Building2, FileText, Send, ArrowLeft
} from 'lucide-react';

interface CitizenPortalProps {
  onBackToDashboard: () => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ onBackToDashboard }) => {
  const { language, setLanguage, t } = useLanguage();
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Citizen Header */}
      <header className="bg-gov-navy text-white border-b border-slate-800 py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center font-bold text-amber-400 border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">
                {language === 'hi' ? 'भूस्वामी पारदर्शिता एवं स्थिति ट्रैकिंग पोर्टल' : 'Citizen Landowner Transparency & Status Portal'}
              </h1>
              <p className="text-xs text-slate-300">
                {language === 'hi' ? 'खसरा नंबर अथवा पार्सल आईडी द्वारा भूमि अधिग्रहण एवं मुआवजा प्रगति देखें' : 'Public Tracking for Project-Affected Landowners & Beneficiaries'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <div className="flex items-center bg-white/10 border border-white/20 rounded p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded ${language === 'en' ? 'bg-white text-gov-navy font-bold' : 'text-slate-300'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded ${language === 'hi' ? 'bg-white text-gov-navy font-bold' : 'text-slate-300'}`}
              >
                हिन्दी
              </button>
            </div>

            <button
              onClick={onBackToDashboard}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition border border-white/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'अधिकारी डैशबोर्ड' : 'Officer Console'}</span>
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
              {language === 'hi' ? 'अपनी भूमि अधिग्रहण एवं मुआवजा स्थिति जानें' : 'Track Your Land Acquisition & Compensation Status'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'अपना खसरा नंबर (उदा. 142/1) या पार्सल आईडी (उदा. RJ-JPR-P127) दर्ज करें' : 'Enter your Khasra Number (e.g. 142/1) or Parcel ID (e.g. RJ-JPR-P127)'}
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. 142/1 or RJ-JPR-P127"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-blue outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gov-navy hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5"
            >
              <span>{language === 'hi' ? 'स्थिति खोजें' : 'Check Status'}</span>
            </button>
          </form>

          {/* Sample quick tags */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>{language === 'hi' ? 'डेमो खोज:' : 'Try searching:'}</span>
            <button
              type="button"
              onClick={() => { setSearchQuery('RJ-JPR-P127'); }}
              className="text-gov-blue hover:underline font-mono"
            >
              RJ-JPR-P127 (Khasra 142/1 Mahapura)
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
                      Khasra No. {trackingData.khasra_no} • {trackingData.village}, {trackingData.tehsil}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {trackingData.district}, {trackingData.state} • {trackingData.project_name}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">{language === 'hi' ? 'पंजीकृत भूस्वामी' : 'Recorded Owner'}</span>
                  <span className="font-bold text-slate-900 text-sm">{trackingData.owner_name_masked}</span>
                </div>
              </div>

              {/* 5-Stage Timeline Visual */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'hi' ? 'भूमि अधिग्रहण प्रगति चरण' : '5-Stage Acquisition Progress Timeline'}
                </h4>

                <div className="space-y-2">
                  {trackingData.stages.map((stage, idx) => {
                    const isPassed = stage.status === 'Completed';
                    const isCurrent = stage.status === 'In Progress' || stage.status === 'Pending Action';

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
                            <strong className="text-slate-900">{stage.title}</strong>
                            <span className="text-[11px] font-semibold text-slate-500 font-mono">{stage.date}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{stage.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Action Box */}
              <div className="bg-blue-50 border-l-4 border-gov-blue p-4 rounded-r-lg space-y-1 text-xs text-slate-800">
                <strong className="text-gov-navy text-xs uppercase tracking-wider block">
                  {language === 'hi' ? 'भूस्वामी हेतु आवश्यक आगामी कार्रवाई' : 'Action Required from Landowner:'}
                </strong>
                <p className="leading-relaxed">{trackingData.next_action_for_landowner}</p>
              </div>

              {/* Contact Helpdesk Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-gov-navy shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">{language === 'hi' ? 'नामित एलएओ कार्यालय' : 'Designated LAO Office'}</span>
                    <span className="font-semibold text-slate-800">{trackingData.designated_lao_office}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gov-navy shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">{language === 'hi' ? 'हेल्पलाइन नंबर' : 'Toll Free Helpline'}</span>
                    <span className="font-mono font-bold text-gov-blue">{trackingData.helpline_number}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grievance Submission Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? 'ऑनलाइन आपत्ति या सहायता अनुरोध दर्ज करें' : 'Submit Landowner Grievance or Compensation Inquiry'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'सीधे संबंधित भूमि अधिग्रहण अधिकारी (LAO) एवं उपखंड अधिकारी को प्रेषित किया जाएगा।' : 'Directly routed to the Special LAO and Sub-Divisional Magistrate for resolution.'}
              </p>

              {grievanceSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>
                    {language === 'hi' ? 'आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है। संदर्भ संख्या: GRV-2026-8942' : 'Grievance submitted successfully. Tracking Reference: GRV-2026-8942'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleGrievanceSubmit} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    placeholder={language === 'hi' ? 'अपनी आपत्ति या समस्या का विवरण लिखें...' : 'Describe your compensation discrepancy or mutation inquiry...'}
                    value={grievanceText}
                    onChange={e => setGrievanceText(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-gov-blue outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-gov-navy hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'आपत्ति दर्ज करें' : 'Submit Grievance'}</span>
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
        National Land & Infrastructure Intelligence System (NLIIS) • Public Transparency Portal • Smart India Hackathon 2026
      </footer>

    </div>
  );
};

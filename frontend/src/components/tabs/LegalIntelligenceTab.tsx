import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Scale, AlertTriangle, Calendar, Building2, Search, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';

export const LegalIntelligenceTab: React.FC = () => {
  const { t, tr } = useLanguage();
  const { parcels, setSelectedParcel, activeProject } = useProject();

  const [filterStayOnly, setFilterStayOnly] = useState(false);
  const [searchLegal, setSearchLegal] = useState('');

  const litigationParcels = parcels.filter(p => {
    if (!p.legal_case) return false;
    if (filterStayOnly && !p.legal_case.has_stay_order) return false;
    if (searchLegal) {
      const s = searchLegal.toLowerCase();
      return p.legal_case.case_number.toLowerCase().includes(s) ||
             p.legal_case.court_name.toLowerCase().includes(s) ||
             p.legal_case.petitioner.toLowerCase().includes(s) ||
             p.id.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Legal Health Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 items-stretch">
        {/* Card 1: Active Cases (Blue Tint) */}
        <div className="bg-blue-50/70 border border-blue-200/80 dark:bg-blue-950/30 dark:border-blue-900 rounded-lg p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">{t('legal.active_cases')}</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-blue-950 dark:text-blue-100 mt-1">
              {activeProject?.active_court_cases_count} {tr('Cases', 'प्रकरण')}
            </div>
          </div>
          <p className="text-xs text-blue-700/90 dark:text-blue-300 mt-2 leading-tight">{tr('Pending across High Court & District Tribunals', 'उच्च न्यायालय व जिला अधिकरणों में विचाराधीन')}</p>
        </div>

        {/* Card 2: Injunction / Stay Orders (Red Tint - High Danger) */}
        <div className="bg-red-50/90 border border-red-200 dark:bg-red-950/40 dark:border-red-900 rounded-lg p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-red-800 dark:text-red-300">
                {tr('Injunction / Stay Orders', 'निषेधाज्ञा / स्थगनादेश')}
              </div>
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-red-900 dark:text-red-100 mt-1">
              {activeProject?.stay_orders_count} {tr('Active Orders', 'सक्रिय आदेश')}
            </div>
          </div>
          <p className="text-xs text-red-700 dark:text-red-300 mt-2 leading-tight">{t('legal.stay_orders_sub')}</p>
        </div>

        {/* Card 3: Next Hearing Date (Indigo Tint - Upcoming Action) */}
        <div className="bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900 rounded-lg p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">{tr('Next Hearing Date', 'आगामी सुनवाई तिथि')}</div>
            <div className="text-lg sm:text-xl font-bold text-indigo-900 dark:text-indigo-100 mt-1 flex items-center gap-1.5 font-mono">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>24-Sep-2026</span>
            </div>
          </div>
          <p className="text-xs text-indigo-700/90 dark:text-indigo-300 mt-2 leading-tight">{tr('Rajasthan High Court (WP 8492/2025)', 'राजस्थान उच्च न्यायालय (रिट 8492/2025)')}</p>
        </div>

        {/* Card 4: Legal Score (Amber Tint - Priority Warning) */}
        <div className="bg-amber-50/80 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 rounded-lg p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300">{t('overview.legal_litigation')}</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-950 dark:text-amber-100 mt-1">
              {activeProject?.readiness_breakdown.legal} / 100
            </div>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-2 leading-tight">{tr('Requires urgent AAG stay vacation pleas', 'स्थगनादेश निरस्त कराने हेतु त्वरित प्रार्थनापत्र आवश्यक')}</p>
        </div>
      </div>

      {/* Case Dossiers Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111c38] p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 flex-1">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={t('common.search_placeholder')}
                value={searchLegal}
                onChange={e => setSearchLegal(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded text-xs w-full focus:ring-1 focus:ring-gov-blue outline-none bg-white dark:bg-[#0b1329] text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={filterStayOnly}
                onChange={e => setFilterStayOnly(e.target.checked)}
                className="rounded text-gov-blue"
              />
              <span>{tr('Show Active Stay Orders Only', 'केवल सक्रिय स्थगनादेश दिखाएं')}</span>
            </label>
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            {litigationParcels.length} {tr('Active Dossiers Listed', 'सक्रिय वाद सूचीबद्ध')}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {litigationParcels.map(p => {
            const c = p.legal_case!;
            const isStay = c.has_stay_order;
            return (
              <div
                key={c.id}
                className={`rounded-xl p-3.5 sm:p-5 shadow-2xs space-y-4 transition border ${
                  isStay
                    ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200/90 dark:border-red-900/80'
                    : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/70 dark:border-blue-900/60'
                }`}
              >
                {/* Dossier Header: Case #, Forum & Status Badge */}
                <div className={`flex items-start justify-between border-b pb-3.5 ${
                  isStay ? 'border-red-200/80 dark:border-red-900/60' : 'border-blue-200/60 dark:border-slate-800'
                }`}>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-mono text-base font-bold ${
                        isStay ? 'text-red-950 dark:text-red-100' : 'text-blue-950 dark:text-blue-100'
                      }`}>
                        {c.case_number}
                      </span>
                      {isStay ? (
                        <span className="bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-red-300 dark:border-red-700 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400 shrink-0" />
                          <span>{tr('STAY ORDER', 'स्थगनादेश प्रभावी')}</span>
                        </span>
                      ) : (
                        <span className="bg-blue-100/80 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-700 flex items-center gap-1">
                          <Scale className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>{tr('VALUATION REFERENCE', 'मूल्यांकन संदर्भ')}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {t(c.court_name, c.court_name)}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedParcel(p)}
                    className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition flex items-center gap-1 shadow-2xs shrink-0"
                    title={tr("View Parcel Details", "पार्सल विवरण देखें")}
                  >
                    <ExternalLink className="w-3 h-3 text-blue-500 shrink-0" />
                    <span>{tr('Parcel', 'पार्सल')} {p.id}</span>
                  </button>
                </div>

                {/* Case Particulars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-lg border ${
                    isStay
                      ? 'bg-white/90 dark:bg-slate-900/60 border-red-100 dark:border-slate-800'
                      : 'bg-white/90 dark:bg-slate-900/60 border-blue-100/80 dark:border-slate-800'
                  }`}>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">{t('legal.col_case_type')}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{t(c.case_type, c.case_type)}</span>
                  </div>

                  <div className={`p-3 rounded-lg border ${
                    isStay
                      ? 'bg-white/90 dark:bg-slate-900/60 border-red-100 dark:border-slate-800'
                      : 'bg-white/90 dark:bg-slate-900/60 border-blue-100/80 dark:border-slate-800'
                  }`}>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">{t('legal.col_next_hearing')}</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400 font-mono mt-0.5 inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {c.next_hearing_date}
                    </span>
                  </div>

                  <div className={`sm:col-span-2 p-3 rounded-lg border ${
                    isStay
                      ? 'bg-white/90 dark:bg-slate-900/60 border-red-100 dark:border-slate-800'
                      : 'bg-white/90 dark:bg-slate-900/60 border-blue-100/80 dark:border-slate-800'
                  }`}>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">{t('legal.col_parties')}</span>
                    <div className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                      <span>{t(c.petitioner, c.petitioner)}</span>
                      <span className="mx-1.5 text-[10px] uppercase font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {tr('vs', 'बनाम')}
                      </span>
                      <span>{t(c.respondent, c.respondent)}</span>
                    </div>
                  </div>
                </div>

                {/* Last Order Summary Box */}
                <div className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                  isStay
                    ? 'bg-red-100/40 dark:bg-slate-900/80 border-red-200/80 dark:border-slate-800'
                    : 'bg-slate-100/70 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800'
                }`}>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-slate-500" />
                    <span>{tr('Last Judicial Order Summary:', 'अंतिम न्यायिक आदेश सारांश:')}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {t(c.last_order_summary, c.last_order_summary)}
                  </p>
                </div>

                {/* AI Recommended Strategy Box */}
                <div className="p-3.5 bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/70 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{t('legal.col_legal_strategy')}:</span>
                  </div>
                  <p className="text-blue-950 dark:text-blue-100 whitespace-pre-line leading-relaxed font-medium">
                    {c.recommended_legal_action
                      ? (t(c.recommended_legal_action) !== c.recommended_legal_action
                          ? t(c.recommended_legal_action)
                          : c.recommended_legal_action.split('\n').map(l => t(l.trim(), l.trim())).join('\n'))
                      : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

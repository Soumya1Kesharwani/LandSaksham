import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Scale, AlertTriangle, Calendar, Building2, Search, ExternalLink, ShieldAlert } from 'lucide-react';

export const LegalIntelligenceTab: React.FC = () => {
  const { t } = useLanguage();
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Active Court Litigations</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {activeProject?.active_court_cases_count} Cases
          </div>
          <p className="text-xs text-slate-500 mt-1">Pending across High Court & District Tribunals</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-red-800">Judicial Stay Orders Active</div>
          <div className="text-2xl font-bold font-mono text-red-900 mt-1 flex items-center gap-2">
            <span>{activeProject?.stay_orders_count} Stay Orders</span>
            <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
          </div>
          <p className="text-xs text-red-700 mt-1">Blocking physical possession under Section 38</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Next Upcoming Hearing</div>
          <div className="text-lg font-bold text-gov-blue mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gov-blue" />
            <span>24-Sep-2026</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Rajasthan High Court (WP 8492/2025)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Legal Readiness Index</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {activeProject?.readiness_breakdown.legal} / 100
          </div>
          <p className="text-xs text-slate-500 mt-1">Requires urgent AAG stay vacation pleas</p>
        </div>
      </div>

      {/* Case Dossiers Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search by Case No, Court, Petitioner..."
                value={searchLegal}
                onChange={e => setSearchLegal(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs w-64 focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={filterStayOnly}
                onChange={e => setFilterStayOnly(e.target.checked)}
                className="rounded text-gov-blue"
              />
              <span>Show Active Stay Orders Only</span>
            </label>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {litigationParcels.length} Active Dossiers Listed
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {litigationParcels.map(p => {
            const c = p.legal_case!;
            return (
              <div
                key={c.id}
                className={`bg-white border rounded-lg p-5 shadow-sm space-y-4 transition ${
                  c.has_stay_order ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gov-navy">{c.case_number}</span>
                      {c.has_stay_order && (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          STAY ORDER
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{c.court_name}</div>
                  </div>

                  <button
                    onClick={() => setSelectedParcel(p)}
                    className="text-xs font-semibold text-gov-blue hover:underline"
                  >
                    Parcel {p.id}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Case Type</span>
                    <span className="font-medium text-slate-800">{c.case_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Next Hearing Date</span>
                    <span className="font-bold text-gov-blue font-mono">{c.next_hearing_date}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Petitioner vs Respondent</span>
                    <span className="text-slate-700">{c.petitioner} <strong className="text-slate-400">vs</strong> {c.respondent}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">Last Judicial Order Summary:</span>
                  <p className="text-slate-600 leading-relaxed">{c.last_order_summary}</p>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-xs text-gov-navy">
                  <span className="font-bold text-gov-blue block mb-0.5">AI Recommended Legal Strategy:</span>
                  <p className="whitespace-pre-line leading-relaxed">{c.recommended_legal_action}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

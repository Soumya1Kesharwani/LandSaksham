import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Landmark, Search, ArrowDownRight, CheckCircle2, AlertCircle, Download, FileSpreadsheet } from 'lucide-react';

export const CompensationTab: React.FC = () => {
  const { t, tr } = useLanguage();
  const { parcels, activeProject, setSelectedParcel } = useProject();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredParcels = parcels.filter(p => {
    if (!p.compensation) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return p.id.toLowerCase().includes(s) ||
             p.khasra_survey_no.toLowerCase().includes(s) ||
             p.owner.name.toLowerCase().includes(s) ||
             p.village.toLowerCase().includes(s);
    }
    return true;
  });

  const totalCompensation = activeProject?.compensation_total_cr || 184.5;
  const paidCompensation = activeProject?.compensation_paid_cr || 126.2;
  const pendingCompensation = activeProject?.compensation_pending_cr || 58.3;
  const paidPct = ((paidCompensation / totalCompensation) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Top Financial Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">{t('compensation.total_award')}</span>
            <Landmark className="w-4 h-4 text-gov-navy" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            ₹{totalCompensation.toFixed(2)} {t('common.crore')}
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('compensation.total_award_sub')}</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-emerald-800">{t('compensation.disbursed')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-950 mt-2">
            ₹{paidCompensation.toFixed(2)} {t('common.crore')} ({paidPct}%)
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-1.5 mt-2">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${paidPct}%` }} />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-red-800">{t('compensation.pending_escrow')}</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-950 mt-2">
            ₹{pendingCompensation.toFixed(2)} {t('common.crore')}
          </div>
          <p className="text-xs text-red-700 mt-1">{t('compensation.pending_escrow_sub')}</p>
        </div>
      </div>

      {/* RFCTLARR 2013 Calculation Framework Card */}
      <div className="bg-slate-900 text-white rounded-lg p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">
            {t('compensation.valuation_matrix_title')}
          </h3>
          <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
            {t('compensation.form_23')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
            <span className="text-slate-400 block text-[11px]">{t('compensation.multiplier_factor')}</span>
            <strong className="text-white text-sm">1.25x – 2.0x</strong>
            <span className="text-[10px] text-slate-400 block">{t('compensation.multiplier_val')}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
            <span className="text-slate-400 block text-[11px]">{t('compensation.section_30_solatium')}</span>
            <strong className="text-emerald-400 text-sm">{t('compensation.solatium_val')}</strong>
            <span className="text-[10px] text-slate-400 block">{t('compensation.solatium_val')}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
            <span className="text-slate-400 block text-[11px]">{t('compensation.section_30_3_interest')}</span>
            <strong className="text-amber-400 text-sm">12% {tr('Per Annum', 'प्रति वर्ष')}</strong>
            <span className="text-[10px] text-slate-400 block">{t('compensation.interest_val')}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
            <span className="text-slate-400 block text-[11px]">{t('compensation.rr_package')}</span>
            <strong className="text-blue-400 text-sm">{t('compensation.rr_package_val')}</strong>
            <span className="text-[10px] text-slate-400 block">{t('compensation.rr_package_val')}</span>
          </div>
        </div>
      </div>

      {/* Parcel Level Compensation Ledger */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={t('common.search_placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1.5 text-xs w-64 focus:ring-1 focus:ring-gov-blue outline-none bg-white"
            />
          </div>

          <button
            onClick={() => alert(tr("PFMS Treasury Export Generated in XLSX format.", "PFMS राजकोष बहीखाता XLSX प्रारूप में निर्यात किया गया।"))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{tr('Export PFMS Treasury Ledger', 'PFMS राजकोष बहीखाता निर्यात')}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-slate-100 text-slate-700 font-sans font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">{t('compensation.col_khasra')}</th>
                <th className="p-3">{t('land.col_owner')}</th>
                <th className="p-3 text-right">{t('compensation.col_market_val')}</th>
                <th className="p-3 text-right">{t('compensation.col_solatium_amt')}</th>
                <th className="p-3 text-right">{t('compensation.col_total_award')}</th>
                <th className="p-3 text-right">{t('compensation.col_disbursed_amt')}</th>
                <th className="p-3 text-right">{t('compensation.col_escrow_amt')}</th>
                <th className="p-3 font-sans">{t('compensation.col_pfms_status')}</th>
                <th className="p-3 font-sans text-right">{t('common.inspect')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map(p => {
                const comp = p.compensation!;
                const isPaid = comp.amount_pending_inr === 0;
                const isDisputed = comp.payment_status.includes('Disputed') || comp.payment_status.includes('Tribunal');

                return (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3 font-bold text-gov-navy">
                      <div>{p.id}</div>
                      <div className="text-[11px] font-normal text-slate-500">{tr('Khasra', 'खसरा')} {p.khasra_survey_no} ({t(p.village, p.village)})</div>
                    </td>
                    <td className="p-3 font-sans text-slate-800">
                      {t(p.owner.name, p.owner.name)}
                    </td>
                    <td className="p-3 text-right text-slate-700">
                      ₹{(comp.base_land_value_inr / 100000).toFixed(2)} {tr('Lakh', 'लाख')}
                    </td>
                    <td className="p-3 text-right text-slate-700">
                      ₹{(comp.solatium_100_pct_inr / 100000).toFixed(2)} {tr('Lakh', 'लाख')}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ₹{(comp.total_estimated_compensation_inr / 100000).toFixed(2)} {tr('Lakh', 'लाख')}
                    </td>
                    <td className="p-3 text-right text-emerald-700 font-semibold">
                      ₹{(comp.amount_disbursed_inr / 100000).toFixed(2)} {tr('Lakh', 'लाख')}
                    </td>
                    <td className="p-3 text-right text-red-700 font-bold">
                      ₹{(comp.amount_pending_inr / 100000).toFixed(2)} {tr('Lakh', 'लाख')}
                    </td>
                    <td className="p-3 font-sans">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isPaid ? 'bg-emerald-100 text-emerald-800' : (isDisputed ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')
                      }`}>
                        {t(comp.payment_status)}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-right">
                      <button
                        onClick={() => setSelectedParcel(p)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-gov-blue hover:text-white text-slate-700 font-semibold transition border border-slate-300"
                      >
                        {t('common.inspect')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

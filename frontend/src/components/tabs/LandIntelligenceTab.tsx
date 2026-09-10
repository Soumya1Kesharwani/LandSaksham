import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Parcel, RiskLevel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { 
  FileSpreadsheet, Search, Filter, Download, 
  ExternalLink, CheckCircle, AlertTriangle, Building2, Trees, ShieldCheck
} from 'lucide-react';

export const LandIntelligenceTab: React.FC = () => {
  const { t, tr } = useLanguage();
  const { parcels, setSelectedParcel, activeProject } = useProject();

  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [landTypeFilter, setLandTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredParcels = parcels.filter(p => {
    if (riskFilter !== 'ALL' && p.delay_risk_level !== riskFilter) return false;
    if (landTypeFilter !== 'ALL' && !p.land_type.toLowerCase().includes(landTypeFilter.toLowerCase())) return false;
    if (statusFilter !== 'ALL' && !p.acquisition_status.toLowerCase().includes(statusFilter.toLowerCase())) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return p.id.toLowerCase().includes(s) ||
             p.khasra_survey_no.toLowerCase().includes(s) ||
             p.village.toLowerCase().includes(s) ||
             p.tehsil.toLowerCase().includes(s) ||
             p.owner.name.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Land Breakdown Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">{t('land.total_land_required')}</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {activeProject?.total_land_required_acres.toLocaleString()} {t('common.acres')}
          </div>
          <div className="text-xs text-slate-500 mt-1">{activeProject?.total_parcels_count} {t('land.total_parcels')}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">{t('land.private_land')}</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {activeProject?.private_land_acres.toLocaleString()} {t('common.acres')}
          </div>
          <div className="text-xs text-amber-700 font-semibold mt-1">
            {activeProject?.high_risk_parcels_count} {t('land.parcels_at_risk')}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">{t('land.govt_land')}</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {activeProject?.government_land_acres.toLocaleString()} {t('common.acres')}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">{t('land.direct_transfer')}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">{t('land.forest_land')}</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {activeProject?.forest_land_acres.toLocaleString()} {t('common.acres')}
          </div>
          <div className="text-xs text-red-700 font-semibold mt-1">{t('land.stage_in_progress')}</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={t('common.search_placeholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs w-64 focus:ring-1 focus:ring-gov-blue outline-none bg-white"
              />
            </div>

            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white font-medium"
            >
              <option value="ALL">{t('land.all_risk_levels')}</option>
              <option value="CRITICAL">{t('land.critical_filter')}</option>
              <option value="HIGH">{t('land.high_filter')}</option>
              <option value="MEDIUM">{t('land.medium_filter')}</option>
              <option value="LOW">{t('land.low_filter')}</option>
            </select>

            <select
              value={landTypeFilter}
              onChange={e => setLandTypeFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white font-medium"
            >
              <option value="ALL">{t('land.all_land_types')}</option>
              <option value="agricultural">{tr('Private Agricultural', 'निजी कृषि भूमि')}</option>
              <option value="commercial">{tr('Commercial / Industrial', 'व्यावसायिक / औद्योगिक')}</option>
              <option value="government">{tr('Government', 'शासकीय भूमि')}</option>
              <option value="forest">{tr('Forest', 'वन भूमि')}</option>
              <option value="grazing">{tr('Gauchar / Grazing', 'गोचर / चारागाह')}</option>
              <option value="water">{tr('Water Body', 'जल निकाय')}</option>
            </select>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {tr('Showing', 'प्रदर्शित')} {filteredParcels.length} / {parcels.length} {tr('Records', 'रिकॉर्ड्स')}
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">{t('land.col_parcel_id')}</th>
                <th className="p-3">{t('land.col_village')}</th>
                <th className="p-3">{t('land.col_land_type')} & {t('land.col_area')}</th>
                <th className="p-3">{t('land.col_owner')}</th>
                <th className="p-3">{tr('Acquisition Stage', 'अधिग्रहण चरण')}</th>
                <th className="p-3">{t('land.col_risk')}</th>
                <th className="p-3">{t('overview.table_primary_bottleneck')}</th>
                <th className="p-3 text-right">{t('land.col_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map(p => (
                <tr key={p.id} className="hover:bg-blue-50/40 transition">
                  <td className="p-3">
                    <div className="font-bold text-gov-navy font-mono">{p.id}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{tr('Khasra', 'खसरा')} {p.khasra_survey_no}</div>
                  </td>
                  <td className="p-3 text-slate-700">
                    <div className="font-medium">{t(p.village, p.village)}</div>
                    <div className="text-[11px] text-slate-400">{t(p.tehsil, p.tehsil)}, {t(p.district, p.district)}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-800">{t(p.land_type, p.land_type)}</div>
                    <div className="text-[11px] font-mono text-slate-500">{p.area_acres} {t('common.acres')}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-900">{t(p.owner.name, p.owner.name)}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                      {t(p.mutation_status, p.mutation_status)}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 border border-slate-300 text-slate-700">
                      {t(p.acquisition_status, p.acquisition_status)}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tr('Possession:', 'कब्जा:')} {p.possession_percentage}%</div>
                  </td>
                  <td className="p-3">
                    <RiskBadge level={p.delay_risk_level} score={p.delay_risk_score} showScore size="sm" />
                    <div className="text-[10px] text-slate-400 mt-0.5">+{p.expected_delay_days} {t('common.days')}</div>
                  </td>
                  <td className="p-3 text-slate-600 max-w-[200px]">
                    <div className="font-medium text-red-700 truncate">
                      {p.top_risk_factors[0]?.factor_name ? t(p.top_risk_factors[0]?.factor_name, p.top_risk_factors[0]?.factor_name) : t('common.pending')}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {p.recommended_action ? t(p.recommended_action, p.recommended_action) : ''}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedParcel(p)}
                      className="px-3 py-1 rounded bg-gov-navy text-white text-xs font-semibold hover:bg-slate-800 transition"
                    >
                      {t('common.view_details')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

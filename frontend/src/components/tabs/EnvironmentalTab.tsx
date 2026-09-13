import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Trees, AlertTriangle, CheckCircle2, Clock, ShieldCheck, Droplets } from 'lucide-react';

export const EnvironmentalTab: React.FC = () => {
  const { t, tr } = useLanguage();
  const { parcels, activeProject, setSelectedParcel } = useProject();

  const envParcels = parcels.filter(p => p.environmental && (p.environmental.overlaps_forest || p.environmental.waterbody_overlap || p.environmental.in_eco_sensitive_zone));

  return (
    <div className="space-y-6">
      
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* Card 1: Forest Land Diversion (Emerald Tint) */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-900 rounded-lg p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                {t('environment.forest_diversion')}
              </div>
              <Trees className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-950 dark:text-emerald-100 mt-1">
              {activeProject?.forest_land_acres} {t('common.acres')}
            </div>
          </div>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-2 leading-tight">
            {tr('Dudu & Beawar Forest Divisions', 'दूदू एवं ब्यावर वन मंडल')}
          </p>
        </div>

        {/* Card 2: Stage-II Clearance Status (Amber Tint - Inactivity Warning) */}
        <div className="bg-amber-50/80 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 rounded-lg p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                {t('environment.stage_2_status')}
              </div>
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            </div>
            <div className="text-xl font-bold text-amber-950 dark:text-amber-100 mt-1 font-mono">
              <span>{tr('48 Days Inactive', '48 दिन निष्क्रिय')}</span>
            </div>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-2 leading-tight">
            {tr('Regional Empowered Committee review pending', 'क्षेत्रीय अधिकार प्राप्त समिति समीक्षा लंबित')}
          </p>
        </div>

        {/* Card 3: Distance to Eco-Sensitive Zone (Teal/Cyan Tint) */}
        <div className="bg-teal-50/70 border border-teal-200/80 dark:bg-teal-950/30 dark:border-teal-900 rounded-lg p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-900 dark:text-teal-300">
                {t('environment.eco_sensitive_dist')}
              </div>
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            </div>
            <div className="text-2xl font-bold font-mono text-teal-950 dark:text-teal-100 mt-1 whitespace-nowrap">
              2 {tr('Wildlife Zones', 'वन्यजीव जोन')}
            </div>
          </div>
          <p className="text-xs text-teal-800 dark:text-teal-300 mt-2 leading-tight">
            {t('environment.eco_sensitive_dist_sub')}
          </p>
        </div>

        {/* Card 4: Forest & PARIVESH Score (Indigo Tint) */}
        <div className="bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900 rounded-lg p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
              {t('overview.forest_parivesh')}
            </div>
            <div className="text-2xl font-bold font-mono text-indigo-950 dark:text-indigo-100 mt-1">
              {activeProject?.readiness_breakdown.environment} / 100
            </div>
          </div>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-2 leading-tight">
            {tr('CAMPA NPV deposition required', 'कैम्पा एनपीवी जमा किया जाना आवश्यक')}
          </p>
        </div>
      </div>

      {/* Parivesh Clearance Tracker */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {t('environment.title')}
            </h3>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
            {tr('Portal Ref:', 'परिवेश संदर्भ:')} FP/RJ/ROAD/48921/2024
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md">
            <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200 mb-1">
              <span>{tr('Stage 1: Proposal Submission', 'चरण 1: प्रस्ताव प्रस्तुति')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
            <p className="text-emerald-800 dark:text-emerald-300 text-[11px] font-medium leading-relaxed">
              {tr('Completed on 14-Dec-2024 by NHAI PIU Jaipur', '14-दिसंबर-2024 को NHAI PIU जयपुर द्वारा पूर्ण')}
            </p>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md">
            <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200 mb-1">
              <span>{tr('Stage 2: DFO Site Inspection', 'चरण 2: डीएफओ स्थल निरीक्षण')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
            <p className="text-emerald-800 dark:text-emerald-300 text-[11px] font-medium leading-relaxed">
              {tr('DFO Dudu completed tree enumeration (1,420 trees)', 'डीएफओ दूदू द्वारा वृक्ष गणना पूर्ण (1,420 वृक्ष)')}
            </p>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-md ring-1 ring-amber-200 dark:ring-amber-900">
            <div className="flex items-center justify-between font-bold text-amber-950 dark:text-amber-200 mb-1">
              <span>{t('environment.stage_1_status')}</span>
              <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            </div>
            <p className="text-amber-900 dark:text-amber-300 text-[11px] font-medium leading-relaxed">
              {tr('Approved subject to CA Land transfer in Phagi', 'फागी में प्रतिपूरक वनीकरण भूमि अंतरण की शर्त पर स्वीकृत')}
            </p>
          </div>

          <div className="p-3 bg-slate-100/90 dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-900 rounded-md shadow-2xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">{t('environment.stage_2_status')}</div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
              {tr('Awaiting CAMPA payment & tree felling license', 'कैम्पा भुगतान एवं वृक्ष पातन अनुमति प्रतीक्षारत')}
            </p>
          </div>
        </div>
      </div>

      {/* Sensitive Parcels List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs uppercase tracking-wide text-slate-700">
          {tr('Environmentally Sensitive Land Parcels', 'पर्यावरण-संवेदनशील भूमि पार्सल')}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
              <tr>
                <th className="p-3">{t('overview.table_parcel_khasra')}</th>
                <th className="p-3">{t('overview.table_village_tehsil')}</th>
                <th className="p-3">{tr('Ecological Classification', 'पारिस्थितिक वर्गीकरण')}</th>
                <th className="p-3">{t('environment.forest_diversion')}</th>
                <th className="p-3">{tr('Clearance Pendency', 'स्वीकृति लंबित')}</th>
                <th className="p-3 text-right">{t('common.inspect')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {envParcels.map(p => {
                const env = p.environmental!;
                return (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3 font-bold text-gov-navy">
                      {p.id} <span className="text-slate-500 font-normal">({tr('Khasra', 'खसरा')} {p.khasra_survey_no})</span>
                    </td>
                    <td className="p-3 text-slate-700">{t(p.village, p.village)}, {t(p.tehsil, p.tehsil)}</td>
                    <td className="p-3 font-medium text-slate-800">
                      {env.overlaps_forest ? tr('Protected Forest Land', 'संरक्षित वन भूमि') : (env.waterbody_overlap ? tr('Water Catchment Overlap', 'जल जलग्रहण क्षेत्र') : tr('ESZ Buffer Area', 'ईएसजेड बफर क्षेत्र'))}
                    </td>
                    <td className="p-3 font-mono">{env.forest_diversion_area_ha > 0 ? `${env.forest_diversion_area_ha} ha` : tr('Non-Forest', 'गैर-वन भूमि')}</td>
                    <td className="p-3">
                      <span className="text-amber-800 font-semibold">{env.clearance_days_pending} {t('common.days')} {t('common.pending')}</span>
                      <div className="text-[10px] text-slate-400">{t(env.statutory_clearance_stage)}</div>
                    </td>
                    <td className="p-3 text-right">
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

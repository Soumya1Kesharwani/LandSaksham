import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Trees, AlertTriangle, CheckCircle2, Clock, ShieldCheck, Droplets } from 'lucide-react';

export const EnvironmentalTab: React.FC = () => {
  const { t } = useLanguage();
  const { parcels, activeProject, setSelectedParcel } = useProject();

  const envParcels = parcels.filter(p => p.environmental && (p.environmental.overlaps_forest || p.environmental.waterbody_overlap || p.environmental.in_eco_sensitive_zone));

  return (
    <div className="space-y-6">
      
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Forest Land Diversion</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {activeProject?.forest_land_acres} Acres
          </div>
          <p className="text-xs text-slate-500 mt-1">Dudu & Beawar Forest Divisions</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-amber-800">Parivesh Stage-II Status</div>
          <div className="text-xl font-bold text-amber-950 mt-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>48 Days Inactive</span>
          </div>
          <p className="text-xs text-amber-800 mt-1">Regional Empowered Committee review pending</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Eco-Sensitive Zone Overlap</div>
          <div className="text-2xl font-bold font-mono text-gov-navy mt-1">
            2 Wildlife Zones
          </div>
          <p className="text-xs text-slate-500 mt-1">Aravalli Ridge Protected Sector</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Environmental Readiness</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {activeProject?.readiness_breakdown.environment} / 100
          </div>
          <p className="text-xs text-slate-500 mt-1">CAMPA NPV deposition required</p>
        </div>
      </div>

      {/* Parivesh Clearance Tracker */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              MoEFCC PARIVESH Statutory Clearance Pipeline
            </h3>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
            Portal Ref: FP/RJ/ROAD/48921/2024
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
            <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
              <span>Stage 1: Proposal Submission</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-emerald-800 text-[11px]">Completed on 14-Dec-2024 by NHAI PIU Jaipur</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
            <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
              <span>Stage 2: DFO Site Inspection</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-emerald-800 text-[11px]">DFO Dudu completed tree enumeration (1,420 trees)</p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-300 rounded-md ring-1 ring-amber-200">
            <div className="flex items-center justify-between font-bold text-amber-950 mb-1">
              <span>Stage 3: Stage-I In-Principle</span>
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
            </div>
            <p className="text-amber-900 text-[11px]">Approved subject to CA Land transfer in Phagi</p>
          </div>

          <div className="p-3 bg-slate-100 border border-slate-200 rounded-md opacity-80">
            <div className="font-bold text-slate-700 mb-1">Stage 4: Final Working Permission</div>
            <p className="text-slate-500 text-[11px]">Awaiting CAMPA payment & tree felling license</p>
          </div>
        </div>
      </div>

      {/* Sensitive Parcels List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs uppercase tracking-wide text-slate-700">
          Environmentally Sensitive Land Parcels
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
              <tr>
                <th className="p-3">Parcel / Khasra</th>
                <th className="p-3">Village / Division</th>
                <th className="p-3">Ecological Classification</th>
                <th className="p-3">Forest Diversion</th>
                <th className="p-3">Clearance Pendency</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {envParcels.map(p => {
                const env = p.environmental!;
                return (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3 font-bold text-gov-navy">
                      {p.id} <span className="text-slate-500 font-normal">(Khasra {p.khasra_survey_no})</span>
                    </td>
                    <td className="p-3 text-slate-700">{p.village}, {p.tehsil}</td>
                    <td className="p-3 font-medium text-slate-800">
                      {env.overlaps_forest ? 'Protected Forest Land' : (env.waterbody_overlap ? 'Water Catchment Overlap' : 'ESZ Buffer Area')}
                    </td>
                    <td className="p-3 font-mono">{env.forest_diversion_area_ha > 0 ? `${env.forest_diversion_area_ha} ha` : 'Non-Forest'}</td>
                    <td className="p-3">
                      <span className="text-amber-800 font-semibold">{env.clearance_days_pending} Days Pending</span>
                      <div className="text-[10px] text-slate-400">{env.statutory_clearance_stage}</div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedParcel(p)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-gov-blue hover:text-white text-slate-700 font-semibold transition border border-slate-300"
                      >
                        Inspect
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

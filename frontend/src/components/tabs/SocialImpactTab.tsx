import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Users, Home, HeartHandshake, ShieldCheck, MapPin } from 'lucide-react';

export const SocialImpactTab: React.FC = () => {
  const { t } = useLanguage();
  const { activeProject } = useProject();

  return (
    <div className="space-y-6">
      
      {/* Top Social Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Total Affected Households</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">1,284 Families</div>
          <p className="text-xs text-slate-500 mt-1">Across 34 project-affected villages</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-amber-800">Potentially Displaced Persons</div>
          <div className="text-2xl font-bold font-mono text-amber-950 mt-1">246 Families</div>
          <p className="text-xs text-amber-800 mt-1">Residential & commercial structure loss</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">R&R Housing Packages Sanctioned</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">198 Packages</div>
          <p className="text-xs text-slate-500 mt-1">Under Second Schedule of 2013 Act</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Vulnerable Community Safeguards</div>
          <div className="text-2xl font-bold font-mono text-gov-navy mt-1">100% Covered</div>
          <p className="text-xs text-slate-500 mt-1">SC/ST one-time livelihood subsistence grant</p>
        </div>
      </div>

      {/* R&R Entitlement Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
          Rehabilitation & Resettlement Entitlements (Second Schedule RFCTLARR 2013)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-gov-navy font-bold text-sm">
              <Home className="w-4 h-4 text-gov-blue" />
              <span>Provision of Housing Units</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Constructed house in Mahapura Resettlement Colony (minimum 50 sq. metres in rural area) or one-time financial assistance of <strong>₹5,00,000</strong> for house construction.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-gov-navy font-bold text-sm">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Subsistence Allowance</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Monthly subsistence allowance equivalent to <strong>₹3,000 per month</strong> for a period of one year from the date of award for all displaced families.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-gov-navy font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Resettlement & Cattle Shed Grant</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              One-time transportation grant of <strong>₹50,000</strong> per family and <strong>₹25,000</strong> for cattle shed reconstruction for agricultural families.
            </p>
          </div>
        </div>
      </div>

      {/* Village-Level Social Impact Summary */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs uppercase tracking-wide text-slate-700">
          Village-Level Social & Displacement Impact Breakdown
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
              <tr>
                <th className="p-3">Village / Tehsil</th>
                <th className="p-3">Affected Households</th>
                <th className="p-3">Displaced Families</th>
                <th className="p-3">Agricultural Laborers</th>
                <th className="p-3">Resettlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">Mahapura (Sanganer)</td>
                <td className="p-3 font-mono">142</td>
                <td className="p-3 font-mono text-amber-800 font-bold">28</td>
                <td className="p-3 font-mono">45</td>
                <td className="p-3 text-emerald-700 font-medium">Site Identified (Plot Allotment in Progress)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">Bagru Urban (Sanganer)</td>
                <td className="p-3 font-mono">310</td>
                <td className="p-3 font-mono text-red-700 font-bold">84</td>
                <td className="p-3 font-mono">12</td>
                <td className="p-3 text-amber-700 font-medium">Commercial Shop Relocation Dispute</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">Gadota (Dudu)</td>
                <td className="p-3 font-mono">88</td>
                <td className="p-3 font-mono">14</td>
                <td className="p-3 font-mono">32</td>
                <td className="p-3 text-emerald-700 font-medium">100% Grants Disbursed</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">Sendra & Kharwa (Beawar)</td>
                <td className="p-3 font-mono">195</td>
                <td className="p-3 font-mono text-amber-800 font-bold">42</td>
                <td className="p-3 font-mono">68</td>
                <td className="p-3 text-gov-blue font-medium">Tribal Welfare Cell Special Plan Sanctioned</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

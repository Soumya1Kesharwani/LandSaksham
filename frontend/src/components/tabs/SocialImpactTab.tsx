import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Users, Home, HeartHandshake, ShieldCheck, MapPin } from 'lucide-react';

export const SocialImpactTab: React.FC = () => {
  const { t, tr } = useLanguage();
  const { activeProject } = useProject();

  return (
    <div className="space-y-6">
      
      {/* Top Social Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500 truncate">{t('social.affected_families')}</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1 truncate">1,284 {tr('Families', 'परिवार')}</div>
          <p className="text-xs text-slate-500 mt-1 truncate">{tr('Across 34 project-affected villages', '34 परियोजना-प्रभावित ग्रामों में')}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 sm:p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-amber-800 truncate">{t('social.displaced_families')}</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-950 mt-1 truncate">246 {tr('Families', 'परिवार')}</div>
          <p className="text-xs text-amber-800 mt-1 truncate">{tr('Residential & commercial structure loss', 'आवासीय व व्यावसायिक संरचना विस्थापन')}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500 truncate">{tr('R&R Housing Packages Sanctioned', 'स्वीकृत पुनर्वास आवास पैकेज')}</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 mt-1 truncate">198 {tr('Packages', 'पैकेज')}</div>
          <p className="text-xs text-slate-500 mt-1 truncate">{tr('Under Second Schedule of 2013 Act', '2013 अधिनियम की द्वितीय अनुसूची अंतर्गत')}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500 truncate">{t('social.vulnerable_families')}</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-gov-navy mt-1 truncate">100% {tr('Covered', 'आच्छादित')}</div>
          <p className="text-xs text-slate-500 mt-1 truncate">{t('social.vulnerable_families_sub')}</p>
        </div>
      </div>

      {/* R&R Entitlement Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-5 shadow-sm space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
          {t('social.title')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs">
          <div className="border border-slate-200 rounded-lg p-3.5 sm:p-4 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-gov-navy font-bold text-sm">
              <Home className="w-4 h-4 text-gov-blue" />
              <span>{tr('Provision of Housing Units', 'आवासीय इकाइयों का प्रावधान')}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {tr(
                'Constructed house in Mahapura Resettlement Colony (minimum 50 sq. metres in rural area) or one-time financial assistance of ₹5,00,000 for house construction.',
                'महापुरा पुनर्वास कॉलोनी में निर्मित पक्का मकान (ग्रामीण क्षेत्र में न्यूनतम 50 वर्ग मीटर) अथवा गृह निर्माण हेतु ₹5,00,000 की एकमुश्त वित्तीय सहायता।'
              )}
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3.5 sm:p-4 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-gov-navy font-bold text-sm">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>{tr('Subsistence Allowance', 'निर्वाह भत्ता')}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {tr(
                'Monthly subsistence allowance equivalent to ₹3,000 per month for a period of one year from the date of award for all displaced families.',
                'सभी विस्थापित परिवारों को पंचाट की तारीख से एक वर्ष की अवधि के लिए ₹3,000 प्रति माह के समतुल्य मासिक निर्वाह भत्ता।'
              )}
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3.5 sm:p-4 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-gov-navy font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{tr('Resettlement & Cattle Shed Grant', 'विस्थापन एवं पशुशाला अनुदान')}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {tr(
                'One-time transportation grant of ₹50,000 per family and ₹25,000 for cattle shed reconstruction for agricultural families.',
                'प्रति परिवार ₹50,000 का एकमुश्त परिवहन अनुदान तथा कृषक परिवारों हेतु पशुशाला निर्माण के लिए ₹25,000 का अनुदान।'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Village-Level Social Impact Summary */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs uppercase tracking-wide text-slate-700">
          {tr('Village-Level Social & Displacement Impact Breakdown', 'ग्राम-वार सामाजिक एवं विस्थापन प्रभाव विवरण')}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
              <tr>
                <th className="p-3">{t('overview.table_village_tehsil')}</th>
                <th className="p-3">{t('social.affected_families')}</th>
                <th className="p-3">{t('social.displaced_families')}</th>
                <th className="p-3">{tr('Agricultural Laborers', 'कृषि मजदूर')}</th>
                <th className="p-3">{t('social.resettlement_colony')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">{tr('Mahapura (Sanganer)', 'महापुरा (सांगानेर)')}</td>
                <td className="p-3 font-mono">142</td>
                <td className="p-3 font-mono text-amber-800 font-bold">28</td>
                <td className="p-3 font-mono">45</td>
                <td className="p-3 text-emerald-700 font-medium">{tr('Site Identified (Plot Allotment in Progress)', 'स्थल चयनित (भूखंड आवंटन प्रगति पर)')}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">{tr('Bagru Urban (Sanganer)', 'बगरू शहरी (सांगानेर)')}</td>
                <td className="p-3 font-mono">310</td>
                <td className="p-3 font-mono text-red-700 font-bold">84</td>
                <td className="p-3 font-mono">12</td>
                <td className="p-3 text-amber-700 font-medium">{tr('Commercial Shop Relocation Dispute', 'व्यावसायिक दुकान स्थानांतरण विवाद')}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">{tr('Gadota (Dudu)', 'गडोता (दूदू)')}</td>
                <td className="p-3 font-mono">88</td>
                <td className="p-3 font-mono">14</td>
                <td className="p-3 font-mono">32</td>
                <td className="p-3 text-emerald-700 font-medium">{tr('100% Grants Disbursed', '100% अनुदान संवितरित')}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">{tr('Sendra & Kharwa (Beawar)', 'सेंदड़ा एवं खरवा (ब्यावर)')}</td>
                <td className="p-3 font-mono">195</td>
                <td className="p-3 font-mono text-amber-800 font-bold">42</td>
                <td className="p-3 font-mono">68</td>
                <td className="p-3 text-gov-blue font-medium">{tr('Tribal Welfare Cell Special Plan Sanctioned', 'जनजातीय कल्याण प्रकोष्ठ विशेष योजना स्वीकृत')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

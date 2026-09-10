import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Briefcase, TrendingUp, Truck, Users, CheckCircle2 } from 'lucide-react';

export const EmploymentEconomicTab: React.FC = () => {
  const { language, tr, t } = useLanguage();
  const { activeProject } = useProject();

  const emp = activeProject?.employment;
  const eco = activeProject?.economic;

  const pipelineSteps = [
    {
      step: tr('1. PROJECT', '1. परियोजना'),
      title: tr('Expressway Build', 'एक्सप्रेसवे निर्माण'),
      sub: tr('₹3,420 Cr Capital Infusion', '₹3,420 करोड़ पूंजी निवेश')
    },
    {
      step: tr('2. CONNECTIVITY', '2. कनेक्टिविटी'),
      title: tr('18.4% Faster Freight', '18.4% द्रुत गति माल परिवहन'),
      sub: tr('34 Rural Mandis Linked', '34 ग्रामीण मंडियां संयोजित')
    },
    {
      step: tr('3. EMPLOYMENT', '3. रोजगार'),
      title: tr('30,700 Jobs Created', '30,700 रोजगार सृजन'),
      sub: tr('68.5% Local Absorption', '68.5% स्थानीय अवशोषण')
    },
    {
      step: tr('4. COMMERCE', '4. वाणिज्य'),
      title: tr('Industrial Logistics', 'औद्योगिक लॉजिस्टिक्स'),
      sub: tr('Marble, Textile & Cold Storage', 'मार्बल, वस्त्र एवं कोल्ड स्टोरेज')
    },
    {
      step: tr('5. REGIONAL GDP', '5. क्षेत्रीय जीडीपी'),
      title: tr('+₹480 Cr / Year', '+₹480 करोड़ / वर्ष'),
      sub: tr('Jaipur–Ajmer Belt Growth', 'जयपुर-अजमेर बेल्ट संवृद्धि')
    },
    {
      step: tr('6. NATION BUILDING', '6. राष्ट्र निर्माण'),
      title: tr('PM GatiShakti Vision', 'पीएम गतिशक्ति विजन'),
      sub: tr('Balanced Regional Progress', 'संतुलित क्षेत्रीय प्रगति')
    }
  ];

  const tradeTranslations: Record<string, string> = {
    'Civil Construction Workers': 'सिविल निर्माण श्रमिक',
    'Heavy Equipment Operators': 'भारी उपकरण चालक',
    'Surveyors': 'भूमि सर्वेक्षक',
    'Safety Engineers': 'सुरक्षा अभियंता',
    'Material Logistics Staff': 'सामग्री रसद कर्मी',
    'Track Engineers': 'ट्रैक अभियंता',
    'Electrical OHE Specialists': 'विद्युत ओएचई विशेषज्ञ',
    'TBM Operators': 'टीबीएम चालक',
    'Station Architects': 'स्टेशन वास्तुकार',
    'Tunnel Engineers': 'सुरंग अभियंता',
    'Bridge Experts': 'पुल विशेषज्ञ',
    'Marine Environment Technicians': 'समुद्री पर्यावरण तकनीशियन',
    'Heavy Earthmoving Machinery Operators': 'भारी भू-खनन मशीनरी संचालक',
    'Civil Structural Engineers & Surveyors': 'सिविल संरचनात्मक अभियंता एवं सर्वेक्षक',
    'Bridge & Culvert Reinforcement Fitters': 'पुल एवं पुलिया सुदृढीकरण फिटर',
    'Bitumen Paving & Material Technicians': 'बिटुमेन पेविंग एवं सामग्री तकनीशियन',
    'Quality Assurance & Safety Supervisors': 'गुणवत्ता आश्वासन एवं सुरक्षा पर्यवेक्षक',
    'Commercial Truck & Transport Drivers': 'वाणिज्यिक ट्रक एवं परिवहन चालक'
  };

  const sectorTranslations: Record<string, string> = {
    'Textile (Kishangarh)': 'वस्त्र उद्योग (किशनगढ़)',
    'Marble & Granite Logistics': 'संगमरमर एवं ग्रेनाइट रसद',
    'Agri-markets (Dudu/Phagi Mandis)': 'कृषि मंडियां (दूदू/फागी मंडियां)',
    'Tourism Corridor': 'पर्यटन गलियारा',
    'Tourism': 'पर्यटन',
    'Service Sector': 'सेवा क्षेत्र',
    'Smart Logistics Hubs': 'स्मार्ट रसद केंद्र',
    'Mango / Cashew Agro-processing': 'आम / काजू कृषि-प्रसंस्करण',
    'Coastal Tourism': 'तटीय पर्यटन',
    'Fisheries Cold Storage Logistics': 'मत्स्य पालन कोल्ड स्टोरेज रसद',
    'Kishangarh Marble & Granite Industrial Area': 'किशनगढ़ संगमरमर एवं ग्रेनाइट औद्योगिक क्षेत्र',
    'Sanganer Textile & Handicraft Export Belt': 'सांगानेर वस्त्र एवं हस्तशिल्प निर्यात पट्टी',
    'Phagi & Dudu Agro-Processing Mandis': 'फागी एवं दूदू कृषि-प्रसंस्करण मंडियां',
    'Bassi Multi-Modal Logistics & Warehousing Park': 'बस्सी मल्टी-मॉडल लॉजिस्टिक्स एवं वेयरहाउसिंग पार्क',
    'Ajmer Auto-Components & Engineering Hub': 'अजमेर ऑटो-कंपोनेंट्स एवं इंजीनियरिंग हब'
  };

  return (
    <div className="space-y-6">
      
      {/* Top Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{tr('Direct Construction Jobs', 'प्रत्यक्ष निर्माण रोजगार')}</span>
            <Briefcase className="w-4 h-4 text-gov-navy" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {emp?.direct_construction_jobs.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {tr('36-Month Active Build Phase', '36 माह सक्रिय निर्माण चरण')}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-gov-blue">
            <span>{tr('Indirect Supply Chain Jobs', 'अप्रत्यक्ष आपूर्ति श्रृंखला रोजगार')}</span>
            <TrendingUp className="w-4 h-4 text-gov-blue" />
          </div>
          <div className="text-2xl font-bold font-mono text-gov-navy mt-2">
            {emp?.indirect_supply_chain_jobs.toLocaleString()}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {tr('Cement, Steel, Aggregates & Logistics', 'सीमेंट, इस्पात, निर्माण सामग्री एवं लॉजिस्टिक्स')}
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-emerald-800">
            <span>{tr('Total Estimated Jobs', 'कुल अनुमानित रोजगार')}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-950 mt-2">
            {emp?.total_estimated_jobs.toLocaleString()} {tr('Jobs', 'रोजगार')}
          </div>
          <p className="text-xs text-emerald-800 mt-1">
            {emp?.local_worker_absorption_pct}% {tr('Local District Absorption', 'स्थानीय जिला कामगार अवशोषण')}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{tr('Annual Regional GDP Boost', 'वार्षिक क्षेत्रीय GDP वृद्धि')}</span>
            <Truck className="w-4 h-4 text-gov-navy" />
          </div>
          <div className="text-2xl font-bold font-mono text-gov-blue mt-2">
            ₹{eco?.estimated_local_gdp_boost_cr} {tr('Crore', 'करोड़')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {eco?.avg_travel_time_reduction_pct}% {tr('Average Travel Time Savings', 'औसत यात्रा समय में बचत')}
          </p>
        </div>
      </div>

      {/* National Development Impact Flow Visual */}
      <div className="bg-slate-900 text-white rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">
            {tr('Development Impact Pipeline: From Infrastructure to National Growth', 'विकास प्रभाव पाइपलाइन: अवसंरचना से राष्ट्र निर्माण तक')}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {tr('Macro-Economic Simulation', 'वृहद आर्थिक अनुकरण')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-center">
          {pipelineSteps.map((item, idx) => (
            <div key={idx} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex flex-col justify-between">
              <div className="text-[10px] font-bold text-amber-400 tracking-wider mb-1">{item.step}</div>
              <div className="font-bold text-white text-xs">{item.title}</div>
              <div className="text-[11px] text-slate-400 mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade and Sector Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {tr('Key Technical Employment Trades Mobilized', 'प्रमुख तकनीकी रोजगार संवर्ग')}
          </h4>
          <div className="space-y-2 text-xs">
            {emp?.key_employment_trades.map((trade, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-medium text-slate-800">
                  {tr(trade, tradeTranslations[trade] || trade)}
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {tr('Skill Certified', 'कौशल प्रमाणित')}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            * {tr(
                emp?.assumptions_note || 'Estimates based on NSDC and Construction Skill Development Council multipliers.',
                'एनएसडीसी एवं निर्माण कौशल विकास परिषद के गुणांकों पर आधारित अनुमान।'
              )}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {tr('Key Beneficiary Industrial & Agricultural Clusters', 'प्रमुख लाभार्थी औद्योगिक एवं कृषि संकुल')}
          </h4>
          <div className="space-y-2 text-xs">
            {eco?.key_beneficiary_sectors.map((sec, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-medium text-slate-800">
                  {tr(sec, sectorTranslations[sec] || sec)}
                </span>
                <span className="text-gov-blue font-bold">
                  {tr('+24% Logistics Speed', '+24% लॉजिस्टिक्स गति')}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            * {tr(
                eco?.assumptions_note || 'Based on PM GatiShakti Multi-Modal Network database and Indian Input-Output Model 2024.',
                'पीएम गतिशक्ति मल्टी-मॉडल नेटवर्क डेटाबेस एवं भारतीय इनपुट-आउटपुट मॉडल 2024 पर आधारित।'
              )}
          </p>
        </div>
      </div>

    </div>
  );
};

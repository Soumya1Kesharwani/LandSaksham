import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { History, Shield } from 'lucide-react';

export const AuditLogsTab: React.FC = () => {
  const { language, tr, t } = useLanguage();
  const { auditLogs } = useProject();

  const getActionTypeLabel = (action: string) => {
    if (action === 'COURT_CASE_STATUS_CHANGE') return tr('Court Case Status Change', 'न्यायालयीन वाद स्थिति परिवर्तन');
    if (action === 'ASSIGN_ACTION_QUEUE') return tr('Action Queue Assignment', 'कार्य कतार आवंटन');
    if (action.includes('STATUS_UPDATE') || action.includes('UPDATE_ACTION_STATUS')) return tr('Status Update', 'स्थिति अद्यतन');
    if (action.includes('COMPENSATION')) return tr('Compensation Adjustment', 'मुआवजा समायोजन');
    if (action.includes('MUTATION')) return tr('Mutation Entry', 'नामांतरण प्रविष्टि');
    if (action.includes('VERIFICATION')) return tr('Document Verification', 'दस्तावेज सत्यापन');
    return tr(action, action);
  };

  const formatLogValue = (val: string) => {
    if (!val) return '';
    let res = val;
    // Prefix replacements
    res = res.replace(/^Disbursement:\s*/, tr('Disbursement: ', 'संवितरण: '));
    res = res.replace(/^Status:\s*/, tr('Status: ', 'स्थिति: '));
    res = res.replace(/^Assigned:\s*/, tr('Assigned: ', 'आवंटित: '));
    res = res.replace(/^Jamabandi:\s*/, tr('Jamabandi: ', 'जमाबंदी: '));

    // Value replacements
    res = res.replace(/\(Pending\)/g, `(${tr('Pending', 'लंबित')})`);
    res = res.replace(/\(Escrow Deposited\)/g, `(${tr('Escrow Deposited', 'एस्क्रो जमा')})`);
    res = res.replace(/Petition Filed/g, tr('Petition Filed', 'याचिका दायर'));
    res = res.replace(/Interim Stay Granted/g, tr('Interim Stay Granted', 'अंतरिम स्थगनादेश स्वीकृत'));
    res = res.replace(/\(Hearing:\s*/g, `(${tr('Hearing:', 'सुनवाई:')} `);
    res = res.replace(/Unassigned/g, tr('Unassigned', 'अनावंटित'));
    res = res.replace(/Legal Officer & LAO Jaipur/g, t('Legal Officer & LAO Jaipur'));
    res = res.replace(/\(Due:\s*/g, `(${tr('Due:', 'नियत:')} `);
    res = res.replace(/Unverified/g, tr('Unverified', 'असत्यापित'));
    res = res.replace(/Succession inquiry underway \(Form 12-B issued\)/g, tr('Succession inquiry underway (Form 12-B issued)', 'उत्तराधिकार जांच प्रगति पर (प्रपत्र 12-B जारी)'));
    return res;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gov-navy" />
            <h2 className="text-base font-bold text-slate-900">
              {tr('Immutable Governance Audit Trail', 'अपरिवर्तनीय प्रशासनिक ऑडिट ट्रेल (अभिलेख)')}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {tr(
              'Cryptographically timestamped record of all officer modifications, status updates, and compensation adjustments.',
              'सभी अधिकारी संशोधनों, स्थिति अद्यतनों एवं मुआवजा समायोजनों का क्रिप्टोग्राफिक समय-मुद्रित अभिलेख।'
            )}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
          <Shield className="w-4 h-4" />
          <span>{tr('Audit Log Integrity Active', 'ऑडिट लॉग सत्यनिष्ठा सक्रिय')}</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-slate-100 text-slate-700 font-sans font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">{tr('Log ID & Timestamp', 'लॉग आईडी एवं समय-मुहर')}</th>
                <th className="p-3">{tr('Authorized Officer', 'अधिकृत अधिकारी')}</th>
                <th className="p-3">{tr('Action Type', 'कार्रवाई प्रकार')}</th>
                <th className="p-3">{tr('Target Entity & ID', 'लक्षित इकाई एवं आईडी')}</th>
                <th className="p-3">{tr('Value Transition (Before → After)', 'मान परिवर्तन (पूर्व → पश्चात)')}</th>
                <th className="p-3 text-right">{tr('Network IP', 'नेटवर्क आईपी')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="p-3">
                    <div className="font-bold text-gov-navy">{log.id}</div>
                    <div className="text-[11px] text-slate-400">{log.timestamp}</div>
                  </td>
                  <td className="p-3 font-sans text-slate-800">
                    <div className="font-semibold">{t(log.user_name, log.user_name)}</div>
                    <div className="text-[11px] text-slate-500">{t(log.user_role, log.user_role)}</div>
                  </td>
                  <td className="p-3 font-sans">
                    <span className="bg-blue-50 text-gov-blue px-2 py-0.5 rounded border border-blue-200 font-semibold text-[11px]">
                      {getActionTypeLabel(log.action_type)}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">
                    <div className="font-semibold text-slate-900">{t(log.target_entity, log.target_entity)}</div>
                    <div className="text-[11px] text-slate-500">{log.target_id}</div>
                  </td>
                  <td className="p-3 font-sans text-slate-700 max-w-xs">
                    {log.previous_value && (
                      <div className="text-[11px] text-slate-400 line-through">
                        {formatLogValue(log.previous_value)}
                      </div>
                    )}
                    <div className="text-xs font-semibold text-emerald-800">
                      → {formatLogValue(log.new_value)}
                    </div>
                  </td>
                  <td className="p-3 text-right text-slate-400 text-[11px]">
                    {log.ip_address}
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

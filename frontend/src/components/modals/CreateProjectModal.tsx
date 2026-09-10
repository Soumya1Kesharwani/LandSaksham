import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { X, Upload, CheckCircle2, FileText, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateProjectModalProps {
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const { language, tr, t } = useLanguage();
  const { refreshData } = useProject();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Highway / Expressway',
    authority: 'NHAI',
    state: 'Rajasthan',
    districts: 'Jaipur, Ajmer',
    length_km: '120',
    total_cost_cr: '2500',
    total_land_required_acres: '1500',
    description: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...names]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setTimeout(() => {
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">
              {tr('Create New Infrastructure Project', 'नई अवसंरचना परियोजना पंजीकृत करें')}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          {success ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-900">
                {tr('Project Initialized Successfully!', 'परियोजना सफलतापूर्वक पंजीकृत हुई!')}
              </h3>
              <p className="text-slate-500">
                {tr(
                  'AI baseline delay risk modeling and RoR parcel alignment pipelines have been queued.',
                  'एआई विलंब जोखिम मॉडलिंग एवं जमाबंदी पार्सल संरेखन पाइपलाइन कतारबद्ध हैं।'
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700">
                    {tr('Project Name *', 'परियोजना का नाम *')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tr("e.g. Western Dedicated Freight Corridor Sector-3", "उदा. पश्चिमी समर्पित फ्रेट कॉरिडोर सेक्टर-3")}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    {tr('Project Type *', 'परियोजना प्रकार *')}
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-gov-blue outline-none bg-white text-slate-800"
                  >
                    <option value="Highway / Expressway">{tr('Highway / Expressway', 'राजमार्ग / एक्सप्रेसवे')}</option>
                    <option value="High Speed Railway / Metro">{tr('High Speed Railway / Metro', 'हाई-स्पीड रेलवे / मेट्रो')}</option>
                    <option value="Irrigation Canal Network">{tr('Irrigation Canal Network', 'सिंचाई नहर नेटवर्क')}</option>
                    <option value="Airport / Logistics Hub">{tr('Airport / Logistics Hub', 'हवाई अड्डा / लॉजिस्टिक्स हब')}</option>
                    <option value="Industrial Corridor">{tr('Industrial Corridor', 'औद्योगिक गलियारा')}</option>
                    <option value="Renewable Energy Solar Park">{tr('Renewable Energy Solar Park', 'नवीकरणीय सौर ऊर्जा पार्क')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    {tr('Executing Authority *', 'क्रियान्वयन एजेंसी *')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tr("e.g. NHAI, RVNL, State PWD", "उदा. NHAI, RVNL, राज्य पीडब्ल्यूडी")}
                    value={formData.authority}
                    onChange={e => setFormData({ ...formData, authority: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    {tr('State *', 'राज्य *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    {tr('Districts Covered *', 'आच्छादित जिले *')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tr("Comma separated districts", "अल्पविराम द्वारा पृथक जिले")}
                    value={formData.districts}
                    onChange={e => setFormData({ ...formData, districts: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    {tr('Estimated Cost (₹ Crore) *', 'अनुमानित लागत (₹ करोड़) *')}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.total_cost_cr}
                    onChange={e => setFormData({ ...formData, total_cost_cr: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    {tr('Land Required (Acres) *', 'अपेक्षित भूमि (एकड़) *')}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.total_land_required_acres}
                    onChange={e => setFormData({ ...formData, total_land_required_acres: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
                  />
                </div>
              </div>

              {/* File Upload Ingestion */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-gov-blue transition bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-slate-700 block">
                  {tr('Ingest Land Records, DPR, GeoJSON or Survey Files', 'भू-अभिलेख, डीपीआर, GeoJSON या सर्वेक्षण फाइलें अपलोड करें')}
                </span>
                <span className="text-[11px] text-slate-400 block mb-2">
                  {tr(
                    'Supports PDF, Scanned RoR, Excel, CSV, Shapefile / GeoJSON',
                    'पीडीएफ, स्कैन जमाबंदी, एक्सेल, सीएसवी, शेपफाइल / GeoJSON समर्थित'
                  )}
                </span>
                <label className="inline-block bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded cursor-pointer font-semibold shadow-xs">
                  {tr('Browse Files', 'फाइल चुनें')}
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {tr('Staged Files for AI Parsing:', 'एआई विश्लेषण हेतु चुनी गई फाइलें:')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {uploadedFiles.map((fn, idx) => (
                      <span key={idx} className="bg-blue-50 text-gov-blue border border-blue-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {fn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  {tr('Cancel', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded bg-gov-blue text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting 
                    ? tr('Processing & Ingesting...', 'प्रसंस्करण एवं अंतर्ग्रहण जारी...') 
                    : tr('Register Project', 'परियोजना पंजीकृत करें')}
                </button>
              </div>
            </>
          )}
        </form>

      </div>
    </div>
  );
};

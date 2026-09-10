import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Upload, FileText, CheckCircle2, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export const DocumentIntelligenceTab: React.FC = () => {
  const { language, tr } = useLanguage();
  const { setSelectedParcel, parcels } = useProject();

  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const sampleDocuments = [
    {
      id: "DOC-RJ-001",
      filename: "Jamabandi_RoR_Mahapura_Khasra142_1.pdf",
      doc_type: tr("Revenue Land Record (Jamabandi)", "राजस्व भू-अभिलेख (जमाबंदी प्रति)"),
      source: tr("Apna Khata (GoR) / Sub-Registrar Sanganer", "अपना खाता (राजस्थान सरकार) / उप-पंजीयक सांगानेर"),
      pages: 2,
      upload_date: "08-Sep-2026",
      extracted_entities: {
        [tr("Khasra / Survey No", "खसरा / सर्वे संख्या")]: "142/1",
        [tr("Village / Tehsil", "ग्राम / तहसील")]: tr("Mahapura / Sanganer", "महापुरा / सांगानेर"),
        [tr("Recorded Landowner", "पंजीकृत खातेदार")]: tr("Rameshwar Prasad Sharma", "रामेश्वर प्रसाद शर्मा"),
        [tr("Father / Ancestor", "पिता / पूर्वज")]: tr("Late Kishan Lal Sharma", "स्व. किशन लाल शर्मा"),
        [tr("Total Area", "कुल रकबा")]: tr("2.45 Acres (3.92 Bigha)", "2.45 एकड़ (3.92 बीघा)"),
        [tr("Land Classification", "भूमि वर्गीकरण")]: tr("Barani Doyam (Private Agricultural)", "बारानी दोयम (निजी कृषि भूमि)"),
        [tr("Title Encumbrance", "स्वामित्व दायित्व / अड़चन")]: tr("Mutation pending for 2 co-heirs (Form 12-B)", "2 सह-खातेदारों का वारिसाना नामांतरण लंबित (प्रपत्र 12-B)"),
        "OCR Engine Confidence": tr("98.4% High Accuracy", "98.4% उच्च सटीकता")
      }
    },
    {
      id: "DOC-RJ-002",
      filename: "Rajasthan_HC_Stay_Order_WPC_8492_2025.pdf",
      doc_type: tr("Judicial Order / Court Record", "न्यायालयीन आदेश / स्थगनादेश"),
      source: tr("e-Courts National Judicial Data Grid", "ई-कोर्ट्स राष्ट्रीय न्यायिक डेटा ग्रिड"),
      pages: 4,
      upload_date: "06-Sep-2026",
      extracted_entities: {
        [tr("Court Name", "न्यायालय का नाम")]: tr("High Court of Judicature for Rajasthan at Jaipur", "राजस्थान उच्च न्यायालय, जयपुर पीठ"),
        [tr("Writ Petition No", "रिट याचिका संख्या")]: "WP(C) 8492/2025",
        [tr("Petitioner", "याचिकाकर्ता")]: tr("Rameshwar Prasad Sharma & Others", "रामेश्वर प्रसाद शर्मा एवं अन्य"),
        [tr("Respondent", "प्रतिवादी")]: tr("State of Rajasthan & NHAI", "राजस्थान राज्य एवं एनएचएआई"),
        [tr("Order Nature", "आदेश की प्रकृति")]: tr("Interim Status Quo on Physical Possession", "भौतिक कब्जे पर अंतरिम यथास्थिति (Status Quo) आदेश"),
        [tr("Next Listed Date", "आगामी सुनवाई तिथि")]: "24-Sep-2026",
        "OCR Engine Confidence": tr("99.1% High Accuracy", "99.1% उच्च सटीकता")
      }
    },
    {
      id: "DOC-RJ-003",
      filename: "Parivesh_Stage1_Forest_Clearance_Letter.pdf",
      doc_type: tr("Statutory Environmental Clearance", "वैधानिक वन एवं पर्यावरण अनापत्ति"),
      source: tr("MoEFCC PARIVESH Portal", "पर्यावरण मंत्रालय 'परिवेश' पोर्टल"),
      pages: 3,
      upload_date: "02-Sep-2026",
      extracted_entities: {
        [tr("Proposal No", "प्रस्ताव संख्या")]: "FP/RJ/ROAD/48921/2024",
        [tr("Forest Division", "वन मंडल")]: tr("Dudu Forest Division (Rajasthan)", "दूदू वन मंडल (राजस्थान)"),
        [tr("Diverted Area", "अपवर्तित वन क्षेत्र")]: tr("2.90 Hectares", "2.90 हेक्टेयर"),
        [tr("Clearance Status", "अनापत्ति स्थिति")]: tr("Stage-I In-Principle Approved", "चरण-I सैद्धांतिक रूप से स्वीकृत"),
        [tr("Mandatory Conditions", "अनिवार्य शर्तें")]: tr("Compensatory Afforestation on non-forest land in Phagi", "फागी में गैर-वन भूमि पर क्षतिपूरक वनीकरण"),
        "OCR Engine Confidence": tr("97.8% High Accuracy", "97.8% उच्च सटीकता")
      }
    }
  ];

  const currentDoc = sampleDocuments[activeDocIndex];

  const handleVerify = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setVerifiedSuccess(true);
      setTimeout(() => setVerifiedSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded border border-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {tr('Document Intelligence & OCR', 'दस्तावेज आसूचना एवं ओसीआर (OCR)')}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {tr('Entity Extraction Pipeline', 'इकाई निष्कर्षण पाइपलाइन')}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {tr('Automated Land Document Ingestion & Verification Hub', 'स्वचालित भूमि दस्तावेज अंतर्ग्रहण एवं सत्यापन केंद्र')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {tr(
              'Extracts Khasra numbers, landowners, court stay orders, and environmental clearances from scanned PDFs and gazette notices.',
              'स्कैन किए गए पीडीएफ व राजपत्र अधिसूचनाओं से खसरा नंबर, भूस्वामी, न्यायालयीन स्थगनादेश एवं पर्यावरणीय अनापत्ति प्रमाणपत्रों का निष्कर्षण।'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="bg-gov-navy hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 cursor-pointer shadow-sm transition">
            <Upload className="w-3.5 h-3.5" />
            <span>{tr('Upload New Document', 'नया दस्तावेज अपलोड करें')}</span>
            <input
              type="file"
              className="hidden"
              onChange={() => alert(tr('Document uploaded & queued for OCR entity extraction.', 'दस्तावेज सफलतापूर्वक अपलोड हुआ तथा ओसीआर निष्कर्षण हेतु कतारबद्ध है।'))}
            />
          </label>
        </div>
      </div>

      {/* Main Document Viewer & Extractor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document Selector List */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {tr('Ingested Project Documents', 'अंतर्ग्रहीत परियोजना दस्तावेज')} ({sampleDocuments.length})
          </h3>

          <div className="space-y-2">
            {sampleDocuments.map((doc, idx) => (
              <div
                key={doc.id}
                onClick={() => setActiveDocIndex(idx)}
                className={`p-3 rounded-lg border cursor-pointer transition text-xs space-y-1 ${
                  activeDocIndex === idx
                    ? 'border-gov-blue bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="truncate max-w-[180px]">{doc.filename}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                    {doc.pages} {tr('Pages', 'पृष्ठ')}
                  </span>
                </div>
                <div className="text-[11px] text-gov-blue font-medium">{doc.doc_type}</div>
                <div className="text-[10px] text-slate-400">{tr('Source:', 'स्रोत:')} {doc.source}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Extracted Entities Dossier */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gov-navy" />
                <h3 className="font-bold text-slate-900 text-sm">{currentDoc.filename}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {tr('AI extracted fields •', 'एआई निष्कर्षित विवरण •')} <span className="text-emerald-700 font-semibold">{currentDoc.extracted_entities["OCR Engine Confidence"]}</span>
              </p>
            </div>

            <span className="text-[11px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-semibold">
              {tr('AI Extracted — Verify Before Official Use', 'एआई निष्कर्षित — आधिकारिक उपयोग से पूर्व सत्यापन करें')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(currentDoc.extracted_entities).map(([key, val]) => {
              if (key === "OCR Engine Confidence") return null;
              return (
                <div key={key} className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">{key}</span>
                  <strong className="text-slate-900 text-xs mt-0.5 block">{val}</strong>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              {tr('Matches Parcel', 'जीआईएस डेटाबेस में पार्सल')} <strong>RJ-JPR-P127</strong> {tr('in GIS Database.', 'से मेल खाता है।')}
            </span>

            <div className="flex items-center gap-2">
              {verifiedSuccess && (
                <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {tr('Verified & Committed to Record!', 'सत्यापित एवं अभिलेख में दर्ज!')}
                </span>
              )}

              <button
                onClick={handleVerify}
                disabled={isProcessing}
                className="bg-gov-blue hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{tr('Cross-referencing Jamabandi...', 'जमाबंदी मिलान किया जा रहा है...')}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{tr('Officer Verification & Commit', 'अधिकारी सत्यापन एवं अभिलेख प्रविष्टि')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { Upload, FileText, CheckCircle2, AlertCircle, Eye, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export const DocumentIntelligenceTab: React.FC = () => {
  const { t } = useLanguage();
  const { setSelectedParcel, parcels } = useProject();

  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const sampleDocuments = [
    {
      id: "DOC-RJ-001",
      filename: "Jamabandi_RoR_Mahapura_Khasra142_1.pdf",
      doc_type: "Revenue Land Record (Jamabandi)",
      source: "Apna Khata (GoR) / Sub-Registrar Sanganer",
      pages: 2,
      upload_date: "08-Sep-2026",
      extracted_entities: {
        "Khasra / Survey No": "142/1",
        "Village / Tehsil": "Mahapura / Sanganer",
        "Recorded Landowner": "Rameshwar Prasad Sharma",
        "Father / Ancestor": "Late Kishan Lal Sharma",
        "Total Area": "2.45 Acres (3.92 Bigha)",
        "Land Classification": "Barani Doyam (Private Agricultural)",
        "Title Encumbrance": "Mutation pending for 2 co-heirs (Form 12-B)",
        "OCR Engine Confidence": "98.4% High Accuracy"
      }
    },
    {
      id: "DOC-RJ-002",
      filename: "Rajasthan_HC_Stay_Order_WPC_8492_2025.pdf",
      doc_type: "Judicial Order / Court Record",
      source: "e-Courts National Judicial Data Grid",
      pages: 4,
      upload_date: "06-Sep-2026",
      extracted_entities: {
        "Court Name": "High Court of Judicature for Rajasthan at Jaipur",
        "Writ Petition No": "WP(C) 8492/2025",
        "Petitioner": "Rameshwar Prasad Sharma & Others",
        "Respondent": "State of Rajasthan & NHAI",
        "Order Nature": "Interim Status Quo on Physical Possession",
        "Next Listed Date": "24-Sep-2026",
        "OCR Engine Confidence": "99.1% High Accuracy"
      }
    },
    {
      id: "DOC-RJ-003",
      filename: "Parivesh_Stage1_Forest_Clearance_Letter.pdf",
      doc_type: "Statutory Environmental Clearance",
      source: "MoEFCC PARIVESH Portal",
      pages: 3,
      upload_date: "02-Sep-2026",
      extracted_entities: {
        "Proposal No": "FP/RJ/ROAD/48921/2024",
        "Forest Division": "Dudu Forest Division (Rajasthan)",
        "Diverted Area": "2.90 Hectares",
        "Clearance Status": "Stage-I In-Principle Approved",
        "Mandatory Conditions": "Compensatory Afforestation on non-forest land in Phagi",
        "OCR Engine Confidence": "97.8% High Accuracy"
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
              Document Intelligence & OCR
            </span>
            <span className="text-xs text-slate-500 font-mono">Entity Extraction Pipeline</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Automated Land Document Ingestion & Verification Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Extracts Khasra numbers, landowners, court stay orders, and environmental clearances from scanned PDFs and gazette notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="bg-gov-navy hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 cursor-pointer shadow-sm transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Document</span>
            <input type="file" className="hidden" onChange={() => alert("Document uploaded & queued for OCR entity extraction.")} />
          </label>
        </div>
      </div>

      {/* Main Document Viewer & Extractor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document Selector List */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Ingested Project Documents ({sampleDocuments.length})
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
                    {doc.pages} Pages
                  </span>
                </div>
                <div className="text-[11px] text-gov-blue font-medium">{doc.doc_type}</div>
                <div className="text-[10px] text-slate-400">Source: {doc.source}</div>
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
                AI extracted fields • <span className="text-emerald-700 font-semibold">{currentDoc.extracted_entities["OCR Engine Confidence"]}</span>
              </p>
            </div>

            <span className="text-[11px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-semibold">
              AI Extracted — Verify Before Official Use
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
              Matches Parcel <strong>RJ-JPR-P127</strong> in GIS Database.
            </span>

            <div className="flex items-center gap-2">
              {verifiedSuccess && (
                <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified & Committed to Record!
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
                    <span>Cross-referencing Jamabandi...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Officer Verification & Commit</span>
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

# 🏛️ LandSaksham

### Smart India Hackathon 2026 — Flagship AI & GovTech Project

> **Problem Statement**: *Predictive Analytics System for Early Detection of Land Acquisition Delays in Mega Infrastructure Projects*  
> **Core USP**: *"From Reactive Infrastructure Management to Proactive Project Intelligence."*  
> **One-Line Mission**: *Identify land, legal, environmental, social, and economic bottlenecks before they become infrastructure project delays.*

---

## 🏛️ Executive Summary

Infrastructure delays in India often stem from fragmented inter-departmental data: land records (RoR/Khasra) sit in Revenue departments, stay orders sit in e-Courts registries, compensation claims sit in LAO treasuries, and forest clearances sit in MoEFCC PARIVESH.

**LandSaksham** bridges these silos into **one unified project intelligence layer**. It applies Explainable AI (XGBoost + SHAP) to predict delay probability and expected delay duration, simulates candidate alignment alternatives, models macroeconomic employment creation, and provides an interactive AI Officer Copilot alongside a public Citizen Landowner Transparency Portal.

---

## 🚀 Key Modules & Capabilities

1. **GovTech Command Center**: High-trust Indian government design system (NIC / Digital India / PM GatiShakti standard) with live IST time and multi-role simulation (Central, State, District Collector, LAO, Legal, Forest).
2. **Interactive GIS Map**: Leaflet-powered spatial alignment viewer with risk-coded Khasra polygons (🔴 Red=Critical, 🟠 Orange=High, 🟡 Yellow=Medium, 🟢 Green=Low), eco-sensitive forest overlays, and parcel inspection popups.
3. **AI Delay Prediction & Explainability (SHAP)**: Predicts delay probability, risk score, and expected delay days with SHAP waterfall feature attribution. Includes an interactive **What-If Intervention Simulator**.
4. **RFCTLARR 2013 Compensation Valuation**: Full statutory calculation framework (Circle rate × multiplier, 100% Solatium, 12% additional interest, R&R grant, PFMS disbursement ledger).
5. **e-Courts Litigation Tracker**: Dossier of High Court and Tribunal writ petitions, stay order alarms, and AI legal strategy recommendations.
6. **MoEFCC Parivesh Forest & Environmental Clearances**: Forest diversion hectare tracking, tree felling counts, and Stage-I vs Stage-II inactivity alerts.
7. **Social Impact Assessment (SIA) & R&R**: Affected families, displaced persons, Titleholders vs Non-Titleholders, SC/ST safeguards, and resettlement colonies.
8. **Employment & Macro-Economic Impact**: Direct construction jobs (8,500), indirect supply chain jobs (21,000), local absorption ratio, and regional GDP multiplier (+₹480 Cr/year).
9. **Alternative Route Simulator**: Trade-off comparison matrix (Route A vs Route B vs Route C) demonstrating why Route B (Greenfield Bypass) saves ~140 days and reduces household displacement by 68%.
10. **Priority Officer Action Queue**: Transitions AI alerts into actionable administrative workflows (New → In Progress → Resolved) with audit logging.
11. **Document Intelligence & OCR**: Ingests scanned Jamabandi records and PDFs with automated entity extraction (Khasra, owner, court order, compensation).
12. **AI Government Officer Copilot**: RAG-grounded conversational assistant citing exact project files and answering in English, Hindi, and regional languages.
13. **Citizen / Landowner Transparency Portal**: Public tracking interface for landowners to search Khasra numbers and follow a 5-stage acquisition progress timeline.
14. **Multilingual Support (22 Scheduled Languages)**: Full native localization across **all 22 official Indian languages + English** with RTL support for Urdu, Kashmiri, and Sindhi.
15. **Official Dossier Report Generator**: 1-click printable executive report with formal signature blocks.

---

## 🌐 22 Official Indian Languages Support

LandSaksham provides comprehensive, native-script localization across all **22 languages in the 8th Schedule of the Constitution of India**:

- **Devanagari & Indo-Aryan**: हिन्दी (Hindi), मराठी (Marathi), संस्कृतम् (Sanskrit), नेपाली (Nepali), कोंकणी (Konkani), मैथिली (Maithili), डोगरी (Dogri), बड़ो (Bodo)
- **Dravidian**: தமிழ் (Tamil), తెలుగు (Telugu), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam)
- **Eastern & North-Eastern**: বাংলা (Bengali), অসমীয়া (Assamese), ଓଡ଼ିଆ (Odia), মৈতৈলোন্ (Manipuri), संताली (Santali)
- **Western & North-Western**: ગુજરાતી (Gujarati), ਪੰਜਾਬੀ (Punjabi)
- **Perso-Arabic (RTL)**: اردو (Urdu), कश्मीरी (Kashmiri), سنڌي (Sindhi)
- **English**: Standard GovTech English

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Leaflet.js, Canvas Confetti, Vite.
- **Backend**: Python 3.9+, FastAPI, Pydantic v2, Uvicorn, Scikit-Learn/XGBoost formulation, SHAP explainability.
- **Architecture**: Modular Provider Pattern (`/providers/base.py`, `/providers/mock_data_provider.py`) enabling seamless integration of live State government APIs (Bhulekh, Bhoomi, e-Courts NJDG, Parivesh, PM GatiShakti).

---

## 🏃 Quick Start Guide

### 1. Start the FastAPI Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Interactive Swagger API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 2. Start the React Frontend
```bash
cd frontend 
npm install
npm run dev
```
- **Open in Browser**:[http://127.0.0.1:5173/]

---

## 🎯 Demo Walkthrough Script for SIH Judges & Officers

1. **Dashboard & KPIs**:
   - Select Flagship Project: *"Jaipur–Ajmer Integrated Highway Expansion (NH-48 Corridor)"*.
   - Observe **Delay Risk (71% HIGH)** vs **Project Readiness Score (59/100)**.
2. **GIS Project Map**:
   - Open **GIS Map** tab. View color-coded parcels along the 135 km highway.
   - Click **Parcel RJ-JPR-P127** (Red / Critical 87% risk). Click *"Open Full Land Dossier"*.
3. **Deep Parcel Dossier & SHAP**:
   - View Jamabandi owner (*Rameshwar Prasad Sharma*), pending mutation, and ₹1.45 Cr escrow hold.
   - Inspect **AI Risk Factors (SHAP)**: Observe that High Court Stay in WP(C) 8492/2025 contributes +34% to the delay (+110 days).
   - Click *"Assign Task to Revenue / LAO"*.
4. **Alternative Route Simulator**:
   - Open **Route Alternatives** tab.
   - Compare Route A (71% delay risk) vs Route B (31% delay risk). Review AI recommendation verdict.
5. **Employment & Economy**:
   - Open **Employment** tab. Review 29,500 total estimated jobs and 18.4% travel time savings.
6. **AI Officer Copilot**:
   - Click **AI Copilot** in the top header.
   - Click prompt pill *"Why is this project delayed?"* or type in Hindi: *"परियोजना में देरी क्यों हो रही है?"*.
   - Review cited official sources and specific Khasra references.
7. **Citizen Landowner Portal**:
   - Click **Landowner Portal** in top right.
   - Search `RJ-JPR-P127` or Khasra `142/1` to view the 5-stage public progress timeline and grievance desk.
8. **Language Switch**:
   - Toggle **हिन्दी** (or any of the 22 languages) in header to verify full translation of all 15 modules.
9. **Report Generation**:
   - Open **Reports** tab and click *"Download Official PDF Dossier"*.

---

## 📚 Technical Documentation & Integration Guides

- [Government Data & Live API Integration Guide](docs/GOVERNMENT_DATA_INTEGRATION.md)
- [Multilingual Localization & Adding New Indian Languages](docs/I18N_LOCALIZATION_GUIDE.md)

---

*Disclaimer: This prototype uses realistic fictional demonstration datasets and does not expose citizens' private personal records or claim live statutory affiliation with the Government of India.*

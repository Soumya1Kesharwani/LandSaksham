import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import { SUPPORTED_LANGUAGES, LanguageMeta } from '../locales/regionalLanguages';
import { REGIONAL_STRINGS, RegionalCode } from '../locales/regionalDictionary';

export type Language = RegionalCode;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  tr: (enText: string, hiText?: string) => string;
  languages: LanguageMeta[];
  currentLanguageMeta: LanguageMeta;
  isRTL: boolean;
}

const jsonTranslations: Record<string, any> = { en, hi };

// Common phrase dictionary for direct string translation
const commonPhraseMap: Record<string, string> = {
  "CRITICAL": "अति गंभीर",
  "HIGH": "उच्च",
  "MEDIUM": "मध्यम",
  "LOW": "न्यून",
  "Critical": "अति गंभीर",
  "High": "उच्च",
  "Medium": "मध्यम",
  "Low": "न्यून",
  "Optimal": "उत्कृष्ट",
  "Moderate": "मध्यम",
  "Action Req.": "कार्रवाई अपेक्षित",
  "Action Required": "कार्रवाई अपेक्षित",
  "Disbursed": "संवितरित",
  "Pending": "लंबित",
  "Disputed": "विवादित",
  "Verified": "सत्यापित",
  "Under Verification": "सत्यापनाधीन",
  "Under Award Preparation": "पंचाट निर्माण अधीन",
  "Stay Granted": "स्थगनादेश प्रभावी",
  "No Stay": "स्थगन रहित",
  "Stay Vacated": "स्थगनादेश निरस्त",
  "Section 11 Gazette Published": "धारा 11 राजपत्र प्रकाशित",
  "Section 19 Declared": "धारा 19 अधिग्रहण घोषित",
  "Section 23 Form 23 Final": "धारा 23 प्रपत्र 23 अंतिम",
  "Direct Transfer Complete": "प्रत्यक्ष हस्तांतरण पूर्ण",
  "Escrow Hold": "एस्क्रो धारित",
  "Paid / Transferred": "संवितरित / अंतरित",
  "High Risk": "उच्च जोखिम",
  "Critical Risk": "अति गंभीर जोखिम",
  "Moderate Risk": "मध्यम जोखिम",
  "Low Risk": "न्यून जोखिम",
  "Inspect": "निरीक्षण करें",
  "View": "देखें",
  "Close": "बंद करें",
  "Save": "सहेजें",
  "Cancel": "रद्द करें",
  "Submit": "प्रस्तुत करें",
  "All": "सभी",
  "Acres": "एकड़",
  "Days": "दिन",
  "Cr": "करोड़",
  "Jobs": "पद / नौकरियां",
  "Direct Jobs": "प्रत्यक्ष पद",
  "Indirect Jobs": "अप्रत्यक्ष पद",
  "Land & Mutation": "भूमि एवं नामांतरण",
  "Legal & Litigation": "विधिक एवं न्यायालयीन",
  "Compensation Payout": "मुआवजा संवितरण",
  "Forest & Parivesh": "वन एवं परिवेश",
  "R&R Resettlement": "पुनर्वास (R&R)",
  "Documentation": "दस्तावेज़ीकरण",
  "Total Land Required": "कुल आवश्यक भूमि",
  "Private Land (Acquisition)": "निजी भूमि (अधिग्रहण)",
  "Government / Nazul Land": "शासकीय / नजूल भूमि",
  "Forest & Catchment Land": "वन एवं जलग्रहण भूमि",
  "Total Khasra Parcels": "कुल खसरा पार्सल",
  "Parcels at Delay Risk": "विलंब जोखिम वाले पार्सल",
  "Direct Departmental Transfer": "प्रत्यक्ष विभागीय हस्तांतरण",
  "MoEFCC Stage-I/II In Progress": "पर्यावरण मंत्रालय स्टेज-I/II प्रगति पर",
  "Multi-Dimensional Project Health Matrix": "बहुआयामी परियोजना स्वास्थ्य एवं तत्परता मैट्रिक्स",
  "Critical Priority Parcels (High Delay Risk)": "अति महत्वपूर्ण प्राथमिकता पार्सल (उच्च विलंब जोखिम)",
  "Alternative Alignment Recommendation": "वैकल्पिक मार्ग संरेखण अनुशंसा",
  "Statutory Compliance & Land Acquisition Timeline": "वैधानिक अनुपालन एवं भूमि अधिग्रहण समयसीमा",
  "Section 11 (Preliminary):": "धारा 11 (प्रारंभिक अधिसूचना):",
  "Section 19 (Declaration):": "धारा 19 (अधिग्रहण घोषणा):",
  "Section 23 (Award & Valuation):": "धारा 23 (पंचाट एवं मूल्यांकन):",
  "Section 38 (Physical Possession):": "धारा 38 (भौतिक कब्जा):",
  "Gazette Published": "राजपत्र प्रकाशित",
  "Declared": "घोषित",
  "In Progress (68% Disbursed)": "प्रगति पर (68% संवितरित)",
  "Blocked by 4 Judicial Stays": "4 न्यायालयीन स्थगनादेशों द्वारा अवरुद्ध",
  "Launch Route Simulator": "रूट सिम्युलेटर खोलें",
  "Select Project": "परियोजना चुनें",
  "Active Viewport:": "सक्रिय अधिकारी दृश्य:",
  "All permissions active for demonstration": "प्रदर्शन हेतु सभी प्रशासनिक अनुमतियां सक्रिय",
  "+ Register New Infrastructure Project": "+ नई अवसंरचना परियोजना पंजीकृत करें",
  "Landowner Portal": "भूस्वामी पोर्टल",
  "AI Copilot": "एआई कॉपायलट",
  // Landowner Names
  "Marble Industrial Association": "मार्बल इंडस्ट्रियल एसोसिएशन",
  "Rameshwar Prasad Sharma": "रामेश्वर प्रसाद शर्मा",
  "Gopal Singh Shekhawat": "गोपाल सिंह शेखावत",
  "Choudhary Warehousing LLP": "चौधरी वेयरहाउसिंग एलएलपी",
  "State Revenue Dept (GoR)": "राज्य राजस्व विभाग (राज. सरकार)",
  "Rajasthan Forest Department": "राजस्थान वन विभाग",
  "Gram Panchayat Padasoli (Gauchar)": "ग्राम पंचायत पड़ासोली (गौचर)",
  "Bhanwar Lal Gurjar": "भंवर लाल गुर्जर",
  "Kailash Chand Verma": "कैलाश चंद वर्मा",
  "Irrigation Dept / Catchment": "सिंचाई विभाग / जलग्रहण",
  "Devi Singh Rathore": "देवी सिंह राठौड़",
  "Aravalli Protected Forest": "अरावली संरक्षित वन",
  "Resident Representative": "निवासी प्रतिनिधि",
  // Land Types
  "Water Body / Catchment": "जलाशय / जलग्रहण क्षेत्र",
  "Water Body": "जलाशय / जल निकाय",
  "Forest Land": "वन भूमि",
  "Forest": "वन भूमि",
  "Government Land": "शासकीय भूमि",
  "Government": "शासकीय भूमि",
  "Private Agricultural": "निजी कृषि भूमि",
  "Private Commercial": "निजी व्यावसायिक भूमि",
  "Private Residential": "निजी आवासीय भूमि",
  "Community / Grazing (Gauchar)": "सामुदायिक / चरागाह (गौचर)",
  "Community Grazing": "सामुदायिक चरागाह (गौचर)",
  "Other Statutory Land": "अन्य वैधानिक भूमि",
  "Barren / Wasteland": "बंजर भूमि",
  "Barren": "बंजर",
  // Villages, Tehsils, Districts
  "Kharwa": "खरवा",
  "Sendra": "सेंदड़ा",
  "Silora": "सिलोरा",
  "Padasoli": "पड़ासोली",
  "Mokhampura": "मोखमपुरा",
  "Gadota": "गडोता",
  "Mahapura": "महापुरा",
  "Bagru": "बगरू",
  "Kishangarh Rural": "किशनगढ़ ग्रामीण",
  "Gegal": "गेगल",
  "Palra": "पलरा",
  "Sanganer": "सांगानेर",
  "Dudu": "दूदू",
  "Kishangarh": "किशनगढ़",
  "Ajmer": "अजमेर",
  "Beawar": "ब्यावर",
  "Jaipur": "जयपुर",
  // Acquisition Statuses & Stages
  "Section 4 Notification": "धारा 4 अधिसूचना",
  "Section 11 (Preliminary Notification)": "धारा 11 (प्रारंभिक अधिसूचना)",
  "Section 11 Preliminary": "धारा 11 प्रारंभिक अधिसूचना",
  "Section 19 (Declaration of Acquisition)": "धारा 19 (अधिग्रहण घोषणा)",
  "Section 19 Declaration": "धारा 19 अधिग्रहण घोषणा",
  "Section 23 Award Announced": "धारा 23 पंचाट घोषित",
  "Award Announced": "पंचाट घोषित",
  "Valuation Completed": "मूल्यांकन पूर्ण",
  "Compensation Disbursed (80%+)": "मुआवजा संवितरित (80%+)",
  "Compensation Disbursed": "मुआवजा संवितरित",
  "Physical Possession Taken": "भौतिक कब्जा प्राप्त",
  "Possession Taken": "भौतिक कब्जा प्राप्त",
  "Revenue Mutation Recorded": "राजस्व नामांतरण दर्ज",
  // Mutation & Payment Statuses
  "Fully Paid": "पूर्ण भुगतान प्राप्त",
  "Partially Paid": "आंशिक भुगतान",
  "Pending Stage-II": "स्टेज-II लंबित",
  "Alternative Land Identification": "वैकल्पिक भूमि चिन्हीकरण",
  "Tribunal Appeal": "अधिकरण में अपील",
  "Govt Transfer Completed": "शासकीय अंतरण पूर्ण",
  "Hydrology NOC Pending": "जल विज्ञान अनापत्ति लंबित",
  "Stage-I Scrutiny Pending": "स्टेज-I संवीक्षा लंबित",
  "Disputed in Court & Mutation Hold": "न्यायालय में विवादित एवं नामांतरण रोका गया",
  "Mutation Pending (Succession / Title Mismatch in Jamabandi)": "नामांतरण लंबित (जमाबंदी में वारिसाना/स्वामित्व बेमेल)",
  "In Verification": "सत्यापनाधीन",
  // Recommended Actions and Bottleneck Descriptions
  "Final solatium installment awaiting signature.": "अंतिम तोषणा (सोलेशियम) किस्त हस्ताक्षर हेतु प्रतीक्षारत।",
  "Industrial relocation compensation challenge at Ajmer Commissioner court.": "अजमेर संभागीय आयुक्त न्यायालय में औद्योगिक पुनर्वास मुआवजा चुनौती।",
  "R&R housing grant disbursed.": "पुनर्वास एवं पुनर्स्थापन (R&R) आवास अनुदान संवितरित।",
  "Water catchment drain diversion redesign pending at Central Water Commission.": "केंद्रीय जल आयोग में जल निकासी अपवर्तन पुनर्रचना लंबित।",
  "Possession granted without encumbrance.": "बिना किसी भार/विवाद के भौतिक कब्जा प्रदान किया गया।",
  "Eco-sensitive Aravalli Ridge forest clearance requires wildlife mitigation underpass approval.": "पर्यावरण-संवेदनशील अरावली रिज वन अनापत्ति हेतु वन्यजीव शमन अंडरपास स्वीकृति आवश्यक।",
  "Possession complete, ready for civil work.": "कब्जा पूर्ण, सिविल निर्माण कार्य हेतु तैयार।",
  "Commercial structure valuation dispute pending in District Tribunal.": "जिला अधिकरण में व्यावसायिक संरचना मूल्यांकन विवाद लंबित।",
  "Inter-departmental land transfer NOC issued.": "अंतर-विभागीय भूमि अंतरण अनापत्ति प्रमाण पत्र (NOC) जारी।",
  "Parivesh Forest Stage-II tree felling clearance pending since 48 days.": "परिवेश पोर्टल पर स्टेज-II वृक्ष कटाई वन अनापत्ति 48 दिनों से लंबित।",
  "Collector to notify equal compensatory Gauchar grazing land parcel.": "जिला कलेक्टर द्वारा समतुल्य क्षतिपूर्ति गौचर चरागाह भूमि पार्सल अधिसूचित किया जाना है।",
  "Expedite Jamabandi succession mutation at Tehsildar office, re-validate Aadhaar-linked Bank account for escrow disbursement, and file stay vacation plea at High Court.": "तहसीलदार कार्यालय में जमाबंदी वारिसाना नामांतरण में तेजी लाएं, एस्क्रो संवितरण हेतु आधार-लिंक्ड बैंक खाते का सत्यापन करें, और उच्च न्यायालय में स्थगन निरस्त करने की याचिका दायर करें।",
  "1. Tehsildar Sanganer to certify succession mutation.\n2. Submit joint compensation compromise petition in High Court.\n3. Disburse escrowed ₹1.45 Cr solatium.": "1. तहसीलदार सांगानेर वारिसाना नामांतरण प्रमाणित करें।\n2. उच्च न्यायालय में संयुक्त मुआवजा समझौता याचिका प्रस्तुत करें।\n3. एस्क्रो में जमा ₹1.45 करोड़ तोषणा संवितरित करें।",
  "Submit Compensatory Afforestation (CA) GPS boundary verification report to DFO Dudu and deposit Net Present Value (NPV) fund into CAMPA account.": "डीएफओ दूदू को प्रतिपूरक वनीकरण (CA) जीपीएस सीमा सत्यापन रिपोर्ट प्रस्तुत करें और कैम्पा खाते में शुद्ध वर्तमान मूल्य (NPV) निधि जमा करें।",
  "Deposit 80% determined compensation in District Commercial Court to enable LAO to issue Section 38 possession order.": "जिला वाणिज्यिक न्यायालय में निर्धारित 80% मुआवजा जमा करें ताकि भूमि अधिग्रहण अधिकारी धारा 38 कब्जा आदेश जारी कर सके।",
  "District Collector to issue notification assigning Khasra 405/2 (Revenue Waste Land) as replacement Gauchar land.": "जिला कलेक्टर खसरा 405/2 (राजस्व बंजर भूमि) को प्रतिस्थापन गौचर भूमि के रूप में आवंटित करने की अधिसूचना जारी करें।"
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nliis_language') as Language;
    const exists = SUPPORTED_LANGUAGES.some(l => l.code === saved);
    return exists ? saved : 'en';
  });

  const currentLanguageMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isRTL = currentLanguageMeta.dir === 'rtl';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nliis_language', lang);
  };

  // Helper to lookup translation with punctuation handling and normalization
  const getRegionalTranslation = (text: string, targetLang: Language): string | null => {
    if (!text) return null;

    // 1. Direct exact match
    if (REGIONAL_STRINGS[text]?.[targetLang]) {
      return REGIONAL_STRINGS[text]![targetLang]!;
    }

    // 2. Punctuation stripping & preservation (e.g. "Status:", "Loading...", "Title *")
    const match = text.match(/^([\s\W]*)(.*?)([\s\W]*)$/);
    if (match) {
      const [, leading, core, trailing] = match;
      if (core && core !== text && REGIONAL_STRINGS[core]?.[targetLang]) {
        return leading + REGIONAL_STRINGS[core]![targetLang]! + trailing;
      }
    }

    // 3. Trimmed match
    const trimmed = text.trim();
    if (trimmed !== text && REGIONAL_STRINGS[trimmed]?.[targetLang]) {
      return REGIONAL_STRINGS[trimmed]![targetLang]!;
    }

    // 4. Reverse lookup by matching Hindi or English in REGIONAL_STRINGS
    for (const k in REGIONAL_STRINGS) {
      const entry = REGIONAL_STRINGS[k];
      if (entry && (entry.en === text || entry.hi === text || entry.en === trimmed || entry.hi === trimmed)) {
        if (entry[targetLang]) {
          return entry[targetLang]!;
        }
      }
    }

    return null;
  };

  const tr = (enText: string, hiText?: string): string => {
    if (!enText) return '';
    if (language === 'en') return enText;

    // If Hindi, prioritize explicit Hindi text, then dictionary, then common phrase
    if (language === 'hi') {
      if (hiText) return hiText;
      const dictHit = getRegionalTranslation(enText, 'hi');
      if (dictHit) return dictHit;
      if (commonPhraseMap[enText]) return commonPhraseMap[enText];
      return enText;
    }

    // For any non-Hindi regional language (Tamil, Telugu, Bengali, Marathi, Gujarati, etc.):
    // 1. Look up English text in regional dictionary
    const enHit = getRegionalTranslation(enText, language);
    if (enHit) return enHit;

    // 2. If hiText is provided, look up by Hindi text in regional dictionary
    if (hiText) {
      const hiHit = getRegionalTranslation(hiText, language);
      if (hiHit) return hiHit;
    }

    // 3. CRITICAL: NEVER leak Hindi text to non-Hindi regional languages! Fallback to clean English text.
    return enText;
  };

  const t = (key: string, fallback?: string): string => {
    if (!key) return fallback || '';

    // Direct and pure resolution for English language
    if (language === 'en') {
      // 1. Resolve from en.json dot-notation keys
      const keys = key.split('.');
      let result = jsonTranslations['en'];
      let found = true;
      for (const k of keys) {
        if (result && result[k] !== undefined) {
          result = result[k];
        } else {
          found = false;
          break;
        }
      }
      if (found && typeof result === 'string') {
        return result;
      }

      // 2. Check regional dictionary entry for clean English string
      if (REGIONAL_STRINGS[key]?.en) {
        return REGIONAL_STRINGS[key]!.en!;
      }

      // 3. Fallback or key directly
      return fallback || key;
    }

    // 1. Direct match in regional strings dictionary
    const directHit = getRegionalTranslation(key, language);
    if (directHit) return directHit;

    // 2. Direct match in fallback phrase if key didn't match
    if (fallback) {
      const fallbackHit = getRegionalTranslation(fallback, language);
      if (fallbackHit) return fallbackHit;
    }

    // 3. If Hindi, check direct common phrase dictionary and hi.json
    if (language === 'hi') {
      if (commonPhraseMap[key]) return commonPhraseMap[key];
      if (fallback && commonPhraseMap[fallback]) return commonPhraseMap[fallback];
      
      const keys = key.split('.');
      let result = jsonTranslations['hi'];
      let found = true;
      for (const k of keys) {
        if (result && result[k] !== undefined) {
          result = result[k];
        } else {
          found = false;
          break;
        }
      }
      if (found && typeof result === 'string') {
        return result;
      }
      return fallback || key;
    }

    // 4. Resolve English JSON and then look up in regional strings
    const keys = key.split('.');
    let fallbackResult = jsonTranslations['en'];
    let fallbackFound = true;
    for (const fk of keys) {
      if (fallbackResult && fallbackResult[fk] !== undefined) {
        fallbackResult = fallbackResult[fk];
      } else {
        fallbackFound = false;
        break;
      }
    }

    if (fallbackFound && typeof fallbackResult === 'string') {
      const enResolvedHit = getRegionalTranslation(fallbackResult, language);
      if (enResolvedHit) {
        return enResolvedHit;
      }
      return fallbackResult;
    }

    if (fallback) {
      const fallbackHit = getRegionalTranslation(fallback, language);
      if (fallbackHit) {
        return fallbackHit;
      }
      return fallback;
    }

    return key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      tr,
      languages: SUPPORTED_LANGUAGES,
      currentLanguageMeta,
      isRTL
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

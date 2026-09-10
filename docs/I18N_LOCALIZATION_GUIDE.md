# Multilingual Localization & Translation Guide (i18n)

The **National Land & Infrastructure Intelligence System (NLIIS)** features a scalable, data-driven multilingual architecture using standardized JSON language resource dictionaries.

---

## 1. Supported Languages

| Code | Language | Script | Status |
|---|---|---|---|
| `en` | English | Latin | **Active (Default)** |
| `hi` | हिन्दी (Hindi) | Devanagari | **Active** |
| `mr` | मराठी (Marathi) | Devanagari | *Ready for inclusion* |
| `gu` | ગુજરાતી (Gujarati) | Gujarati | *Ready for inclusion* |
| `ta` | தமிழ் (Tamil) | Tamil | *Ready for inclusion* |
| `te` | తెలుగు (Telugu) | Telugu | *Ready for inclusion* |
| `bn` | বাংলা (Bengali) | Bengali | *Ready for inclusion* |

---

## 2. Adding a New Language (e.g., Marathi `mr.json` or Gujarati `gu.json`)

To add a new language dictionary:

### Step 1: Create the Translation Dictionary
Create `frontend/src/locales/mr.json`:

```json
{
  "system": {
    "title": "राष्ट्रीय जमीन आणि पायाभूत सुविधा प्रकल्प बुद्धिमत्ता प्रणाली",
    "subtitle": "जमीन संपादनातील संभाव्य विलंबाच्या पूर्व-ओळखीसाठी भविष्यसूचक विश्लेषण प्रणाली",
    "demo_badge": "स्मार्ट इंडिया हॅकाथॉन २०२६ प्रोटोटाइप — डेमो डेटासेट"
  },
  "nav": {
    "dashboard": "अधिकारी डॅशबोर्ड",
    "projects": "प्रकल्प",
    "land_intelligence": "जमीन आणि भू-मालकी",
    "gis_map": "जीआयएस प्रकल्प नकाशा",
    "compensation": "भरपाई (RFCTLARR २०१३)",
    "legal_cases": "न्यायालयीन प्रकरणे",
    "environmental": "पर्यावरण व वन मंजुरी",
    "social_impact": "सामाजिक प्रभाव आणि पुनर्वसन",
    "employment_economy": "रोजगार आणि अर्थव्यवस्था",
    "route_simulator": "पर्यायी मार्ग सिम्युलेटर",
    "ai_delay_prediction": "एआय विलंब अंदाज आणि SHAP",
    "action_queue": "प्राधान्य कृती रांग"
  },
  "kpis": {
    "active_projects": "सक्रिय प्रकल्प",
    "delay_risk": "एकूण विलंब जोखीम",
    "project_readiness": "प्रकल्प सज्जता निर्देशांक",
    "high_risk_parcels": "उच्च जोखीम पार्सल"
  }
}
```

### Step 2: Register in `LanguageContext.tsx`
Import the new JSON file and update the `Language` type:

```typescript
import mr from '../locales/mr.json';

type Language = 'en' | 'hi' | 'mr';

const translations: Record<Language, any> = { en, hi, mr };
```

### Step 3: Add to Header Toggle
In `frontend/src/components/common/GovHeader.tsx`:

```tsx
<button
  onClick={() => setLanguage('mr')}
  className={`px-2 py-1 rounded ${language === 'mr' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-700'}`}
>
  मराठी
</button>
```

**Zero business logic changes needed.** The translation engine automatically performs fallback to English for any missing keys.

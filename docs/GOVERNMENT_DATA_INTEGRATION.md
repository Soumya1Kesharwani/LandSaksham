# Government Data & API Integration Architecture Guide

The **National Land & Infrastructure Intelligence System (NLIIS)** is designed with a strict separation between **Data Ingestion/Providers** and the **Decision Support Presentation Layer**.

Initially, the platform runs on high-fidelity, realistic Indian mock data (`MockDataProvider`) without exposing personal citizen data. When real government databases and department APIs become available, they can be plugged in directly via the Provider Pattern without redesigning the frontend or backend APIs.

```
┌────────────────────────────────────────────────────────┐
│             NLIIS Presentation Layer (React)           │
└───────────────────────────┬────────────────────────────┘
                            │ REST API Calls
┌───────────────────────────▼────────────────────────────┐
│                  FastAPI Backend Services              │
│       (Analytics, ML Predictor, Copilot, Workflows)    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Abstract Data Provider Layer              │
│         (app/providers/base.py - Base Interfaces)      │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       [Mock Provider]          [Live Government Adapter]
    (MockDataProvider.py)     (GovernmentGovStackProvider.py)
                │                        │
       Realistic Indian          Live Department APIs:
        SIH 2026 Data            • Land Records (Bhulekh / Bhoomi)
                                 • e-Courts NJDG
                                 • MoEFCC PARIVESH
                                 • PFMS / Treasury
                                 • PM GatiShakti GIS
```

---

## 1. Abstract Provider Contracts

All data providers implement the abstract base classes defined in `backend/app/providers/base.py`:

```python
class BaseLandRecordsProvider(ABC):
    @abstractmethod
    def get_parcels_by_project(self, project_id: str) -> List[Parcel]: ...

    @abstractmethod
    def get_parcel_by_id(self, parcel_id: str) -> Optional[Parcel]: ...

    @abstractmethod
    def get_parcel_by_khasra(self, district: str, tehsil: str, village: str, khasra_no: str) -> Optional[Parcel]: ...

class BaseCourtDataProvider(ABC):
    @abstractmethod
    def get_cases_for_parcel(self, parcel_id: str) -> List[CourtCase]: ...

class BaseCompensationProvider(ABC):
    @abstractmethod
    def get_compensation_for_parcel(self, parcel_id: str) -> Optional[CompensationDetail]: ...
```

---

## 2. Steps to Connect Live Government Systems

### Step A: Implement the State Land Records Adapter (e.g. Apna Khata / Bhulekh / Bhoomi)
Create `backend/app/providers/live_land_records_provider.py`:

```python
import requests
from app.providers.base import BaseLandRecordsProvider
from app.models.schemas import Parcel, LandType, AcquisitionStatus, Landowner

class LiveBhulekhLandRecordsProvider(BaseLandRecordsProvider):
    def __init__(self, api_endpoint: str, api_key: str):
        self.api_endpoint = api_endpoint
        self.api_key = api_key

    def get_parcel_by_khasra(self, district: str, tehsil: str, village: str, khasra_no: str) -> Optional[Parcel]:
        # Call State Bhulekh / DILRMP REST/SOAP API
        response = requests.get(
            f"{self.api_endpoint}/v1/jamabandi/query",
            params={"dist": district, "teh": tehsil, "vil": village, "khasra": khasra_no},
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        if response.status_code == 200:
            data = response.json()
            # Map state payload into NLIIS standard Parcel schema
            return Parcel(
                id=f"PARCEL-{data['khasra_id']}",
                khasra_survey_no=data['khasra_no'],
                village=data['village_name'],
                gram_panchayat=data['gram_panchayat'],
                tehsil=data['tehsil_name'],
                district=data['district_name'],
                state="Rajasthan",
                area_acres=float(data['area_in_bigha']) * 0.625,
                land_type=LandType.PRIVATE_AGRICULTURAL,
                owner=Landowner(
                    id=data['owner_khata_no'],
                    name=data['primary_owner_name'],
                    relation="S/o",
                    father_or_spouse_name=data['father_name'],
                    contact_masked="******",
                    address=data['address'],
                    bank_account_verified=bool(data['dbt_status']),
                    aadhaar_seeded=bool(data['aadhaar_linked']),
                    pan_available=True
                ),
                ...
            )
        return None
```

### Step B: Implement e-Courts NJDG Litigation Adapter
Create `backend/app/providers/live_ecourts_provider.py`:

```python
from app.providers.base import BaseCourtDataProvider

class LiveECourtsProvider(BaseCourtDataProvider):
    def __init__(self, cnr_service_url: str):
        self.cnr_service_url = cnr_service_url

    def get_cases_for_parcel(self, parcel_id: str) -> List[CourtCase]:
        # Connect to National Judicial Data Grid (NJDG) Case Status API
        ...
```

### Step C: Switch the Dependency Injection in FastAPI
In `backend/app/routers/projects.py`:

```python
# From:
_data_provider = MockDataProvider()

# To:
_data_provider = LiveGovernmentGovStackProvider(
    land_records_provider=LiveBhulekhLandRecordsProvider(...),
    court_data_provider=LiveECourtsProvider(...),
    parivesh_provider=LiveMoEFCCPariveshProvider(...)
)
```

**Zero frontend changes required.** All 15 tabs, the GIS interactive map, the AI prediction engine, the SHAP explainability visualizer, and the report generator will immediately bind to the live state data.

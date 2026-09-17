import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useProject } from '../../context/ProjectContext';
import { useLanguage } from '../../context/LanguageContext';
import { Parcel, RiskLevel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Layers, Search, Filter, ShieldAlert, Eye, 
  MapPin, CheckCircle, Navigation, ZoomIn, ZoomOut,
  Compass, Droplets, Trees, Home, Sprout, Building, Mountain,
  Train, Map as MapIcon, Globe, X
} from 'lucide-react';

export const GISMapTab: React.FC = () => {
  const { language, tr, t } = useLanguage();
  const { parcels, routes, setSelectedParcel, activeProject } = useProject();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const parcelMarkersRef = useRef<{ [key: string]: L.CircleMarker }>({});

  const [searchMap, setSearchMap] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('CRITICAL');

  // Mobile layout state
  const [activeMobileView, setActiveMobileView] = useState<'map' | 'parcels'>('map');
  const [mobileSelectedParcel, setMobileSelectedParcel] = useState<Parcel | null>(null);

  // Basemap tile provider state
  const [activeBasemap, setActiveBasemap] = useState<'SATELLITE_HYBRID' | 'OPEN_TOPO' | 'OPEN_STREET'>('OPEN_STREET');

  // Spatial Feature Layer Toggles (Default OFF as per settings)
  const [showRiverLayer, setShowRiverLayer] = useState(false);
  const [showForestLayer, setShowForestLayer] = useState(false);
  const [showHousesLayer, setShowHousesLayer] = useState(false);
  const [showAgriLayer, setShowAgriLayer] = useState(false);
  const [showBarrenLayer, setShowBarrenLayer] = useState(false);
  const [showInfraLayer, setShowInfraLayer] = useState(false);
  const [showLandOwnershipLayer, setShowLandOwnershipLayer] = useState(false);

  const [activeRouteId, setActiveRouteId] = useState<string>('ROUTE-A');

  // 1. Initialize Map Instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = [26.65, 75.0]; // Centered on Jaipur-Ajmer corridor
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 9,
        zoomControl: false,
        touchZoom: true
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const baseTileGroup = L.layerGroup().addTo(map);
      baseTileLayerGroupRef.current = baseTileGroup;

      const featureLayerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = featureLayerGroup;

      mapInstanceRef.current = map;
    }

    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Invalidate map size when switching mobile views
  useEffect(() => {
    if (activeMobileView === 'map' && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    }
  }, [activeMobileView]);

  // 2. Update Map Tile Provider based on activeBasemap
  useEffect(() => {
    const map = mapInstanceRef.current;
    const baseGroup = baseTileLayerGroupRef.current;
    if (!map || !baseGroup) return;

    baseGroup.clearLayers();

    if (activeBasemap === 'SATELLITE_HYBRID') {
      // High-Res Satellite Imagery (Esri World Imagery)
      const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Maxar, Earthstar Geographics, USDA, USGS, IGN',
        maxZoom: 19
      });

      // Transportation & Roads Label Overlay
      const esriRoads = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        opacity: 0.90
      });

      // Place Names & Administrative Boundaries Overlay
      const esriLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        opacity: 0.95
      });

      baseGroup.addLayer(esriSat);
      baseGroup.addLayer(esriRoads);
      baseGroup.addLayer(esriLabels);
    } else if (activeBasemap === 'OPEN_TOPO') {
      // Topographic & Rivers Map (OpenTopoMap)
      const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)',
        maxZoom: 17
      });
      baseGroup.addLayer(topo);
    } else {
      // Standard OpenStreetMap
      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      });
      baseGroup.addLayer(osm);
    }
  }, [activeBasemap]);

  // 3. Update Map Feature Layers (Routes, Rivers, Forests, Houses, Agri, Barren, Infra, Parcels)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Route Alignment Polylines
    routes.forEach(route => {
      const isPrimary = route.route_id === 'ROUTE-A' || route.route_id === 'ROUTE-B';
      const polyline = L.polyline(route.coordinates as [number, number][], {
        color: route.is_recommended ? '#10b981' : (route.route_id === 'ROUTE-A' ? '#ef4444' : '#3b82f6'),
        weight: isPrimary ? 6 : 4,
        opacity: isPrimary ? 0.90 : 0.60,
        dashArray: route.route_id === 'ROUTE-C' ? '6, 6' : undefined
      });

      polyline.bindTooltip(`<strong>${route.route_name}</strong><br>Length: ${route.total_length_km} km | Delay Risk: ${(route.delay_probability * 100).toFixed(0)}%`, {
        sticky: true
      });

      polyline.addTo(layerGroup);
    });

    // 2. Draw Rivers & Water Bodies Layer
    if (showRiverLayer) {
      // Bandi River Channel & Floodplain Buffer
      const riverPoly = L.polygon([
        [26.68, 75.05], [26.64, 75.15], [26.60, 75.25], [26.58, 75.32],
        [26.60, 75.34], [26.63, 75.24], [26.67, 75.14], [26.70, 75.04]
      ], {
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.40,
        weight: 2,
        dashArray: '3, 3'
      });
      riverPoly.bindTooltip("<strong>🌊 Bandi River Basin & Hydrological Buffer</strong><br>Water Channel Clearance Zone", { sticky: true });
      riverPoly.addTo(layerGroup);

      // Sambhar Salt Lake Eco-Buffer
      const lakePoly = L.polygon([
        [26.85, 75.10], [26.88, 75.15], [26.92, 75.12], [26.90, 75.05]
      ], {
        color: '#0369a1',
        fillColor: '#0ea5e9',
        fillOpacity: 0.35,
        weight: 1.5
      });
      lakePoly.bindTooltip("<strong>🌊 Sambhar Salt Wetland Eco-Buffer Zone</strong>", { sticky: true });
      lakePoly.addTo(layerGroup);
    }

    // 3. Draw Forest Layer
    if (showForestLayer) {
      // Dudu Protected Forest Zone
      const forestPolygon = L.polygon([
        [26.72, 75.14], [26.65, 75.12], [26.64, 75.25], [26.71, 75.24]
      ], {
        color: '#15803d',
        fillColor: '#22c55e',
        fillOpacity: 0.30,
        weight: 2,
        dashArray: '4, 4'
      });
      forestPolygon.bindTooltip("<strong>🌲 MoEFCC Protected Forest Zone (Dudu Division)</strong><br>Statutory Stage-II Clearance Required", { sticky: true });
      forestPolygon.addTo(layerGroup);

      // Sendra / Aravalli Eco-Sensitive Ridge
      const aravalliPolygon = L.polygon([
        [26.28, 74.15], [26.20, 74.18], [26.22, 74.30], [26.30, 74.28]
      ], {
        color: '#166534',
        fillColor: '#15803d',
        fillOpacity: 0.35,
        weight: 2,
        dashArray: '4, 4'
      });
      aravalliPolygon.bindTooltip("<strong>🌲 Aravalli Eco-Sensitive Sanctuary Corridor</strong><br>Wildlife Mitigation Clearance Zone", { sticky: true });
      aravalliPolygon.addTo(layerGroup);
    }

    // 4. Draw Houses & Residential Habitation Settlement Layer
    if (showHousesLayer) {
      // Bagru Residential Settlement Cluster
      const housesBagru = L.polygon([
        [26.81, 75.54], [26.80, 75.56], [26.78, 75.55], [26.79, 75.52]
      ], {
        color: '#7c3aed',
        fillColor: '#a78bfa',
        fillOpacity: 0.40,
        weight: 2
      });
      housesBagru.bindTooltip("<strong>🏡 Bagru Abadi Village Settlement (Residential Houses)</strong><br>High Household Displacement Risk Zone", { sticky: true });
      housesBagru.addTo(layerGroup);

      // Dudu Residential Houses Zone
      const housesDudu = L.polygon([
        [26.68, 75.22], [26.67, 75.24], [26.65, 75.23], [26.66, 75.20]
      ], {
        color: '#7c3aed',
        fillColor: '#a78bfa',
        fillOpacity: 0.40,
        weight: 2
      });
      housesDudu.bindTooltip("<strong>🏡 Dudu Town Abadi Settlement (Houses & Residential Structures)</strong>", { sticky: true });
      housesDudu.addTo(layerGroup);
    }

    // 5. Draw Agricultural Land Layer
    if (showAgriLayer) {
      const agriPoly = L.polygon([
        [26.74, 75.32], [26.73, 75.42], [26.69, 75.40], [26.70, 75.30]
      ], {
        color: '#65a30d',
        fillColor: '#84cc16',
        fillOpacity: 0.25,
        weight: 1.5
      });
      agriPoly.bindTooltip("<strong>🌾 Mozamabad Irrigated Agricultural Crop Belt</strong><br>Double-Crop Multi-harvest Farmland", { sticky: true });
      agriPoly.addTo(layerGroup);
    }

    // 6. Draw Barren / Wasteland Layer
    if (showBarrenLayer) {
      const barrenPoly = L.polygon([
        [26.60, 74.90], [26.58, 75.02], [26.54, 75.00], [26.55, 74.88]
      ], {
        color: '#d97706',
        fillColor: '#f59e0b',
        fillOpacity: 0.30,
        weight: 1.5,
        dashArray: '2, 4'
      });
      barrenPoly.bindTooltip("<strong>🏜️ Government Uncultivated Barren / Wasteland</strong><br>Optimal Low-Cost Alignment Route", { sticky: true });
      barrenPoly.addTo(layerGroup);
    }

    // 7. Draw Major Infrastructure & Rail Layer
    if (showInfraLayer) {
      // DFCCIL Heavy Rail Line
      const dfcRail = L.polyline([
        [26.90, 75.60], [26.80, 75.45], [26.68, 75.20], [26.55, 74.90], [26.42, 74.60]
      ], {
        color: '#0284c7',
        weight: 4,
        dashArray: '8, 8'
      });
      dfcRail.bindTooltip("<strong>🚆 Dedicated Freight Corridor (DFCCIL Heavy Rail Infrastructure)</strong>", { sticky: true });
      dfcRail.addTo(layerGroup);
    }

    // 8. Filter and Add Parcel Markers & Polygons
    const filteredParcels = parcels.filter(p => {
      if (selectedRiskFilter !== 'ALL' && p.delay_risk_level !== selectedRiskFilter) return false;
      if (searchMap) {
        const s = searchMap.toLowerCase();
        return p.id.toLowerCase().includes(s) ||
               p.khasra_survey_no.toLowerCase().includes(s) ||
               p.village.toLowerCase().includes(s) ||
               p.owner.name.toLowerCase().includes(s);
      }
      return true;
    });

    filteredParcels.forEach(parcel => {
      let color = '#10b981'; // Green default
      const landLower = parcel.land_type.toLowerCase();

      if (showLandOwnershipLayer) {
        if (landLower.includes('government') || landLower.includes('railway') || landLower.includes('public')) {
          color = '#06b6d4'; // Cyan for Government Land
        } else if (landLower.includes('forest')) {
          color = '#15803d'; // Forest Green for Forest Land
        } else if (landLower.includes('residential') || landLower.includes('abadi') || landLower.includes('commercial') || landLower.includes('house')) {
          color = '#8b5cf6'; // Purple for Residential / Houses
        } else if (landLower.includes('barren') || landLower.includes('waste')) {
          color = '#d97706'; // Sandy Brown for Barren Land
        } else if (landLower.includes('agricultural') || landLower.includes('farm')) {
          color = '#10b981'; // Emerald Green for Agricultural Land
        } else {
          color = '#f59e0b'; // Amber for Private Land
        }
      } else {
        if (parcel.delay_risk_level === 'CRITICAL') color = '#dc2626';
        else if (parcel.delay_risk_level === 'HIGH') color = '#ea580c';
        else if (parcel.delay_risk_level === 'MEDIUM') color = '#d97706';
      }

      // Draw Parcel boundary polygon
      if (parcel.polygon_coordinates && parcel.polygon_coordinates.length > 0) {
        const poly = L.polygon(parcel.polygon_coordinates as [number, number][], {
          color: color,
          fillColor: color,
          fillOpacity: 0.55,
          weight: 2
        });
        poly.bindTooltip(`<strong>Khasra ${parcel.khasra_survey_no}</strong> (${t(parcel.land_type, parcel.land_type)})<br>${t(parcel.village, parcel.village)} • ${parcel.area_acres} Acres`, { sticky: true });
        poly.addTo(layerGroup);
      }

      // Add Circle Marker with Tooltip
      const marker = L.circleMarker([parcel.lat, parcel.lng], {
        radius: parcel.delay_risk_score >= 80 ? 10 : 7,
        color: '#ffffff',
        weight: 2,
        fillColor: color,
        fillOpacity: 0.95
      });

      parcelMarkersRef.current[parcel.id] = marker;

      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; padding: 12px; min-width: 250px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: 800; font-size: 13px; color: #0f2942;">${parcel.id}</span>
            <span style="font-size: 11px; font-weight: bold; background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color};">
              ${parcel.delay_risk_score}% ${t(parcel.delay_risk_level)}
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
            <strong>${tr('Khasra', 'खसरा')}:</strong> ${parcel.khasra_survey_no} • ${t(parcel.village, parcel.village)}, ${t(parcel.tehsil, parcel.tehsil)}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
            <strong>${tr('Land Category', 'भूमि श्रेणी')}:</strong> <span style="color: ${color}; font-weight: 700;">${t(parcel.land_type, parcel.land_type)}</span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
            <strong>${tr('Owner', 'भूस्वामी')}:</strong> ${t(parcel.owner.name, parcel.owner.name)} (${parcel.area_acres} ${t('common.acres')})
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            <strong>${tr('Compensation', 'मुआवजा')}:</strong> ${parcel.compensation ? `₹${(parcel.compensation.total_estimated_compensation_inr/100000).toFixed(1)} ${tr('Lakh', 'लाख')} (${t(parcel.compensation.payment_status)})` : 'N/A'}
          </div>
          <div style="font-size: 11px; color: #b91c1c; font-weight: 600; margin-bottom: 8px;">
            ${parcel.top_risk_factors[0]?.factor_name ? t(parcel.top_risk_factors[0]?.factor_name) : t('common.pending')} (+${parcel.expected_delay_days} ${t('common.days')})
          </div>
          <button
            id="btn-inspect-${parcel.id}"
            style="width: 100%; background: #0f2942; color: white; border: none; padding: 6px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;"
          >
            ${t('gis.open_dossier')}
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${parcel.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedParcel(parcel);
          };
        }
      });

      marker.on('click', () => {
        setMobileSelectedParcel(parcel);
      });

      marker.addTo(layerGroup);
    });

  }, [
    parcels, routes, searchMap, selectedRiskFilter, 
    showRiverLayer, showForestLayer, showHousesLayer, showAgriLayer, showBarrenLayer, showInfraLayer, showLandOwnershipLayer,
    activeRouteId, t, tr
  ]);

  const handleZoomToParcel = (parcel: Parcel, openModal = false) => {
    setMobileSelectedParcel(parcel);
    setActiveMobileView('map');
    const map = mapInstanceRef.current;
    if (!map) return;

    if (parcel.polygon_coordinates && parcel.polygon_coordinates.length > 0) {
      const bounds = L.polygon(parcel.polygon_coordinates as [number, number][]).getBounds();
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15, animate: true });
    } else {
      map.setView([parcel.lat, parcel.lng], 15, { animate: true });
    }

    const marker = parcelMarkersRef.current[parcel.id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 350);
    }

    if (openModal) {
      setSelectedParcel(parcel);
    }
  };

  return (
    <div className="space-y-3">
      {/* Mobile Segmented View Switcher: Map View vs Parcel List */}
      <div className="lg:hidden flex items-center bg-slate-200 dark:bg-slate-800/80 p-1 rounded-lg text-xs font-bold shadow-2xs gap-1">
        <button
          onClick={() => setActiveMobileView('map')}
          className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition ${
            activeMobileView === 'map'
              ? 'bg-gov-blue text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>{tr('Spatial Map View', 'स्थानिक मानचित्र दृश्य')}</span>
        </button>
        <button
          onClick={() => setActiveMobileView('parcels')}
          className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition ${
            activeMobileView === 'parcels'
              ? 'bg-gov-blue text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{tr('Khasra Parcels', 'खसरा पार्सल सूची')} ({parcels.length})</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-210px)] min-h-[500px] lg:h-[calc(100vh-140px)] lg:min-h-[650px]">
        
        {/* Left Column: GIS Map Container */}
        <div className={`flex-1 bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden flex-col relative ${
          activeMobileView === 'parcels' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Top Control Bar inside Map */}
          <div className="p-2.5 sm:p-3 bg-white/95 dark:bg-[#111c38]/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            
            {/* Left Controls: Search & Filters */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder={t('common.search_placeholder')}
                  value={searchMap}
                  onChange={e => setSearchMap(e.target.value)}
                  className="pl-8 pr-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded text-xs w-full sm:w-52 bg-white dark:bg-[#0b1329] text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-gov-blue outline-none"
                />
              </div>

              {/* Basemap Switcher Dropdown */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 shrink-0">
                <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <select
                  value={activeBasemap}
                  onChange={e => setActiveBasemap(e.target.value as any)}
                  className="bg-transparent text-[11px] sm:text-xs text-slate-800 dark:text-slate-100 font-bold outline-none cursor-pointer max-w-[110px] xs:max-w-none"
                  title="Select Basemap Provider"
                >
                  <option value="OPEN_STREET" className="dark:bg-slate-900">🗺️ {tr('Standard OSM', 'मानक सड़क')}</option>
                  <option value="SATELLITE_HYBRID" className="dark:bg-slate-900">🛰️ {tr('Satellite Hybrid', 'सैटेलाइट हाइब्रिड')}</option>
                  <option value="OPEN_TOPO" className="dark:bg-slate-900">🏔️ {tr('Topographic', 'टोपोग्राफिक')}</option>
                </select>
              </div>

              <select
                value={selectedRiskFilter}
                onChange={e => setSelectedRiskFilter(e.target.value)}
                className="border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-[11px] sm:text-xs bg-white dark:bg-[#0b1329] text-slate-800 dark:text-slate-100 font-medium shrink-0"
              >
                <option value="ALL">{t('land.all_risk_levels')}</option>
                <option value="CRITICAL">{t('land.critical_filter')}</option>
                <option value="HIGH">{t('land.high_filter')}</option>
                <option value="MEDIUM">{t('land.medium_filter')}</option>
                <option value="LOW">{t('land.low_filter')}</option>
              </select>
            </div>

            {/* Right Controls: Feature Layer Toggles (Horizontal scrolling on mobile) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full flex-nowrap">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                {tr('Layers:', 'परतें:')}
              </span>

              <button
                onClick={() => setShowLandOwnershipLayer(!showLandOwnershipLayer)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition shrink-0 whitespace-nowrap ${
                  showLandOwnershipLayer ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Toggle Govt vs Private Land Khasra Color Mode"
              >
                <Building className="w-3 h-3 shrink-0" />
                <span>{tr('Govt vs Private', 'शासकीय/निजी')}</span>
              </button>

              <button
                onClick={() => setShowRiverLayer(!showRiverLayer)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition shrink-0 whitespace-nowrap ${
                  showRiverLayer ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Toggle River & Water Bodies Layer"
              >
                <Droplets className="w-3 h-3 shrink-0" />
                <span>{tr('Rivers', 'नदियां')}</span>
              </button>

              <button
                onClick={() => setShowForestLayer(!showForestLayer)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition shrink-0 whitespace-nowrap ${
                  showForestLayer ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Toggle Forest & Eco-sensitive Layer"
              >
                <Trees className="w-3 h-3 shrink-0" />
                <span>{tr('Forest', 'वन')}</span>
              </button>

              <button
                onClick={() => setShowHousesLayer(!showHousesLayer)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition shrink-0 whitespace-nowrap ${
                  showHousesLayer ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Toggle Houses & Habitation Layer"
              >
                <Home className="w-3 h-3 shrink-0" />
                <span>{tr('Houses', 'मकान')}</span>
              </button>

              <button
                onClick={() => setShowAgriLayer(!showAgriLayer)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition shrink-0 whitespace-nowrap ${
                  showAgriLayer ? 'bg-lime-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Toggle Agricultural Crop Belt Layer"
              >
                <Sprout className="w-3 h-3 shrink-0" />
                <span>{tr('Agri', 'कृषि')}</span>
              </button>

              <button
                onClick={() => setShowBarrenLayer(!showBarrenLayer)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition shrink-0 whitespace-nowrap ${
                  showBarrenLayer ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Toggle Barren Land Layer"
              >
                <Mountain className="w-3 h-3 shrink-0" />
                <span>{tr('Barren', 'बंजर')}</span>
              </button>

              <button
                onClick={() => setShowInfraLayer(!showInfraLayer)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition shrink-0 whitespace-nowrap ${
                  showInfraLayer ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Toggle Rail & Infra Lines"
              >
                <Train className="w-3 h-3 shrink-0" />
                <span>{tr('Infra', 'इन्फ्रा')}</span>
              </button>
            </div>
          </div>

          {/* Map Canvas */}
          <div ref={mapContainerRef} className="flex-1 w-full h-full relative" />

          {/* Mobile Floating Land-Information Card */}
          {mobileSelectedParcel && (
            <div className="lg:hidden absolute bottom-12 left-2 right-2 z-20 bg-white/95 dark:bg-[#111c38]/95 backdrop-blur-md rounded-xl border border-blue-500/50 shadow-2xl p-3 text-xs space-y-2 animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-gov-navy dark:text-blue-400 text-xs bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                      {mobileSelectedParcel.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {tr('Khasra', 'खसरा')} {mobileSelectedParcel.khasra_survey_no} • {t(mobileSelectedParcel.village, mobileSelectedParcel.village)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t(mobileSelectedParcel.owner.name, mobileSelectedParcel.owner.name)} • {mobileSelectedParcel.area_acres} {tr('Acres', 'एकड़')} • {t(mobileSelectedParcel.land_type, mobileSelectedParcel.land_type)}
                  </div>
                </div>

                <button
                  onClick={() => setMobileSelectedParcel(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded shrink-0"
                  aria-label="Close parcel preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <RiskBadge level={mobileSelectedParcel.delay_risk_level} score={mobileSelectedParcel.delay_risk_score} showScore size="sm" />
                  <span className="text-red-700 dark:text-red-400 font-bold font-mono">
                    +{mobileSelectedParcel.expected_delay_days}d {tr('delay', 'विलंब')}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedParcel(mobileSelectedParcel)}
                  className="px-3 py-1.5 bg-gov-navy dark:bg-blue-600 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{tr('Inspect Dossier', 'डोजियर देखें')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Map Legend */}
          <div className="p-2 sm:p-2.5 bg-white dark:bg-[#111c38] border-t border-slate-200 dark:border-slate-800 z-10 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 gap-1.5 sm:gap-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">{tr('Legend:', 'किंवदंती:')}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> {tr('Govt', 'शासकीय')}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {tr('Private', 'निजी')}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> {tr('Houses', 'मकान')}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {tr('Forest', 'वन')}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-lime-500"></span> {tr('Agri', 'कृषि')}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> {tr('River', 'नदी')}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold"><span className="w-3.5 h-1 bg-emerald-600 inline-block"></span> {tr('Route B (Rec.)', 'रूट B')}</span>
              <span className="flex items-center gap-1 text-red-800 dark:text-red-400 font-semibold"><span className="w-3.5 h-1 bg-red-600 inline-block"></span> {tr('Route A', 'रूट A')}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Parcel List Drawer */}
        <div className={`w-full lg:w-80 bg-white dark:bg-[#111c38] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex-col overflow-hidden ${
          activeMobileView === 'map' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider">{t('land.total_parcels')} ({parcels.length})</h3>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {activeProject?.code || 'NH-48'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2 space-y-1.5">
            {parcels.map(p => (
              <div
                key={p.id}
                onClick={() => handleZoomToParcel(p, false)}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-gov-blue dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 cursor-pointer transition text-xs space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gov-navy dark:text-blue-400 font-mono text-xs">{p.id}</span>
                  <div className="flex items-center gap-1.5">
                    <RiskBadge level={p.delay_risk_level} score={p.delay_risk_score} showScore size="sm" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoomToParcel(p, true);
                      }}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-gov-blue hover:text-white dark:hover:bg-blue-600 text-slate-600 dark:text-slate-300 transition"
                      title={tr('Open Full Dossier Report', 'पूर्ण डोजियर रिपोर्ट खोलें')}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-between">
                  <span>{tr('Khasra', 'खसरा')} {p.khasra_survey_no} • {t(p.village, p.village)}</span>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{p.area_acres} {tr('Acres', 'एकड़')}</span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="truncate max-w-[170px] font-medium">{t(p.owner.name, p.owner.name)}</span>
                  <span className="font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{t(p.land_type, p.land_type)}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 font-mono">Tehsil: {t(p.tehsil, p.tehsil)}</span>
                  <span className="text-red-700 dark:text-red-400 font-bold">
                    +{p.expected_delay_days} {t('common.days')} {tr('delay', 'विलंब')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

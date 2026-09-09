import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useProject } from '../../context/ProjectContext';
import { useLanguage } from '../../context/LanguageContext';
import { Parcel, RiskLevel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Layers, Search, Filter, ShieldAlert, Eye, 
  MapPin, CheckCircle, Navigation, ZoomIn, ZoomOut
} from 'lucide-react';

export const GISMapTab: React.FC = () => {
  const { t } = useLanguage();
  const { parcels, routes, setSelectedParcel, activeProject } = useProject();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [searchMap, setSearchMap] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [selectedLandTypeFilter, setSelectedLandTypeFilter] = useState('ALL');
  const [showForestLayer, setShowForestLayer] = useState(true);
  const [activeRouteId, setActiveRouteId] = useState<string>('ROUTE-A');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = [26.65, 75.0]; // Centered on Jaipur-Ajmer corridor
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 9,
        zoomControl: false
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount if needed
    };
  }, []);

  // Update Map Markers, Routes & Polygons when filters or parcels change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Route Alignment Polylines
    routes.forEach(route => {
      const isSelected = route.route_id === activeRouteId;
      const polyline = L.polyline(route.coordinates as [number, number][], {
        color: route.is_recommended ? '#059669' : (route.route_id === 'ROUTE-A' ? '#dc2626' : '#2563eb'),
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.9 : 0.4,
        dashArray: route.route_id === 'ROUTE-C' ? '6, 6' : undefined
      });

      polyline.bindTooltip(`<strong>${route.route_name}</strong><br>Length: ${route.total_length_km} km | Delay Risk: ${(route.delay_probability * 100).toFixed(0)}%`, {
        sticky: true
      });

      polyline.addTo(layerGroup);
    });

    // 2. Draw Forest & Eco-sensitive Buffer Polygons if enabled
    if (showForestLayer) {
      // Dudu Protected Forest Zone
      const forestPolygon = L.polygon([
        [26.72, 75.14], [26.65, 75.12], [26.64, 75.25], [26.71, 75.24]
      ], {
        color: '#15803d',
        fillColor: '#22c55e',
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: '4, 4'
      });
      forestPolygon.bindTooltip("<strong>MoEFCC Protected Forest Zone (Dudu Division)</strong><br>Statutory Stage-II Clearance Required", { sticky: true });
      forestPolygon.addTo(layerGroup);

      // Sendra / Aravalli Eco-Sensitive Ridge
      const aravalliPolygon = L.polygon([
        [26.28, 74.15], [26.20, 74.18], [26.22, 74.30], [26.30, 74.28]
      ], {
        color: '#b91c1c',
        fillColor: '#ef4444',
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: '4, 4'
      });
      aravalliPolygon.bindTooltip("<strong>Aravalli Eco-Sensitive Sanctuary Corridor</strong><br>Wildlife Mitigation Clearance Zone", { sticky: true });
      aravalliPolygon.addTo(layerGroup);
    }

    // 3. Filter and Add Parcel Markers & Polygons
    const filteredParcels = parcels.filter(p => {
      if (selectedRiskFilter !== 'ALL' && p.delay_risk_level !== selectedRiskFilter) return false;
      if (selectedLandTypeFilter !== 'ALL' && !p.land_type.toLowerCase().includes(selectedLandTypeFilter.toLowerCase())) return false;
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
      let color = '#10b981'; // Green
      if (parcel.delay_risk_level === 'CRITICAL') color = '#dc2626';
      else if (parcel.delay_risk_level === 'HIGH') color = '#ea580c';
      else if (parcel.delay_risk_level === 'MEDIUM') color = '#d97706';

      // Draw Parcel boundary polygon
      if (parcel.polygon_coordinates && parcel.polygon_coordinates.length > 0) {
        const poly = L.polygon(parcel.polygon_coordinates as [number, number][], {
          color: color,
          fillColor: color,
          fillOpacity: 0.45,
          weight: 2
        });
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

      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; padding: 12px; min-width: 240px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: 800; font-size: 13px; color: #0f2942;">${parcel.id}</span>
            <span style="font-size: 11px; font-weight: bold; background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color};">
              ${parcel.delay_risk_score}% ${parcel.delay_risk_level}
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
            <strong>Khasra:</strong> ${parcel.khasra_survey_no} • ${parcel.village}, ${parcel.tehsil}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
            <strong>Owner:</strong> ${parcel.owner.name} (${parcel.area_acres} Acres)
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            <strong>Compensation:</strong> ${parcel.compensation ? `₹${(parcel.compensation.total_estimated_compensation_inr/100000).toFixed(1)} Lakh (${parcel.compensation.payment_status})` : 'N/A'}
          </div>
          <div style="font-size: 11px; color: #b91c1c; font-weight: 600; margin-bottom: 8px;">
            ${parcel.top_risk_factors[0]?.factor_name || 'Documentation hold'} (+${parcel.expected_delay_days} days)
          </div>
          <button
            id="btn-inspect-${parcel.id}"
            style="width: 100%; background: #0f2942; color: white; border: none; padding: 6px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;"
          >
            Open Full Land Dossier
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

      marker.addTo(layerGroup);
    });

  }, [parcels, routes, searchMap, selectedRiskFilter, selectedLandTypeFilter, showForestLayer, activeRouteId]);

  const handleZoomToParcel = (parcel: Parcel) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([parcel.lat, parcel.lng], 14, { animate: true });
      setSelectedParcel(parcel);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[600px]">
      
      {/* Left Column: GIS Map Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col relative">
        
        {/* Top Control Bar inside Map */}
        <div className="p-3 bg-white/95 backdrop-blur-xs border-b border-slate-200 z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search Khasra, Owner, Village..."
                value={searchMap}
                onChange={e => setSearchMap(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs w-56 focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <select
              value={selectedRiskFilter}
              onChange={e => setSelectedRiskFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white font-medium"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical (80%+)</option>
              <option value="HIGH">High (60-79%)</option>
              <option value="MEDIUM">Medium (35-59%)</option>
              <option value="LOW">Low (&lt;35%)</option>
            </select>

            <select
              value={selectedLandTypeFilter}
              onChange={e => setSelectedLandTypeFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white font-medium"
            >
              <option value="ALL">All Land Types</option>
              <option value="agricultural">Agricultural</option>
              <option value="government">Government</option>
              <option value="forest">Forest</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={showForestLayer}
                onChange={e => setShowForestLayer(e.target.checked)}
                className="rounded text-gov-blue"
              />
              <span>Eco-Sensitive & Forest Layers</span>
            </label>
          </div>
        </div>

        {/* Map Canvas */}
        <div ref={mapContainerRef} className="flex-1 w-full h-full relative" />

        {/* Bottom Map Legend */}
        <div className="p-2.5 bg-white border-t border-slate-200 z-10 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-800 uppercase tracking-wide">Risk Heatmap:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Critical (&gt;80%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High (60-79%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium (35-59%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Low (&lt;35%)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-800 font-semibold"><span className="w-4 h-1 bg-emerald-600 inline-block"></span> Route B (AI Recommended)</span>
            <span className="flex items-center gap-1 text-red-800 font-semibold"><span className="w-4 h-1 bg-red-600 inline-block"></span> Route A (Widening)</span>
          </div>
        </div>

      </div>

      {/* Right Column: Interactive Parcel List Drawer */}
      <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider">Alignment Parcels ({parcels.length})</h3>
          </div>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
            NH-48 Jaipur-Ajmer
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1.5">
          {parcels.map(p => (
            <div
              key={p.id}
              onClick={() => handleZoomToParcel(p)}
              className="p-2.5 rounded border border-slate-200 hover:border-gov-blue hover:bg-blue-50/50 cursor-pointer transition text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gov-navy font-mono">{p.id}</span>
                <RiskBadge level={p.delay_risk_level} score={p.delay_risk_score} showScore size="sm" />
              </div>

              <div className="text-slate-700 font-medium">
                Khasra {p.khasra_survey_no} • {p.village}
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{p.owner.name}</span>
                <span>{p.area_acres} Acres</span>
              </div>

              <div className="text-[11px] text-red-700 font-medium truncate pt-1 border-t border-slate-100">
                {p.top_risk_factors[0]?.factor_name || 'Normal progression'} (+{p.expected_delay_days}d)
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

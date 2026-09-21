import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { useProject } from '../../context/ProjectContext';
import { useLanguage } from '../../context/LanguageContext';
import { Parcel, RiskLevel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import {
  Globe, Box, Layers, Search, Filter, Compass, ZoomIn, ZoomOut, RotateCcw,
  Sun, Moon, Trees, Droplets, Home, Sprout, Building, ShieldAlert,
  Landmark, Scale, FileText, CheckCircle, AlertTriangle, ArrowRight,
  Maximize2, Play, Pause, X, Info, Mountain, Activity, Navigation, MapPin, ChevronDown
} from 'lucide-react';

// Ultra-Detailed Placemarks along Jaipur–Ajmer NH-48 Express Corridor
const JAIPUR_AJMER_LANDMARKS = [
  { name: 'Jaipur 200 Ft Bypass Junction', km: '0 KM', lat: 26.8852, lng: 75.7420, role: 'Elevated Expressway Terminal' },
  { name: 'Mahapura Toll Plaza & Logistics', km: '14 KM', lat: 26.8450, lng: 75.6420, role: 'Khasra 142/1 Node' },
  { name: 'Bagru RIICO Industrial Hub', km: '28 KM', lat: 26.8120, lng: 75.5450, role: 'Major Industrial Cluster' },
  { name: 'Gadota Section 19 Agro Zone', km: '46 KM', lat: 26.7550, lng: 75.3850, role: 'Active Acquisition Section' },
  { name: 'Dudu Central Sub-Division', km: '62 KM', lat: 26.6850, lng: 75.2340, role: 'SH-12 & NH-48 Interchange' },
  { name: 'Phulera Junction & DFC Corridor', km: '78 KM', lat: 26.8780, lng: 75.2420, role: 'Western Freight Link' },
  { name: 'Kishangarh Airport & Marble City', km: '98 KM', lat: 26.5820, lng: 74.8650, role: '6-Lane Elevated Flyover' },
  { name: 'Ajmer Taragarh Interchange', km: '135 KM', lat: 26.4680, lng: 74.6380, role: 'Aravalli Valley Gateway' },
  { name: 'Beawar NH-48 Expansion Node', km: '185 KM', lat: 26.1050, lng: 74.3200, role: 'Southern Corridor Terminal' }
];

export const Cesium3DMapTab: React.FC = () => {
  const { parcels, routes, selectedParcel, setSelectedParcel, activeProject, setActiveTab } = useProject();
  const { tr, t } = useLanguage();

  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const entitiesMapRef = useRef<{ [key: string]: Cesium.Entity }>({});
  const highlightedEntityRef = useRef<Cesium.Entity | null>(null);

  // Interactive UI State
  const [hoveredParcel, setHoveredParcel] = useState<Parcel | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [activeRiskFilter, setActiveRiskFilter] = useState<string>('ALL');
  const [activeLandTypeFilter, setActiveLandTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [heightMetric, setHeightMetric] = useState<'delay_days' | 'delay_risk' | 'area'>('delay_days');
  const [activeBasemapStyle, setActiveBasemapStyle] = useState<'AERIAL_LABELS' | 'SATELLITE' | 'TOPO'>('AERIAL_LABELS');
  const [activeViewport, setActiveViewport] = useState<'JAIPUR_AJMER' | 'HIMALAYAS' | 'INDIA_OVERVIEW'>('JAIPUR_AJMER');
  
  // Natural Layer Toggles
  const [showForests, setShowForests] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showCorridorRibbon, setShowCorridorRibbon] = useState<boolean>(true);
  const [showTerrainShadows, setShowTerrainShadows] = useState<boolean>(true);

  // Inspector Drawer State (open by default on desktop, collapsed on mobile)
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [activeInspectorTab, setActiveInspectorTab] = useState<'overview' | 'delay' | 'financial' | 'legal' | 'environment'>('overview');

  // India Geographic Bounding Box: [West, South, East, North]
  const INDIA_RECTANGLE = Cesium.Rectangle.fromDegrees(68.0, 6.5, 97.5, 37.5);

  // Color mapping for Cesium delay levels
  const getCesiumRiskColor = (level: RiskLevel): { color: Cesium.Color; outline: Cesium.Color; css: string } => {
    switch (level) {
      case 'CRITICAL':
        return {
          color: Cesium.Color.fromCssColorString('#ef4444').withAlpha(0.85),
          outline: Cesium.Color.fromCssColorString('#ffffff'),
          css: '#ef4444'
        };
      case 'HIGH':
        return {
          color: Cesium.Color.fromCssColorString('#f97316').withAlpha(0.85),
          outline: Cesium.Color.fromCssColorString('#ffffff'),
          css: '#f97316'
        };
      case 'MEDIUM':
        return {
          color: Cesium.Color.fromCssColorString('#eab308').withAlpha(0.85),
          outline: Cesium.Color.fromCssColorString('#ffffff'),
          css: '#eab308'
        };
      case 'LOW':
      default:
        return {
          color: Cesium.Color.fromCssColorString('#10b981').withAlpha(0.85),
          outline: Cesium.Color.fromCssColorString('#ffffff'),
          css: '#10b981'
        };
    }
  };

  // Filtered parcels list
  const filteredParcels = useMemo(() => {
    return parcels.filter(parcel => {
      if (activeRiskFilter !== 'ALL' && parcel.delay_risk_level !== activeRiskFilter) return false;
      if (activeLandTypeFilter !== 'ALL' && !parcel.land_type.toLowerCase().includes(activeLandTypeFilter.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          parcel.id.toLowerCase().includes(q) ||
          parcel.khasra_survey_no.toLowerCase().includes(q) ||
          parcel.village.toLowerCase().includes(q) ||
          parcel.owner.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [parcels, activeRiskFilter, activeLandTypeFilter, searchQuery]);

  // 1. Initialize Cesium 3D Globe with Aerial Satellite + Labels & India Focus
  useEffect(() => {
    if (!cesiumContainerRef.current || viewerRef.current) return;

    // 1. High-resolution Satellite Base Layer
    const aerialImageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maximumLevel: 19
    });

    // 2. High-contrast Boundaries & Places Overlay (National, State, District, Cities)
    const labelsOverlayProvider = new Cesium.UrlTemplateImageryProvider({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      maximumLevel: 19
    });

    // 3. National Highways, Expressways & Transportation Network Overlay
    const transportationOverlayProvider = new Cesium.UrlTemplateImageryProvider({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
      maximumLevel: 19
    });

    // 4. CartoDB High-Contrast Labels for Local Towns, Tehsils & Villages
    const streetLabelsProvider = new Cesium.UrlTemplateImageryProvider({
      url: 'https://basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
      maximumLevel: 19
    });

    // Detached credit element so no Cesium watermark/token warning banner appears
    const creditContainer = document.createElement('div');

    // Initialize Cesium Viewer with 3D ArcGIS Elevation Terrain and Ultra-Detailed Labelling
    const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
      baseLayer: new Cesium.ImageryLayer(aerialImageryProvider),
      creditContainer: creditContainer,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      sceneModePicker: false,
      shadows: true
    });

    // Add Detailed Multi-Tier Labels & Transportation Overlays
    viewer.imageryLayers.add(new Cesium.ImageryLayer(transportationOverlayProvider));
    viewer.imageryLayers.add(new Cesium.ImageryLayer(labelsOverlayProvider));
    viewer.imageryLayers.add(new Cesium.ImageryLayer(streetLabelsProvider));

    // Enable 3D Terrain via ArcGIS Elevation Server (No token needed, full mountain & ridge 3D relief)
    try {
      viewer.scene.setTerrain(
        new Cesium.Terrain(
          Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(
            "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
          )
        )
      );
    } catch (err) {
      console.warn('ArcGIS Elevation Terrain initialization fallback', err);
    }

    // Globe settings for high visual 3D fidelity & depth
    const globe = viewer.scene.globe;
    globe.enableLighting = true;
    globe.depthTestAgainstTerrain = true;
    globe.showGroundAtmosphere = true;
    globe.atmosphereBrightnessShift = 0.15;
    viewer.scene.fog.enabled = true;
    viewer.scene.fog.density = 0.00012;
    viewer.shadows = true;
    viewer.terrainShadows = Cesium.ShadowMode.ENABLED;

    // Adjust time so scene is lit by sun (from user's Cesium snippet, adapted for India daytime)
    viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2024-05-15T08:30:00Z");

    // Fly camera directly into the Jaipur–Ajmer Corridor with 3D tilt perspective
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(75.18, 26.62, 22000),
      orientation: {
        heading: Cesium.Math.toRadians(38.0),
        pitch: Cesium.Math.toRadians(-30.0),
        roll: 0.0
      },
      duration: 2.5
    });

    // Setup Hover & Click Event Handlers
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // Mouse Move (Hover)
    handler.setInputAction((movement: any) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);
      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.userData) {
        const pData: Parcel = pickedObject.id.userData;
        setHoveredParcel(pData);
        setHoverPosition({ x: movement.endPosition.x, y: movement.endPosition.y });
        cesiumContainerRef.current!.style.cursor = 'pointer';
      } else {
        setHoveredParcel(null);
        setHoverPosition(null);
        if (cesiumContainerRef.current) {
          cesiumContainerRef.current.style.cursor = 'default';
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Mouse Click
    handler.setInputAction((click: any) => {
      const pickedObject = viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.userData) {
        const pData: Parcel = pickedObject.id.userData;
        setSelectedParcel(pData);
        flyToCesiumParcel(pData);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    viewerRef.current = viewer;

    return () => {
      handler.destroy();
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Fly Camera to Indian Project Corridors & Himalayan 3D View
  const flyToCorridor = (location: 'JAIPUR_AJMER' | 'HIMALAYAS' | 'INDIA_OVERVIEW') => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    if (location === 'JAIPUR_AJMER') {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(75.18, 26.62, 24000),
        orientation: {
          heading: Cesium.Math.toRadians(38.0),
          pitch: Cesium.Math.toRadians(-30.0),
          roll: 0.0
        },
        duration: 2.0
      });
    } else if (location === 'HIMALAYAS') {
      // 3D Himalayan / Mt. Everest Perspective from Cesium specification
      const target = new Cesium.Cartesian3(
        300770.50872389384,
        5634912.131394585,
        2978152.2865545116,
      );
      const offset = new Cesium.Cartesian3(
        6344.974098678562,
        -793.3419798081741,
        2499.9508860763162,
      );
      viewer.camera.lookAt(target, offset);
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    } else {
      // Whole India Overview
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(78.96, 22.59, 3200000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-88.0),
          roll: 0.0
        },
        duration: 2.5
      });
    }
  };

  // Fly Camera to Specific Parcel
  const flyToCesiumParcel = (parcel: Parcel) => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(parcel.lng, parcel.lat - 0.015, 3200),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-38.0),
        roll: 0.0
      },
      duration: 1.8
    });
  };

  // 2. Render 3D Extruded Parcels & Natural Layers onto Cesium Globe
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // Clear previous entities
    viewer.entities.removeAll();
    entitiesMapRef.current = {};

    // A. Add 3D Extruded Parcels
    filteredParcels.forEach(parcel => {
      const riskConfig = getCesiumRiskColor(parcel.delay_risk_level);
      const isSelected = selectedParcel?.id === parcel.id;

      // Determine 3D Extrusion Height in meters
      let extrudedHeightMeters = 80;
      if (heightMetric === 'delay_days') {
        extrudedHeightMeters = Math.max(40, (parcel.expected_delay_days / 365) * 550);
      } else if (heightMetric === 'delay_risk') {
        extrudedHeightMeters = Math.max(40, (parcel.delay_risk_score / 100) * 500);
      } else if (heightMetric === 'area') {
        extrudedHeightMeters = Math.max(40, parcel.area_acres * 50);
      }

      // Format polygon hierarchy or create fallback box around parcel lat/lng
      let hierarchyPositions: Cesium.Cartesian3[] = [];
      if (parcel.polygon_coordinates && parcel.polygon_coordinates.length >= 3) {
        hierarchyPositions = parcel.polygon_coordinates.map(coord =>
          Cesium.Cartesian3.fromDegrees(coord[1], coord[0])
        );
      } else {
        const offset = 0.0035;
        hierarchyPositions = [
          Cesium.Cartesian3.fromDegrees(parcel.lng - offset, parcel.lat - offset),
          Cesium.Cartesian3.fromDegrees(parcel.lng + offset, parcel.lat - offset),
          Cesium.Cartesian3.fromDegrees(parcel.lng + offset, parcel.lat + offset),
          Cesium.Cartesian3.fromDegrees(parcel.lng - offset, parcel.lat + offset)
        ];
      }

      const entity = viewer.entities.add({
        id: parcel.id,
        name: `Khasra ${parcel.khasra_survey_no} (${parcel.village})`,
        position: Cesium.Cartesian3.fromDegrees(parcel.lng, parcel.lat, extrudedHeightMeters + 25),
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(hierarchyPositions),
          extrudedHeight: extrudedHeightMeters,
          material: isSelected
            ? Cesium.Color.WHITE.withAlpha(0.95)
            : riskConfig.color,
          outline: true,
          outlineColor: isSelected ? Cesium.Color.WHITE : Cesium.Color.BLACK,
          outlineWidth: isSelected ? 4 : 2,
          shadows: Cesium.ShadowMode.ENABLED
        },
        label: {
          text: `Khasra ${parcel.khasra_survey_no}\n${parcel.expected_delay_days}d Delay`,
          font: 'bold 12px "Inter", sans-serif',
          fillColor: isSelected ? Cesium.Color.WHITE : Cesium.Color.fromCssColorString(riskConfig.css),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -8),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100.0, 45000.0),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        point: {
          pixelSize: parcel.delay_risk_score >= 80 ? 8 : 6,
          color: isSelected ? Cesium.Color.WHITE : Cesium.Color.fromCssColorString(riskConfig.css),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100.0, 60000.0)
        }
      });

      (entity as any).userData = parcel;
      entitiesMapRef.current[parcel.id] = entity;
    });

    // B. Add Natural Protected Forest Layer (MoEFCC Forest Divisions)
    if (showForests) {
      // Dudu Protected Forest Zone (MoEFCC Stage-II Area)
      viewer.entities.add({
        name: 'MoEFCC Protected Forest Zone (Dudu Division)',
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy([
            Cesium.Cartesian3.fromDegrees(75.12, 26.72),
            Cesium.Cartesian3.fromDegrees(75.25, 26.71),
            Cesium.Cartesian3.fromDegrees(75.24, 26.64),
            Cesium.Cartesian3.fromDegrees(75.14, 26.65)
          ]),
          extrudedHeight: 45,
          material: Cesium.Color.fromCssColorString('#15803d').withAlpha(0.55),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#22c55e'),
          outlineWidth: 2
        }
      });

      // Aravalli Eco-Sensitive Ridge
      viewer.entities.add({
        name: 'Aravalli Eco-Sensitive Sanctuary Corridor',
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy([
            Cesium.Cartesian3.fromDegrees(74.15, 26.28),
            Cesium.Cartesian3.fromDegrees(74.28, 26.30),
            Cesium.Cartesian3.fromDegrees(74.30, 26.22),
            Cesium.Cartesian3.fromDegrees(74.18, 26.20)
          ]),
          extrudedHeight: 60,
          material: Cesium.Color.fromCssColorString('#166534').withAlpha(0.55),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#4ade80'),
          outlineWidth: 2
        }
      });
    }

    // C. Add River & Water Channels (Bandi River Basin & Sambhar Wetland)
    if (showRivers) {
      viewer.entities.add({
        name: 'Bandi River Basin Hydrological Buffer',
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy([
            Cesium.Cartesian3.fromDegrees(75.05, 26.68),
            Cesium.Cartesian3.fromDegrees(75.15, 26.64),
            Cesium.Cartesian3.fromDegrees(75.25, 26.60),
            Cesium.Cartesian3.fromDegrees(75.34, 26.60),
            Cesium.Cartesian3.fromDegrees(75.24, 26.63),
            Cesium.Cartesian3.fromDegrees(75.14, 26.67),
            Cesium.Cartesian3.fromDegrees(75.04, 26.70)
          ]),
          extrudedHeight: 20,
          material: Cesium.Color.fromCssColorString('#0284c7').withAlpha(0.7),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#38bdf8'),
          outlineWidth: 2
        }
      });
    }

    // D. Add Infrastructure Corridor Ribbon Track
    if (showCorridorRibbon && routes && routes.length > 0) {
      routes.forEach(route => {
        if (route.coordinates && route.coordinates.length > 0) {
          const corridorPositions = route.coordinates.map(pt =>
            Cesium.Cartesian3.fromDegrees(pt[1], pt[0], 10)
          );

          viewer.entities.add({
            name: route.route_name,
            polyline: {
              positions: corridorPositions,
              width: 6,
              material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.25,
                color: Cesium.Color.fromCssColorString('#38bdf8')
              }),
              clampToGround: true
            }
          });
        }
      });
    }

    // E. Add Ultra-Detailed Jaipur–Ajmer Corridor Landmarks with Clear Badges
    JAIPUR_AJMER_LANDMARKS.forEach(landmark => {
      viewer.entities.add({
        name: `${landmark.name} (${landmark.km})`,
        position: Cesium.Cartesian3.fromDegrees(landmark.lng, landmark.lat, 25),
        point: {
          pixelSize: 8,
          color: Cesium.Color.fromCssColorString('#38bdf8'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
          text: `📍 ${landmark.name}\n[${landmark.km}] • ${landmark.role}`,
          font: 'bold 11px "Inter", sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.fromCssColorString('#020617'),
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString('#070c18').withAlpha(0.88),
          backgroundPadding: new Cesium.Cartesian2(7, 4),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(200.0, 150000.0),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      });
    });
  }, [filteredParcels, selectedParcel, heightMetric, showForests, showRivers, showCorridorRibbon]);

  const activeParcelToInspect = selectedParcel || parcels[0] || null;

  return (
    <div className="relative w-full h-[calc(100vh-130px)] min-h-[680px] bg-[#070c18] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Cesium 3D Canvas Container */}
      <div ref={cesiumContainerRef} className="w-full h-full relative select-none" />

      {/* Floating 3D Hover Tooltip */}
      {hoveredParcel && hoverPosition && (
        <div
          className="absolute pointer-events-none z-30 transition-all duration-75 bg-slate-900/95 backdrop-blur-md border border-slate-700 px-3.5 py-2.5 rounded-xl shadow-2xl text-xs space-y-1"
          style={{
            left: `${hoverPosition.x + 16}px`,
            top: `${hoverPosition.y - 40}px`,
            transform: 'translate(0, -50%)'
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white tracking-wide flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-blue-400" />
              Khasra {hoveredParcel.khasra_survey_no}
            </span>
            <RiskBadge level={hoveredParcel.delay_risk_level} />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300 pt-0.5">
            <div>Village: <strong className="text-white">{hoveredParcel.village}</strong></div>
            <div>Area: <strong className="text-white">{hoveredParcel.area_acres} Ac</strong></div>
            <div>Delay: <strong className="text-red-400">{hoveredParcel.expected_delay_days} Days</strong></div>
            <div>Risk Score: <strong className="text-amber-400">{hoveredParcel.delay_risk_score}%</strong></div>
          </div>
          <p className="text-[10px] text-cyan-300 font-medium pt-1 flex items-center gap-1">
            <span>🎯 Click parcel to inspect full dossier</span>
          </p>
        </div>
      )}

      {/* Top Left Floating Header HUD: Mode & Legend */}
      {/* Top Left Floating Controls: Viewport Presets & Legend */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-auto">
        {/* 3D Viewport Presets Single Dropdown */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800/90 px-3 py-2 rounded-xl shadow-xl flex items-center gap-2 max-w-[320px]">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
            <span>🇮🇳</span> Presets:
          </span>
          <div className="relative flex items-center flex-1 min-w-0">
            <select
              value={activeViewport}
              onChange={(e) => {
                const val = e.target.value as 'JAIPUR_AJMER' | 'HIMALAYAS' | 'INDIA_OVERVIEW';
                setActiveViewport(val);
                flyToCorridor(val);
              }}
              className="w-full bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold py-1.5 pl-2.5 pr-7 rounded-lg border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none truncate transition-all"
            >
              <option value="JAIPUR_AJMER">Jaipur–Ajmer NH-48 (135 KM)</option>
              <option value="HIMALAYAS">Himalayas / Mt. Everest (8,848 M)</option>
              <option value="INDIA_OVERVIEW">All India National Overview</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* Distinct Delay-Level Colors Legend */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800/90 p-3 rounded-xl shadow-xl space-y-1.5 max-w-[280px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>3D Delay Height & Color Code</span>
            <span className="text-slate-500">{filteredParcels.length} Parcels</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => setActiveRiskFilter(activeRiskFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all border ${
                activeRiskFilter === 'CRITICAL' ? 'bg-red-950/80 border-red-500' : 'bg-slate-800/40 border-transparent hover:border-slate-700'
              }`}
            >
              <span className="w-3 h-3 rounded-sm bg-red-500 shadow-xs shadow-red-500/50 shrink-0"></span>
              <span className="text-red-200 font-medium truncate">Critical (&gt;300d)</span>
            </button>
            <button
              onClick={() => setActiveRiskFilter(activeRiskFilter === 'HIGH' ? 'ALL' : 'HIGH')}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all border ${
                activeRiskFilter === 'HIGH' ? 'bg-orange-950/80 border-orange-500' : 'bg-slate-800/40 border-transparent hover:border-slate-700'
              }`}
            >
              <span className="w-3 h-3 rounded-sm bg-orange-500 shadow-xs shadow-orange-500/50 shrink-0"></span>
              <span className="text-orange-200 font-medium truncate">High (150–299d)</span>
            </button>
            <button
              onClick={() => setActiveRiskFilter(activeRiskFilter === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all border ${
                activeRiskFilter === 'MEDIUM' ? 'bg-amber-950/80 border-amber-500' : 'bg-slate-800/40 border-transparent hover:border-slate-700'
              }`}
            >
              <span className="w-3 h-3 rounded-sm bg-amber-500 shadow-xs shadow-amber-500/50 shrink-0"></span>
              <span className="text-amber-200 font-medium truncate">Medium (60–149d)</span>
            </button>
            <button
              onClick={() => setActiveRiskFilter(activeRiskFilter === 'LOW' ? 'ALL' : 'LOW')}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all border ${
                activeRiskFilter === 'LOW' ? 'bg-emerald-950/80 border-emerald-500' : 'bg-slate-800/40 border-transparent hover:border-slate-700'
              }`}
            >
              <span className="w-3 h-3 rounded-sm bg-emerald-500 shadow-xs shadow-emerald-500/50 shrink-0"></span>
              <span className="text-emerald-200 font-medium truncate">Cleared / Low</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Right Floating Toolbar: Camera Controls, Height Metric & View Modes */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Height Extrusion Metric Dropdown */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold shrink-0">3D Height:</span>
          <div className="relative flex items-center">
            <select
              value={heightMetric}
              onChange={(e) => setHeightMetric(e.target.value as 'delay_days' | 'delay_risk' | 'area')}
              className="bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold py-1 pl-2.5 pr-7 rounded-lg border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none transition-all"
            >
              <option value="delay_days">Delay Days</option>
              <option value="delay_risk">Risk %</option>
              <option value="area">Land Area</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* Toggle Inspector Drawer */}
        <button
          onClick={() => setInspectorOpen(!inspectorOpen)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
            inspectorOpen
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          {inspectorOpen ? 'Hide Details' : 'Parcel Details'}
        </button>
      </div>

      {/* Bottom Left Floating Layer Control Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-xl pointer-events-auto">
        <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
          <Layers className="w-3 h-3 text-blue-400" /> Layers:
        </span>
        <button
          onClick={() => setShowRivers(!showRivers)}
          className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all flex items-center gap-1 border ${
            showRivers ? 'bg-sky-950/80 text-sky-300 border-sky-500/50' : 'bg-slate-800/40 text-slate-400 border-transparent hover:border-slate-700'
          }`}
        >
          <Droplets className="w-3 h-3" /> River Channels
        </button>
        <button
          onClick={() => setShowForests(!showForests)}
          className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all flex items-center gap-1 border ${
            showForests ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' : 'bg-slate-800/40 text-slate-400 border-transparent hover:border-slate-700'
          }`}
        >
          <Trees className="w-3 h-3" /> Forest Divisions
        </button>
        <button
          onClick={() => setShowCorridorRibbon(!showCorridorRibbon)}
          className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all flex items-center gap-1 border ${
            showCorridorRibbon ? 'bg-blue-950/80 text-blue-300 border-blue-500/50' : 'bg-slate-800/40 text-slate-400 border-transparent hover:border-slate-700'
          }`}
        >
          <Building className="w-3 h-3" /> Alignment Corridor
        </button>
      </div>

      {/* RIGHT SIDEBAR: Comprehensive 3D Tactile Parcel Inspector HUD */}
      {inspectorOpen && activeParcelToInspect && (
        <div className="absolute top-4 right-4 bottom-4 w-[410px] z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-200">
          {/* Inspector Header */}
          <div className="p-4 border-b border-slate-800/90 bg-slate-950/40 flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                  {activeParcelToInspect.id}
                </span>
                <RiskBadge level={activeParcelToInspect.delay_risk_level} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Khasra No. {activeParcelToInspect.khasra_survey_no}
              </h3>
              <p className="text-xs text-slate-400">
                {activeParcelToInspect.village}, Tehsil {activeParcelToInspect.tehsil}, {activeParcelToInspect.district}
              </p>
            </div>
            <button
              onClick={() => setInspectorOpen(false)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Inspector Navigation Sub-Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/20 px-2">
            <button
              onClick={() => setActiveInspectorTab('overview')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeInspectorTab === 'overview'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Land & Depth
            </button>
            <button
              onClick={() => setActiveInspectorTab('delay')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeInspectorTab === 'delay'
                  ? 'border-red-500 text-red-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Delay SHAP
            </button>
            <button
              onClick={() => setActiveInspectorTab('financial')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeInspectorTab === 'financial'
                  ? 'border-emerald-500 text-emerald-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              RFCTLARR
            </button>
            <button
              onClick={() => setActiveInspectorTab('legal')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeInspectorTab === 'legal'
                  ? 'border-purple-500 text-purple-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              e-Courts
            </button>
            <button
              onClick={() => setActiveInspectorTab('environment')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeInspectorTab === 'environment'
                  ? 'border-teal-500 text-teal-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Forest/Env
            </button>
          </div>

          {/* Inspector Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {activeInspectorTab === 'overview' && (
              <>
                {/* 3D Depth & Delay Highlight Metric Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-slate-300">
                      <Activity className="w-3.5 h-3.5 text-red-400" />
                      3D Cesium Delay Height
                    </span>
                    <span className="font-mono text-cyan-400">Score: {activeParcelToInspect.delay_risk_score}%</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-red-400">
                        {activeParcelToInspect.expected_delay_days}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">Days Expected Delay</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-amber-400">
                        {(activeParcelToInspect.delay_probability * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">Probability</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        activeParcelToInspect.delay_risk_level === 'CRITICAL'
                          ? 'bg-red-500'
                          : activeParcelToInspect.delay_risk_level === 'HIGH'
                          ? 'bg-orange-500'
                          : activeParcelToInspect.delay_risk_level === 'MEDIUM'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${activeParcelToInspect.delay_risk_score}%` }}
                    />
                  </div>
                </div>

                {/* Revenue & Land Record Attributes */}
                <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    Land Classification & Area
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400 block">Area (Acres)</span>
                      <span className="font-bold text-white text-sm">{activeParcelToInspect.area_acres} Acres</span>
                      <span className="text-[10px] text-slate-500 block">({(activeParcelToInspect.area_acres * 0.4046).toFixed(2)} Ha)</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400 block">Land Type</span>
                      <span className="font-bold text-cyan-300 text-xs">{activeParcelToInspect.land_type}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400 block">Acquisition Status</span>
                      <span className="font-semibold text-amber-300">{activeParcelToInspect.acquisition_status}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400 block">Possession Acquired</span>
                      <span className="font-bold text-white">{activeParcelToInspect.possession_percentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Landowner & KYC Status */}
                <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    Landowner Records & Verification
                  </h4>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Primary Owner:</span>
                      <span className="font-bold text-white">{activeParcelToInspect.owner.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Relation / Parentage:</span>
                      <span className="text-slate-300">{activeParcelToInspect.owner.father_or_spouse_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Co-owners Count:</span>
                      <span className="text-slate-300">{activeParcelToInspect.co_owners_count} Co-sharers</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        activeParcelToInspect.owner.bank_account_verified
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-red-950/80 text-red-300 border-red-800'
                      }`}>
                        <CheckCircle className="w-3 h-3" />
                        {activeParcelToInspect.owner.bank_account_verified ? 'Bank KYC Verified' : 'Bank Unverified'}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        activeParcelToInspect.owner.aadhaar_seeded
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950/80 text-amber-300 border-amber-800'
                      }`}>
                        <CheckCircle className="w-3 h-3" />
                        {activeParcelToInspect.owner.aadhaar_seeded ? 'Aadhaar Seeded' : 'Aadhaar Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statutory AI Action Directive */}
                <div className="bg-blue-950/40 border border-blue-800/80 p-3 rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Recommended Officer Directive
                  </span>
                  <p className="text-[11px] text-blue-100 leading-relaxed font-medium">
                    {activeParcelToInspect.recommended_action}
                  </p>
                </div>
              </>
            )}

            {activeInspectorTab === 'delay' && (
              <div className="space-y-3">
                <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-2">
                  <h4 className="font-bold text-white text-xs">Top AI Risk Contributors (SHAP Explainability)</h4>
                  <div className="space-y-2">
                    {activeParcelToInspect.top_risk_factors?.map((factor, idx) => (
                      <div key={idx} className="bg-slate-900/80 p-2.5 rounded-lg space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-slate-200">{factor.factor_name}</span>
                          <span className="text-red-400 font-mono font-bold">+{factor.impact_days} Days</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{factor.description}</p>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-red-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, factor.importance_score * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeInspectorTab === 'financial' && activeParcelToInspect.compensation && (
              <div className="space-y-3">
                <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-2.5">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                    RFCTLARR 2013 Compensation Financials
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400 block">Total Compensation</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        ₹{(activeParcelToInspect.compensation.total_estimated_compensation_inr / 100000).toFixed(2)} Lakhs
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400 block">Base Land Value</span>
                      <span className="font-semibold text-white">
                        ₹{(activeParcelToInspect.compensation.base_land_value_inr / 100000).toFixed(2)} L
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400 block">100% Solatium Grant</span>
                      <span className="font-semibold text-white">
                        ₹{(activeParcelToInspect.compensation.solatium_100_pct_inr / 100000).toFixed(2)} L
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400 block">Disbursed Amount</span>
                      <span className="font-bold text-emerald-400">
                        ₹{(activeParcelToInspect.compensation.amount_disbursed_inr / 100000).toFixed(2)} L
                      </span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Disbursement Progress</span>
                      <span className="font-bold text-white">{activeParcelToInspect.compensation.disbursement_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${activeParcelToInspect.compensation.disbursement_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeInspectorTab === 'legal' && (
              <div className="space-y-3">
                {activeParcelToInspect.legal_case ? (
                  <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-purple-400" />
                        e-Courts Litigation Case
                      </h4>
                      {activeParcelToInspect.legal_case.has_stay_order && (
                        <span className="bg-red-950 text-red-300 border border-red-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          STAY ORDER ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div>Case No: <strong className="text-white">{activeParcelToInspect.legal_case.case_number}</strong></div>
                      <div>Court: <span className="text-slate-300">{activeParcelToInspect.legal_case.court_name}</span></div>
                      <div>Petitioner: <span className="text-slate-300">{activeParcelToInspect.legal_case.petitioner}</span></div>
                      <div>Next Hearing: <strong className="text-amber-400">{activeParcelToInspect.legal_case.next_hearing_date}</strong></div>
                    </div>
                    <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <strong>Order Summary:</strong> {activeParcelToInspect.legal_case.last_order_summary}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                    <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                    No active legal disputes or court stay orders on this parcel.
                  </div>
                )}
              </div>
            )}

            {activeInspectorTab === 'environment' && (
              <div className="space-y-3">
                {activeParcelToInspect.environmental ? (
                  <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-2.5">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Trees className="w-3.5 h-3.5 text-emerald-400" />
                      Parivesh Statutory Clearances
                    </h4>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Forest Overlap:</span>
                        <span className="font-bold text-white">
                          {activeParcelToInspect.environmental.overlaps_forest ? `Yes (${activeParcelToInspect.environmental.forest_diversion_area_ha} Ha)` : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Clearance Stage:</span>
                        <span className="text-amber-300 font-semibold">{activeParcelToInspect.environmental.statutory_clearance_stage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Eco-Sensitive Zone:</span>
                        <span className="text-slate-300">{activeParcelToInspect.environmental.in_eco_sensitive_zone ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Waterbody Overlap:</span>
                        <span className="text-slate-300">{activeParcelToInspect.environmental.waterbody_overlap ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                    <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                    No statutory environmental or forest clearance bottlenecks.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Inspector Footer Actions */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedParcel(activeParcelToInspect);
                setActiveTab('land');
              }}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Open Full Land Dossier
            </button>
            <button
              onClick={() => flyToCesiumParcel(activeParcelToInspect)}
              title="Fly camera to this parcel on Cesium globe"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all"
            >
              <Maximize2 className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

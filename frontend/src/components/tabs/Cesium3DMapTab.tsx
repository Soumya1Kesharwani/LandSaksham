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

// 3D Cinematic Drone Flyover Waypoints along NH-48 Express Corridor
const FLYOVER_WAYPOINTS = [
  {
    name: 'Jaipur 200 Ft Bypass Junction',
    km: 'KM 0.0',
    lat: 26.8852,
    lng: 75.7420,
    height: 3600,
    heading: 42.0,
    pitch: -32.0,
    speedKmh: 280,
    riskLevel: 'LOW' as RiskLevel,
    bottleneck: 'Expressway terminal linking Jaipur Outer Ring Road & NH-48 corridor'
  },
  {
    name: 'Mahapura Toll Plaza & Logistics Hub',
    km: 'KM 14.0',
    lat: 26.8450,
    lng: 75.6420,
    height: 1950,
    heading: 52.0,
    pitch: -28.0,
    speedKmh: 330,
    riskLevel: 'CRITICAL' as RiskLevel,
    bottleneck: 'High Court stay on Khasra 142/1; 42 commercial structures in corridor'
  },
  {
    name: 'Bagru RIICO Industrial Interchange',
    km: 'KM 28.0',
    lat: 26.8120,
    lng: 75.5450,
    height: 2200,
    heading: 58.0,
    pitch: -30.0,
    speedKmh: 370,
    riskLevel: 'HIGH' as RiskLevel,
    bottleneck: 'Industrial viaduct corridor; 13 pending utility gas and water pipeline relocations'
  },
  {
    name: 'Gadota Section 19 Agro Zone',
    km: 'KM 46.0',
    lat: 26.7550,
    lng: 75.3850,
    height: 2450,
    heading: 62.0,
    pitch: -27.0,
    speedKmh: 390,
    riskLevel: 'MEDIUM' as RiskLevel,
    bottleneck: 'Section 19 notification complete; 88% direct DBT compensation payout rate'
  },
  {
    name: 'Dudu Central Sub-Division & SH-12',
    km: 'KM 62.0',
    lat: 26.6850,
    lng: 75.2340,
    height: 2700,
    heading: 58.0,
    pitch: -31.0,
    speedKmh: 420,
    riskLevel: 'LOW' as RiskLevel,
    bottleneck: 'State Highway 12 crossway interchange and designated emergency airstrip'
  },
  {
    name: 'Phulera Junction & DFC Freight Link',
    km: 'KM 78.0',
    lat: 26.8780,
    lng: 75.2420,
    height: 3000,
    heading: 65.0,
    pitch: -28.0,
    speedKmh: 410,
    riskLevel: 'LOW' as RiskLevel,
    bottleneck: 'Western Dedicated Freight Corridor (DFC) rail overbridge grade separation'
  },
  {
    name: 'Kishangarh Marble City Viaduct',
    km: 'KM 98.0',
    lat: 26.5820,
    lng: 74.8650,
    height: 2350,
    heading: 50.0,
    pitch: -28.0,
    speedKmh: 360,
    riskLevel: 'HIGH' as RiskLevel,
    bottleneck: 'Dense commercial marble market zone; elevated 6-lane bypass viaduct works'
  },
  {
    name: 'Ajmer Taragarh Gateway Interchange',
    km: 'KM 135.0',
    lat: 26.4680,
    lng: 74.6380,
    height: 3200,
    heading: 42.0,
    pitch: -34.0,
    speedKmh: 310,
    riskLevel: 'MEDIUM' as RiskLevel,
    bottleneck: 'Aravalli mountain valley tunnel approach and southern bypass terminal'
  }
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

  const [inspectorMode, setInspectorMode] = useState<'list' | 'detail'>('list');
  const [detailParcel, setDetailParcel] = useState<Parcel | null>(null);

  // On-Map Floating Popup State (matching Image 1)
  const [mapPopupParcel, setMapPopupParcel] = useState<Parcel | null>(null);
  const mapPopupParcelRef = useRef<Parcel | null>(null);
  const [popupScreenPos, setPopupScreenPos] = useState<{ x: number; y: number; visible: boolean } | null>(null);

  useEffect(() => {
    mapPopupParcelRef.current = mapPopupParcel;
  }, [mapPopupParcel]);
  const [viewerReady, setViewerReady] = useState<boolean>(false);

  // 3D Cinematic Flyover Video State
  const [isFlyoverActive, setIsFlyoverActive] = useState<boolean>(false);
  const [isPlayingFlyover, setIsPlayingFlyover] = useState<boolean>(false);
  const [flyoverProgress, setFlyoverProgress] = useState<number>(0); // 0 to 1
  const [flyoverDuration, setFlyoverDuration] = useState<number>(5); // default 5 seconds (options: 3s, 5s, 8s)
  const [flyoverLoop, setFlyoverLoop] = useState<boolean>(false);

  const flyoverStartTimeRef = useRef<number | null>(null);
  const flyoverAnimIdRef = useRef<number | null>(null);
  const flyoverProgressRef = useRef<number>(0);
  const isPlayingFlyoverRef = useRef<boolean>(false);
  const flyoverDurationRef = useRef<number>(5);
  const flyoverLoopRef = useRef<boolean>(false);

  useEffect(() => {
    isPlayingFlyoverRef.current = isPlayingFlyover;
  }, [isPlayingFlyover]);

  useEffect(() => {
    flyoverDurationRef.current = flyoverDuration;
  }, [flyoverDuration]);

  useEffect(() => {
    flyoverLoopRef.current = flyoverLoop;
  }, [flyoverLoop]);

  // India Geographic Bounding Box: [West, South, East, North]
  const INDIA_RECTANGLE = Cesium.Rectangle.fromDegrees(68.0, 6.5, 97.5, 37.5);

  // Color mapping for Cesium delay levels
  const getCesiumRiskColor = (level: RiskLevel): { color: Cesium.Color; outline: Cesium.Color; css: string } => {
    switch (level) {
      case 'CRITICAL':
        return {
          color: Cesium.Color.fromCssColorString('#ef4444'),
          outline: Cesium.Color.fromCssColorString('#b91c1c'),
          css: '#ef4444'
        };
      case 'HIGH':
        return {
          color: Cesium.Color.fromCssColorString('#f97316'),
          outline: Cesium.Color.fromCssColorString('#c2410c'),
          css: '#f97316'
        };
      case 'MEDIUM':
        return {
          color: Cesium.Color.fromCssColorString('#eab308'),
          outline: Cesium.Color.fromCssColorString('#a16207'),
          css: '#eab308'
        };
      case 'LOW':
      default:
        return {
          color: Cesium.Color.fromCssColorString('#10b981'),
          outline: Cesium.Color.fromCssColorString('#047857'),
          css: '#10b981'
        };
    }
  };

  // All parcels always rendered; highlighted vs dimmed based on filter
  const filteredParcels = parcels; // Always render all parcels on map

  // Which parcels match the current filter (for highlighting)
  const isParcelHighlighted = (parcel: Parcel): boolean => {
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
  };

  // Count of matching parcels for display
  const matchingParcelsCount = useMemo(() => {
    return parcels.filter(isParcelHighlighted).length;
  }, [parcels, activeRiskFilter, activeLandTypeFilter, searchQuery]);

  // Fly camera to group centroid of matching parcels when filter changes
  const flyToFilteredGroup = (filter: string) => {
    const viewer = viewerRef.current;
    if (!viewer || filter === 'ALL') return;
    const matching = parcels.filter(p => p.delay_risk_level === filter);
    if (matching.length === 0) return;
    const avgLat = matching.reduce((s, p) => s + p.lat, 0) / matching.length;
    const avgLng = matching.reduce((s, p) => s + p.lng, 0) / matching.length;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(avgLng, avgLat - 0.015, 4800),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-32),
        roll: 0.0
      },
      duration: 1.8
    });
  };

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
    globe.depthTestAgainstTerrain = false;
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

    // Track On-Map Popup Screen Coordinates in real time
    const onPostRender = () => {
      const currentParcel = mapPopupParcelRef.current;
      if (!viewer || viewer.isDestroyed() || !currentParcel) {
        setPopupScreenPos(null);
        return;
      }
      try {
        const cartesian = Cesium.Cartesian3.fromDegrees(currentParcel.lng, currentParcel.lat, 100);
        const canvasPos = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, cartesian);
        if (canvasPos && cesiumContainerRef.current) {
          const clientW = cesiumContainerRef.current.clientWidth;
          const clientH = cesiumContainerRef.current.clientHeight;
          const inView = canvasPos.x >= 10 && canvasPos.x <= clientW - 10 && canvasPos.y >= 10 && canvasPos.y <= clientH - 10;
          
          const occluded = Cesium.Cartesian3.dot(
            Cesium.Cartesian3.subtract(cartesian, viewer.camera.position, new Cesium.Cartesian3()),
            viewer.camera.direction
          ) < 0;

          setPopupScreenPos({
            x: Math.max(160, Math.min(canvasPos.x, clientW - 160)),
            y: Math.max(70, Math.min(canvasPos.y, clientH - 70)),
            visible: inView && !occluded
          });
        }
      } catch (err) {
        // Ignore during camera transition
      }
    };
    viewer.scene.postRender.addEventListener(onPostRender);

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

    // Mouse Click (Opens on-map popup card matching Image 1)
    handler.setInputAction((click: any) => {
      const pickedObject = viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.userData) {
        const pData: Parcel = pickedObject.id.userData;
        setSelectedParcel(pData);
        setMapPopupParcel(pData);
        flyToCesiumParcel(pData);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    viewerRef.current = viewer;
    setViewerReady(true);

    return () => {
      viewer.scene.postRender.removeEventListener(onPostRender);
      handler.destroy();
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      setViewerReady(false);
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

  // 3D Cinematic Flyover Camera Position Calculator
  const applyCameraAtProgress = (p: number) => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    const N = FLYOVER_WAYPOINTS.length;
    const numSegments = N - 1;
    const clampedP = Math.max(0, Math.min(1, p));
    const segIndex = Math.min(Math.floor(clampedP * numSegments), numSegments - 1);
    const u = (clampedP * numSegments) - segIndex;

    // Hermite smoothstep easing for silky smooth camera glide
    const ease = u * u * (3 - 2 * u);

    const wpA = FLYOVER_WAYPOINTS[segIndex];
    const wpB = FLYOVER_WAYPOINTS[segIndex + 1];

    const lat = wpA.lat + (wpB.lat - wpA.lat) * ease;
    const lng = wpA.lng + (wpB.lng - wpA.lng) * ease;
    const height = wpA.height + (wpB.height - wpA.height) * ease;

    // Shortest angular path interpolation for heading
    let dHead = ((wpB.heading - wpA.heading + 540) % 360) - 180;
    const heading = wpA.heading + dHead * ease;
    const pitch = wpA.pitch + (wpB.pitch - wpA.pitch) * ease;

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(pitch),
        roll: 0.0
      }
    });
  };

  // 3D Flyover Animation Loop
  const animateFlyover = (timestamp: number) => {
    if (!isPlayingFlyoverRef.current) return;

    if (flyoverStartTimeRef.current === null) {
      flyoverStartTimeRef.current = timestamp - (flyoverProgressRef.current * flyoverDurationRef.current * 1000);
    }

    const elapsedMs = timestamp - flyoverStartTimeRef.current;
    const totalMs = flyoverDurationRef.current * 1000;
    let p = elapsedMs / totalMs;

    if (p >= 1) {
      if (flyoverLoopRef.current) {
        flyoverStartTimeRef.current = timestamp;
        p = 0;
      } else {
        p = 1;
        setIsPlayingFlyover(false);
        isPlayingFlyoverRef.current = false;
        flyoverProgressRef.current = 1;
        setFlyoverProgress(1);
        applyCameraAtProgress(1);
        return;
      }
    }

    flyoverProgressRef.current = p;
    setFlyoverProgress(p);
    applyCameraAtProgress(p);

    flyoverAnimIdRef.current = requestAnimationFrame(animateFlyover);
  };

  const startFlyover = (initialProgress = 0) => {
    setInspectorOpen(false);
    setIsFlyoverActive(true);
    setIsPlayingFlyover(true);
    isPlayingFlyoverRef.current = true;
    flyoverProgressRef.current = initialProgress;
    setFlyoverProgress(initialProgress);
    flyoverStartTimeRef.current = null;
    applyCameraAtProgress(initialProgress);

    if (flyoverAnimIdRef.current) {
      cancelAnimationFrame(flyoverAnimIdRef.current);
    }
    flyoverAnimIdRef.current = requestAnimationFrame(animateFlyover);
  };

  const pauseFlyover = () => {
    setIsPlayingFlyover(false);
    isPlayingFlyoverRef.current = false;
    if (flyoverAnimIdRef.current) {
      cancelAnimationFrame(flyoverAnimIdRef.current);
      flyoverAnimIdRef.current = null;
    }
  };

  const resumeFlyover = () => {
    if (flyoverProgressRef.current >= 1) {
      startFlyover(0);
      return;
    }
    setIsPlayingFlyover(true);
    isPlayingFlyoverRef.current = true;
    flyoverStartTimeRef.current = null;
    flyoverAnimIdRef.current = requestAnimationFrame(animateFlyover);
  };

  const restartFlyover = () => {
    startFlyover(0);
  };

  const stopFlyover = () => {
    pauseFlyover();
    setIsFlyoverActive(false);
    flyoverProgressRef.current = 0;
    setFlyoverProgress(0);
    flyToCorridor('JAIPUR_AJMER');
  };

  const toggleFlyover = () => {
    if (isFlyoverActive) {
      if (isPlayingFlyover) {
        pauseFlyover();
      } else {
        resumeFlyover();
      }
    } else {
      startFlyover(0);
    }
  };

  const togglePlayPauseFlyover = () => {
    if (isPlayingFlyover) {
      pauseFlyover();
    } else {
      resumeFlyover();
    }
  };

  const seekFlyover = (val: number) => {
    flyoverProgressRef.current = val;
    setFlyoverProgress(val);
    applyCameraAtProgress(val);
    if (isPlayingFlyoverRef.current) {
      flyoverStartTimeRef.current = null;
    }
  };

  const changeDuration = (sec: number) => {
    setFlyoverDuration(sec);
    flyoverDurationRef.current = sec;
    if (isPlayingFlyoverRef.current) {
      flyoverStartTimeRef.current = null;
    }
  };

  // Compute live flight telemetry and active waypoint for HUD overlay
  const currentTelemetry = useMemo(() => {
    const N = FLYOVER_WAYPOINTS.length;
    const numSegments = N - 1;
    const p = Math.max(0, Math.min(1, flyoverProgress));
    const segIndex = Math.min(Math.floor(p * numSegments), numSegments - 1);
    const u = (p * numSegments) - segIndex;
    const ease = u * u * (3 - 2 * u);

    const wpA = FLYOVER_WAYPOINTS[segIndex];
    const wpB = FLYOVER_WAYPOINTS[segIndex + 1];

    const height = wpA.height + (wpB.height - wpA.height) * ease;
    const pitch = wpA.pitch + (wpB.pitch - wpA.pitch) * ease;
    const speed = wpA.speedKmh + (wpB.speedKmh - wpA.speedKmh) * ease;

    const activeWaypoint = u > 0.5 ? wpB : wpA;

    return {
      height,
      pitch,
      speedKmh: speed,
      activeWaypoint
    };
  }, [flyoverProgress]);

  // Handle auto-start trigger (e.g. from GIS Map tab or external link)
  useEffect(() => {
    if (viewerReady) {
      const shouldAutoStart = sessionStorage.getItem('auto_start_flyover');
      if (shouldAutoStart === 'true') {
        sessionStorage.removeItem('auto_start_flyover');
        const timer = setTimeout(() => {
          startFlyover(0);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [viewerReady]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (flyoverAnimIdRef.current) {
        cancelAnimationFrame(flyoverAnimIdRef.current);
      }
    };
  }, []);

  // 2. Render 3D Extruded Parcels & Natural Layers onto Cesium Globe
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // Clear previous entities
    viewer.entities.removeAll();
    entitiesMapRef.current = {};

    // A. Add 3D Extruded Parcels & 3D Candle Pillars — ALL parcels with Dynamic Metric Heights & Highlighting
    filteredParcels.forEach(parcel => {
      const riskConfig = getCesiumRiskColor(parcel.delay_risk_level);
      const isSelected = selectedParcel?.id === parcel.id || mapPopupParcel?.id === parcel.id;
      const highlighted = isParcelHighlighted(parcel);
      const isFilterActive = activeRiskFilter !== 'ALL';
      const isDimmed = isFilterActive && !highlighted;
      const isHighlightedFilter = isFilterActive && highlighted;

      // Compute terrain base height to ensure geometry is anchored on the ground
      const carto = Cesium.Cartographic.fromDegrees(parcel.lng, parcel.lat);
      const sampledElev = viewer.scene.globe.getHeight(carto);
      const groundElev = (typeof sampledElev === 'number' && !isNaN(sampledElev) && sampledElev > 100) ? sampledElev : 390;

      // Determine 3D Extrusion Height and Candle Metrics in meters
      let extrudedHeightMeters = 100;
      let candleHeight = 220;
      let metricValueText = '';
      let metricCandleColor = riskConfig.color;
      let metricCss = riskConfig.css;

      if (heightMetric === 'delay_days') {
        extrudedHeightMeters = Math.max(90, (parcel.expected_delay_days / 365) * 650);
        candleHeight = extrudedHeightMeters + 120;
        metricValueText = `${parcel.expected_delay_days}d Delay`;
        metricCandleColor = riskConfig.color;
        metricCss = riskConfig.css;
      } else if (heightMetric === 'delay_risk') {
        extrudedHeightMeters = Math.max(90, (parcel.delay_risk_score / 100) * 700);
        candleHeight = extrudedHeightMeters + 120;
        metricValueText = `${parcel.delay_risk_score}% Risk`;
        if (parcel.delay_risk_score >= 80) {
          metricCss = '#ef4444';
          metricCandleColor = Cesium.Color.fromCssColorString('#ef4444');
        } else if (parcel.delay_risk_score >= 60) {
          metricCss = '#f97316';
          metricCandleColor = Cesium.Color.fromCssColorString('#f97316');
        } else if (parcel.delay_risk_score >= 40) {
          metricCss = '#eab308';
          metricCandleColor = Cesium.Color.fromCssColorString('#eab308');
        } else {
          metricCss = '#10b981';
          metricCandleColor = Cesium.Color.fromCssColorString('#10b981');
        }
      } else if (heightMetric === 'area') {
        extrudedHeightMeters = Math.max(90, parcel.area_acres * 160);
        candleHeight = extrudedHeightMeters + 120;
        metricValueText = `${parcel.area_acres} Acres`;
        if (parcel.area_acres >= 3.5) {
          metricCss = '#0284c7';
          metricCandleColor = Cesium.Color.fromCssColorString('#0284c7');
        } else if (parcel.area_acres >= 2.0) {
          metricCss = '#0d9488';
          metricCandleColor = Cesium.Color.fromCssColorString('#0d9488');
        } else {
          metricCss = '#16a34a';
          metricCandleColor = Cesium.Color.fromCssColorString('#16a34a');
        }
      }

      // If user clicked Critical / High / Medium / Cleared filter:
      // Match gets elevated height and vibrant mentioned highlight color!
      if (isHighlightedFilter) {
        extrudedHeightMeters = extrudedHeightMeters * 1.35;
        candleHeight = candleHeight * 1.3;
      } else if (isDimmed) {
        extrudedHeightMeters = Math.max(25, extrudedHeightMeters * 0.2);
        candleHeight = Math.max(40, candleHeight * 0.2);
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

      // Dimmed parcels get faint dark slate; matching parcels get pure radiant mentioned color
      const parcelMaterial = isSelected
        ? Cesium.Color.WHITE.withAlpha(0.95)
        : isDimmed
          ? Cesium.Color.fromCssColorString('#334155').withAlpha(0.2)
          : isHighlightedFilter
            ? Cesium.Color.fromCssColorString(metricCss).withAlpha(0.95)
            : metricCandleColor.withAlpha(0.85);

      const parcelOutline = isSelected
        ? Cesium.Color.WHITE
        : isDimmed
          ? Cesium.Color.TRANSPARENT
          : isHighlightedFilter
            ? Cesium.Color.WHITE
            : Cesium.Color.BLACK;

      // 1. Polygon Extruded Volume
      const entity = viewer.entities.add({
        id: parcel.id,
        name: `Khasra ${parcel.khasra_survey_no} (${parcel.village})`,
        position: Cesium.Cartesian3.fromDegrees(parcel.lng, parcel.lat, groundElev + extrudedHeightMeters + 35),
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(hierarchyPositions),
          height: groundElev,
          extrudedHeight: groundElev + extrudedHeightMeters,
          material: parcelMaterial,
          outline: true,
          outlineColor: parcelOutline,
          outlineWidth: isSelected ? 4 : isHighlightedFilter ? 3 : isDimmed ? 1 : 2,
          shadows: Cesium.ShadowMode.ENABLED
        },
        label: {
          text: `Khasra ${parcel.khasra_survey_no}\n${metricValueText}`,
          font: isHighlightedFilter ? 'bold 12px "Inter", sans-serif' : 'bold 11px "Inter", sans-serif',
          fillColor: isDimmed
            ? Cesium.Color.fromCssColorString('#64748b').withAlpha(0.35)
            : isSelected ? Cesium.Color.WHITE : Cesium.Color.fromCssColorString(metricCss),
          outlineColor: Cesium.Color.fromCssColorString('#020617'),
          outlineWidth: isDimmed ? 1 : 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100.0, isDimmed ? 16000.0 : 55000.0),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      });

      (entity as any).userData = parcel;
      entitiesMapRef.current[parcel.id] = entity;

      // 2. 3D Candle Pillar Beacon rising from parcel centroid
      const candleRadius = isDimmed ? 6 : (isSelected ? 22 : isHighlightedFilter ? 20 : 15);
      const candleEntity = viewer.entities.add({
        id: `candle-${parcel.id}`,
        name: `Khasra ${parcel.khasra_survey_no} Candle (${metricValueText})`,
        position: Cesium.Cartesian3.fromDegrees(parcel.lng, parcel.lat, groundElev + candleHeight / 2),
        cylinder: {
          length: candleHeight,
          topRadius: candleRadius,
          bottomRadius: candleRadius + 2,
          material: new Cesium.ColorMaterialProperty(
            isDimmed
              ? Cesium.Color.fromCssColorString('#475569').withAlpha(0.15)
              : isHighlightedFilter
                ? Cesium.Color.fromCssColorString(metricCss).withAlpha(0.95)
                : metricCandleColor.withAlpha(0.85)
          ),
          outline: !isDimmed,
          outlineColor: isHighlightedFilter || isSelected ? Cesium.Color.WHITE : Cesium.Color.fromCssColorString('#0f172a'),
          outlineWidth: isHighlightedFilter || isSelected ? 3 : 1
        }
      });
      (candleEntity as any).userData = parcel;

      // 3. Top Glowing Beacon Flame / Point
      viewer.entities.add({
        id: `flame-${parcel.id}`,
        position: Cesium.Cartesian3.fromDegrees(parcel.lng, parcel.lat, groundElev + candleHeight + 15),
        point: {
          pixelSize: isDimmed ? 4 : isHighlightedFilter || isSelected ? 12 : 9,
          color: isDimmed
            ? Cesium.Color.fromCssColorString('#64748b').withAlpha(0.2)
            : Cesium.Color.fromCssColorString(metricCss),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: isDimmed ? 0 : 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      });
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

    // D. Add Infrastructure Corridor Ribbon Track with Distinct Colors per Route
    if (showCorridorRibbon && routes && routes.length > 0) {
      routes.forEach(route => {
        if (route.coordinates && route.coordinates.length > 0) {
          const corridorPositions = route.coordinates.map(pt =>
            Cesium.Cartesian3.fromDegrees(pt[1], pt[0], 10)
          );

          // Distinct color per route alignment:
          // Route B (Recommended Greenfield): Emerald Green (#10b981)
          // Route A (Existing NH-48 Widening): Red (#ef4444)
          // Route C (Rail Corridor): Vibrant Purple (#8b5cf6)
          let routeColorHex = '#8b5cf6';
          let glowPower = 0.30;
          let lineWidth = 5;

          if (route.route_id === 'ROUTE-B' || route.is_recommended) {
            routeColorHex = '#10b981';
            glowPower = 0.40;
            lineWidth = 7;
          } else if (route.route_id === 'ROUTE-A') {
            routeColorHex = '#ef4444';
            glowPower = 0.35;
            lineWidth = 6;
          } else if (route.route_id === 'ROUTE-C') {
            routeColorHex = '#8b5cf6';
            glowPower = 0.30;
            lineWidth = 5;
          }

          viewer.entities.add({
            name: `${route.route_name} (${route.route_id})`,
            polyline: {
              positions: corridorPositions,
              width: lineWidth,
              material: new Cesium.PolylineGlowMaterialProperty({
                glowPower,
                color: Cesium.Color.fromCssColorString(routeColorHex)
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
  }, [viewerReady, filteredParcels, selectedParcel, heightMetric, showForests, showRivers, showCorridorRibbon, activeRiskFilter, activeLandTypeFilter, searchQuery]);

  const activeParcelToInspect = detailParcel || selectedParcel || parcels[0] || null;

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

      {/* Top Left Floating Controls: Presets + Inline Risk Filter Pills */}
      <div className="absolute top-4 left-4 right-[180px] z-20 pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800/90 px-3 py-2 rounded-xl shadow-xl flex items-center gap-2 flex-wrap">
          {/* Preset Dropdown */}
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
            <span>🇮🇳</span> Presets:
          </span>
          <div className="relative flex items-center shrink-0">
            <select
              value={activeViewport}
              onChange={(e) => {
                const val = e.target.value as 'JAIPUR_AJMER' | 'HIMALAYAS' | 'INDIA_OVERVIEW';
                setActiveViewport(val);
                flyToCorridor(val);
              }}
              className="bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold py-1.5 pl-2.5 pr-7 rounded-lg border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none truncate transition-all max-w-[200px]"
            >
              <option value="JAIPUR_AJMER">Jaipur–Ajmer NH-48 (135 KM)</option>
              <option value="HIMALAYAS">Himalayas / Mt. Everest (8,848 M)</option>
              <option value="INDIA_OVERVIEW">All India National Overview</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-slate-700 shrink-0 hidden sm:block" />

          {/* Inline Risk Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">{matchingParcelsCount} Parcels</span>
            <button
              onClick={() => {
                const next = activeRiskFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL';
                setActiveRiskFilter(next);
                flyToFilteredGroup(next);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium transition-all border whitespace-nowrap ${
                activeRiskFilter === 'CRITICAL' ? 'bg-red-950/80 border-red-500 shadow-sm shadow-red-500/20' : 'bg-slate-800/40 border-transparent hover:border-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500 shrink-0"></span>
              <span className="text-red-200">Critical</span>
            </button>
            <button
              onClick={() => {
                const next = activeRiskFilter === 'HIGH' ? 'ALL' : 'HIGH';
                setActiveRiskFilter(next);
                flyToFilteredGroup(next);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium transition-all border whitespace-nowrap ${
                activeRiskFilter === 'HIGH' ? 'bg-orange-950/80 border-orange-500 shadow-sm shadow-orange-500/20' : 'bg-slate-800/40 border-transparent hover:border-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0"></span>
              <span className="text-orange-200">High</span>
            </button>
            <button
              onClick={() => {
                const next = activeRiskFilter === 'MEDIUM' ? 'ALL' : 'MEDIUM';
                setActiveRiskFilter(next);
                flyToFilteredGroup(next);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium transition-all border whitespace-nowrap ${
                activeRiskFilter === 'MEDIUM' ? 'bg-amber-950/80 border-amber-500 shadow-sm shadow-amber-500/20' : 'bg-slate-800/40 border-transparent hover:border-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0"></span>
              <span className="text-amber-200">Medium</span>
            </button>
            <button
              onClick={() => {
                const next = activeRiskFilter === 'LOW' ? 'ALL' : 'LOW';
                setActiveRiskFilter(next);
                flyToFilteredGroup(next);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium transition-all border whitespace-nowrap ${
                activeRiskFilter === 'LOW' ? 'bg-emerald-950/80 border-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-slate-800/40 border-transparent hover:border-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0"></span>
              <span className="text-emerald-200">Cleared</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Right Floating Toolbar: Camera Controls, Height Metric & View Modes */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* 3D Flyover Video Tour Button */}
        <button
          onClick={toggleFlyover}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-lg ${
            isFlyoverActive
              ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-red-500/30'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white border-cyan-500/40 shadow-emerald-500/20'
          }`}
          title="Play 3 to 6-second Cinematic 3D Aerial Flyover along the NH-48 Corridor"
        >
          {isFlyoverActive ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>{isPlayingFlyover ? 'Pause Tour' : 'Resume Tour'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>3D Flyover Tour ({flyoverDuration}s)</span>
            </>
          )}
        </button>

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
          onClick={() => {
            if (inspectorOpen) {
              setInspectorOpen(false);
            } else {
              setInspectorOpen(true);
              setInspectorMode('list');
              setDetailParcel(null);
            }
          }}
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
          <Building className="w-3 h-3" /> Alignment Corridors
        </button>
        {showCorridorRibbon && (
          <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-[10px] font-semibold text-slate-300 shrink-0 select-none">
            <span className="flex items-center gap-1"><span className="w-2.5 h-1 rounded-full bg-emerald-500 inline-block"></span> {tr('Route B (Rec.)', 'रूट B')}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-1 rounded-full bg-red-500 inline-block"></span> {tr('Route A', 'रूट A')}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-1 rounded-full bg-purple-500 inline-block"></span> {tr('Route C', 'रूट C')}</span>
          </div>
        )}
      </div>

      {/* ON-MAP FLOATING POPUP CARD (MATCHING IMAGE 1 SPEC) */}
      {mapPopupParcel && (
        <div
          className="absolute z-40 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl p-3.5 w-72 sm:w-80 pointer-events-auto select-none transition-all duration-75 text-slate-800 dark:text-slate-100"
          style={
            popupScreenPos && popupScreenPos.visible
              ? {
                  left: `${popupScreenPos.x}px`,
                  top: `${popupScreenPos.y - 16}px`,
                  transform: 'translate(-50%, -100%)'
                }
              : {
                  left: '50%',
                  top: '40%',
                  transform: 'translate(-50%, -50%)'
                }
          }
        >
          {/* Header: ID + Badge + Close Button */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-sm text-[#0f2942] dark:text-white font-mono">
              {mapPopupParcel.id}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[11px] font-bold px-1.5 py-0.5 rounded uppercase border"
                style={{
                  backgroundColor: `${getCesiumRiskColor(mapPopupParcel.delay_risk_level).css}15`,
                  color: getCesiumRiskColor(mapPopupParcel.delay_risk_level).css,
                  borderColor: getCesiumRiskColor(mapPopupParcel.delay_risk_level).css
                }}
              >
                {mapPopupParcel.delay_risk_score}% {t(mapPopupParcel.delay_risk_level)}
              </span>
              <button
                onClick={() => setMapPopupParcel(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
                title="Close popup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body details identical to Image 1 */}
          <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
            <div>
              <strong className="text-slate-800 dark:text-slate-200">{tr('Khasra', 'खसरा')}:</strong>{' '}
              {mapPopupParcel.khasra_survey_no} • {t(mapPopupParcel.village, mapPopupParcel.village)}, {t(mapPopupParcel.tehsil, mapPopupParcel.tehsil)}
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">{tr('Land Category', 'भूमि श्रेणी')}:</strong>{' '}
              <span
                className="font-bold"
                style={{ color: getCesiumRiskColor(mapPopupParcel.delay_risk_level).css }}
              >
                {t(mapPopupParcel.land_type, mapPopupParcel.land_type)}
              </span>
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">{tr('Owner', 'भूस्वामी')}:</strong>{' '}
              {t(mapPopupParcel.owner.name, mapPopupParcel.owner.name)} ({mapPopupParcel.area_acres} {t('common.acres')})
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">{tr('Compensation', 'मुआवजा')}:</strong>{' '}
              {mapPopupParcel.compensation
                ? `₹${(mapPopupParcel.compensation.total_estimated_compensation_inr / 100000).toFixed(1)} ${tr('Lakh', 'लाख')} (${t(mapPopupParcel.compensation.payment_status)})`
                : 'N/A'}
            </div>
            <div className="pt-0.5 text-[#b91c1c] dark:text-red-400 font-bold text-[11px]">
              {mapPopupParcel.top_risk_factors[0]?.factor_name
                ? t(mapPopupParcel.top_risk_factors[0]?.factor_name)
                : t('common.pending')}{' '}
              (+{mapPopupParcel.expected_delay_days} {t('common.days')})
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              setDetailParcel(mapPopupParcel);
              setSelectedParcel(mapPopupParcel);
              setInspectorMode('detail');
              setInspectorOpen(true);
            }}
            className="w-full mt-2.5 py-1.5 px-3 bg-[#0f2942] hover:bg-[#1a365d] text-white rounded text-xs font-semibold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {t('gis.open_dossier', 'Open Full Land Dossier')}
          </button>

          {/* Downward triangle indicator pointing to the 3D parcel */}
          {popupScreenPos && popupScreenPos.visible && (
            <div
              className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white dark:border-t-[#0f172a]"
            />
          )}
        </div>
      )}

      {/* RIGHT SIDEBAR: Two-Level Parcel Inspector — List → Detail */}
      {inspectorOpen && (
        <div className="absolute top-4 right-4 bottom-4 w-[410px] z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-200">

          {/* ==================== LEVEL 1: PARCEL LIST ==================== */}
          {inspectorMode === 'list' && (
            <>
              {/* List Header */}
              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    Total Khasra Parcels ({parcels.length})
                  </h3>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    {activeProject?.code || 'NH-48-EXP-RJ'}
                  </span>
                </div>
                <button
                  onClick={() => setInspectorOpen(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Parcel List Scrollable */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                {parcels.map(p => {
                  const riskColors: Record<string, string> = {
                    CRITICAL: 'text-red-400',
                    HIGH: 'text-orange-400',
                    MEDIUM: 'text-amber-400',
                    LOW: 'text-emerald-400'
                  };
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setDetailParcel(p);
                        setSelectedParcel(p);
                        setMapPopupParcel(p);
                        flyToCesiumParcel(p);
                      }}
                      className="p-3 rounded-xl border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/50 cursor-pointer transition-all text-xs space-y-2 group"
                    >
                      {/* Row 1: ID + Risk Badge */}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-400 font-mono text-xs">{p.id}</span>
                        <div className="flex items-center gap-1.5">
                          <RiskBadge level={p.delay_risk_level} score={p.delay_risk_score} showScore size="sm" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              flyToCesiumParcel(p);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition"
                            title="Fly to parcel on 3D globe"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Khasra + Village + Area */}
                      <div className="text-slate-200 font-semibold text-xs flex items-center justify-between">
                        <span>Khasra {p.khasra_survey_no} • {p.village}</span>
                        <span className="font-mono text-[11px] text-slate-400">{p.area_acres} Acres</span>
                      </div>

                      {/* Row 3: Owner + Land Type */}
                      <div className="flex justify-between items-center text-[11px] text-slate-300">
                        <span className="truncate max-w-[180px] font-medium">{p.owner.name}</span>
                        <span className="font-bold text-[10px] uppercase text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{p.land_type}</span>
                      </div>

                      {/* Row 4: Tehsil + Delay */}
                      <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-800/80">
                        <span className="text-slate-500 font-mono">Tehsil: {p.tehsil}</span>
                        <span className={`font-bold ${riskColors[p.delay_risk_level] || 'text-red-400'}`}>
                          +{p.expected_delay_days} Days delay
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ==================== LEVEL 2: PARCEL DETAIL ==================== */}
          {inspectorMode === 'detail' && activeParcelToInspect && (
            <>
              {/* Detail Header with Back Button */}
              <div className="p-4 border-b border-slate-800/90 bg-slate-950/40">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => {
                      setInspectorMode('list');
                      setDetailParcel(null);
                    }}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-all group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                    Back to All Parcels
                  </button>
                  <button
                    onClick={() => setInspectorOpen(false)}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
            </>
          )}
        </div>
      )}

      {/* Cinematic 3D Aerial Flyover Video Overlay & HUD Controller */}
      {isFlyoverActive && (
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between overflow-hidden">
          {/* Top Cinematic HUD Letterbox */}
          <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 bg-red-600 text-white font-black text-[10px] tracking-wider px-2.5 py-0.5 rounded-full animate-pulse uppercase shadow-md shadow-red-600/40">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                REC • 3D FLYOVER
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm text-cyan-300">
                {(flyoverProgress * flyoverDuration).toFixed(1)}s / {flyoverDuration}.0s
              </span>
              <div className="hidden md:block w-px h-4 bg-slate-700"></div>
              <span className="hidden md:inline text-xs font-semibold text-slate-300">
                Jaipur–Ajmer NH-48 Express Corridor • 3D Drone Reconnaissance Video Simulation
              </span>
            </div>

            {/* Real-time Telemetry */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
              <div className="hidden sm:flex items-center gap-1 text-slate-300">
                <span className="text-slate-500">ALT:</span>
                <span className="text-amber-300 font-bold">{Math.round(currentTelemetry.height)}m</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-slate-300">
                <span className="text-slate-500">SPEED:</span>
                <span className="text-emerald-300 font-bold">{Math.round(currentTelemetry.speedKmh)} km/h</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <span className="text-slate-500">PITCH:</span>
                <span className="text-cyan-300 font-bold">{Math.round(currentTelemetry.pitch)}°</span>
              </div>
              <button
                onClick={stopFlyover}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                title="Exit 3D Flyover"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Exit Tour</span>
              </button>
            </div>
          </div>

          {/* Middle Waypoint Spotlight Card */}
          {currentTelemetry.activeWaypoint && (
            <div className="pointer-events-auto self-start ml-4 sm:ml-6 mb-4 max-w-sm sm:max-w-md bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-xl p-3.5 shadow-2xl shadow-cyan-950/50 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  [{currentTelemetry.activeWaypoint.km}] {currentTelemetry.activeWaypoint.name}
                </span>
                <RiskBadge level={currentTelemetry.activeWaypoint.riskLevel} />
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {currentTelemetry.activeWaypoint.bottleneck}
              </p>
            </div>
          )}

          {/* Bottom Cinematic Control Player */}
          <div className="pointer-events-auto bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-4 sm:px-6 py-2.5 shadow-2xl flex flex-col gap-2">
            {/* Timeline Scrubber */}
            <div className="flex items-center gap-3 w-full">
              <span className="font-mono text-[11px] text-slate-400 shrink-0 w-8">
                {(flyoverProgress * flyoverDuration).toFixed(1)}s
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.002"
                  value={flyoverProgress}
                  onChange={(e) => seekFlyover(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
              </div>
              <span className="font-mono text-[11px] text-slate-400 shrink-0 w-8 text-right">
                {flyoverDuration}.0s
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayPauseFlyover}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition shadow-md flex items-center gap-1.5 text-xs"
                >
                  {isPlayingFlyover ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume Tour</span>
                    </>
                  )}
                </button>
                <button
                  onClick={restartFlyover}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                  title="Restart Flyover"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restart</span>
                </button>
                <button
                  onClick={() => setFlyoverLoop(!flyoverLoop)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 border ${
                    flyoverLoop
                      ? 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                      : 'bg-slate-800/60 text-slate-400 border-transparent hover:text-white'
                  }`}
                  title="Loop 3D Flight Continuously"
                >
                  <span>🔁 Loop</span>
                </button>
              </div>

              {/* Duration Selectors: 3s, 5s, 8s */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                <span className="text-[10px] text-slate-400 font-semibold px-1.5">Speed / Duration:</span>
                {[3, 5, 8].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => changeDuration(sec)}
                    className={`px-2.5 py-0.5 text-xs font-bold rounded transition ${
                      flyoverDuration === sec
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec}s {sec === 3 ? '(Fast)' : sec === 5 ? '(Cinematic)' : '(Detailed)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

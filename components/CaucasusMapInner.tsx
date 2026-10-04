'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Compass, Layers, Map as MapIcon, Globe } from 'lucide-react';

interface Waypoint {
  id: string;
  name: string;
  altitude: string;
  coords: [number, number];
  role: string;
  description: string;
  badge: string;
}

const WAYPOINTS: Waypoint[] = [
  {
    id: 'nalchik-hq',
    name: 'Nalchik HQ',
    altitude: '512 m',
    coords: [43.4853, 43.6071],
    role: 'Logistics & Registration Center',
    description: 'Central operations base (Gorkogo St. 74). Participant registration, technical gear inspection, comprehensive safety briefing, and 4x4 mountain transfers.',
    badge: 'HQ & Briefing',
  },
  {
    id: 'azau-camp',
    name: 'Azau Base Camp',
    altitude: '2,350 m',
    coords: [43.2672, 42.4800],
    role: 'Lower Valley Terminal',
    description: 'Starting valley for south slope ascents. Boarding the 3-stage high-speed cableway, heavy alpine rental station, and initial acclimatization walk.',
    badge: 'Cable Car Hub',
  },
  {
    id: 'barrels-refuge',
    name: 'Barrels Refuge (Gara-Bashi)',
    altitude: '3,800 m',
    coords: [43.2981, 42.4644],
    role: 'High-Altitude Assault Camp',
    description: 'KavKazSkiTur private heated barrel refuge. Continuous 220V power, hot dining quarters, equipment drying facility, and direct EMERCOM radio base.',
    badge: 'Assault Base',
  },
  {
    id: 'priyut-11',
    name: 'Priyut 11',
    altitude: '4,050 m',
    coords: [43.3150, 42.4560],
    role: 'Acclimatization Station',
    description: 'Historic high camp and launching point for the critical acclimatization rotation toward Pastukhov Rocks (4,700 m) and the Ice Lake.',
    badge: 'Acclimatization',
  },
  {
    id: 'elbrus-summit',
    name: 'Elbrus West Summit',
    altitude: '5,642 m',
    coords: [43.3556, 42.4392],
    role: 'Highest Point in Europe',
    description: 'The pinnacle of the Caucasus. Final objective of classic and technical alpine ascents via the Saddle (5,416 m).',
    badge: 'Summit Objective',
  },
];

type MapStyle = 'dark' | 'satellite';

export default function CaucasusMapInner() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayersRef = useRef<L.LayerGroup | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('dark');

  const switchTileLayers = useCallback((map: L.Map, style: MapStyle) => {
    if (!tileLayersRef.current) {
      tileLayersRef.current = L.layerGroup().addTo(map);
    }
    const group = tileLayersRef.current;
    group.clearLayers();

    if (style === 'dark') {
      // 1. Clean ESRI Dark Gray Base (No API key, No watermarks)
      const base = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a> &copy; OpenStreetMap',
          maxZoom: 16,
          subdomains: ['server', 'services'],
        }
      );
      // 2. Clear place names & topographical labels
      const labels = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 16,
          pane: 'tilePane',
          opacity: 0.9,
        }
      );
      group.addLayer(base);
      group.addLayer(labels);
    } else {
      // 1. High-resolution Alpine Satellite Imagery (No API key, No watermarks)
      const sat = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a> &mdash; Source: Maxar, Earthstar Geographics',
          maxZoom: 19,
        }
      );
      // 2. High-contrast labels over satellite
      const satLabels = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          pane: 'tilePane',
          opacity: 0.95,
        }
      );
      group.addLayer(sat);
      group.addLayer(satLabels);
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map centered at Elbrus / Baksan Gorge [43.35, 42.50]
    const map = L.map(mapContainerRef.current, {
      center: [43.35, 42.50],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Apply initial tile layer (Dark Granite)
    switchTileLayers(map, 'dark');

    // Route polyline connecting the ascent chain: Nalchik -> Azau -> Barrels -> Priyut 11 -> Summit
    const routeCoords: [number, number][] = WAYPOINTS.map((w) => w.coords);
    L.polyline(routeCoords, {
      color: '#FF6A00',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '8, 8',
    }).addTo(map);

    // Add custom markers
    WAYPOINTS.forEach((point, index) => {
      const isBarrels = point.id === 'barrels-refuge';

      const customIcon = L.divIcon({
        className: 'custom-caucasus-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${isBarrels ? 'rgba(255, 106, 0, 0.5)' : 'rgba(255, 106, 0, 0.25)'}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #091422; border: 2.5px solid #FF6A00; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(255, 106, 0, 0.65); color: white; font-weight: 900; font-size: 11px;">
              ${index + 1}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      });

      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; background: #0E1F33; color: #F8FAFC; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px; min-width: 250px; max-width: 300px; box-shadow: 0 20px 30px rgba(0,0,0,0.7);">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(255, 106, 0, 0.2); color: #FB923C; padding: 3px 8px; border-radius: 9999px; border: 1px solid rgba(255, 106, 0, 0.4);">
              ${point.badge}
            </span>
            <span style="font-size: 11px; font-weight: 800; color: #94A3B8;">
              ${point.altitude}
            </span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.02em;">
            ${point.name}
          </h4>
          <div style="font-size: 11px; font-weight: 600; color: #FB923C; margin-bottom: 8px;">
            ${point.role}
          </div>
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #CBD5E1;">
            ${point.description}
          </p>
        </div>
      `;

      L.marker(point.coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(popupHtml, {
          closeButton: false,
          className: 'dark-leaflet-popup',
        });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayersRef.current = null;
    };
  }, [switchTileLayers]);

  // Handle style switch
  const handleSetStyle = (style: MapStyle) => {
    setMapStyle(style);
    if (mapInstanceRef.current) {
      switchTileLayers(mapInstanceRef.current, style);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#091422] shadow-2xl">
      {/* Top Overlay Legend Bar */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-[400] flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Left Title Badge */}
        <div className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#091422]/90 backdrop-blur-md border border-white/15 text-xs text-slate-200 shadow-xl">
          <Compass className="w-3.5 h-3.5 text-[#FF6A00]" />
          <span className="font-bold">Caucasus Expedition Route Map</span>
          <span className="text-[10px] text-slate-400 font-mono hidden xs:inline">
            {mapStyle === 'dark' ? 'Dark Topo' : 'Alpine Satellite'}
          </span>
        </div>

        {/* Right Controls: Style Toggle & Station Count */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Map Style Toggle */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-[#091422]/90 backdrop-blur-md border border-white/15 shadow-xl">
            <button
              type="button"
              onClick={() => handleSetStyle('dark')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                mapStyle === 'dark'
                  ? 'bg-[#FF6A00] text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapIcon className="w-3 h-3" />
              <span>Dark Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetStyle('satellite')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                mapStyle === 'satellite'
                  ? 'bg-[#FF6A00] text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Satellite</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-[#091422]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[11px] text-slate-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse"></span>
            <span>5 Staging Bases</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[450px] sm:h-[540px] z-10"
        style={{ background: '#091422' }}
      />

      {/* Quick Station Badges Footer */}
      <div className="p-3.5 sm:p-5 bg-[#091422]/95 border-t border-white/10 backdrop-blur-md">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {WAYPOINTS.map((w, idx) => (
            <div
              key={w.id}
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo(w.coords, 12, { duration: 1.2 });
                }
              }}
              className="px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-[#FF6A00]/15 border border-white/5 hover:border-[#FF6A00]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-[#FF6A00] tracking-wider mb-0.5">
                <span>0{idx + 1}</span>
                <span>•</span>
                <span className="text-slate-400 group-hover:text-slate-200">{w.altitude}</span>
              </div>
              <div className="font-bold text-xs text-white truncate group-hover:text-[#FB923C] transition-colors">
                {w.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

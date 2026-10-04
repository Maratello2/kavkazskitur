'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Compass, Mountain, Thermometer, ShieldCheck } from 'lucide-react';

const WAYPOINTS = [
  { id: 'nalchik', title: 'Nalchik Headquarters', alt: '512 M', desc: 'Administrative expedition staging, FSB border passes & gear clearance.', z: 40 },
  { id: 'terskol', title: 'Terskol Base Village', alt: '2,150 M', desc: 'Valley acclimatization base, Cheget pine trails & oxygen adaptation.', z: 15 },
  { id: 'barrels', title: 'Gara-Bashi Barrels', alt: '3,800 M', desc: 'Private high base camp, heated barrel cabins & glacier threshold.', z: -25 },
  { id: 'pastukhov', title: 'Pastukhov Rocks', alt: '4,700 M', desc: 'Volcanic basalt crags on steep ice firn slope. Midnight push benchmark.', z: -65 },
  { id: 'saddle', title: 'The Saddle Col', alt: '5,300 M', desc: 'Glacial amphitheater pass resting between the East and West volcanic domes.', z: -105 },
  { id: 'summit', title: 'West Peak Summit', alt: '5,642 M', desc: 'Supreme apex of Europe. Unrivaled 360-degree panorama of the Greater Caucasus.', z: -145 }
];

export function ElbrusFlythrough() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePoint, setActivePoint] = useState(WAYPOINTS[2]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene with Atmospheric Depth Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x091422, 0.014);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 16, 45);

    // 3. Optimized WebGL Renderer (max pixel ratio 1.5)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 4. Realistic Solid Caucasus Mountain Terrain (Faceted Shading, No Wireframe)
    const geometry = new THREE.PlaneGeometry(220, 320, 80, 80);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const colors: number[] = [];

    // Rock and Snow Palettes
    const deepRock = new THREE.Color(0x0e1b2c);
    const midRock = new THREE.Color(0x1a2e46);
    const highSnow = new THREE.Color(0xf0f5fa);
    const dawnHighlight = new THREE.Color(0xffe8d6);

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const distFromCenter = Math.abs(vx);

      // Central alpine pass, rising majestic peaks on sides and towering summit ahead
      const baseWave = Math.sin(vx * 0.07) * Math.cos(vz * 0.04) * 16;
      const ridgeElevation = distFromCenter > 18 ? Math.pow(distFromCenter - 18, 1.15) * 1.1 : 0;
      const summitDome = (vz < -80) ? Math.max(0, ( -80 - vz) * 0.45) : 0;
      
      const elevation = Math.max(0, baseWave + ridgeElevation + summitDome);
      pos.setY(i, elevation);

      // Natural snowline threshold: peaks above 22 units receive glaciated snow
      if (elevation > 24) {
        colors.push(highSnow.r, highSnow.g, highSnow.b);
      } else if (elevation > 15) {
        const lerpFactor = (elevation - 15) / 9;
        const c = midRock.clone().lerp(highSnow, lerpFactor);
        colors.push(c.r, c.g, c.b);
      } else {
        const lerpFactor = elevation / 15;
        const c = deepRock.clone().lerp(midRock, lerpFactor);
        colors.push(c.r, c.g, c.b);
      }
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.08,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(geometry, terrainMat);
    scene.add(terrain);

    // 5. Soft Dawn Side Lighting Architecture
    const ambientLight = new THREE.AmbientLight(0x233a55, 0.75);
    scene.add(ambientLight);

    // Warm directional dawn light casting natural ridge shadows
    const dawnSunLight = new THREE.DirectionalLight(0xff7a18, 2.4);
    dawnSunLight.position.set(55, 32, -60);
    scene.add(dawnSunLight);

    // Soft high-glacier cyan rim light
    const glacierRimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    glacierRimLight.position.set(-45, 25, 30);
    scene.add(glacierRimLight);

    // 6. Smooth Cinematic Camera Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      // Flight progression along the altitude axis
      const targetZ = -50 + Math.sin(elapsedTime * 0.12) * 85;
      camera.position.z = targetZ + 35;
      camera.position.y = 14 + Math.sin(elapsedTime * 0.25) * 2;
      camera.lookAt(0, 6, targetZ - 45);

      // Active waypoint detection
      const currentClosest = WAYPOINTS.reduce((prev, curr) => 
        Math.abs(curr.z - targetZ) < Math.abs(prev.z - targetZ) ? curr : prev
      );
      setActivePoint((prev) => (prev.id !== currentClosest.id ? currentClosest : prev));

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 7. Strict WebGL Memory Disposal Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      
      geometry.dispose();
      terrainMat.dispose();
      renderer.dispose();
      
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-white/[0.08] bg-[#091422] my-12 shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Top Status Capsule */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#091422]/90 px-4 py-1.5 backdrop-blur-md shadow-lg">
          <Compass className="w-3.5 h-3.5 text-[#FF6A00] animate-spin" strokeWidth={1.5} style={{ animationDuration: '12s' }} />
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase font-bold text-slate-300">
            Real Caucasus Ridge • 3D Telemetry
          </span>
        </div>
        <div className="text-[10px] font-mono tracking-[0.22em] uppercase font-bold text-[#38BDF8] bg-[#091422]/90 px-3.5 py-1.5 rounded-full border border-white/[0.08] shadow-lg">
          OpenGL Shaded Mesh
        </div>
      </div>

      {/* Bottom Interactive HUD Milestone Card (R_inner < R_outer) */}
      <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-auto">
        <div className="p-5 sm:p-6 rounded-2xl bg-[#091422]/95 border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md bg-[#FF6A00]/15 text-[#FF6A00] font-mono text-[11px] font-bold border border-[#FF6A00]/30 uppercase tracking-wider">
                {activePoint.alt}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activePoint.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {activePoint.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#acclimatization"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white text-xs font-bold uppercase tracking-[0.18em] shadow-lg shadow-orange-950/40 border border-orange-400/20 transition-all active:scale-95"
            >
              <span>Explore Milestones</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElbrusFlythrough;

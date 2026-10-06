'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasBackgroundProps {
  className?: string;
  activeProject?: 'all' | 'wonderwell' | 'kavkazskitur';
}

export default function ThreeCanvasBackground({
  className = '',
  activeProject = 'all',
}: ThreeCanvasBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isInteractingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04070d, 0.04);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const lightAmber = new THREE.PointLight(0xff6a00, 3.5, 20);
    lightAmber.position.set(4, 3, 4);
    scene.add(lightAmber);

    const lightCyan = new THREE.PointLight(0x00f0ff, 3.5, 20);
    lightCyan.position.set(-4, -3, 3);
    scene.add(lightCyan);

    const lightViolet = new THREE.PointLight(0x8a2be2, 2.0, 15);
    lightViolet.position.set(0, 4, -2);
    scene.add(lightViolet);

    // 3. Central Morphing 3D Geometry Core
    const groupCore = new THREE.Group();
    scene.add(groupCore);

    // Outer wireframe icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      emissive: 0x003344,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    groupCore.add(outerMesh);

    // Inner faceted crystal
    const innerGeo = new THREE.OctahedronGeometry(1.1, 0);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0xff6a00,
      emissive: 0x441100,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    groupCore.add(innerMesh);

    // Gyroscopic Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    groupCore.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(2.7, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff6a00,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    groupCore.add(ringMesh2);

    // 4. Particle Nebula Cloud (1,400 Stars / Cyber-Dust)
    const particleCount = 1400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorAmber = new THREE.Color(0xff6a00);
    const colorCyan = new THREE.Color(0x00f0ff);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 3.5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const ratio = Math.random();
      const chosenColor = ratio < 0.45 ? colorAmber : ratio < 0.9 ? colorCyan : colorWhite;
      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Canvas Texture for glowing circular particles
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.7)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Mouse & Pointer Tracking
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const normX = (clientX / window.innerWidth) * 2 - 1;
      const normY = -(clientY / window.innerHeight) * 2 + 1;

      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
      isInteractingRef.current = true;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. 60 FPS Render Loop with Smooth Damping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Group core rotation with subtle breathing
      groupCore.rotation.x = elapsedTime * 0.2 + mouseRef.current.y * 0.8;
      groupCore.rotation.y = elapsedTime * 0.35 + mouseRef.current.x * 0.8;

      innerMesh.rotation.x = -elapsedTime * 0.4;
      innerMesh.rotation.y = -elapsedTime * 0.5;

      ringMesh1.rotation.z = elapsedTime * 0.3;
      ringMesh2.rotation.z = -elapsedTime * 0.25;

      // Breathing scale
      const breath = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
      groupCore.scale.set(breath, breath, breath);

      // Light orbit around core
      lightAmber.position.x = Math.sin(elapsedTime * 0.8) * 4.5 + mouseRef.current.x * 2;
      lightAmber.position.y = Math.cos(elapsedTime * 0.8) * 3.5 + mouseRef.current.y * 2;

      lightCyan.position.x = -Math.sin(elapsedTime * 0.7) * 4.5 - mouseRef.current.x * 2;
      lightCyan.position.y = -Math.cos(elapsedTime * 0.7) * 3.5 - mouseRef.current.y * 2;

      // Particles gentle drift
      particles.rotation.y = elapsedTime * 0.03 + mouseRef.current.x * 0.15;
      particles.rotation.x = elapsedTime * 0.02 + mouseRef.current.y * 0.15;

      // Dynamic color shift depending on active project
      if (activeProject === 'wonderwell') {
        outerMat.color.setHex(0x00f0ff);
        innerMat.color.setHex(0x38bdf8);
      } else if (activeProject === 'kavkazskitur') {
        outerMat.color.setHex(0xff6a00);
        innerMat.color.setHex(0xf97316);
      } else {
        outerMat.color.setHex(0x00f0ff);
        innerMat.color.setHex(0xff6a00);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [activeProject]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
      style={{ opacity: 0.95 }}
    />
  );
}

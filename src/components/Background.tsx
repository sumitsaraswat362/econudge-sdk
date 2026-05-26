'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function BreathingMesh({ healthRatio }: { healthRatio: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // healthRatio is between 0 (polluted) and 1 (healthy)
  const targetColor = new THREE.Color().lerpColors(
    new THREE.Color('#d97706'), // polluted orange
    new THREE.Color('#059669'), // healthy emerald
    healthRatio
  );
  
  const { impactStats } = useImpact();
  
  const score = impactStats.decisionsOverridden;
  
  // Base scale starts at 2, grows up to 3 based on score
  const targetScale = 2 + Math.min(score * 0.1, 1);
  
  // Calculate health from 0 (polluted) to 1 (pure)
  const health = Math.min(score / 10, 1);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
      
      const time = state.clock.getElapsedTime();
      const breathing = Math.sin(time * 0.5) * 0.1;
      
      const currentScale = meshRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale + breathing, 0.05);
      meshRef.current.scale.set(nextScale, nextScale, nextScale);
      
      // Calculate color: Orange/Red (polluted) -> Emerald Green (pure)
      const r = THREE.MathUtils.lerp(0.8, 0.1, health); // Red decreases
      const g = THREE.MathUtils.lerp(0.3, 0.8, health); // Green increases
      const b = THREE.MathUtils.lerp(0.1, 0.4, health); // Blue increases slightly
      
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.color.lerp(new THREE.Color(r, g, b), 0.05);
      material.emissive.lerp(new THREE.Color(r * 0.5, g * 0.5, b * 0.5), 0.05);
    }
  });

  return (
    <mesh ref={meshRef}>
      {score < 5 ? (
        <icosahedronGeometry args={[1, 1]} />
      ) : score < 15 ? (
        <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />
      ) : (
        <sphereGeometry args={[1.2, 64, 64]} />
      )}
      <meshStandardMaterial
        color="#cc4400"
        emissive="#441100"
        wireframe={score < 15}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { pointer, viewport } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      // Map pointer to 3D space with lerp for smoothness
      const targetX = (pointer.x * viewport.width) / 2;
      const targetY = (pointer.y * viewport.height) / 2;
      lightRef.current.position.x += (targetX - lightRef.current.position.x) * 0.1;
      lightRef.current.position.y += (targetY - lightRef.current.position.y) * 0.1;
    }
  });

  return (
    <pointLight ref={lightRef} color="#34d399" intensity={30} distance={15} position={[0,0,2]} />
  );
}

import { useImpact } from '@/context/ImpactContext';

export default function Background() {
  const { impactStats } = useImpact();
  // Health ratio: starts at 0 (polluted), maxes out at 1 (healthy) after 5 good decisions
  const healthRatio = Math.min(impactStats.decisionsOverridden / 5, 1);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none fixed inset-0 z-0 bg-[#0a0f1a]"
    >
      {/* 2D Overlay grid */}
      <div
        className="absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* 3D WebGL Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.2} />
          <BreathingMesh healthRatio={healthRatio} />
          <CursorLight />
          <Sparkles 
            count={300} 
            scale={15} 
            size={2} 
            speed={0.2} 
            opacity={0.4} 
            color="#10b981" 
          />
        </Canvas>
      </div>
    </motion.div>
  );
}

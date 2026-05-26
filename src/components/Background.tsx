'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useImpact } from '@/context/ImpactContext';

function BreathingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { impactStats } = useImpact();
  
  const score = impactStats.decisionsOverridden;
  const health = Math.min(score / 10, 1);
  const targetScale = 2 + Math.min(score * 0.1, 1);

  useFrame((state) => {
    if (meshRef.current) {
      // Natural earth rotation
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      
      const time = state.clock.getElapsedTime();
      const breathing = Math.sin(time) * 0.05;
      
      const currentScale = meshRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale + breathing, 0.05);
      meshRef.current.scale.set(nextScale, nextScale, nextScale);
    }

    if (materialRef.current) {
      // Color shifts from Smoggy Orange to Pure Emerald
      const r = THREE.MathUtils.lerp(0.9, 0.1, health);
      const g = THREE.MathUtils.lerp(0.3, 0.8, health);
      const b = THREE.MathUtils.lerp(0.1, 0.5, health);
      
      const targetColor = new THREE.Color(r, g, b);
      materialRef.current.color.lerp(targetColor, 0.05);
      
      // Emissive pulse (heartbeat)
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.8;
      materialRef.current.emissive.lerp(new THREE.Color(r * 0.6, g * 0.6, b * 0.6), 0.05);
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#e65c00"
        emissive="#803300"
        roughness={0.4}
        metalness={0.3}
        wireframe={score < 2} // Starts as a wireframe, solidifies as you do green actions
      />
      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshBasicMaterial 
          color={new THREE.Color(0.1, Math.max(0.8, health), 0.5)} 
          transparent 
          opacity={0.1 + health * 0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
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
          <BreathingMesh />
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

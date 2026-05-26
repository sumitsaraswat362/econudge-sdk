'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useImpact } from '@/context/ImpactContext';

function BreathingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { impactStats } = useImpact();
  
  const score = impactStats.decisionsOverridden;
  const health = Math.min(score / 5, 1); // Maxes out at 5 decisions

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation of the massive wireframe
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.z += 0.0005;
      
      const time = state.clock.getElapsedTime();
      const breathing = Math.sin(time * 0.5) * 0.15;
      const scale = 1 + breathing;
      meshRef.current.scale.set(scale, scale, scale);
    }

    if (materialRef.current) {
      // Color shifts from Smoggy Orange to Pure Emerald
      const r = THREE.MathUtils.lerp(0.85, 0.06, health);
      const g = THREE.MathUtils.lerp(0.46, 0.72, health);
      const b = THREE.MathUtils.lerp(0.02, 0.50, health); // #10b981 is roughly 16, 185, 129
      
      const targetColor = new THREE.Color(r, g, b);
      materialRef.current.color.lerp(targetColor, 0.05);
      
      const pulse = Math.sin(state.clock.elapsedTime) * 0.5 + 1.5;
      materialRef.current.emissive.lerp(targetColor, 0.05);
      materialRef.current.emissiveIntensity = pulse * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, -8]}>
        <icosahedronGeometry args={[5, 16]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#d97706"
          emissive="#f59e0b"
          emissiveIntensity={1}
          wireframe
          transparent
          opacity={0.15}
          roughness={0.2}
        />
      </mesh>
    </Float>
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

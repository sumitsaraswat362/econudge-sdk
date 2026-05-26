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
  
  const targetEmissive = new THREE.Color().lerpColors(
    new THREE.Color('#f59e0b'), // polluted yellow-orange
    new THREE.Color('#10b981'), // healthy green glow
    healthRatio
  );

  useFrame((state) => {
    if (meshRef.current) {
      // Breathing scale effect (simulating a lung/heartbeat)
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      meshRef.current.scale.set(scale, scale, scale);
      
      // Slow, organic rotation
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.z += 0.001;
    }

    if (materialRef.current) {
      // Smoothly interpolate colors for dynamic shift
      materialRef.current.color.lerp(targetColor, 0.05);
      materialRef.current.emissive.lerp(targetEmissive, 0.05);

      // Pulsing color effect
      const pulse = (Math.sin(state.clock.elapsedTime) + 1) / 2;
      materialRef.current.emissiveIntensity = 0.5 + pulse * 2.0;
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

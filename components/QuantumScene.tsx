
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Octahedron, Icosahedron, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Add this to fix IntrinsicElements errors
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      meshStandardMaterial: any;
      fog: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
      mesh: any;
      cylinderGeometry: any;
      gridHelper: any;
    }
  }
}

// Ensure global JSX is also covered for specific environments
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshStandardMaterial: any;
      fog: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
      mesh: any;
      cylinderGeometry: any;
      gridHelper: any;
    }
  }
}

const NeonOperatorNode = ({ position, color, speed = 1, type = 'sphere' }: { position: [number, number, number]; color: string; speed?: number; type?: 'sphere' | 'octa' }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.x = t * 0.4 * speed;
      ref.current.rotation.y = t * 0.5 * speed;
      ref.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.1;
    }
  });

  if (type === 'octa') {
      return (
        <Octahedron ref={ref} args={[0.8]} position={position}>
            <meshStandardMaterial 
                color={color} 
                emissive={color}
                emissiveIntensity={2}
                wireframe
                transparent
                opacity={0.8}
            />
        </Octahedron>
      )
  }

  return (
    <Sphere ref={ref} args={[0.6, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        wireframe={true}
        metalness={1}
        roughness={0}
        distort={0.4}
        speed={speed}
      />
    </Sphere>
  );
};

const CyberTorus = () => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const t = state.clock.getElapsedTime();
       ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.2;
       ref.current.rotation.z = t * 0.1;

       // Pulse effect
       const material = ref.current.material as THREE.MeshStandardMaterial;
       if (material) {
         // Base intensity 1.5, pulsing +/- 0.8 over time
         material.emissiveIntensity = 1.5 + Math.sin(t * 3) * 0.8;
       }
    }
  });

  return (
    <Torus ref={ref} args={[3.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} toneMapped={false} />
    </Torus>
  );
}

export const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }} gl={{ toneMappingExposure: 1.5 }}>
        <fog attach="fog" args={['#050505', 5, 20]} />
        <ambientLight intensity={0.5} />
        
        {/* Neon Lights */}
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" distance={20} />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#ff003c" distance={20} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          {/* Central State */}
          <Sphere args={[1, 64, 64]}>
             <MeshDistortMaterial 
                color="#1a1a1d" 
                emissive="#710193"
                emissiveIntensity={0.5}
                roughness={0.1}
                metalness={1}
                distort={0.3}
                speed={2}
             />
          </Sphere>
          <CyberTorus />
        </Float>
        
        {/* Orbiting Operators */}
        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
           <NeonOperatorNode position={[-3, 1.5, -1]} color="#fcee0a" type="octa" speed={2} />
           <NeonOperatorNode position={[3, -1.5, -2]} color="#00f0ff" type="octa" speed={2} />
           <NeonOperatorNode position={[0, 3, -4]} color="#ff003c" type="sphere" speed={1.5} />
        </Float>

        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={2} />
      </Canvas>
    </div>
  );
};

export const HilbertSpaceScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} angle={0.5} penumbra={1} intensity={3} color="#00f0ff" />
        <spotLight position={[-5, -5, -5]} angle={0.5} penumbra={1} intensity={3} color="#ff003c" />
        
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
            {/* The Quantum State Visualization */}
            <Sphere args={[1.5, 64, 64]}>
                <MeshDistortMaterial 
                    color="#1a1a1d" 
                    emissive="#00f0ff"
                    emissiveIntensity={0.5}
                    wireframe
                    distort={0.5}
                    speed={2}
                    metalness={0.1}
                    roughness={0.2}
                />
            </Sphere>
            <Sphere args={[1.2, 32, 32]}>
                <meshStandardMaterial 
                    color="#00f0ff" 
                    emissive="#00f0ff"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                />
            </Sphere>
        </Float>
        
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

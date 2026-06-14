"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export interface GlobeCity {
  name: string;
  lat: number;
  lng: number;
}

// Santiago's footprint: Sao Paulo roots, RISS in Rotterdam, Tec de Monterrey
// in the State of Mexico and Santa Fe (Mexico City).
const CITIES: GlobeCity[] = [
  { name: "Sao Paulo", lat: -23.55, lng: -46.63 },
  { name: "Rotterdam", lat: 51.92, lng: 4.48 },
  { name: "Mexico City", lat: 19.43, lng: -99.13 },
];

const RADIUS = 1;

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function Marker({ position }: { position: THREE.Vector3 }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ring.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      ring.current.scale.set(s, s, s);
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 - Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={ring} lookAt={() => new THREE.Vector3(0, 0, 0)}>
        <ringGeometry args={[0.04, 0.055, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function arcPoints(a: THREE.Vector3, b: THREE.Vector3, segments = 48): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lift = 1 + 0.3 * Math.sin(Math.PI * t);
    points.push(a.clone().lerp(b, t).normalize().multiplyScalar(RADIUS * lift));
  }
  return points;
}

function GlobeMesh() {
  const group = useRef<THREE.Group>(null);

  const markerPositions = useMemo(
    () => CITIES.map((c) => latLngToVec3(c.lat, c.lng, RADIUS)),
    [],
  );

  const arcs = useMemo(() => {
    const result: THREE.Vector3[][] = [];
    for (let i = 0; i < markerPositions.length; i++) {
      const next = (i + 1) % markerPositions.length;
      result.push(arcPoints(markerPositions[i], markerPositions[next]));
    }
    return result;
  }, [markerPositions]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={group}>
      {/* Wireframe sphere */}
      <mesh>
        <icosahedronGeometry args={[RADIUS, 6]} />
        <meshBasicMaterial color="#52525b" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Solid inner sphere for depth */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.985, 48, 48]} />
        <meshBasicMaterial color="#09090b" transparent opacity={0.85} />
      </mesh>
      {/* Latitude / longitude lines via a faint wire shell */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.001, 24, 16]} />
        <meshBasicMaterial color="#a1a1aa" wireframe transparent opacity={0.08} />
      </mesh>
      {arcs.map((pts, i) => (
        <Line key={i} points={pts} color="#ffffff" lineWidth={1} transparent opacity={0.45} />
      ))}
      {markerPositions.map((p, i) => (
        <Marker key={i} position={p} />
      ))}
    </group>
  );
}

export default function Globe({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={className} aria-hidden="true" />;
  }

  return (
    <div className={className} aria-label="Interactive globe showing Sao Paulo, Rotterdam, and Mexico City" role="img">
      <Canvas camera={{ position: [0, 0, 3.1], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={1} />
        <GlobeMesh />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} rotateSpeed={0.4} />
      </Canvas>
    </div>
  );
}

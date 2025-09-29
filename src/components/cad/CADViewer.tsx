import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid, Environment } from "@react-three/drei";
import { Mesh } from "three";
import { Loader } from "lucide-react";

interface CADViewerProps {
  file: File;
  controls: {
    zoom: number;
    rotation: { x: number; y: number; z: number };
    position: { x: number; y: number; z: number };
  };
  onControlsChange: (controls: any) => void;
}

// Placeholder 3D model component (since we can't actually parse 3DM files without specialized libraries)
const PlaceholderModel = ({ fileName }: { fileName: string }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      {/* Main geometry placeholder */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color={hovered ? "#646cff" : "#747bff"} 
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Additional elements */}
      <mesh position={[3, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 3]} />
        <meshStandardMaterial color="#ff6b6b" metalness={0.1} roughness={0.8} />
      </mesh>
      
      <mesh position={[-3, 1, 1]}>
        <sphereGeometry args={[1]} />
        <meshStandardMaterial color="#4ecdc4" metalness={0.5} roughness={0.1} />
      </mesh>
    </group>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="flex flex-col items-center space-y-4">
      <Loader className="w-8 h-8 animate-spin text-primary" />
      <p className="text-gray-600">Chargement du modèle 3D...</p>
    </div>
  </div>
);

export const CADViewer = ({ file, controls, onControlsChange }: CADViewerProps) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gray-50">
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        
        {/* Environment */}
        <Environment preset="apartment" />
        
        {/* Grid */}
        <Grid
          cellSize={1}
          cellThickness={0.5}
          cellColor="#666666"
          sectionSize={10}
          sectionThickness={1}
          sectionColor="#999999"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
        
        {/* 3D Model */}
        <Suspense fallback={null}>
          <PlaceholderModel fileName={file.name} />
        </Suspense>
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
          minDistance={2}
          maxDistance={50}
        />
      </Canvas>
      
      {/* File info overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <div className="text-sm">
          <p className="font-medium text-gray-900">{file.name}</p>
          <p className="text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    </div>
  );
};
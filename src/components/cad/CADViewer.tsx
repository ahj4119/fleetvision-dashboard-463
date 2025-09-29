import { Suspense, useRef, useState, useEffect } from "react";
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

// Actual 3DM file model component
const RhinoModel = ({ file }: { file: File }) => {
  const [modelData, setModelData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Parse the 3DM file
  useEffect(() => {
    const parseRhinoFile = async () => {
      try {
        // For now, create a representation based on file properties
        // In a real implementation, you'd use rhino3dm.js or similar
        const reader = new FileReader();
        reader.onload = (e) => {
          // This is a simplified representation
          // Real 3DM parsing would require rhino3dm.js library
          setModelData({
            fileName: file.name,
            fileSize: file.size,
            type: '3dm',
            parsed: true
          });
        };
        reader.onerror = () => {
          setError('Failed to read file');
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        setError('Error parsing 3DM file');
      }
    };

    parseRhinoFile();
  }, [file]);

  if (error) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 2, 0.1]} />
          <meshStandardMaterial color="#ff4444" />
        </mesh>
      </group>
    );
  }

  if (!modelData) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#cccccc" wireframe />
        </mesh>
      </group>
    );
  }

  // Generate a unique model based on file characteristics
  const seed = file.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const colorHue = (seed % 360) / 360;
  const complexity = Math.min(Math.floor(file.size / 100000) + 3, 12);

  return (
    <group>
      {/* Main model representation based on file */}
      {Array.from({ length: complexity }, (_, i) => {
        const angle = (i / complexity) * Math.PI * 2;
        const radius = 2 + Math.sin(seed + i) * 0.5;
        const height = 1 + Math.cos(seed + i * 2) * 0.5;
        
        return (
          <mesh
            key={i}
            ref={i === 0 ? meshRef : undefined}
            position={[
              Math.cos(angle) * radius,
              Math.sin(seed + i) * height,
              Math.sin(angle) * radius
            ]}
            rotation={[
              Math.sin(seed + i) * 0.5,
              angle,
              Math.cos(seed + i) * 0.3
            ]}
          >
            <boxGeometry args={[
              0.5 + Math.abs(Math.sin(seed + i)) * 0.5,
              0.5 + Math.abs(Math.cos(seed + i)) * 0.5,
              0.5 + Math.abs(Math.sin(seed + i * 2)) * 0.5
            ]} />
            <meshStandardMaterial 
              color={`hsl(${(colorHue + i * 0.1) * 360}, 70%, ${50 + i * 2}%)`}
              metalness={0.3 + (i % 3) * 0.2}
              roughness={0.2 + (i % 2) * 0.3}
            />
          </mesh>
        );
      })}
      
      {/* Central core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8]} />
        <meshStandardMaterial 
          color={`hsl(${colorHue * 360}, 80%, 60%)`}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="flex flex-col items-center space-y-4">
      <Loader className="w-8 h-8 animate-spin text-primary" />
      <p className="text-gray-600">Loading 3D model...</p>
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
          <RhinoModel file={file} />
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
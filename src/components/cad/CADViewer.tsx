import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid, Environment } from "@react-three/drei";
import { Mesh, BufferGeometry, Float32BufferAttribute, BufferAttribute, Group } from "three";
import { Loader } from "lucide-react";
import { rhinoService, RhinoObject } from "@/services/rhinoCompute";

interface CADViewerProps {
  file: File;
  controls: {
    zoom: number;
    rotation: { x: number; y: number; z: number };
    position: { x: number; y: number; z: number };
  };
  onControlsChange: (controls: any) => void;
}

// Rhino 3DM model component using actual file parsing
const RhinoModel = ({ file }: { file: File }) => {
  const [rhinoObjects, setRhinoObjects] = useState<RhinoObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // Parse the actual 3DM file using rhino3dm
  useEffect(() => {
    const parseRhinoFile = async () => {
      try {
        setLoading(true);
        setError(null);
        setRhinoObjects([]); // Clear previous objects
        
        console.log('Starting to parse 3DM file:', file.name, 'Size:', file.size);
        
        // Add some delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const objects = await rhinoService.parse3dmFile(file);
        
        console.log('Successfully parsed objects:', objects.length);
        console.log('Objects details:', objects);
        setRhinoObjects(objects);
      } catch (err) {
        console.error('Error parsing 3DM file:', err);
        setError(err instanceof Error ? err.message : 'Failed to parse 3DM file');
      } finally {
        setLoading(false);
      }
    };

    parseRhinoFile();
  }, [file]);

  if (loading) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.1, 2]} />
          <meshStandardMaterial color="#888888" wireframe />
        </mesh>
      </group>
    );
  }

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

  if (rhinoObjects.length === 0) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#cccccc" wireframe />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      {rhinoObjects.map((rhinoObj, index) => {
        const geometry = new BufferGeometry();
        
        // Convert vertices to flat array
        const vertices = new Float32Array(rhinoObj.geometry.vertices.flat());
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        
        // Add faces (indices)
        const indices = new Uint16Array(rhinoObj.geometry.faces.flat());
        geometry.setIndex(new BufferAttribute(indices, 1));
        
        // Add normals if available
        if (rhinoObj.geometry.normals) {
          const normals = new Float32Array(rhinoObj.geometry.normals.flat());
          geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        } else {
          geometry.computeVertexNormals();
        }
        
        // Add colors if available
        let materialColor = `hsl(${(index * 137.5) % 360}, 70%, 60%)`;
        if (rhinoObj.geometry.colors && rhinoObj.geometry.colors.length > 0) {
          const colors = new Float32Array(rhinoObj.geometry.colors.flat());
          geometry.setAttribute('color', new Float32BufferAttribute(colors, 4));
        }
        
        return (
          <mesh key={rhinoObj.id} geometry={geometry}>
            <meshStandardMaterial 
              color={materialColor}
              metalness={0.3}
              roughness={0.4}
              vertexColors={rhinoObj.geometry.colors ? true : false}
            />
          </mesh>
        );
      })}
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
// Rhino Compute Service for processing 3DM files
export interface RhinoGeometry {
  vertices: number[][];
  faces: number[][];
  normals?: number[][];
  colors?: number[][];
  materials?: any[];
}

export interface RhinoObject {
  id: string;
  geometry: RhinoGeometry;
  attributes: any;
  objectType: string;
}

export class RhinoComputeService {
  private static instance: RhinoComputeService;
  private rhinoModule: any = null;
  
  static getInstance(): RhinoComputeService {
    if (!RhinoComputeService.instance) {
      RhinoComputeService.instance = new RhinoComputeService();
    }
    return RhinoComputeService.instance;
  }

  async initialize() {
    if (this.rhinoModule) return this.rhinoModule;
    
    try {
      console.log('Initializing rhino3dm library...');
      // Load rhino3dm library
      const rhino3dm = await import('rhino3dm');
      console.log('Rhino3dm module loaded, initializing...');
      this.rhinoModule = await rhino3dm.default();
      console.log('Rhino3dm initialized successfully');
      return this.rhinoModule;
    } catch (error) {
      console.error('Failed to initialize rhino3dm:', error);
      throw new Error(`Rhino3dm initialization failed: ${error}`);
    }
  }

  async parse3dmFile(file: File): Promise<RhinoObject[]> {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const arr = new Uint8Array(arrayBuffer);
          
          // Parse the 3DM file using rhino3dm
          const doc = this.rhinoModule.File3dm.fromByteArray(arr);
          const objects: RhinoObject[] = [];
          
          // Extract objects from the document
          const objectTable = doc.objects();
          const count = objectTable.count;
          
          for (let i = 0; i < count; i++) {
            const rhinoObject = objectTable.get(i);
            const geometry = rhinoObject.geometry();
            
            if (geometry) {
              const meshGeometry = this.extractMeshGeometry(geometry);
              if (meshGeometry) {
                objects.push({
                  id: rhinoObject.id.toString(),
                  geometry: meshGeometry,
                  attributes: this.extractAttributes(rhinoObject),
                  objectType: geometry.objectType
                });
              }
            }
          }
          
          doc.delete();
          resolve(objects);
        } catch (error) {
          console.error('Error parsing 3DM file:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private extractMeshGeometry(geometry: any): RhinoGeometry | null {
    try {
      let mesh = null;
      
      // Try to get mesh directly or convert to mesh
      if (geometry.objectType === this.rhinoModule.ObjectType.Mesh) {
        mesh = geometry;
      } else if (geometry.objectType === this.rhinoModule.ObjectType.Brep) {
        // Convert Brep to mesh
        const meshParams = this.rhinoModule.MeshingParameters.default;
        mesh = this.rhinoModule.Mesh.createFromBrep(geometry, meshParams);
      } else if (geometry.objectType === this.rhinoModule.ObjectType.Surface) {
        // Convert Surface to mesh
        const meshParams = this.rhinoModule.MeshingParameters.default;
        mesh = this.rhinoModule.Mesh.createFromSurface(geometry, meshParams);
      }
      
      if (!mesh) return null;
      
      // Extract vertices
      const vertices: number[][] = [];
      const vertexCount = mesh.vertices().count;
      for (let i = 0; i < vertexCount; i++) {
        const vertex = mesh.vertices().get(i);
        vertices.push([vertex[0], vertex[1], vertex[2]]);
      }
      
      // Extract faces
      const faces: number[][] = [];
      const faceCount = mesh.faces().count;
      for (let i = 0; i < faceCount; i++) {
        const face = mesh.faces().get(i);
        if (face.isTriangle) {
          faces.push([face.a, face.b, face.c]);
        } else {
          // Convert quad to triangles
          faces.push([face.a, face.b, face.c]);
          faces.push([face.a, face.c, face.d]);
        }
      }
      
      // Extract normals if available
      let normals: number[][] | undefined;
      if (mesh.normals().count > 0) {
        normals = [];
        for (let i = 0; i < mesh.normals().count; i++) {
          const normal = mesh.normals().get(i);
          normals.push([normal[0], normal[1], normal[2]]);
        }
      }
      
      // Extract colors if available
      let colors: number[][] | undefined;
      if (mesh.vertexColors().count > 0) {
        colors = [];
        for (let i = 0; i < mesh.vertexColors().count; i++) {
          const color = mesh.vertexColors().get(i);
          colors.push([color.r / 255, color.g / 255, color.b / 255, color.a / 255]);
        }
      }
      
      mesh.delete();
      
      return {
        vertices,
        faces,
        normals,
        colors
      };
    } catch (error) {
      console.error('Error extracting mesh geometry:', error);
      return null;
    }
  }
  
  private extractAttributes(rhinoObject: any): any {
    try {
      const attributes = rhinoObject.attributes();
      return {
        layer: attributes.layerIndex,
        material: attributes.materialIndex,
        color: attributes.drawColor,
        visible: attributes.visible,
        name: attributes.name || ''
      };
    } catch (error) {
      return {};
    }
  }
}

export const rhinoService = RhinoComputeService.getInstance();
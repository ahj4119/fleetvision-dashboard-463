import { useState } from "react";
import { Upload, RotateCcw, ZoomIn, ZoomOut, Save } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/cad/FileUpload";
import { CADViewer } from "@/components/cad/CADViewer";
import { ToolPanel } from "@/components/cad/ToolPanel";

const CAD = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [viewerControls, setViewerControls] = useState({
    zoom: 1,
    rotation: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 0, z: 0 }
  });

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const resetView = () => {
    setViewerControls({
      zoom: 1,
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 }
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">3D Modeling</h1>
              <p className="text-gray-600">Upload and visualize your Rhino 3DM files</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetView}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Upload Area / Viewer */}
          <div className="flex-1 p-6">
            {!uploadedFile ? (
              <FileUpload onFileUpload={handleFileUpload} />
            ) : (
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {uploadedFile.name}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-5rem)]">
                  <CADViewer 
                    file={uploadedFile} 
                    controls={viewerControls}
                    onControlsChange={setViewerControls}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tool Panel */}
          {uploadedFile && (
            <div className="w-80 p-6 bg-white border-l">
              <ToolPanel 
                file={uploadedFile}
                controls={viewerControls}
                onControlsChange={setViewerControls}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CAD;
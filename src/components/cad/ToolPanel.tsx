import { useState } from "react";
import { 
  Move, 
  RotateCw, 
  ZoomIn, 
  Palette, 
  Layers, 
  Eye, 
  EyeOff,
  Settings,
  Ruler,
  Grid3X3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ToolPanelProps {
  file: File;
  controls: any;
  onControlsChange: (controls: any) => void;
}

export const ToolPanel = ({ file, controls, onControlsChange }: ToolPanelProps) => {
  const [activeMode, setActiveMode] = useState<'move' | 'rotate' | 'zoom'>('move');
  const [showGrid, setShowGrid] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  const [layers] = useState([
    { id: 1, name: 'Main Geometry', visible: true, color: '#747bff' },
    { id: 2, name: 'Details', visible: true, color: '#ff6b6b' },
    { id: 3, name: 'Annotations', visible: false, color: '#4ecdc4' }
  ]);

  const tools = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'rotate', icon: RotateCw, label: 'Rotate' },
    { id: 'zoom', icon: ZoomIn, label: 'Zoom' }
  ];

  return (
    <div className="space-y-6">
      {/* File Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">File Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{file.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Size:</span>
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Format:</span>
            <Badge variant="secondary">Rhino 3DM</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={activeMode === tool.id ? "default" : "outline"}
                size="sm"
                className="flex flex-col h-16 p-2"
                onClick={() => setActiveMode(tool.id as any)}
              >
                <tool.icon className="w-4 h-4 mb-1" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Grid3X3 className="w-4 h-4" />
              <span className="text-sm">Grid</span>
            </div>
            <Switch checked={showGrid} onCheckedChange={setShowGrid} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ruler className="w-4 h-4" />
              <span className="text-sm">Wireframe</span>
            </div>
            <Switch checked={showWireframe} onCheckedChange={setShowWireframe} />
          </div>

          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Opacity</span>
              <span className="text-xs text-gray-500">100%</span>
            </div>
            <Slider defaultValue={[100]} max={100} step={1} />
          </div>
        </CardContent>
      </Card>

      {/* Layers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Layers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {layers.map((layer) => (
            <div key={layer.id} className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                {layer.visible ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3 text-gray-400" />
                )}
              </Button>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: layer.color }}
              />
              <span className="text-sm flex-1">{layer.name}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button variant="outline" className="w-full">
          <Palette className="w-4 h-4 mr-2" />
          Materials
        </Button>
      </div>
    </div>
  );
};
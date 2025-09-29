import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.3dm'],
      'model/rhino': ['.3dm']
    },
    maxFiles: 1
  });

  return (
    <Card className="h-full flex items-center justify-center">
      <CardContent className="text-center p-12">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {isDragActive ? (
                <Upload className="w-8 h-8 text-primary animate-bounce" />
              ) : (
                <FileIcon className="w-8 h-8 text-primary" />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {isDragActive 
                  ? 'Déposez votre fichier ici...' 
                  : 'Téléchargez votre fichier 3DM'
                }
              </h3>
              <p className="text-gray-600">
                Glissez-déposez votre fichier Rhino 3DM ou cliquez pour parcourir
              </p>
            </div>

            <Button variant="outline" className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              Choisir un fichier
            </Button>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Formats supportés: .3dm (Rhino 3D)</p>
          <p>Taille maximale: 50MB</p>
        </div>
      </CardContent>
    </Card>
  );
};
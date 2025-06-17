import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File } from 'lucide-react';

interface FileUploadProps {
  documentos: string[];
  setDocumentos: (documentos: string[]) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  documentos,
  setDocumentos,
  acceptedTypes = ['pdf', 'doc', 'docx', 'jpg', 'png'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const fileNames = acceptedFiles.map(file => file.name);
    const updatedFiles = multiple ? [...documentos, ...fileNames] : fileNames;
    setDocumentos(updatedFiles);
  }, [documentos, multiple, setDocumentos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[`.${type}`] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple
  });

  const removeFile = (index: number) => {
    const updatedFiles = documentos.filter((_, i) => i !== index);
    setDocumentos(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        {isDragActive ? (
          <p className="text-blue-600">Solte os arquivos aqui...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-1">
              Clique para selecionar ou arraste arquivos aqui
            </p>
            <p className="text-sm text-gray-500">
              Tipos aceitos: {acceptedTypes.join(', ')} (máx. {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </div>
        )}
      </div>

      {documentos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Arquivos selecionados:</h4>
          {documentos.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <File className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{file}</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
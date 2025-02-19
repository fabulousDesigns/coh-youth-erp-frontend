// components/ui/file-upload.tsx
import { ChangeEvent, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({ onFileSelect, accept, maxSize = 5, className }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    setError('');
    
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    if (accept && !accept.split(',').some(type => file.type.match(type.trim()))) {
      setError('Invalid file type');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className={className}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6",
          dragActive ? "border-primary-500 bg-primary-50" : "border-secondary-300",
          className
        )}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={accept}
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-secondary-400" />
          <p className="mt-2 text-sm text-secondary-600">
            Drag and drop your file here, or click to select
          </p>
          <p className="mt-1 text-xs text-secondary-500">
            Maximum file size: {maxSize}MB
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {selectedFile && !error && (
        <div className="mt-2 flex items-center justify-between p-2 bg-secondary-50 rounded-md">
          <span className="text-sm text-secondary-700">{selectedFile.name}</span>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedFile(null);
              setError('');
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
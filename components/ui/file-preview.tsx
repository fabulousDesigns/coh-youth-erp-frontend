// components/ui/file-preview.tsx
import { FileText, Image, FileSpreadsheet, Presentation } from 'lucide-react';

interface FilePreviewProps {
  type: string;
  url?: string;
  className?: string;
}

export function FilePreview({ type, url, className }: FilePreviewProps) {
  const getPreviewComponent = () => {
    switch (type.toLowerCase()) {
      case 'image':
        return url ? (
          <img
            src={url}
            alt="Preview"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <Image className="w-12 h-12 text-secondary-400" />
        );
      case 'spreadsheet':
        return <FileSpreadsheet className="w-12 h-12 text-green-500" />;
      case 'presentation':
        return <Presentation className="w-12 h-12 text-orange-500" />;
      default:
        return <FileText className="w-12 h-12 text-blue-500" />;
    }
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      {getPreviewComponent()}
    </div>
  );
}
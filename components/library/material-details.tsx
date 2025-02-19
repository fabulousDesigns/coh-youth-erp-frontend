// components/library/material-details.tsx
import { Modal } from '../ui/modal';
import { FilePreview } from '../ui/file-preview';
import { Download, Clock, User, HardDrive } from 'lucide-react';
import { Button } from '../ui/button';

interface MaterialDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    name: string;
    type: string;
    uploadedBy: {
      name: string;
    };
    uploadDate: string;
    fileSize: number;
  };
  onDownload: () => void;
}

export function MaterialDetails({
  isOpen,
  onClose,
  material,
  onDownload,
}: MaterialDetailsProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Material Details">
      <div className="space-y-6">
        <FilePreview type={material.type} className="bg-secondary-50 rounded-lg" />

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg text-primary-900">{material.name}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-secondary-600">
              <User className="w-4 h-4" />
              <span className="text-sm">{material.uploadedBy.name}</span>
            </div>

            <div className="flex items-center space-x-2 text-secondary-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {new Date(material.uploadDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-secondary-600">
              <HardDrive className="w-4 h-4" />
              <span className="text-sm">
                {Math.round(material.fileSize / 1024)} KB
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Modal>
  );
}
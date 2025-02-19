// components/ui/modal.tsx
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className={cn(
          "relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg",
          className
        )}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-secondary-500 hover:text-secondary-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
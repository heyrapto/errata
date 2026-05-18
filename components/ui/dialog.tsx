import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  useEffectForEscape(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Content */}
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-neutral-100">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <h3 className="text-lg font-semibold text-emerald-400">{title}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
          >
            ✕
          </Button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

function useEffectForEscape(onClose: () => void, isOpen: boolean) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
}

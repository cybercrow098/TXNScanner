import React from 'react';
import { X, Lock, CreditCard } from 'lucide-react';

interface DemoLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function DemoLimitModal({ isOpen, onClose, onUpgrade }: DemoLimitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-cyber-black/80 backdrop-blur-md" aria-hidden="true" />
        
        <div className="relative w-full max-w-md mx-auto cyber-card border-cyber-primary">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-primary" />
              <h2 className="text-lg sm:text-xl font-bold">Feature Locked</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:text-cyber-primary transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-cyber-secondary/90">
              Bulk scanning and file upload features are only available with a premium subscription. Upgrade your plan to unlock:
            </p>

            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center gap-2 text-cyber-accent text-sm sm:text-base">
                <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full flex-shrink-0"></span>
                <span>Unlimited bulk address scanning</span>
              </li>
              <li className="flex items-center gap-2 text-cyber-accent text-sm sm:text-base">
                <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full flex-shrink-0"></span>
                <span>File upload support</span>
              </li>
              <li className="flex items-center gap-2 text-cyber-accent text-sm sm:text-base">
                <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full flex-shrink-0"></span>
                <span>Higher rate limits</span>
              </li>
              <li className="flex items-center gap-2 text-cyber-accent text-sm sm:text-base">
                <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full flex-shrink-0"></span>
                <span>Priority API access</span>
              </li>
            </ul>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                onClick={onClose}
                className="cyber-button w-full sm:w-1/2"
              >
                Continue with Demo
              </button>
              <button
                onClick={onUpgrade}
                className="cyber-button cyber-button-primary w-full sm:w-1/2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Upgrade Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
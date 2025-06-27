import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading market data...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <Loader className="w-12 h-12 text-cyber-accent animate-spin" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent/0 via-cyber-accent/20 to-cyber-accent/0 animate-shine" />
      </div>
      <p className="text-cyber-accent animate-pulse font-bold">{message}</p>
    </div>
  );
}
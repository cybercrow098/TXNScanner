import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, RefreshCw, BarChart2, Scale } from 'lucide-react';
import MarketAnomalyScanner from './MarketAnomalyScanner';
import MicrostructureScanner from './MicrostructureScanner';

export default function AnomalyDetector() {
  const [activeTab, setActiveTab] = useState<'anomaly' | 'microstructure'>('anomaly');

  return (
    <div className="min-h-screen bg-cyber-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Market Analysis</h2>
            <p className="text-cyber-secondary/70">
              Advanced market analysis and anomaly detection tools
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('anomaly')}
              className={`cyber-button ${activeTab === 'anomaly' ? 'cyber-button-primary' : ''}`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Anomaly Scanner</span>
            </button>
            <button
              onClick={() => setActiveTab('microstructure')}
              className={`cyber-button ${activeTab === 'microstructure' ? 'cyber-button-primary' : ''}`}
            >
              <Scale className="w-4 h-4" />
              <span>Microstructure</span>
            </button>
          </div>
        </div>

        {activeTab === 'anomaly' ? (
          <MarketAnomalyScanner />
        ) : (
          <MicrostructureScanner />
        )}
      </div>
    </div>
  );
}
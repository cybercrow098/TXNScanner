import React, { useState } from 'react';
import { Search, List, RefreshCw, Download, Trash2, Upload, Loader, StopCircle, CreditCard, AlertTriangle, ChevronRight, X, Info, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { stopBulkScan } from '../services/scannerService';

interface WalletScannerProps {
  selectedScanner: string;
  isBulkMode: boolean;
  setBulkMode: (enabled: boolean) => void;
  bulkAddresses: string;
  setBulkAddresses: (addresses: string) => void;
  address: string;
  setAddress: (address: string) => void;
  loading: boolean;
  handleBulkCheck: () => void;
  handleSingleCheck: () => void;
  autoRefresh: boolean;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  exportResults: () => void;
  clearResults: () => void;
  error: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  progress: { current: number; total: number };
  setShowPricing: (show: boolean) => void;
  showZeroBalances: boolean;
  setShowZeroBalances: (show: boolean) => void;
}

const SCANNER_PLACEHOLDERS = {
  btc: "Enter Bitcoin address",
  eth: "Enter Ethereum address",
  ltc: "Enter Litecoin address",
  tron: "Enter TRON address"
};

export default function WalletScanner({
  selectedScanner,
  isBulkMode,
  setBulkMode,
  bulkAddresses,
  setBulkAddresses,
  address,
  setAddress,
  loading,
  handleBulkCheck,
  handleSingleCheck,
  autoRefresh,
  startAutoRefresh,
  stopAutoRefresh,
  exportResults,
  clearResults,
  error,
  fileInputRef,
  handleFileUpload,
  progress,
  setShowPricing,
  showZeroBalances,
  setShowZeroBalances
}: WalletScannerProps) {
  const [showRateLimitWarning, setShowRateLimitWarning] = useState(true);
  const [showFormatInfo, setShowFormatInfo] = useState(false);

  const handleStopScan = () => {
    stopBulkScan();
    toast.success('Scanning stopped');
  };

  const showRateLimitMessage = selectedScanner === 'tron' && showRateLimitWarning;
  const isPremiumScanner = ['btc', 'eth', 'ltc'].includes(selectedScanner);

  return (
    <section className="cyber-card mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold tracking-wider">
            {selectedScanner.toUpperCase()} SCANNER
          </h2>
          <button
            onClick={() => setShowZeroBalances(!showZeroBalances)}
            className={`cyber-button text-sm ${showZeroBalances ? 'border-cyber-accent text-cyber-accent' : ''}`}
            title={showZeroBalances ? 'Hide zero balances' : 'Show zero balances'}
          >
            {showZeroBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{showZeroBalances ? 'Show All' : 'Hide Empty'}</span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setBulkMode(!isBulkMode)}
            className="cyber-button text-sm"
            title={isBulkMode ? 'Switch to Single Mode' : 'Switch to Bulk Mode'}
          >
            {isBulkMode ? <Search className="w-4 h-4" /> : <List className="w-4 h-4" />}
            <span>{isBulkMode ? 'Single' : 'Bulk'}</span>
          </button>
          {isBulkMode && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.csv"
                className="hidden"
                onClick={(e) => {
                  (e.target as HTMLInputElement).value = '';
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cyber-button text-sm"
                title="Upload addresses file (one address per line)"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </>
          )}
          <button
            onClick={autoRefresh ? stopAutoRefresh : startAutoRefresh}
            className={`cyber-button text-sm min-w-[40px] ${autoRefresh ? 'border-cyber-accent text-cyber-accent' : ''}`}
            title={autoRefresh ? 'Stop auto-refresh' : 'Start auto-refresh (30s)'}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportResults}
            className="cyber-button text-sm min-w-[40px]"
            title="Export results"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearResults}
            className="cyber-button text-sm min-w-[40px]"
            title="Clear results"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showRateLimitMessage && (
        <div className="mb-6 bg-gradient-to-r from-cyber-black/50 to-cyber-black/30 backdrop-blur-sm border-l-4 border-cyber-primary rounded-lg overflow-hidden relative">
          <button
            onClick={() => setShowRateLimitWarning(false)}
            className="absolute top-4 right-4 p-2 hover:text-cyber-primary transition-colors"
            title="Hide warning"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="p-6 flex-grow space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyber-primary/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-cyber-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-cyber-primary">Rate Limit Warning</h3>
              </div>

              <div className="space-y-4 text-sm">
                <p className="text-cyber-secondary/90 leading-relaxed">
                  Free Tron blockchain scanner access is currently rate-limited due to high user volume. 
                  
                </p>

                <p className="text-cyber-secondary/90 leading-relaxed">
                 For unlimited scanning without interruption:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-cyber-accent" />
                        <span>Upgrade to our Premium Plan for unlimited daily requests</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-cyber-accent" />
                        <span>Access real-time transaction data</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-cyber-accent" />
                        <span>Remove all usage restrictions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-cyber-accent" />
                        <span>Get priority API access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cyber-primary/5 border-t md:border-t-0 md:border-l border-cyber-primary/20 p-6 flex items-center justify-center">
              <button
                onClick={() => setShowPricing(true)}
                className="cyber-button cyber-button-primary group relative overflow-hidden"
              >
                <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Upgrade Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/0 via-cyber-primary/20 to-cyber-primary/0 group-hover:animate-shine" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isBulkMode ? (
        <div className="space-y-4">
          <textarea
            value={bulkAddresses}
            onChange={(e) => setBulkAddresses(e.target.value)}
            placeholder={`Enter ${selectedScanner.toUpperCase()} addresses (one per line)`}
            rows={5}
            className="cyber-input w-full resize-none font-mono"
          />
          {loading ? (
            <div className="flex gap-2">
              <button
                onClick={handleStopScan}
                className="cyber-button cyber-button-primary w-full"
              >
                <StopCircle className="w-4 h-4" />
                <span>STOP SCAN</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleBulkCheck}
              disabled={loading}
              className="cyber-button cyber-button-primary w-full"
            >
              <List className="w-4 h-4" />
              <span>SCAN ALL</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-3">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={SCANNER_PLACEHOLDERS[selectedScanner as keyof typeof SCANNER_PLACEHOLDERS]}
            className="cyber-input flex-1"
          />
          <button
            onClick={handleSingleCheck}
            disabled={loading}
            className="cyber-button cyber-button-primary whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>SCANNING...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>SCAN</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-cyber-primary/10 border border-cyber-primary/30 rounded text-sm">
          {error}
        </div>
      )}

      {loading && progress.total > 0 && (
        <div className="mt-4 space-y-2">
          <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
            <div
              className="h-full bg-cyber-primary transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-sm text-cyber-secondary/70 text-center">
            Processing {progress.current} of {progress.total} addresses
          </p>
        </div>
      )}
    </section>
  );
}
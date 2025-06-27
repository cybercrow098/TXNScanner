import React, { useState } from 'react';
import { Brain, Key, Lock, AlertTriangle, ChevronRight, Loader, CreditCard, Hash, Shield } from 'lucide-react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiLitecoin } from 'react-icons/si';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import DemoLimitModal from './DemoLimitModal';

interface Scanner {
  id: string;
  name: string;
  icon: React.ComponentType;
  description: string;
  requiresKey: boolean;
  color: string;
  isEnabled?: boolean;
  demoKey?: string;
  supportsBulk?: boolean;
}

export const INITIAL_SCANNERS: Scanner[] = [
  {
    id: 'tron',
    name: 'TRON Scanner',
    icon: Shield,
    description: 'Scan TRON wallets and view TRC20 tokens',
    requiresKey: false,
    color: 'text-red-500',
    isEnabled: true,
    supportsBulk: true
  }
];

export const MORE_SCANNERS: Scanner[] = [
  {
    id: 'btc',
    name: 'Bitcoin Scanner',
    icon: FaBitcoin,
    description: 'Track BTC balances and transactions',
    requiresKey: true,
    color: 'text-yellow-500',
    isEnabled: false,
    demoKey: 'btc-scanner-key-3333-333',
    supportsBulk: false
  },
  {
    id: 'eth',
    name: 'Ethereum Scanner',
    icon: FaEthereum,
    description: 'Monitor ETH and ERC20 tokens',
    requiresKey: true,
    color: 'text-blue-500',
    isEnabled: false,
    demoKey: 'eth-scanner-key-3333-333',
    supportsBulk: false
  },
  {
    id: 'ltc',
    name: 'Litecoin Scanner',
    icon: SiLitecoin,
    description: 'Check LTC wallet balances',
    requiresKey: true,
    color: 'text-gray-400',
    isEnabled: false,
    demoKey: 'ltc-scanner-key-3333-333',
    supportsBulk: false
  }
];

interface ScannerSelectorProps {
  selectedScanner: string;
  onScannerChange: (scannerId: string) => void;
  scannerKeys: { [key: string]: string };
  onScannerKeyChange: (scannerId: string, key: string) => void;
  setBulkMode: (enabled: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function ScannerSelector({ 
  selectedScanner, 
  onScannerChange,
  scannerKeys,
  onScannerKeyChange,
  setBulkMode,
  fileInputRef
}: ScannerSelectorProps) {
  const [showMoreScanners, setShowMoreScanners] = useState(false);
  const [validatingKeys, setValidatingKeys] = useState<{ [key: string]: boolean }>({});
  const [enabledScanners, setEnabledScanners] = useState<{ [key: string]: boolean }>({
    tron: true,
    btc: false,
    eth: false,
    ltc: false
  });
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showDemoLimitModal, setShowDemoLimitModal] = useState(false);

  const displayedScanners = showMoreScanners ? [...INITIAL_SCANNERS, ...MORE_SCANNERS] : INITIAL_SCANNERS;

  const getCurrentScanner = () => {
    return [...INITIAL_SCANNERS, ...MORE_SCANNERS].find(s => s.id === selectedScanner);
  };

  const toggleMoreScanners = () => {
    setShowMoreScanners(!showMoreScanners);
  };

  const validateKey = async (scannerId: string, key: string) => {
    const keyPatterns = {
      btc: /^btc-scanner-key-\d{4}-\d{3}$/,
      eth: /^eth-scanner-key-\d{4}-\d{3}$/,
      ltc: /^ltc-scanner-key-\d{4}-\d{3}$/
    };

    if (!keyPatterns[scannerId as keyof typeof keyPatterns]?.test(key)) {
      toast.error(`Invalid ${scannerId.toUpperCase()} API key format`);
      return false;
    }

    return true;
  };

  const handleKeyChange = async (scannerId: string, value: string) => {
    onScannerKeyChange(scannerId, value);
    
    if (value.length > 20) {
      setValidatingKeys(prev => ({ ...prev, [scannerId]: true }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isValid = await validateKey(scannerId, value);
      
      setValidatingKeys(prev => ({ ...prev, [scannerId]: false }));
      
      if (isValid) {
        setEnabledScanners(prev => ({ ...prev, [scannerId]: true }));
        setBulkMode(false); // Force single mode for premium scanners
        toast.success(`${scannerId.toUpperCase()} Access Key Validated successfully`);
        onScannerChange(scannerId);
      } else {
        setEnabledScanners(prev => ({ ...prev, [scannerId]: false }));
      }
    }
  };

  const handleScannerSelect = (scannerId: string) => {
    const scanner = [...INITIAL_SCANNERS, ...MORE_SCANNERS].find(s => s.id === scannerId);
    
    if (!scanner) return;

    if (scanner.id === 'tron') {
      onScannerChange(scannerId);
      return;
    }

    if (!enabledScanners[scannerId]) {
      toast.error(`Please validate your ${scannerId.toUpperCase()} API key first`);
      return;
    }

    // Premium scanners (BTC, ETH, LTC) only support single address mode
    if (!scanner.supportsBulk) {
      setBulkMode(false);
    }

    onScannerChange(scannerId);
  };

  const handleBulkModeClick = () => {
    const currentScanner = getCurrentScanner();
    if (!currentScanner?.supportsBulk) {
      setShowDemoLimitModal(true);
      return;
    }
    setBulkMode(true);
  };

  const handleFileUploadClick = () => {
    const currentScanner = getCurrentScanner();
    if (!currentScanner?.supportsBulk) {
      setShowDemoLimitModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handlePrivateKeySubmit = () => {
    if (!privateKey) {
      toast.error('Please enter a private key');
      return;
    }
    if (privateKey.length < 64) {
      toast.error('Invalid private key format');
      return;
    }
    toast.success('Private key validated');
  };

  const renderPrivateKeyInput = (scanner: Scanner) => {
    if (scanner.id !== 'tron') return null;

    return (
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-cyber-accent" />
            <label className="text-xs text-cyber-secondary/70">Private Key Scanner</label>
          </div>
          <button
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="text-xs text-cyber-accent hover:text-cyber-primary transition-colors"
          >
            {showPrivateKey ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showPrivateKey ? "text" : "password"}
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Enter private key for automated scanning"
              className="cyber-input text-sm w-full"
            />
            {!showPrivateKey && privateKey && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Lock className="w-4 h-4 text-cyber-accent" />
              </div>
            )}
          </div>
          <button
            onClick={handlePrivateKeySubmit}
            className="cyber-button cyber-button-primary whitespace-nowrap"
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {displayedScanners.map((scanner) => {
          const Icon = scanner.icon;
          const isSelected = selectedScanner === scanner.id;
          const currentKey = scannerKeys[scanner.id] || '';
          const isValidating = validatingKeys[scanner.id];
          const isEnabled = scanner.id === 'tron' || enabledScanners[scanner.id];

          return (
            <div
              key={scanner.id}
              className={`cyber-card p-6 ${
                isSelected ? 'border-cyber-primary' : ''
              } ${
                isEnabled ? 'hover:border-cyber-primary' : 'opacity-75'
              } transition-all duration-300 cursor-pointer relative`}
              onClick={() => handleScannerSelect(scanner.id)}
            >
              {/* LITE tag */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-cyber-accent/10 border border-cyber-accent/30 rounded text-xs font-bold text-cyber-accent">
                LITE
              </div>

              {/* DEMO tag - only show after validation for BTC/ETH/LTC */}
              {enabledScanners[scanner.id] && scanner.requiresKey && (
                <div className="absolute top-2 right-16 px-2 py-1 bg-cyber-primary/10 border border-cyber-primary/30 rounded text-xs font-bold text-cyber-primary">
                  DEMO
                </div>
              )}

              <div className="w-full text-left">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-6 h-6 ${scanner.color} ${isSelected && isEnabled ? 'animate-pulse' : ''}`} />
                  <h3 className="text-lg font-bold">{scanner.name}</h3>
                </div>
                <p className="text-sm text-cyber-secondary/70 mb-4">{scanner.description}</p>
              </div>

              {scanner.requiresKey && (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  {isEnabled ? (
                    <div className="flex items-center gap-2 text-cyber-accent p-2 bg-cyber-accent/10 rounded-md overflow-hidden relative">
                      <Shield className="w-4 h-4 animate-bounce" />
                      <span className="text-sm">Access Key Validated</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-accent/20 to-transparent animate-shine" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-xs text-cyber-accent">
                        <Key className={`w-4 h-4 ${isValidating ? 'animate-spin' : 'animate-pulse'}`} />
                        <span>Access Key Required</span>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          value={currentKey}
                          onChange={(e) => handleKeyChange(scanner.id, e.target.value)}
                          placeholder={`Enter ${scanner.name} API key`}
                          className={`cyber-input text-sm ${
                            isValidating ? 'border-cyber-accent' : ''
                          }`}
                        />
                        {isValidating && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader className="w-4 h-4 animate-spin text-cyber-accent" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-cyber-secondary/50">
                        <p>Demo Key: {scanner.demoKey}</p>
                        {scanner.demoKey && (
                          <CopyToClipboard
                            text={scanner.demoKey}
                            onCopy={() => toast.success(`Demo key copied to clipboard`)}
                          >
                            <button className="p-1 hover:text-cyber-primary transition-colors">
                              <Key className="w-4 h-4" />
                            </button>
                          </CopyToClipboard>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {renderPrivateKeyInput(scanner)}
            </div>
          );
        })}
      </div>

      <button
        onClick={toggleMoreScanners}
        className="cyber-button w-full justify-center gap-2 hover:border-cyber-primary group"
      >
        {showMoreScanners ? (
          <>
            <ChevronRight className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            <span>Show Less Scanners</span>
          </>
        ) : (
          <>
            <ChevronRight className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            <span>Show More Scanners</span>
          </>
        )}
      </button>

      <DemoLimitModal
        isOpen={showDemoLimitModal}
        onClose={() => setShowDemoLimitModal(false)}
        onUpgrade={() => {
          setShowDemoLimitModal(false);
          // Handle upgrade action
        }}
      />
    </section>
  );
}
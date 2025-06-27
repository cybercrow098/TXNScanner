import React, { useState, useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import WalletScanner from './components/WalletScanner';
import WalletResults from './components/WalletResults';
import ScannerSelector from './components/ScannerSelector';
import PricingPage from './components/PricingPage';
import AccountPage from './components/AccountPage';
import FAQPage from './components/FAQPage';
import ToolsPage from './components/ToolsPage';
import FeaturesPage from './components/FeaturesPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import MobileMenu from './components/MobileMenu';
import DemoLimitModal from './components/DemoLimitModal';
import DonationWidget from './components/DonationWidget';
import toast from 'react-hot-toast';
import { isValidTronAddress } from './services/tronGrid';
import { scanSingleAddress, scanAddressesWithWorkers } from './services/scannerService';
import type { TronAccountInfo } from './services/tronGrid';

const DEMO_KEY = 'demo-key-2025';

function App() {
  // Navigation state
  const [showPricing, setShowPricing] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoLimitModal, setShowDemoLimitModal] = useState(false);
  const [trackHistory, setTrackHistory] = useState(false);
  const [showZeroBalances, setShowZeroBalances] = useState(true);

  // Scanner state
  const [selectedScanner, setSelectedScanner] = useState('tron');
  const [scannerKeys, setScannerKeys] = useState<{ [key: string]: string }>({});
  const [isBulkMode, setBulkMode] = useState(false);
  const [bulkAddresses, setBulkAddresses] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountInfo, setAccountInfo] = useState<TronAccountInfo | null>(null);
  const [bulkResults, setBulkResults] = useState<TronAccountInfo[]>([]);
  
  // Progress tracking
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Clear results when scanner changes
  useEffect(() => {
    setAccountInfo(null);
    setBulkResults([]);
    setError('');
    setAddress('');
    setBulkAddresses('');
  }, [selectedScanner]);

  useEffect(() => {
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  const handleScannerKeyChange = (scannerId: string, key: string) => {
    setScannerKeys(prev => ({ ...prev, [scannerId]: key }));
  };

  const validateAddress = (addr: string): boolean => {
    switch (selectedScanner) {
      case 'btc':
        return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[ac-hj-np-z02-9]{11,71}$/.test(addr);
      case 'eth':
        return /^0x[a-fA-F0-9]{40}$/.test(addr);
      case 'ltc':
        return /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(addr);
      case 'tron':
        return isValidTronAddress(addr);
      default:
        return false;
    }
  };

  const handleBulkCheck = async () => {
    if (['btc', 'eth', 'ltc'].includes(selectedScanner)) {
      setShowDemoLimitModal(true);
      return;
    }

    if (!bulkAddresses.trim()) {
      setError('Please enter at least one address');
      return;
    }

    setLoading(true);
    setError('');
    setBulkResults([]);

    const addresses = bulkAddresses
      .split('\n')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);

    const validAddresses = addresses.filter(addr => validateAddress(addr));
    
    if (validAddresses.length === 0) {
      setError(`No valid ${selectedScanner.toUpperCase()} addresses found`);
      toast.error(`No valid ${selectedScanner.toUpperCase()} addresses found`);
      setLoading(false);
      return;
    }

    if (validAddresses.length !== addresses.length) {
      toast.error(`${addresses.length - validAddresses.length} invalid addresses were skipped`);
    }

    try {
      const results: TronAccountInfo[] = [];
      
      await scanAddressesWithWorkers(
        validAddresses,
        selectedScanner,
        (current, total) => setProgress({ current, total }),
        (result) => {
          results.push(result);
          setBulkResults(prev => [...prev, result]);
        }
      );

      if (results.length > 0) {
        toast.success(`Successfully processed ${results.length} addresses`);
      } else {
        toast.error('No valid addresses found with balance');
      }
    } catch (error) {
      console.error('Bulk check error:', error);
      setError('Failed to process addresses');
      toast.error('Failed to process addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSingleCheck = async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    if (!validateAddress(address)) {
      setError(`Invalid ${selectedScanner.toUpperCase()} address format`);
      toast.error(`Invalid ${selectedScanner.toUpperCase()} address format`);
      return;
    }

    setLoading(true);
    setError('');
    setAccountInfo(null);

    try {
      const result = await scanSingleAddress(address, selectedScanner);
      setAccountInfo(result);
      toast.success('Account information retrieved successfully');
    } catch (error) {
      console.error('Single check error:', error);
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError('Failed to fetch account information');
        toast.error('Failed to fetch account information');
      }
    } finally {
      setLoading(false);
    }
  };

  const startAutoRefresh = () => {
    setAutoRefresh(true);
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
    }
    
    autoRefreshIntervalRef.current = setInterval(() => {
      if (!loading) {
        if (isBulkMode && bulkAddresses) {
          handleBulkCheck();
        } else if (!isBulkMode && address) {
          handleSingleCheck();
        }
      }
    }, 30000);

    toast.success('Auto-refresh enabled - updating every 30 seconds');
  };

  const stopAutoRefresh = () => {
    setAutoRefresh(false);
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = null;
    }
    toast.success('Auto-refresh disabled');
  };

  const exportResults = () => {
    const data = isBulkMode ? bulkResults : (accountInfo ? [accountInfo] : []);
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedScanner}-scan-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Results exported successfully');
  };

  const clearResults = () => {
    setAccountInfo(null);
    setBulkResults([]);
    toast.success('Results cleared');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (['btc', 'eth', 'ltc'].includes(selectedScanner)) {
      setShowDemoLimitModal(true);
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const addresses = content
        .split(/[\n,]/)
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0);
      
      if (!isBulkMode) {
        setBulkMode(true);
        toast.success('Switched to bulk mode');
      }
      
      setBulkAddresses(addresses.join('\n'));
      toast.success(`Loaded ${addresses.length} addresses`);
    };
    reader.readAsText(file);
  };

  const handleBulkModeToggle = () => {
    if (['btc', 'eth', 'ltc'].includes(selectedScanner)) {
      setShowDemoLimitModal(true);
      return;
    }
    setBulkMode(!isBulkMode);
  };

  const resetViews = () => {
    setShowPricing(false);
    setShowAccount(false);
    setShowFAQ(false);
    setShowTools(false);
    setShowFeatures(false);
    setShowPrivacy(false);
    setShowTerms(false);
  };

  if (showFeatures) {
    return (
      <div className="min-h-screen bg-cyber-black flex flex-col">
        <Header
          autoRefresh={autoRefresh}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex-grow">
          <FeaturesPage />
        </div>
        <Footer 
          setShowTools={setShowTools}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowPrivacy={setShowPrivacy}
          setShowTerms={setShowTerms}
          setShowFeatures={setShowFeatures}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  if (showPrivacy) {
    return (
      <div className="min-h-screen bg-cyber-black flex flex-col">
        <Header
          autoRefresh={autoRefresh}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex-grow">
          <PrivacyPolicy />
        </div>
        <Footer 
          setShowTools={setShowTools}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowPrivacy={setShowPrivacy}
          setShowTerms={setShowTerms}
          setShowFeatures={setShowFeatures}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  if (showTerms) {
    return (
      <div className="min-h-screen bg-cyber-black flex flex-col">
        <Header
          autoRefresh={autoRefresh}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex-grow">
          <TermsOfService />
        </div>
        <Footer 
          setShowTools={setShowTools}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowPrivacy={setShowPrivacy}
          setShowTerms={setShowTerms}
          setShowFeatures={setShowFeatures}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  if (showPricing) {
    return (
      <div className="min-h-screen bg-cyber-black flex flex-col">
        <Header
          autoRefresh={autoRefresh}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex-grow">
          <PricingPage />
        </div>
        <Footer 
          setShowTools={setShowTools}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowPrivacy={setShowPrivacy}
          setShowTerms={setShowTerms}
          setShowFeatures={setShowFeatures}
        />
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          selectedScanner={selectedScanner}
          isBulkMode={isBulkMode}
          setBulkMode={setBulkMode}
          fileInputRef={fileInputRef}
          showPricing={showPricing}
          showAccount={showAccount}
          showFAQ={showFAQ}
          showTools={showTools}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  if (showAccount) {
    return (
      <div className="min-h-screen bg-cyber-black flex flex-col">
        <Header
          autoRefresh={autoRefresh}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex-grow">
          <AccountPage setShowPricing={setShowPricing} />
        </div>
        <Footer 
          setShowTools={setShowTools}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowPrivacy={setShowPrivacy}
          setShowTerms={setShowTerms}
          setShowFeatures={setShowFeatures}
        />
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          selectedScanner={selectedScanner}
          isBulkMode={isBulkMode}
          setBulkMode={setBulkMode}
          fileInputRef={fileInputRef}
          showPricing={showPricing}
          showAccount={showAccount}
          showFAQ={showFAQ}
          showTools={showTools}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  if (showFAQ) {
    return (
      <div className="min-h-screen bg-cyber-black flex flex-col">
        <Header
          autoRefresh={autoRefresh}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex-grow">
          <FAQPage />
        </div>
        <Footer 
          setShowTools={setShowTools}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowPrivacy={setShowPrivacy}
          setShowTerms={setShowTerms}
          setShowFeatures={setShowFeatures}
        />
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          selectedScanner={selectedScanner}
          isBulkMode={isBulkMode}
          setBulkMode={setBulkMode}
          fileInputRef={fileInputRef}
          showPricing={showPricing}
          showAccount={showAccount}
          showFAQ={showFAQ}
          showTools={showTools}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  if (showTools) {
    return (
      <div className="min-h-screen bg-cyber-black flex flex-col">
        <Header
          autoRefresh={autoRefresh}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex-grow">
          <ToolsPage />
        </div>
        <Footer 
          setShowTools={setShowTools}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowPrivacy={setShowPrivacy}
          setShowTerms={setShowTerms}
          setShowFeatures={setShowFeatures}
        />
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setShowPricing={setShowPricing}
          setShowAccount={setShowAccount}
          setShowFAQ={setShowFAQ}
          setShowTools={setShowTools}
          selectedScanner={selectedScanner}
          isBulkMode={isBulkMode}
          setBulkMode={setBulkMode}
          fileInputRef={fileInputRef}
          showPricing={showPricing}
          showAccount={showAccount}
          showFAQ={showFAQ}
          showTools={showTools}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black flex flex-col">
      <Header
        autoRefresh={autoRefresh}
        setShowPricing={setShowPricing}
        setShowAccount={setShowAccount}
        setShowFAQ={setShowFAQ}
        setShowTools={setShowTools}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <ScannerSelector
          selectedScanner={selectedScanner}
          onScannerChange={setSelectedScanner}
          scannerKeys={scannerKeys}
          onScannerKeyChange={handleScannerKeyChange}
          setBulkMode={setBulkMode}
          isBulkMode={isBulkMode}
        />
        <WalletScanner
          selectedScanner={selectedScanner}
          isBulkMode={isBulkMode}
          setBulkMode={handleBulkModeToggle}
          bulkAddresses={bulkAddresses}
          setBulkAddresses={setBulkAddresses}
          address={address}
          setAddress={setAddress}
          loading={loading}
          handleBulkCheck={handleBulkCheck}
          handleSingleCheck={handleSingleCheck}
          autoRefresh={autoRefresh}
          startAutoRefresh={startAutoRefresh}
          stopAutoRefresh={stopAutoRefresh}
          exportResults={exportResults}
          clearResults={clearResults}
          error={error}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
          progress={progress}
          setShowPricing={setShowPricing}
          trackHistory={trackHistory}
          setTrackHistory={setTrackHistory}
          showZeroBalances={showZeroBalances}
          setShowZeroBalances={setShowZeroBalances}
        />
        <WalletResults
          selectedScanner={selectedScanner}
          isBulkMode={isBulkMode}
          accountInfo={accountInfo}
          bulkResults={showZeroBalances ? bulkResults : bulkResults.filter(result => result.balance > 0)}
        />
        <DonationWidget />
      </main>
      <Footer 
        setShowTools={setShowTools}
        setShowPricing={setShowPricing}
        setShowAccount={setShowAccount}
        setShowFAQ={setShowFAQ}
        setShowPrivacy={setShowPrivacy}
        setShowTerms={setShowTerms}
        setShowFeatures={setShowFeatures}
      />
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setShowPricing={setShowPricing}
        setShowAccount={setShowAccount}
        setShowFAQ={setShowFAQ}
        setShowTools={setShowTools}
        selectedScanner={selectedScanner}
        isBulkMode={isBulkMode}
        setBulkMode={setBulkMode}
        fileInputRef={fileInputRef}
        showPricing={showPricing}
        showAccount={showAccount}
        showFAQ={showFAQ}
        showTools={showTools}
      />
      <DemoLimitModal
        isOpen={showDemoLimitModal}
        onClose={() => setShowDemoLimitModal(false)}
        onUpgrade={() => {
          setShowDemoLimitModal(false);
          setShowPricing(true);
        }}
      />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
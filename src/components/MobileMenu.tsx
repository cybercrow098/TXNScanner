import React, { useState } from 'react';
import { X, CreditCard, Home, User, Search, List, Upload, Brain, HelpCircle, Globe, Wallet, MessageSquare } from 'lucide-react';
import { FaTelegram } from 'react-icons/fa';
import KeyReconstruction from './KeyReconstruction';
import DrainerSection from './DrainerSection';

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setShowPricing: (show: boolean) => void;
  setShowAccount: (show: boolean) => void;
  setShowFAQ: (show: boolean) => void;
  setShowTools: (show: boolean) => void;
  selectedScanner: string;
  isBulkMode: boolean;
  setBulkMode: (enabled: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  showPricing: boolean;
  showAccount: boolean;
  showFAQ: boolean;
  showTools: boolean;
}

export default function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  setShowPricing,
  setShowAccount,
  setShowFAQ,
  setShowTools,
  selectedScanner,
  isBulkMode,
  setBulkMode,
  fileInputRef,
  showPricing,
  showAccount,
  showFAQ,
  showTools
}: MobileMenuProps) {
  const [showRecovery, setShowRecovery] = useState(false);
  const [showDrainer, setShowDrainer] = useState(false);

  if (!mobileMenuOpen && !showRecovery && !showDrainer) return null;

  const handleTelegramClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://t.me/cybercrowleaks?start=premium_interest', '_blank');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  if (showRecovery) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-cyber-black/80 backdrop-blur-md">
        <div className="w-full max-w-2xl">
          <KeyReconstruction onClose={() => setShowRecovery(false)} />
        </div>
      </div>
    );
  }

  if (showDrainer) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-cyber-black/80 backdrop-blur-md">
        <div className="w-full max-w-4xl">
          <DrainerSection onClose={() => setShowDrainer(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-cyber-black/95 backdrop-blur-md"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Menu Content */}
      <div className="relative h-full w-[85vw] max-w-md ml-auto bg-cyber-darker border-l border-cyber-secondary/20">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-cyber-secondary/20">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:text-cyber-primary transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-4">
            {/* Always show Home button if not on home page */}
            {(showPricing || showAccount || showFAQ || showTools) && (
              <button
                onClick={() => handleNavigation(() => {
                  setShowPricing(false);
                  setShowAccount(false);
                  setShowFAQ(false);
                  setShowTools(false);
                })}
                className="cyber-button w-full justify-start gap-4 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Back to Scanner</span>
              </button>
            )}

            {/* Drainer Button */}
            <button
              onClick={() => {
                setShowDrainer(true);
                setMobileMenuOpen(false);
              }}
              className="cyber-button cyber-button-primary w-full justify-start gap-4 group"
            >
              <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Drainer</span>
            </button>

            {/* Tools Button */}
            <button
              onClick={() => handleNavigation(() => {
                setShowTools(true);
                setShowPricing(false);
                setShowAccount(false);
                setShowFAQ(false);
              })}
              className={`cyber-button w-full justify-start gap-4 group ${
                showTools ? 'border-cyber-primary text-cyber-primary' : ''
              }`}
            >
              <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Tools</span>
            </button>

            {/* Recovery Service Button */}
            <button
              onClick={() => {
                setShowRecovery(true);
                setMobileMenuOpen(false);
              }}
              className="cyber-button cyber-button-primary w-full justify-start gap-4 group"
            >
              <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Recovery Service</span>
            </button>

            <button
              onClick={() => handleNavigation(() => {
                setShowAccount(true);
                setShowPricing(false);
                setShowFAQ(false);
                setShowTools(false);
              })}
              className={`cyber-button w-full justify-start gap-4 group ${
                showAccount ? 'border-cyber-primary text-cyber-primary' : ''
              }`}
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Account</span>
            </button>

            <button
              onClick={() => handleNavigation(() => {
                setShowPricing(true);
                setShowAccount(false);
                setShowFAQ(false);
                setShowTools(false);
              })}
              className={`cyber-button w-full justify-start gap-4 group ${
                showPricing ? 'border-cyber-primary text-cyber-primary' : ''
              }`}
            >
              <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Pricing</span>
            </button>

            <button
              onClick={() => handleNavigation(() => {
                setShowFAQ(true);
                setShowPricing(false);
                setShowAccount(false);
                setShowTools(false);
              })}
              className={`cyber-button w-full justify-start gap-4 group ${
                showFAQ ? 'border-cyber-primary text-cyber-primary' : ''
              }`}
            >
              <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>FAQ</span>
            </button>

            {/* Scanner-specific controls */}
            {!showPricing && !showAccount && !showFAQ && !showTools && selectedScanner === 'tron' && (
              <>
                <div className="h-px bg-cyber-secondary/20 my-6" />
                
                <button
                  onClick={() => {
                    setBulkMode(!isBulkMode);
                    setMobileMenuOpen(false);
                  }}
                  className="cyber-button w-full justify-start gap-4 group"
                >
                  {isBulkMode ? (
                    <>
                      <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Single Mode</span>
                    </>
                  ) : (
                    <>
                      <List className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Bulk Mode</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setMobileMenuOpen(false);
                  }}
                  className="cyber-button cyber-button-primary w-full justify-start gap-4 group"
                >
                  <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Upload File</span>
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-cyber-secondary/20">
            <button
              onClick={handleTelegramClick}
              className="cyber-button cyber-button-primary w-full justify-center gap-3 group"
            >
              <FaTelegram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Join Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
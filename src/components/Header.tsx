import React, { useState } from 'react';
import { Shield, RefreshCw, CreditCard, Menu, User, Brain, HelpCircle, Globe, Network, Lock, MessageSquare, Wallet } from 'lucide-react';
import KeyReconstruction from './KeyReconstruction';
import DrainerSection from './DrainerSection';

interface HeaderProps {
  autoRefresh: boolean;
  setShowPricing: (show: boolean) => void;
  setShowAccount: (show: boolean) => void;
  setShowFAQ: (show: boolean) => void;
  setShowTools: (show: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({ 
  autoRefresh, 
  setShowPricing,
  setShowAccount,
  setShowFAQ,
  setShowTools,
  setMobileMenuOpen 
}: HeaderProps) {
  const [showRecovery, setShowRecovery] = useState(false);
  const [showDrainer, setShowDrainer] = useState(false);

  const handleSimplexClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion', '_blank');
  };

  const handleHomeClick = () => {
    setShowPricing(false);
    setShowAccount(false);
    setShowFAQ(false);
    setShowTools(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-cyber-black/80 border-b border-cyber-secondary/20">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-3 hover:text-cyber-primary transition-colors group"
            >
              <div className="relative w-10 h-10">
                {/* Hexagonal Background */}
                <div className="absolute inset-0 bg-cyber-darker transform rotate-45 group-hover:scale-105 transition-transform duration-300" />
                
                {/* Network Lines */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyber-primary/20 to-cyber-accent/20 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Network className="w-6 h-6 text-cyber-accent transform -rotate-45 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>

                {/* Broken Lock Symbol */}
                <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <Lock className="w-4 h-4 text-cyber-primary transform -rotate-45 group-hover:rotate-0 transition-all duration-500" />
                </div>

                {/* Glitch Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/0 via-cyber-accent/20 to-cyber-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shine" />
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-wider font-['Orbitron']">
                  TXN<span className="text-cyber-primary">SCANNER</span>
                </h1>
                <span className="text-xs text-cyber-secondary/50 tracking-[0.2em] uppercase">Verify at Scale</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6 text-sm border-r border-cyber-secondary/20 pr-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyber-darker/50 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span>MAINNET</span>
                </div>
                {autoRefresh && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyber-primary/10 rounded-full animate-pulse">
                    <RefreshCw className="w-4 h-4 text-cyber-primary" />
                    <span className="text-cyber-primary">AUTO-REFRESH</span>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowDrainer(true)}
                  className="cyber-button cyber-button-primary group"
                >
                  <Wallet className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Drainer</span>
                </button>

                <button
                  onClick={() => {
                    setShowTools(true);
                    setShowPricing(false);
                    setShowAccount(false);
                    setShowFAQ(false);
                  }}
                  className="cyber-button group"
                >
                  <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Tools</span>
                </button>

                <button
                  onClick={() => setShowRecovery(true)}
                  className="cyber-button cyber-button-primary group"
                >
                  <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Recovery</span>
                </button>

                <button
                  onClick={() => {
                    setShowAccount(true);
                    setShowPricing(false);
                    setShowFAQ(false);
                    setShowTools(false);
                  }}
                  className="cyber-button group"
                >
                  <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Account</span>
                </button>

                <button
                  onClick={() => {
                    setShowPricing(true);
                    setShowAccount(false);
                    setShowFAQ(false);
                    setShowTools(false);
                  }}
                  className="cyber-button group"
                >
                  <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Pricing</span>
                </button>

                <button
                  onClick={() => {
                    setShowFAQ(true);
                    setShowPricing(false);
                    setShowAccount(false);
                    setShowTools(false);
                  }}
                  className="cyber-button group"
                >
                  <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>FAQ</span>
                </button>

                <button
                  onClick={handleSimplexClick}
                  className="cyber-button cyber-button-primary group relative overflow-hidden"
                >
                  <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="ml-2">SIMPLEX</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/0 via-cyber-primary/20 to-cyber-primary/0 group-hover:animate-shine" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:text-cyber-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Recovery Modal */}
      {showRecovery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-cyber-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl">
            <KeyReconstruction onClose={() => setShowRecovery(false)} />
          </div>
        </div>
      )}

      {/* Drainer Modal */}
      {showDrainer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-cyber-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl">
            <DrainerSection onClose={() => setShowDrainer(false)} />
          </div>
        </div>
      )}
    </>
  );
}
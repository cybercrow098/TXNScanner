import React, { useEffect } from 'react';
import { Shield, AlertTriangle, Brain, Lock, ChevronRight, Network, X, MessageSquare } from 'lucide-react';

interface DrainerSectionProps {
  onClose: () => void;
}

const SUPPORTED_CHAINS: string[] = [
  'Ethereum',
  'solana',
  'Binance Smart Chain',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Avalanche',
  'Fantom',
  'Base Chain',
  'Celo Network',
  'Harmony',
  'Cronos',
  'Klaytn',
  'Canto',
  'Gnosis Chain',
  'Aurora',
  'Moonbeam',
  'Moonriver',
  'Linea'
];

const SUPPORTED_WALLETS: string[] = [
  'MetaMask',
  'Trust Wallet',
  'Coinbase Wallet',
  'Binance Wallet',
  'WalletConnect',
  'Ledger Live',
  'Trezor',
  'SafePal',
  'BitKeep',
  'Argent',
  'Rainbow',
  'Zerion',
  'ImToken',
  'Exodus',
  'Crypto.com DeFi Wallet',
  '1inch Wallet',
  'Pillar'
];

const FEATURES: string[] = [
  '10+ networks (ETH, BSC, Polygon, Arbitrum, Optimism, etc.)',
  'Auto-drain (coins, tokens, NFTs, staking positions)',
  'MetaMask, Trust Wallet & WalletConnect BYPASS',
  'Permit, Permit2, Uniswap Multicall, Pancake, Sushiswap, QuickSwap, Curve',
  'NFT drain via SeaPort 1.5, Blur, X2Y2, OpenSea (exploits included)',
  'Priority control (drains most valuable assets first)',
  'Real-time TG & Discord alerts for every action',
  'Cross-chain bridging support',
  'DeFi protocol integration (Aave, Compound, Yearn)',
  'Customizable drain strategies'
];

const SECURITY_FEATURES: string[] = [
  'Clean, backdoor-free code – full source!',
  'Undetectable – bypasses browsers, antivirus & EDR solutions',
  'Encrypted communication channels',
  'Telegram Notifications'
];

const DrainerSection: React.FC<DrainerSectionProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleContactSupport = () => {
    window.open(
      'https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion',
      '_blank'
    );
  };

  return (
    <div className="cyber-card border-cyber-primary relative overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-cyber-secondary/30 scrollbar-track-cyber-black/30">
      <button
        onClick={onClose}
        className="sticky top-4 right-4 float-right p-2 hover:text-cyber-primary transition-colors z-50 bg-cyber-darker rounded-full shadow-md"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-cyber-primary/10 rounded-lg">
            <Shield className="w-8 h-8 text-cyber-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Multichain Crypto Wallet Drainer</h2>
            <p className="text-cyber-secondary/70">
              Advanced multi-chain drainer with auto-detection and DeFi integration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 bg-cyber-black/50 rounded-lg border border-cyber-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-cyber-primary" />
                <h3 className="font-bold">Supported Networks</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {SUPPORTED_CHAINS.map((chain, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-cyber-primary" />
                    <span>{chain}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-cyber-black/50 rounded-lg border border-cyber-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-cyber-primary" />
                <h3 className="font-bold">Key Features</h3>
              </div>
              <div className="space-y-2 text-sm">
                {FEATURES.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-cyber-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-cyber-black/50 rounded-lg border border-cyber-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-cyber-primary" />
                <h3 className="font-bold">Security & Setup</h3>
              </div>
              <div className="space-y-2 text-sm">
                {SECURITY_FEATURES.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-cyber-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-cyber-black/50 rounded-lg border border-cyber-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-cyber-primary" />
                <h3 className="font-bold">Contact Support</h3>
              </div>
              <p className="text-sm text-cyber-secondary/70 mb-4">
                For setup instructions, pricing, and technical support, contact us on SimpleX:
              </p>
              <button
                onClick={handleContactSupport}
                className="cyber-button cyber-button-primary w-full group"
              >
                <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Contact on SimpleX</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrainerSection;
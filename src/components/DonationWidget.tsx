import React, { useState } from 'react';
import { Heart, Copy, ExternalLink } from 'lucide-react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiLitecoin } from 'react-icons/si';
import { BiCoin } from 'react-icons/bi';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';

interface CryptoAddress {
  name: string;
  address: string;
  icon: React.ComponentType;
  color: string;
  explorer: string;
}

const ADDRESSES: CryptoAddress[] = [
  {
    name: 'Bitcoin',
    address: 'bc1q9vyg4ceq9vcvju0205mwulapwmsmv8xejrjtxh',
    icon: FaBitcoin,
    color: 'text-yellow-500',
    explorer: 'https://blockchair.com/bitcoin/address'
  },
  {
    name: 'Ethereum',
    address: '0xE1da0012f2A9b6340F3124898cBd8FA9DF78B35b',
    icon: FaEthereum,
    color: 'text-blue-500',
    explorer: 'https://etherscan.io/address'
  },
  {
    name: 'Litecoin',
    address: 'ltc1qznv9ywfz8nm26xlu998d6mp7sajqlwvld04nqm',
    icon: SiLitecoin,
    color: 'text-gray-400',
    explorer: 'https://blockchair.com/litecoin/address'
  },
  {
    name: 'TRON',
    address: 'TGBjnffDWbUVNT8ir5osHJjkRerumzCPR2',
    icon: BiCoin,
    color: 'text-red-500',
    explorer: 'https://tronscan.org/#/address'
  }
];

export default function DonationWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAddress | null>(null);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 cyber-button p-3 rounded-full hover:shadow-neon transition-shadow duration-300"
        title="Support the project"
      >
        <Heart className="w-6 h-6 text-red-500" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-cyber-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-sm">
            <div className="cyber-card border-cyber-accent overflow-hidden">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:text-cyber-accent transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="text-center mb-6">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold">Support the Project</h3>
                <p className="text-sm text-cyber-secondary/70">
                  Choose your preferred cryptocurrency
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {ADDRESSES.map((crypto) => {
                  const Icon = crypto.icon;
                  const isSelected = selectedCrypto?.name === crypto.name;

                  return (
                    <button
                      key={crypto.name}
                      onClick={() => setSelectedCrypto(crypto)}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        isSelected
                          ? 'bg-cyber-accent/10 border-cyber-accent'
                          : 'border-cyber-secondary/30 hover:border-cyber-accent'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${crypto.color} mx-auto mb-2`} />
                      <span className="block text-sm">{crypto.name}</span>
                    </button>
                  );
                })}
              </div>

              {selectedCrypto && (
                <div className="mt-4 p-4 bg-cyber-black/50 rounded-lg border border-cyber-accent/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-cyber-secondary/70">Address</span>
                    <div className="flex items-center gap-2">
                      <CopyToClipboard
                        text={selectedCrypto.address}
                        onCopy={() => toast.success('Address copied')}
                      >
                        <button className="p-1 hover:text-cyber-accent transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </CopyToClipboard>
                      <a
                        href={`${selectedCrypto.explorer}/${selectedCrypto.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:text-cyber-accent transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <code className="block w-full text-xs font-mono break-all bg-cyber-darker p-3 rounded">
                    {selectedCrypto.address}
                  </code>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-cyber-secondary/50">
                  Thank you for supporting our work! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
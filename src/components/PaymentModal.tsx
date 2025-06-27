import React, { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, Mail, MessageSquare } from 'lucide-react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiLitecoin, SiDogecoin } from 'react-icons/si';
import { BiCoin } from 'react-icons/bi';
import { TbCurrencyMonero, TbCurrencySolana } from 'react-icons/tb';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
  };
}

interface CryptoOption {
  id: string;
  name: string;
  icon: React.ComponentType;
  address: string;
  coingeckoId?: string;
  chains?: {
    id: string;
    name: string;
    address: string;
  }[];
}

const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    icon: FaBitcoin,
    address: 'bc1q9vyg4ceq9vcvju0205mwulapwmsmv8xejrjtxh',
    coingeckoId: 'bitcoin'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    icon: FaEthereum,
    address: '0xE1da0012f2A9b6340F3124898cBd8FA9DF78B35b',
    coingeckoId: 'ethereum'
  },
  {
    id: 'ltc',
    name: 'Litecoin',
    icon: SiLitecoin,
    address: 'ltc1qznv9ywfz8nm26xlu998d6mp7sajqlwvld04nqm',
    coingeckoId: 'litecoin'
  },
  {
    id: 'xmr',
    name: 'Monero',
    icon: TbCurrencyMonero,
    address: '42XfEcrVSmXb5Kq3Ry5Je2jeSGeoVkHyvTiFJsE8xpJaNkwbfX7RPpaeihe4Uj3t3r8CzaTpACyQqfLvhNPz9bsx1EKQe7J',
    coingeckoId: 'monero'
  },
  {
    id: 'doge',
    name: 'Dogecoin',
    icon: SiDogecoin,
    address: 'D6HbJnSGjudN64Fq57RNjamSLT3i8TpDBo',
    coingeckoId: 'dogecoin'
  },
  {
    id: 'trx',
    name: 'TRON',
    icon: BiCoin,
    address: 'TGBjnffDWbUVNT8ir5osHJjkRerumzCPR2',
    coingeckoId: 'tron'
  },
  {
    id: 'sol',
    name: 'Solana',
    icon: TbCurrencySolana,
    address: '7sXa85h8Q4AHAhwE7RMwVyXSVFo2K8ezMaNdVcWvHAF',
    coingeckoId: 'solana'
  },
  {
    id: 'usdt',
    name: 'USDT',
    icon: FaEthereum,
    chains: [
      {
        id: 'erc20',
        name: 'ERC20',
        address: '0xE1da0012f2A9b6340F3124898cBd8FA9DF78B35b'
      },
      {
        id: 'bep20',
        name: 'BEP20',
        address: '0xE1da0012f2A9b6340F3124898cBd8FA9DF78B35b'
      },
      {
        id: 'trc20',
        name: 'TRC20',
        address: 'TGBjnffDWbUVNT8ir5osHJjkRerumzCPR2'
      }
    ]
  }
];

export default function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [xmppId, setXmppId] = useState('');
  const [showContactForm, setShowContactForm] = useState(true);
  const [cryptoAmount, setCryptoAmount] = useState<string>('');

  useEffect(() => {
    const fetchPrice = async () => {
      if (!selectedCrypto || !plan.price) return;

      // For USDT, just show the USD amount directly
      if (selectedCrypto.id === 'usdt') {
        const usdAmount = parseFloat(plan.price.replace('$', ''));
        setCryptoAmount(usdAmount.toFixed(2));
        return;
      }

      // Skip price fetch if no coingeckoId
      if (!selectedCrypto.coingeckoId) return;

      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto.coingeckoId}&vs_currencies=usd`
        );

        const price = response.data[selectedCrypto.coingeckoId].usd;
        const usdAmount = parseFloat(plan.price.replace('$', ''));
        const amount = (usdAmount / price).toFixed(8);
        setCryptoAmount(amount);
      } catch (error) {
        console.error('Error fetching price:', error);
        toast.error('Failed to fetch current price');
      }
    };

    fetchPrice();
  }, [selectedCrypto, plan.price]);

  if (!isOpen) return null;

  const handleCryptoSelect = (crypto: CryptoOption) => {
    setSelectedCrypto(crypto);
    setSelectedChain(null);
  };

  const getPaymentAddress = () => {
    if (!selectedCrypto) return '';
    if (selectedCrypto.chains && !selectedChain) return '';
    if (selectedCrypto.chains) {
      return selectedCrypto.chains.find(chain => chain.id === selectedChain)?.address || '';
    }
    return selectedCrypto.address;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !xmppId) {
      toast.error('Please provide either email or XMPP ID');
      return;
    }
    setShowContactForm(false);
  };

  if (showContactForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-black/80 backdrop-blur-md">
        <div className="w-full max-w-lg cyber-card border-cyber-primary">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-cyber-primary mb-1">
                Contact Information
              </h2>
              <p className="text-sm text-cyber-secondary/70">
                Your API keys will be sent to your provided contact method
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:text-cyber-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyber-accent">
                  <Mail className="w-5 h-5" />
                  <h3 className="font-bold">Email Address</h3>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="cyber-input w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyber-accent">
                  <MessageSquare className="w-5 h-5" />
                  <h3 className="font-bold">XMPP ID</h3>
                </div>
                <input
                  type="text"
                  id="xmpp"
                  value={xmppId}
                  onChange={(e) => setXmppId(e.target.value)}
                  placeholder="username@xmpp.org"
                  className="cyber-input w-full"
                />
              </div>
            </div>

            <div className="p-4 bg-cyber-black/50 border border-cyber-secondary/30 rounded-lg">
              <p className="text-sm text-cyber-secondary/70">
                • Provide at least one contact method to receive your API keys<br />
                • Keys will be delivered immediately after payment confirmation<br />
                • Make sure to check spam/junk folders
              </p>
            </div>

            <button type="submit" className="cyber-button cyber-button-primary w-full">
              <Mail className="w-4 h-4" />
              <span>Continue to Payment</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg cyber-card border-cyber-primary">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-cyber-primary">
            Payment for {plan.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:text-cyber-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 bg-cyber-black/50 border border-cyber-accent/30 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-cyber-accent" />
            <h3 className="font-bold text-cyber-accent">Delivery Information</h3>
          </div>
          <div className="space-y-2">
            {email && (
              <p className="text-sm">
                <span className="text-cyber-secondary/70">Email:</span>{' '}
                <span className="font-mono">{email}</span>
              </p>
            )}
            {xmppId && (
              <p className="text-sm">
                <span className="text-cyber-secondary/70">XMPP:</span>{' '}
                <span className="font-mono">{xmppId}</span>
              </p>
            )}
          </div>
        </div>

        {!selectedCrypto ? (
          <div className="space-y-4">
            <p className="text-sm text-cyber-secondary/70 mb-4">
              Select your preferred payment method:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CRYPTO_OPTIONS.map((crypto) => {
                const Icon = crypto.icon;
                return (
                  <button
                    key={crypto.id}
                    onClick={() => handleCryptoSelect(crypto)}
                    className="cyber-button justify-center gap-2 hover:border-cyber-primary"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{crypto.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : selectedCrypto.chains && !selectedChain ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setSelectedCrypto(null)}
                className="text-sm text-cyber-secondary hover:text-cyber-primary"
              >
                ← Back
              </button>
              <h3 className="text-lg font-bold">Select {selectedCrypto.name} Chain</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedCrypto.chains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChain(chain.id)}
                  className="cyber-button justify-center hover:border-cyber-primary"
                >
                  {chain.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => {
                  setSelectedCrypto(null);
                  setSelectedChain(null);
                }}
                className="text-sm text-cyber-secondary hover:text-cyber-primary"
              >
                ← Back
              </button>
              <h3 className="text-lg font-bold">Payment Details</h3>
            </div>

            <div className="p-4 bg-cyber-black/50 border border-cyber-secondary/30 rounded-lg">
              <p className="text-sm text-cyber-secondary/70 mb-2">Total Amount</p>
              <p className="text-2xl font-bold text-cyber-primary mb-2">
                {plan.price} USD
              </p>
              {cryptoAmount && (
                <p className="text-lg text-cyber-accent">
                  ≈ {cryptoAmount} {selectedCrypto.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-cyber-secondary/70">Payment Address</p>
              <div className="flex items-center gap-2 p-3 bg-cyber-black/50 border border-cyber-secondary/30 rounded-lg">
                <p className="font-mono text-sm flex-1 break-all">
                  {getPaymentAddress()}
                </p>
                <CopyToClipboard
                  text={getPaymentAddress()}
                  onCopy={() => toast.success('Address copied to clipboard')}
                >
                  <button className="p-2 hover:text-cyber-primary transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </CopyToClipboard>
              </div>
            </div>

            <div className="p-4 bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg">
              <p className="text-sm text-cyber-primary mb-2">Important</p>
              <ul className="text-sm space-y-2">
                <li>• Send exactly {cryptoAmount} {selectedCrypto.name}</li>
                <li>• Transaction may take 10-30 minutes to confirm</li>
                <li>• Your keys will be sent to your provided contact</li>
                <li>• Contact support if you need assistance</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <a
                href="https://t.me/cybercrowleaks"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-button cyber-button-primary"
              >
                <span>Need Help?</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
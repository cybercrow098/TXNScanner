import React, { useState } from 'react';
import { Key, Shield, Brain, Lock, AlertTriangle, ChevronRight, Loader, CreditCard, Hash, Globe, Network, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

interface AccountPageProps {
  setShowPricing: (show: boolean) => void;
}

interface ServiceTier {
  name: string;
  hashRate: string;
  apiLimit: string;
  addressesPerDay: string;
  features: string[];
  scanners: string[];
  support: string;
  color: string;
}

// Calculate daily limits based on rate:
// Basic: No API access
// Premium: 100 addresses/minute = 144,000 addresses/day
// Enterprise: Unlimited

const SERVICE_TIERS: { [key: string]: ServiceTier } = {
  'basic-2025-001': {
    name: 'Baic',
    hashRate: '3000 addresses/minute',
    apiLimit: 'No API Access',
    addressesPerDay: '4,320,000 addresses/day',
    features: [
      'Basic balance checking',
      'Single address scanning',
      'TRON network support',
      'Web interface only',
      'Community support',
      'Rate limited to 100/min',
      'No API access',
      'Basic export features',
      'Public node access'
    ],
    scanners: ['TRON'],
    support: 'Simplex',
    color: 'cyber-secondary'
  },
  'premium-2025-001': {
    name: 'Demo',
    hashRate: '10,000 addresses/minute',
    apiLimit: '14,400,000 API calls/day',
    addressesPerDay: '1,440,000 addresses/day',
    features: [
      'Advanced balance checking',
      'Bulk address scanning',
      'Multi-chain support',
      'Full API access',
      'Real-time notifications',
      'Custom webhooks',
      'Transaction history',
      'Address monitoring',
      'Advanced export options',
      'Detailed API documentation',
      'Rate limit: 1,000/min',
      'Dedicated nodes',
      'Priority queue access'
    ],
    scanners: ['TRON', 'BTC', 'ETH', 'LTC'],
    support: 'Priority Email + Chat',
    color: 'cyber-accent'
  },
  'enterprise-2025-001': {
    name: 'Enterprise',
    hashRate: 'Unlimited',
    apiLimit: 'Unlimited',
    addressesPerDay: 'Unlimited',
    features: [
      'Unlimited scanning',
      'Unlimited API access',
      'Custom rate limits',
      'Private dedicated nodes',
      'Custom RPC endpoints',
      'Advanced analytics',
      'Team management',
      'White-label option',
      'SLA guarantee',
      'Security audit logs',
      'IP whitelisting',
      'Custom integrations',
      'Multi-region support',
      'Load balancing',
      'Failover protection'
    ],
    scanners: ['All Networks'],
    support: '24/7 Dedicated Support',
    color: 'cyber-primary'
  }
};

const SUPPORT_CONTACTS = {
  simplex: 'https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion'
};

export default function AccountPage({ setShowPricing }: AccountPageProps) {
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(true);
  const [keyError, setKeyError] = useState('');
  const [currentTier, setCurrentTier] = useState<ServiceTier | null>(null);

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError('');
    
    if (!accessKey) {
      toast.error('Please enter your access key');
      return;
    }

    const key = accessKey.toLowerCase();
    if (!SERVICE_TIERS[key]) {
      setKeyError('Invalid access key. Please check your key and try again.');
      toast.error('Invalid access key');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentTier(SERVICE_TIERS[key]);
      setShowKeyInput(false);
      toast.success(`${SERVICE_TIERS[key].name} access granted`);
    } catch (error) {
      toast.error('Error validating key');
    } finally {
      setLoading(false);
    }
  };

  const handleSimplexClick = () => {
    window.open(SUPPORT_CONTACTS.simplex, '_blank');
  };

  if (showKeyInput) {
    return (
      <div className="min-h-screen bg-cyber-black py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="cyber-card border-cyber-accent">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-cyber-accent/10 rounded-lg mb-4">
                  <Shield className="w-8 h-8 text-cyber-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Access Required</h2>
                <p className="text-cyber-secondary/70">
                  Enter your access key to view the dashboard
                </p>
              </div>

              <form onSubmit={handleKeySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Access Key</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      placeholder="Enter your access key"
                      className="cyber-input w-full pr-10"
                    />
                    <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-secondary/50" />
                  </div>
                  {keyError && (
                    <p className="mt-2 text-sm text-cyber-primary">{keyError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cyber-button cyber-button-primary w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Validate Key</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-cyber-accent hover:text-cyber-primary transition-colors w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    <span>Demo Keys?</span>
                  </div>
                </button>

                {showHelp && (
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                      <h4 className="font-bold mb-2">Demo Keys</h4>
                      <ul className="space-y-2 text-sm text-cyber-secondary/70">
                        <li>• Premium: premium-2025-001</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                      <h4 className="font-bold mb-2">Contact Support</h4>
                      <div className="flex items-center justify-between text-cyber-accent">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>SimpleX:</span>
                        </div>
                        <button
                          onClick={handleSimplexClick}
                          className="hover:text-cyber-primary transition-colors"
                        >
                          Open Chat
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-cyber-secondary/70">
                  Don't have an access key?{' '}
                  <button
                    onClick={() => setShowPricing(true)}
                    className="text-cyber-primary hover:underline"
                  >
                    Purchase Now
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black py-12">
      <div className="container mx-auto px-4">
        {/* Account Overview */}
        <div className="cyber-card border-cyber-accent mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 bg-${currentTier?.color}/10 rounded-lg`}>
              <Shield className={`w-6 h-6 text-${currentTier?.color}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Account Overview</h2>
              <p className={`text-${currentTier?.color}`}>{currentTier?.name} Access</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Key className={`w-4 h-4 text-${currentTier?.color}`} />
                <span className="text-sm text-cyber-secondary/70">Hash Rate</span>
              </div>
              <p className="text-xl font-bold">{currentTier?.hashRate}</p>
            </div>

            <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Network className={`w-4 h-4 text-${currentTier?.color}`} />
                <span className="text-sm text-cyber-secondary/70">API Limit</span>
              </div>
              <p className="text-xl font-bold">{currentTier?.apiLimit}</p>
            </div>

            <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Hash className={`w-4 h-4 text-${currentTier?.color}`} />
                <span className="text-sm text-cyber-secondary/70">Daily Limit</span>
              </div>
              <p className="text-xl font-bold">{currentTier?.addressesPerDay}</p>
            </div>

            <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className={`w-4 h-4 text-${currentTier?.color}`} />
                <span className="text-sm text-cyber-secondary/70">Support</span>
              </div>
              <p className="text-xl font-bold">{currentTier?.support}</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="cyber-card mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className={`w-6 h-6 text-${currentTier?.color}`} />
            <h3 className="text-xl font-bold">Available Features</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTier?.features.map((feature, index) => (
              <div key={index} className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                <div className="flex items-center gap-2">
                  <ChevronRight className={`w-4 h-4 text-${currentTier?.color}`} />
                  <span>{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="cyber-card">
          <div className="flex items-center gap-3 mb-6">
            <Hash className={`w-6 h-6 text-${currentTier?.color}`} />
            <h3 className="text-xl font-bold">Usage Statistics</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTier?.scanners.map((scanner, index) => (
              <div key={index} className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold">{scanner}</span>
                  <span className={`text-${currentTier?.color}`}>{currentTier?.name}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cyber-secondary/70">Usage</span>
                      <span>0%</span>
                    </div>
                    <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
                      <div className={`h-full w-0 bg-${currentTier?.color}`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Scanned</p>
                      <p className="text-lg font-bold">0</p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Success</p>
                      <p className="text-lg font-bold text-cyber-accent">100%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
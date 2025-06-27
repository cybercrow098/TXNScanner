import React, { useState, useEffect } from 'react';
import { Check, X, ExternalLink, MessageSquare } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: {
    included: string[];
    excluded: string[];
  };
  buttonText: string;
  recommended?: boolean;
  cryptoPrice?: {
    btc: string;
    eth: string;
    usdt: string;
  };
}

interface CryptoPrices {
  btc: number;
  eth: number;
  usdt: number;
}

// Mock function to fetch live crypto prices (replace with real API like CoinGecko)
const fetchCryptoPrices = async (): Promise<CryptoPrices> => {
  // Simulating API call (in real app, use fetch to CoinGecko or similar)
  return {
    btc: 52000, // USD per BTC
    eth: 3800,  // USD per ETH
    usdt: 1,    // USD per USDT
  };
};

const pricingTiers: PricingTier[] = [
  {
    name: "Chain Scout",
    price: "$149",
    description: "Start chasing crypto",
    features: {
      included: [
        "TRX",
        "3000 Addresses/Minute",
        "Bulk Balance Checker",
        "Standard Support",
 
      ],
      excluded: [
        "Altcoin Support",
        "Auto Transfer funds with priv key/Mnemonic",
        "Priority Support",
        "Multi-GPU Cracking"
      ]
    },
    buttonText: "Start Chasing",
  },
  {
    name: "Chain Hunter",
    price: "$349",
    description: "Hunt down wallets with power",
    features: {
      included: [
        "TRX,BTC,ETH",
        "10000 Addresses/Minute",
        "Auto Address generator + Checker",
        "Auto Transfer funds with priv key/Mnemonic",
        "Advanced Bulk Balance Checker",
        "Priority Support",
        "Multi-GPU Cracking",
        "Basic Altcoin Support"
      ],
      excluded: [
        "Full Altcoin Support",
        "Custom Algorithms",
        "Dedicated Support"
      ]
    },
    buttonText: "Hunt Now",
    recommended: true,
  },
  {
    name: "Chain Master",
    price: "$599",
    description: "Master the art of crypto recovery",
    features: {
      included: [
        "TRX,BTC,ETH,LTC",
        "30000 Addresses/Minute",
        "Auto Address generator + Checker",
        "Auto Transfer funds with priv key/Mnemonic",
        "Pro Balance Checker",
        "Dedicated Support",
        "Optimized Multi-GPU Cracking",
        "Advanced Algorithms"
      ],
      excluded: [
        "Custom Algorithms",
        "Private Consulting"
      ]
    },
    buttonText: "Go Master",
  },
  {
    name: "Chain Forge",
    price: "Hit Me Up",
    description: "Custom solutions for big chases",
    features: {
      included: [
        "Custom Hash Rates",
        "Flexible Recovery Duration",
        "All Wallet & Altcoin Support",
        "Private Balance Checker",
        "Custom Algorithms",
        "Direct Consulting",
        "Full Optimization",
        "Priority Support"
      ],
      excluded: []
    },
    buttonText: "Contact Me"
  }
];

const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingTier | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices | null>(null);
  const [updatedTiers, setUpdatedTiers] = useState<PricingTier[]>(pricingTiers);

  // Fetch live crypto prices on mount
  useEffect(() => {
    const getPrices = async () => {
      try {
        const prices = await fetchCryptoPrices();
        setCryptoPrices(prices);

        // Update tiers with live crypto prices
        const newTiers = pricingTiers.map((tier) => {
          if (tier.price === "Hit Me Up" || !prices) return tier;

          const usdPrice = parseFloat(tier.price.replace('$', ''));
          return {
            ...tier,
            cryptoPrice: {
              btc: (usdPrice / prices.btc).toFixed(6),
              eth: (usdPrice / prices.eth).toFixed(6),
              usdt: (usdPrice / prices.usdt).toFixed(2),
            },
          };
        });
        setUpdatedTiers(newTiers);
      } catch (error) {
        console.error("Failed to fetch crypto prices:", error);
      }
    };
    getPrices();
  }, []);

  const handlePlanSelect = (plan: PricingTier) => {
    if (plan.name === "Chain Forge") {
      window.open(
        "https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion",
        "_blank"
      );
    } else {
      setSelectedPlan(plan);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black py-6 sm:py-12">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyber-primary mb-4 title-glitch">🔗 ChainChaser Plans</h2>
          <p className="text-cyber-secondary/70 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Chase down your crypto with plans built for recovery, brute-forcing, and balance checking.
          </p>
        </div>

        {/* Contact Banner */}
        <div className="mb-8 sm:mb-12 p-4 sm:p-6 bg-cyber-darker border border-cyber-primary rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-primary" />
            <h3 className="text-lg sm:text-xl font-bold text-cyber-primary">Need a Custom Plan?</h3>
          </div>
          <p className="text-cyber-secondary mb-4 text-sm sm:text-base">
            Contact us on SimpleX Chat for tailored solutions
          </p>
          <a
            href="https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 cyber-button cyber-button-primary"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Contact Us</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {updatedTiers.map((tier) => (
            <div
              key={tier.name}
              className={`cyber-card relative ${
                tier.recommended
                  ? 'border-cyber-primary shadow-neon-pink'
                  : 'hover:border-cyber-secondary hover:shadow-neon'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-cyber-primary text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold">
                  BEST PICK
                </div>
              )}
              
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-cyber-primary">
                    {tier.price} USD
                  </span>
                  {tier.price !== "Hit Me Up" && tier.cryptoPrice && (
                    <span className="text-cyber-secondary/70 text-sm sm:text-base block">
                      | {tier.cryptoPrice.btc} BTC
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-cyber-secondary/70">{tier.description}</p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {tier.features.included.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 sm:gap-3 text-cyber-secondary text-sm sm:text-base">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {tier.features.excluded.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 sm:gap-3 text-cyber-secondary/50 text-sm sm:text-base">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-primary/50 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanSelect(tier)}
                className={`cyber-button w-full justify-center ${
                  tier.recommended ? 'cyber-button-primary' : ''
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-8 text-cyber-accent">Why Chase With ChainChaser?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="cyber-card">
              <h4 className="text-lg font-bold mb-2">Blazing Speed</h4>
              <p className="text-sm text-cyber-secondary/70">
                High-powered rigs for rapid cracking
              </p>
            </div>
            <div className="cyber-card">
              <h4 className="text-lg font-bold mb-2">Solid Tools</h4>
              <p className="text-sm text-cyber-secondary/70">
                Proven setup for wallet recovery
              </p>
            </div>
            <div className="cyber-card">
              <h4 className="text-lg font-bold mb-2">Fast Support</h4>
              <p className="text-sm text-cyber-secondary/70">
                Quick help to keep you chasing
              </p>
            </div>
            <div className="cyber-card">
              <h4 className="text-lg font-bold mb-2">Crypto Focus</h4>
              <p className="text-sm text-cyber-secondary/70">
                Built for recovery and balance checks
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default PricingPage;
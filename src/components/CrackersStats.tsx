import React from 'react';
import { Trophy, Star, ArrowUp, ArrowDown, CreditCard, Lock } from 'lucide-react';

interface CrackerStats {
  username: string;
  stats: {
    btc: number;
    eth: number;
    ltc: number;
    trx: number;
    total: number;
  };
  rank: number;
  change: 'up' | 'down' | 'same';
  plan: 'Pro' | 'Enterprise';
}

// Updated top crackers data with plans
const TOP_CRACKERS: CrackerStats[] = [
  {
    username: 'User731',
    stats: {
      btc: 142,
      eth: 187,
      ltc: 221,
      trx: 542,
      get total() {
        return this.btc + this.eth + this.ltc + this.trx;
      }
    },
    rank: 1,
    change: 'same',
    plan: 'Enterprise'
  },
  {
    username: 'User445',
    stats: {
      btc: 127,
      eth: 156,
      ltc: 192,
      trx: 453,
      get total() {
        return this.btc + this.eth + this.ltc + this.trx;
      }
    },
    rank: 2,
    change: 'up',
    plan: 'Enterprise'
  },
  {
    username: 'User156',
    stats: {
      btc: 93,
      eth: 123,
      ltc: 145,
      trx: 376,
      get total() {
        return this.btc + this.eth + this.ltc + this.trx;
      }
    },
    rank: 3,
    change: 'down',
    plan: 'Enterprise'
  },
  {
    username: 'User789',
    stats: {
      btc: 64,
      eth: 83,
      ltc: 97,
      trx: 343,
      get total() {
        return this.btc + this.eth + this.ltc + this.trx;
      }
    },
    rank: 4,
    change: 'down',
    plan: 'Enterprise'
  },
  {
    username: 'User321',
    stats: {
      btc: 36,
      eth: 53,
      ltc: 62,
      trx: 310,
      get total() {
        return this.btc + this.eth + this.ltc + this.trx;
      }
    },
    rank: 5,
    change: 'up',
    plan: 'Enterprise'
  },
  {
    username: 'User892',
    stats: {
      btc: 115,
      eth: 134,
      ltc: 156,
      trx: 434,
      get total() {
        // Pro users only count BTC and ETH
        return this.btc + this.eth;
      }
    },
    rank: 6,
    change: 'up',
    plan: 'Pro'
  },
  {
    username: 'User567',
    stats: {
      btc: 84,
      eth: 107,
      ltc: 126,
      trx: 365,
      get total() {
        // Pro users only count BTC and ETH
        return this.btc + this.eth;
      }
    },
    rank: 7,
    change: 'same',
    plan: 'Pro'
  },
  {
    username: 'User234',
    stats: {
      btc: 75,
      eth: 95,
      ltc: 114,
      trx: 354,
      get total() {
        // Pro users only count BTC and ETH
        return this.btc + this.eth;
      }
    },
    rank: 8,
    change: 'up',
    plan: 'Pro'
  },
  {
    username: 'User432',
    stats: {
      btc: 53,
      eth: 72,
      ltc: 85,
      trx: 332,
      get total() {
        // Pro users only count BTC and ETH
        return this.btc + this.eth;
      }
    },
    rank: 9,
    change: 'same',
    plan: 'Pro'
  },
  {
    username: 'User654',
    stats: {
      btc: 47,
      eth: 64,
      ltc: 73,
      trx: 321,
      get total() {
        // Pro users only count BTC and ETH
        return this.btc + this.eth;
      }
    },
    rank: 10,
    change: 'down',
    plan: 'Pro'
  }
].sort((a, b) => {
  // First sort by plan (Enterprise before Pro)
  if (a.plan !== b.plan) {
    return a.plan === 'Enterprise' ? -1 : 1;
  }
  // Then sort by total wallets within each plan
  return b.stats.total - a.stats.total;
}).map((cracker, index) => ({
  ...cracker,
  rank: index + 1
}));

export default function CrackersStats() {
  return (
    <div className="min-h-screen bg-cyber-black py-6 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-cyber-primary" />
            <h2 className="text-3xl font-bold text-cyber-primary title-glitch">TOP CRACKERS</h2>
          </div>
          <p className="text-cyber-secondary/70">
            Real-time rankings of the most successful wallet crackers
          </p>
        </div>

        <div className="cyber-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-secondary/20">
                <th className="px-4 py-3 text-left text-sm font-bold text-cyber-secondary/70">RANK</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-cyber-secondary/70">USERNAME</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-cyber-secondary/70">BTC</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-cyber-secondary/70">ETH</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-cyber-secondary/70">LTC</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-cyber-secondary/70">TRX</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-cyber-secondary/70">TOTAL</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-cyber-secondary/70">TREND</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-cyber-secondary/70">PLAN</th>
              </tr>
            </thead>
            <tbody>
              {TOP_CRACKERS.map((cracker) => (
                <tr
                  key={cracker.username}
                  className="border-b border-cyber-secondary/10 hover:bg-cyber-darker/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    {cracker.rank <= 3 ? (
                      <div className="flex items-center gap-2">
                        <Star className={`w-5 h-5 ${
                          cracker.rank === 1 ? 'text-yellow-500' :
                          cracker.rank === 2 ? 'text-gray-400' :
                          'text-amber-700'
                        }`} />
                        <span className="font-bold">{cracker.rank}</span>
                      </div>
                    ) : (
                      <span className="text-cyber-secondary/70">{cracker.rank}</span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-bold text-cyber-accent">{cracker.username}</td>
                  <td className="px-4 py-4 text-right font-mono">{cracker.stats.btc.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-mono">{cracker.stats.eth.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-mono">
                    {cracker.plan === 'Enterprise' ? (
                      cracker.stats.ltc.toLocaleString()
                    ) : (
                      <div className="flex items-center justify-end gap-2 text-cyber-secondary/50">
                        <Lock className="w-4 h-4" />
                        <span>PRO</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right font-mono">
                    {cracker.plan === 'Enterprise' ? (
                      cracker.stats.trx.toLocaleString()
                    ) : (
                      <div className="flex items-center justify-end gap-2 text-cyber-secondary/50">
                        <Lock className="w-4 h-4" />
                        <span>PRO</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-cyber-primary font-bold">
                    {cracker.stats.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      {cracker.change === 'up' && (
                        <ArrowUp className="w-5 h-5 text-cyber-accent" />
                      )}
                      {cracker.change === 'down' && (
                        <ArrowDown className="w-5 h-5 text-cyber-primary" />
                      )}
                      {cracker.change === 'same' && (
                        <div className="w-5 h-0.5 bg-cyber-secondary/50 my-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className={`flex items-center justify-center gap-2 ${
                      cracker.plan === 'Enterprise' ? 'text-cyber-primary' : 'text-cyber-accent'
                    }`}>
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm font-bold">{cracker.plan}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-cyber-secondary/70 text-sm">
            Rankings are updated every hour based on successful wallet cracks
          </p>
        </div>
      </div>
    </div>
  );
}
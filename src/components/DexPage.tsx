import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchTopGainers } from '../services/dexScreener';
import LoadingSpinner from './LoadingSpinner';

export default function DexPage() {
  const [loading, setLoading] = useState(true);
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [error, setError] = useState('');

  const loadTopGainers = async () => {
    try {
      setLoading(true);
      const data = await fetchTopGainers();
      setTopGainers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch DEX data');
      console.error('Error loading top gainers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopGainers();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading DEX data..." />;
  }

  return (
    <div className="min-h-screen bg-cyber-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">DEX Analytics</h2>
            <p className="text-cyber-secondary/70">
              Advanced decentralized exchange analytics and insights
            </p>
          </div>
          <button onClick={loadTopGainers} className="cyber-button">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trading Volume Card */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <BarChart className="w-6 h-6 text-cyber-accent" />
              <h3 className="text-lg font-bold">Trading Volume</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-accent/30">
                <p className="text-sm text-cyber-secondary/70 mb-2">24h Volume</p>
                <p className="text-3xl font-bold text-cyber-accent">
                  ${topGainers.reduce((sum, token) => sum + token.volume24h, 0).toLocaleString()}M
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-cyber-secondary/70 mb-1">Total Pairs</p>
                  <p className="text-xl font-bold text-cyber-accent">{topGainers.length}</p>
                </div>
                <div>
                  <p className="text-sm text-cyber-secondary/70 mb-1">Avg. Market Cap</p>
                  <p className="text-xl font-bold text-cyber-primary">
                    ${(topGainers.reduce((sum, token) => sum + token.marketCap, 0) / topGainers.length).toFixed(2)}M
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Market Trends Card */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-cyber-primary" />
              <h3 className="text-lg font-bold">Top Gainers</h3>
            </div>
            <div className="space-y-4">
              {topGainers.slice(0, 5).map((token, index) => (
                <div key={index} className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-primary/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{token.assetName}</p>
                      <p className="text-xs text-cyber-secondary/70">{token.network}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyber-accent">+{token.priceChange.h24}%</p>
                      <p className="text-xs text-cyber-secondary/70">${token.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Alerts Card */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-cyber-yellow" />
              <h3 className="text-lg font-bold">High Volume Alerts</h3>
            </div>
            <div className="space-y-4">
              {topGainers
                .filter(token => token.volume24h > 1000000)
                .slice(0, 5)
                .map((token, index) => (
                  <div key={index} className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-yellow/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">{token.assetName}</p>
                        <p className="text-xs text-cyber-secondary/70">{token.dex}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyber-yellow">${token.volume24h}M</p>
                        <p className="text-xs text-cyber-secondary/70">{token.txns24h} txns</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Token List */}
        <div className="mt-8 cyber-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-secondary/20">
                <th className="px-4 py-3 text-left">Token</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">24h Change</th>
                <th className="px-4 py-3 text-right">Volume</th>
                <th className="px-4 py-3 text-right">Market Cap</th>
                <th className="px-4 py-3 text-right">Liquidity</th>
              </tr>
            </thead>
            <tbody>
              {topGainers.map((token, index) => (
                <tr key={index} className="border-b border-cyber-secondary/10 hover:bg-cyber-darker/50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-bold">{token.assetName}</p>
                      <p className="text-xs text-cyber-secondary/70">{token.network} • {token.dex}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">${token.price}</td>
                  <td className="px-4 py-4 text-right text-cyber-accent">+{token.priceChange.h24}%</td>
                  <td className="px-4 py-4 text-right">${token.volume24h}M</td>
                  <td className="px-4 py-4 text-right">${token.marketCap}M</td>
                  <td className="px-4 py-4 text-right">${token.liquidity}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && (
          <div className="mt-8 p-6 bg-cyber-darker rounded-lg border border-cyber-primary text-center">
            <p className="text-cyber-primary">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
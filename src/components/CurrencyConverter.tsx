import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_KEY = 'b224f9f4b0024e51bcb9f7999e9e0a9f';
const API_URL = 'https://exchange-rates.abstractapi.com/v1/live/';

// Common currency pairs
const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD',
  'SEK', 'KRW', 'SGD', 'NOK', 'MXN', 'INR', 'RUB', 'ZAR', 'TRY', 'BRL',
  'TWD', 'DKK', 'PLN', 'THB', 'IDR', 'HUF', 'CZK', 'ILS', 'CLP', 'PHP',
  'AED', 'COP', 'SAR', 'MYR', 'RON'
].sort();

interface ExchangeRate {
  base: string;
  target: string;
  rate: number;
  lastUpdated: string;
}

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
let lastRequestTime = 0;

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [loading, setLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<ExchangeRate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number, currency: string) => {
    if (!value || isNaN(value)) return `0.00 ${currency}`;
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      }).format(value);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${value.toFixed(2)} ${currency}`;
    }
  };

  const enforceRateLimit = async () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => 
        setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }
    
    lastRequestTime = Date.now();
  };

  const getExchangeRate = async () => {
    if (!fromCurrency || !toCurrency) {
      setError('Please select currencies');
      toast.error('Please select currencies');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await enforceRateLimit();

      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          base: fromCurrency,
          target: toCurrency
        }
      });

      // Check if the response has the expected structure
      if (response.data && response.data.last_updated && response.data.exchange_rates) {
        const exchangeRate = response.data.exchange_rates[toCurrency];
        
        if (typeof exchangeRate === 'number') {
          setRate({
            base: fromCurrency,
            target: toCurrency,
            rate: exchangeRate,
            lastUpdated: response.data.last_updated
          });
          toast.success('Exchange rate updated');
        } else {
          throw new Error('Invalid exchange rate value');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          setError('Rate limit exceeded. Please try again in a few seconds.');
          toast.error('Rate limit exceeded. Please wait...');
        } else {
          setError('Failed to fetch exchange rate. Please try again.');
          toast.error('Failed to fetch exchange rate');
        }
      } else {
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
      
      setRate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExchangeRate();
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getConvertedAmount = (): number => {
    if (!rate?.rate || !amount) return 0;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    return numAmount * rate.rate;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Converter Section */}
        <div className="space-y-4">
          <div className="cyber-card">
            <div className="flex items-center gap-2 mb-6">
              <Wallet className="w-5 h-5 text-cyber-accent" />
              <h3 className="text-lg font-bold">Currency Converter</h3>
            </div>

            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="cyber-input w-full"
                  placeholder="Enter amount"
                />
              </div>

              {/* Currency Selection */}
              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="cyber-input w-full"
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={swapCurrencies}
                  className="mt-6 p-2 hover:text-cyber-accent transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="cyber-input w-full"
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={getExchangeRate}
                disabled={loading}
                className="cyber-button cyber-button-primary w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Rate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {error ? (
            <div className="cyber-card border-cyber-primary">
              <div className="p-6 bg-cyber-primary/10 rounded-lg">
                <p className="text-cyber-primary">{error}</p>
              </div>
            </div>
          ) : rate ? (
            <div className="cyber-card">
              <div className="space-y-6">
                {/* Conversion Result */}
                <div className="p-6 bg-cyber-black/50 rounded-lg border border-cyber-accent/30">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-cyber-secondary/70">You send</span>
                      <span className="text-lg font-bold break-all">
                        {formatCurrency(parseFloat(amount) || 0, fromCurrency)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-cyber-secondary/70">You get</span>
                      <span className="text-2xl font-bold text-cyber-accent break-all">
                        {formatCurrency(getConvertedAmount(), toCurrency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Exchange Rate Info */}
                <div className="p-6 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-cyber-secondary/70">Exchange Rate</span>
                      <span className="font-bold break-all">
                        1 {fromCurrency} = {rate.rate.toFixed(6)} {toCurrency}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-cyber-secondary/70">Last Updated</span>
                      <span className="text-sm break-all">
                        {new Date(rate.lastUpdated).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="text-center text-sm text-cyber-secondary/50">
                  Exchange rates provided by Abstract API
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
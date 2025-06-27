import axios from 'axios';
import { getTrxPrice, formatUsdBalance } from './priceService';

// API keys and endpoints
const API_KEY = '4f2816a3-4a3e-48c7-8d1b-0c90ad035dee';
const BASE_URLS = {
  btc: 'https://btcbook.nownodes.io/api/v2',
  eth: 'https://eth.nownodes.io',
  ltc: 'https://ltcbook.nownodes.io/api/v2'
};

const headers = {
  'api-key': API_KEY,
  'Content-Type': 'application/json'
};

export interface CryptoBalance {
  balance: number;
  balanceUsd: string;
  address: string;
}

// Address validation functions
export const isValidBtcAddress = (address: string): boolean => {
  // Legacy addresses (1), P2SH addresses (3), and Native SegWit addresses (bc1)
  const legacyRegex = /^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const p2shRegex = /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const segwitRegex = /^(bc1)[a-zA-HJ-NP-Z0-9]{11,71}$/;
  
  return legacyRegex.test(address) || p2shRegex.test(address) || segwitRegex.test(address);
};

export const isValidEthAddress = (address: string): boolean => {
  // Basic Ethereum address validation (0x followed by 40 hex chars)
  return /^0x[a-fA-F0-9]{40}$/i.test(address);
};

export const isValidLtcAddress = (address: string): boolean => {
  // Legacy addresses (L), P2SH addresses (M), and Native SegWit addresses (ltc1)
  const legacyRegex = /^[LM][a-km-zA-HJ-NP-Z1-9]{26,33}$/;
  const segwitRegex = /^(ltc1)[a-zA-HJ-NP-Z0-9]{26,33}$/;
  
  return legacyRegex.test(address) || segwitRegex.test(address);
};

// Balance checking functions
export const getBtcBalance = async (address: string): Promise<CryptoBalance> => {
  try {
    const response = await axios.get(`${BASE_URLS.btc}/address/${address}`, { headers });
    const balanceBtc = Number(response.data.balance) / 100_000_000;
    const btcPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const balanceUsd = formatUsdBalance(balanceBtc, btcPrice.data.bitcoin.usd);

    return {
      balance: balanceBtc,
      balanceUsd,
      address
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key or unauthorized access');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      } else if (error.response?.status === 404) {
        throw new Error('Address not found');
      } else if (error.response?.status >= 500) {
        throw new Error('Service temporarily unavailable');
      }
    }
    console.error('[BTC] Error:', error);
    throw new Error('Failed to fetch BTC balance');
  }
};

export const getEthBalance = async (address: string): Promise<CryptoBalance> => {
  try {
    const payload = {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1
    };

    const response = await axios.post(BASE_URLS.eth, payload, { headers });
    const balanceWei = parseInt(response.data.result, 16);
    const balanceEth = balanceWei / 1e18;
    
    const ethPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const balanceUsd = formatUsdBalance(balanceEth, ethPrice.data.ethereum.usd);

    return {
      balance: balanceEth,
      balanceUsd,
      address
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key or unauthorized access');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      } else if (error.response?.status === 404) {
        throw new Error('Address not found');
      } else if (error.response?.status >= 500) {
        throw new Error('Service temporarily unavailable');
      }
    }
    console.error('[ETH] Error:', error);
    throw new Error('Failed to fetch ETH balance');
  }
};

export const getLtcBalance = async (address: string): Promise<CryptoBalance> => {
  try {
    const response = await axios.get(`${BASE_URLS.ltc}/address/${address}`, { headers });
    const balanceLtc = Number(response.data.balance) / 100_000_000;
    const ltcPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
    const balanceUsd = formatUsdBalance(balanceLtc, ltcPrice.data.litecoin.usd);

    return {
      balance: balanceLtc,
      balanceUsd,
      address
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key or unauthorized access');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      } else if (error.response?.status === 404) {
        throw new Error('Address not found');
      } else if (error.response?.status >= 500) {
        throw new Error('Service temporarily unavailable');
      }
    }
    console.error('[LTC] Error:', error);
    throw new Error('Failed to fetch LTC balance');
  }
};

export const validateAddress = (address: string, type: string): boolean => {
  switch (type.toLowerCase()) {
    case 'btc':
      return isValidBtcAddress(address);
    case 'eth':
      return isValidEthAddress(address);
    case 'ltc':
      return isValidLtcAddress(address);
    default:
      return false;
  }
};
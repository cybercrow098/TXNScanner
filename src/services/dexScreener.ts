import axios from 'axios';
import * as cheerio from 'cheerio';
import { toast } from 'react-hot-toast';

export interface TopGainer {
  assetName: string;
  assetNameText: string;
  assetUrl: string;
  gainRank: number;
  network: string;
  dex: string;
  price: number;
  age: string;
  txns24h: number;
  volume24h: number;
  numMakers: number;
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: number;
  marketCap: number;
}

const DEXSCREENER_URL = 'https://dexscreener.com/gainers/solana';

const parseNumericValue = (value: string | null): number => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return isNaN(parseFloat(cleaned)) ? 0 : parseFloat(cleaned);
};

const parsePercentage = (value: string | null): number => {
  if (!value) return 0;
  const cleaned = value.replace('%', '');
  return parseNumericValue(cleaned);
};

export const fetchTopGainers = async (): Promise<TopGainer[]> => {
  try {
    // Use a proxy service to avoid CORS issues
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const response = await axios.get(`${proxyUrl}${encodeURIComponent(DEXSCREENER_URL)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results: TopGainer[] = [];

    $('.ds-dex-table-top a').each((index, element) => {
      try {
        const $el = $(element);
        
        const assetName = $el.find('.ds-dex-table-row-base-token-symbol').text().trim();
        const assetNameText = $el.find('.ds-dex-table-row-base-token-name span').first().text().trim();
        const assetUrl = 'https://dexscreener.com' + $el.attr('href');
        const network = $el.find('.ds-dex-table-row-chain-icon').attr('title') || 'Unknown';
        const dex = $el.find('.ds-dex-table-row-dex-icon').attr('title') || 'Unknown DEX';
        
        const priceText = $el.find('.ds-dex-table-row-col-price').text().trim();
        const price = parseNumericValue(priceText);
        
        const age = $el.find('.ds-dex-table-row-col-pair-age span').text().trim();
        const txns24h = parseNumericValue($el.find('.ds-dex-table-row-col-txns').text());
        const volume24h = parseNumericValue($el.find('.ds-dex-table-row-col-volume').text()) / 1000000;
        const numMakers = parseNumericValue($el.find('.ds-dex-table-row-col-makers').text());
        
        const priceChange = {
          m5: parsePercentage($el.find('.ds-dex-table-row-col-price-change-m5 span').text()),
          h1: parsePercentage($el.find('.ds-dex-table-row-col-price-change-h1 span').text()),
          h6: parsePercentage($el.find('.ds-dex-table-row-col-price-change-h6 span').text()),
          h24: parsePercentage($el.find('.ds-dex-table-row-col-price-change-h24 span').text())
        };
        
        const liquidity = parseNumericValue($el.find('.ds-dex-table-row-col-liquidity').text()) / 1000000;
        const marketCap = parseNumericValue($el.find('.ds-dex-table-row-col-market-cap').text()) / 1000000;

        results.push({
          assetName,
          assetNameText,
          assetUrl,
          gainRank: index + 1,
          network,
          dex,
          price,
          age,
          txns24h,
          volume24h,
          numMakers,
          priceChange,
          liquidity,
          marketCap
        });
      } catch (err) {
        console.warn('Error parsing row:', err);
      }
    });

    if (results.length === 0) {
      throw new Error('No data found on DexScreener');
    }

    return results;
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    toast.error('Failed to fetch DEX data');
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch DEX data');
  }
};
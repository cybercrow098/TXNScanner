import axios from 'axios';

const coingeckoInstance = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3'
});

interface PriceData {
    tron: {
        usd: number;
    };
}

let cachedPrice: number | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

export const getTrxPrice = async (): Promise<number> => {
    const now = Date.now();
    
    // Return cached price if valid
    if (cachedPrice && (now - lastFetchTime) < CACHE_DURATION) {
        return cachedPrice;
    }

    try {
        const response = await coingeckoInstance.get<PriceData>('/simple/price', {
            params: {
                ids: 'tron',
                vs_currencies: 'usd'
            }
        });

        cachedPrice = response.data.tron.usd;
        lastFetchTime = now;
        return cachedPrice;
    } catch (error) {
        console.error('Error fetching TRX price:', error);
        return cachedPrice || 0;
    }
};

export const formatUsdBalance = (balance: number, price: number): string => {
    const usdBalance = balance * price;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(usdBalance);
};
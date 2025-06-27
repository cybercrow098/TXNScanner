import axios from 'axios';
import { getTrxPrice, formatUsdBalance } from './priceService';

// Maximize connection pool for optimal throughput
const MAX_CONNECTIONS = 50;
const connectionPool = Array.from({ length: MAX_CONNECTIONS }, () => 
  axios.create({
    baseURL: 'https://api.trongrid.io',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
);

let currentConnection = 0;
const getConnection = () => {
  const connection = connectionPool[currentConnection];
  currentConnection = (currentConnection + 1) % MAX_CONNECTIONS;
  return connection;
};

// API keys for load balancing
const API_KEYS = [
    '16bbe47f-cc84-4f7e-9387-ae7269ac14b9',
    'eddc7d2e-bf3b-4f45-a689-8be73b07e101',
    'aec0a206-5722-435a-9a65-1ab17df0828f',
    '6cbc85b7-f9c8-45f7-9902-c540f11bc828',
    'b18ec194-f6dd-4a4a-bd23-7469b406c0a8',
    '1c3fde93-32ee-481d-8f8b-ed93f249ae40',
    'c978a316-e6fe-4b09-a45f-83155049bf17',
    'e764ef98-76be-4b62-8599-1111ae43f26d',
    'a1b74846-dc33-4a87-8225-8943e7135ce4',
    '0ebfafd8-019c-4276-b99b-df063075e490',
];

let currentKeyIndex = 0;
let lastRequestTimes: { [key: string]: number } = {};
const MIN_REQUEST_INTERVAL = 50;

const getNextApiKey = () => {
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
};

const enforceRateLimit = async (apiKey: string) => {
    const now = Date.now();
    const lastRequest = lastRequestTimes[apiKey] || 0;
    const timeSinceLastRequest = now - lastRequest;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => 
            setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
    }
    
    lastRequestTimes[apiKey] = Date.now();
};

const CIRCUIT_BREAKER = {
    failures: 0,
    lastFailureTime: 0,
    isOpen: false,
    failureThreshold: 5,
    resetTimeout: 60000
};

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 500;

const COMMON_TRC20_TOKENS = {
  'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t': { symbol: 'USDT', decimals: 6 },
  'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8': { symbol: 'USDC', decimals: 6 },
  'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7': { symbol: 'WIN', decimals: 6 },
  'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR': { symbol: 'WTRX', decimals: 6 },
  'TU2T8vpHZhCNY8fXGVaHyeZrKm8s6HEXWe': { symbol: 'BTT', decimals: 18 },
  'TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt': { symbol: 'USDJ', decimals: 18 },
  'TF17BgPaZYbz8oxbjhriubPDsA7ArKoLX3': { symbol: 'JST', decimals: 18 },
  'THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF': { symbol: 'ETH', decimals: 18 },
  'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9': { symbol: 'BTC', decimals: 8 },
  'TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn': { symbol: 'USDD', decimals: 18 }
};

export interface TronAccountInfo {
    balance: number;
    balanceUsd: string;
    trc20: { [key: string]: string };
    address: string;
}

export const isValidTronAddress = (address: string): boolean => {
    // Basic format check
    if (!address || typeof address !== 'string') return false;

    // Extract address part if it's in format address:key or address:mnemonic:key
    const parts = address.split(':');
    const addressPart = parts[0];
    
    // Check if address starts with 'T' and has exactly 34 characters
    if (!addressPart.startsWith('T') || addressPart.length !== 34) return false;
    
    // Check if address contains only valid Base58 characters
    const base58Regex = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
    return base58Regex.test(addressPart);
};

const convertSunToTrx = (sun: number): number => {
    return sun / 1_000_000;
};

const formatTokenBalance = (balance: string, decimals: number, symbol: string): string => {
    const value = parseInt(balance) / Math.pow(10, decimals);
    return `${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    })} ${symbol}`;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkCircuitBreaker = () => {
    const now = Date.now();
    if (CIRCUIT_BREAKER.isOpen) {
        if (now - CIRCUIT_BREAKER.lastFailureTime > CIRCUIT_BREAKER.resetTimeout) {
            CIRCUIT_BREAKER.isOpen = false;
            CIRCUIT_BREAKER.failures = 0;
            return false;
        }
        return true;
    }
    return false;
};

const updateCircuitBreaker = (failed: boolean) => {
    if (failed) {
        CIRCUIT_BREAKER.failures++;
        CIRCUIT_BREAKER.lastFailureTime = Date.now();
        if (CIRCUIT_BREAKER.failures >= CIRCUIT_BREAKER.failureThreshold) {
            CIRCUIT_BREAKER.isOpen = true;
        }
    } else {
        CIRCUIT_BREAKER.failures = 0;
        CIRCUIT_BREAKER.isOpen = false;
    }
};

const getTrc20Balance = async (address: string, contractAddress: string): Promise<string> => {
    if (checkCircuitBreaker()) {
        console.warn(`Circuit breaker is open for token ${contractAddress}, returning 0`);
        return '0';
    }

    const apiKey = getNextApiKey();
    await enforceRateLimit(apiKey);

    const functionSelector = 'balanceOf(address)';
    const parameter = [{ type: 'address', value: address }];

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            if (attempt > 0) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
                await sleep(delay);
            }

            const response = await getConnection().post('/wallet/triggersmartcontract', {
                owner_address: address,
                contract_address: contractAddress,
                function_selector: functionSelector,
                parameter: parameter,
                visible: true
            }, {
                headers: {
                    'TRON-PRO-API-KEY': apiKey
                }
            });

            if (response.data?.constant_result?.[0]) {
                const balance = response.data.constant_result[0];
                const tokenInfo = COMMON_TRC20_TOKENS[contractAddress];
                if (tokenInfo) {
                    updateCircuitBreaker(false);
                    return formatTokenBalance(balance, tokenInfo.decimals, tokenInfo.symbol);
                }
            }
            return '0';
        } catch (error) {
            const isLastAttempt = attempt === MAX_RETRIES;
            if (isLastAttempt) {
                console.error(`Error fetching balance for token ${contractAddress} after ${MAX_RETRIES} retries:`, error);
                updateCircuitBreaker(true);
                return '0';
            }
            console.warn(`Attempt ${attempt + 1}/${MAX_RETRIES + 1} failed for token ${contractAddress}, retrying...`);
        }
    }
    return '0';
};

export const getTronAccountInfo = async (address: string): Promise<TronAccountInfo> => {
    if (!isValidTronAddress(address)) {
        throw new Error('Invalid TRON address format');
    }

    const apiKey = getNextApiKey();
    await enforceRateLimit(apiKey);

    try {
        const [trxPrice, accountResponse] = await Promise.all([
            getTrxPrice(),
            getConnection().get(`/v1/accounts/${address}`, {
                headers: { 'TRON-PRO-API-KEY': apiKey }
            })
        ]);

        // Handle uninitialized accounts
        if (!accountResponse.data?.data?.[0]) {
            return {
                balance: 0,
                balanceUsd: formatUsdBalance(0, trxPrice),
                trc20: {},
                address
            };
        }

        const accountData = accountResponse.data.data[0];
        const balance = convertSunToTrx(accountData.balance || 0);
        const balanceUsd = formatUsdBalance(balance, trxPrice);
        const trc20Tokens: { [key: string]: string } = {};

        // Process common tokens in parallel
        const tokenPromises = Object.keys(COMMON_TRC20_TOKENS).map(async (contractAddress) => {
            const balance = await getTrc20Balance(address, contractAddress);
            if (balance !== '0') {
                trc20Tokens[contractAddress] = balance;
            }
        });

        await Promise.all(tokenPromises);

        // Process account's actual tokens
        if (accountData.trc20?.length > 0) {
            const accountTokenPromises = accountData.trc20.map(async (tokenData) => {
                const [contractAddress, balance] = Object.entries(tokenData)[0];
                if (!trc20Tokens[contractAddress] && balance !== '0') {
                    if (COMMON_TRC20_TOKENS[contractAddress]) {
                        trc20Tokens[contractAddress] = formatTokenBalance(
                            balance,
                            COMMON_TRC20_TOKENS[contractAddress].decimals,
                            COMMON_TRC20_TOKENS[contractAddress].symbol
                        );
                    } else {
                        try {
                            const apiKey = getNextApiKey();
                            await enforceRateLimit(apiKey);
                            const tokenResponse = await getConnection().get(`/v1/contracts/${contractAddress}`, {
                                headers: { 'TRON-PRO-API-KEY': apiKey }
                            });
                            
                            const tokenInfo = tokenResponse.data?.data?.[0];
                            if (tokenInfo) {
                                trc20Tokens[contractAddress] = formatTokenBalance(
                                    balance,
                                    tokenInfo.decimals || 18,
                                    tokenInfo.symbol || 'TOKEN'
                                );
                            }
                        } catch (error) {
                            console.warn(`Could not fetch token info for ${contractAddress}`);
                            trc20Tokens[contractAddress] = formatTokenBalance(balance, 18, 'TOKEN');
                        }
                    }
                }
            });

            await Promise.all(accountTokenPromises);
        }

        return {
            balance,
            balanceUsd,
            trc20: trc20Tokens,
            address
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch account info: ${error.message}`);
        }
        throw new Error('Failed to fetch account info');
    }
};
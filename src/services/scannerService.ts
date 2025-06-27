import { getTronAccountInfo, isValidTronAddress } from './tronGrid';
import { getBtcBalance, getEthBalance, getLtcBalance, validateAddress } from './cryptoApi';
import type { TronAccountInfo } from './tronGrid';
import type { CryptoBalance } from './cryptoApi';

export type ScannerResult = TronAccountInfo | CryptoBalance;

interface ParsedAddress {
  address: string;
  privateKey?: string;
  mnemonic?: string;
  format: 'address' | 'address:privateKey' | 'address:mnemonic:privateKey';
}

export const parseAddressFormat = (input: string): ParsedAddress | null => {
  const trimmed = input.trim();
  
  // Try address:mnemonic:privateKey format first
  const fullMatch = trimmed.match(/^([A-Za-z0-9]+):([\w\s]+):([A-Fa-f0-9]+)$/);
  if (fullMatch) {
    return {
      address: fullMatch[1],
      mnemonic: fullMatch[2],
      privateKey: fullMatch[3],
      format: 'address:mnemonic:privateKey'
    };
  }

  // Try address:privateKey format
  const keyMatch = trimmed.match(/^([A-Za-z0-9]+):([A-Fa-f0-9]+)$/);
  if (keyMatch) {
    return {
      address: keyMatch[1],
      privateKey: keyMatch[2],
      format: 'address:privateKey'
    };
  }

  // Simple address format
  return {
    address: trimmed,
    format: 'address'
  };
};

let stopScan = false;

export const stopBulkScan = () => {
  stopScan = true;
};

export const resetStopScan = () => {
  stopScan = false;
};

export const scanSingleAddress = async (address: string, scannerType: string): Promise<ScannerResult> => {
  try {
    const parsed = parseAddressFormat(address);
    if (!parsed) {
      throw new Error(`Invalid ${scannerType.toUpperCase()} address format`);
    }

    // Check if it's a TRON address first
    if (scannerType === 'tron') {
      if (!isValidTronAddress(parsed.address)) {
        throw new Error('Invalid TRON address format');
      }
      return getTronAccountInfo(parsed.address);
    }

    // Validate other cryptocurrency addresses
    if (!validateAddress(parsed.address, scannerType)) {
      throw new Error(`Invalid ${scannerType.toUpperCase()} address format`);
    }

    let result;
    switch (scannerType.toLowerCase()) {
      case 'btc':
        result = await getBtcBalance(parsed.address);
        break;
      case 'eth':
        result = await getEthBalance(parsed.address);
        break;
      case 'ltc':
        result = await getLtcBalance(parsed.address);
        break;
      default:
        throw new Error('Unsupported cryptocurrency');
    }

    // Add format information to the result
    return {
      ...result,
      format: parsed.format,
      privateKey: parsed.privateKey,
      mnemonic: parsed.mnemonic
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to fetch ${scannerType.toUpperCase()} balance`);
  }
};

interface FailedAddress {
  address: string;
  error: string;
  retryCount: number;
  lastAttempt: number;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 500;
const RETRY_BATCH_SIZE = 50;

export const scanAddressesWithWorkers = async (
  addresses: string[],
  scannerType: string,
  onProgress: (current: number, total: number) => void,
  onResult: (result: ScannerResult) => void
): Promise<void> => {
  resetStopScan();
  
  // Parse and validate all addresses first
  const validAddresses = addresses
    .map(addr => parseAddressFormat(addr))
    .filter((parsed): parsed is ParsedAddress => parsed !== null)
    .filter(parsed => validateAddress(parsed.address, scannerType) || isValidTronAddress(parsed.address))
    .map(parsed => parsed.address);

  let processedCount = 0;
  const totalAddresses = validAddresses.length;
  const failedAddresses: FailedAddress[] = [];

  onProgress(0, totalAddresses);

  const CONCURRENT_BATCHES = 10;
  const ADDRESSES_PER_BATCH = 15;
  const BATCH_INTERVAL = 100;

  const processBatch = async (addresses: string[]) => {
    const batchPromises = addresses.map(async (address) => {
      if (stopScan) return;
      
      try {
        const result = await scanSingleAddress(address, scannerType);
        if (result) {
          onResult(result);
        }
      } catch (error) {
        console.error(`Error scanning address ${address}:`, error);
        failedAddresses.push({
          address,
          error: error instanceof Error ? error.message : 'Unknown error',
          retryCount: 0,
          lastAttempt: Date.now()
        });
      }
      processedCount++;
      onProgress(processedCount, totalAddresses);
    });

    await Promise.all(batchPromises);
  };

  // Process initial addresses
  const chunks = [];
  for (let i = 0; i < validAddresses.length; i += (ADDRESSES_PER_BATCH * CONCURRENT_BATCHES)) {
    chunks.push(validAddresses.slice(i, i + (ADDRESSES_PER_BATCH * CONCURRENT_BATCHES)));
  }

  for (const chunk of chunks) {
    if (stopScan) break;

    const batchPromises = Array.from({ length: CONCURRENT_BATCHES }, async (_, index) => {
      const start = index * ADDRESSES_PER_BATCH;
      const end = start + ADDRESSES_PER_BATCH;
      const batch = chunk.slice(start, end);
      
      if (batch.length === 0) return;

      await new Promise(resolve => setTimeout(resolve, index * BATCH_INTERVAL));
      await processBatch(batch);
    });

    await Promise.all(batchPromises.filter(Boolean));
  }

  // Optimized retry mechanism
  if (failedAddresses.length > 0 && !stopScan) {
    console.log(`Retrying ${failedAddresses.length} failed addresses...`);
    
    // Sort failed addresses by retry count and last attempt time
    failedAddresses.sort((a, b) => {
      if (a.retryCount === b.retryCount) {
        return a.lastAttempt - b.lastAttempt;
      }
      return a.retryCount - b.retryCount;
    });

    while (failedAddresses.length > 0 && !stopScan) {
      const now = Date.now();
      const readyToRetry = failedAddresses.filter(
        addr => now - addr.lastAttempt >= RETRY_DELAY
      ).slice(0, RETRY_BATCH_SIZE);

      if (readyToRetry.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));  // Shorter interval
        continue;
      }

      const retryPromises = readyToRetry.map(async (failed) => {
        if (failed.retryCount >= MAX_RETRY_ATTEMPTS) {
          console.error(`Max retries reached for address ${failed.address}`);
          return;
        }

        try {
          const result = await scanSingleAddress(failed.address, scannerType);
          if (result) {
            onResult(result);
            // Remove from failed addresses
            const index = failedAddresses.findIndex(f => f.address === failed.address);
            if (index !== -1) failedAddresses.splice(index, 1);
          }
        } catch (error) {
          failed.retryCount++;
          failed.lastAttempt = Date.now();
          failed.error = error instanceof Error ? error.message : 'Unknown error';
          
          if (failed.retryCount >= MAX_RETRY_ATTEMPTS) {
            // Remove if max retries reached
            const index = failedAddresses.findIndex(f => f.address === failed.address);
            if (index !== -1) failedAddresses.splice(index, 1);
          }
        }
      });

      await Promise.all(retryPromises);

      // Break if all addresses have been processed
      if (failedAddresses.every(addr => addr.retryCount >= MAX_RETRY_ATTEMPTS)) {
        break;
      }
    }
  }

  resetStopScan();
};
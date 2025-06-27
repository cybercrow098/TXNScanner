import { getTronAccountInfo, isValidTronAddress } from '../services/tronGrid';

interface WorkerMessage {
  addresses: string[];
  batchSize: number;
  workerId: number;
  minBatchDelay: number;
  scannerType: string;
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { addresses, batchSize, workerId, minBatchDelay, scannerType } = e.data;
  const validAddresses = addresses.filter(isValidTronAddress);
  let processedCount = 0;
  
  self.postMessage({ 
    type: 'progress', 
    data: { 
      current: processedCount,
      total: validAddresses.length 
    } 
  });

  for (let i = 0; i < validAddresses.length; i += batchSize) {
    const batch = validAddresses.slice(i, i + batchSize);
    
    for (const address of batch) {
      try {
        const result = await getTronAccountInfo(address);
        if (result && result.balance > 0) {
          self.postMessage({ type: 'result', data: result });
        }
      } catch (error) {
        self.postMessage({ 
          type: 'error', 
          data: { 
            message: error instanceof Error ? error.message : 'Unknown error',
            address 
          } 
        });
      } finally {
        processedCount++;
        self.postMessage({ 
          type: 'progress', 
          data: { 
            current: processedCount,
            total: validAddresses.length 
          } 
        });
      }

      if (minBatchDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, minBatchDelay));
      }
    }
  }

  self.postMessage({ type: 'complete' });
};
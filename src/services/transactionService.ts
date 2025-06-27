import axios from 'axios';

interface Transaction {
  hash: string;
  from_address: string;
  to_address: string;
  amount: number;
  token_address?: string;
  status: string;
  timestamp: string;
  block_number: number;
}

interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  type?: 'in' | 'out' | 'all';
}

export const getTransactions = async (
  address: string,
  filters: TransactionFilters = {}
): Promise<Transaction[]> => {
  try {
    const response = await axios.get(`https://api.trongrid.io/v1/accounts/${address}/transactions`, {
      headers: {
        'TRON-PRO-API-KEY': process.env.VITE_TRON_API_KEY
      }
    });

    const transactions = response.data.data.map((tx: any) => ({
      hash: tx.txID,
      from_address: tx.raw_data.contract[0].parameter.value.owner_address,
      to_address: tx.raw_data.contract[0].parameter.value.to_address,
      amount: tx.raw_data.contract[0].parameter.value.amount / 1_000_000, // Convert from SUN to TRX
      status: tx.ret[0].contractRet === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
      timestamp: new Date(tx.block_timestamp).toISOString(),
      block_number: tx.blockNumber
    }));

    // Apply filters
    let filteredTransactions = transactions;
    
    if (filters.startDate) {
      filteredTransactions = filteredTransactions.filter(tx => 
        new Date(tx.timestamp) >= filters.startDate!
      );
    }
    
    if (filters.endDate) {
      filteredTransactions = filteredTransactions.filter(tx => 
        new Date(tx.timestamp) <= filters.endDate!
      );
    }
    
    if (filters.minAmount) {
      filteredTransactions = filteredTransactions.filter(tx => 
        tx.amount >= filters.minAmount!
      );
    }
    
    if (filters.maxAmount) {
      filteredTransactions = filteredTransactions.filter(tx => 
        tx.amount <= filters.maxAmount!
      );
    }
    
    if (filters.type === 'in') {
      filteredTransactions = filteredTransactions.filter(tx => 
        tx.to_address === address
      );
    } else if (filters.type === 'out') {
      filteredTransactions = filteredTransactions.filter(tx => 
        tx.from_address === address
      );
    }

    return filteredTransactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const traceTransaction = async (hash: string): Promise<any> => {
  try {
    const response = await axios.get(`https://api.trongrid.io/v1/transactions/${hash}/trace`, {
      headers: {
        'TRON-PRO-API-KEY': process.env.VITE_TRON_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error tracing transaction:', error);
    throw error;
  }
};
import React, { useState } from 'react';
import { Database, Copy, ExternalLink, Download, FileJson, FileText, Clock, ArrowUpRight, Wallet, ChevronLeft, ChevronRight, ArrowUpDown, Key, Brain } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

interface AccountInfo {
  balance: number;
  balanceUsd: string;
  trc20: { [key: string]: string };
  address?: string;
  privateKey?: string;
  mnemonic?: string;
  format?: 'address' | 'address:privateKey' | 'address:mnemonic:privateKey';
}

interface WalletResultsProps {
  selectedScanner: string;
  isBulkMode: boolean;
  accountInfo: AccountInfo | null;
  bulkResults: AccountInfo[];
}

type SortField = 'balance' | 'usd';
type SortDirection = 'asc' | 'desc';

export default function WalletResults({ selectedScanner, isBulkMode, accountInfo, bulkResults }: WalletResultsProps) {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [sortField, setSortField] = useState<SortField>('balance');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedResults = [...bulkResults].sort((a, b) => {
    if (sortField === 'balance') {
      return sortDirection === 'desc' ? b.balance - a.balance : a.balance - b.balance;
    } else {
      const aUsd = parseFloat(a.balanceUsd.replace(/[$,]/g, ''));
      const bUsd = parseFloat(b.balanceUsd.replace(/[$,]/g, ''));
      return sortDirection === 'desc' ? bUsd - aUsd : aUsd - bUsd;
    }
  });

  const totalPages = Math.ceil(sortedResults.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentResults = sortedResults.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  const getExplorerUrl = (address: string) => {
    switch (selectedScanner) {
      case 'btc':
        return `https://www.blockchain.com/btc/address/${address}`;
      case 'eth':
        return `https://etherscan.io/address/${address}`;
      case 'ltc':
        return `https://blockchair.com/litecoin/address/${address}`;
      case 'tron':
        return `https://tronscan.org/#/address/${address}`;
      default:
        return '#';
    }
  };

  const calculateTotalUsdValue = (result: AccountInfo): string => {
    const usdBalance = parseFloat(result.balanceUsd.replace(/[$,]/g, '')) || 0;
    
    let usdtBalance = 0;
    Object.entries(result.trc20 || {}).forEach(([contract, balance]) => {
      if (contract === 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t') {
        usdtBalance = parseFloat(balance.split(' ')[0].replace(/,/g, '')) || 0;
      }
    });

    const total = usdBalance + usdtBalance;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(total);
  };

  const downloadResults = (format: 'json' | 'csv') => {
    const data = isBulkMode ? bulkResults : (accountInfo ? [accountInfo] : []);
    if (data.length === 0) {
      toast.error('No data to download');
      return;
    }

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = `${selectedScanner}-scan-${new Date().toISOString()}.json`;
      mimeType = 'application/json';
    } else {
      const headers = ['Address', `${selectedScanner.toUpperCase()} Balance`, 'Total USD Value', 'Tokens'];
      const rows = data.map(wallet => {
        const tokens = Object.entries(wallet.trc20 || {})
          .map(([_, balance]) => balance)
          .join('; ');
        return [
          wallet.address,
          wallet.balance.toString(),
          calculateTotalUsdValue(wallet),
          tokens
        ].join(',');
      });
      content = [headers.join(','), ...rows].join('\n');
      filename = `${selectedScanner}-scan-${new Date().toISOString()}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Results downloaded as ${format.toUpperCase()}`);
    setShowDownloadOptions(false);
  };

  const renderDownloadOptions = () => (
    <div className="absolute right-0 mt-2 w-48 bg-cyber-darker border border-cyber-secondary/30 rounded-lg shadow-lg overflow-hidden z-10">
      <button
        onClick={() => downloadResults('json')}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-cyber-black/30 transition-colors"
      >
        <FileJson className="w-4 h-4" />
        <span>Download JSON</span>
      </button>
      <button
        onClick={() => downloadResults('csv')}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-cyber-black/30 transition-colors"
      >
        <FileText className="w-4 h-4" />
        <span>Download CSV</span>
      </button>
    </div>
  );

  const renderPagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cyber-secondary/20 pt-4 mt-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <span className="text-sm text-cyber-secondary/70">
          Showing {startIndex + 1}-{Math.min(endIndex, bulkResults.length)} of {bulkResults.length}
        </span>
        <select
          value={perPage}
          onChange={(e) => handlePerPageChange(Number(e.target.value))}
          className="cyber-input text-sm py-1"
        >
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
          <option value={500}>500 per page</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="cyber-button p-2 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              return (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              );
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 text-cyber-secondary/50">...</span>
                )}
                <button
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[32px] h-8 rounded ${
                    currentPage === page
                      ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent'
                      : 'hover:bg-cyber-darker'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="cyber-button p-2 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderSortButton = (field: SortField, label: string) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-2 hover:text-cyber-accent transition-colors"
    >
      {label}
      <ArrowUpDown className={`w-4 h-4 ${sortField === field ? 'text-cyber-accent' : ''}`} />
    </button>
  );

  const renderSingleWalletData = (result: AccountInfo) => (
    <div className="space-y-4">
      <div className="cyber-card border-cyber-accent">
        <div className="flex flex-col gap-4">
          {/* Address Section */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyber-accent/10 rounded-lg flex-shrink-0">
              <Wallet className="w-5 h-5 text-cyber-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm truncate">{result.address}</p>
                <div className="flex-shrink-0 flex gap-1">
                  <CopyToClipboard text={result.address || ''} onCopy={() => toast.success('Address copied')}>
                    <button className="p-1 hover:text-cyber-accent transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </CopyToClipboard>
                  <a href={getExplorerUrl(result.address || '')} target="_blank" rel="noopener noreferrer" 
                     className="p-1 hover:text-cyber-accent transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <p className="text-xs text-cyber-secondary/70">Address</p>
            </div>
          </div>

          {/* Private Key Section - Only show if provided */}
          {result.privateKey && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyber-primary/10 rounded-lg flex-shrink-0">
                <Key className="w-5 h-5 text-cyber-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm truncate">{result.privateKey}</p>
                  <CopyToClipboard text={result.privateKey} onCopy={() => toast.success('Private key copied')}>
                    <button className="p-1 hover:text-cyber-primary transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </CopyToClipboard>
                </div>
                <p className="text-xs text-cyber-secondary/70">Private Key</p>
              </div>
            </div>
          )}

          {/* Mnemonic Section - Only show if provided */}
          {result.mnemonic && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyber-yellow/10 rounded-lg flex-shrink-0">
                <Brain className="w-5 h-5 text-cyber-yellow" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm truncate">{result.mnemonic}</p>
                  <CopyToClipboard text={result.mnemonic} onCopy={() => toast.success('Mnemonic copied')}>
                    <button className="p-1 hover:text-cyber-yellow transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </CopyToClipboard>
                </div>
                <p className="text-xs text-cyber-secondary/70">Mnemonic Phrase</p>
              </div>
            </div>
          )}

          {/* Balance Section */}
          <div className="grid grid-cols-3 gap-3">
            <div className="cyber-card bg-cyber-black/50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-cyber-secondary/70" />
                <span className="text-xs text-cyber-secondary/70">Updated</span>
              </div>
              <p className="text-sm truncate">{new Date().toLocaleString()}</p>
            </div>
            <div className="cyber-card bg-cyber-black/50">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="w-3 h-3 text-cyber-accent" />
                <span className="text-xs text-cyber-secondary/70">Balance</span>
              </div>
              <p className="text-sm truncate">{result.balance.toLocaleString()} {selectedScanner.toUpperCase()}</p>
            </div>
            <div className="cyber-card bg-cyber-black/50">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-3 h-3 text-cyber-primary" />
                <span className="text-xs text-cyber-secondary/70">USD</span>
              </div>
              <p className="text-sm truncate">{result.balanceUsd}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Token Holdings */}
      {result.trc20 && Object.keys(result.trc20).length > 0 && (
        <div className="cyber-card">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-cyber-accent" />
            <h3 className="text-base font-bold">Token Holdings</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(result.trc20).map(([contract, balance]) => (
              <div key={contract} className="p-3 bg-cyber-black/50 rounded-lg border border-cyber-secondary/20">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs truncate">{contract}</p>
                    <p className="text-sm font-medium mt-1">{balance}</p>
                  </div>
                  <div className="flex-shrink-0 flex gap-1">
                    <CopyToClipboard text={contract} onCopy={() => toast.success('Contract copied')}>
                      <button className="p-1 hover:text-cyber-accent transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </CopyToClipboard>
                    <a href={getExplorerUrl(contract)} target="_blank" rel="noopener noreferrer"
                       className="p-1 hover:text-cyber-accent transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderBulkResults = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="cyber-card">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-4 h-4 text-cyber-accent" />
            <span className="text-sm text-cyber-secondary/70">Total Wallets</span>
          </div>
          <p className="text-lg">{bulkResults.length}</p>
        </div>

        <div className="cyber-card">
          <div className="flex items-center gap-3 mb-2">
            <ArrowUpRight className="w-4 h-4 text-cyber-primary" />
            <span className="text-sm text-cyber-secondary/70">With Balance</span>
          </div>
          <p className="text-lg">
            {bulkResults.filter(r => r.balance > 0).length}
          </p>
        </div>

        <div className="cyber-card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-4 h-4 text-cyber-secondary/70" />
            <span className="text-sm text-cyber-secondary/70">Last Updated</span>
          </div>
          <p className="text-lg">{new Date().toLocaleString()}</p>
        </div>
      </div>

      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-cyber-accent" />
            <h3 className="text-lg font-bold">Scan Results</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className="p-2 hover:text-cyber-primary transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            {showDownloadOptions && renderDownloadOptions()}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-secondary/20">
                <th className="text-left p-4 text-sm font-medium text-cyber-secondary/70">Address</th>
                <th className="text-right p-4 text-sm font-medium text-cyber-secondary/70">
                  {renderSortButton('balance', `Balance (${selectedScanner.toUpperCase()})`)}
                </th>
                <th className="text-right p-4 text-sm font-medium text-cyber-secondary/70">
                  {renderSortButton('usd', 'Total USD Value')}
                </th>
                <th className="text-right p-4 text-sm font-medium text-cyber-secondary/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result, index) => (
                <tr key={index} className="border-b border-cyber-secondary/10 hover:bg-cyber-black/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Wallet className="w-4 h-4 text-cyber-accent flex-shrink-0" />
                      <span className="font-mono truncate">{result.address}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono whitespace-nowrap">
                    {result.balance.toLocaleString()} {selectedScanner.toUpperCase()}
                  </td>
                  <td className="p-4 text-right font-mono whitespace-nowrap">
                    {calculateTotalUsdValue(result)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <CopyToClipboard 
                        text={result.address || ''}
                        onCopy={() => toast.success('Address copied')}
                      >
                        <button className="p-1 hover:text-cyber-primary transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </CopyToClipboard>
                      <a
                        href={getExplorerUrl(result.address || '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:text-cyber-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bulkResults.length > perPage && renderPagination()}
      </div>
    </div>
  );

  return (
    <>
      {!isBulkMode && accountInfo ? renderSingleWalletData(accountInfo) : null}
      {isBulkMode && bulkResults.length > 0 ? renderBulkResults() : null}
    </>
  );
}
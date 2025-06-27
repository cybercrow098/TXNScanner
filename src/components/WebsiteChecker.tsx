import React, { useState, useRef } from 'react';
import { Upload, Globe, Loader, Download, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WebsiteStatus {
  url: string;
  status: number;
  working: boolean;
  error?: string;
}

export default function WebsiteChecker() {
  const [websites, setWebsites] = useState<string>('');
  const [results, setResults] = useState<WebsiteStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setWebsites(content);
      toast.success('File loaded successfully');
    };
    reader.readAsText(file);
  };

  const checkWebsites = async () => {
    if (!websites.trim()) {
      toast.error('Please enter at least one website');
      return;
    }

    setLoading(true);
    const urls = websites
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => url.startsWith('http') ? url : `https://${url}`);

    const results: WebsiteStatus[] = [];
    const corsProxy = 'https://api.allorigins.win/get?url=';

    for (const url of urls) {
      try {
        const encodedUrl = encodeURIComponent(url);
        const response = await fetch(`${corsProxy}${encodedUrl}`);
        const data = await response.json();
        const status = data.status?.http_code || (data.contents ? 200 : 404);
        
        results.push({
          url,
          status,
          working: status !== 404 && data.contents !== null,
          error: status === 404 ? 'Page not found' : undefined
        });
      } catch (error) {
        results.push({
          url,
          status: 0,
          working: false,
          error: error instanceof Error ? error.message : 'Connection failed'
        });
      }
    }

    setResults(results);
    setLoading(false);
    toast.success('Website check completed');
  };

  const downloadResults = () => {
    if (results.length === 0) {
      toast.error('No results to download');
      return;
    }

    const csv = [
      ['URL', 'Status', 'Working', 'Error'].join(','),
      ...results.map(result => [
        result.url,
        result.status,
        result.working,
        result.error || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-status-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Results downloaded');
  };

  const getStatusColor = (status: number): string => {
    if (status === 200) return 'bg-cyber-accent/20 text-cyber-accent';
    if (status === 404) return 'bg-cyber-primary/20 text-cyber-primary';
    return 'bg-cyber-secondary/20 text-cyber-secondary';
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Enter Websites</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="cyber-button text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </button>
          </div>
        </div>
        <textarea
          value={websites}
          onChange={(e) => setWebsites(e.target.value)}
          placeholder="Enter websites (one per line)&#10;Example:&#10;https://example.com&#10;https://google.com"
          rows={5}
          className="cyber-input font-mono w-full resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={checkWebsites}
          disabled={loading}
          className="cyber-button cyber-button-primary flex-1"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              <span>Check Websites</span>
            </>
          )}
        </button>
        {results.length > 0 && (
          <button
            onClick={downloadResults}
            className="cyber-button"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Results</h3>
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 404
                    ? 'bg-cyber-primary/10 border-cyber-primary/30'
                    : result.working
                    ? 'bg-cyber-accent/10 border-cyber-accent/30'
                    : 'bg-cyber-secondary/10 border-cyber-secondary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-mono text-sm break-all">{result.url}</p>
                    {result.error && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-cyber-primary">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{result.error}</span>
                      </div>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(result.status)}`}>
                    {result.status || 'Error'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
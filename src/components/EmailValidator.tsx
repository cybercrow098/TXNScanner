import React, { useState } from 'react';
import { Mail, RefreshCw, AlertTriangle, Check, Copy, Upload, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import axios from 'axios';

interface ValidationResult {
  email: string;
  isValid: boolean;
  format: boolean;
  dns: boolean;
  disposable: boolean;
  free: boolean;
  score: number;
  details?: string;
  deliverability: string;
}

const API_KEY = '3be3c5381ea64a9a929bcb3ac4ae3c16';
const API_URL = 'https://emailvalidation.abstractapi.com/v1/';

export default function EmailValidator() {
  const [email, setEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateSingleEmail = async (email: string): Promise<ValidationResult> => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          email: email
        }
      });

      const data = response.data;
      return {
        email,
        isValid: data.is_valid_format.value && data.deliverability !== 'UNDELIVERABLE',
        format: data.is_valid_format.value,
        dns: data.is_mx_found.value,
        disposable: data.is_disposable_email.value,
        free: data.is_free_email.value,
        score: data.quality_score * 100,
        deliverability: data.deliverability,
        details: data.deliverability === 'UNDELIVERABLE' ? 'Email is undeliverable' : undefined
      };
    } catch (error) {
      console.error('Validation error:', error);
      return {
        email,
        isValid: false,
        format: false,
        dns: false,
        disposable: false,
        free: false,
        score: 0,
        deliverability: 'ERROR',
        details: 'Failed to validate email'
      };
    }
  };

  const handleValidation = async () => {
    if (isBulkMode && !bulkEmails.trim()) {
      toast.error('Please enter emails to validate');
      return;
    }
    if (!isBulkMode && !email.trim()) {
      toast.error('Please enter an email to validate');
      return;
    }

    setLoading(true);
    try {
      if (isBulkMode) {
        const emails = bulkEmails
          .split('\n')
          .map(e => e.trim())
          .filter(e => e.length > 0);

        // Process in batches to avoid rate limits
        const batchSize = 5;
        const results: ValidationResult[] = [];
        
        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(email => validateSingleEmail(email))
          );
          results.push(...batchResults);
          
          // Update results progressively
          setResults([...results]);
          
          // Add delay between batches
          if (i + batchSize < emails.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        toast.success(`Validated ${results.length} emails`);
      } else {
        const result = await validateSingleEmail(email);
        setResults([result]);
        toast.success('Email validated');
      }
    } catch (error) {
      toast.error('Error validating email(s)');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setBulkEmails(content);
      setIsBulkMode(true);
      toast.success('File loaded successfully');
    };
    reader.readAsText(file);
  };

  const downloadResults = () => {
    if (results.length === 0) {
      toast.error('No results to download');
      return;
    }

    const csv = [
      ['Email', 'Valid', 'Format', 'DNS', 'Disposable', 'Free', 'Score', 'Deliverability', 'Details'].join(','),
      ...results.map(result => [
        result.email,
        result.isValid,
        result.format,
        result.dns,
        result.disposable,
        result.free,
        result.score,
        result.deliverability,
        result.details || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-validation-${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Results downloaded');
  };

  const getDeliverabilityColor = (deliverability: string) => {
    switch (deliverability.toUpperCase()) {
      case 'DELIVERABLE':
        return 'text-cyber-accent';
      case 'UNDELIVERABLE':
        return 'text-cyber-primary';
      case 'RISKY':
        return 'text-cyber-yellow';
      default:
        return 'text-cyber-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsBulkMode(!isBulkMode)}
              className={`cyber-button ${isBulkMode ? 'border-cyber-accent text-cyber-accent' : ''}`}
            >
              {isBulkMode ? 'Single Mode' : 'Bulk Mode'}
            </button>
            {isBulkMode && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.csv"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="cyber-button"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </>
            )}
          </div>

          {isBulkMode ? (
            <textarea
              value={bulkEmails}
              onChange={(e) => setBulkEmails(e.target.value)}
              placeholder="Enter emails (one per line)"
              rows={10}
              className="cyber-input font-mono w-full resize-none"
            />
          ) : (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="cyber-input w-full"
            />
          )}

          <button
            onClick={handleValidation}
            disabled={loading}
            className="cyber-button cyber-button-primary w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Validate {isBulkMode ? 'Emails' : 'Email'}</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {results.length > 0 && (
            <div className="flex justify-end gap-2">
              <button onClick={downloadResults} className="cyber-button">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          )}

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.isValid
                    ? 'bg-cyber-accent/10 border-cyber-accent/30'
                    : 'bg-cyber-primary/10 border-cyber-primary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {result.isValid ? (
                        <Check className="w-4 h-4 text-cyber-accent" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-cyber-primary" />
                      )}
                      <span className="font-mono">{result.email}</span>
                      <CopyToClipboard
                        text={result.email}
                        onCopy={() => toast.success('Email copied')}
                      >
                        <button className="p-1 hover:text-cyber-primary transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </CopyToClipboard>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-cyber-secondary/70">Format:</span>
                        <span className={result.format ? 'text-cyber-accent' : 'text-cyber-primary'}>
                          {' '}{result.format ? 'Valid' : 'Invalid'}
                        </span>
                      </div>
                      <div>
                        <span className="text-cyber-secondary/70">DNS:</span>
                        <span className={result.dns ? 'text-cyber-accent' : 'text-cyber-primary'}>
                          {' '}{result.dns ? 'Valid' : 'Invalid'}
                        </span>
                      </div>
                      <div>
                        <span className="text-cyber-secondary/70">Disposable:</span>
                        <span className={!result.disposable ? 'text-cyber-accent' : 'text-cyber-primary'}>
                          {' '}{result.disposable ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-cyber-secondary/70">Free Email:</span>
                        <span className={!result.free ? 'text-cyber-accent' : 'text-cyber-secondary'}>
                          {' '}{result.free ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-cyber-secondary/70">Score:</span>
                        <span className={result.score > 80 ? 'text-cyber-accent' : 'text-cyber-secondary'}>
                          {' '}{result.score}%
                        </span>
                      </div>
                      <div>
                        <span className="text-cyber-secondary/70">Delivery:</span>
                        <span className={getDeliverabilityColor(result.deliverability)}>
                          {' '}{result.deliverability}
                        </span>
                      </div>
                    </div>

                    {result.details && (
                      <div className="mt-2 text-sm text-cyber-primary">
                        {result.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-8 text-cyber-secondary/70">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Validation results will appear here</p>
            </div>
          )}
        </div>
      </div>

      <div className="cyber-card">
        <h3 className="text-lg font-bold mb-4">Validation Checks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyber-accent" />
              <span>Email format validation</span>
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyber-accent" />
              <span>DNS record verification</span>
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyber-accent" />
              <span>Disposable email detection</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyber-accent" />
              <span>Free email provider check</span>
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyber-accent" />
              <span>Deliverability scoring</span>
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyber-accent" />
              <span>Bulk validation support</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
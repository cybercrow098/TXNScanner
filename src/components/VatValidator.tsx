import React, { useState } from 'react';
import { Receipt, Copy, RefreshCw, Check, AlertTriangle, Building, Calendar, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import axios from 'axios';

interface VatValidationResult {
  vat_number: string;
  valid: boolean;
  company: {
    name: string | null;
    address: string | null;
  };
  country: {
    code: string | null;
    name: string | null;
  };
  format_valid: boolean;
  query_date: string;
}

const API_KEY = 'e73ab94fbf124a30946e917e8853cf8d';
const API_URL = 'https://vat.abstractapi.com/v1/validate/';

export default function VatValidator() {
  const [vatNumber, setVatNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VatValidationResult | null>(null);

  const validateVat = async () => {
    if (!vatNumber) {
      toast.error('Please enter a VAT number');
      return;
    }

    // Clean the VAT number - remove spaces and convert to uppercase
    const cleanVat = vatNumber.replace(/\s/g, '').toUpperCase();

    // Basic format validation
    if (cleanVat.length < 8 || !/^[A-Z]{2}/.test(cleanVat)) {
      toast.error('Invalid VAT format. Must start with country code (e.g., SE556656688001)');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          vat_number: cleanVat
        }
      });

      // Create a properly structured result object
      const validationResult: VatValidationResult = {
        vat_number: cleanVat,
        valid: response.data.valid === true,
        company: {
          name: response.data.company?.name || null,
          address: response.data.company?.address || null
        },
        country: {
          code: response.data.country?.code || cleanVat.slice(0, 2),
          name: response.data.country?.name || null
        },
        format_valid: response.data.format_valid === true,
        query_date: response.data.query_date || new Date().toISOString()
      };

      setResult(validationResult);
      
      if (validationResult.valid) {
        toast.success('VAT number is valid');
      } else {
        toast.error('VAT number is invalid');
      }
    } catch (error) {
      console.error('Error validating VAT:', error);
      
      // Set an error result
      const errorResult: VatValidationResult = {
        vat_number: cleanVat,
        valid: false,
        company: {
          name: null,
          address: null
        },
        country: {
          code: cleanVat.slice(0, 2),
          name: null
        },
        format_valid: false,
        query_date: new Date().toISOString()
      };
      
      setResult(errorResult);
      toast.error('Failed to validate VAT number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="cyber-card">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-cyber-accent" />
              <h3 className="text-lg font-bold">VAT Number Validation</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">VAT Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    placeholder="e.g., SE556656688001"
                    className="cyber-input flex-1"
                  />
                  <button
                    onClick={validateVat}
                    disabled={loading}
                    className="cyber-button cyber-button-primary whitespace-nowrap"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Checking...</span>
                      </>
                    ) : (
                      <>
                        <Receipt className="w-4 h-4" />
                        <span>Validate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                <p className="text-sm text-cyber-secondary/70">
                  Enter a valid VAT number including the country prefix (e.g., SE556656688001 for Sweden).
                </p>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <h3 className="text-lg font-bold mb-4">Format Examples</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-cyber-secondary/70">Sweden:</span> SE556656688001</p>
              <p><span className="text-cyber-secondary/70">Germany:</span> DE123456789</p>
              <p><span className="text-cyber-secondary/70">France:</span> FR12345678901</p>
              <p><span className="text-cyber-secondary/70">UK:</span> GB123456789</p>
              <p><span className="text-cyber-secondary/70">Italy:</span> IT12345678901</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {result && (
            <div className="cyber-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    result.valid 
                      ? 'bg-cyber-accent/10 text-cyber-accent'
                      : 'bg-cyber-primary/10 text-cyber-primary'
                  }`}>
                    {result.valid ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{result.vat_number}</h3>
                    <p className="text-sm text-cyber-secondary/70">
                      {result.valid ? 'Valid VAT Number' : 'Invalid VAT Number'}
                    </p>
                  </div>
                </div>
                <CopyToClipboard
                  text={result.vat_number}
                  onCopy={() => toast.success('VAT number copied')}
                >
                  <button className="p-2 hover:text-cyber-primary transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </CopyToClipboard>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-cyber-accent" />
                      <span className="text-sm text-cyber-secondary/70">Country</span>
                    </div>
                    <p className="font-medium">{result.country.name || 'Unknown'}</p>
                    <p className="text-sm text-cyber-secondary/70">
                      Code: {result.country.code || 'Invalid'}
                    </p>
                  </div>

                  <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-cyber-accent" />
                      <span className="text-sm text-cyber-secondary/70">Query Date</span>
                    </div>
                    <p className="font-medium">
                      {new Date(result.query_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Building className="w-4 h-4 text-cyber-accent" />
                    <span className="text-sm text-cyber-secondary/70">Company Details</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Name</p>
                      <p className="font-medium">{result.company.name || 'Not Available'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Address</p>
                      <p className="font-medium">{result.company.address || 'Not Available'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="w-4 h-4 text-cyber-accent" />
                    <span className="text-sm text-cyber-secondary/70">Validation Details</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyber-secondary/70">Format Valid</span>
                      <span className={result.format_valid ? 'text-cyber-accent' : 'text-cyber-primary'}>
                        {result.format_valid ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyber-secondary/70">Active</span>
                      <span className={result.valid ? 'text-cyber-accent' : 'text-cyber-primary'}>
                        {result.valid ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {!result.valid && (
                  <div className="p-4 bg-cyber-primary/10 rounded-lg border border-cyber-primary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-cyber-primary" />
                      <span className="text-sm font-medium text-cyber-primary">Validation Failed</span>
                    </div>
                    <p className="text-sm text-cyber-primary/80">
                      This VAT number appears to be invalid. Please check the following:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-cyber-primary/80">
                      <li>• Correct country prefix (e.g., SE for Sweden)</li>
                      <li>• Proper number format for the country</li>
                      <li>• Active registration status</li>
                      <li>• No typos or missing digits</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
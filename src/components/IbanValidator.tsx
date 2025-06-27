import React, { useState } from 'react';
import { CreditCard, Copy, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import axios from 'axios';

interface IbanValidationResult {
  iban: string;
  is_valid: boolean;
}

const API_KEY = 'f9e50fc9a8d142cd9f81b2d6da33a167';
const API_URL = 'https://ibanvalidation.abstractapi.com/v1/';

export default function IbanValidator() {
  const [iban, setIban] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IbanValidationResult | null>(null);

  const validateIban = async () => {
    if (!iban) {
      toast.error('Please enter an IBAN');
      return;
    }

    // Clean the IBAN - remove spaces and convert to uppercase
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();

    // Basic format validation
    if (cleanIban.length < 15 || !/^[A-Z]{2}/.test(cleanIban)) {
      toast.error('Invalid IBAN format. Must start with country code');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          iban: cleanIban
        }
      });

      const validationResult: IbanValidationResult = {
        iban: cleanIban,
        is_valid: response.data?.is_valid === true
      };

      setResult(validationResult);
      
      if (validationResult.is_valid) {
        toast.success('IBAN is valid');
      } else {
        toast.error('IBAN is invalid');
      }
    } catch (error) {
      console.error('Error validating IBAN:', error);
      setResult({
        iban: cleanIban,
        is_valid: false
      });
      toast.error('Failed to validate IBAN');
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
              <CreditCard className="w-5 h-5 text-cyber-accent" />
              <h3 className="text-lg font-bold">IBAN Validation</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">IBAN Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="e.g., BE71096123456769"
                    className="cyber-input flex-1"
                  />
                  <button
                    onClick={validateIban}
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
                        <CreditCard className="w-4 h-4" />
                        <span>Validate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                <p className="text-sm text-cyber-secondary/70">
                  Enter a valid IBAN number including the country prefix (e.g., BE71096123456769 for Belgium).
                </p>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <h3 className="text-lg font-bold mb-4">Format Examples</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-cyber-secondary/70">Belgium:</span> BE71096123456769</p>
              <p><span className="text-cyber-secondary/70">Germany:</span> DE89370400440532013000</p>
              <p><span className="text-cyber-secondary/70">France:</span> FR1420041010050500013M02606</p>
              <p><span className="text-cyber-secondary/70">Spain:</span> ES9121000418450200051332</p>
              <p><span className="text-cyber-secondary/70">Italy:</span> IT60X0542811101000000123456</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {result && (
            <div className="cyber-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    result.is_valid 
                      ? 'bg-cyber-accent/10 text-cyber-accent'
                      : 'bg-cyber-primary/10 text-cyber-primary'
                  }`}>
                    {result.is_valid ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{result.iban}</h3>
                    <p className="text-sm text-cyber-secondary/70">
                      {result.is_valid ? 'Valid IBAN' : 'Invalid IBAN'}
                    </p>
                  </div>
                </div>
                <CopyToClipboard
                  text={result.iban}
                  onCopy={() => toast.success('IBAN copied')}
                >
                  <button className="p-2 hover:text-cyber-primary transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

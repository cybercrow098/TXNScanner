import React, { useState } from 'react';
import { Phone, Copy, RefreshCw, Globe, MapPin, Building, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import axios from 'axios';

interface PhoneValidationResult {
  phone: string;
  valid: boolean;
  format: {
    international: string;
    local: string;
  };
  country: {
    code: string;
    name: string;
    prefix: string;
  };
  location: string;
  type: string;
  carrier: string;
}

const API_KEY = '0129e309890341febb00e057dd4e3499';
const API_URL = 'https://phonevalidation.abstractapi.com/v1/';

export default function PhoneValidator() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhoneValidationResult | null>(null);

  const formatPhoneNumber = (number: string): string => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // If it starts with 91 and is 12 digits, it's already formatted
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return cleaned;
    }
    
    // If it's 10 digits, add 91 prefix
    if (cleaned.length === 10) {
      return `91${cleaned}`;
    }
    
    return cleaned;
  };

  const validatePhone = async () => {
    if (!phone) {
      toast.error('Please enter a phone number');
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    
    if (formattedPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          phone: formattedPhone
        }
      });

      if (response.data.valid === false) {
        toast.error('Invalid phone number');
      } else {
        toast.success('Phone number validated successfully');
      }

      setResult(response.data);
    } catch (error) {
      console.error('Error validating phone:', error);
      toast.error('Failed to validate phone number');
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
              <Phone className="w-5 h-5 text-cyber-accent" />
              <h3 className="text-lg font-bold">Phone Validation</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    className="cyber-input flex-1"
                  />
                  <button
                    onClick={validatePhone}
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
                        <Phone className="w-4 h-4" />
                        <span>Validate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                <p className="text-sm text-cyber-secondary/70">
                  Enter a phone number with country code
                </p>
              </div>
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
                      <Phone className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{result.format.international}</h3>
                    <p className="text-sm text-cyber-secondary/70">
                      {result.valid ? 'Valid Phone Number' : 'Invalid Phone Number'}
                    </p>
                  </div>
                </div>
                <CopyToClipboard
                  text={result.format.international}
                  onCopy={() => toast.success('Phone number copied')}
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
                    <p className="font-medium">{result.country.name}</p>
                    <p className="text-sm text-cyber-secondary/70">
                      Code: {result.country.code} | Prefix: {result.country.prefix}
                    </p>
                  </div>

                  <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-cyber-accent" />
                      <span className="text-sm text-cyber-secondary/70">Location</span>
                    </div>
                    <p className="font-medium">{result.location || 'Unknown'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-cyber-accent" />
                      <span className="text-sm text-cyber-secondary/70">Type</span>
                    </div>
                    <p className="font-medium capitalize">{result.type}</p>
                  </div>

                  <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-cyber-accent" />
                      <span className="text-sm text-cyber-secondary/70">Carrier</span>
                    </div>
                    <p className="font-medium">{result.carrier || 'Unknown'}</p>
                  </div>
                </div>

                <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-cyber-accent" />
                    <span className="text-sm text-cyber-secondary/70">Formats</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-cyber-secondary/70">International</p>
                      <p className="font-medium">{result.format.international}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Local</p>
                      <p className="font-medium">{result.format.local}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
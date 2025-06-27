import React, { useState } from 'react';
import { Globe, Copy, RefreshCw, MapPin, Building, Clock, Flag, CreditCard, Shield, Wifi } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import axios from 'axios';

interface IpIntelligenceResult {
  ip_address: string;
  security: {
    is_vpn: boolean;
    is_proxy: boolean;
    is_tor: boolean;
    is_hosting: boolean;
    is_relay: boolean;
    is_mobile: boolean;
    is_abuse: boolean;
  };
  asn: {
    asn: number;
    name: string;
    domain: string;
    type: string;
  };
  company: {
    name: string;
    domain: string;
    type: string;
  };
  location: {
    city: string;
    region: string;
    postal_code: string;
    country: string;
    country_code: string;
    continent: string;
    longitude: number;
    latitude: number;
  };
  timezone: {
    name: string;
    abbreviation: string;
    utc_offset: number;
    local_time: string;
    is_dst: boolean;
  };
  flag: {
    emoji: string;
    unicode: string;
    png: string;
    svg: string;
  };
  currency: {
    name: string;
    code: string;
    symbol: string;
  };
}

const API_KEY = 'eaa95820e0e4427d8406fa6cc6c33133';
const API_URL = 'https://ip-intelligence.abstractapi.com/v1/';

export default function IpIntelligence() {
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IpIntelligenceResult | null>(null);

  const validateIp = (ip: string): boolean => {
    // Basic IPv4 validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    // Basic IPv6 validation
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const checkIp = async () => {
    if (!ipAddress) {
      toast.error('Please enter an IP address');
      return;
    }

    if (!validateIp(ipAddress)) {
      toast.error('Invalid IP address format');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          ip_address: ipAddress
        }
      });

      setResult(response.data);
      toast.success('IP intelligence data retrieved');
    } catch (error) {
      console.error('Error checking IP:', error);
      toast.error('Failed to retrieve IP intelligence data');
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
              <Globe className="w-5 h-5 text-cyber-accent" />
              <h3 className="text-lg font-bold">IP Intelligence</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">IP Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="Enter IP address"
                    className="cyber-input flex-1"
                  />
                  <button
                    onClick={checkIp}
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
                        <Globe className="w-4 h-4" />
                        <span>Check IP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                <p className="text-sm text-cyber-secondary/70">
                  Enter an IPv4 or IPv6 address to get detailed intelligence information.
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
                  <Globe className="w-5 h-5 text-cyber-accent" />
                  <div>
                    <h3 className="text-lg font-bold">{result.ip_address}</h3>
                    <p className="text-sm text-cyber-secondary/70">IP Intelligence Results</p>
                  </div>
                </div>
                <CopyToClipboard
                  text={result.ip_address}
                  onCopy={() => toast.success('IP address copied')}
                >
                  <button className="p-2 hover:text-cyber-primary transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </CopyToClipboard>
              </div>

              <div className="space-y-6">
                {/* Security Information */}
                <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-cyber-accent" />
                    <span className="text-sm font-medium">Security Information</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-cyber-secondary/70">VPN</p>
                      <p className={result.security.is_vpn ? 'text-cyber-primary' : 'text-cyber-accent'}>
                        {result.security.is_vpn ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Proxy</p>
                      <p className={result.security.is_proxy ? 'text-cyber-primary' : 'text-cyber-accent'}>
                        {result.security.is_proxy ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">TOR</p>
                      <p className={result.security.is_tor ? 'text-cyber-primary' : 'text-cyber-accent'}>
                        {result.security.is_tor ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Hosting</p>
                      <p className={result.security.is_hosting ? 'text-cyber-primary' : 'text-cyber-accent'}>
                        {result.security.is_hosting ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Mobile</p>
                      <p className={result.security.is_mobile ? 'text-cyber-primary' : 'text-cyber-accent'}>
                        {result.security.is_mobile ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Abuse</p>
                      <p className={result.security.is_abuse ? 'text-cyber-primary' : 'text-cyber-accent'}>
                        {result.security.is_abuse ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-cyber-accent" />
                    <span className="text-sm font-medium">Location Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Country</p>
                      <p className="flex items-center gap-2">
                        <span>{result.flag.emoji}</span>
                        <span>{result.location.country}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">City</p>
                      <p>{result.location.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Region</p>
                      <p>{result.location.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Postal Code</p>
                      <p>{result.location.postal_code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Coordinates</p>
                      <p>{result.location.latitude}, {result.location.longitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Continent</p>
                      <p>{result.location.continent}</p>
                    </div>
                  </div>
                </div>

                {/* Network Information */}
                <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Wifi className="w-4 h-4 text-cyber-accent" />
                    <span className="text-sm font-medium">Network Information</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-cyber-secondary/70">ASN</p>
                      <p>AS{result.asn.asn} - {result.asn.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cyber-secondary/70">Company</p>
                      <p>{result.company.name} ({result.company.type})</p>
                    </div>
                  </div>
                </div>

                {/* Time and Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-cyber-accent" />
                      <span className="text-sm font-medium">Time Zone</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-cyber-secondary/70">{result.timezone.name}</p>
                      <p>{result.timezone.local_time} ({result.timezone.abbreviation})</p>
                      <p className="text-sm">UTC{result.timezone.utc_offset >= 0 ? '+' : ''}{result.timezone.utc_offset}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-4 h-4 text-cyber-accent" />
                      <span className="text-sm font-medium">Currency</span>
                    </div>
                    <div className="space-y-2">
                      <p>{result.currency.name}</p>
                      <p className="text-sm text-cyber-secondary/70">
                        {result.currency.code} ({result.currency.symbol})
                      </p>
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
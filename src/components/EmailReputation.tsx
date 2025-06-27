import React, { useState } from 'react';
import { Mail, RefreshCw, Copy, Shield, AlertTriangle, Calendar, Globe, Building, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';
import axios from 'axios';

interface EmailReputationResult {
  email_address: string;
  email_deliverability: {
    status: string;
    status_detail: string;
    is_format_valid: boolean;
    is_smtp_valid: boolean;
    is_mx_valid: boolean;
    mx_records: string[];
  };
  email_quality: {
    score: number;
    is_free_email: boolean;
    is_username_suspicious: boolean;
    is_disposable: boolean;
    is_catchall: boolean;
    is_subaddress: boolean;
    is_role: boolean;
    is_dmarc_enforced: boolean;
    is_spf_strict: boolean;
    minimum_age: number;
  };
  email_sender: {
    first_name: string;
    last_name: string;
    email_provider_name: string;
    organization_name: string;
    organization_type: string;
  };
  email_domain: {
    domain: string;
    domain_age: number;
    is_live_site: boolean;
    registrar: string;
    registrar_url: string;
    date_registered: string;
    date_last_renewed: string;
    date_expires: string;
    is_risky_tld: boolean;
  };
  email_risk: {
    address_risk_status: string;
    domain_risk_status: string;
  };
  email_breaches: {
    total_breaches: number;
    date_first_breached: string;
    date_last_breached: string;
    breached_domains: {
      domain: string;
      breach_date: string;
    }[];
  };
}

const API_KEY = '724815aa0e45416aa268546a4b3baf98';
const API_URL = 'https://emailreputation.abstractapi.com/v1/';

export default function EmailReputation() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailReputationResult | null>(null);

  const checkReputation = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          email: email
        }
      });

      setResult(response.data);
      toast.success('Email reputation checked successfully');
    } catch (error) {
      console.error('Error checking reputation:', error);
      toast.error('Failed to check email reputation');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'low':
      case 'deliverable':
        return 'text-cyber-accent';
      case 'high':
      case 'undeliverable':
        return 'text-cyber-primary';
      case 'medium':
      case 'risky':
        return 'text-cyber-yellow';
      default:
        return 'text-cyber-secondary';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="cyber-input w-full"
            />
          </div>
          <button
            onClick={checkReputation}
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
                <Shield className="w-4 h-4" />
                <span>Check Reputation</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            {/* Email Overview */}
            <div className="p-6 bg-cyber-black/50 rounded-lg border border-cyber-accent/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-cyber-accent" />
                  <h3 className="text-lg font-bold">{result.email_address}</h3>
                </div>
                <CopyToClipboard
                  text={result.email_address}
                  onCopy={() => toast.success('Email copied')}
                >
                  <button className="p-2 hover:text-cyber-primary transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </CopyToClipboard>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-cyber-secondary/70 mb-1">Deliverability</p>
                  <p className={`font-bold ${getStatusColor(result.email_deliverability.status)}`}>
                    {result.email_deliverability.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-cyber-secondary/70 mb-1">Quality Score</p>
                  <p className="font-bold text-cyber-accent">
                    {(result.email_quality.score * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-cyber-secondary/70 mb-1">Risk Status</p>
                  <p className={`font-bold ${getStatusColor(result.email_risk.address_risk_status)}`}>
                    {result.email_risk.address_risk_status.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Quality */}
              <div className="cyber-card">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-cyber-accent" />
                  <h3 className="text-lg font-bold">Email Quality</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-cyber-secondary/70">Free Email</span>
                    <span className={result.email_quality.is_free_email ? 'text-cyber-yellow' : 'text-cyber-accent'}>
                      {result.email_quality.is_free_email ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyber-secondary/70">Disposable</span>
                    <span className={result.email_quality.is_disposable ? 'text-cyber-primary' : 'text-cyber-accent'}>
                      {result.email_quality.is_disposable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyber-secondary/70">Catch-all</span>
                    <span className={result.email_quality.is_catchall ? 'text-cyber-yellow' : 'text-cyber-accent'}>
                      {result.email_quality.is_catchall ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyber-secondary/70">DMARC Enforced</span>
                    <span className={result.email_quality.is_dmarc_enforced ? 'text-cyber-accent' : 'text-cyber-yellow'}>
                      {result.email_quality.is_dmarc_enforced ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyber-secondary/70">SPF Strict</span>
                    <span className={result.email_quality.is_spf_strict ? 'text-cyber-accent' : 'text-cyber-yellow'}>
                      {result.email_quality.is_spf_strict ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Domain Info */}
              <div className="cyber-card">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-cyber-accent" />
                  <h3 className="text-lg font-bold">Domain Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-cyber-secondary/70">Domain</span>
                    <p className="font-mono">{result.email_domain.domain}</p>
                  </div>
                  <div>
                    <span className="text-cyber-secondary/70">Registrar</span>
                    <p>{result.email_domain.registrar}</p>
                  </div>
                  <div>
                    <span className="text-cyber-secondary/70">Registration Date</span>
                    <p>{formatDate(result.email_domain.date_registered)}</p>
                  </div>
                  <div>
                    <span className="text-cyber-secondary/70">Expiration Date</span>
                    <p>{formatDate(result.email_domain.date_expires)}</p>
                  </div>
                </div>
              </div>

              {/* Sender Info */}
              <div className="cyber-card">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-cyber-accent" />
                  <h3 className="text-lg font-bold">Sender Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-cyber-secondary/70">Name</span>
                    <p>{result.email_sender.first_name} {result.email_sender.last_name}</p>
                  </div>
                  <div>
                    <span className="text-cyber-secondary/70">Provider</span>
                    <p>{result.email_sender.email_provider_name}</p>
                  </div>
                  <div>
                    <span className="text-cyber-secondary/70">Organization</span>
                    <p>{result.email_sender.organization_name}</p>
                  </div>
                  <div>
                    <span className="text-cyber-secondary/70">Organization Type</span>
                    <p className="capitalize">{result.email_sender.organization_type}</p>
                  </div>
                </div>
              </div>

              {/* Breach History */}
              <div className="cyber-card">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-cyber-primary" />
                  <h3 className="text-lg font-bold">Breach History</h3>
                </div>
                {result.email_breaches.total_breaches > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyber-secondary/70">Total Breaches</span>
                        <span className="text-cyber-primary font-bold">
                          {result.email_breaches.total_breaches}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-cyber-secondary/70">Last Breach</span>
                        <span className="text-cyber-primary">
                          {formatDate(result.email_breaches.date_last_breached)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {result.email_breaches.breached_domains.map((breach, index) => (
                        <div
                          key={index}
                          className="p-3 bg-cyber-black/50 rounded border border-cyber-primary/30"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm">{breach.domain}</span>
                            <span className="text-sm text-cyber-primary">
                              {formatDate(breach.breach_date)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-cyber-accent">
                    No breaches found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
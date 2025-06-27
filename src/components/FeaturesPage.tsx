import React, { useState } from 'react';
import { Search, List, Upload, Download, RefreshCw, Shield, Zap, Globe, BarChart3, Eye, Key, Brain, Network, ArrowRight, CheckCircle, AlertTriangle, Wallet, Database, Clock, TrendingUp } from 'lucide-react';

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState('scanner');

  const features = [
    {
      id: 'scanner',
      title: 'Wallet Scanner',
      icon: Search,
      description: 'Scan individual or bulk cryptocurrency addresses',
      color: 'cyber-accent'
    },
    {
      id: 'bulk',
      title: 'Bulk Operations',
      icon: List,
      description: 'Process thousands of addresses simultaneously',
      color: 'cyber-primary'
    },
    {
      id: 'tools',
      title: 'Developer Tools',
      icon: Globe,
      description: 'Comprehensive toolkit for blockchain development',
      color: 'cyber-secondary'
    },
    {
      id: 'recovery',
      title: 'Wallet Recovery',
      icon: Brain,
      description: 'Advanced AI-powered wallet reconstruction',
      color: 'cyber-purple'
    }
  ];

  const scannerSteps = [
    {
      step: 1,
      title: 'Select Scanner Type',
      description: 'Choose from TRON, Bitcoin, Ethereum, or Litecoin scanners',
      icon: Network
    },
    {
      step: 2,
      title: 'Enter Address',
      description: 'Input a single address or switch to bulk mode for multiple addresses',
      icon: Wallet
    },
    {
      step: 3,
      title: 'Scan & Analyze',
      description: 'Get detailed balance information and token holdings',
      icon: Search
    },
    {
      step: 4,
      title: 'Export Results',
      description: 'Download results in JSON or CSV format for further analysis',
      icon: Download
    }
  ];

  const bulkFeatures = [
    {
      title: 'File Upload',
      description: 'Upload .txt or .csv files with addresses',
      icon: Upload,
      color: 'cyber-accent'
    },
    {
      title: 'Real-time Progress',
      description: 'Monitor scanning progress with live updates',
      icon: BarChart3,
      color: 'cyber-primary'
    },
    {
      title: 'Auto-refresh',
      description: 'Automatically refresh results every 30 seconds',
      icon: RefreshCw,
      color: 'cyber-secondary'
    },
    {
      title: 'Filter Results',
      description: 'Show/hide zero balance wallets',
      icon: Eye,
      color: 'cyber-purple'
    }
  ];

  const toolCategories = [
    {
      category: 'Crypto Tools',
      tools: ['Wallet Generators', 'Mnemonic Generator', 'Key Generator'],
      icon: Key,
      color: 'cyber-accent'
    },
    {
      category: 'Conversion Tools',
      tools: ['Base64 Converter', 'Unit Converter', 'Currency Converter'],
      icon: ArrowRight,
      color: 'cyber-primary'
    },
    {
      category: 'Email Tools',
      tools: ['Email Validator', 'Temporary Email', 'Email Reputation'],
      icon: Globe,
      color: 'cyber-secondary'
    },
    {
      category: 'Network Tools',
      tools: ['Website Checker', 'IP Intelligence'],
      icon: Network,
      color: 'cyber-purple'
    }
  ];

  const recoveryProcess = [
    {
      phase: 'Analysis',
      description: 'AI analyzes partial keys and blockchain patterns',
      progress: 25,
      icon: Brain
    },
    {
      phase: 'Pattern Matching',
      description: 'Advanced algorithms identify potential matches',
      progress: 50,
      icon: Search
    },
    {
      phase: 'Verification',
      description: 'Validate reconstructed keys against blockchain',
      progress: 75,
      icon: CheckCircle
    },
    {
      phase: 'Recovery',
      description: 'Successful wallet access restoration',
      progress: 100,
      icon: Key
    }
  ];

  const renderFlowChart = () => (
    <div className="bg-cyber-black/30 p-6 rounded-lg border border-cyber-secondary/20">
      <h3 className="text-lg font-bold mb-6 text-center">Scanning Workflow</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {scannerSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.step} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-cyber-accent/10 border-2 border-cyber-accent rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-cyber-accent" />
                </div>
                <div className="bg-cyber-accent text-cyber-black text-xs font-bold px-2 py-1 rounded-full mb-2">
                  STEP {step.step}
                </div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-cyber-secondary/70">{step.description}</p>
              </div>
              {index < scannerSteps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-2 w-4 h-0.5 bg-cyber-accent"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBulkDiagram = () => (
    <div className="bg-cyber-black/30 p-6 rounded-lg border border-cyber-secondary/20">
      <h3 className="text-lg font-bold mb-6 text-center">Bulk Processing Architecture</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="w-5 h-5 text-cyber-primary" />
              <h4 className="font-bold">Input Processing</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-primary rounded-full"></div>
                <span>File Upload (.txt, .csv)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-primary rounded-full"></div>
                <span>Address Validation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-primary rounded-full"></div>
                <span>Batch Creation</span>
              </div>
            </div>
          </div>

          <div className="bg-cyber-accent/10 border border-cyber-accent/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-cyber-accent" />
              <h4 className="font-bold">Parallel Processing</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-accent rounded-full"></div>
                <span>10 Concurrent Batches</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-accent rounded-full"></div>
                <span>15 Addresses per Batch</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-accent rounded-full"></div>
                <span>Smart Rate Limiting</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-cyber-secondary/10 border border-cyber-secondary/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-5 h-5 text-cyber-secondary" />
              <h4 className="font-bold">Real-time Results</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-secondary rounded-full"></div>
                <span>Live Progress Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-secondary rounded-full"></div>
                <span>Balance Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-secondary rounded-full"></div>
                <span>Token Analysis</span>
              </div>
            </div>
          </div>

          <div className="bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Download className="w-5 h-5 text-cyber-purple" />
              <h4 className="font-bold">Export Options</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-purple rounded-full"></div>
                <span>JSON Format</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-purple rounded-full"></div>
                <span>CSV Format</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-purple rounded-full"></div>
                <span>Filtered Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecoveryChart = () => (
    <div className="bg-cyber-black/30 p-6 rounded-lg border border-cyber-secondary/20">
      <h3 className="text-lg font-bold mb-6 text-center">Recovery Process Timeline</h3>
      <div className="space-y-6">
        {recoveryProcess.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <div key={phase.phase} className="relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyber-primary/10 border-2 border-cyber-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-cyber-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{phase.phase}</h4>
                    <span className="text-sm text-cyber-primary">{phase.progress}%</span>
                  </div>
                  <p className="text-sm text-cyber-secondary/70 mb-2">{phase.description}</p>
                  <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyber-primary transition-all duration-1000"
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {index < recoveryProcess.length - 1 && (
                <div className="ml-6 w-0.5 h-6 bg-cyber-primary/30 mt-2"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'scanner':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Wallet Scanner</h2>
              <p className="text-cyber-secondary/70 max-w-2xl mx-auto">
                Scan cryptocurrency addresses across multiple blockchains with real-time balance detection and token analysis.
              </p>
            </div>

            {renderFlowChart()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="cyber-card">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-6 h-6 text-cyber-accent" />
                  <h3 className="text-xl font-bold">Single Address Scan</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-cyber-black/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-cyber-accent rounded-full"></div>
                      <span className="font-medium">Instant Results</span>
                    </div>
                    <p className="text-sm text-cyber-secondary/70">Get immediate balance and token information</p>
                  </div>
                  <div className="bg-cyber-black/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-cyber-accent rounded-full"></div>
                      <span className="font-medium">Detailed Analysis</span>
                    </div>
                    <p className="text-sm text-cyber-secondary/70">View TRC20 tokens, transaction history, and USD values</p>
                  </div>
                </div>
              </div>

              <div className="cyber-card">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-cyber-primary" />
                  <h3 className="text-xl font-bold">Supported Networks</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
                    <span>TRON (TRX)</span>
                    <CheckCircle className="w-5 h-5 text-cyber-accent" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
                    <span>Bitcoin (BTC)</span>
                    <Key className="w-5 h-5 text-cyber-primary" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
                    <span>Ethereum (ETH)</span>
                    <Key className="w-5 h-5 text-cyber-primary" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
                    <span>Litecoin (LTC)</span>
                    <Key className="w-5 h-5 text-cyber-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bulk':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Bulk Operations</h2>
              <p className="text-cyber-secondary/70 max-w-2xl mx-auto">
                Process thousands of addresses simultaneously with advanced parallel processing and real-time monitoring.
              </p>
            </div>

            {renderBulkDiagram()}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bulkFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="cyber-card text-center">
                    <div className={`w-12 h-12 bg-${feature.color}/10 border border-${feature.color}/30 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-6 h-6 text-${feature.color}`} />
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-cyber-secondary/70">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="cyber-card">
              <h3 className="text-xl font-bold mb-6">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyber-accent mb-2">3,000+</div>
                  <p className="text-sm text-cyber-secondary/70">Addresses per minute</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyber-primary mb-2">10</div>
                  <p className="text-sm text-cyber-secondary/70">Concurrent batches</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyber-secondary mb-2">99.9%</div>
                  <p className="text-sm text-cyber-secondary/70">Success rate</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tools':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Developer Tools</h2>
              <p className="text-cyber-secondary/70 max-w-2xl mx-auto">
                Comprehensive toolkit for blockchain development, analysis, and utility operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {toolCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="cyber-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 bg-${category.color}/10 rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${category.color}`} />
                      </div>
                      <h3 className="text-xl font-bold">{category.category}</h3>
                    </div>
                    <div className="space-y-2">
                      {category.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="flex items-center gap-2 p-2 bg-cyber-black/50 rounded">
                          <CheckCircle className={`w-4 h-4 text-${category.color}`} />
                          <span className="text-sm">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cyber-card">
              <h3 className="text-xl font-bold mb-6">Tool Categories Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-cyber-black/30 rounded-lg">
                  <Key className="w-8 h-8 text-cyber-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyber-accent">4</div>
                  <p className="text-sm text-cyber-secondary/70">Crypto Tools</p>
                </div>
                <div className="text-center p-4 bg-cyber-black/30 rounded-lg">
                  <ArrowRight className="w-8 h-8 text-cyber-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyber-primary">3</div>
                  <p className="text-sm text-cyber-secondary/70">Converters</p>
                </div>
                <div className="text-center p-4 bg-cyber-black/30 rounded-lg">
                  <Globe className="w-8 h-8 text-cyber-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyber-secondary">4</div>
                  <p className="text-sm text-cyber-secondary/70">Email Tools</p>
                </div>
                <div className="text-center p-4 bg-cyber-black/30 rounded-lg">
                  <Network className="w-8 h-8 text-cyber-purple mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyber-purple">2</div>
                  <p className="text-sm text-cyber-secondary/70">Network Tools</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'recovery':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Wallet Recovery</h2>
              <p className="text-cyber-secondary/70 max-w-2xl mx-auto">
                Advanced AI-powered wallet reconstruction service for lost or partially damaged private keys and seed phrases.
              </p>
            </div>

            {renderRecoveryChart()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="cyber-card">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-cyber-primary" />
                  <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-cyber-black/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-cyber-accent" />
                    <span className="text-sm">Pattern recognition algorithms</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-cyber-black/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-cyber-accent" />
                    <span className="text-sm">Blockchain forensics</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-cyber-black/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-cyber-accent" />
                    <span className="text-sm">Entropy prediction</span>
                  </div>
                </div>
              </div>

              <div className="cyber-card">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-cyber-accent" />
                  <h3 className="text-xl font-bold">Success Rates</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
                    <span className="text-sm">Partial seed phrases</span>
                    <span className="text-cyber-accent font-bold">85%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
                    <span className="text-sm">Damaged private keys</span>
                    <span className="text-cyber-accent font-bold">70%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cyber-black/50 rounded-lg">
                    <span className="text-sm">Corrupted wallets</span>
                    <span className="text-cyber-accent font-bold">60%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cyber-card">
              <h3 className="text-xl font-bold mb-6">Service Tiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-cyber-black/30 border border-cyber-secondary/30 rounded-lg">
                  <h4 className="text-lg font-bold mb-4">Standard Recovery</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyber-secondary" />
                      <span className="text-sm">14-21 days processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyber-secondary" />
                      <span className="text-sm">Money-back guarantee</span>
                    </div>
                    <div className="text-2xl font-bold text-cyber-secondary">$1,200</div>
                  </div>
                </div>
                <div className="p-6 bg-cyber-black/30 border border-cyber-primary/30 rounded-lg">
                  <h4 className="text-lg font-bold mb-4">Priority Recovery</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyber-primary" />
                      <span className="text-sm">7-14 days processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyber-primary" />
                      <span className="text-sm">24/7 dedicated support</span>
                    </div>
                    <div className="text-2xl font-bold text-cyber-primary">$3,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Features & How to Use</h1>
          <p className="text-cyber-secondary/70 max-w-3xl mx-auto">
            Comprehensive guide to TXNscanner's powerful blockchain analysis and wallet management features.
            Learn how to maximize your productivity with our advanced tools.
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-all duration-300 ${
                  activeFeature === feature.id
                    ? `bg-${feature.color}/10 border-${feature.color} text-${feature.color}`
                    : 'border-cyber-secondary/30 hover:border-cyber-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{feature.title}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Content */}
        <div className="max-w-6xl mx-auto">
          {renderFeatureContent()}
        </div>

        {/* Getting Started Section */}
        <div className="mt-16 cyber-card">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <p className="text-cyber-secondary/70">
              New to TXNscanner? Follow these simple steps to begin your blockchain analysis journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyber-accent/10 border-2 border-cyber-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyber-accent">1</span>
              </div>
              <h3 className="font-bold mb-2">Choose Your Scanner</h3>
              <p className="text-sm text-cyber-secondary/70">
                Select from TRON, Bitcoin, Ethereum, or Litecoin scanners based on your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyber-primary/10 border-2 border-cyber-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyber-primary">2</span>
              </div>
              <h3 className="font-bold mb-2">Input Addresses</h3>
              <p className="text-sm text-cyber-secondary/70">
                Enter single addresses or upload bulk files for comprehensive analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyber-secondary/10 border-2 border-cyber-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyber-secondary">3</span>
              </div>
              <h3 className="font-bold mb-2">Analyze Results</h3>
              <p className="text-sm text-cyber-secondary/70">
                Review detailed balance information, token holdings, and export data for further analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
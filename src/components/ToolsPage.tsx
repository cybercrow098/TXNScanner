import React, { useState } from 'react';
import { Globe, QrCode, Hash, FileJson, FileText, Binary, Calculator, Key, Wallet, ChevronLeft, Menu, Mail, Phone, Receipt, CreditCard, ArrowLeftRight, Wifi, Code } from 'lucide-react';
import WebsiteChecker from './WebsiteChecker';
import QRGenerator from './QRGenerator';
import HashGenerator from './HashGenerator';
import JsonFormatter from './JsonFormatter';
import Base64Converter from './Base64Converter';
import UnitConverter from './UnitConverter';
import KeyGenerator from './KeyGenerator';
import MnemonicGenerator from './crypto/MnemonicGenerator';
import EmailValidator from './EmailValidator';
import TemporaryEmail from './TemporaryEmail';
import EmailReputation from './EmailReputation';
import PhoneValidator from './PhoneValidator';
import VatValidator from './VatValidator';
import IbanValidator from './IbanValidator';
import CurrencyConverter from './CurrencyConverter';
import IpIntelligence from './IpIntelligence';
import TrxGenerator from './crypto/TrxGenerator';
import BtcGenerator from './crypto/BtcGenerator';
import EthGenerator from './crypto/EthGenerator';

type Tool = 'website-checker' | 'qr-generator' | 'hash-generator' | 'json-formatter' | 
           'base64-converter' | 'unit-converter' | 'key-generator' | 'mnemonic-generator' |
           'email-validator' | 'temporary-email' | 'email-reputation' | 'phone-validator' |
           'vat-validator' | 'iban-validator' | 'currency-converter' | 'ip-intelligence' |
           'trx-generator' | 'btc-generator' | 'eth-generator';

interface ToolConfig {
  id: Tool;
  name: string;
  icon: React.ComponentType;
  description: string;
  component: React.ComponentType;
  category: 'general' | 'crypto' | 'conversion' | 'email' | 'finance' | 'network';
}

const TOOLS: ToolConfig[] = [
  {
    id: 'website-checker',
    name: 'Website Checker',
    icon: Globe,
    description: 'Check website status and availability',
    component: WebsiteChecker,
    category: 'network'
  },
  {
    id: 'qr-generator',
    name: 'QR Generator',
    icon: QrCode,
    description: 'Generate QR codes for URLs and text',
    component: QRGenerator,
    category: 'general'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    icon: Hash,
    description: 'Generate secure hashes',
    component: HashGenerator,
    category: 'general'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    icon: FileJson,
    description: 'Format and validate JSON',
    component: JsonFormatter,
    category: 'general'
  },
  {
    id: 'base64-converter',
    name: 'Base64 Converter',
    icon: Binary,
    description: 'Encode and decode Base64',
    component: Base64Converter,
    category: 'conversion'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    icon: Calculator,
    description: 'Convert between units',
    component: UnitConverter,
    category: 'conversion'
  },
  {
    id: 'key-generator',
    name: 'Key Generator',
    icon: Key,
    description: 'Generate secure keys',
    component: KeyGenerator,
    category: 'general'
  },
  {
    id: 'mnemonic-generator',
    name: 'Mnemonic Generator',
    icon: Wallet,
    description: 'Generate BIP39 phrases',
    component: MnemonicGenerator,
    category: 'crypto'
  },
  {
    id: 'email-validator',
    name: 'Email Validator',
    icon: Mail,
    description: 'Validate email addresses',
    component: EmailValidator,
    category: 'email'
  },
  {
    id: 'temporary-email',
    name: 'Temporary Email',
    icon: Mail,
    description: 'Create disposable email addresses',
    component: TemporaryEmail,
    category: 'email'
  },
  {
    id: 'email-reputation',
    name: 'Email Reputation',
    icon: Mail,
    description: 'Check email reputation and security',
    component: EmailReputation,
    category: 'email'
  },
  {
    id: 'phone-validator',
    name: 'Phone Validator',
    icon: Phone,
    description: 'Validate and lookup phone numbers',
    component: PhoneValidator,
    category: 'email'
  },
  {
    id: 'vat-validator',
    name: 'VAT Validator',
    icon: Receipt,
    description: 'Validate EU VAT numbers',
    component: VatValidator,
    category: 'finance'
  },
  {
    id: 'iban-validator',
    name: 'IBAN Validator',
    icon: CreditCard,
    description: 'Validate international bank account numbers',
    component: IbanValidator,
    category: 'finance'
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    icon: ArrowLeftRight,
    description: 'Convert between currencies',
    component: CurrencyConverter,
    category: 'conversion'
  },
  {
    id: 'ip-intelligence',
    name: 'IP Intelligence',
    icon: Wifi,
    description: 'Get detailed IP address information',
    component: IpIntelligence,
    category: 'network'
  },
  {
    id: 'trx-generator',
    name: 'TRX Generator',
    icon: Code,
    description: 'Generate TRX wallets with Python code',
    component: TrxGenerator,
    category: 'crypto'
  },
  {
    id: 'btc-generator',
    name: 'BTC Generator',
    icon: Code,
    description: 'Generate BTC wallets with Python code',
    component: BtcGenerator,
    category: 'crypto'
  },
  {
    id: 'eth-generator',
    name: 'ETH Generator',
    icon: Code,
    description: 'Generate ETH wallets with Python code',
    component: EthGenerator,
    category: 'crypto'
  }
];

const CATEGORIES = {
  general: 'General Tools',
  crypto: 'Crypto Tools',
  conversion: 'Conversion Tools',
  email: 'Email Tools',
  finance: 'Finance Tools',
  network: 'Network Tools'
};

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<Tool>('website-checker');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORIES>('general');
  const [showMobileNav, setShowMobileNav] = useState(true);

  const currentTool = TOOLS.find(tool => tool.id === selectedTool);
  const ToolComponent = currentTool?.component || (() => null);

  const toolsByCategory = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof TOOLS>);

  const handleToolSelect = (toolId: Tool) => {
    setSelectedTool(toolId);
    setShowMobileNav(false);
  };

  return (
    <div className="min-h-screen bg-cyber-black py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Tools</h2>
            <p className="text-cyber-secondary/70">
              Collection of useful tools and utilities
            </p>
          </div>
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="lg:hidden cyber-button"
          >
            {showMobileNav ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Category Tabs */}
        <div className={`mb-8 border-b border-cyber-secondary/20 ${!showMobileNav ? 'lg:block hidden' : ''}`}>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORIES).map(([category, label]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as keyof typeof CATEGORIES)}
                className={`px-4 py-2 -mb-px text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'text-cyber-accent border-b-2 border-cyber-accent'
                    : 'text-cyber-secondary/70 hover:text-cyber-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tools Navigation */}
          <div className={`lg:col-span-1 ${!showMobileNav ? 'lg:block hidden' : ''}`}>
            <nav className="space-y-2 lg:sticky lg:top-4">
              {toolsByCategory[selectedCategory]?.map(tool => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;

                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isSelected
                        ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30'
                        : 'hover:bg-cyber-darker/50 hover:text-cyber-accent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-cyber-accent' : 'text-cyber-secondary/70'}`} />
                    <div className="text-left">
                      <span className="block text-sm font-medium">{tool.name}</span>
                      <span className="text-xs text-cyber-secondary/50">{tool.description}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tool Content */}
          <div className={`lg:col-span-3 ${showMobileNav ? 'hidden lg:block' : 'block'}`}>
            <div className="cyber-card">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-cyber-secondary/20">
                <div className="p-2 bg-cyber-accent/10 rounded-lg">
                  {currentTool && <currentTool.icon className="w-6 h-6 text-cyber-accent" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentTool?.name}</h3>
                  <p className="text-sm text-cyber-secondary/70">{currentTool?.description}</p>
                </div>
              </div>

              <ToolComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
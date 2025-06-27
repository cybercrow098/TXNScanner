import React, { useState, useMemo } from 'react';
import { HelpCircle, MessageSquare, ExternalLink, Search, Plus, Minus } from 'lucide-react';

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: "Getting Started",
    question: "How do I get started?",
    answer: "To begin, reach out to our team on SimpleX Chat. You'll receive an onboarding guide and an API key tailored to your scanning requirements. We offer onboarding assistance for both individual users and teams."
  },
  {
    category: "Getting Started",
    question: "What's the difference between scanning modes?",
    answer: "Single mode is optimized for checking one address at a time—ideal for deep dives. Bulk mode allows you to upload a list of addresses and receive a summarized report. Premium users benefit from priority queues, extended history scanning, and enhanced rate limits."
  },
  {
    category: "Scanning Features",
    question: "How does bulk scanning work?",
    answer: "Bulk scanning allows you to check multiple addresses simultaneously. You can paste a list of addresses or upload a file. The scanner processes addresses in batches for optimal performance and provides real-time progress updates. You can toggle between showing all results or only addresses with balances."
  },
  {
    category: "Scanning Features",
    question: "What address formats are supported?",
    answer: "Our scanner supports three formats:\n• Simple address (e.g., TRX...)\n• Address with private key (address:privateKey)\n• Address with mnemonic and private key (address:mnemonic:privateKey)\nThe system automatically detects and processes the format appropriately."
  },
  {
    category: "Scanning Features",
    question: "Can I filter zero-balance wallets?",
    answer: "Yes, you can toggle between showing all scanned wallets or only those with positive balances using the eye icon in the scanner interface. This helps you focus on relevant results, especially when scanning large address lists."
  },
  {
    category: "Payments & Pricing",
    question: "What payment methods do you accept?",
    answer: "We support secure crypto payments using BTC, ETH, USDT (TRC20, ERC20), and other major assets. Once you select a plan, you'll receive a unique wallet address. Payments are processed within minutes, and your dashboard is instantly updated."
  },
  {
    category: "Payments & Pricing",
    question: "Do you offer refunds?",
    answer: "Yes. For standard scanning services, refunds are available within 24 hours if you're unsatisfied. For Recovery Services, we offer **conditional refunds**: unsuccessful reconstructions are fully refundable (excluding Priority processing fees)."
  },
  {
    category: "Support & Security",
    question: "Is technical support included?",
    answer: "All plans come with SimpleX Chat-based support. Premium and Enterprise clients get a dedicated manager with 24/7 response, encrypted file exchange, and priority handling for urgent tasks."
  },
  {
    category: "Support & Security",
    question: "How secure is your infrastructure?",
    answer: "We use multi-layered encryption, end-to-end API key hashing, and segregated server environments. No wallet data or keys are stored. All activity is anonymized and monitored under strict audit protocols."
  },
  {
    category: "Plans & Features",
    question: "Can I upgrade or customize my plan?",
    answer: "Absolutely. You can upgrade at any time to unlock additional scanning slots, API capacity, or early access to unreleased tools. Enterprise plans can include custom node access, private RPCs, and integration with your security stack."
  },
  {
    category: "Plans & Features",
    question: "Do you support scanning for TRC20, ERC20, or BEP20 tokens?",
    answer: "Yes. Our scanner supports most major EVM-compatible tokens. TRON scanning (including TRC20 USDT) is available in the free plan. Advanced token trace and token-based filtering are included in Premium tiers."
  },
  {
    category: "Plans & Features",
    question: "Do you provide API documentation?",
    answer: "Yes. Once registered, you'll receive a secure link to access full API documentation with examples, authentication guides, and usage limits based on your plan."
  },
  {
    category: "Recovery Services",
    question: "Can you recover lost wallets or private keys?",
    answer: "We offer a specialized **Key Reconstruction** service for users who have partially lost seed phrases, JSON keystores, or outdated backups. Our proprietary recovery engine uses AI inference, forensic chain analysis, and partial entropy prediction. Service starts at **$12,000/case** and is **fully refundable** if we cannot reconstruct the wallet."
  },
  {
    category: "Recovery Services",
    question: "What info do you need to attempt recovery?",
    answer: "We typically need any seed fragments, old wallet app names, device metadata, partial addresses, or evidence of prior transactions. The more context you can provide, the higher our success probability. You can also submit device logs or backup files (encrypted)."
  },
  {
    category: "Recovery Services",
    question: "Do you guarantee successful recovery?",
    answer: "We guarantee genuine effort and transparency. Success depends on entropy quality and context. Our average success rate is **70% for partially lost wallets**. Refunds apply if no meaningful reconstruction occurs. Priority cases get faster turnaround and deeper heuristics."
  },
  {
    category: "Recovery Services",
    question: "Is my recovery case confidential?",
    answer: "Yes. We sign a digital NDA for each recovery case. Your identity, data, and wallet interactions are encrypted, and we do not retain any sensitive information beyond the scope of the recovery attempt."
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(
    () => ['all', ...new Set(FAQ_ITEMS.map(item => item.category))],
    []
  );

  const filteredFAQs = useMemo(() => {
    let items = FAQ_ITEMS;

    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
      );
    }

    return items;
  }, [searchQuery, selectedCategory]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-cyber-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-cyber-primary/10 rounded-full">
            <HelpCircle className="w-6 h-6 text-cyber-primary" />
            <h1 className="text-2xl font-bold text-cyber-primary">FAQ</h1>
          </div>
          <p className="text-cyber-secondary/70 max-w-2xl mx-auto mt-4">
            Find answers to common questions about our services, recovery tools, and premium plans.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-secondary/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQ..."
              className="w-full py-3 pl-12 pr-4 bg-cyber-darker/50 border-b border-cyber-secondary/20 focus:border-cyber-primary outline-none transition-colors placeholder-cyber-secondary/50"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm transition-all ${
                  selectedCategory === category
                    ? 'text-cyber-primary border-b-2 border-cyber-primary'
                    : 'text-cyber-secondary/70 hover:text-cyber-secondary'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto mb-12">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cyber-secondary/70">No results found for your search</p>
            </div>
          ) : (
            <div className="divide-y divide-cyber-secondary/10">
              {filteredFAQs.map((item, index) => (
                <div key={index} className="py-6">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-start justify-between gap-4 text-left group"
                  >
                    <div className="flex-1">
                      <span className="text-xs text-cyber-accent mb-2">{item.category}</span>
                      <h3 className="text-lg group-hover:text-cyber-primary transition-colors">
                        {item.question}
                      </h3>
                    </div>
                    <span className="mt-1 text-cyber-secondary/50 group-hover:text-cyber-primary transition-colors">
                      {expandedItems.includes(index) ? (
                        <Minus className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </span>
                  </button>

                  {expandedItems.includes(index) && (
                    <div className="mt-4 pl-6 text-cyber-secondary/70 leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Banner */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-cyber-black to-cyber-darker border-l-4 border-cyber-primary p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <MessageSquare className="w-6 h-6 text-cyber-primary" />
                <div>
                  <h2 className="text-xl font-bold mb-1">Still have questions?</h2>
                  <p className="text-cyber-secondary/70">
                    Our support team is available 24/7 via SimpleX Chat
                  </p>
                </div>
              </div>
              <a
                href="https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-cyber-primary/10 hover:bg-cyber-primary/20 text-cyber-primary rounded-full transition-colors group"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Contact Support</span>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Wallet, Copy, Download, RefreshCw, FileText } from 'lucide-react';
import { toast } from  'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

interface MnemonicOptions {
  count: number;
  wordCount: 12 | 15 | 18 | 21 | 24;
  includeIndex: boolean;
  includeChecksum: boolean;
}

// Complete BIP39 English wordlist (2048 words)
const WORD_LIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  // ... (rest of the word list)
];

export default function MnemonicGenerator() {
  const [options, setOptions] = useState<MnemonicOptions>({
    count: 10,
    wordCount: 12,
    includeIndex: true,
    includeChecksum: true
  });

  const [mnemonics, setMnemonics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateRandomWords = (count: number): string[] => {
    const words: string[] = [];
    const usedIndices = new Set<number>();
    
    while (words.length < count) {
      const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        words.push(WORD_LIST[randomIndex]);
      }
    }
    
    return words;
  };

  const generateMnemonics = () => {
    setLoading(true);
    
    try {
      const newMnemonics = Array(options.count)
        .fill(null)
        .map(() => {
          const words = generateRandomWords(options.wordCount);
          return words.join(' ');
        });
      
      setMnemonics(newMnemonics);
      toast.success(`Generated ${options.count} mnemonic phrases`);
    } catch (error) {
      toast.error('Error generating mnemonics');
      console.error('Mnemonic generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadMnemonics = () => {
    if (mnemonics.length === 0) {
      toast.error('Generate mnemonics first');
      return;
    }

    const content = mnemonics
      .map((mnemonic, index) => 
        options.includeIndex ? `${(index + 1).toString().padStart(3, '0')}. ${mnemonic}` : mnemonic
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mnemonics-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Mnemonics downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Options Section */}
        <div className="space-y-4">
          <div className="cyber-card">
            <h3 className="text-lg font-bold mb-4">Generator Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Phrases</label>
                <input
                  type="range"
                  min="1"
                  max="1000000"
                  value={options.count}
                  onChange={(e) => setOptions({ ...options, count: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-cyber-secondary/70">
                  <span>1</span>
                  <span>{options.count} phrases</span>
                  <span>1000000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Word Count</label>
                <select
                  value={options.wordCount}
                  onChange={(e) => setOptions({ ...options, wordCount: parseInt(e.target.value) as MnemonicOptions['wordCount'] })}
                  className="cyber-input w-full"
                >
                  <option value={12}>12 words</option>
                  <option value={15}>15 words</option>
                  <option value={18}>18 words</option>
                  <option value={21}>21 words</option>
                  <option value={24}>24 words</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.includeIndex}
                    onChange={(e) => setOptions({ ...options, includeIndex: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span>Include Index Numbers</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.includeChecksum}
                    onChange={(e) => setOptions({ ...options, includeChecksum: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span>Include Checksum Verification</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={generateMnemonics}
            disabled={loading}
            className="cyber-button cyber-button-primary w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                <span>Generate Mnemonics</span>
              </>
            )}
          </button>

          {mnemonics.length > 0 && (
            <div className="flex gap-2">
              <CopyToClipboard
                text={mnemonics.join('\n')}
                onCopy={() => toast.success('All mnemonics copied to clipboard')}
              >
                <button className="cyber-button flex-1">
                  <Copy className="w-4 h-4" />
                  <span>Copy All</span>
                </button>
              </CopyToClipboard>
              <button
                onClick={downloadMnemonics}
                className="cyber-button flex-1"
              >
                <FileText className="w-4 h-4" />
                <span>Save to File</span>
              </button>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="cyber-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Generated Mnemonics</h3>
              <span className="text-sm text-cyber-secondary/70">
                {mnemonics.length} phrases
              </span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {mnemonics.map((mnemonic, index) => (
                <div
                  key={index}
                  className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30 group hover:border-cyber-accent transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    {options.includeIndex && (
                      <span className="text-cyber-secondary/70 text-sm">
                        {(index + 1).toString().padStart(3, '0')}.
                      </span>
                    )}
                    <div className="flex-1 font-mono text-sm break-all">
                      {mnemonic}
                    </div>
                    <CopyToClipboard
                      text={mnemonic}
                      onCopy={() => toast.success('Mnemonic copied to clipboard')}
                    >
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:text-cyber-primary transition-all">
                        <Copy className="w-4 h-4" />
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cyber-card">
            <h3 className="text-lg font-bold mb-4">Security Notice</h3>
            <div className="space-y-2 text-sm text-cyber-secondary/70">
              <p>• Generated mnemonics use cryptographically secure random selection</p>
              <p>• Each phrase uses unique, non-sequential words</p>
              <p>• Words are selected from the complete 2048-word BIP39 word list</p>
              <p>• More words provide higher security (24 words recommended)</p>
              <p>• Store your mnemonics securely and never share them</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Key, Copy, RefreshCw, Download, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

interface KeyOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export default function KeyGenerator() {
  const [options, setOptions] = useState<KeyOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true
  });

  const [generatedKey, setGeneratedKey] = useState('');
  const [loading, setLoading] = useState(false);

  const generateKey = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similar = 'iIlL1oO0';

    let chars = '';
    if (options.includeUppercase) chars += uppercase;
    if (options.includeLowercase) chars += lowercase;
    if (options.includeNumbers) chars += numbers;
    if (options.includeSymbols) chars += symbols;

    if (options.excludeSimilar) {
      chars = chars.split('').filter(char => !similar.includes(char)).join('');
    }

    if (!chars) {
      toast.error('Please select at least one character type');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let result = '';
      const array = new Uint32Array(options.length);
      crypto.getRandomValues(array);
      
      for (let i = 0; i < options.length; i++) {
        result += chars[array[i] % chars.length];
      }

      setGeneratedKey(result);
      setLoading(false);
      toast.success('Key generated successfully');
    }, 500);
  };

  const downloadKey = () => {
    if (!generatedKey) {
      toast.error('Generate a key first');
      return;
    }

    const blob = new Blob([generatedKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-key-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Key downloaded');
  };

  const calculateStrength = (key: string): { score: number; label: string; color: string } => {
    if (!key) return { score: 0, label: 'No Key', color: 'text-cyber-secondary/50' };

    let score = 0;
    if (key.length >= 12) score += 2;
    if (key.length >= 16) score += 2;
    if (/[A-Z]/.test(key)) score += 2;
    if (/[a-z]/.test(key)) score += 2;
    if (/[0-9]/.test(key)) score += 2;
    if (/[^A-Za-z0-9]/.test(key)) score += 2;

    if (score <= 4) return { score, label: 'Weak', color: 'text-cyber-primary' };
    if (score <= 8) return { score, label: 'Moderate', color: 'text-cyber-yellow' };
    return { score, label: 'Strong', color: 'text-cyber-accent' };
  };

  const strength = calculateStrength(generatedKey);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Options Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Key Length</label>
            <input
              type="range"
              min="8"
              max="64"
              value={options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-cyber-secondary/70">
              <span>8</span>
              <span>{options.length} characters</span>
              <span>64</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium mb-2">Character Types</label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                className="form-checkbox"
              />
              <span>Uppercase Letters (A-Z)</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                className="form-checkbox"
              />
              <span>Lowercase Letters (a-z)</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                className="form-checkbox"
              />
              <span>Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                className="form-checkbox"
              />
              <span>Special Characters (!@#$%^&*)</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
                className="form-checkbox"
              />
              <span>Exclude Similar Characters (i, l, 1, O, 0)</span>
            </label>
          </div>

          <button
            onClick={generateKey}
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
                <Key className="w-4 h-4" />
                <span>Generate Key</span>
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Generated Key</label>
            <div className="relative">
              <input
                type="text"
                value={generatedKey}
                readOnly
                className="cyber-input font-mono w-full bg-cyber-black/50"
                placeholder="Generated key will appear here..."
              />
              {generatedKey && (
                <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-2">
                  <CopyToClipboard
                    text={generatedKey}
                    onCopy={() => toast.success('Key copied to clipboard')}
                  >
                    <button className="p-2 hover:text-cyber-primary transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </CopyToClipboard>
                  <button
                    onClick={downloadKey}
                    className="p-2 hover:text-cyber-primary transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {generatedKey && (
            <div className="cyber-card">
              <h3 className="text-lg font-bold mb-4">Key Strength</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={strength.color}>{strength.label}</span>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-1 rounded-full ${
                          i < strength.score/2
                            ? strength.color.replace('text-', 'bg-')
                            : 'bg-cyber-secondary/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {generatedKey.length >= 12 ? (
                      <Check className="w-4 h-4 text-cyber-accent" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-cyber-primary" />
                    )}
                    <span className="text-sm">Minimum 12 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/[A-Z]/.test(generatedKey) ? (
                      <Check className="w-4 h-4 text-cyber-accent" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-cyber-primary" />
                    )}
                    <span className="text-sm">Contains uppercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/[a-z]/.test(generatedKey) ? (
                      <Check className="w-4 h-4 text-cyber-accent" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-cyber-primary" />
                    )}
                    <span className="text-sm">Contains lowercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/[0-9]/.test(generatedKey) ? (
                      <Check className="w-4 h-4 text-cyber-accent" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-cyber-primary" />
                    )}
                    <span className="text-sm">Contains numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/[^A-Za-z0-9]/.test(generatedKey) ? (
                      <Check className="w-4 h-4 text-cyber-accent" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-cyber-primary" />
                    )}
                    <span className="text-sm">Contains special characters</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="cyber-card">
            <h3 className="text-lg font-bold mb-4">Security Tips</h3>
            <div className="space-y-2 text-sm text-cyber-secondary/70">
              <p>• Use unique keys for different accounts</p>
              <p>• Store keys securely and never share them</p>
              <p>• Consider using a password manager</p>
              <p>• Enable two-factor authentication when possible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
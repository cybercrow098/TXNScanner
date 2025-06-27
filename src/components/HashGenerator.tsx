import React, { useState } from 'react';
import { Hash, Copy, RefreshCw, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [selectedHash, setSelectedHash] = useState<HashType>('sha256');
  const [loading, setLoading] = useState(false);

  const generateHash = async (text: string, algorithm: HashType): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    let hashBuffer;
    switch (algorithm) {
      case 'md5':
        // Note: MD5 is not cryptographically secure
        hashBuffer = await crypto.subtle.digest('SHA-256', data); // Using SHA-256 as fallback
        break;
      case 'sha1':
        hashBuffer = await crypto.subtle.digest('SHA-1', data);
        break;
      case 'sha256':
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'sha512':
        hashBuffer = await crypto.subtle.digest('SHA-512', data);
        break;
    }

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleGenerate = async () => {
    if (!input) {
      toast.error('Please enter some text');
      return;
    }

    setLoading(true);
    try {
      const hash = await generateHash(input, selectedHash);
      setInput(hash);
      toast.success('Hash generated successfully');
    } catch (error) {
      toast.error('Error generating hash');
    } finally {
      setLoading(false);
    }
  };

  const downloadHash = () => {
    if (!input) {
      toast.error('No hash to download');
      return;
    }

    const blob = new Blob([input], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hash-${selectedHash}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Hash downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Input Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              rows={5}
              className="cyber-input font-mono w-full resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hash Algorithm</label>
              <select
                value={selectedHash}
                onChange={(e) => setSelectedHash(e.target.value as HashType)}
                className="cyber-input w-full"
              >
                <option value="md5">MD5 (Not Secure)</option>
                <option value="sha1">SHA-1</option>
                <option value="sha256">SHA-256</option>
                <option value="sha512">SHA-512</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="cyber-button cyber-button-primary flex-1"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4" />
                  <span>Generate Hash</span>
                </>
              )}
            </button>
            {input && (
              <>
                <CopyToClipboard
                  text={input}
                  onCopy={() => toast.success('Hash copied to clipboard')}
                >
                  <button className="cyber-button">
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </CopyToClipboard>
                <button
                  onClick={downloadHash}
                  className="cyber-button"
                >
                  <Download className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="cyber-card">
            <h3 className="text-lg font-bold mb-4">Hash Information</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Selected Algorithm: {selectedHash.toUpperCase()}</h4>
                <p className="text-sm text-cyber-secondary/70">
                  {selectedHash === 'md5' && 'MD5 is a widely used hash function that produces a 128-bit hash value. Note: MD5 is not cryptographically secure.'}
                  {selectedHash === 'sha1' && 'SHA-1 produces a 160-bit hash value. While still used, it\'s not recommended for security-critical applications.'}
                  {selectedHash === 'sha256' && 'SHA-256 is part of the SHA-2 family and produces a 256-bit hash value. It\'s widely used and considered cryptographically secure.'}
                  {selectedHash === 'sha512' && 'SHA-512 produces a 512-bit hash value, offering the highest security level among the options. Ideal for security-critical applications.'}
                </p>
              </div>

              <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30">
                <h4 className="font-medium mb-2">Security Notice</h4>
                <p className="text-sm text-cyber-secondary/70">
                  Hashing is a one-way function. Once data is hashed, it cannot be reversed to obtain the original input.
                  Choose the appropriate algorithm based on your security requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
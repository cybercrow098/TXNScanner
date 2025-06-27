import React, { useState } from 'react';
import { Binary, Copy, Download, Upload, RefreshCw, Image } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [loading, setLoading] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleConvert = () => {
    if (!input) {
      toast.error('Please enter text to convert');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'encode') {
        const encoded = btoa(input);
        setOutput(encoded);
        setIsImage(false);
      } else {
        const decoded = atob(input);
        setOutput(decoded);
        setIsImage(decoded.startsWith('data:image'));
      }
      toast.success(`Base64 ${mode}d successfully`);
    } catch (error) {
      toast.error(`Invalid Base64 ${mode === 'encode' ? 'text' : 'string'}`);
      setOutput('');
      setIsImage(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    if (mode === 'encode') {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setInput(base64.split(',')[1]);
        setIsImage(file.type.startsWith('image/'));
        toast.success('File loaded successfully');
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
        toast.success('File loaded successfully');
      };
      reader.readAsText(file);
    }
  };

  const downloadOutput = () => {
    if (!output) {
      toast.error('No data to download');
      return;
    }

    let content: string;
    let filename: string;
    let type: string;

    if (mode === 'encode') {
      content = output;
      filename = `encoded-${new Date().getTime()}.txt`;
      type = 'text/plain';
    } else {
      content = isImage ? `data:image/png;base64,${input}` : output;
      filename = isImage ? `decoded-${new Date().getTime()}.png` : `decoded-${new Date().getTime()}.txt`;
      type = isImage ? 'image/png' : 'text/plain';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('File downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              rows={10}
              className="cyber-input font-mono w-full resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="cyber-card flex-1 p-3 bg-cyber-black/50">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'encode' | 'decode')}
                className="w-full bg-transparent border-none focus:outline-none text-sm"
              >
                <option value="encode">Encode Mode</option>
                <option value="decode">Decode Mode</option>
              </select>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept={mode === 'encode' ? '*/*' : '.txt'}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="cyber-button"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>

            <button
              onClick={handleConvert}
              disabled={loading}
              className="cyber-button cyber-button-primary"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Binary className="w-4 h-4" />
                  <span>{mode === 'encode' ? 'Encode' : 'Decode'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Output</label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                rows={10}
                className="cyber-input font-mono w-full resize-none bg-cyber-black/50"
                placeholder={`${mode === 'encode' ? 'Encoded' : 'Decoded'} output will appear here...`}
              />
              {output && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <CopyToClipboard
                    text={output}
                    onCopy={() => toast.success('Copied to clipboard')}
                  >
                    <button className="p-2 hover:text-cyber-primary transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </CopyToClipboard>
                  <button
                    onClick={downloadOutput}
                    className="p-2 hover:text-cyber-primary transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {mode === 'decode' && isImage && input && (
            <div className="cyber-card">
              <h3 className="text-lg font-bold mb-4">Image Preview</h3>
              <div className="relative aspect-video bg-cyber-black/50 rounded-lg overflow-hidden">
                <img
                  src={`data:image/png;base64,${input}`}
                  alt="Decoded image"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="cyber-card">
            <h3 className="text-lg font-bold mb-4">Information</h3>
            <div className="space-y-2 text-sm text-cyber-secondary/70">
              <p>• Base64 encoding increases the data size by approximately 33%</p>
              <p>• Common uses: encoding binary data, images, and special characters</p>
              <p>• The output contains only A-Z, a-z, 0-9, +, /, and = characters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
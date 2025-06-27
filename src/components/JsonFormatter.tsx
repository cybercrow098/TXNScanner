import React, { useState } from 'react';
import { FileJson, Copy, Download, Upload, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formatJson = () => {
    if (!input) {
      toast.error('Please enter JSON to format');
      return;
    }

    setLoading(true);
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      toast.success('JSON formatted successfully');
    } catch (error) {
      toast.error('Invalid JSON');
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      toast.success('File loaded successfully');
    };
    reader.readAsText(file);
  };

  const downloadJson = () => {
    if (!output) {
      toast.error('No formatted JSON to download');
      return;
    }

    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-json-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('JSON downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Input JSON</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              rows={15}
              className="cyber-input font-mono w-full resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Indent Size</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="cyber-input"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="8">8 spaces</option>
              </select>
            </div>

            <div className="flex-1 flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cyber-button flex-1"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
              <button
                onClick={formatJson}
                disabled={loading}
                className="cyber-button cyber-button-primary flex-1"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Formatting...</span>
                  </>
                ) : (
                  <>
                    <FileJson className="w-4 h-4" />
                    <span>Format</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Formatted JSON</label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                rows={15}
                className="cyber-input font-mono w-full resize-none bg-cyber-black/50"
                placeholder="Formatted JSON will appear here..."
              />
              {output && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <CopyToClipboard
                    text={output}
                    onCopy={() => toast.success('JSON copied to clipboard')}
                  >
                    <button className="p-2 hover:text-cyber-primary transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </CopyToClipboard>
                  <button
                    onClick={downloadJson}
                    className="p-2 hover:text-cyber-primary transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="cyber-card">
            <h3 className="text-lg font-bold mb-4">JSON Validation</h3>
            {output ? (
              <div className="p-4 bg-cyber-accent/10 border border-cyber-accent/30 rounded-lg">
                <p className="text-cyber-accent">✓ Valid JSON format</p>
              </div>
            ) : input ? (
              <div className="p-4 bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg">
                <p className="text-cyber-primary">✗ Invalid JSON format</p>
              </div>
            ) : (
              <p className="text-cyber-secondary/70">
                Enter JSON to validate and format
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
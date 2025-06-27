import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Download, Copy, RefreshCw, Link } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

export default function QRGenerator() {
  const [url, setUrl] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrl(`https://${url}`);
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('QR Code generated successfully');
    }, 500);
  };

  const downloadQR = () => {
    if (!url) {
      toast.error('Please generate a QR code first');
      return;
    }

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qr-code-${new Date().getTime()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success('QR Code downloaded');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL (e.g., https://example.com)"
                className="cyber-input flex-1"
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="cyber-button cyber-button-primary whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">QR Code Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="h-10 w-full rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-full rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Size (px)</label>
              <input
                type="range"
                min="128"
                max="512"
                step="32"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-cyber-secondary/70 text-center">
                {size}px
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Margin</label>
              <button
                onClick={() => setIncludeMargin(!includeMargin)}
                className={`cyber-button w-full ${includeMargin ? 'border-cyber-accent text-cyber-accent' : ''}`}
              >
                {includeMargin ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="p-6 bg-cyber-darker/50 rounded-lg border border-cyber-secondary/30 flex flex-col items-center justify-center min-h-[400px]">
            {url ? (
              <QRCode
                value={url}
                size={size}
                fgColor={qrColor}
                bgColor={bgColor}
                includeMargin={includeMargin}
                level="H"
              />
            ) : (
              <div className="text-center text-cyber-secondary/70">
                <Link className="w-12 h-12 mb-4 mx-auto" />
                <p>Enter a URL to generate QR code</p>
              </div>
            )}
          </div>

          {url && (
            <div className="flex gap-2">
              <button
                onClick={downloadQR}
                className="cyber-button flex-1"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <CopyToClipboard
                text={url}
                onCopy={() => toast.success('URL copied to clipboard')}
              >
                <button className="cyber-button flex-1">
                  <Copy className="w-4 h-4" />
                  <span>Copy URL</span>
                </button>
              </CopyToClipboard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
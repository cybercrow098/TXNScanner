import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Copy, Clock, AlertTriangle, Download, Upload, Shield, Construction } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
}

const API_KEY = "QbMkesCaIkxaWfOzSSMp";
const BASE_URL = "https://api.temp-mail.io/v1";

export default function TemporaryEmail() {
  const [email, setEmail] = useState<string>('');
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isUnderReconstruction, setIsUnderReconstruction] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && email) {
      interval = setInterval(fetchMessages, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, email]);

  const handleApiError = (error: any) => {
    console.error('API Error:', error);
    setIsUnderReconstruction(true);
    
    if (error.response) {
      // Handle specific HTTP error codes
      switch (error.response.status) {
        case 401:
          setError('Service temporarily unavailable - under maintenance');
          toast.error('Service under maintenance');
          break;
        case 403:
          setError('Service temporarily unavailable - under reconstruction');
          toast.error('Service under reconstruction');
          break;
        case 429:
          setError('Service temporarily unavailable - high traffic');
          toast.error('Service under high load');
          break;
        case 500:
          setError('Service temporarily unavailable - please try again later');
          toast.error('Service unavailable');
          break;
        default:
          setError('Service temporarily unavailable');
          toast.error('Service unavailable');
      }
    } else if (error.request) {
      setError('Service temporarily unavailable - network issues');
      toast.error('Network issues');
    } else {
      setError('Service temporarily unavailable');
      toast.error('Service unavailable');
    }
  };

  const createEmail = async () => {
    setLoading(true);
    setError('');
    try {
      // Use a CORS proxy to bypass CORS restrictions
      const response = await fetch(`https://api.allorigins.win/post?url=${encodeURIComponent(`${BASE_URL}/emails`)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        }
      });

      if (!response.ok) {
        throw { response };
      }

      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('Invalid response format');
      }

      const emailData = JSON.parse(data.contents);
      setEmail(emailData.email);
      setMessages([]);
      setIsUnderReconstruction(false);
      toast.success('Temporary email created');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!email) return;
    
    try {
      // Use a CORS proxy to bypass CORS restrictions
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`${BASE_URL}/emails/${email}/messages`)}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        }
      });

      if (!response.ok) {
        throw { response };
      }

      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('Invalid response format');
      }

      const messagesData = JSON.parse(data.contents);
      const newMessages = messagesData.messages || [];
      
      if (newMessages.length > messages.length) {
        setMessages(newMessages);
        toast.success('New message received');
      }
      setIsUnderReconstruction(false);
    } catch (error) {
      handleApiError(error);
      setAutoRefresh(false);
    }
  };

  const downloadMessages = () => {
    if (messages.length === 0) {
      toast.error('No messages to download');
      return;
    }

    const content = messages.map(msg => (
      `From: ${msg.from}\nSubject: ${msg.subject}\nDate: ${msg.timestamp}\n\n${msg.body}\n\n---\n\n`
    )).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `temp-mail-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Messages downloaded');
  };

  if (isUnderReconstruction) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="cyber-card border-cyber-primary text-center max-w-lg mx-auto p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Construction className="w-12 h-12 text-cyber-primary animate-pulse" />
          </div>
          <h2 className="text-xl font-bold mb-4">Service Under Reconstruction</h2>
          <p className="text-cyber-secondary/70 mb-6">
            We're currently performing maintenance to improve our temporary email service. 
            Please try again later.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setIsUnderReconstruction(false);
                setError('');
              }}
              className="cyber-button"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Control Section */}
        <div className="space-y-4">
          <div className="cyber-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Temporary Email</h3>
              <div className="flex items-center gap-2">
                {email && (
                  <>
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`cyber-button ${autoRefresh ? 'border-cyber-accent text-cyber-accent' : ''}`}
                    >
                      <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                      <span>{autoRefresh ? 'Stop' : 'Auto'} Refresh</span>
                    </button>
                    <button
                      onClick={createEmail}
                      className="cyber-button cyber-button-primary"
                    >
                      <Mail className="w-4 h-4" />
                      <span>New Email</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {email ? (
              <div className="space-y-4">
                <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-accent/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyber-accent" />
                      <span className="font-mono text-sm break-all">{email}</span>
                    </div>
                    <CopyToClipboard
                      text={email}
                      onCopy={() => toast.success('Email copied to clipboard')}
                    >
                      <button className="p-2 hover:text-cyber-primary transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>

                {autoRefresh && (
                  <div className="flex items-center gap-2 text-sm text-cyber-accent">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>Auto-refreshing every 5 seconds</span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={createEmail}
                disabled={loading}
                className="cyber-button cyber-button-primary w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Email...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Generate Email</span>
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="mt-4 p-4 bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg">
                <div className="flex items-center gap-2 text-cyber-primary">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages Section */}
        <div className="space-y-4">
          <div className="cyber-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Inbox</h3>
              {messages.length > 0 && (
                <button
                  onClick={downloadMessages}
                  className="cyber-button"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-cyber-secondary/70">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-secondary/30 hover:border-cyber-accent transition-all duration-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyber-secondary/70">From:</span>
                        <span className="font-mono text-sm">{message.from}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyber-secondary/70">Subject:</span>
                        <span className="font-medium">{message.subject}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyber-secondary/70">Time:</span>
                        <span className="text-sm">{new Date(message.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="mt-4 p-4 bg-cyber-darker rounded-lg">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {message.body}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
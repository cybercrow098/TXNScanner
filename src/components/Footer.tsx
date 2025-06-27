import React, { useState, useEffect } from 'react';
import { Globe, Twitter, Github, Send, Shield, Brain, Terminal, MessageSquare, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FooterProps {
  setShowTools: (show: boolean) => void;
  setShowPricing: (show: boolean) => void;
  setShowAccount: (show: boolean) => void;
  setShowFAQ: (show: boolean) => void;
  setShowPrivacy: (show: boolean) => void;
  setShowTerms: (show: boolean) => void;
  setShowFeatures: (show: boolean) => void;
}

export default function Footer({ 
  setShowTools, 
  setShowPricing, 
  setShowAccount, 
  setShowFAQ,
  setShowPrivacy,
  setShowTerms,
  setShowFeatures
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  const resetViews = () => {
    setShowTools(false);
    setShowPricing(false);
    setShowAccount(false);
    setShowFAQ(false);
    setShowPrivacy(false);
    setShowTerms(false);
    setShowFeatures(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimplexClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion', '_blank');
  };

  const handleNavigation = (action: () => void) => {
    resetViews();
    action();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-cyber-darker/80 backdrop-blur-md border-t border-cyber-secondary/20 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <button 
              onClick={() => handleNavigation(() => {})} 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <Shield className="w-8 h-8 text-cyber-accent group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent/0 via-cyber-accent/20 to-cyber-accent/0 animate-shine" />
              </div>
              <span className="font-['Orbitron'] text-xl font-bold bg-gradient-to-r from-cyber-accent to-cyber-primary bg-clip-text text-transparent">
                TXNscanner
              </span>
            </button>
            <p className="text-sm text-cyber-secondary/70 leading-relaxed">
              Advanced blockchain wallet scanning and analysis platform with powerful recovery services.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleSimplexClick}
                className="p-2 text-cyber-secondary/50 hover:text-cyber-accent hover:bg-cyber-accent/10 rounded-lg transition-all"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="p-2 text-cyber-secondary/50 hover:text-cyber-accent hover:bg-cyber-accent/10 rounded-lg transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                 className="p-2 text-cyber-secondary/50 hover:text-cyber-accent hover:bg-cyber-accent/10 rounded-lg transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-['Orbitron'] text-sm font-bold text-cyber-accent">Platform</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation(() => {})}
                  className="text-sm text-cyber-secondary/70 hover:text-cyber-accent transition-colors flex items-center gap-2 group"
                >
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Scanner</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation(() => setShowTools(true))}
                  className="text-sm text-cyber-secondary/70 hover:text-cyber-accent transition-colors flex items-center gap-2 group"
                >
                  <Terminal className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Tools</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation(() => setShowPricing(true))}
                  className="text-sm text-cyber-secondary/70 hover:text-cyber-accent transition-colors flex items-center gap-2 group"
                >
                  <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Pricing</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation(() => setShowFeatures(true))}
                  className="text-sm text-cyber-secondary/70 hover:text-cyber-accent transition-colors flex items-center gap-2 group"
                >
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Features Guide</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-['Orbitron'] text-sm font-bold text-cyber-accent">Resources</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation(() => setShowFAQ(true))}
                  className="text-sm text-cyber-secondary/70 hover:text-cyber-accent transition-colors flex items-center gap-2 group"
                >
                  <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>FAQ</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation(() => setShowAccount(true))}
                  className="text-sm text-cyber-secondary/70 hover:text-cyber-accent transition-colors flex items-center gap-2 group"
                >
                  <Terminal className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Account</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-['Orbitron'] text-sm font-bold text-cyber-accent">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-cyber-black/50 border border-cyber-secondary/30 rounded-lg px-4 py-2 text-sm
                           placeholder-cyber-secondary/30 focus:outline-none focus:border-cyber-accent
                           focus:ring-1 focus:ring-cyber-accent/50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-cyber-secondary/50
                           hover:text-cyber-accent transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-cyber-secondary/50">
                Stay informed about our latest updates and features
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyber-secondary/20 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-cyber-secondary/70">
            <Globe className="w-4 h-4 text-cyber-primary animate-pulse" />
            <span className="font-mono text-sm">Last Scan: {currentTime.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <button 
              onClick={() => handleNavigation(() => setShowPrivacy(true))}
              className="text-cyber-secondary/50 hover:text-cyber-accent transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handleNavigation(() => setShowTerms(true))}
              className="text-cyber-secondary/50 hover:text-cyber-accent transition-colors"
            >
              Terms of Service
            </button>
            <span className="text-cyber-secondary/50">
              © {new Date().getFullYear()} TXNscanner
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
import React from 'react';
import { Shield, Lock, Eye, Database, Globe, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cyber-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-cyber-primary/10 rounded-full">
            <Lock className="w-6 h-6 text-cyber-primary" />
            <h1 className="text-2xl font-bold text-cyber-primary">Privacy Policy</h1>
          </div>
          <p className="text-cyber-secondary/70 max-w-2xl mx-auto mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Introduction</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>
                TXNscanner ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain scanning and analysis services.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
          </div>

          {/* Information Collection */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Information Collection</h2>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cyber-accent">Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 text-cyber-secondary/90">
                <li>Email addresses for notifications and account management</li>
                <li>Cryptocurrency wallet addresses for scanning and analysis</li>
                <li>API keys and authentication credentials</li>
                <li>Payment information for premium services</li>
              </ul>

              <h3 className="text-lg font-bold text-cyber-accent mt-6">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-cyber-secondary/90">
                <li>Device and browser information</li>
                <li>IP addresses and location data</li>
                <li>Usage patterns and preferences</li>
                <li>Performance metrics and error logs</li>
              </ul>
            </div>
          </div>

          {/* Data Usage */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>We use the collected information for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing and maintaining our services</li>
                <li>Processing your transactions and requests</li>
                <li>Sending service updates and notifications</li>
                <li>Improving our services and user experience</li>
                <li>Detecting and preventing fraud or abuse</li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Information Sharing</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service providers and business partners</li>
                <li>Law enforcement when required by law</li>
                <li>Other parties with your explicit consent</li>
              </ul>
              <p className="mt-4">
                We do not sell or rent your personal information to third parties for marketing purposes.
              </p>
            </div>
          </div>

          {/* Security */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Security Measures</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>
                We implement appropriate technical and organizational security measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>End-to-end encryption for sensitive data</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data storage and transmission</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Contact Us</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Via SimpleX Chat: <a href="https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion" target="_blank" rel="noopener noreferrer" className="text-cyber-accent hover:underline">Open SimpleX Chat</a></li>
                <li>Via Email: privacy@txnscanner.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
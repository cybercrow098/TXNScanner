import React from 'react';
import { FileText, Shield, AlertTriangle, Scale, Clock, CreditCard } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-cyber-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-cyber-primary/10 rounded-full">
            <FileText className="w-6 h-6 text-cyber-primary" />
            <h1 className="text-2xl font-bold text-cyber-primary">Terms of Service</h1>
          </div>
          <p className="text-cyber-secondary/70 max-w-2xl mx-auto mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Agreement */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Agreement to Terms</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>
                By accessing or using TXNscanner's services, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access our services.
              </p>
              <div className="p-4 bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-cyber-primary" />
                  <span className="font-bold text-cyber-primary">Important Notice</span>
                </div>
                <p className="text-sm">
                  Our services are intended for legitimate blockchain analysis and recovery purposes only. Any malicious or unauthorized use is strictly prohibited.
                </p>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Service Description</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>TXNscanner provides:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Blockchain wallet scanning and analysis</li>
                <li>Wallet recovery services</li>
                <li>Transaction monitoring and tracking</li>
                <li>API access for automated operations</li>
                <li>Support and consultation services</li>
              </ul>
              <p className="mt-4">
                Service availability and features may vary based on your subscription level and geographical location.
              </p>
            </div>
          </div>

          {/* User Obligations */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">User Obligations</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the services only for legitimate purposes</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not attempt to circumvent service limitations</li>
                <li>Not interfere with service operations</li>
              </ul>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Payment Terms</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>
                Premium services require payment. By subscribing to a premium plan:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You agree to pay all fees in cryptocurrency</li>
                <li>Payments are non-refundable unless specified</li>
                <li>Service access may be suspended for non-payment</li>
                <li>Prices may change with notice</li>
              </ul>
              <div className="p-4 bg-cyber-accent/10 border border-cyber-accent/30 rounded-lg mt-4">
                <p className="text-sm">
                  Recovery services have conditional refunds: unsuccessful reconstructions are fully refundable (excluding Priority processing fees).
                </p>
              </div>
            </div>
          </div>

          {/* Service Limitations */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Service Limitations</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>We reserve the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or discontinue services without notice</li>
                <li>Impose rate limits on API usage</li>
                <li>Restrict access to certain features</li>
                <li>Terminate accounts for violations</li>
              </ul>
              <p className="mt-4">
                Service availability and performance may be affected by factors beyond our control.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-cyber-primary" />
              <h2 className="text-xl font-bold">Disclaimer</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>
                Our services are provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Success of wallet recovery attempts</li>
                <li>Accuracy of blockchain data</li>
                <li>Continuous service availability</li>
                <li>Security of third-party integrations</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-cyber-accent" />
              <h2 className="text-xl font-bold">Contact Us</h2>
            </div>
            <div className="space-y-4 text-cyber-secondary/90">
              <p>
                For questions about these Terms of Service, contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Via SimpleX Chat: <a href="https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion" target="_blank" rel="noopener noreferrer" className="text-cyber-accent hover:underline">Open SimpleX Chat</a></li>
                <li>Via Email: terms@txnscanner.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
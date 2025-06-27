import React from 'react';
import { Code, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

const PYTHON_CODE = `from bip_utils import Bip39MnemonicGenerator, Bip39SeedGenerator, Bip44, Bip44Coins, Bip44Changes

def generate_btc_wallet():
    # Generate a random 12-word BIP39 mnemonic
    mnemonic = Bip39MnemonicGenerator().FromWordsNumber(12)

    # Generate seed from mnemonic
    seed_bytes = Bip39SeedGenerator(mnemonic).Generate()

    # Derive BIP44 for Bitcoin
    bip44_wallet = Bip44.FromSeed(seed_bytes, Bip44Coins.BITCOIN)
    acct = bip44_wallet.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(0)

    # Extract keys and address
    priv_key = acct.PrivateKey().Raw().ToHex()
    address = acct.PublicKey().ToAddress()

    return {
        "mnemonic": str(mnemonic),
        "private_key": priv_key,
        "address": address
    }

def generate_bulk_btc_wallets(count=10, output_file='btc_wallets.txt'):
    with open(output_file, 'w') as f:
        for _ in range(count):
            wallet = generate_btc_wallet()
            f.write(f"Mnemonic    : {wallet['mnemonic']}\\n")
            f.write(f"Private Key : {wallet['private_key']}\\n")
            f.write(f"Address     : {wallet['address']}\\n")
            f.write(f"{'-'*60}\\n")
    print(f"{count} BTC wallets saved to {output_file}")

if __name__ == "__main__":
    generate_bulk_btc_wallets(count=100)  # Change as needed`;

const SAMPLE_OUTPUT = `Mnemonic    : author orange drill evil any nephew twin manage genuine adult present online
Private Key : e043005da64432853e519bafb0673ded3669014d38f095e7d9b1df6b2f54db10
Address     : 16qpLqQUKU9zTWWFH7fnewBVjnri7rC9LW
------------------------------------------------------------
Mnemonic    : runway mammal clay charge good wool breeze team fame top hood credit
Private Key : 3a58026df1e1e43ad9d26032ad4c251e6cf4bff9abe8926bcde3c90b18e922ee
Address     : 1KCUJPmeLA6tpVMztTMVTebWcXNxPttptw
------------------------------------------------------------`;

export default function BtcGenerator() {
  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-cyber-accent" />
            <h3 className="text-lg font-bold">BTC Wallet Generator (Python)</h3>
          </div>
          <CopyToClipboard
            text={PYTHON_CODE}
            onCopy={() => toast.success('Code copied to clipboard')}
          >
            <button className="cyber-button">
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </button>
          </CopyToClipboard>
        </div>

        <div className="relative">
          <pre className="bg-cyber-black/50 p-6 rounded-lg overflow-x-auto font-mono text-sm">
            <code>{PYTHON_CODE}</code>
          </pre>
        </div>
      </div>

      <div className="cyber-card">
        <h3 className="text-lg font-bold mb-4">Dependencies</h3>
        <div className="space-y-2">
          <p className="text-sm text-cyber-secondary/70">Install required packages:</p>
          <pre className="bg-cyber-black/50 p-4 rounded-lg overflow-x-auto font-mono text-sm">
            <code>pip install bip-utils</code>
          </pre>
        </div>
      </div>

      <div className="cyber-card">
        <h3 className="text-lg font-bold mb-4">Usage Instructions</h3>
        <div className="space-y-2 text-sm text-cyber-secondary/70">
          <p>1. Save the code to a Python file (e.g., <code>btc_generator.py</code>)</p>
          <p>2. Install the required dependencies using pip</p>
          <p>3. Run the script: <code>python btc_generator.py</code></p>
          <p>4. Generated wallets will be saved to <code>btc_wallets.txt</code></p>
          <p>5. Each wallet entry includes mnemonic, private key, and address</p>
        </div>
      </div>

      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Sample Output</h3>
          <CopyToClipboard
            text={SAMPLE_OUTPUT}
            onCopy={() => toast.success('Sample output copied')}
          >
            <button className="cyber-button">
              <Copy className="w-4 h-4" />
              <span>Copy Sample</span>
            </button>
          </CopyToClipboard>
        </div>
        <div className="relative">
          <pre className="bg-cyber-black/50 p-6 rounded-lg overflow-x-auto font-mono text-sm">
            <code>{SAMPLE_OUTPUT}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
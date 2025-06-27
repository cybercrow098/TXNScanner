import React from 'react';
import { Code, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

const PYTHON_CODE = `from bip_utils import Bip39MnemonicGenerator, Bip39SeedGenerator, Bip44, Bip44Coins, Bip44Changes
from tronpy.keys import PrivateKey

def generate_trx_wallet():
    # Generate a random 12-word mnemonic
    mnemonic = Bip39MnemonicGenerator().FromWordsNumber(12)
    
    # Generate seed from mnemonic
    seed_bytes = Bip39SeedGenerator(mnemonic).Generate()

    # Derive BIP44 for TRON (coin 195)
    bip44_wallet = Bip44.FromSeed(seed_bytes, Bip44Coins.TRON)
    acct = bip44_wallet.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(0)

    priv_key_hex = acct.PrivateKey().Raw().ToHex()
    tron_priv_key = PrivateKey(bytes.fromhex(priv_key_hex))
    address = tron_priv_key.public_key.to_base58check_address()

    return {
        "mnemonic": str(mnemonic),
        "private_key": priv_key_hex,
        "address": address
    }

def generate_bulk_trx_wallets(count=10, output_file='trx_wallets.txt'):
    with open(output_file, 'w') as f:
        for _ in range(count):
            wallet = generate_trx_wallet()
            f.write(f"Mnemonic    : {wallet['mnemonic']}\\n")
            f.write(f"Private Key : {wallet['private_key']}\\n")
            f.write(f"Address     : {wallet['address']}\\n")
            f.write(f"{'-'*60}\\n")
    print(f"{count} TRX wallets saved to {output_file}")

if __name__ == "__main__":
    generate_bulk_trx_wallets(count=100)  # Or any number you want`;

const SAMPLE_OUTPUT = `------------------------------------------------------------
Mnemonic    : photo cheese oval plastic torch artefact despair very average catch rebel battle
Private Key : b83e6b16d7fb3e4d0e369eb274870c433429aac9b9e415828ec7be731c46a98c
Address     : TVBRt7rmyg2o7nFyZGeKsvSTQ2utGWSASH
------------------------------------------------------------
Mnemonic    : run truck tone ability elephant chapter company nest pigeon rose knock sell
Private Key : b66ebd17f8507ccf864fadd46237da2d7eb297b73855025c9bac593d5a1eebe3
Address     : TTUZJNzVUk7Cix99cVKdPuNKCTBK8CYzKp
------------------------------------------------------------`;

export default function TrxGenerator() {
  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-cyber-accent" />
            <h3 className="text-lg font-bold">TRX Wallet Generator (Python)</h3>
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
            <code>pip install bip-utils tronpy</code>
          </pre>
        </div>
      </div>

      <div className="cyber-card">
        <h3 className="text-lg font-bold mb-4">Usage Instructions</h3>
        <div className="space-y-2 text-sm text-cyber-secondary/70">
          <p>1. Save the code to a Python file (e.g., <code>trx_generator.py</code>)</p>
          <p>2. Install the required dependencies using pip</p>
          <p>3. Run the script: <code>python trx_generator.py</code></p>
          <p>4. Generated wallets will be saved to <code>trx_wallets.txt</code></p>
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
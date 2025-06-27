import React from 'react';
import { Code, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

const PYTHON_CODE = `from bip_utils import Bip39MnemonicGenerator, Bip39SeedGenerator, Bip44, Bip44Coins, Bip44Changes
from eth_utils import to_checksum_address

def generate_eth_wallet():
    # Generate 12-word mnemonic
    mnemonic = Bip39MnemonicGenerator().FromWordsNumber(12)

    # Generate seed from mnemonic
    seed_bytes = Bip39SeedGenerator(mnemonic).Generate()

    # Derive Ethereum keys using BIP44 path m/44'/60'/0'/0/0
    bip44_wallet = Bip44.FromSeed(seed_bytes, Bip44Coins.ETHEREUM)
    acct = bip44_wallet.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(0)

    priv_key_hex = acct.PrivateKey().Raw().ToHex()
    eth_address = acct.PublicKey().ToAddress()  # This gives hex address

    # Checksum the address (EIP-55)
    eth_address = to_checksum_address(eth_address)

    return {
        "mnemonic": str(mnemonic),
        "private_key": priv_key_hex,
        "address": eth_address
    }

def generate_bulk_eth_wallets(count=10, output_file='eth_wallets.txt'):
    with open(output_file, 'w') as f:
        for _ in range(count):
            wallet = generate_eth_wallet()
            f.write(f"Mnemonic    : {wallet['mnemonic']}\\n")
            f.write(f"Private Key : {wallet['private_key']}\\n")
            f.write(f"Address     : {wallet['address']}\\n")
            f.write(f"{'-'*60}\\n")
    print(f"{count} ETH wallets saved to {output_file}")

if __name__ == "__main__":
    generate_bulk_eth_wallets(count=100)  # Change to desired number`;

const SAMPLE_OUTPUT = `Mnemonic    : exit series cheap voice note enemy brave notice custom describe hundred gate
Private Key : 881802e3fda6ebbfe463f8fe5cafeb4ed289772964054335fd22123e6073fc0c
Address     : 0x261D06E22F812e5ca67b4997DECf4cDc7B819d95
------------------------------------------------------------
Mnemonic    : resource give task bus clutch round hidden flip guilt napkin budget lecture
Private Key : 928d1826f659e97893fa07871792c7750ce02caa096fca033ca7aed81c11c67d
Address     : 0x0a7277701595Edc30d11993841Fa4f5D072cb07B
------------------------------------------------------------`;

export default function EthGenerator() {
  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-cyber-accent" />
            <h3 className="text-lg font-bold">ETH Wallet Generator (Python)</h3>
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
            <code>pip install bip-utils eth-utils</code>
          </pre>
        </div>
      </div>

      <div className="cyber-card">
        <h3 className="text-lg font-bold mb-4">Usage Instructions</h3>
        <div className="space-y-2 text-sm text-cyber-secondary/70">
          <p>1. Save the code to a Python file (e.g., <code>eth_generator.py</code>)</p>
          <p>2. Install the required dependencies using pip</p>
          <p>3. Run the script: <code>python eth_generator.py</code></p>
          <p>4. Generated wallets will be saved to <code>eth_wallets.txt</code></p>
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
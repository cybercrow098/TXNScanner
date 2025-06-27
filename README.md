# TXNscanner 🔍

> **⚠️ DEMO PROJECT NOTICE: This is a demonstration version without database integration or advanced scanner features. For full functionality, custom development, or enterprise solutions, contact maheshsid@protonmail.com**

> **Advanced Blockchain Wallet Scanner & Analysis Platform**

TXNscanner is a professional-grade blockchain analysis platform that provides comprehensive wallet scanning, transaction monitoring, and recovery services across multiple cryptocurrency networks. Built with modern web technologies and optimized for high-performance scanning operations.

![TXNscanner Dashboard](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop&crop=center)

## ✨ Features

### 🔍 Multi-Chain Wallet Scanning
- **TRON (TRX)** - Full support with TRC20 token detection
- **Bitcoin (BTC)** - Legacy, P2SH, and SegWit address support
- **Ethereum (ETH)** - ERC20 token analysis
- **Litecoin (LTC)** - Complete network coverage

### 🚀 Advanced Capabilities
- **Bulk Address Scanning** - Process thousands of addresses simultaneously
- **Real-time Balance Monitoring** - Live updates with auto-refresh
- **Token Detection** - Automatic discovery of TRC20, ERC20, and other tokens
- **Export Functionality** - JSON and CSV export options
- **Rate Limiting Protection** - Smart throttling to prevent API overload

### 🛠️ Developer Tools
- **Wallet Generators** - Python code generators for BTC, ETH, TRX
- **Mnemonic Generator** - BIP39 compliant seed phrase generation
- **Hash Generator** - MD5, SHA-1, SHA-256, SHA-512 support
- **Base64 Converter** - Encode/decode with file support
- **JSON Formatter** - Validate and format JSON data
- **QR Code Generator** - Create QR codes for addresses and URLs

### 🔐 Security & Privacy
- **No Data Storage** - All scanning is performed client-side
- **Encrypted Communications** - Secure API connections
- **Privacy-First Design** - No tracking or data collection
- **Open Source** - Transparent and auditable codebase

## 📞 Contact for Full Version

**For production-ready features including:**
- Advanced database integration
- Enhanced scanner capabilities
- Custom blockchain integrations
- Enterprise-grade security
- Dedicated support
- Custom development

**Contact:** maheshsid@protonmail.com

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/txnscanner.git

# Navigate to project directory
cd txnscanner

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Keys (Optional - for enhanced features)
VITE_TRON_API_KEY=your_tron_api_key
```

## 📖 Usage

### Basic Wallet Scanning

```javascript
// Single address scan
const result = await scanSingleAddress('TRX_ADDRESS_HERE', 'tron');
console.log(`Balance: ${result.balance} TRX`);

// Bulk address scan
const addresses = ['addr1', 'addr2', 'addr3'];
await scanAddressesWithWorkers(
  addresses,
  'tron',
  (current, total) => console.log(`Progress: ${current}/${total}`),
  (result) => console.log('Found balance:', result)
);
```

### Using the API

```javascript
// Get TRON account information
import { getTronAccountInfo } from './services/tronGrid';

const accountInfo = await getTronAccountInfo('TRX_ADDRESS');
console.log('Account Info:', accountInfo);
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom cyber theme
- **State Management**: React Hooks
- **API Layer**: Axios with connection pooling
- **Build Tool**: Vite
- **Icons**: Lucide React

### Project Structure
```
src/
├── components/          # React components
│   ├── crypto/         # Cryptocurrency-specific components
│   ├── tools/          # Utility tools
│   └── ui/             # Reusable UI components
├── services/           # API services and business logic
│   ├── tronGrid.ts     # TRON blockchain integration
│   ├── cryptoApi.ts    # Multi-chain API handlers
│   └── scannerService.ts # Core scanning logic
├── workers/            # Web Workers for background processing
└── styles/             # Global styles and themes
```

### Key Services

#### TRON Integration (`tronGrid.ts`)
- Connection pooling with 50 concurrent connections
- API key rotation for load balancing
- Circuit breaker pattern for fault tolerance
- Automatic retry with exponential backoff

#### Multi-Chain Support (`cryptoApi.ts`)
- Bitcoin, Ethereum, and Litecoin support
- Unified interface for all blockchain networks
- Address validation and format checking

#### Scanner Service (`scannerService.ts`)
- Bulk scanning with Web Workers
- Progress tracking and error handling
- Configurable batch sizes and rate limiting

## 🔧 Configuration

### Scanner Settings
```javascript
// Customize scanning behavior
const scannerConfig = {
  batchSize: 15,           // Addresses per batch
  concurrentBatches: 10,   // Parallel batches
  retryAttempts: 3,        // Failed request retries
  rateLimitDelay: 50       // Delay between requests (ms)
};
```

### API Rate Limiting
```javascript
// Built-in rate limiting
const rateLimiter = {
  requestsPerSecond: 20,
  burstLimit: 100,
  cooldownPeriod: 60000
};
```

## 🎨 Customization

### Themes
The application uses a custom cyber-punk theme built with Tailwind CSS:

```css
/* Custom color palette */
:root {
  --cyber-black: #030711;
  --cyber-primary: #FF2E63;
  --cyber-secondary: #08F7FE;
  --cyber-accent: #00FF9F;
}
```

### Adding New Blockchains
1. Create a new service in `services/`
2. Implement the required interface
3. Add validation functions
4. Update the scanner selector

## 📊 Performance

### Benchmarks
- **TRON Scanning**: 3,000+ addresses/minute
- **Multi-chain**: 1,000+ addresses/minute
- **Memory Usage**: <100MB for 10,000 addresses
- **Response Time**: <200ms average API response

### Optimization Features
- Connection pooling
- Request batching
- Intelligent caching
- Background processing with Web Workers

## 🛡️ Security

### Best Practices
- No private key storage
- Client-side processing
- Encrypted API communications
- Input validation and sanitization
- XSS and CSRF protection

### Privacy
- No user tracking
- No data collection
- No third-party analytics
- Optional telemetry (disabled by default)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- 100% test coverage for core functions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Community
- [Discord Server](https://discord.gg/txnscanner)
- [Telegram Group](https://t.me/txnscanner)
- [GitHub Discussions](https://github.com/yourusername/txnscanner/discussions)

### Contact
- **Email**: support@txnscanner.com
- **SimpleX Chat**: [Contact Link](https://simplex.chat/contact#/?v=2-7&smp=smp%3A%2F%2F6iIcWT_dF2zN_w5xzZEY7HI2Prbh3ldP07YTyDexPjE%3D%40smp10.simplex.im%2F2573td4Lx-SsnahxVwfsBF9hhxTrYeC5%23%2F%3Fv%3D1-4%26dh%3DMCowBQYDK2VuAyEA35lBOWBcNvqy2DH3dg723s4rMoJuBQgoVK5tQnatqjs%253D%26q%3Dc%26srv%3Drb2pbttocvnbrngnwziclp2f4ckjq65kebafws6g4hy22cdaiv5dwjqd.onion)

## 🙏 Acknowledgments

- [TRON Foundation](https://tron.network/) for blockchain infrastructure
- [CoinGecko](https://coingecko.com/) for price data
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling framework

## 📈 Roadmap

### Q1 2024
- [ ] Solana (SOL) integration
- [ ] Advanced analytics dashboard
- [ ] API rate limiting improvements
- [ ] Mobile app development

### Q2 2024
- [ ] Polygon (MATIC) support
- [ ] Real-time notifications
- [ ] Advanced filtering options
- [ ] Batch export enhancements

### Q3 2024
- [ ] Machine learning fraud detection
- [ ] Custom alert system
- [ ] Enterprise features
- [ ] White-label solutions

---

<div align="center">

**[Website](https://txnscanner.netlify.app/)**

Made with ❤️ by the TXNscanner team

**For full-featured version contact: maheshsid@protonmail.com**

</div>
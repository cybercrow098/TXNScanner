# Contributing to TXNscanner

Thank you for your interest in contributing to TXNscanner! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and blockchain concepts

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/yourusername/txnscanner.git
   cd txnscanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node.js version)

### Suggesting Features

Feature requests are welcome! Please:

- **Check existing feature requests** first
- **Provide clear use case** and rationale
- **Consider implementation complexity**
- **Be open to discussion** and feedback

### Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new blockchain scanner"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### TypeScript Guidelines
- Use strict TypeScript configuration
- Provide explicit types for function parameters and return values
- Use interfaces for object shapes
- Prefer `const` assertions where appropriate

### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Optimize re-renders with `useMemo` and `useCallback`
- Follow React naming conventions

### Code Style
```typescript
// ✅ Good
interface WalletInfo {
  address: string;
  balance: number;
  tokens: TokenBalance[];
}

const scanWallet = async (address: string): Promise<WalletInfo> => {
  // Implementation
};

// ❌ Avoid
const scanWallet = async (address) => {
  // Implementation
};
```

### File Organization
```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── pages/           # Page-specific components
│   └── features/        # Feature-specific components
├── services/            # API and business logic
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── constants/           # Application constants
```

## 🧪 Testing

### Test Structure
- **Unit tests**: Individual functions and components
- **Integration tests**: Component interactions
- **E2E tests**: Full user workflows

### Writing Tests
```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { WalletScanner } from './WalletScanner';

describe('WalletScanner', () => {
  it('should display wallet balance', () => {
    render(<WalletScanner address="TRX123..." />);
    expect(screen.getByText(/balance/i)).toBeInTheDocument();
  });
});
```

### Running Tests
```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🔧 Development Guidelines

### Adding New Blockchain Support

1. **Create service file**
   ```typescript
   // src/services/newBlockchain.ts
   export interface NewBlockchainAccount {
     address: string;
     balance: number;
     // ... other properties
   }

   export const getNewBlockchainAccount = async (
     address: string
   ): Promise<NewBlockchainAccount> => {
     // Implementation
   };
   ```

2. **Add validation**
   ```typescript
   export const isValidNewBlockchainAddress = (address: string): boolean => {
     // Validation logic
   };
   ```

3. **Update scanner service**
   ```typescript
   // Add to scannerService.ts
   case 'newblockchain':
     return await getNewBlockchainAccount(address);
   ```

4. **Add to UI**
   - Update scanner selector
   - Add appropriate icons and styling
   - Update documentation

### Performance Considerations

- **Batch API requests** when possible
- **Implement caching** for frequently accessed data
- **Use Web Workers** for heavy computations
- **Optimize bundle size** with code splitting

### Security Guidelines

- **Validate all inputs** on both client and server
- **Never store private keys** or sensitive data
- **Use HTTPS** for all API communications
- **Implement rate limiting** to prevent abuse
- **Sanitize user inputs** to prevent XSS

## 📚 Documentation

### Code Documentation
- Use JSDoc for functions and classes
- Include examples in documentation
- Document complex algorithms and business logic

```typescript
/**
 * Scans multiple wallet addresses for balances
 * @param addresses - Array of wallet addresses to scan
 * @param scannerType - Type of blockchain scanner to use
 * @param onProgress - Callback for progress updates
 * @returns Promise that resolves when scanning is complete
 * @example
 * ```typescript
 * await scanAddresses(['addr1', 'addr2'], 'tron', (current, total) => {
 *   console.log(`Progress: ${current}/${total}`);
 * });
 * ```
 */
```

### README Updates
- Update feature lists when adding functionality
- Include new configuration options
- Add examples for new APIs

## 🐛 Debugging

### Common Issues

1. **API Rate Limiting**
   - Check rate limit configuration
   - Implement exponential backoff
   - Use connection pooling

2. **Memory Leaks**
   - Clean up event listeners
   - Cancel pending requests
   - Properly dispose of Web Workers

3. **Performance Issues**
   - Profile with React DevTools
   - Check for unnecessary re-renders
   - Optimize large list rendering

### Debug Tools
```bash
npm run dev:debug         # Start with debugging enabled
npm run analyze          # Bundle analyzer
npm run profile          # Performance profiling
```

## 📦 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Commit Messages
We use [Conventional Commits](https://conventionalcommits.org/):

```
feat: add Solana blockchain support
fix: resolve memory leak in scanner service
docs: update API documentation
style: improve mobile responsive design
refactor: optimize connection pooling
test: add integration tests for bulk scanning
```

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Security review completed

## 🎯 Areas for Contribution

### High Priority
- **New blockchain integrations** (Solana, Polygon, etc.)
- **Performance optimizations**
- **Mobile responsiveness improvements**
- **Accessibility enhancements**

### Medium Priority
- **Additional utility tools**
- **Enhanced error handling**
- **Improved user experience**
- **Documentation improvements**

### Low Priority
- **Code refactoring**
- **Test coverage improvements**
- **Development tooling**

## 💬 Communication

### Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat and collaboration
- **Email**: security@txnscanner.com for security issues

### Response Times
- **Bug reports**: 24-48 hours
- **Feature requests**: 3-5 days
- **Pull requests**: 2-3 days
- **Security issues**: 24 hours

## 🏆 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **Hall of Fame** on our website
- **Special badges** on Discord

## 📄 License

By contributing to TXNscanner, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TXNscanner! Your efforts help make blockchain analysis more accessible and powerful for everyone. 🚀
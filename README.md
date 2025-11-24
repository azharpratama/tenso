# Tenso - Decentralized API Marketplace

<div align="center">

![Tenso Logo](https://via.placeholder.com/200x200?text=TENSO)

**Bridging Web2 APIs to AI Agents through DePIN**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base Sepolia](https://img.shields.io/badge/Network-Base%20Sepolia-blue)](https://sepolia.basescan.org/)
[![Built for PinGo](https://img.shields.io/badge/Hackathon-PinGo%20DePIN%202025-brightgreen)](https://pingo.io)

</div>

## Overview

Tenso is a decentralized API marketplace that enables web2 companies to monetize their APIs through crypto payments **without changing their infrastructure**. AI agents can directly access paid APIs using USDC.

**Problem**: Web2 APIs can't accept crypto payments. AI agents need programmable access to paid APIs.

**Solution**: Tenso acts as a DePIN layer that handles crypto payments and forwards requests to existing APIs.

## DePIN Category

**DeCDN / Oracles** - Decentralized content delivery network and data oracle infrastructure

## 🚀 Quick Start (5 Steps)

### Option 1: Docker (Recommended! ⭐)

```bash
# 1. Clone repo
git clone https://github.com/yourusername/tenso-depin.git
cd tenso-depin

# 2. Setup environment (ONE file only!)
cp .env.example .env

# 3. Edit .env and add:
# - PRIVATE_KEY (wallet private key)
# - NODE_OPERATOR_ADDRESS (your address)
nano .env  # or use your favorite editor

# 4. Start with Docker
docker-compose up

# 5. Open browser
# http://localhost:3000
```

### Option 2: Manual Setup

```bash
# 1. Clone repo
git clone https://github.com/yourusername/tenso-depin.git
cd tenso-depin

# 2. Setup environment
cp .env.example .env
nano .env  # Edit with your credentials

# 3. Install dependencies
cd web && npm install
cd ../forwarder && npm install
cd ..

# 4. Run services (2 terminals)
# Terminal 1:
cd forwarder && npm start

# Terminal 2:
cd web && npm run dev

# 5. Open browser
# http://localhost:3000
```

## � Arsitektur Sederhana

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  AI Agent   │◄─────►│   Tenso Web  │◄─────►│  MetaMask   │
│ / End User  │       │   Frontend   │       │   Wallet    │
└─────────────┘       └──────────────┘       └─────────────┘
                              │
                              │ x402 Request
                              ▼
                       ┌──────────────┐
                       │   Forwarder  │ (DePIN Node)
                       │   (Hono.js)  │
                       └──────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ Smart        │    │  Upstream    │
            │ Contracts    │    │     API      │
            │ (Base)       │    │  (Web2)      │
            └──────────────┘    └──────────────┘
                 │
                 ├─ PaymentRouter (90/8/2 split)
                 ├─ PaymentVerifier (x402)
                 └─ NodeRegistry (DePIN)
```

### Payment Flow (On-chain ↔ Off-chain)

**Off-chain (DePIN):**
- User browses APIs in marketplace
- Call API without payment → 402 error
- Sign payment with MetaMask (EIP-712, gasless!)

**On-chain (Base Sepolia):**
- Forwarder verify signature
- Execute payment split via PaymentRouter:
  - 90% → API Owner
  - 8% → Node Operator  
  - 2% → Protocol Treasury
- Transaction confirmed

**Off-chain (DePIN):**
- Forward request ke upstream API
- Return response + TX hash
- Log analytics

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Wagmi v2, Viem, TailwindCSS
- **Backend/Forwarder**: Hono.js, Viem, TypeScript
- **Database**: JSON files (MVP), Future: PostgreSQL
- **DePIN**: Decentralized forwarder nodes, Edge compute
- **Blockchain**: Solidity, Base Sepolia, USDC (ERC20)
- **Smart Contracts**: PaymentRouter, PaymentVerifier, NodeRegistry

## 📜 Smart Contracts (Base Sepolia)

| Contract | Address | Description |
|----------|---------|-------------|
| PaymentRouter | `0x6fa35e1f6ab4291432b36f16578614e90750b7e6` | Handles 90/8/2 payment splits |
| PaymentVerifier | `0xa73d7c7703b23cc4692fdd817345ad29db5ac4e9` | Verifies EIP-712 signatures |
| NodeRegistry | `0x5b2222610e04380e1caf3988d88fbd15686a1b6c` | DePIN node management |
| USDC (Test) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | Test USDC token |

[View on BaseScan →](https://sepolia.basescan.org/)

## 🎯 Key Features

### For API Sellers (Web2 Companies)
✅ **Zero Code Changes**: No need to modify existing APIs  
✅ **Instant Monetization**: Deploy and start receiving payments in 2 minutes  
✅ **Crypto Native**: Receive USDC directly to your wallet  
✅ **Revenue Dashboard**: Track earnings and API calls in real-time  
✅ **90% Revenue Share**: Sellers get 90% of every payment  

### For Buyers (AI Agents / Developers)
✅ **Gasless Payments**: Pay with signature, no gas fees  
✅ **x402 Protocol**: Standard HTTP 402 Payment Required  
✅ **Instant Access**: Pay → Call API in 1 flow  
✅ **On-chain Proof**: All payments recorded on blockchain  
✅ **Fair Pricing**: Pay-per-call, no subscription  

### For Node Operators (DePIN)
✅ **8% Revenue Share**: Earn from every routed transaction  
✅ **Simple Setup**: Run forwarder node with Docker  
✅ **Reputation System**: Better uptime = more traffic  
✅ **Decentralized**: No single point of failure  

## � Project Structure

```
tenso-depin/
├── contracts/                 # Solidity smart contracts
│   ├── src/
│   │   ├── PaymentRouter.sol
│   │   ├── PaymentVerifier.sol
│   │   └── NodeRegistry.sol
│   └── test/
├── forwarder/                 # DePIN forwarder node
│   ├── src/
│   │   └── index.ts          # Hono server + payment logic
│   ├── data/
│   │   ├── apis.json         # API metadata
│   │   └── analytics.json    # Real-time analytics
│   ├── Dockerfile
│   └── .env.example
├── web/                       # Next.js frontend
│   ├── app/
│   │   ├── marketplace/      # Browse & call APIs
│   │   ├── seller/           # Seller dashboard
│   │   ├── node-operator/    # Node operator dashboard
│   │   └── docs/             # Documentation
│   ├── components/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml         # One-command setup
└── README.md
```

## 🔑 Environment Variables

**Single `.env` file at project root** - No nested configuration!

```bash
# Quick setup
cp .env.example .env
nano .env
```

### Required Variables
```bash
# Wallet Configuration
PRIVATE_KEY=your_private_key_here
NODE_OPERATOR_ADDRESS=0xYourAddress

# Network
RPC_URL=https://sepolia.base.org

# Contract Addresses (Base Sepolia)
PAYMENT_ROUTER_ADDRESS=0x6fa35e1f6ab4291432b36f16578614e90750b7e6
PAYMENT_VERIFIER_ADDRESS=0xa73d7c7703b23cc4692fdd817345ad29db5ac4e9
NODE_REGISTRY_ADDRESS=0x5b2222610e04380e1caf3988d88fbd15686a1b6c
USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```


## 🧪 Testing

### Prerequisites
- MetaMask wallet
- Base Sepolia testnet ETH ([Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))
- Base Sepolia test USDC (mint from contract)

### Test Flow
1. **Connect Wallet**: Click "Connect Wallet" and select Base Sepolia
2. **Get Test USDC**: Mint from USDC contract on BaseScan
3. **Browse APIs**: Go to `/marketplace`
4. **Call API**: Select endpoint → Sign payment → See transaction hash
5. **Verify Payment**: Click TX hash to see 90/8/2 split on BaseScan
6. **Check Analytics**: Real volume and call counts update

## 🏆 Hackathon Submission (PinGo DePIN 2025)

### Track
DePIN Build Track - **DeCDN / Oracles**

### One-Pager
See [ONEPAGER.md](./ONEPAGER.md) for executive summary.

- [x] Docker deployment

### Phase 2 (Post-Hackathon)
- [ ] TENSO token for node staking
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] AI agent SDK (Python, JavaScript)
- [ ] API rate limiting & authentication
- [ ] Decentralized storage (IPFS/Arweave)
- [ ] Load balancing across nodes

### Phase 3 (Production)
- [ ] Mainnet deployment
- [ ] Enterprise API onboarding
- [ ] Advanced analytics dashboard
- [ ] SLA guarantees with reputation system
- [ ] Mobile app

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing bugs, improving documentation, or suggesting new features, your help is appreciated.

### How to Contribute
1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Use **Conventional Commits** for commit messages
- Ensure all new code is typed (TypeScript)
- Run `npm run lint` before committing

---

## ❓ Troubleshooting

### Common Issues

**1. Docker Port Conflict**
> `Error: Bind for 0.0.0.0:3000 failed: port is already allocated`
- **Fix**: Stop other services running on port 3000 or modify `docker-compose.yml` to map to a different port (e.g., `3001:3000`).

**2. MetaMask Nonce Error**
> `Nonce too low` or transaction stuck
- **Fix**: Reset your MetaMask account activity for Base Sepolia (Settings > Advanced > Clear Activity Tab Data).

**3. API Payment Failed**
> `402 Payment Required` persists after signing
- **Fix**: Ensure you have enough Sepolia USDC. Use the faucet if needed.

---

## 🙏 Acknowledgements

- **[Base](https://base.org)** - For the fast, low-cost L2 infrastructure
- **[Coinbase Developer Platform](https://www.coinbase.com/developer-platform)** - For RPC and Paymaster tools
- **[Wagmi](https://wagmi.sh) & [Viem](https://viem.sh)** - For best-in-class Ethereum hooks
- **[Hono](https://hono.dev)** - For the ultra-fast edge web framework

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🔗 Links

- **Live Demo**: http://localhost:3000
- **Documentation**: http://localhost:3000/docs
- **GitHub Repo**: https://github.com/yourusername/tenso-depin
- **Base Sepolia Explorer**: https://sepolia.basescan.org/

---

<div align="center">

**Built for PinGo Indonesian DePIN Hackathon 2025** 🚀

[GitHub](https://github.com/yourusername/tenso-depin) • [Demo](http://localhost:3000) • [Docs](http://localhost:3000/docs)

</div>

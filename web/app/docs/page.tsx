'use client';

import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { BookOpen, Github, Rocket, Code, Zap, Shield, Globe, ExternalLink, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DocsPage() {
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    const copyToClipboard = (text: string, section: string) => {
        // Try modern clipboard API first
        if (typeof window !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setCopiedSection(section);
                    setTimeout(() => setCopiedSection(null), 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy with clipboard API:', err);
                    fallbackCopy(text, section);
                });
        } else {
            // Fallback for browsers without clipboard API
            fallbackCopy(text, section);
        }
    };

    const fallbackCopy = (text: string, section: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopiedSection(section);
            setTimeout(() => setCopiedSection(null), 2000);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="min-h-screen text-white">
            <NodeNetworkBackground />

            <div className="relative px-8 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3AF2FF]/10 border border-[#3AF2FF]/30 rounded-full mb-4">
                            <BookOpen className="w-4 h-4 text-[#3AF2FF]" />
                            <span className="text-sm text-[#3AF2FF]">Documentation</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-4">
                            <span className="text-[#3AF2FF]">Tenso</span> Documentation
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Decentralized API Marketplace with x402 Payment Protocol
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                        <a
                            href="#quick-start"
                            className="p-4 bg-[#111318] border border-[#3AF2FF]/20 rounded-lg hover:border-[#3AF2FF]/40 transition-all group"
                        >
                            <Rocket className="w-6 h-6 text-[#3AF2FF] mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold mb-1">Quick Start</h3>
                            <p className="text-sm text-gray-400">Get started in 5 steps</p>
                        </a>
                        <a
                            href="#architecture"
                            className="p-4 bg-[#111318] border border-[#42E7D6]/20 rounded-lg hover:border-[#42E7D6]/40 transition-all group"
                        >
                            <Globe className="w-6 h-6 text-[#42E7D6] mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold mb-1">Architecture</h3>
                            <p className="text-sm text-gray-400">System overview</p>
                        </a>
                        <a
                            href="#api-reference"
                            className="p-4 bg-[#111318] border border-[#2EE59D]/20 rounded-lg hover:border-[#2EE59D]/40 transition-all group"
                        >
                            <Code className="w-6 h-6 text-[#2EE59D] mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold mb-1">API Reference</h3>
                            <p className="text-sm text-gray-400">Technical docs</p>
                        </a>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-12">
                        {/* Overview */}
                        <section className="p-8 bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 rounded-xl">
                            <h2 className="text-3xl font-bold mb-6 text-[#3AF2FF]">📖 Overview</h2>

                            <div className="space-y-4 text-gray-300">
                                <p className="text-lg">
                                    <strong className="text-white">Tenso</strong> is a decentralized API marketplace that enables web2 companies to monetize their APIs through crypto payments without changing their infrastructure.
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-[#0C0D10] rounded-lg">
                                        <h3 className="font-semibold mb-2 text-[#3AF2FF]">Problem</h3>
                                        <p className="text-sm text-gray-400">
                                            Web2 APIs can't directly accept crypto payments. AI agents need programmable access to paid APIs.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[#0C0D10] rounded-lg">
                                        <h3 className="font-semibold mb-2 text-[#2EE59D]">Solution</h3>
                                        <p className="text-sm text-gray-400">
                                            Tenso acts as a DePIN layer that handles crypto payments and forwards requests to existing APIs.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-sm text-blue-400">
                                        <strong>DePIN Category:</strong> DeCDN / Oracles - Decentralized content delivery and data oracle infrastructure
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Quick Start */}
                        <section id="quick-start" className="p-8 bg-gradient-to-b from-[#111318] to-transparent border border-[#2EE59D]/20 rounded-xl">
                            <h2 className="text-3xl font-bold mb-6 text-[#2EE59D]">🚀 Quick Start (5 Steps)</h2>

                            {/* Docker Option */}
                            <div className="mb-8">
                                <div className="p-6 bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg mb-6">
                                    <h3 className="text-xl font-bold mb-2 text-blue-400">⭐ Option 1: Docker (Recommended)</h3>
                                    <p className="text-sm text-gray-400">Easiest setup - one command to run everything!</p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        {
                                            step: 1,
                                            title: 'Clone Repository',
                                            code: 'git clone https://github.com/yourusername/tenso-depin.git\ncd tenso-depin'
                                        },
                                        {
                                            step: 2,
                                            title: 'Setup Environment',
                                            code: 'cp .env.example .env\nnano .env  # Add your PRIVATE_KEY'
                                        },
                                        {
                                            step: 3,
                                            title: 'Start Everything with Docker',
                                            code: 'docker-compose up'
                                        },
                                        {
                                            step: 4,
                                            title: 'Open Browser',
                                            code: '# Navigate to:\nhttp://localhost:3000'
                                        }
                                    ].map((item) => (
                                        <div key={`docker-${item.step}`} className="relative">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 border border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-400">
                                                    {item.step}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                                    <div className="relative">
                                                        <pre className="bg-[#0C0D10] border border-[#3AF2FF]/20 rounded-lg p-4 overflow-x-auto text-sm">
                                                            <code className="text-gray-300">{item.code}</code>
                                                        </pre>
                                                        <button
                                                            onClick={() => copyToClipboard(item.code, `docker-step-${item.step}`)}
                                                            className="absolute top-2 right-2 p-2 bg-[#3AF2FF]/20 hover:bg-[#3AF2FF]/30 border border-[#3AF2FF]/30 rounded text-[#3AF2FF] transition-all"
                                                        >
                                                            {copiedSection === `docker-step-${item.step}` ? (
                                                                <Check className="w-4 h-4" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Manual Option */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-3 text-[#3AF2FF]">Option 2: Manual Setup</h3>
                            </div>

                            <div className="space-y-6">
                                {[
                                    {
                                        step: 1,
                                        title: 'Clone Repository',
                                        code: 'git clone https://github.com/yourusername/tenso-depin.git\ncd tenso-depin'
                                    },
                                    {
                                        step: 2,
                                        title: 'Install Dependencies',
                                        code: '# Install web dependencies\ncd web && npm install\n\n# Install forwarder dependencies\ncd ../forwarder && npm install'
                                    },
                                    {
                                        step: 3,
                                        title: 'Setup Environment',
                                        code: '# Copy example env file\ncp .env.example .env\n\n# Edit .env and add:\n# - PRIVATE_KEY (your wallet private key)\n# - NODE_OPERATOR_ADDRESS (your address)\n# All contract addresses are pre-configured!'
                                    },
                                    {
                                        step: 4,
                                        title: 'Run Services',
                                        code: '# Terminal 1: Run forwarder\ncd forwarder && npm start\n\n# Terminal 2: Run web app\ncd web && npm run dev'
                                    },
                                    {
                                        step: 5,
                                        title: 'Open Browser',
                                        code: '# Navigate to:\nhttp://localhost:3000\n\n# Connect MetaMask (Base Sepolia)\n# Get test USDC from faucet\n# Try calling an API with payment!'
                                    }
                                ].map((item) => (
                                    <div key={item.step} className="relative">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-[#2EE59D]/20 border border-[#2EE59D] rounded-full flex items-center justify-center font-bold text-[#2EE59D]">
                                                {item.step}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                                <div className="relative">
                                                    <pre className="bg-[#0C0D10] border border-[#3AF2FF]/20 rounded-lg p-4 overflow-x-auto text-sm">
                                                        <code className="text-gray-300">{item.code}</code>
                                                    </pre>
                                                    <button
                                                        onClick={() => copyToClipboard(item.code, `step-${item.step}`)}
                                                        className="absolute top-2 right-2 p-2 bg-[#3AF2FF]/20 hover:bg-[#3AF2FF]/30 border border-[#3AF2FF]/30 rounded text-[#3AF2FF] transition-all"
                                                    >
                                                        {copiedSection === `step-${item.step}` ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Architecture */}
                        <section id="architecture" className="p-8 bg-gradient-to-b from-[#111318] to-transparent border border-[#42E7D6]/20 rounded-xl">
                            <h2 className="text-3xl font-bold mb-6 text-[#42E7D6]">🏗️ Architecture</h2>

                            <div className="space-y-6">
                                <p className="text-gray-300">
                                    Tenso uses a hybrid architecture combining on-chain payments with off-chain API forwarding:
                                </p>

                                <div className="bg-[#0C0D10] border border-[#3AF2FF]/20 rounded-lg p-6">
                                    <pre className="text-sm text-gray-300 overflow-x-auto">
                                        {`┌─────────────┐        ┌──────────────┐        ┌─────────────┐
│  AI Agent   │◄─────►│   Tenso Web  │◄─────►│  MetaMask   │
│ / End User  │        │   Frontend   │        │   Wallet    │
└─────────────┘        └──────────────┘        └─────────────┘
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
                 └─ NodeRegistry (DePIN)`}
                                    </pre>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#0C0D10] rounded-lg border border-[#3AF2FF]/20">
                                        <h4 className="font-semibold mb-2 text-[#3AF2FF]">On-Chain (Base Sepolia)</h4>
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            <li>• Payment verification</li>
                                            <li>• Revenue splitting (90/8/2)</li>
                                            <li>• Node registration</li>
                                            <li>• USDC settlement</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-[#0C0D10] rounded-lg border border-[#42E7D6]/20">
                                        <h4 className="font-semibold mb-2 text-[#42E7D6]">Off-Chain (DePIN)</h4>
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            <li>• API request forwarding</li>
                                            <li>• Response caching</li>
                                            <li>• Load balancing</li>
                                            <li>• Analytics tracking</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Tech Stack */}
                        <section className="p-8 bg-gradient-to-b from-[#111318] to-transparent border border-[#A78BFA]/20 rounded-xl">
                            <h2 className="text-3xl font-bold mb-6 text-[#A78BFA]">⚙️ Tech Stack</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[#3AF2FF]">Frontend</h3>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#3AF2FF] rounded-full"></div>
                                            Next.js 14 (App Router)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#3AF2FF] rounded-full"></div>
                                            Wagmi v2 (Wallet connection)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#3AF2FF] rounded-full"></div>
                                            Viem (Ethereum interactions)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#3AF2FF] rounded-full"></div>
                                            TailwindCSS
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[#42E7D6]">Backend / DePIN</h3>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#42E7D6] rounded-full"></div>
                                            Hono.js (Edge runtime)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#42E7D6] rounded-full"></div>
                                            Viem (Contract interactions)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#42E7D6] rounded-full"></div>
                                            TypeScript
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#42E7D6] rounded-full"></div>
                                            Docker
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[#2EE59D]">Blockchain (EVM)</h3>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#2EE59D] rounded-full"></div>
                                            Solidity (Smart contracts)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#2EE59D] rounded-full"></div>
                                            Base Sepolia
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#2EE59D] rounded-full"></div>
                                            USDC (ERC20)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#2EE59D] rounded-full"></div>
                                            Foundry
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[#A78BFA]">Data & DevOps</h3>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#A78BFA] rounded-full"></div>
                                            JSON files (MVP)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#A78BFA] rounded-full"></div>
                                            Docker Compose
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#A78BFA] rounded-full"></div>
                                            Alchemy RPC
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Project Structure */}
                            <div className="mt-8 p-6 bg-[#0C0D10] rounded-lg">
                                <h4 className="font-semibold mb-4 text-[#3AF2FF]">📁 Project Structure</h4>
                                <pre className="text-sm text-gray-300 overflow-x-auto">
                                    {`tenso-depin/
├── README.md              # Main documentation
├── PRD.md                 # Product requirements
├── .env.example           # Config template (ONE file!)
├── docker-compose.yml     # One-command setup
│
├── contracts/             # Smart contracts
│   ├── src/
│   │   ├── PaymentRouter.sol
│   │   ├── PaymentVerifier.sol
│   │   └── NodeRegistry.sol
│   └── broadcast/         # Deployment logs
│
├── forwarder/             # DePIN node (Hono.js)
│   ├── src/
│   │   └── index.ts       # Payment verification + routing
│   ├── data/
│   │   ├── apis.json      # API database
│   │   └── analytics.json # Real-time tracking
│   └── Dockerfile
│
└── web/                   # Next.js frontend
    ├── app/
    │   ├── marketplace/   # Browse & call APIs
    │   ├── seller/        # Seller dashboard
    │   ├── node-operator/ # Node dashboard
    │   └── docs/          # This page!
    ├── components/
    ├── lib/
    └── Dockerfile`}
                                </pre>
                            </div>
                        </section>

                        {/* x402 Protocol */}
                        <section id="api-reference" className="p-8 bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 rounded-xl">
                            <h2 className="text-3xl font-bold mb-6 text-[#3AF2FF]">🔐 x402 Payment Protocol</h2>

                            <div className="space-y-6">
                                <p className="text-gray-300">
                                    The x402 protocol enables gasless API payments using EIP-712 signatures:
                                </p>

                                <div className="space-y-4">
                                    <div className="p-4 bg-[#0C0D10] rounded-lg border-l-4 border-[#2EE59D]">
                                        <h4 className="font-semibold mb-2 text-[#2EE59D]">Step 1: Call without payment</h4>
                                        <p className="text-sm text-gray-400 mb-2">Server returns 402 Payment Required with payment details</p>
                                        <pre className="text-xs bg-[#111318] p-3 rounded overflow-x-auto">
                                            {`HTTP/1.1 402 Payment Required
X-PAYMENT: <base64_payment_details>

{
  "requiredPayment": {
    "amount": "1000000",  // 1 USDC
    "token": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "recipient": "0x6fa35e1f6ab4291432b36f16578614e90750b7e6"
  }
}`}
                                        </pre>
                                    </div>

                                    <div className="p-4 bg-[#0C0D10] rounded-lg border-l-4 border-[#3AF2FF]">
                                        <h4 className="font-semibold mb-2 text-[#3AF2FF]">Step 2: Sign payment authorization</h4>
                                        <p className="text-sm text-gray-400 mb-2">User signs EIP-712 message (no gas!)</p>
                                        <pre className="text-xs bg-[#111318] p-3 rounded overflow-x-auto">
                                            {`const signature = await signTypedData({
  domain: { name: "Tenso x402", version: "1" },
  types: { Payment: [/* ... */] },
  primaryType: "Payment",
  message: paymentDetails
});`}
                                        </pre>
                                    </div>

                                    <div className="p-4 bg-[#0C0D10] rounded-lg border-l-4 border-[#42E7D6]">
                                        <h4 className="font-semibold mb-2 text-[#42E7D6]">Step 3: Retry with signature</h4>
                                        <p className="text-sm text-gray-400 mb-2">Forwarder verifies signature and processes payment</p>
                                        <pre className="text-xs bg-[#111318] p-3 rounded overflow-x-auto">
                                            {`POST /api/:apiId/:endpoint
Headers:
  X-PAYMENT: <base64_signature>

→ Forwarder sponsors transaction
→ PaymentRouter splits USDC (90/8/2)
→ Returns API data + TX hash`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Smart Contracts */}
                        <section className="p-8 bg-gradient-to-b from-[#111318] to-transparent border border-[#2EE59D]/20 rounded-xl">
                            <h2 className="text-3xl font-bold mb-6 text-[#2EE59D]">📜 Smart Contracts</h2>

                            <div className="space-y-4">
                                {[
                                    {
                                        name: 'PaymentRouter',
                                        address: '0x6fa35e1f6ab4291432b36f16578614e90750b7e6',
                                        description: 'Handles payment splits: 90% API owner, 8% node operator, 2% protocol',
                                        functions: ['splitPayment()', 'setProtocolTreasury()', 'setProtocolFee()']
                                    },
                                    {
                                        name: 'PaymentVerifier',
                                        address: '0xa73d7c7703b23cc4692fdd817345ad29db5ac4e9',
                                        description: 'Verifies EIP-712 payment signatures',
                                        functions: ['verifyPayment()', 'getSigner()', 'DOMAIN_SEPARATOR()']
                                    },
                                    {
                                        name: 'NodeRegistry',
                                        address: '0x5b2222610e04380e1caf3988d88fbd15686a1b6c',
                                        description: 'Manages DePIN node operators registration and reputation',
                                        functions: ['registerNode()', 'getActiveNodes()', 'updateReputation()']
                                    }
                                ].map((contract) => (
                                    <div key={contract.name} className="p-4 bg-[#0C0D10] rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-[#3AF2FF]">{contract.name}</h3>
                                            <a
                                                href={`https://sepolia.basescan.org/address/${contract.address}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-[#42E7D6] hover:underline flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                BaseScan
                                            </a>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">{contract.description}</p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <code className="text-xs bg-[#111318] px-2 py-1 rounded text-[#2EE59D]">
                                                {contract.address}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(contract.address, contract.name)}
                                                className="p-1 hover:bg-[#3AF2FF]/10 rounded transition-all"
                                            >
                                                {copiedSection === contract.name ? (
                                                    <Check className="w-3 h-3 text-[#2EE59D]" />
                                                ) : (
                                                    <Copy className="w-3 h-3 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {contract.functions.map((fn) => (
                                                <span key={fn} className="text-xs bg-[#111318] px-2 py-1 rounded text-gray-400 font-mono">
                                                    {fn}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Contributing */}
                        <section className="p-8 bg-gradient-to-b from-[#111318] to-transparent border border-[#A78BFA]/20 rounded-xl">
                            <h2 className="text-3xl font-bold mb-6 text-[#A78BFA]">🤝 Contributing</h2>

                            <div className="space-y-4 text-gray-300">
                                <p>We welcome contributions! Here's how you can help:</p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#0C0D10] rounded-lg">
                                        <h4 className="font-semibold mb-2 text-[#3AF2FF]">Code Contributions</h4>
                                        <ol className="text-sm space-y-1 list-decimal list-inside">
                                            <li>Fork the repository</li>
                                            <li>Create your feature branch</li>
                                            <li>Commit your changes</li>
                                            <li>Push to the branch</li>
                                            <li>Open a Pull Request</li>
                                        </ol>
                                    </div>
                                    <div className="p-4 bg-[#0C0D10] rounded-lg">
                                        <h4 className="font-semibold mb-2 text-[#42E7D6]">Other Ways to Help</h4>
                                        <ul className="text-sm space-y-1">
                                            <li>• Report bugs</li>
                                            <li>• Suggest features</li>
                                            <li>• Improve documentation</li>
                                            <li>• Share the project</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Links */}
                        <section className="p-8 bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 rounded-xl">
                            <h2 className="text-3xl font-bold mb-6 text-[#3AF2FF]">🔗 Links & Resources</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <a
                                    href="https://github.com/yourusername/tenso-depin"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-[#0C0D10] border border-[#3AF2FF]/20 rounded-lg hover:border-[#3AF2FF]/40 transition-all flex items-center gap-3 group"
                                >
                                    <Github className="w-6 h-6 text-[#3AF2FF] group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h4 className="font-semibold">GitHub Repository</h4>
                                        <p className="text-sm text-gray-400">View source code</p>
                                    </div>
                                </a>
                                <Link
                                    href="/marketplace"
                                    className="p-4 bg-[#0C0D10] border border-[#42E7D6]/20 rounded-lg hover:border-[#42E7D6]/40 transition-all flex items-center gap-3 group"
                                >
                                    <Zap className="w-6 h-6 text-[#42E7D6] group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h4 className="font-semibold">Live Demo</h4>
                                        <p className="text-sm text-gray-400">Try the marketplace</p>
                                    </div>
                                </Link>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="text-center py-8 border-t border-[#3AF2FF]/10">
                            <p className="text-gray-400 mb-2">Built for PinGo Indonesian DePIN Hackathon 2025</p>
                            <p className="text-sm text-gray-500">MIT License • Made with ❤️ by Tenso Team</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

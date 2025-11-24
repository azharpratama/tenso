'use client';

import { useState } from 'react';
import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { ArrowRight, Globe, Zap, DollarSign, Network } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen text-white">
      <NodeNetworkBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#3AF2FF]/10 to-[#A78BFA]/10 border border-[#3AF2FF]/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#2EE59D] animate-pulse"></span>
            <span className="text-sm font-mono text-[#3AF2FF]">x402 Protocol • DePIN Network • Built on Base</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[#3AF2FF] via-[#7DF9FF] to-[#42E7D6] bg-clip-text text-transparent">
              THE DEPIN NETWORK
            </span>
            <br />
            <span className="text-white">FOR AI AGENT PAYMENTS</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-400 mb-4 font-mono">
            x402 Protocol • USDC Payments • Zero Accounts
          </p>

          <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
            Run forwarder nodes, earn fees. Monetize APIs, get paid instantly. AI agents access paid endpoints with one HTTP request.
          </p>

          {/* Revenue Split Badge */}
          <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
            <div className="px-6 py-3 rounded-lg bg-[#2EE59D]/10 border border-[#2EE59D]/30">
              <div className="text-3xl font-bold text-[#2EE59D]">90%</div>
              <div className="text-xs text-gray-400 font-mono">API Owners</div>
            </div>
            <div className="text-2xl text-[#3AF2FF]">→</div>
            <div className="px-6 py-3 rounded-lg bg-[#3AF2FF]/10 border border-[#3AF2FF]/30">
              <div className="text-3xl font-bold text-[#3AF2FF]">8%</div>
              <div className="text-xs text-gray-400 font-mono">Node Operators</div>
            </div>
            <div className="text-2xl text-[#A78BFA]">→</div>
            <div className="px-6 py-3 rounded-lg bg-[#A78BFA]/10 border border-[#A78BFA]/30">
              <div className="text-3xl font-bold text-[#A78BFA]">2%</div>
              <div className="text-xs text-gray-400 font-mono">Protocol</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/marketplace">
              <button className="group px-8 py-4 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all flex items-center gap-2">
                Browse APIs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/node-operator">
              <button className="px-8 py-4 bg-[#A78BFA]/10 border-2 border-[#A78BFA] rounded-lg font-semibold text-[#A78BFA] hover:bg-[#A78BFA]/20 transition-all">
                Run a Node
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-[#3AF2FF]">0</div>
              <div className="text-sm text-gray-500 font-mono">Active Nodes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#42E7D6]">0</div>
              <div className="text-sm text-gray-500 font-mono">Total APIs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2EE59D]">$0</div>
              <div className="text-sm text-gray-500 font-mono">Volume (USDC)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#A78BFA]">0</div>
              <div className="text-sm text-gray-500 font-mono">Requests/sec</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why <span className="text-[#3AF2FF]">Tenso</span>?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI Agent Ready */}
            <div className="p-6 rounded-xl bg-gradient-to-b from-[#3AF2FF]/10 to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm hover:border-[#3AF2FF]/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#3AF2FF]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-[#3AF2FF]" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Agent Ready</h3>
              <p className="text-gray-400 text-sm">
                Programmatic payments via x402. No accounts, no OAuth, just HTTP 402 responses.
              </p>
            </div>

            {/* DePIN Economics */}
            <div className="p-6 rounded-xl bg-gradient-to-b from-[#42E7D6]/10 to-transparent border border-[#42E7D6]/20 backdrop-blur-sm hover:border-[#42E7D6]/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#42E7D6]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Network className="w-6 h-6 text-[#42E7D6]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Node Operator Economics</h3>
              <p className="text-gray-400 text-sm">
                Earn 8% of all payments routed through your forwarder node. Decentralized infrastructure.
              </p>
            </div>

            {/* USDC Native */}
            <div className="p-6 rounded-xl bg-gradient-to-b from-[#2EE59D]/10 to-transparent border border-[#2EE59D]/20 backdrop-blur-sm hover:border-[#2EE59D]/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#2EE59D]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-[#2EE59D]" />
              </div>
              <h3 className="text-xl font-bold mb-2">USDC Settlements</h3>
              <p className="text-gray-400 text-sm">
                Instant stablecoin payments. Predictable pricing. Gasless via EIP-712 signatures.
              </p>
            </div>

            {/* Global Network */}
            <div className="p-6 rounded-xl bg-gradient-to-b from-[#A78BFA]/10 to-transparent border border-[#A78BFA]/20 backdrop-blur-sm hover:border-[#A78BFA]/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#A78BFA]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-[#A78BFA]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Distribution</h3>
              <p className="text-gray-400 text-sm">
                Nodes across US, EU, Asia. Low-latency routing. Geographic load balancing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How It <span className="text-[#3AF2FF]">Works</span>
          </h2>

          <div className="space-y-8">
            {[
              { step: '1', title: 'AI Agent calls API', desc: 'GET /api/weather/current', color: '#3AF2FF' },
              { step: '2', title: 'Node returns 402 Payment Required', desc: 'Includes USDC payment requirements', color: '#42E7D6' },
              { step: '3', title: 'Agent signs USDC payment', desc: 'EIP-712 signature (gasless)', color: '#2EE59D' },
              { step: '4', title: 'Node verifies & routes', desc: 'Payment splits 90/8/2 automatically', color: '#A78BFA' },
              { step: '5', title: 'Data returned + receipt', desc: 'X-PAYMENT-RESPONSE header with tx hash', color: '#3AF2FF' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 border-2 transition-all group-hover:scale-110"
                  style={{
                    borderColor: item.color,
                    backgroundColor: `${item.color}20`,
                    color: item.color
                  }}
                >
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 font-mono text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join the Network?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Start earning as a node operator or monetize your API today
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/node-operator">
              <button className="px-8 py-4 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all">
                Register Node
              </button>
            </Link>
            <Link href="/seller/create">
              <button className="px-8 py-4 bg-[#111318] border-2 border-[#3AF2FF] rounded-lg font-semibold text-[#3AF2FF] hover:bg-[#3AF2FF]/10 transition-all">
                Monetize API
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

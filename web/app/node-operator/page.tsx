'use client';

import { useState, useEffect } from 'react';
import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Server, TrendingUp, Zap, Globe, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { NodeRegistryABI, NODE_REGISTRY_ADDRESS } from '@/lib/abis';
import { WalletGuard } from '@/components/WalletGuard';

export default function NodeOperatorPage() {
    const { address, isConnected } = useAccount();
    const [view, setView] = useState<'dashboard' | 'register'>('dashboard');
    const [endpoint, setEndpoint] = useState('');
    const [region, setRegion] = useState('US-EAST');

    // Demo Mode: Use localStorage instead of smart contract
    const [demoNode, setDemoNode] = useState<any>(null);

    useEffect(() => {
        if (address) {
            const stored = localStorage.getItem(`node_${address}`);
            if (stored) {
                setDemoNode(JSON.parse(stored));
            }
        }
    }, [address]);

    const isRegistered = !!demoNode;

    const handleRegister = () => {
        if (!endpoint) {
            alert('Please enter node endpoint');
            return;
        }

        // Demo Mode: Store in localStorage
        const nodeData = {
            operator: address,
            endpoint,
            region,
            reputation: 100,
            active: true,
            registeredAt: Date.now()
        };

        localStorage.setItem(`node_${address}`, JSON.stringify(nodeData));
        setDemoNode(nodeData);
        setView('dashboard');

        // Show success message
        alert('✅ Node registered successfully! (Demo Mode)');
    };

    return (
        <div className="min-h-screen text-white">
            <NodeNetworkBackground />

            <div className="relative px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                <span className="text-[#3AF2FF]">Node Operator</span> Dashboard
                            </h1>
                            <p className="text-gray-400">Earn 8% of all payments routed through your node</p>
                            <div className="mt-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-md inline-block">
                                <p className="text-xs text-blue-400">TENSO token staking coming soon</p>
                            </div>
                        </div>
                        {isConnected && (
                            <div className="flex gap-2 bg-[#111318] rounded-lg p-1">
                                <button
                                    onClick={() => setView('dashboard')}
                                    className={`px-4 py-2 rounded-md transition-all ${view === 'dashboard'
                                        ? 'bg-[#3AF2FF] text-black'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Dashboard
                                </button>
                                {!isRegistered && (
                                    <button
                                        onClick={() => setView('register')}
                                        className={`px-4 py-2 rounded-md transition-all ${view === 'register'
                                            ? 'bg-[#3AF2FF] text-black'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        Register
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {view === 'dashboard' ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* Node Status */}
                                <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#2EE59D]/30 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <Server className={`w-6 h-6 ${isRegistered ? 'text-[#2EE59D]' : 'text-gray-500'}`} />
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isRegistered ? 'bg-[#2EE59D] animate-pulse' : 'bg-gray-500'}`}></div>
                                            <span className={`text-xs font-mono ${isRegistered ? 'text-[#2EE59D]' : 'text-gray-500'}`}>
                                                {isRegistered ? 'ONLINE' : 'OFFLINE'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold mb-1">
                                        {isRegistered ? 'Active' : 'Not Registered'}
                                    </div>
                                    <div className="text-sm text-gray-400">Node Status</div>
                                </div>

                                {/* Earnings Today */}
                                <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/30 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <DollarSign className="w-6 h-6 text-[#3AF2FF]" />
                                    </div>
                                    <div className="text-3xl font-bold mb-1 font-mono">
                                        {isRegistered ? '$24.67' : '$0.00'}
                                    </div>
                                    <div className="text-sm text-gray-400">Earnings Today</div>
                                </div>

                                {/* Requests Processed */}
                                <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#42E7D6]/30 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <Zap className="w-6 h-6 text-[#42E7D6]" />
                                    </div>
                                    <div className="text-3xl font-bold mb-1">
                                        {isRegistered ? '1,247' : '0'}
                                    </div>
                                    <div className="text-sm text-gray-400">Requests Today</div>
                                </div>

                                {/* Reputation */}
                                <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#A78BFA]/30 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <TrendingUp className="w-6 h-6 text-[#A78BFA]" />
                                    </div>
                                    <div className="text-3xl font-bold mb-1">
                                        {demoNode?.reputation ? demoNode.reputation.toString() : '--'}
                                    </div>
                                    <div className="text-sm text-gray-400">Reputation Score</div>
                                </div>
                            </div>

                            {/* Node Info Card */}
                            <div className="p-8 rounded-xl bg-gradient-to-br from-[#111318] to-[#0C0D10] border border-[#3AF2FF]/30 backdrop-blur-sm mb-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Server className="w-6 h-6 text-[#3AF2FF]" />
                                    Node Configuration
                                </h2>

                                {!isConnected ? (
                                    <div className="text-center py-12">
                                        <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-4">Connect your wallet to view node details</p>
                                        <ConnectWallet />
                                    </div>
                                ) : !isRegistered ? (
                                    <div className="text-center py-12">
                                        <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-4">You haven't registered a node yet.</p>
                                        <button
                                            onClick={() => setView('register')}
                                            className="px-6 py-3 bg-[#3AF2FF] text-black font-bold rounded-lg hover:scale-105 transition-all"
                                        >
                                            Register Node
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-[#0C0D10] rounded-lg">
                                            <div className="text-gray-400">Endpoint</div>
                                            <div className="text-sm font-mono">{demoNode?.endpoint}</div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-[#0C0D10] rounded-lg">
                                            <div className="text-gray-400">Region</div>
                                            <div className="text-sm font-mono">{demoNode?.region}</div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-[#0C0D10] rounded-lg">
                                            <div className="text-gray-400">Stake Amount</div>
                                            <div className="text-sm font-mono">
                                                10,000 TENSO
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-[#0C0D10] rounded-lg">
                                            <div className="text-gray-400">Registered At</div>
                                            <div className="text-sm font-mono">
                                                {demoNode?.registeredAt ? new Date(demoNode.registeredAt).toLocaleDateString() : '--'}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to reset registration? (Demo Mode)')) {
                                                    localStorage.removeItem(`node_${address}`);
                                                    setDemoNode(null);
                                                    window.location.reload();
                                                }
                                            }}
                                            className="w-full mt-4 px-4 py-2 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-all text-sm"
                                        >
                                            Reset Registration (Demo)
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Request Log */}
                            <div className="p-8 rounded-xl bg-gradient-to-br from-[#111318] to-[#0C0D10] border border-[#3AF2FF]/20 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-[#3AF2FF]" />
                                    Recent Requests
                                </h2>
                                <div className="bg-[#0C0D10] rounded-lg p-4 font-mono text-sm">
                                    <div className="text-gray-500">No requests yet. Register your node to start earning.</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Register Form */
                        <div className="max-w-2xl mx-auto">
                            <div className="p-8 rounded-xl bg-gradient-to-br from-[#111318] to-[#0C0D10] border border-[#3AF2FF]/3 backdrop-blur-sm">
                                <h2 className="text-3xl font-bold mb-2">Register Your Node</h2>
                                <p className="text-gray-400 mb-8">
                                    Stake 10,000 TENSO tokens and start earning 8% of all payments
                                </p>

                                <WalletGuard message="Connect wallet to register">
                                    <div className="space-y-6">
                                        {/* Endpoint URL */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Node Endpoint URL
                                            </label>
                                            <input
                                                type="url"
                                                value={endpoint}
                                                onChange={(e) => setEndpoint(e.target.value)}
                                                placeholder="https://node1.yourserver.com"
                                                className="w-full px-4 py-3 bg-[#0C0D10] border border-[#3AF2FF]/30 rounded-lg focus:border-[#3AF2FF] focus:outline-none font-mono text-sm"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Your public forwarder endpoint (must be HTTPS)
                                            </p>
                                        </div>

                                        {/* Region */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Region
                                            </label>
                                            <select
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value)}
                                                className="w-full px-4 py-3 bg-[#0C0D10] border border-[#3AF2FF]/30 rounded-lg focus:border-[#3AF2FF] focus:outline-none"
                                            >
                                                <option value="US-EAST">US East</option>
                                                <option value="US-WEST">US West</option>
                                                <option value="EU-WEST">EU West</option>
                                                <option value="EU-CENTRAL">EU Central</option>
                                                <option value="ASIA">Asia Pacific</option>
                                            </select>
                                        </div>

                                        {/* Stake Info */}
                                        <div className="p-6 bg-[#3AF2FF]/10 border border-[#3AF2FF]/30 rounded-lg">
                                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                                <DollarSign className="w-5 h-5 text-[#3AF2FF]" />
                                                Stake Requirements
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Stake Amount:</span>
                                                    <span className="font-mono text-[#3AF2FF]">10,000 TENSO</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Estimated Value:</span>
                                                    <span className="font-mono">~$1,000</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Earnings:</span>
                                                    <span className="font-mono text-[#2EE59D]">8% of payments</span>
                                                </div>
                                            </div>
                                        </div>



                                        {/* Register Button */}
                                        <button
                                            onClick={handleRegister}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Server className="w-4 h-4" />
                                            Register Node
                                        </button>



                                        <p className="text-xs text-gray-500 text-center">
                                            By registering, you agree to run forwarder software and maintain 99%+ uptime
                                        </p>
                                    </div>
                                </WalletGuard>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


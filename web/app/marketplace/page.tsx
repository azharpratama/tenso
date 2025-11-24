'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { Search, Zap, DollarSign, ExternalLink, Globe } from 'lucide-react';

interface Endpoint {
    path: string;
    method: string;
    price: string;
    description: string;
}

interface API {
    id: string;
    name: string;
    description: string;
    baseUrl: string;
    owner: string;
    endpoints: Endpoint[];
    createdAt: string;
}

export default function Marketplace() {
    const [apis, setApis] = useState<API[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [analytics, setAnalytics] = useState({ totalVolume: 0, totalCalls: 0 });

    useEffect(() => {
        fetch('/api/apis')
            .then(res => res.json())
            .then(setApis)
            .catch(console.error);

        fetch('/api/analytics')
            .then(res => res.json())
            .then(setAnalytics)
            .catch(console.error);
    }, []);

    const filteredApis = apis.filter(api =>
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen text-white">
            <NodeNetworkBackground />

            <div className="relative px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-5xl font-bold mb-2">
                                    API <span className="text-[#3AF2FF]">Marketplace</span>
                                </h1>
                                <p className="text-gray-400">
                                    Discover x402-enabled APIs • Pay with USDC • AI Agent Ready
                                </p>
                            </div>
                            <Link href="/seller/create">
                                <button className="px-6 py-3 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all">
                                    Monetize Your API
                                </button>
                            </Link>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search APIs..."
                                className="w-full pl-12 pr-4 py-4 bg-[#111318] border border-[#3AF2FF]/30 rounded-lg focus:border-[#3AF2FF] focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="p-6 rounded-xl bg-gradient-to-b from-[#3AF2FF]/10 to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm">
                            <div className="text-3xl font-bold text-[#3AF2FF]">{apis.length}</div>
                            <div className="text-sm text-gray-400">Total APIs</div>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-b from-[#42E7D6]/10 to-transparent border border-[#42E7D6]/20 backdrop-blur-sm">
                            <div className="text-3xl font-bold text-[#42E7D6]">
                                {apis.reduce((sum, api) => sum + (api.endpoints?.length || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-400">Endpoints</div>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-b from-[#2EE59D]/10 to-transparent border border-[#2EE59D]/20 backdrop-blur-sm">
                            <div className="text-3xl font-bold text-[#2EE59D]">${analytics.totalVolume.toFixed(2)}</div>
                            <div className="text-sm text-gray-400">Volume (USDC)</div>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-b from-[#A78BFA]/10 to-transparent border border-[#A78BFA]/20 backdrop-blur-sm">
                            <div className="text-3xl font-bold text-[#A78BFA]">{analytics.totalCalls}</div>
                            <div className="text-sm text-gray-400">Total Calls</div>
                        </div>
                    </div>

                    {/* API Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredApis.map((api) => (
                            <Link
                                href={`/marketplace/${api.id}`}
                                key={api.id}
                                className="group p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm hover:border-[#3AF2FF]/50 transition-all hover:scale-[1.02]"
                            >
                                {/* API Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold mb-2 group-hover:text-[#3AF2FF] transition-colors">
                                            {api.name}
                                        </h2>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                                            {api.description || 'No description provided'}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-[#3AF2FF]/20 flex items-center justify-center flex-shrink-0 ml-3">
                                        <Globe className="w-5 h-5 text-[#3AF2FF]" />
                                    </div>
                                </div>

                                {/* Base URL */}
                                <div className="mb-4 p-3 bg-[#0C0D10] rounded-lg">
                                    <div className="text-xs text-gray-500 mb-1">Base URL</div>
                                    <div className="text-xs font-mono text-gray-300 truncate flex items-center gap-2">
                                        {api.baseUrl}
                                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                    </div>
                                </div>

                                {/* Endpoints */}
                                <div className="mb-4">
                                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                        <Zap className="w-3 h-3" />
                                        {api.endpoints?.length || 0} Endpoints
                                    </div>
                                    <div className="space-y-2">
                                        {api.endpoints?.slice(0, 2).map((endpoint, i) => (
                                            <div key={i} className="flex items-center justify-between text-xs p-2 bg-[#0C0D10]/50 rounded">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded font-mono ${endpoint.method === 'GET' ? 'bg-[#2EE59D]/20 text-[#2EE59D]' : 'bg-[#A78BFA]/20 text-[#A78BFA]'
                                                        }`}>
                                                        {endpoint.method}
                                                    </span>
                                                    <span className="text-gray-400 font-mono">{endpoint.path}</span>
                                                </div>
                                                <span className="text-[#3AF2FF] font-mono">
                                                    {(parseFloat(endpoint.price) / 1000000).toFixed(2)} USDC
                                                </span>
                                            </div>
                                        ))}
                                        {(api.endpoints?.length || 0) > 2 && (
                                            <div className="text-xs text-gray-500 text-center">
                                                +{(api.endpoints?.length || 0) - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#2EE59D] animate-pulse"></div>
                                        <span className="text-xs text-[#2EE59D] font-mono">402 READY</span>
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">
                                        {api.owner.slice(0, 6)}...{api.owner.slice(-4)}
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {filteredApis.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">No APIs Found</h3>
                                <p className="text-gray-400 mb-6">
                                    {searchQuery
                                        ? 'Try a different search query'
                                        : 'Be the first to monetize your API on Tenso'}
                                </p>
                                <Link href="/seller/create">
                                    <button className="px-6 py-3 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all">
                                        Create API
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

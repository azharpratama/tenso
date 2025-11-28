'use client';

import { useState, useEffect } from 'react';
import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { useAccount } from 'wagmi';
import { WalletGuard } from '@/components/WalletGuard';
import { Plus, TrendingUp, DollarSign, Zap, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface API {
    id: string;
    name: string;
    description: string;
    baseUrl: string;
    owner: string;
    endpoints: Array<{
        path: string;
        method: string;
        price: string;
        description: string;
    }>;
    createdAt: string;
    // Add analytics for each API
    analytics?: {
        revenue: number;
        calls: number;
    };
}

export default function SellerDashboardPage() {
    const { address } = useAccount();
    const router = useRouter();
    const [myApis, setMyApis] = useState<API[]>([]);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({ totalVolume: 0, totalCalls: 0 });

    useEffect(() => {
        if (address) {
            loadMyApis();
            loadAnalytics();
        }
    }, [address]);

    const loadAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics');
            const data = await res.json();
            setAnalytics(data);
        } catch (e) {
            console.error('Failed to load analytics:', e);
        }
    };

    const loadMyApis = async () => {
        try {
            const res = await fetch('/api/apis');
            const allApis = await res.json();

            // Filter APIs owned by connected wallet
            const mine = allApis.filter((api: API) =>
                api.owner?.toLowerCase() === address?.toLowerCase()
            );

            // Load analytics for each API
            const apisWithAnalytics = await Promise.all(
                mine.map(async (api: API) => {
                    try {
                        const analyticsRes = await fetch(`/api/analytics?apiId=${api.id}`);
                        const apiAnalytics = await analyticsRes.json();
                        return {
                            ...api,
                            analytics: {
                                revenue: apiAnalytics.totalVolume,
                                calls: apiAnalytics.totalCalls
                            }
                        };
                    } catch (e) {
                        return {
                            ...api,
                            analytics: { revenue: 0, calls: 0 }
                        };
                    }
                })
            );

            setMyApis(apisWithAnalytics);
        } catch (e) {
            console.error('Failed to load APIs:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (apiId: string) => {
        if (!confirm('Are you sure you want to delete this API?')) return;

        try {
            const res = await fetch(`/api/apis?id=${apiId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete API');

            // Reload APIs
            loadMyApis();
        } catch (e) {
            alert('Failed to delete API');
        }
    };

    const getTotalRevenue = () => {
        return `$${analytics.totalVolume.toFixed(3)}`;
    };

    const getTotalCalls = () => {
        return analytics.totalCalls;
    };

    const getApiRevenue = (api: API) => {
        return `$${(api.analytics?.revenue || 0).toFixed(3)}`;
    };

    const getApiCalls = (api: API) => {
        return api.analytics?.calls || 0;
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
                                <span className="text-[#3AF2FF]">Seller</span> Dashboard
                            </h1>
                            <p className="text-gray-400">Manage your APIs and track revenue</p>
                        </div>
                        <Link
                            href="/seller/create"
                            className="px-6 py-3 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create New API
                        </Link>
                    </div>

                    <WalletGuard>
                        {/* Stats Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/30 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <DollarSign className="w-6 h-6 text-[#3AF2FF]" />
                                </div>
                                <div className="text-3xl font-bold mb-1 font-mono">{getTotalRevenue()}</div>
                                <div className="text-sm text-gray-400">Total Revenue</div>
                            </div>

                            <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#42E7D6]/30 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <Zap className="w-6 h-6 text-[#42E7D6]" />
                                </div>
                                <div className="text-3xl font-bold mb-1">{getTotalCalls()}</div>
                                <div className="text-sm text-gray-400">Total API Calls</div>
                            </div>

                            <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#2EE59D]/30 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <TrendingUp className="w-6 h-6 text-[#2EE59D]" />
                                </div>
                                <div className="text-3xl font-bold mb-1">{myApis.length}</div>
                                <div className="text-sm text-gray-400">Active APIs</div>
                            </div>
                        </div>

                        {/* My APIs */}
                        <div className="p-8 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-6">My APIs</h2>

                            {loading ? (
                                <div className="text-center py-12 text-gray-400">Loading...</div>
                            ) : myApis.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 mb-4">You haven't created any APIs yet</p>
                                    <Link
                                        href="/seller/create"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#3AF2FF]/20 border border-[#3AF2FF] rounded-lg text-[#3AF2FF] hover:bg-[#3AF2FF]/30 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Your First API
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myApis.map((api) => (
                                        <div
                                            key={api.id}
                                            className="p-6 bg-[#0C0D10] border border-[#3AF2FF]/20 rounded-lg hover:border-[#3AF2FF]/40 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold mb-1">{api.name}</h3>
                                                    <p className="text-sm text-gray-400 mb-2">{api.description}</p>
                                                    <a
                                                        href={api.baseUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-[#3AF2FF] hover:underline flex items-center gap-1"
                                                    >
                                                        {api.baseUrl}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/marketplace/${api.id}`}
                                                        className="p-2 bg-[#3AF2FF]/20 border border-[#3AF2FF] rounded-lg text-[#3AF2FF] hover:bg-[#3AF2FF]/30 transition-all"
                                                        title="View in Marketplace"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/seller/edit/${api.id}`}
                                                        className="p-2 bg-[#42E7D6]/20 border border-[#42E7D6] rounded-lg text-[#42E7D6] hover:bg-[#42E7D6]/30 transition-all"
                                                        title="Edit API"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(api.id)}
                                                        className="p-2 bg-[#FF5C5C]/20 border border-[#FF5C5C] rounded-lg text-[#FF5C5C] hover:bg-[#FF5C5C]/30 transition-all"
                                                        title="Delete API"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* API Stats */}
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div className="p-3 bg-[#111318] rounded-lg">
                                                    <div className="text-xs text-gray-400 mb-1">Revenue</div>
                                                    <div className="text-lg font-mono font-bold">{getApiRevenue(api)}</div>
                                                </div>
                                                <div className="p-3 bg-[#111318] rounded-lg">
                                                    <div className="text-xs text-gray-400 mb-1">Calls</div>
                                                    <div className="text-lg font-bold">{getApiCalls(api)}</div>
                                                </div>
                                                <div className="p-3 bg-[#111318] rounded-lg">
                                                    <div className="text-xs text-gray-400 mb-1">Endpoints</div>
                                                    <div className="text-lg font-bold">{api.endpoints.length}</div>
                                                </div>
                                            </div>

                                            {/* Endpoints */}
                                            <div>
                                                <div className="text-xs text-gray-400 mb-2">Endpoints:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {api.endpoints.map((ep, i) => (
                                                        <div
                                                            key={i}
                                                            className="px-3 py-1 bg-[#111318] border border-[#3AF2FF]/20 rounded-md text-xs"
                                                        >
                                                            <span className="text-[#A78BFA] font-mono">{ep.method}</span>
                                                            <span className="text-gray-400 mx-1">{ep.path}</span>
                                                            <span className="text-[#2EE59D]">{(parseInt(ep.price) / 1_000_000).toFixed(2)} USDC</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </WalletGuard>
                </div>
            </div>
        </div>
    );
}

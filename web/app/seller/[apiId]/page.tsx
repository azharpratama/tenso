'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { ArrowLeft, BarChart3, DollarSign, Users, Zap, Calendar, Download } from 'lucide-react';
import Link from 'next/link';
import { WalletGuard } from '@/components/WalletGuard';

// Mock data generator
const generateChartData = (days: number) => {
    return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        requests: Math.floor(Math.random() * 500) + 100,
        earnings: (Math.random() * 10) + 2,
        errors: Math.floor(Math.random() * 10)
    }));
};

export default function SellerAnalyticsPage() {
    const params = useParams();
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
    const [data, setData] = useState(generateChartData(7));

    useEffect(() => {
        const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30;
        setData(generateChartData(days));
    }, [timeRange]);

    return (
        <div className="min-h-screen text-white">
            <NodeNetworkBackground />

            <div className="relative px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <WalletGuard message="Connect wallet to view API analytics">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <Link href="/marketplace">
                                    <button className="p-2 rounded-lg bg-[#111318] border border-[#3AF2FF]/30 hover:bg-[#3AF2FF]/10 transition-all">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">API Analytics</h1>
                                    <p className="text-gray-400 font-mono text-sm">ID: {params.apiId}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex bg-[#111318] rounded-lg border border-[#3AF2FF]/20 p-1">
                                    {(['24h', '7d', '30d'] as const).map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setTimeRange(range)}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeRange === range
                                                ? 'bg-[#3AF2FF]/20 text-[#3AF2FF]'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {range.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <button className="p-2 rounded-lg bg-[#111318] border border-[#3AF2FF]/30 hover:bg-[#3AF2FF]/10 transition-all">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-[#3AF2FF]/10">
                                        <DollarSign className="w-5 h-5 text-[#3AF2FF]" />
                                    </div>
                                    <span className="text-xs text-[#2EE59D] font-mono">+12.5%</span>
                                </div>
                                <div className="text-3xl font-bold mb-1">$1,240.50</div>
                                <div className="text-sm text-gray-400">Total Earnings</div>
                            </div>

                            <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#42E7D6]/20 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-[#42E7D6]/10">
                                        <Zap className="w-5 h-5 text-[#42E7D6]" />
                                    </div>
                                    <span className="text-xs text-[#2EE59D] font-mono">+5.2%</span>
                                </div>
                                <div className="text-3xl font-bold mb-1">845.2k</div>
                                <div className="text-sm text-gray-400">Total Requests</div>
                            </div>

                            <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#A78BFA]/20 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-[#A78BFA]/10">
                                        <Users className="w-5 h-5 text-[#A78BFA]" />
                                    </div>
                                    <span className="text-xs text-[#2EE59D] font-mono">+8.1%</span>
                                </div>
                                <div className="text-3xl font-bold mb-1">1,204</div>
                                <div className="text-sm text-gray-400">Unique Users</div>
                            </div>

                            <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#FF5C5C]/20 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-[#FF5C5C]/10">
                                        <BarChart3 className="w-5 h-5 text-[#FF5C5C]" />
                                    </div>
                                    <span className="text-xs text-[#2EE59D] font-mono">99.9%</span>
                                </div>
                                <div className="text-3xl font-bold mb-1">45ms</div>
                                <div className="text-sm text-gray-400">Avg Latency</div>
                            </div>
                        </div>

                        {/* Main Chart Area */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 p-6 rounded-xl bg-[#111318]/50 border border-[#3AF2FF]/20 backdrop-blur-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#3AF2FF]" />
                                    Request Volume
                                </h3>
                                <div className="h-80 flex items-end gap-2">
                                    {data.map((day, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div className="w-full relative">
                                                <div
                                                    className="w-full bg-[#3AF2FF]/20 hover:bg-[#3AF2FF] transition-all rounded-t-sm"
                                                    style={{ height: `${(day.requests / 600) * 100}%` }}
                                                />
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                                    <div className="bg-[#0C0D10] border border-[#3AF2FF]/30 rounded px-2 py-1 text-xs whitespace-nowrap">
                                                        {day.requests} reqs
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 rotate-45 origin-left translate-y-4">
                                                {day.date}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Top Endpoints */}
                                <div className="p-6 rounded-xl bg-[#111318]/50 border border-[#42E7D6]/20 backdrop-blur-sm">
                                    <h3 className="text-lg font-bold mb-4">Top Endpoints</h3>
                                    <div className="space-y-4">
                                        {[
                                            { path: '/users', count: '450k', percent: 65 },
                                            { path: '/posts', count: '210k', percent: 25 },
                                            { path: '/comments', count: '85k', percent: 10 },
                                        ].map((ep, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-mono text-gray-300">{ep.path}</span>
                                                    <span className="text-gray-500">{ep.count}</span>
                                                </div>
                                                <div className="h-2 bg-[#0C0D10] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#42E7D6]"
                                                        style={{ width: `${ep.percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Errors */}
                                <div className="p-6 rounded-xl bg-[#111318]/50 border border-[#FF5C5C]/20 backdrop-blur-sm">
                                    <h3 className="text-lg font-bold mb-4">Recent Errors</h3>
                                    <div className="space-y-3">
                                        {[
                                            { code: 402, msg: 'Payment Required', time: '2m ago' },
                                            { code: 429, msg: 'Rate Limit Exceeded', time: '15m ago' },
                                            { code: 500, msg: 'Internal Server Error', time: '1h ago' },
                                        ].map((err, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-[#FF5C5C]/5 border border-[#FF5C5C]/10">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[#FF5C5C]">{err.code}</span>
                                                    <span className="text-gray-400">{err.msg}</span>
                                                </div>
                                                <span className="text-xs text-gray-600">{err.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </WalletGuard>
                </div>
            </div>
        </div>
    );
}

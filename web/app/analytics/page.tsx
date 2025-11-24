'use client';

import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { Activity, Globe, Server, Zap, Map, Cpu, Network } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen text-white">
            <NodeNetworkBackground />

            <div className="relative px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">
                        Network <span className="text-[#3AF2FF]">Analytics</span>
                    </h1>
                    <p className="text-gray-400 mb-12">Real-time insights into the Tenso DePIN ecosystem</p>

                    {/* Global Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="p-6 rounded-xl bg-[#111318]/80 border border-[#3AF2FF]/20 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Globe className="w-5 h-5 text-[#3AF2FF]" />
                                <span className="text-gray-400 text-sm">Active Nodes</span>
                            </div>
                            <div className="text-3xl font-bold">1,248</div>
                            <div className="text-xs text-[#2EE59D] mt-1">+12% this week</div>
                        </div>

                        <div className="p-6 rounded-xl bg-[#111318]/80 border border-[#42E7D6]/20 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap className="w-5 h-5 text-[#42E7D6]" />
                                <span className="text-gray-400 text-sm">Total Requests</span>
                            </div>
                            <div className="text-3xl font-bold">8.5M</div>
                            <div className="text-xs text-[#2EE59D] mt-1">+5% today</div>
                        </div>

                        <div className="p-6 rounded-xl bg-[#111318]/80 border border-[#A78BFA]/20 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="w-5 h-5 text-[#A78BFA]" />
                                <span className="text-gray-400 text-sm">Avg Latency</span>
                            </div>
                            <div className="text-3xl font-bold">42ms</div>
                            <div className="text-xs text-[#2EE59D] mt-1">-3ms improvement</div>
                        </div>

                        <div className="p-6 rounded-xl bg-[#111318]/80 border border-[#FF5C5C]/20 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Server className="w-5 h-5 text-[#FF5C5C]" />
                                <span className="text-gray-400 text-sm">Data Volume</span>
                            </div>
                            <div className="text-3xl font-bold">450 TB</div>
                            <div className="text-xs text-[#2EE59D] mt-1">All-time</div>
                        </div>
                    </div>

                    {/* Map & Distribution */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2 p-8 rounded-xl bg-[#111318]/80 border border-[#3AF2FF]/20 backdrop-blur-sm min-h-[400px] flex flex-col">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Map className="w-5 h-5 text-[#3AF2FF]" />
                                Node Distribution
                            </h3>
                            <div className="flex-1 flex items-center justify-center border border-dashed border-gray-800 rounded-lg bg-[#0C0D10]/50">
                                <div className="text-center">
                                    <Globe className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                                    <p className="text-gray-500">Interactive Map Visualization</p>
                                    <p className="text-xs text-gray-600">(Loading WebGL Context...)</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-xl bg-[#111318]/80 border border-[#42E7D6]/20 backdrop-blur-sm">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Network className="w-5 h-5 text-[#42E7D6]" />
                                    Top Regions
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'North America', count: 450, pct: 36 },
                                        { name: 'Europe', count: 380, pct: 30 },
                                        { name: 'Asia Pacific', count: 290, pct: 23 },
                                        { name: 'Others', count: 128, pct: 11 },
                                    ].map((region, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300">{region.name}</span>
                                                <span className="text-gray-500">{region.count}</span>
                                            </div>
                                            <div className="h-2 bg-[#0C0D10] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#42E7D6]"
                                                    style={{ width: `${region.pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-[#111318]/80 border border-[#A78BFA]/20 backdrop-blur-sm">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-[#A78BFA]" />
                                    Network Health
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-[#0C0D10] rounded-lg">
                                        <span className="text-sm text-gray-400">Uptime</span>
                                        <span className="text-[#2EE59D] font-mono">99.99%</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-[#0C0D10] rounded-lg">
                                        <span className="text-sm text-gray-400">Throughput</span>
                                        <span className="text-[#3AF2FF] font-mono">12k TPS</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-[#0C0D10] rounded-lg">
                                        <span className="text-sm text-gray-400">Active Stakes</span>
                                        <span className="text-[#A78BFA] font-mono">$12.5M</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

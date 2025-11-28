'use client';

import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { Activity, Globe, Server, Zap, Map, Cpu, Network, DollarSign, TrendingUp } from 'lucide-react';
import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

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
                            <div className="flex-1 relative bg-gradient-to-br from-[#0C0D10] to-[#111318] rounded-lg overflow-hidden border border-gray-800 min-h-[400px]">
                                <ComposableMap
                                    projection="geoMercator"
                                    projectionConfig={{
                                        scale: 110,
                                        center: [0, 15]
                                    }}
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <Geographies geography="/world.geo.json">
                                        {({ geographies }) =>
                                            geographies.map((geo) => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill="#2a3440"
                                                    stroke="#1e2530"
                                                    strokeWidth={0.5}
                                                    style={{
                                                        default: { outline: 'none' },
                                                        hover: { outline: 'none', fill: '#3a4450' },
                                                        pressed: { outline: 'none' }
                                                    }}
                                                />
                                            ))
                                        }
                                    </Geographies>

                                    {/* City nodes with actual lat/long coordinates */}
                                    {[
                                        { coords: [-122.4194, 37.7749] as [number, number], label: "SF", size: 10, color: "#3AF2FF", nodes: 120 },
                                        { coords: [-74.0060, 40.7128] as [number, number], label: "NYC", size: 12, color: "#3AF2FF", nodes: 150 },
                                        { coords: [-99.1332, 19.4326] as [number, number], label: "MEX", size: 8, color: "#3AF2FF", nodes: 80 },
                                        { coords: [-0.1276, 51.5074] as [number, number], label: "LON", size: 11, color: "#42E7D6", nodes: 145 },
                                        { coords: [2.3522, 48.8566] as [number, number], label: "PAR", size: 9, color: "#42E7D6", nodes: 98 },
                                        { coords: [13.4050, 52.5200] as [number, number], label: "BER", size: 8, color: "#42E7D6", nodes: 75 },
                                        { coords: [-46.6333, -23.5505] as [number, number], label: "SAO", size: 7, color: "#2EE59D", nodes: 52 },
                                        { coords: [3.3792, 6.5244] as [number, number], label: "LAG", size: 6, color: "#FFC247", nodes: 23 },
                                        { coords: [103.8198, 1.3521] as [number, number], label: "SIN", size: 10, color: "#A78BFA", nodes: 88 },
                                        { coords: [139.6917, 35.6895] as [number, number], label: "TOK", size: 12, color: "#A78BFA", nodes: 112 },
                                        { coords: [114.1095, 22.3964] as [number, number], label: "HKG", size: 9, color: "#A78BFA", nodes: 95 },
                                        { coords: [151.2093, -33.8688] as [number, number], label: "SYD", size: 7, color: "#FF5C5C", nodes: 18 },
                                    ].map((city, i) => (
                                        <Marker key={i} coordinates={city.coords}>
                                            {/* Outer glow */}
                                            <circle
                                                r={city.size * 1.5}
                                                fill={city.color}
                                                opacity={0.15}
                                                className="animate-pulse"
                                                style={{ animationDuration: '2s', animationDelay: `${i * 0.1}s` }}
                                            />
                                            {/* Main dot */}
                                            <circle
                                                r={city.size}
                                                fill={city.color}
                                                className="cursor-pointer hover:opacity-80 transition-opacity animate-pulse"
                                                style={{
                                                    animationDuration: '1.5s',
                                                    animationDelay: `${i * 0.1}s`,
                                                    filter: 'drop-shadow(0 0 6px currentColor)'
                                                }}
                                            >
                                                <title>{`${city.label}: ${city.nodes} active nodes`}</title>
                                            </circle>
                                            {/* Label */}
                                            <text
                                                textAnchor="middle"
                                                y={city.size + 16}
                                                style={{
                                                    fontFamily: 'monospace',
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                    fill: city.color,
                                                    textShadow: `0 0 8px ${city.color}`,
                                                    pointerEvents: 'none'
                                                }}
                                            >
                                                {city.label}
                                            </text>
                                        </Marker>
                                    ))}

                                    {/* Connection lines */}
                                    <Line
                                        from={[-122.4194, 37.7749]}
                                        to={[-74.0060, 40.7128]}
                                        stroke="#3AF2FF"
                                        strokeWidth={1}
                                        strokeLinecap="round"
                                        strokeDasharray="5,5"
                                        opacity={0.3}
                                    />
                                    <Line
                                        from={[-74.0060, 40.7128]}
                                        to={[-0.1276, 51.5074]}
                                        stroke="#3AF2FF"
                                        strokeWidth={1}
                                        strokeLinecap="round"
                                        strokeDasharray="5,5"
                                        opacity={0.3}
                                    />
                                    <Line
                                        from={[-0.1276, 51.5074]}
                                        to={[2.3522, 48.8566]}
                                        stroke="#42E7D6"
                                        strokeWidth={1}
                                        strokeLinecap="round"
                                        strokeDasharray="5,5"
                                        opacity={0.3}
                                    />
                                    <Line
                                        from={[2.3522, 48.8566]}
                                        to={[103.8198, 1.3521]}
                                        stroke="#42E7D6"
                                        strokeWidth={1}
                                        strokeLinecap="round"
                                        strokeDasharray="5,5"
                                        opacity={0.3}
                                    />
                                    <Line
                                        from={[103.8198, 1.3521]}
                                        to={[114.1095, 22.3964]}
                                        stroke="#A78BFA"
                                        strokeWidth={1}
                                        strokeLinecap="round"
                                        strokeDasharray="5,5"
                                        opacity={0.3}
                                    />
                                    <Line
                                        from={[114.1095, 22.3964]}
                                        to={[139.6917, 35.6895]}
                                        stroke="#A78BFA"
                                        strokeWidth={1}
                                        strokeLinecap="round"
                                        strokeDasharray="5,5"
                                        opacity={0.3}
                                    />
                                    <Line
                                        from={[139.6917, 35.6895]}
                                        to={[151.2093, -33.8688]}
                                        stroke="#A78BFA"
                                        strokeWidth={1}
                                        strokeLinecap="round"
                                        strokeDasharray="5,5"
                                        opacity={0.3}
                                    />
                                </ComposableMap>
                                {/* Legend */}            <div className="absolute bottom-4 left-4 bg-[#0C0D10]/90 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
                                    <div className="text-xs text-gray-400 mb-2 font-semibold">Global Network</div>
                                    <div className="flex gap-4 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#3AF2FF] animate-pulse"></div>
                                            <span>Active Nodes</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-0.5 bg-gray-600"></div>
                                            <span>Routes</span>
                                        </div>
                                    </div>
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

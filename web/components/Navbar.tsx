'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectWallet } from '@/components/ConnectWallet';
import { LayoutDashboard, Store, Server, BarChart3, BookOpen, Hexagon } from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const navItems = [
        { name: 'Marketplace', path: '/marketplace', icon: Store },
        { name: 'Node Operator', path: '/node-operator', icon: Server },
        { name: 'Seller', path: '/seller', icon: LayoutDashboard },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Docs', path: '/docs', icon: BookOpen },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-[#3AF2FF]/10 bg-[#0C0D10]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <Hexagon className="w-8 h-8 text-[#3AF2FF] group-hover:rotate-90 transition-transform duration-500" />
                            <div className="absolute w-2 h-2 bg-[#3AF2FF] rounded-full animate-pulse" />
                        </div>
                        <span className="text-xl font-bold font-space tracking-tight">
                            TENSO<span className="text-[#3AF2FF]">.NETWORK</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${active
                                        ? 'bg-[#3AF2FF]/10 text-[#3AF2FF]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${active ? 'text-[#3AF2FF]' : 'text-gray-500'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Wallet & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#111318] border border-[#3AF2FF]/20">
                                <div className="w-2 h-2 rounded-full bg-[#2EE59D] animate-pulse" />
                                <span className="text-xs font-mono text-gray-400">Base Sepolia</span>
                            </div>
                        </div>
                        <ConnectWallet />
                    </div>
                </div>
            </div>
        </nav>
    );
}

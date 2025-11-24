'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export function ConnectWallet() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);

    // Fix hydration mismatch - only render wallet UI on client
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render a placeholder button during SSR
        return (
            <button
                className="bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] hover:opacity-90 text-black font-bold px-6 py-2 rounded-lg transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(58,242,255,0.3)]"
                disabled
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
                Connect Wallet
            </button>
        );
    }

    if (isConnected) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#111318] border border-[#3AF2FF]/30 rounded-lg shadow-[0_0_10px_rgba(58,242,255,0.1)]">
                    <div className="w-2 h-2 rounded-full bg-[#3AF2FF] animate-pulse" />
                    <span className="text-sm font-mono text-[#3AF2FF] tracking-wide">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                </div>
                <button
                    onClick={() => disconnect()}
                    className="p-2 text-gray-400 hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 rounded-lg transition-all border border-transparent hover:border-[#FF5C5C]/30"
                    title="Disconnect"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => {
                const connector = connectors[0];
                if (connector) connect({ connector });
            }}
            className="bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] hover:opacity-90 text-black font-bold px-6 py-2 rounded-lg transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(58,242,255,0.3)]"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
            Connect Wallet
        </button>
    );
}

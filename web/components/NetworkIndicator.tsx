'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export function NetworkIndicator() {
    const chainId = useChainId();
    const { isConnected } = useAccount();
    const { switchChain } = useSwitchChain();

    const isCorrectNetwork = chainId === baseSepolia.id;

    if (!isConnected) return null;

    if (!isCorrectNetwork) {
        return (
            <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-3 shadow-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Wrong Network!</span>
                        <span className="text-sm">Please switch to Base Sepolia</span>
                    </div>
                    <button
                        onClick={() => switchChain({ chainId: baseSepolia.id })}
                        className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Switch to Base Sepolia
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-40 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Base Sepolia</span>
        </div>
    );
}

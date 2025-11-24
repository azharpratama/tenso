'use client';

import { useAccount } from 'wagmi';
import { ConnectWallet } from './ConnectWallet';
import { Wallet } from 'lucide-react';

interface WalletGuardProps {
    children: React.ReactNode;
    message?: string;
    icon?: React.ElementType;
}

export function WalletGuard({
    children,
    message = "Connect your wallet to access this feature",
    icon: Icon = Wallet
}: WalletGuardProps) {
    const { isConnected } = useAccount();

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 bg-[#111318] border border-[#3AF2FF]/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(58,242,255,0.05)]">
                    <Icon className="w-10 h-10 text-[#3AF2FF]" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">
                    Wallet Connection <span className="text-[#3AF2FF]">Required</span>
                </h2>
                <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                    {message}
                </p>
                <div className="scale-110">
                    <ConnectWallet />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, usePublicClient } from 'wagmi';
import { parseEther, decodeEventLog } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { TensoFactoryABI } from '@/lib/abis';
import { ConnectWallet } from '@/components/ConnectWallet';

// Factory deployed to Base Sepolia
const FACTORY_ADDRESS = '0xAd27f38E78B95294f7Bb6603210B9AD2c371226f';

export default function CreateApiPage() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
        hash,
    });

    const [name, setName] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [cost, setCost] = useState('0.001'); // ETH
    const [apiId, setApiId] = useState('');

    const isCorrectNetwork = chainId === baseSepolia.id;

    useEffect(() => {
        if (isSuccess && apiId && receipt) {
            extractContractAddressAndSave();
        }
    }, [isSuccess, apiId, receipt]);

    const handleDeploy = async () => {
        if (!isConnected) {
            alert('Please connect wallet first');
            return;
        }

        if (!isCorrectNetwork) {
            alert('Please switch to Base Sepolia network');
            return;
        }

        const generatedApiId = Math.random().toString(36).substring(7);
        setApiId(generatedApiId);

        const priceWei = parseEther(cost);

        writeContract({
            address: FACTORY_ADDRESS,
            abi: TensoFactoryABI,
            functionName: 'createApiToken',
            args: [name, "ACT", generatedApiId, priceWei],
        });
    };

    const extractContractAddressAndSave = async () => {
        try {
            // Find the ApiTokenDeployed event in the logs
            let tokenAddress = null;

            for (const log of receipt!.logs) {
                try {
                    const decoded = decodeEventLog({
                        abi: TensoFactoryABI,
                        data: log.data,
                        topics: log.topics,
                    });

                    if (decoded.eventName === 'ApiTokenDeployed') {
                        tokenAddress = (decoded.args as any).tokenAddress;
                        break;
                    }
                } catch (e) {
                    // Not our event, continue
                    continue;
                }
            }

            if (!tokenAddress) {
                alert('Failed to extract contract address from transaction. Please try again.');
                return;
            }

            // Save metadata with the actual contract address
            const res = await fetch('/api/apis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: apiId,
                    name,
                    baseUrl,
                    contractAddress: tokenAddress,
                    owner: address,
                    pricePerToken: cost,
                    burnRate: 1,
                    createdAt: new Date().toISOString(),
                })
            });

            if (res.ok) {
                alert(`API Created Successfully!\nToken Address: ${tokenAddress}`);
                window.location.href = '/marketplace';
            } else {
                alert('Failed to save API metadata');
            }
        } catch (e) {
            console.error(e);
            alert('Error saving metadata');
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50 dark:bg-zinc-900 text-black dark:text-white">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Create New API</h1>
                    <ConnectWallet />
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">API Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                                placeholder="e.g. Weather API"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Base URL</label>
                            <input
                                type="text"
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                                placeholder="https://api.example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Cost per Token (ETH)</label>
                            <input
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                                step="0.0001"
                            />
                        </div>

                        {!isCorrectNetwork && isConnected && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    ⚠️ Please switch to Base Sepolia network to deploy
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleDeploy}
                            disabled={!isConnected || !isCorrectNetwork || isPending || isConfirming}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {!isCorrectNetwork && isConnected ? 'Wrong Network - Switch to Base Sepolia' :
                                isPending ? 'Confirming in Wallet...' :
                                    isConfirming ? 'Deploying & Extracting Address...' :
                                        'Deploy Token Contract'}
                        </button>

                        {hash && (
                            <div className="text-xs text-gray-500 break-all mt-2">
                                <p>Tx Hash: {hash}</p>
                                {isSuccess && <p className="text-green-600 mt-1">✓ Deployment successful!</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

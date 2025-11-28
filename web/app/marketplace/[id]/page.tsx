'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useSignTypedData } from 'wagmi';
import { ConnectWallet } from '@/components/ConnectWallet';
import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { ArrowLeft, Globe, Zap, Code, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

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

export default function ApiDetailsPage() {
    const params = useParams();
    const { address, isConnected } = useAccount();

    const [api, setApi] = useState<API | null>(null);
    const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
    const [step, setStep] = useState<'idle' | 'calling' | 'signing' | 'success' | 'error'>('idle');
    const [response402, setResponse402] = useState<any>(null);
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [txHash, setTxHash] = useState<string>('');
    const { signTypedDataAsync } = useSignTypedData();

    useEffect(() => {
        fetch('/api/apis')
            .then(res => res.json())
            .then(apis => {
                const found = apis.find((a: any) => a.id === params.id);
                if (found) {
                    setApi(found);
                    if (found.endpoints?.length > 0) {
                        setSelectedEndpoint(found.endpoints[0]);
                    }
                }
            })
            .catch(console.error);
    }, [params.id]);

    const handleCallWithoutPayment = async () => {
        if (!selectedEndpoint) return;

        setStep('calling');
        setResponse402(null);
        setApiResponse(null);

        try {
            const res = await fetch(`http://localhost:3001/api/${api?.id}${selectedEndpoint.path}`, {
                method: selectedEndpoint.method
            });

            if (res.status === 402) {
                const data = await res.json();
                setResponse402(data);
                setStep('idle');
            }
        } catch (e) {
            console.error(e);
            setStep('error');
        }
    };

    const handleCallWithPayment = async () => {
        if (!selectedEndpoint || !address || !api) return;

        setStep('signing');

        try {
            // Generate EIP-3009 signature for USDC transferWithAuthorization
            const nonce = `0x${Math.random().toString(16).slice(2).padStart(64, '0')}`;
            const validAfter = 0;
            const validBefore = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
            const value = BigInt(selectedEndpoint.price);

            // EIP-3009 domain for USDC on Base Sepolia
            const domain = {
                name: 'USD Coin',
                version: '2',
                chainId: 84532,
                verifyingContract: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`
            };

            // EIP-3009 TransferWithAuthorization type
            const types = {
                TransferWithAuthorization: [
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'value', type: 'uint256' },
                    { name: 'validAfter', type: 'uint256' },
                    { name: 'validBefore', type: 'uint256' },
                    { name: 'nonce', type: 'bytes32' }
                ]
            };

            const message = {
                from: address,
                to: '0x6fa35e1f6ab4291432b36f16578614e90750b7e6', // PaymentRouter address
                value: value.toString(),
                validAfter,
                validBefore,
                nonce
            };

            // Sign the typed data
            const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: 'TransferWithAuthorization',
                message
            });

            const paymentSignature = {
                from: address,
                amount: selectedEndpoint.price,
                signature,
                validAfter,
                validBefore,
                nonce
            };

            const paymentHeader = btoa(JSON.stringify({
                x402Version: 1,
                scheme: 'eip712',
                network: 'eip155:84532',
                payload: paymentSignature
            }));

            const res = await fetch(`http://localhost:3001/api/${api?.id}${selectedEndpoint.path}`, {
                method: selectedEndpoint.method,
                headers: {
                    'X-PAYMENT': paymentHeader
                }
            });

            const data = await res.json();
            const paymentResponse = res.headers.get('X-PAYMENT-RESPONSE');

            // Extract TX hash from payment response header or from response data
            let extractedTxHash = '';

            if (paymentResponse) {
                try {
                    const decoded = JSON.parse(atob(paymentResponse));
                    extractedTxHash = decoded.txHash || decoded.transactionHash || '';
                } catch (e) {
                    console.error('Failed to decode payment response:', e);
                }
            }

            // Fallback: check if txHash is in response body
            if (!extractedTxHash && data.txHash) {
                extractedTxHash = data.txHash;
            }

            if (extractedTxHash) {
                setTxHash(extractedTxHash);

                // Log this API call to analytics
                try {
                    await fetch('/api/analytics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            apiId: api.id,
                            endpoint: selectedEndpoint.path,
                            amount: parseFloat(selectedEndpoint.price) / 1_000_000, // Convert to decimal USDC
                            txHash: extractedTxHash
                        })
                    });
                } catch (e) {
                    console.error('Failed to log analytics:', e);
                }
            } else {
                console.warn('No TX hash found in response');
            }

            setApiResponse(data);
            setStep('success');
        } catch (e) {
            console.error(e);
            setStep('error');
        }
    };

    if (!api) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center">
                <NodeNetworkBackground />
                <div className="text-center">
                    <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p>Loading API...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            <NodeNetworkBackground />

            <div className="relative px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/marketplace">
                                <button className="p-2 rounded-lg bg-[#111318] border border-[#3AF2FF]/30 hover:bg-[#3AF2FF]/10 transition-all">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{api.name}</h1>
                                <p className="text-gray-400">{api.description || 'No description'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: API Info + Endpoints */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* API Info */}
                            <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-[#3AF2FF]" />
                                    API Details
                                </h2>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="text-gray-500 mb-1">Base URL</div>
                                        <div className="font-mono text-xs bg-[#0C0D10] p-2 rounded break-all">
                                            {api.baseUrl}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Owner</div>
                                        <div className="font-mono text-xs bg-[#0C0D10] p-2 rounded">
                                            {api.owner.slice(0, 10)}...{api.owner.slice(-8)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Status</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#2EE59D] animate-pulse"></div>
                                            <span className="text-[#2EE59D] font-mono text-xs">402 READY</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Endpoints */}
                            <div className="p-6 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#42E7D6]/20 backdrop-blur-sm">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-[#42E7D6]" />
                                    Endpoints
                                </h2>
                                <div className="space-y-2">
                                    {api.endpoints?.map((endpoint, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedEndpoint(endpoint)}
                                            className={`w-full p-3 rounded-lg text-left transition-all ${selectedEndpoint?.path === endpoint.path
                                                ? 'bg-[#3AF2FF]/20 border-2 border-[#3AF2FF]'
                                                : 'bg-[#0C0D10] border-2 border-transparent hover:border-[#3AF2FF]/30'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-mono ${endpoint.method === 'GET'
                                                    ? 'bg-[#2EE59D]/20 text-[#2EE59D]'
                                                    : 'bg-[#A78BFA]/20 text-[#A78BFA]'
                                                    }`}>
                                                    {endpoint.method}
                                                </span>
                                                <span className="text-[#3AF2FF] font-mono text-sm">
                                                    {(parseFloat(endpoint.price) / 1000000).toFixed(3)} USDC
                                                </span>
                                            </div>
                                            <div className="font-mono text-xs text-gray-400">{endpoint.path}</div>
                                            {endpoint.description && (
                                                <div className="text-xs text-gray-500 mt-1">{endpoint.description}</div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: x402 Tester */}
                        <div className="lg:col-span-2">
                            <div className="p-8 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm h-full">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Code className="w-6 h-6 text-[#3AF2FF]" />
                                    x402 API Tester
                                </h2>

                                {!selectedEndpoint ? (
                                    <div className="text-center py-20 text-gray-500">
                                        Select an endpoint to test
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Request Preview */}
                                        <div>
                                            <div className="text-sm text-gray-400 mb-2">Request</div>
                                            <div className="p-4 bg-[#0C0D10] rounded-lg font-mono text-sm">
                                                <div className="text-[#A78BFA]">{selectedEndpoint.method}</div>
                                                <div className="text-gray-400">
                                                    {api.baseUrl}{selectedEndpoint.path}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={handleCallWithoutPayment}
                                                disabled={step === 'calling'}
                                                className="px-6 py-3 bg-[#111318] border-2 border-[#FFC247] rounded-lg font-semibold text-[#FFC247] hover:bg-[#FFC247]/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <Play className="w-4 h-4" />
                                                {step === 'calling' ? 'Calling...' : 'Call (No Payment)'}
                                            </button>
                                            <button
                                                onClick={handleCallWithPayment}
                                                disabled={!isConnected || step === 'signing'}
                                                className="px-6 py-3 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <Zap className="w-4 h-4" />
                                                {step === 'signing' ? 'Signing...' : 'Call with USDC'}
                                            </button>
                                        </div>

                                        {/* 402 Response */}
                                        {response402 && (
                                            <div>
                                                <div className="text-sm text-[#FFC247] mb-2 flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    HTTP 402 Payment Required
                                                </div>
                                                <pre className="p-4 bg-[#0C0D10] rounded-lg text-xs overflow-x-auto text-[#FFC247]">
                                                    {JSON.stringify(response402, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Success Response */}
                                        {step === 'success' && apiResponse && (
                                            <div>
                                                <div className="text-sm text-[#2EE59D] mb-2 flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" />
                                                    HTTP 200 OK
                                                </div>
                                                <pre className="p-4 bg-[#0C0D10] rounded-lg text-xs overflow-x-auto text-[#2EE59D]">
                                                    {JSON.stringify(apiResponse, null, 2)}
                                                </pre>
                                                {txHash && (
                                                    <div className="mt-3 p-3 bg-[#2EE59D]/10 border border-[#2EE59D]/30 rounded-lg">
                                                        <div className="text-xs text-gray-400 mb-1">Payment Transaction</div>
                                                        <a
                                                            href={`https://sepolia.basescan.org/tx/${txHash}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-mono text-xs text-[#2EE59D] hover:text-[#42E7D6] underline break-all block"
                                                        >
                                                            {txHash}
                                                        </a>
                                                        <div className="text-xs text-gray-500 mt-1">Click to view on BaseScan →</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Error */}
                                        {step === 'error' && (
                                            <div className="p-4 bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-lg flex items-center gap-2">
                                                <XCircle className="w-5 h-5 text-[#FF5C5C]" />
                                                <span className="text-[#FF5C5C]">Request failed</span>
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="p-4 bg-[#3AF2FF]/10 border border-[#3AF2FF]/30 rounded-lg text-sm">
                                            <div className="font-bold mb-2">💡 How it works:</div>
                                            <ol className="space-y-1 text-gray-400 text-xs">
                                                <li>1. Call without payment → Get 402 response with payment details</li>
                                                <li>2. Sign USDC payment (EIP-712) → No gas fees</li>
                                                <li>3. Retry with X-PAYMENT header → Get data + receipt</li>
                                                <li>4. Payment splits: 90% API owner, 8% node, 2% protocol</li>
                                            </ol>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { ArrowLeft, Globe, Plus, Trash2, Upload, Code } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { WalletGuard } from '@/components/WalletGuard';

interface Endpoint {
    path: string;
    method: string;
    price: string;
    description: string;
}

export default function CreateAPIPage() {
    const router = useRouter();
    const { address } = useAccount();
    const [step, setStep] = useState<'manual' | 'openapi'>('manual');
    const [apiName, setApiName] = useState('');
    const [description, setDescription] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [endpoints, setEndpoints] = useState<Endpoint[]>([
        { path: '/endpoint', method: 'GET', price: '1.0', description: '' }
    ]);
    const [openApiUrl, setOpenApiUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const addEndpoint = () => {
        setEndpoints([...endpoints, { path: '', method: 'GET', price: '1.0', description: '' }]);
    };

    const removeEndpoint = (index: number) => {
        setEndpoints(endpoints.filter((_, i) => i !== index));
    };

    const updateEndpoint = (index: number, field: keyof Endpoint, value: string) => {
        const updated = [...endpoints];
        updated[index] = { ...updated[index], [field]: value };
        setEndpoints(updated);
    };

    const handleSubmit = async () => {
        if (!apiName || !baseUrl) {
            alert('Please fill in API name and base URL');
            return;
        }

        if (endpoints.length === 0) {
            alert('Please add at least one endpoint');
            return;
        }

        if (!address) {
            alert('Please connect your wallet');
            return;
        }

        setLoading(true);

        // Convert decimal USDC to 6-decimal format for storage
        const endpointsWithConvertedPrices = endpoints.map(ep => ({
            ...ep,
            price: String(Math.floor(parseFloat(ep.price) * 1_000_000))
        }));

        const newApi = {
            id: Math.random().toString(36).slice(2, 9),
            name: apiName,
            description,
            baseUrl,
            apiKey: apiKey || undefined, // Optional: only if provided
            owner: address,
            endpoints: endpointsWithConvertedPrices,
            createdAt: new Date().toISOString()
        };

        try {
            const res = await fetch('/api/apis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newApi)
            });

            if (!res.ok) throw new Error('Failed to create API');

            router.push('/marketplace');
        } catch (e) {
            alert('Failed to create API');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white">
            <NodeNetworkBackground />

            <div className="relative px-8 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/marketplace">
                            <button className="p-2 rounded-lg bg-[#111318] border border-[#3AF2FF]/30 hover:bg-[#3AF2FF]/10 transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Monetize Your <span className="text-[#3AF2FF]">API</span>
                            </h1>
                            <p className="text-gray-400">
                                Create a new x402-enabled API and start earning USDC
                            </p>
                        </div>
                    </div>

                    <WalletGuard message="Connect your wallet to create and monetize APIs">
                        {/* Import Type Selector */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setStep('manual')}
                                className={`flex-1 p-6 rounded-xl border-2 transition-all ${step === 'manual'
                                    ? 'bg-[#3AF2FF]/20 border-[#3AF2FF]'
                                    : 'bg-[#111318] border-[#3AF2FF]/20 hover:border-[#3AF2FF]/50'
                                    }`}
                            >
                                <Code className="w-8 h-8 text-[#3AF2FF] mb-2" />
                                <div className="text-lg font-bold mb-1">Manual Entry</div>
                                <div className="text-sm text-gray-400">
                                    Define endpoints manually with custom pricing
                                </div>
                            </button>
                            <button
                                onClick={() => setStep('openapi')}
                                className={`flex-1 p-6 rounded-xl border-2 transition-all ${step === 'openapi'
                                    ? 'bg-[#42E7D6]/20 border-[#42E7D6]'
                                    : 'bg-[#111318] border-[#42E7D6]/20 hover:border-[#42E7D6]/50'
                                    }`}
                            >
                                <Upload className="w-8 h-8 text-[#42E7D6] mb-2" />
                                <div className="text-lg font-bold mb-1">Import OpenAPI</div>
                                <div className="text-sm text-gray-400">
                                    Auto-parse endpoints from OpenAPI spec
                                </div>
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-8 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm">
                            {step === 'manual' ? (
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            API Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={apiName}
                                            onChange={(e) => setApiName(e.target.value)}
                                            placeholder="My Awesome API"
                                            className="w-full px-4 py-3 bg-[#0C0D10] border border-[#3AF2FF]/30 rounded-lg focus:border-[#3AF2FF] focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe what your API does..."
                                            rows={3}
                                            className="w-full px-4 py-3 bg-[#0C0D10] border border-[#3AF2FF]/30 rounded-lg focus:border-[#3AF2FF] focus:outline-none resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Base URL *
                                        </label>
                                        <input
                                            type="url"
                                            value={baseUrl}
                                            onChange={(e) => setBaseUrl(e.target.value)}
                                            placeholder="https://api.example.com"
                                            className="w-full px-4 py-3 bg-[#0C0D10] border border-[#3AF2FF]/30 rounded-lg focus:border-[#3AF2FF] focus:outline-none font-mono text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            API Key (Optional)
                                        </label>
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="sk_live_abc123... (for premium/protected APIs)"
                                            className="w-full px-4 py-3 bg-[#0C0D10] border border-[#FFC247]/30 rounded-lg focus:border-[#FFC247] focus:outline-none font-mono text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            🔒 For V2: Keys will be encrypted and stored securely. Leave empty for public APIs.
                                        </p>
                                    </div>

                                    {/* Endpoints */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-sm font-medium">Endpoints *</label>
                                            <button
                                                onClick={addEndpoint}
                                                className="px-4 py-2 bg-[#3AF2FF]/20 border border-[#3AF2FF] rounded-lg text-[#3AF2FF] hover:bg-[#3AF2FF]/30 transition-all flex items-center gap-2 text-sm"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Endpoint
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {endpoints.map((endpoint, i) => (
                                                <div
                                                    key={i}
                                                    className="p-4 bg-[#0C0D10] border border-[#3AF2FF]/20 rounded-lg space-y-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm font-medium text-gray-400">
                                                            Endpoint {i + 1}
                                                        </div>
                                                        {endpoints.length > 1 && (
                                                            <button
                                                                onClick={() => removeEndpoint(i)}
                                                                className="p-1 text-[#FF5C5C] hover:bg-[#FF5C5C]/10 rounded transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-12 gap-3">
                                                        <div className="col-span-2">
                                                            <select
                                                                value={endpoint.method}
                                                                onChange={(e) => updateEndpoint(i, 'method', e.target.value)}
                                                                className="w-full px-3 py-2 bg-[#111318] border border-[#3AF2FF]/20 rounded-lg focus:border-[#3AF2FF] focus:outline-none text-sm"
                                                            >
                                                                <option value="GET">GET</option>
                                                                <option value="POST">POST</option>
                                                                <option value="PUT">PUT</option>
                                                                <option value="DELETE">DELETE</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-span-5">
                                                            <input
                                                                type="text"
                                                                value={endpoint.path}
                                                                onChange={(e) => updateEndpoint(i, 'path', e.target.value)}
                                                                placeholder="/users"
                                                                className="w-full px-3 py-2 bg-[#111318] border border-[#3AF2FF]/20 rounded-lg focus:border-[#3AF2FF] focus:outline-none font-mono text-sm"
                                                            />
                                                        </div>
                                                        <div className="col-span-5">
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    value={endpoint.price}
                                                                    onChange={(e) => updateEndpoint(i, 'price', e.target.value)}
                                                                    placeholder="1.0"
                                                                    className="w-full px-3 py-2 pr-16 bg-[#111318] border border-[#3AF2FF]/20 rounded-lg focus:border-[#3AF2FF] focus:outline-none font-mono text-sm"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                                                    USDC
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <input
                                                        type="text"
                                                        value={endpoint.description}
                                                        onChange={(e) => updateEndpoint(i, 'description', e.target.value)}
                                                        placeholder="Description (optional)"
                                                        className="w-full px-3 py-2 bg-[#111318] border border-[#3AF2FF]/20 rounded-lg focus:border-[#3AF2FF] focus:outline-none text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-3 text-xs text-gray-500">
                                            💡 Price in USDC with 6 decimals (1000000 = 1 USDC, 10000 = 0.01 USDC)
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-6 border-t border-gray-800">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="w-full px-8 py-4 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Creating...' : 'Deploy API to Marketplace'}
                                        </button>
                                        <p className="text-xs text-gray-500 text-center mt-3">
                                            No token deployment needed • x402-enabled automatically
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* OpenAPI Import */
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            OpenAPI Spec URL
                                        </label>
                                        <input
                                            type="url"
                                            value={openApiUrl}
                                            onChange={(e) => setOpenApiUrl(e.target.value)}
                                            placeholder="https://api.example.com/openapi.json"
                                            className="w-full px-4 py-3 bg-[#0C0D10] border border-[#42E7D6]/30 rounded-lg focus:border-[#42E7D6] focus:outline-none font-mono text-sm"
                                        />
                                    </div>

                                    <button
                                        onClick={() => alert('OpenAPI import coming soon!')}
                                        className="w-full px-8 py-4 bg-gradient-to-r from-[#42E7D6] to-[#2EE59D] rounded-lg font-semibold text-black hover:scale-105 transition-all"
                                    >
                                        Import & Parse OpenAPI Spec
                                    </button>

                                    <div className="p-4 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-lg text-sm">
                                        <div className="font-bold mb-2">🚧 Coming Soon</div>
                                        <p className="text-gray-400 text-xs">
                                            Auto-import endpoints from OpenAPI/Swagger specs. For now, use manual entry.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </WalletGuard>
                </div>
            </div>
        </div>
    );
}

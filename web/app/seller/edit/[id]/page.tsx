'use client';

import { useState, useEffect } from 'react';
import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { WalletGuard } from '@/components/WalletGuard';

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

export default function EditAPIPage() {
    const router = useRouter();
    const params = useParams();
    const { address } = useAccount();
    const [apiName, setApiName] = useState('');
    const [description, setDescription] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [originalApi, setOriginalApi] = useState<API | null>(null);

    useEffect(() => {
        if (params.id) {
            loadAPI();
        }
    }, [params.id, address]);

    const loadAPI = async () => {
        try {
            const res = await fetch('/api/apis');
            const allApis = await res.json();
            const api = allApis.find((a: API) => a.id === params.id);

            if (!api) {
                alert('API not found');
                router.push('/seller');
                return;
            }

            if (api.owner.toLowerCase() !== address?.toLowerCase()) {
                alert('You are not the owner of this API');
                router.push('/seller');
                return;
            }

            setOriginalApi(api);
            setApiName(api.name);
            setDescription(api.description || '');
            setBaseUrl(api.baseUrl);

            // Convert prices back to decimal format for display
            const endpointsWithDecimalPrices = api.endpoints.map((ep: Endpoint) => ({
                ...ep,
                price: (parseInt(ep.price) / 1_000_000).toString()
            }));
            setEndpoints(endpointsWithDecimalPrices);
            setLoading(false);
        } catch (e) {
            console.error(e);
            alert('Failed to load API');
            router.push('/seller');
        }
    };

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

    const handleSave = async () => {
        if (!apiName || !baseUrl) {
            alert('Please fill in API name and base URL');
            return;
        }

        if (endpoints.length === 0) {
            alert('Please add at least one endpoint');
            return;
        }

        setSaving(true);

        // Convert decimal USDC to 6-decimal format for storage
        const endpointsWithConvertedPrices = endpoints.map(ep => ({
            ...ep,
            price: String(Math.floor(parseFloat(ep.price) * 1_000_000))
        }));

        const updatedApi = {
            ...originalApi,
            name: apiName,
            description,
            baseUrl,
            endpoints: endpointsWithConvertedPrices
        };

        try {
            const res = await fetch(`/api/apis?id=${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedApi)
            });

            if (!res.ok) throw new Error('Failed to update API');

            router.push('/seller');
        } catch (e) {
            alert('Failed to update API');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center">
                <NodeNetworkBackground />
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#3AF2FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading API...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            <NodeNetworkBackground />

            <div className="relative px-8 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/seller">
                            <button className="p-2 rounded-lg bg-[#111318] border border-[#3AF2FF]/30 hover:bg-[#3AF2FF]/10 transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Edit <span className="text-[#3AF2FF]">API</span>
                            </h1>
                            <p className="text-gray-400">
                                Update your API configuration and pricing
                            </p>
                        </div>
                    </div>

                    <WalletGuard message="Connect your wallet to edit APIs">
                        {/* Form */}
                        <div className="p-8 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm">
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

                                {/* Endpoints */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm font-medium">Endpoints *</label>
                                        <button
                                            onClick={addEndpoint}
                                            className="px-4 py-2 bg-[#3AF2FF]/20 border border-[#3AF2FF] rounded-lg text-[#3AF2FF] hover:bg-[#3AF2FF]/30 transition-all flex items-center gap-2text-sm"
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
                                </div>

                                {/* Submit */}
                                <div className="pt-6 border-t border-gray-800 flex gap-3">
                                    <button
                                        onClick={() => router.push('/seller')}
                                        className="flex-1 px-8 py-4 bg-[#111318] border border-gray-700 rounded-lg font-semibold text-gray-300 hover:bg-gray-800 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </WalletGuard>
                </div>
            </div>
        </div>
    );
}

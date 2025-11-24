'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NodeNetworkBackground from '@/components/NodeNetworkBackground';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditAPIPage() {
    const params = useParams();
    const router = useRouter();
    const [api, setApi] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/apis')
            .then(res => res.json())
            .then(apis => {
                const found = apis.find((a: any) => a.id === params.id);
                setApi(found);
                setLoading(false);
            })
            .catch(console.error);
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center">
                <NodeNetworkBackground />
                <div>Loading...</div>
            </div>
        );
    }

    if (!api) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center">
                <NodeNetworkBackground />
                <div>API not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            <NodeNetworkBackground />

            <div className="relative px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/seller"
                            className="inline-flex items-center gap-2 text-[#3AF2FF] hover:underline mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="text-[#3AF2FF]">Edit</span> API
                        </h1>
                        <p className="text-gray-400">Update your API configuration</p>
                    </div>

                    {/* Coming Soon Notice */}
                    <div className="p-8 rounded-xl bg-gradient-to-b from-[#111318] to-transparent border border-[#3AF2FF]/20 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#3AF2FF]/10 border border-[#3AF2FF]/30 flex items-center justify-center">
                                <Save className="w-8 h-8 text-[#3AF2FF]" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Edit Functionality Coming Soon</h2>
                            <p className="text-gray-400 mb-6">
                                API editing will be available in Phase 2. For now, you can delete and recreate APIs.
                            </p>

                            {/* Show current API info */}
                            <div className="mt-8 p-6 bg-[#0C0D10] rounded-lg text-left">
                                <h3 className="text-lg font-bold mb-4">Current Configuration</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Name:</span>
                                        <span>{api.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Base URL:</span>
                                        <span className="font-mono text-xs">{api.baseUrl}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Endpoints:</span>
                                        <span>{api.endpoints?.length || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/seller"
                                    className="px-6 py-3 bg-gradient-to-r from-[#3AF2FF] to-[#42E7D6] rounded-lg font-semibold text-black hover:scale-105 transition-all inline-flex items-center gap-2"
                                >
                                    Return to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

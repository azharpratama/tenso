import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ANALYTICS_PATH = path.join(process.cwd(), '../forwarder/data/analytics.json');

function getAnalytics() {
    try {
        const data = fs.readFileSync(ANALYTICS_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveAnalytics(analytics: any[]) {
    fs.writeFileSync(ANALYTICS_PATH, JSON.stringify(analytics, null, 2));
}

// Log a new API call
export async function POST(request: Request) {
    const body = await request.json();

    const analytics = getAnalytics();

    const callLog = {
        apiId: body.apiId,
        endpoint: body.endpoint,
        amount: body.amount, // in USDC (decimal)
        timestamp: Date.now(),
        txHash: body.txHash
    };

    analytics.push(callLog);
    saveAnalytics(analytics);

    return NextResponse.json({ success: true });
}

// Get analytics summary
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const apiId = searchParams.get('apiId');

    const analytics = getAnalytics();

    // Filter by API ID if provided
    const filteredAnalytics = apiId
        ? analytics.filter((call: any) => call.apiId === apiId)
        : analytics;

    const totalVolume = filteredAnalytics.reduce((sum: number, call: any) => sum + (call.amount || 0), 0);
    const totalCalls = filteredAnalytics.length;

    return NextResponse.json({
        totalVolume,
        totalCalls,
        recentCalls: filteredAnalytics.slice(-10).reverse()
    });
}

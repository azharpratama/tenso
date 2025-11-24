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
export async function GET() {
    const analytics = getAnalytics();

    const totalVolume = analytics.reduce((sum: number, call: any) => sum + (call.amount || 0), 0);
    const totalCalls = analytics.length;

    return NextResponse.json({
        totalVolume,
        totalCalls,
        recentCalls: analytics.slice(-10).reverse()
    });
}

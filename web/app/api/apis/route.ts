import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '../forwarder/data/apis.json');

function getApis() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveApis(apis: any[]) {
    fs.writeFileSync(DB_PATH, JSON.stringify(apis, null, 2));
}

export async function GET() {
    const apis = getApis();
    return NextResponse.json(apis);
}

export async function POST(request: Request) {
    const body = await request.json();
    const apis = getApis();

    const newApi = {
        id: body.id || Math.random().toString(36).substring(7),
        ...body,
        createdAt: new Date().toISOString(),
    };

    apis.push(newApi);
    saveApis(apis);

    return NextResponse.json(newApi);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'API ID required' }, { status: 400 });
    }

    const apis = getApis();
    const filteredApis = apis.filter((api: any) => api.id !== id);

    if (filteredApis.length === apis.length) {
        return NextResponse.json({ error: 'API not found' }, { status: 404 });
    }

    saveApis(filteredApis);
    return NextResponse.json({ success: true });
}

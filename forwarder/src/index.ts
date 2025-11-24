import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as dotenv from 'dotenv'

// Load .env from root directory
dotenv.config({ path: join(__dirname, '../../.env') })

const app = new Hono()
app.use('/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-PAYMENT'],
    exposeHeaders: ['X-PAYMENT-RESPONSE']
}))


// Load APIs
const DB_PATH = join(__dirname, '../data/apis.json')
const getApis = () => {
    try {
        return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
    } catch (e) {
        return []
    }
}

// Viem Client for Base Sepolia
const client = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.RPC_URL || 'https://sepolia.base.org')
})

// Wallet Client for sending transactions
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(process.env.RPC_URL || 'https://sepolia.base.org')
})

// Contract addresses
const PAYMENT_VERIFIER_ADDRESS = process.env.PAYMENT_VERIFIER_ADDRESS as `0x${string}`
const PAYMENT_ROUTER_ADDRESS = process.env.PAYMENT_ROUTER_ADDRESS as `0x${string}`
const NODE_OPERATOR_ADDRESS = process.env.NODE_OPERATOR_ADDRESS as `0x${string}`

// ============================================================================
// x402 Facilitator Endpoints
// ============================================================================

/**
 * GET /supported
 * Returns list of supported payment schemes and networks
 */
app.get('/supported', (c) => {
    return c.json({
        kinds: [
            { scheme: "eip712", network: "eip155:84532" },  // Base Sepolia
            { scheme: "onchain", network: "eip155:84532" }  // Fallback
        ]
    })
})

/**
 * POST /verify
 * Verify payment signature without executing
 */
app.post('/verify', async (c) => {
    try {
        const { x402Version, paymentHeader, paymentRequirements } = await c.req.json()

        if (x402Version !== 1) {
            return c.json({ isValid: false, invalidReason: "Unsupported x402 version" })
        }

        // Decode payment payload
        const payload = JSON.parse(atob(paymentHeader))

        // Basic validation
        if (!payload.scheme || !payload.network || !payload.payload) {
            return c.json({ isValid: false, invalidReason: "Invalid payment payload" })
        }

        // TODO: Call PaymentVerifier contract to verify signature
        // For now, basic checks
        const isValid = payload.scheme === "eip712" && payload.network === "eip155:84532"

        return c.json({
            isValid,
            invalidReason: isValid ? null : "Invalid payment scheme or network"
        })
    } catch (e: unknown) {
        const error = e as Error
        return c.json({
            isValid: false,
            invalidReason: `Verification error: ${error.message}`
        })
    }
})

/**
 * POST /settle
 * Execute payment on-chain
 */
app.post('/settle', async (c) => {
    try {
        const { x402Version, paymentHeader, apiOwner, nodeOperator, amount } = await c.req.json()

        const payload = JSON.parse(atob(paymentHeader))

        // Extract signature components from payload (for consent verification)
        const sig = payload.payload
        if (!sig || !sig.from) {
            throw new Error('Invalid signature payload - missing payer address')
        }

        console.log(`Processing payment: ${amount} USDC from ${sig.from} to split between API owner and node`)

        // SPONSORED PAYMENT MODEL:
        // Instead of using user's signature to authorize transfer,
        // the forwarder pays from its own wallet on behalf of the user

        // Step 1: Approve PaymentRouter to spend USDC
        const USDC_ABI = parseAbi([
            'function approve(address spender, uint256 amount) external returns (bool)'
        ])

        console.log('Approving PaymentRouter...')
        const approveHash = await walletClient.writeContract({
            address: process.env.USDC_ADDRESS as `0x${string}`,
            abi: USDC_ABI,
            functionName: 'approve',
            args: [PAYMENT_ROUTER_ADDRESS, BigInt(amount)]
        })

        await client.waitForTransactionReceipt({ hash: approveHash })
        console.log('Approval confirmed:', approveHash)

        // Step 2: Call PaymentRouter.splitPayment
        const SPLIT_PAYMENT_ABI = parseAbi([
            'function splitPayment(address apiOwner, address nodeOperator, uint256 amount) external'
        ])

        console.log('Executing payment split...')
        const hash = await walletClient.writeContract({
            address: PAYMENT_ROUTER_ADDRESS,
            abi: SPLIT_PAYMENT_ABI,
            functionName: 'splitPayment',
            args: [
                apiOwner as `0x${string}`,
                nodeOperator as `0x${string}`,
                BigInt(amount)
            ]
        })

        // Wait for transaction confirmation
        const receipt = await client.waitForTransactionReceipt({ hash })
        console.log('Payment split successful:', hash)

        return c.json({
            success: true,
            error: null,
            txHash: hash,
            networkId: "eip155:84532"
        })
    } catch (e: unknown) {
        const error = e as Error
        console.error('Settlement error:', error)
        return c.json({
            success: false,
            error: error.message,
            txHash: null,
            networkId: null
        })
    }
})

// ============================================================================
// API Proxy with x402 Payment Required
// ============================================================================

/**
 * ALL /api/:apiId/*
 * Proxy API requests with x402 payment verification
 */
app.all('/api/:apiId/*', async (c) => {
    const apiId = c.req.param('apiId')
    const requestPath = c.req.path.replace(`/api/${apiId}`, '')
    const method = c.req.method
    const paymentHeader = c.req.header('X-PAYMENT')

    // Load API config
    const apis = getApis()
    const api = apis.find((a: any) => a.id === apiId)

    if (!api) {
        return c.json({ error: "API not found" }, 404)
    }

    // Find matching endpoint
    const endpoint = api.endpoints?.find((e: any) =>
        e.path === requestPath && e.method === method
    )

    if (!endpoint) {
        return c.json({ error: "Endpoint not found" }, 404)
    }

    // If no payment header, return 402 Payment Required
    if (!paymentHeader) {
        return c.json({
            x402Version: 1,
            error: "payment_required",
            errorMessage: `Payment of ${endpoint.price} USDC required`,
            accepts: [{
                scheme: "eip712",
                network: "eip155:84532",
                maxAmountRequired: endpoint.price,
                resource: c.req.url,
                description: `${api.name}: ${endpoint.description || endpoint.path}`,
                mimeType: "application/json",
                payTo: api.owner,
                asset: process.env.USDC_ADDRESS,
                maxTimeoutSeconds: 86400,
                outputSchema: {
                    input: {
                        type: "http",
                        method: endpoint.method,
                        discoverable: true
                    }
                }
            }]
        }, 402)
    }

    // Verify payment
    const verifyRes = await fetch('http://localhost:3001/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x402Version: 1,
            paymentHeader,
            paymentRequirements: {
                scheme: "eip712",
                network: "eip155:84532",
                maxAmountRequired: endpoint.price,
                payTo: api.owner
            }
        })
    })

    const { isValid, invalidReason } = await verifyRes.json()

    if (!isValid) {
        return c.json({
            x402Version: 1,
            error: "invalid_payment",
            errorMessage: invalidReason || "Payment verification failed"
        }, 402)
    }

    // Settle payment
    const settleRes = await fetch('http://localhost:3001/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x402Version: 1,
            paymentHeader,
            apiOwner: api.owner,
            nodeOperator: NODE_OPERATOR_ADDRESS,
            amount: endpoint.price
        })
    })

    const settlementResult = await settleRes.json()

    // Forward request to upstream API
    const upstreamUrl = api.baseUrl + requestPath
    console.log(`Forwarding to: ${upstreamUrl}`)

    const hasParams = c.req.method !== 'GET'
    const upstreamRes = await fetch(upstreamUrl, {
        method: c.req.method,
        ...(hasParams && {
            body: await c.req.text(),
            headers: { 'Content-Type': 'application/json' }
        })
    })

    const data = await upstreamRes.json()

    // Return response with X-PAYMENT-RESPONSE header
    const paymentResponse = btoa(JSON.stringify({
        success: settlementResult.success,
        txHash: settlementResult.txHash,
        networkId: settlementResult.networkId
    }))

    return c.json(data, {
        headers: {
            'X-PAYMENT-RESPONSE': paymentResponse
        }
    })
})

// ============================================================================
// Health Check
// ============================================================================

app.get('/', (c) => {
    return c.json({
        service: "Tenso Forwarder (x402)",
        version: "2.0.0",
        network: "Base Sepolia",
        endpoints: {
            facilitator: ["/verify", "/settle", "/supported"],
            proxy: "/api/:apiId/*"
        },
        contracts: {
            paymentVerifier: PAYMENT_VERIFIER_ADDRESS,
            paymentRouter: PAYMENT_ROUTER_ADDRESS,
            nodeOperator: NODE_OPERATOR_ADDRESS
        }
    })
})

// Start server
const port = 3001
console.log(`🚀 Tenso x402 Forwarder running on port ${port}`)
console.log(`📍 Network: Base Sepolia`)
console.log(`💳 Payment Verifier: ${PAYMENT_VERIFIER_ADDRESS}`)
console.log(`💰 Payment Router: ${PAYMENT_ROUTER_ADDRESS}`)

serve({
    fetch: app.fetch,
    port
})

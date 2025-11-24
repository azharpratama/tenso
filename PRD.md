# Tenso PRD v3.0 - x402 Payment Gateway Network

**Decentralized Infrastructure for AI Agent Payments | Built on x402 Protocol**

---

## Executive Summary

Tenso is a **decentralized network of payment gateway nodes** that enables AI agents to pay for API access using the x402 protocol. Node operators earn fees for verifying payments and routing requests, while API providers monetize their endpoints with zero-friction blockchain payments.

**The Problem:**
- AI agents need programmatic access to paid APIs
- Traditional payment methods (credit cards, OAuth) don't work for agents
- Existing crypto solutions are too complex (high fees, slow settlement)

**The Solution:**
- x402-compliant payment gateway network
- Node operators run forwarder infrastructure
- Direct USDC payments to API owners
- Instant settlement, zero platform fees
- Built for AI agents

---

## Why x402?

**x402** is Coinbase's open protocol for internet-native payments, built on HTTP 402 Payment Required.

**Key Benefits:**
- 🌐 **HTTP Native** - Works with any HTTP stack
- ⚡ **Instant Settlement** - 2 seconds, not T+2 days
- 💰 **Zero Platform Fees** - No percentage cuts
- 🔓 **Frictionless** - No registration, no OAuth
- 🤖 **AI Agent Ready** - Perfect for autonomous payments
- 🔗 **Chain Agnostic** - Any blockchain, any token

**x402 Flow:**
```
1. Agent → GET /api/data
2. Server → 402 Payment Required + payment details
3. Agent → Signs payment (USDC)
4. Agent → GET /api/data + X-PAYMENT header
5. Server → Verifies payment
6. Server → 200 OK + data + X-PAYMENT-RESPONSE
```

---

## Tenso as DePIN

### What is DePIN?

**DePIN** = Decentralized Physical Infrastructure Networks

Networks where individuals operate physical infrastructure (servers, hotspots, storage) and earn rewards.

**Examples:**
- Helium (wireless hotspots)
- Filecoin (storage nodes)
- Livepeer (video transcoding)
- **Tenso (payment gateway nodes)**

### Tenso's DePIN Architecture

```
┌─────────────────────────────────────────────────┐
│          Forwarder Node Network                 │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Node 1  │  │  Node 2  │  │  Node 3  │     │
│  │ US-East  │  │ EU-West  │  │  Asia    │     │
│  │ Earns 8% │  │ Earns 8% │  │ Earns 8% │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  Anyone can run a node • Stake TENSO tokens   │
│  Geographic distribution • Earn USDC fees      │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│         Smart Contracts (Base)                  │
│  • NodeRegistry (on-chain node list)           │
│  • PaymentRouter (3-way split)                 │
│  • PaymentVerifier (x402 verification)         │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              Revenue Split                      │
│  90% → API Owner                                │
│   8% → Node Operator                            │
│   2% → Protocol Treasury                        │
└─────────────────────────────────────────────────┘
```

---

## How It Works

### For AI Agents (Buyers)

1. **Discover API** on Tenso marketplace
2. **Call endpoint** without payment
3. **Receive 402 response** with payment requirements
4. **Sign USDC payment** (gasless via EIP-712)
5. **Retry with X-PAYMENT header**
6. **Get data** + payment receipt

**Example:**
```bash
# Step 1: Call API
curl https://node1.tenso.network/api/weather/current

# Response: 402 Payment Required
{
  "x402Version": 1,
  "accepts": [{
    "scheme": "eip712",
    "network": "eip155:8453",
    "asset": "0xUSDC",
    "amount": "1000000",  // 1 USDC
    "payTo": "0xAPIOwner"
  }]
}

# Step 2: Sign payment (in code)
signature = signUSDCPayment(...)

# Step 3: Retry with payment
curl -H "X-PAYMENT: <signature>" \
     https://node1.tenso.network/api/weather/current

# Response: 200 OK + data
```

### For API Providers (Sellers)

1. **Import OpenAPI spec** or add endpoints manually
2. **Set price per endpoint** (in USDC)
3. **Receive payment wallet address**
4. **APIs go live** on node network
5. **Earn 90% of every call**

**No token deployment, no complex contracts!**

### For Node Operators

1. **Stake 10,000 TENSO tokens** (refundable)
2. **Run forwarder software** on your server
3. **Register node on-chain** with location
4. **Start processing requests**
5. **Earn 8% of all payments** routed through your node

**Revenue Model:**
```
1,000 APIs using your node
1,000 calls/day per API
$0.01 per call average

Total calls: 1M/day
Your fee: 8% = $0.0008/call
Daily revenue: $800
Monthly: $24,000

Server costs: ~$500/month
Net profit: $23,500/month
```

---

## Technical Architecture

### 1. Smart Contracts (Base)

#### NodeRegistry
```solidity
contract NodeRegistry {
    struct Node {
        address operator;
        string endpoint;  // https://node1.example.com
        string region;    // US-EAST, EU-WEST, etc.
        uint256 stakeAmount;
        uint256 reputation;
        bool active;
    }
    
    mapping(address => Node) public nodes;
    
    function registerNode(
        string memory endpoint,
        string memory region
    ) external payable {
        require(msg.value >= 10000 * 10**18, "Insufficient stake");
        nodes[msg.sender] = Node({
            operator: msg.sender,
            endpoint: endpoint,
            region: region,
            stakeAmount: msg.value,
            reputation: 100,
            active: true
        });
    }
    
    function getActiveNodes() external view returns (Node[] memory);
}
```

#### PaymentRouter
```solidity
contract PaymentRouter {
    address public protocolTreasury;
    
    function splitPayment(
        address apiOwner,
        address nodeOperator,
        uint256 amount
    ) external {
        uint256 ownerShare = amount * 90 / 100;   // 90%
        uint256 nodeShare = amount * 8 / 100;     // 8%
        uint256 protocolShare = amount * 2 / 100; // 2%
        
        USDC.transfer(apiOwner, ownerShare);
        USDC.transfer(nodeOperator, nodeShare);
        USDC.transfer(protocolTreasury, protocolShare);
        
        emit PaymentSplit(apiOwner, nodeOperator, amount);
    }
}
```

#### PaymentVerifier (x402)
```solidity
contract PaymentVerifier {
    // Verify EIP-712 USDC permit signature
    function verifyPayment(
        address from,
        address to,
        uint256 amount,
        uint256 deadline,
        bytes memory signature
    ) external view returns (bool);
    
    // Execute payment via USDC transferWithAuthorization
    function executePayment(
        address from,
        address to,
        uint256 amount,
        bytes memory signature
    ) external returns (bytes32 txHash);
}
```

### 2. Node Network

#### Node Selection Algorithm

```typescript
// Client-side: Pick best node
async function selectNode(apiId: string, userLocation: string) {
  const nodes = await getActiveNodes()
  
  // Filter by region
  const nearbyNodes = nodes.filter(n => 
    calculateDistance(n.region, userLocation) < 5000 // km
  )
  
  // Sort by reputation + latency
  const ranked = nearbyNodes.sort((a, b) => {
    const scoreA = a.reputation * 0.7 + (1000 / a.latency) * 0.3
    const scoreB = b.reputation * 0.7 + (1000 / b.latency) * 0.3
    return scoreB - scoreA
  })
  
  return ranked[0] // Best node
}
```

#### Node Forwarder Service

```typescript
// POST /verify (x402 facilitator endpoint)
app.post('/verify', async (c) => {
  const { x402Version, paymentHeader, paymentRequirements } = await c.req.json()
  
  const payload = JSON.parse(atob(paymentHeader))
  
  // Verify signature on-chain
  const isValid = await paymentVerifier.verifyPayment(
    payload.from,
    payload.to,
    payload.amount,
    payload.signature
  )
  
  return c.json({ isValid, invalidReason: isValid ? null : "Invalid signature" })
})

// POST /settle
app.post('/settle', async (c) => {
  const { paymentHeader, paymentRequirements } = await c.req.json()
  const payload = JSON.parse(atob(paymentHeader))
  
  // Execute payment on-chain
  const txHash = await paymentRouter.splitPayment(
    paymentRequirements.payTo,  // API owner (90%)
    nodeOperatorAddress,         // This node (8%)
    payload.amount
  )
  
  return c.json({
    success: true,
    txHash,
    networkId: "eip155:8453"
  })
})

// Forward request to upstream API
app.all('/api/:apiId/*', async (c) => {
  const paymentHeader = c.req.header('X-PAYMENT')
  
  if (!paymentHeader) {
    return c.json({
      x402Version: 1,
      accepts: [/* payment requirements */]
    }, 402)
  }
  
  // Verify + settle payment
  await verifyAndSettle(paymentHeader)
  
  // Forward to upstream
  const response = await fetch(upstreamUrl, {
    method: c.req.method,
    headers: c.req.headers,
    body: c.req.body
  })
  
  return response
})
```

### 3. Frontend (Next.js)

#### API Provider Dashboard
- **Create API** - Import OpenAPI or manual entry
- **Set Pricing** - Per-endpoint USDC pricing
- **View Analytics** - Calls, revenue, top consumers
- **Withdraw Funds** - One-click withdrawal

#### Node Operator Dashboard
- **Register Node** - Stake tokens, set location
- **Monitor Stats** - Requests processed, earnings
- **Withdraw Earnings** - Claim USDC fees
- **Reputation Score** - Uptime, latency metrics

#### AI Agent Marketplace
- **Browse APIs** - Discover available endpoints
- **View Pricing** - USDC cost per call
- **Test Endpoint** - Built-in x402 tester
- **Pay & Call** - Instant payments

---

## Tokenomics

### TENSO Token

**Purpose:**
- Node operator staking (quality control)
- Governance (future)
- Incentive alignment

**Initial Supply:** 100M TENSO

**Distribution:**
- 40% - Node operator rewards (vested over 4 years)
- 25% - Team (4-year vest, 1-year cliff)
- 20% - Community treasury
- 10% - Investors
- 5% - Liquidity

**Staking Requirements:**
- Minimum stake: 10,000 TENSO (~$1,000 at launch)
- Refundable when leaving network
- Slashed for downtime/malicious behavior

**Why Stake?**
- Proves commitment to network
- Economic security (skin in the game)
- Prevents Sybil attacks

### Revenue Flows (USDC)

**Per API Call:**
```
Payment: $0.01 USDC
├─ $0.009 → API Owner (90%)
├─ $0.0008 → Node Operator (8%)
└─ $0.0002 → Protocol Treasury (2%)
```

**Protocol Treasury Use:**
- Development
- Security audits
- Node operator bonus rewards
- Marketing & growth

**Note:** All fees paid in USDC (stablecoins), not TENSO! This ensures:
- Predictable pricing for AI agents
- Stable income for API owners
- No token price volatility affecting operations

---

## Go-to-Market Strategy

### Phase 1: Launch (Months 1-3)
- Deploy contracts to Base Mainnet
- Run 3 seed nodes (US, EU, Asia)
- Onboard 10 API providers
- Target AI agent developers

### Phase 2: Decentralize (Months 4-6)
- Open node registration
- Onboard 50 community operators
- Launch TENSO token
- Add 100+ APIs

### Phase 3: Scale (Months 7-12)
- 500+ active nodes
- 1,000+ APIs
- 10M+ API calls/month
- Multi-chain expansion (Optimism, Arbitrum)

---

## Competitive Landscape

| Feature | Tenso | Nexus | RapidAPI | Helium |
|---------|-------|-------|----------|--------|
| DePIN | ✅ | ❌ | ❌ | ✅ |
| x402 Protocol | ✅ | ✅ | ❌ | N/A |
| Node Operators | ✅ | ❌ | ❌ | ✅ |
| Geographic Distribution | ✅ | ✅ | ✅ | ✅ |
| AI Agent Focus | ✅ | ✅ | ❌ | ❌ |
| Zero Platform Fees | ✅ | ✅ | ❌ | ✅ |
| Permissionless | ✅ | ❌ | ❌ | ✅ |
| Stablecoin Payments | ✅ | ✅ | ❌ | ❌ |

**Key Differentiator:** Only DePIN network for x402 payments

---

## Success Metrics

### Network Health
- Active nodes: Target 500+
- Geographic coverage: 50+ countries
- Average latency: <100ms
- Uptime: >99.9%

### API Provider Metrics
- APIs deployed: 1,000+
- Average revenue per API: $500/month
- Top API revenue: $10,000/month

### Node Operator Metrics
- Average earnings: $2,000/month per node
- Top node earnings: $20,000/month
- Stake utilization: 80%+

### AI Agent Metrics
- Daily API calls: 10M+
- Average payment: $0.01-$0.10
- Payment success rate: >98%

### Protocol Metrics
- Total volume: $1M+/month
- Treasury balance: $20k+/month
- Token market cap: $10M+

---

## Implementation Roadmap

### ✅ MVP (Hackathon Demo) - COMPLETE
- [x] x402 forwarder (single node)
- [x] Payment verification (EIP-712 signatures)
- [x] Smart contracts deployed (NodeRegistry, PaymentRouter, PaymentVerifier)
- [x] 90/8/2 revenue split on-chain
- [x] Seller dashboard with analytics
- [x] Node operator dashboard
- [x] Marketplace with real-time stats
- [x] Dynamic analytics tracking
- [x] Docker deployment
- [x] Comprehensive documentation

**Live on Base Sepolia:**
- PaymentRouter: `0x6fa35e1f6ab4291432b36f16578614e90750b7e6`
- PaymentVerifier: `0xa73d7c7703b23cc4692fdd817345ad29db5ac4e9`
- NodeRegistry: `0x5b2222610e04380e1caf3988d88fbd15686a1b6c`

### V1 (Post-Hackathon)
- [ ] Deploy to Base Mainnet
- [ ] Launch 3 seed nodes across regions
- [ ] TENSO token deployment
- [ ] Node staking implementation
- [ ] OpenAPI import feature
- [ ] Multi-endpoint per API
- [ ] Onboard 10 production APIs

### V2 (Growth Phase)
- [ ] Open node registration (permissionless)
- [ ] Geographic load balancing
- [ ] Reputation system with slashing
- [ ] Advanced analytics dashboard
- [ ] Multi-chain support (Optimism, Arbitrum)
- [ ] AI agent SDK (Python, JavaScript)

### V3 (Scale Phase)
- [ ] Governance (DAO)
- [ ] Advanced routing (ML-based)
- [ ] Cross-chain payments
- [ ] Enterprise features
- [ ] SLA guarantees

---

## Risk Mitigation

### Node Centralization Risk
**Risk:** Few operators run many nodes
**Mitigation:**
- Stake requirements increase with node count
- Reputation scores favor newer operators
- Geographic diversity bonuses

### Payment Failures
**Risk:** Node goes offline mid-payment
**Mitigation:**
- Payment finality before forwarding
- Automatic failover to backup nodes
- Slashing for bad actors

### Low Adoption
**Risk:** Not enough APIs or nodes
**Mitigation:**
- Seed funding for early nodes
- Free tier for API providers

---

## Why Tenso Wins DePIN Hackathon 🏆

### 1. **Real DePIN Architecture**
- Distributed node network
- Permissionless participation
- Token incentives
- Geographic distribution

### 2. **Trending Technology**
- x402 protocol (Coinbase-backed, brand new)
- AI agent payments (hot topic)
- Stablecoin economy

### 3. **Sustainable Economics**
- Everyone makes money (API owners, nodes, protocol)
- No platform fees eating into profits
- Predictable stablecoin revenue

### 4. **Working Product**
- Functional forwarder
- Real x402 implementation
- Live on Base Sepolia
- Ready to scale

### 5. **Clear Vision**
- Phase 1: Centralized (rapid launch)
- Phase 2: Hybrid (community nodes)
- Phase 3: Fully decentralized (DAO)

---

## Appendix

### Example: Node Operator Setup

```bash
# Install forwarder
git clone https://github.com/tenso-network/forwarder
cd forwarder && npm install

# Configure
cat > .env << EOF
NODE_OPERATOR_ADDRESS=0x...
STAKE_AMOUNT=10000
REGION=US-EAST
RPC_URL=https://base-mainnet.g.alchemy.com/...
EOF

# Stake and register
npm run register-node

# Start earning
npm run start
```

### Example: API Provider Onboarding

```bash
# Option 1: Import OpenAPI
curl -X POST https://tenso.network/api/import \
  -H "Content-Type: application/json" \
  -d '{
    "openapi_url": "https://api.weather.com/openapi.json",
    "default_price": "0.01"  // USDC per call
  }'

# Option 2: Manual entry
# Use dashboard UI to add endpoints
```

### Example: AI Agent Integration

```python
import requests
from web3 import Web3

# Call API
response = requests.get("https://node1.tenso.network/api/weather/current")

if response.status_code == 402:
    # Payment required
    payment_req = response.json()["accepts"][0]
    
    # Sign payment (USDC permit)
    signature = sign_usdc_permit(
        owner=my_address,
        spender=payment_req["payTo"],
        value=payment_req["amount"],
        deadline=int(time.time()) + 3600
    )
    
    # Retry with payment
    response = requests.get(
        "https://node1.tenso.network/api/weather/current",
        headers={
            "X-PAYMENT": base64.b64encode(json.dumps({
                "x402Version": 1,
                "scheme": "eip712",
                "payload": signature
            }))
        }
    )
    
    print(response.json())  # Weather data!
```

---

## References

- [x402.org](https://x402.org) - Protocol specification
- [x402 GitHub](https://github.com/coinbase/x402) - Reference implementation
- [Base Docs](https://docs.base.org) - L2 documentation
- [USDC](https://www.circle.com/en/usdc) - Stablecoin for payments

---

**Tenso: The DePIN Network for AI Agent Payments** 🚀

*Pay-per-call infrastructure, powered by x402 protocol*

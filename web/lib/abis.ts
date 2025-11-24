export const TensoFactoryABI = [
    {
        "type": "function",
        "name": "createApiToken",
        "inputs": [
            { "name": "name", "type": "string", "internalType": "string" },
            { "name": "symbol", "type": "string", "internalType": "string" },
            { "name": "apiId", "type": "string", "internalType": "string" },
            { "name": "pricePerToken", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "ApiTokenDeployed",
        "inputs": [
            { "name": "tokenAddress", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "apiId", "type": "string", "indexed": false, "internalType": "string" }
        ],
        "anonymous": false
    }
] as const;

export const ApiCreditTokenABI = [
    {
        "type": "function",
        "name": "buyCredits",
        "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "burnCredits",
        "inputs": [
            { "name": "callId", "type": "uint256", "internalType": "uint256" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "pricePerToken",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "balanceOf",
        "inputs": [{ "name": "account", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    }
] as const;

export const NodeRegistryABI = [
    {
        "type": "function",
        "name": "registerNode",
        "inputs": [
            { "name": "endpoint", "type": "string", "internalType": "string" },
            { "name": "region", "type": "string", "internalType": "string" }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "getNode",
        "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct NodeRegistry.Node",
                "components": [
                    { "name": "operator", "type": "address", "internalType": "address" },
                    { "name": "endpoint", "type": "string", "internalType": "string" },
                    { "name": "region", "type": "string", "internalType": "string" },
                    { "name": "stakeAmount", "type": "uint256", "internalType": "uint256" },
                    { "name": "reputation", "type": "uint256", "internalType": "uint256" },
                    { "name": "active", "type": "bool", "internalType": "bool" },
                    { "name": "registeredAt", "type": "uint256", "internalType": "uint256" }
                ]
            }
        ],
        "stateMutability": "view"
    }
] as const;

export const PaymentRouterABI = [
    {
        "type": "function",
        "name": "splitPaymentWithAuthorization",
        "inputs": [
            { "name": "payer", "type": "address", "internalType": "address" },
            { "name": "apiOwner", "type": "address", "internalType": "address" },
            { "name": "nodeOperator", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" },
            { "name": "validAfter", "type": "uint256", "internalType": "uint256" },
            { "name": "validBefore", "type": "uint256", "internalType": "uint256" },
            { "name": "nonce", "type": "bytes32", "internalType": "bytes32" },
            { "name": "v", "type": "uint8", "internalType": "uint8" },
            { "name": "r", "type": "bytes32", "internalType": "bytes32" },
            { "name": "s", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    }
] as const;

// Contract Addresses (Base Sepolia)
export const NODE_REGISTRY_ADDRESS = '0x5b2222610e04380e1caf3988d88fbd15686a1b6c';
export const PAYMENT_ROUTER_ADDRESS = '0x6fa35e1f6ab4291432b36f16578614e90750b7e6';
export const PAYMENT_VERIFIER_ADDRESS = '0xa73d7c7703b23cc4692fdd817345ad29db5ac4e9';
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

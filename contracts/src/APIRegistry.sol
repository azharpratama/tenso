// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title APIRegistry
 * @notice On-chain registry for APIs with encrypted authentication keys
 * @dev Stores encrypted API keys that can only be decrypted by TEE nodes
 */
contract APIRegistry {
    struct API {
        string name;
        string description;
        string baseUrl;
        uint256 pricePerCall; // in smallest USDC units (6 decimals)
        bytes encryptedKey; // RSA-encrypted API key (for TEE nodes)
        address owner;
        bool active;
        uint256 createdAt;
    }

    struct Endpoint {
        string path;
        string method; // GET, POST, etc.
        uint256 price; // Optional: per-endpoint pricing
        string description;
    }

    // Mappings
    mapping(uint256 => API) public apis;
    mapping(uint256 => Endpoint[]) public apiEndpoints;
    mapping(address => uint256[]) public ownerAPIs;

    uint256 public nextApiId;

    // Events
    event APIRegistered(
        uint256 indexed apiId,
        address indexed owner,
        string name,
        string baseUrl,
        uint256 pricePerCall
    );

    event APIUpdated(uint256 indexed apiId, bool active);
    event EndpointAdded(uint256 indexed apiId, string path, string method);

    /**
     * @notice Register a new API with encrypted authentication
     * @param name Human-readable API name
     * @param description API description
     * @param baseUrl Base URL of the API (e.g., "https://api.weather.com")
     * @param pricePerCall Default price per API call in USDC (6 decimals)
     * @param encryptedKey RSA-encrypted API key (encrypted with TEE public key)
     */
    function registerAPI(
        string memory name,
        string memory description,
        string memory baseUrl,
        uint256 pricePerCall,
        bytes memory encryptedKey
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(bytes(baseUrl).length > 0, "Base URL required");
        require(encryptedKey.length > 0, "Encrypted key required");

        uint256 apiId = nextApiId++;

        apis[apiId] = API({
            name: name,
            description: description,
            baseUrl: baseUrl,
            pricePerCall: pricePerCall,
            encryptedKey: encryptedKey,
            owner: msg.sender,
            active: true,
            createdAt: block.timestamp
        });

        ownerAPIs[msg.sender].push(apiId);

        emit APIRegistered(apiId, msg.sender, name, baseUrl, pricePerCall);

        return apiId;
    }

    /**
     * @notice Add an endpoint to an existing API
     */
    function addEndpoint(
        uint256 apiId,
        string memory path,
        string memory method,
        uint256 price,
        string memory description
    ) external {
        require(apis[apiId].owner == msg.sender, "Not owner");

        apiEndpoints[apiId].push(
            Endpoint({
                path: path,
                method: method,
                price: price,
                description: description
            })
        );

        emit EndpointAdded(apiId, path, method);
    }

    /**
     * @notice Update API status (active/inactive)
     */
    function setAPIStatus(uint256 apiId, bool active) external {
        require(apis[apiId].owner == msg.sender, "Not owner");
        apis[apiId].active = active;
        emit APIUpdated(apiId, active);
    }

    /**
     * @notice Get all APIs owned by an address
     */
    function getOwnerAPIs(
        address owner
    ) external view returns (uint256[] memory) {
        return ownerAPIs[owner];
    }

    /**
     * @notice Get endpoints for an API
     */
    function getEndpoints(
        uint256 apiId
    ) external view returns (Endpoint[] memory) {
        return apiEndpoints[apiId];
    }

    /**
     * @notice Get API details (without encrypted key for privacy)
     */
    function getAPIMetadata(
        uint256 apiId
    )
        external
        view
        returns (
            string memory name,
            string memory description,
            string memory baseUrl,
            uint256 pricePerCall,
            address owner,
            bool active
        )
    {
        API memory api = apis[apiId];
        return (
            api.name,
            api.description,
            api.baseUrl,
            api.pricePerCall,
            api.owner,
            api.active
        );
    }

    /**
     * @notice Get encrypted key (only for TEE nodes to decrypt)
     * @dev Anyone can call this, but only TEE with the private key can decrypt
     */
    function getEncryptedKey(
        uint256 apiId
    ) external view returns (bytes memory) {
        require(apis[apiId].active, "API inactive");
        return apis[apiId].encryptedKey;
    }
}

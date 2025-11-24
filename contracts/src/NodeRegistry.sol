// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NodeRegistry {
    struct Node {
        address operator;
        string endpoint; // https://node1.example.com
        string region; // US-EAST, EU-WEST, ASIA, etc.
        uint256 stakeAmount;
        uint256 reputation; // 0-100 score
        bool active;
        uint256 registeredAt;
    }

    mapping(address => Node) public nodes;
    address[] public nodeOperators;

    uint256 public constant MIN_STAKE = 10000 ether; // 10k TENSO tokens

    event NodeRegistered(
        address indexed operator,
        string endpoint,
        string region,
        uint256 stakeAmount
    );
    event NodeDeactivated(address indexed operator, uint256 refundedStake);
    event ReputationUpdated(
        address indexed operator,
        uint256 oldReputation,
        uint256 newReputation
    );

    error InsufficientStake(uint256 provided, uint256 required);
    error AlreadyRegistered(address operator);
    error NotRegistered(address operator);
    error NotActive(address operator);
    error InvalidReputation(uint256 reputation);

    function registerNode(
        string memory endpoint,
        string memory region
    ) external payable {
        if (msg.value < MIN_STAKE) {
            revert InsufficientStake(msg.value, MIN_STAKE);
        }
        if (nodes[msg.sender].active) {
            revert AlreadyRegistered(msg.sender);
        }

        nodes[msg.sender] = Node({
            operator: msg.sender,
            endpoint: endpoint,
            region: region,
            stakeAmount: msg.value,
            reputation: 100, // Start with perfect score
            active: true,
            registeredAt: block.timestamp
        });

        nodeOperators.push(msg.sender);

        emit NodeRegistered(msg.sender, endpoint, region, msg.value);
    }

    function deactivateNode() external {
        if (!nodes[msg.sender].active) {
            revert NotActive(msg.sender);
        }

        uint256 refundAmount = nodes[msg.sender].stakeAmount;
        nodes[msg.sender].active = false;

        // Refund stake
        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");

        emit NodeDeactivated(msg.sender, refundAmount);
    }

    function updateReputation(
        address operator,
        uint256 newReputation
    ) external {
        // TODO: Add access control (only reputation oracle can call)
        if (newReputation > 100) {
            revert InvalidReputation(newReputation);
        }
        if (!nodes[operator].active) {
            revert NotActive(operator);
        }

        uint256 oldReputation = nodes[operator].reputation;
        nodes[operator].reputation = newReputation;

        emit ReputationUpdated(operator, oldReputation, newReputation);
    }

    function getActiveNodes() external view returns (Node[] memory) {
        // Count active nodes
        uint256 activeCount = 0;
        for (uint256 i = 0; i < nodeOperators.length; i++) {
            if (nodes[nodeOperators[i]].active) {
                activeCount++;
            }
        }

        // Build array of active nodes
        Node[] memory activeNodes = new Node[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < nodeOperators.length; i++) {
            if (nodes[nodeOperators[i]].active) {
                activeNodes[index] = nodes[nodeOperators[i]];
                index++;
            }
        }

        return activeNodes;
    }

    function getNode(address operator) external view returns (Node memory) {
        return nodes[operator];
    }

    function getNodeCount()
        external
        view
        returns (uint256 total, uint256 active)
    {
        total = nodeOperators.length;
        for (uint256 i = 0; i < nodeOperators.length; i++) {
            if (nodes[nodeOperators[i]].active) {
                active++;
            }
        }
    }
}

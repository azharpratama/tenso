// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUSDC is IERC20 {
    function transferWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract PaymentRouter is Ownable {
    IUSDC public immutable USDC;
    address public protocolTreasury;

    // Fee percentages (basis points: 9000 = 90%)
    uint256 public constant API_OWNER_FEE = 9000; // 90%
    uint256 public constant NODE_OPERATOR_FEE = 800; // 8%
    uint256 public constant PROTOCOL_FEE = 200; // 2%

    event PaymentSplit(
        address indexed apiOwner,
        address indexed nodeOperator,
        address indexed payer,
        uint256 totalAmount,
        uint256 ownerShare,
        uint256 nodeShare,
        uint256 protocolShare
    );

    event TreasuryUpdated(
        address indexed oldTreasury,
        address indexed newTreasury
    );

    error InvalidAmount(uint256 amount);
    error InvalidAddress(address addr);
    error TransferFailed(address recipient, uint256 amount);

    constructor(address _usdc, address _treasury) Ownable(msg.sender) {
        if (_usdc == address(0) || _treasury == address(0)) {
            revert InvalidAddress(address(0));
        }

        USDC = IUSDC(_usdc);
        protocolTreasury = _treasury;
    }

    /**
     * @notice Split payment using standard ERC20 transferFrom
     * @dev Caller must have approved this contract
     */
    function splitPayment(
        address apiOwner,
        address nodeOperator,
        uint256 amount
    ) external {
        if (amount == 0) revert InvalidAmount(0);

        // Pull funds from sender to this contract
        bool success = USDC.transferFrom(msg.sender, address(this), amount);
        if (!success) revert TransferFailed(address(this), amount);

        // Distribute
        _distribute(msg.sender, apiOwner, nodeOperator, amount);
    }

    /**
     * @notice Split payment using EIP-3009 authorization (Gasless for payer)
     * @dev Pulls funds using signature, then distributes
     */
    function splitPaymentWithAuthorization(
        address payer,
        address apiOwner,
        address nodeOperator,
        uint256 amount,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        if (amount == 0) revert InvalidAmount(0);

        // Pull funds using authorization
        USDC.transferWithAuthorization(
            payer,
            address(this),
            amount,
            validAfter,
            validBefore,
            nonce,
            v,
            r,
            s
        );

        // Distribute
        _distribute(payer, apiOwner, nodeOperator, amount);
    }

    /**
     * @dev Internal function to calculate shares and transfer funds
     */
    function _distribute(
        address payer,
        address apiOwner,
        address nodeOperator,
        uint256 amount
    ) internal {
        if (apiOwner == address(0) || nodeOperator == address(0)) {
            revert InvalidAddress(address(0));
        }

        // Calculate shares
        uint256 ownerShare = (amount * API_OWNER_FEE) / 10000; // 90%
        uint256 nodeShare = (amount * NODE_OPERATOR_FEE) / 10000; // 8%
        uint256 protocolShare = (amount * PROTOCOL_FEE) / 10000; // 2%

        // Transfer to recipients
        bool success;

        success = USDC.transfer(apiOwner, ownerShare);
        if (!success) revert TransferFailed(apiOwner, ownerShare);

        success = USDC.transfer(nodeOperator, nodeShare);
        if (!success) revert TransferFailed(nodeOperator, nodeShare);

        success = USDC.transfer(protocolTreasury, protocolShare);
        if (!success) revert TransferFailed(protocolTreasury, protocolShare);

        emit PaymentSplit(
            apiOwner,
            nodeOperator,
            payer,
            amount,
            ownerShare,
            nodeShare,
            protocolShare
        );
    }

    function updateTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) {
            revert InvalidAddress(address(0));
        }

        address oldTreasury = protocolTreasury;
        protocolTreasury = newTreasury;

        emit TreasuryUpdated(oldTreasury, newTreasury);
    }
}

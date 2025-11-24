// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IUSDC {
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

    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract PaymentVerifier {
    using ECDSA for bytes32;

    IUSDC public immutable USDC;

    event PaymentExecuted(
        address indexed from,
        address indexed to,
        uint256 value,
        bytes32 nonce
    );

    error InvalidSignature();
    error ExpiredAuthorization(uint256 validBefore, uint256 currentTime);
    error AuthorizationNotYetValid(uint256 validAfter, uint256 currentTime);

    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        USDC = IUSDC(_usdc);
    }

    /**
     * @notice Execute USDC payment with EIP-3009 authorization
     * @dev Uses USDC's transferWithAuthorization for gasless payments
     */
    function executePayment(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (bool) {
        // Validate timing
        if (block.timestamp < validAfter) {
            revert AuthorizationNotYetValid(validAfter, block.timestamp);
        }
        if (block.timestamp > validBefore) {
            revert ExpiredAuthorization(validBefore, block.timestamp);
        }

        // Execute USDC transfer with authorization
        USDC.transferWithAuthorization(
            from,
            to,
            value,
            validAfter,
            validBefore,
            nonce,
            v,
            r,
            s
        );

        emit PaymentExecuted(from, to, value, nonce);

        return true;
    }

    /**
     * @notice Verify payment signature without executing
     * @dev Useful for pre-validation in the forwarder
     */
    function verifyPaymentSignature(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external view returns (bool isValid, string memory reason) {
        // Check timing
        if (block.timestamp < validAfter) {
            return (false, "Authorization not yet valid");
        }
        if (block.timestamp > validBefore) {
            return (false, "Authorization expired");
        }

        // Check balance
        if (USDC.balanceOf(from) < value) {
            return (false, "Insufficient balance");
        }

        // TODO: Verify EIP-712 signature (requires USDC domain separator)
        // For now, basic validation
        if (v != 27 && v != 28) {
            return (false, "Invalid signature v value");
        }

        return (true, "");
    }
}

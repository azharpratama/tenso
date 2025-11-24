// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {NodeRegistry} from "../src/NodeRegistry.sol";
import {PaymentRouter} from "../src/PaymentRouter.sol";
import {PaymentVerifier} from "../src/PaymentVerifier.sol";

contract DeployDePIN is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address protocolTreasury = vm.envAddress("PROTOCOL_TREASURY");
        address usdcAddress = vm.envAddress("USDC_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy NodeRegistry
        NodeRegistry nodeRegistry = new NodeRegistry();
        console.log("NodeRegistry deployed at:", address(nodeRegistry));

        // Deploy PaymentRouter
        PaymentRouter paymentRouter = new PaymentRouter(
            usdcAddress,
            protocolTreasury
        );
        console.log("PaymentRouter deployed at:", address(paymentRouter));

        // Deploy PaymentVerifier
        PaymentVerifier paymentVerifier = new PaymentVerifier(usdcAddress);
        console.log("PaymentVerifier deployed at:", address(paymentVerifier));

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("Network: Base Sepolia");
        console.log("USDC Address:", usdcAddress);
        console.log("Protocol Treasury:", protocolTreasury);
        console.log("\nContracts:");
        console.log("- NodeRegistry:", address(nodeRegistry));
        console.log("- PaymentRouter:", address(paymentRouter));
        console.log("- PaymentVerifier:", address(paymentVerifier));
    }
}

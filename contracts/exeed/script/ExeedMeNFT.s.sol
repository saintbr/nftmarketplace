// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ExeedMeNFT} from "src/ExeedMeNFT.sol";

contract ExeedMeNFTScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        address initialOwner = 0x453a486b2e13a5174D4bf2367687830A8cd73ce5;
        ExeedMeNFT instance = new ExeedMeNFT(initialOwner);
        console.log("Contract deployed to %s", address(instance));
        vm.stopBroadcast();
    }
}

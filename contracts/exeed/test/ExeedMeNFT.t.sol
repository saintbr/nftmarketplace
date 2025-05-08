// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {ExeedMeNFT} from "src/ExeedMeNFT.sol";

contract ExeedMeNFTTest is Test {
    ExeedMeNFT public instance;

    function setUp() public {
        address initialOwner = vm.addr(1);
        instance = new ExeedMeNFT(initialOwner);
    }

    function testName() public view {
        assertEq(instance.name(), "Exeed Me NFT");
    }

    function testSymbol() public view {
        assertEq(instance.symbol(), "EXE");
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {console} from "forge-std/Test.sol";
import {DeployScript, Deployer} from "forge-deploy/DeployScript.sol";
import {ProxiedDeployerFunctions, ProxyOptionsOnTag} from "generated/deployer/ProxiedDeployerFunctions.g.sol";
import {DeployGreetingsRegistry} from "script/DeployGreetingsRegistry.s.sol";

contract Deploy is DeployScript {
    using ProxiedDeployerFunctions for Deployer;

    function deploy() external {
        address greetingsRegistry = address(new DeployGreetingsRegistry().deploy());

        console.log("greetingsRegistry:", greetingsRegistry);
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {console} from 'forge-std/Test.sol';
import {DeployScript, Deployer} from 'forge-deploy/DeployScript.sol';
import {ProxiedDeployerFunctions, ProxyOptionsOnTag} from 'generated/deployer/ProxiedDeployerFunctions.g.sol';
import {DeployGreetingsRegistry} from 'script/DeployGreetingsRegistry.s.sol';

contract DeployLocalhost is DeployScript {
    using ProxiedDeployerFunctions for Deployer;

    function deploy() external {
        address weth = address(
            deployer.deploy_WETH('WETH', ProxyOptionsOnTag({onTag: 'testnet', owner: vm.envAddress('DEPLOYER')}))
        );
        address multicall = address(
            deployer.deploy_Multicall3(
                'Multicall3',
                ProxyOptionsOnTag({onTag: 'testnet', owner: vm.envAddress('DEPLOYER')})
            )
        );

        address greetingsRegistry = address(new DeployGreetingsRegistry().deploy());

        console.log('weth:', weth);
        console.log('multicall:', multicall);
        console.log('greetingsRegistry:', greetingsRegistry);
    }
}

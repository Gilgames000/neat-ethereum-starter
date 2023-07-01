import type { Chain } from 'viem';
import { sepolia, avalanche, foundry } from 'viem/chains';
import invariant from 'tiny-invariant';
import { deployments } from './contracts';

enum SupportedChainId {
    Anvil = 31337,
    Sepolia = 11155111,
    Avalanche = 43114
}


const anvil = {
    id: SupportedChainId.Anvil,
    network: foundry.network,
    name: 'Anvil',
    nativeCurrency: foundry.nativeCurrency,
    rpcUrls: foundry.rpcUrls,
    contracts: {
        multicall3: {
            // @ts-ignore
            address: deployments[SupportedChainId.Anvil]?.contracts.Multicall3.address ?? '0x',
            blockCreated: 2,
        }
    }
} as const satisfies Chain;

const prodChainsList = [avalanche, sepolia];
const supportedChainsList = import.meta.env.DEV ? [anvil, ...prodChainsList] : prodChainsList;

supportedChainsList.forEach((chain) => {
    if (chain.id === SupportedChainId.Anvil) {
        return;
    }
    invariant(
        Object.values(SupportedChainId).includes(chain.id),
        `Supported chain ${chain.id} is not in SupportedChainId enum`
    );
});

Object.values(SupportedChainId)
    .filter((chainId) => typeof chainId === 'number')
    .forEach((chainId) => {
        if (chainId === SupportedChainId.Anvil) {
            return;
        }
        invariant(
            supportedChainsList.some((chain) => chain.id === chainId),
            `Supported chain id ${chainId} is not in supportedChainsList`
        );
    });

const defaultChain = supportedChainsList[0];

const supportedChains = supportedChainsList.reduce((acc, chain) => {
    acc[chain.id] = chain;
    return acc;
}, {} as Record<number, Chain>);

function isSupportedChainId(chainId: number | string) {
    return supportedChainsList.some((chain) => Number(chain.id) === Number(chainId));
}

function isSupportedChain(chain: Chain) {
    return supportedChainsList.some((c) => c.id === chain.id);
}

function getChainById(chainId: number | string): Chain {
    return supportedChains[Number(chainId)];
}

function ensureSupportedChainId(chainId: number | string): SupportedChainId {
    if (!isSupportedChainId(chainId)) {
        throw new Error(`Chain id ${chainId} is not supported`);
    }
    return Number(chainId) as SupportedChainId;
}

export {
    supportedChainsList,
    supportedChains,
    defaultChain,
    isSupportedChainId,
    isSupportedChain,
    getChainById,
    SupportedChainId,
    ensureSupportedChainId
};

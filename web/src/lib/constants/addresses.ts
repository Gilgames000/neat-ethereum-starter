import { SupportedChainId } from '$lib/config';
import { deployments } from '$lib/contracts';

export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const CONTRACT_ADDRESSES = {
    [SupportedChainId.Anvil]: {
        // @ts-ignore
        wrappedNativeCurrency: deployments[SupportedChainId.Anvil]?.contracts.WETH.address ?? '0x',
    },
    [SupportedChainId.Sepolia]: {
        wrappedNativeCurrency: '0xE67ABDA0D43f7AC8f37876bBF00D1DFadbB93aaa',
    },
    [SupportedChainId.Avalanche]: {
        wrappedNativeCurrency: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    }
} as const;

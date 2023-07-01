import { SupportedChainId, getChainById } from '$lib/config';
import { NativeCurrency } from 'ethoolbox';
import { CONTRACT_ADDRESSES } from './addresses';

const makeNativeCurrency = (chainId: SupportedChainId) => {
    const chain = getChainById(chainId);
    const wrappedAddress = CONTRACT_ADDRESSES[chainId].wrappedNativeCurrency;
    return new NativeCurrency(
        chainId,
        chain.nativeCurrency.decimals,
        chain.nativeCurrency.symbol,
        chain.nativeCurrency.name,
        `/images/chains/currency-logos/${chainId}.svg`,
        wrappedAddress
    );
};

export const NATIVE_CURRENCIES = {
    [SupportedChainId.Anvil]: import.meta.env.DEV ? makeNativeCurrency(SupportedChainId.Anvil) : undefined as unknown as NativeCurrency,
    [SupportedChainId.Sepolia]: makeNativeCurrency(SupportedChainId.Sepolia),
    [SupportedChainId.Avalanche]: makeNativeCurrency(SupportedChainId.Avalanche)
} as const;

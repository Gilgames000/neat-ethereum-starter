import { get, type Loadable, type Writable } from '@square/svelte-store';
import { selectedChain } from '$lib/chain';
import { CurrencyAmount, NativeCurrency } from 'ethoolbox';
import { Multicall3Abi } from '$lib/abis';
import type { Address } from 'ethoolbox';
import { createEtherStoreForChainId } from './stateManager';
import { getChainById, ensureSupportedChainId, SupportedChainId } from '$lib/config';
import { NATIVE_CURRENCIES } from '$lib/constants';

type NativeCurrencyKey = `${number}-${Address}`; // chainId-walletAddress
const nativeBalanceStores = new Map<
    NativeCurrencyKey,
    Writable<CurrencyAmount<NativeCurrency>> & Loadable<CurrencyAmount<NativeCurrency>>
>();

function createNativeBalanceStoreForChainId(chainId: SupportedChainId, walletAddress: Address) {
    const chain = getChainById(chainId);
    if (!chain.contracts?.multicall3)
        throw new Error(`Chain ${chainId} does not have a multicall3 contract address`);

    const nativeCurrency = NATIVE_CURRENCIES[chainId];
    const nativeCurrencyKey: NativeCurrencyKey = `${chainId}-${walletAddress}`;

    const cachedBalanceStore = nativeBalanceStores.get(nativeCurrencyKey);
    if (cachedBalanceStore) return cachedBalanceStore;

    const balanceStore = createEtherStoreForChainId<CurrencyAmount<NativeCurrency>>(
        chainId,
        {
            address: chain.contracts.multicall3.address,
            abi: Multicall3Abi,
            functionName: 'getEthBalance',
            args: [walletAddress]
        },
        {
            processor: (balance: unknown) => {
                if (typeof balance !== 'bigint')
                    throw new Error(`getEthBalance returned ${balance} instead of a bigint`);
                return CurrencyAmount.fromRawAmount(nativeCurrency, [
                    balance,
                    nativeCurrency.decimals
                ]);
            }
        }
    );

    nativeBalanceStores.set(nativeCurrencyKey, balanceStore);
    return balanceStore;
}

function createNativeBalanceStore(walletAddress: Address) {
    const chainId = get(selectedChain).id;
    const supportedChainId = ensureSupportedChainId(chainId);
    return createNativeBalanceStoreForChainId(supportedChainId, walletAddress);
}

export { createNativeBalanceStore, createNativeBalanceStoreForChainId };

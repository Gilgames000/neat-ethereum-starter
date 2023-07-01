import { get, rebounce, writable, type Writable } from '@square/svelte-store';
import {
    getBlockNumberStoreByChainId,
    getPublicClientByChainId,
    selectedChainId
} from '$lib/chain';
import type { ContractFunctionConfig } from 'viem';
import type { Narrow } from 'abitype';
import { SupportedChainId, supportedChainsList } from '$lib/config';
import { browser } from '$app/environment';
import { derived } from 'svelte/store';
import { debounced } from '$lib/higher-order-stores';

type ResultProcessor<T> = (results: unknown[]) => T;

interface EtherStore<T> {
    store: ReturnType<typeof writable<T>>;
    chainId: number;
    contractFunctions: Narrow<ContractFunctionConfig>[];
    processor: ResultProcessor<T>;
}

const etherStoresByChainId = new Map<SupportedChainId, Writable<EtherStore<unknown>[]>>(
    supportedChainsList.map((chain) => [chain.id, writable<EtherStore<unknown>[]>([])])
);

function createEtherStoreForChainId<T>(
    chainId: number,
    contractFunctions: Narrow<ContractFunctionConfig>[],
    options?: {
        processor?: ResultProcessor<T>;
        initialValue?: T;
    }
) {
    const { initialValue } = options ?? {};
    const processor = options?.processor ?? ((result) => result as T);

    const etherStores = etherStoresByChainId.get(chainId);
    if (!etherStores) throw new Error(`Chain ID ${chainId} is not supported`);

    const store = writable(initialValue);

    const etherStore: EtherStore<T> = {
        store,
        chainId,
        contractFunctions: contractFunctions,
        processor
    };

    etherStores.update(($etherStores) => {
        $etherStores.push(etherStore);
        return $etherStores;
    });

    return store;
}

function createEtherStore<T>(
    contractFunctions: Narrow<ContractFunctionConfig>[],
    options?: {
        processor?: ResultProcessor<T>;
        initialValue?: T;
    }
) {
    return createEtherStoreForChainId<T>(get(selectedChainId), contractFunctions, options);
}

async function updateEtherStoresForChainId(chainId: number) {
    const _etherStores = etherStoresByChainId.get(chainId);
    const _publicClient = getPublicClientByChainId(chainId);
    if (!_etherStores || !_publicClient) throw new Error(`Chain ID ${chainId} is not supported`);

    const $etherStores = get(_etherStores);

    const contractCalls = $etherStores.flatMap((etherStore) => etherStore.contractFunctions);
    try {
        const results = await rebounce(
            async () => await _publicClient.multicall({ contracts: contractCalls }),
            200
        )();

        let etherStoresIndex = 0;
        let resultsIndex = 0;

        while (etherStoresIndex < $etherStores.length && resultsIndex < results.length) {
            const etherStore = $etherStores[etherStoresIndex];
            const callsNumber = etherStore.contractFunctions.length;
            const resultsSlice = results.slice(resultsIndex, resultsIndex + callsNumber);

            try {
                const rawResults = resultsSlice.map((result, index) => {
                    if (!result) {
                        console.error(
                            `No result for chain ${chainId}, contract address ${etherStore.contractFunctions[index].address}, and contract function ${etherStore.contractFunctions[index].functionName}`
                        );
                        return;
                    }
                    if (result.status === 'failure') {
                        console.error(
                            `Error fetching new data for chain ${chainId}, contract address ${etherStore.contractFunctions[index].address}, and contract function ${etherStore.contractFunctions[index].functionName}:`,
                            result.error
                        );
                        return;
                    }

                    return result.result;
                });

                const processedValue = etherStore.processor(rawResults);
                etherStore.store.set(processedValue);
            } catch (error) {
                console.error(`Error updating store for chain ${chainId}:`, error);
            }

            etherStoresIndex += 1;
            resultsIndex += callsNumber;
        }
    } catch (e: any) {
        if (e.name === 'AbortError') {
            return;
        }
        throw e;
    }
}

const updaterStores = supportedChainsList.map((chain) => {
    const chainId = chain.id;
    const _blockNumberStore = getBlockNumberStoreByChainId(chainId);
    const _etherStores = etherStoresByChainId.get(chainId);
    if (!_etherStores) throw new Error(`Chain ID ${chainId} is not supported`);

    return derived(
        [_blockNumberStore, debounced(_etherStores)],
        async ([$blockNumber, $etherStores]) => {
            if (!$blockNumber) return;
            if ($etherStores.length === 0) return;

            await updateEtherStoresForChainId(chainId);
        }
    );
});

if (browser) {
    updaterStores.forEach((updaterStore) => {
        updaterStore.subscribe(() => {}); // necessary to start the updater
    });
}

export { createEtherStore, createEtherStoreForChainId };

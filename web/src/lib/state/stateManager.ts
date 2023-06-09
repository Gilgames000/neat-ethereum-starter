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

type ResultProcessor<T> = (result: unknown) => T;

interface EtherStore<T> {
  store: ReturnType<typeof writable<T>>;
  chainId: number;
  contractFunction: Narrow<ContractFunctionConfig>;
  processor: ResultProcessor<T>;
}

const etherStoresByChainId = new Map<SupportedChainId, Writable<EtherStore<unknown>[]>>(
  supportedChainsList.map((chain) => [chain.id, writable<EtherStore<unknown>[]>([])])
);

function createEtherStoreForChainId<T>(
  chainId: number,
  contractFunction: Narrow<ContractFunctionConfig>,
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
    contractFunction,
    processor
  };

  etherStores.update(($etherStores) => {
    $etherStores.push(etherStore);
    return $etherStores;
  });

  return store;
}

function createEtherStore<T>(
  contractFunction: Narrow<ContractFunctionConfig>,
  options?: {
    processor?: ResultProcessor<T>;
    initialValue?: T;
  }
) {
  return createEtherStoreForChainId<T>(get(selectedChainId), contractFunction, options);
}

async function updateEtherStoresForChainId(chainId: number) {
  const _etherStores = etherStoresByChainId.get(chainId);
  const _publicClient = getPublicClientByChainId(chainId);
  if (!_etherStores || !_publicClient) throw new Error(`Chain ID ${chainId} is not supported`);

  const $etherStores = get(_etherStores);

  const contractCalls = $etherStores.map((etherStore) => etherStore.contractFunction);
  try {
    const results = await rebounce(
      async () => await _publicClient.multicall({ contracts: contractCalls }),
      200
    )();

    $etherStores.forEach((etherStore, index) => {
      try {
        const result = results[index];
        if (!result) {
          console.error(
            `No result for chain ${chainId}, contract address ${etherStore.contractFunction.address}, and contract function ${etherStore.contractFunction.functionName}`
          );
          return;
        }
        if (result.status === 'failure') {
          console.error(
            `Error fetching new data for chain ${chainId}, contract address ${etherStore.contractFunction.address}, and contract function ${etherStore.contractFunction.functionName}:`,
            result.error
          );
          return;
        }

        const value = result.result;
        const processedValue = etherStore.processor(value);
        etherStore.store.set(processedValue);
      } catch (error) {
        console.error(
          `Error updating store for chain ${chainId}, contract address ${etherStore.contractFunction.address}, and contract function ${etherStore.contractFunction.functionName}:`,
          error
        );
      }
    });
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

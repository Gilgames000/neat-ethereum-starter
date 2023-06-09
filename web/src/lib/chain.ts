import { derived, writable } from '@square/svelte-store';
import { createPublicClient, type Chain, http, type PublicClient } from 'viem';
import { SupportedChainId, defaultChain, isSupportedChain, supportedChainsList } from '$lib/config';

const selectedChain = writable<Chain>(defaultChain);
const selectedChainId = derived([selectedChain], ([$selectedChain]) => $selectedChain.id);

const publicClients = new Map<SupportedChainId, PublicClient>(
  supportedChainsList.map((chain) => [
    chain.id,
    createPublicClient({
      chain,
      transport: http()
    })
  ])
);

const publicClient = derived([selectedChain], ([$selectedChain]) => {
  const _publicClient = publicClients.get($selectedChain.id);
  if (!_publicClient) throw new Error(`Public client for chain ${$selectedChain.id} not found`);
  return _publicClient;
});

const blockNumberStores = new Map<SupportedChainId, ReturnType<typeof writable<bigint>>>(
  supportedChainsList.map((chain) => [
    chain.id,
    writable<bigint>(void 0, () => {
      const _publicClient = publicClients.get(chain.id);
      if (!_publicClient) throw new Error(`Public client for chain ${chain.id} not found`);

      const unwatchBlockNumber = _publicClient.watchBlockNumber({
        emitOnBegin: true,
        emitMissed: false,
        pollingInterval: 4000,
        onBlockNumber: (_newBlockNumber) => {
          blockNumberStores.get(chain.id)?.set(_newBlockNumber);
        }
      });

      return () => {
        unwatchBlockNumber();
      };
    })
  ])
);

const blockNumber = derived([selectedChain], ([$selectedChain]) => {
  const _blockNumberStore = blockNumberStores.get($selectedChain.id);
  if (!_blockNumberStore)
    throw new Error(`Block number store for chain ${$selectedChain.id} not found`);
  return _blockNumberStore;
});

function getBlockNumberStoreByChainId(chainId: number | string): ReturnType<typeof writable> {
  const _blockNumberStore = blockNumberStores.get(Number(chainId));
  if (!_blockNumberStore) throw new Error(`Block number store for chain ${chainId} not found`);
  return _blockNumberStore;
}

function getPublicClientByChainId(chainId: number | string): PublicClient {
  const _publicClient = publicClients.get(Number(chainId));
  if (!_publicClient) throw new Error(`Public client for chain ${chainId} not found`);
  return _publicClient;
}

function switchSelectedChain(chain: Chain) {
  if (!isSupportedChain(chain)) throw new Error(`Chain ${chain.id} is not supported`);
  selectedChain.set(chain);
  // window.location.reload();
}

export {
  selectedChain,
  selectedChainId,
  publicClient,
  blockNumber,
  getBlockNumberStoreByChainId,
  getPublicClientByChainId,
  switchSelectedChain
};

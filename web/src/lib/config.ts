import type { Chain } from 'viem';
import { sepolia, avalanche } from 'viem/chains';
import invariant from 'tiny-invariant';

enum SupportedChainId {
  Sepolia = 11155111,
  Avalanche = 43114
}

const supportedChainsList = [avalanche, sepolia] as const;

supportedChainsList.forEach((chain) => {
  invariant(
    Object.values(SupportedChainId).includes(chain.id),
    `Supported chain ${chain.id} is not in SupportedChainId enum`
  );
});

Object.values(SupportedChainId)
  .filter((chainId) => typeof chainId === 'number')
  .forEach((chainId) => {
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

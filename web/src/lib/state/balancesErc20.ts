import { get, type Loadable, type Writable } from '@square/svelte-store';
import { selectedChain } from '$lib/chain';
import { CurrencyAmount, Token } from 'ethoolbox';
import { ERC20Abi } from '$lib/abis';
import type { Address } from 'ethoolbox';
import { createEtherStoreForChainId } from './stateManager';

type TokenKey = `${number}-${Address}-${Address}`; // chainId-tokenAddress-walletAddress
const erc20BalanceStores = new Map<
  TokenKey,
  Writable<CurrencyAmount<Token>> & Loadable<CurrencyAmount<Token>>
>();

function createErc20BalanceStoreForChainId(chainId: number, token: Token, walletAddress: Address) {
  const tokenKey: TokenKey = `${chainId}-${token.address}-${walletAddress}`;

  const cachedBalanceStore = erc20BalanceStores.get(tokenKey);
  if (cachedBalanceStore) return cachedBalanceStore;

  const balanceStore = createEtherStoreForChainId<CurrencyAmount<Token>>(
    chainId,
    {
      address: token.address,
      abi: ERC20Abi,
      functionName: 'balanceOf',
      args: [walletAddress]
    },
    {
      processor: (balance: unknown) => {
        if (typeof balance !== 'bigint')
          throw new Error(`balanceOf returned ${balance} instead of a bigint`);
        return CurrencyAmount.fromRawAmount(token, [balance, token.decimals]);
      }
    }
  );

  erc20BalanceStores.set(tokenKey, balanceStore);
  return balanceStore;
}

function createErc20BalanceStore(token: Token, walletAddress: Address) {
  const chainId = get(selectedChain).id;
  return createErc20BalanceStoreForChainId(chainId, token, walletAddress);
}

export { createErc20BalanceStore, createErc20BalanceStoreForChainId };

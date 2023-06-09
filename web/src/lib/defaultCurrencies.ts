import { get } from '@square/svelte-store';
import { selectedChain } from './chain';
import { ensureSupportedChainId } from './config';
import { NATIVE_CURRENCIES } from './constants';

function getNativeCurrencyByChainId(chainId: number) {
  const supportedChainId = ensureSupportedChainId(chainId);
  return NATIVE_CURRENCIES[supportedChainId];
}

function getNativeCurrency() {
  const chainId = get(selectedChain).id;
  return getNativeCurrencyByChainId(chainId);
}

export { getNativeCurrencyByChainId, getNativeCurrency };

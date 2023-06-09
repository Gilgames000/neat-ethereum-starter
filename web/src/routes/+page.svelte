<script lang="ts">
  import { selectedChain, selectedChainId } from '$lib/chain';
  import TokenBalance from '$lib/components/TokenBalance.svelte';
  import { verifiedTokensByChainId } from '$lib/tokenlist';
  import { isWalletConnected, walletAddress } from '$lib/wallet';
</script>

<section class="py-16 px-4 mx-auto max-w-4xl">
  <h1 class="mt-8 md:mt-16 mb-6 text-center font-bold uppercase">We Love Tokens!</h1>
  <h3 class="mb-24 text-center max-w-2xl mx-auto">
    Very many tokens on {$selectedChain.name}
  </h3>
  {#await verifiedTokensByChainId.load()}
    <div class="text-center">Loading verified tokens...</div>
  {:then}
    <div class="mb-8">
      <div class="flex flex-wrap justify-center">
        {#each $verifiedTokensByChainId.get($selectedChainId) ?? [] as token}
          <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 px-2">
            <div class="bg-surface-900 border-primary-400 border-2 rounded-lg shadow-lg p-4">
              <div class="flex flex-col items-center">
                <img
                  src={token.logoURI}
                  alt={token.name}
                  class="w-16 h-16 object-cover rounded-full"
                />
                <h3 class="mt-4 text-lg font-bold">{token.symbol}</h3>
                <p class="mt-2 text-gray-600 text-sm">{token.name}</p>
                {#if $isWalletConnected}
                  <p class="mt-2 text-gray-700">
                    <TokenBalance {token} address={$walletAddress} />
                  </p>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:catch error}
    <div class="text-center">Error: {error.message}</div>
  {/await}
</section>

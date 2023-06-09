<script lang="ts">
  import type { Token } from 'ethoolbox';
  import { formatCurrencyAmount } from 'ethoolbox';
  import { createErc20BalanceStore } from '$lib/state/balancesErc20';
  import type { Address } from 'ethoolbox';

  export let token: Token;
  export let address: Address;

  $: balance = createErc20BalanceStore(token, address);
</script>

<div class="flex place-items-center mx-1">
  {#await balance.load()}
    <div class="placeholder animate-pulse min-w-[75px] !bg-tertiary-900" />
  {:then}
    {formatCurrencyAmount($balance)}
  {:catch error}
    <div class="text-center">Error: {error.message}</div>
  {/await}
</div>

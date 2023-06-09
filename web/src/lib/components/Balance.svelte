<script lang="ts">
  import TokenBalance from './TokenBalance.svelte';
  import NativeBalance from './NativeBalance.svelte';
  import type { Currency } from 'ethoolbox';
  import type { Address } from 'ethoolbox';

  export let currency: Currency;
  export let address: Address;
</script>

{#if currency.isToken}
  <TokenBalance token={currency} {address} />
{:else}
  <NativeBalance {address} />
{/if}

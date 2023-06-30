<script lang="ts">
    import { formatCurrencyAmount } from 'ethoolbox';
    import type { Address } from 'ethoolbox';
    import { createNativeBalanceStore } from '$lib/state';

    export let address: Address;

    $: balance = createNativeBalanceStore(address);
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

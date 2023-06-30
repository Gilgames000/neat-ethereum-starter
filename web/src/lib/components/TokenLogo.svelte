<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import type { NativeCurrency, Token } from 'ethoolbox';

    export let token: Token | NativeCurrency;

    $: initials = token.symbol ? token.symbol?.slice(0, 2) : '??';
</script>

<Avatar
    src={token.logoURI}
    {initials}
    background="bg-secondary-600"
    width="w-6"
    rounded="rounded-full"
/>

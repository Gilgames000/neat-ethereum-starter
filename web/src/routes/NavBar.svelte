<script lang="ts">
    import { openDrawer } from '$lib/drawer';
    import { scrollPageTo } from '$lib/scroll';
    import { links } from './links';

    import { AppBar } from '@skeletonlabs/skeleton';
    import { SvgIcon } from '$lib/components/icons';
    import LogoShort from '$lib/components/LogoShort.svelte';
    import { NavMenu } from '$lib/components/menus';
    import Wallet from './WalletWidget.svelte';
    import SwitchChainWidget from './SwitchChainWidget.svelte';
    import { selectedChain, selectedChainId } from '$lib/chain';
    import { isWalletConnected, walletAddress } from '$lib/wallet';
    import NativeBalance from '$lib/components/NativeBalance.svelte';
</script>

<div>
    <AppBar shadow="shadow-xl">
        <svelte:fragment slot="lead">
            <div on:click={openDrawer} class="lg:hidden mr-2 p-1 cursor-pointer">
                <SvgIcon
                    name="bars"
                    width="w-8"
                    height="h-8"
                    fill="fill-black dark:fill-primary-300"
                    on:click={openDrawer}
                />
            </div>
            <a href="/" on:click={() => scrollPageTo('#hero')} class="lg:ml-4">
                <LogoShort />
            </a>
        </svelte:fragment>
        <div class="flex lg:ml-12 lg:pt-1">
            <NavMenu {links} />
        </div>
        <svelte:fragment slot="trail">
            {#key $selectedChainId}
                {#if $isWalletConnected}
                    <NativeBalance address={$walletAddress} />
                    {$selectedChain.nativeCurrency.symbol}
                {/if}
                <SwitchChainWidget />
                <Wallet />
            {/key}
        </svelte:fragment>
    </AppBar>
</div>

<script lang="ts">
    import { selectedChain, switchSelectedChain } from '$lib/chain';
    import { supportedChainsList } from '$lib/config';
    import { switchWalletChain } from '$lib/wallet';
    import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

    let popupChainSelection: PopupSettings = {
        event: 'focus-click',
        target: 'chain-selection-dropdown',
        placement: 'bottom',
        // Close the popup when the item is clicked
        closeQuery: '.listbox-item'
    };

    $: classesActive = (chainId: number) =>
        chainId === $selectedChain.id ? '!bg-tertiary-900' : '';
</script>

<button class="btn variant-glass-primary px-2 outline-none" use:popup={popupChainSelection}>
    <img
        src="/images/chains/logos/{$selectedChain.id}.svg"
        alt={$selectedChain.name}
        width="24"
        height="24"
    />
    <span class="hidden sm:flex text-sm">{$selectedChain.name}</span>
    <i class="fa-solid fa-caret-down opacity-50" />
</button>

<div class="card min-w-[128px] shadow-xl p-2" data-popup="chain-selection-dropdown">
    <nav class="list-nav">
        <!-- (optionally you can provde a label here) -->
        <ul>
            {#each supportedChainsList as chain}
                <li>
                    <a
                        class={classesActive(chain.id)}
                        on:click={async () => {
                            switchSelectedChain(chain);
                            await switchWalletChain(chain.id);
                        }}
                    >
                        <img
                            src="/images/chains/logos/{chain.id}.svg"
                            alt={chain.name}
                            width="28"
                            height="28"
                        />
                        <span class="flex-auto">{chain.name}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </nav>

    <div class="arrow bg-surface-100-800-token" />
</div>

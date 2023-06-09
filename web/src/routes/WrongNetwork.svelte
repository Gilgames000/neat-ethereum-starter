<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { walletChainId } from '$lib/wallet';
  import { supportedChainsList, isSupportedChainId } from '$lib/config';
  import { switchWalletChain, disconnectWallet, isWalletConnected } from '$lib/wallet';
</script>

{#if $isWalletConnected && !isSupportedChainId($walletChainId)}
  <!-- on:introstart and on:outroend are required to transition 1 at a time between modals -->
  <div class="backdrop" transition:fade />
  <div role="dialog" class="modal" transition:fly={{ y: 50 }} on:introstart on:outroend>
    <div class="contents bg-surface-500">
      <h2>Unsupported Network</h2>
      <p>Please switch to a supported network or disconnect.</p>
      <div class="actions">
        {#each supportedChainsList as supportedChain}
          <button on:click={() => switchWalletChain(supportedChain.id)}
            >Switch to {supportedChain.name}</button
          >
        {/each}
        <button on:click={disconnectWallet}>Disconnect</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    min-width: 240px;
    border-radius: 6px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }

  h2 {
    text-align: center;
    font-size: 24px;
  }

  p {
    text-align: center;
    margin-top: 16px;
  }

  .actions {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  .backdrop {
    position: fixed;
    z-index: 999;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.85);
  }
</style>

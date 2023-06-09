<script lang="ts">
  import { connectWallet, disconnectWallet, isWalletConnected, walletAddress } from '$lib/wallet';
</script>

{#if $isWalletConnected}
  <button
    class="btn variant-filled-primary lg:mr-4"
    on:click={async () => await disconnectWallet()}
  >
    <span class="text-sm"
      >{$walletAddress.slice(0, 6)}...{$walletAddress.slice($walletAddress.length - 4)}</span
    >
  </button>
{:else}
  <button class="btn variant-filled-primary lg:mr-4" on:click={async () => await connectWallet()}>
    <span class="text-sm">Connect Wallet</span>
  </button>
{/if}

<script lang="ts">
  import { popup } from '@skeletonlabs/skeleton';
  import type { PopupSettings } from '@skeletonlabs/skeleton';

  export let name: string;
  export let tooltipPosition: 'top' | 'bottom' | 'left' | 'right';

  let popupLinkDisabled: PopupSettings = {
    // Set the event as: click | hover | hover-click | focus | focus-click
    event: 'hover',
    // Provide a matching 'data-popup' value.
    target: 'popup-link-disabled',
    placement: tooltipPosition
  };
</script>

<div>
  <span use:popup={popupLinkDisabled} class="navlink">{name}</span>
  <div
    class="card text-sm md:text-md variant-filled-secondary px-2 py-1 z-[666]"
    data-popup="popup-link-disabled"
  >
    Coming soon
    <!-- Append the arrow element -->
    <div class="arrow variant-filled-secondary" />
  </div>
</div>

<style lang="postcss">
  .navlink {
    @apply font-bold opacity-80 text-lg hover:opacity-100 hover:text-primary-500 cursor-pointer transition-all !text-inherit !no-underline;
  }
</style>

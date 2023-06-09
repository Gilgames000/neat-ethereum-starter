<script lang="ts">
  import type { LinkInfo } from '$lib/components/menus';
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
  import NavLink from './NavLink.svelte';
  import NavLinkDisabled from './NavLinkDisabled.svelte';

  export let name: string;
  export let submenu: LinkInfo[];

  const popupTarget = `nav-${name.toLowerCase().replace(' ', '-')}`;

  $: popupMenu = {
    event: 'focus-click',
    target: popupTarget,
    placement: 'bottom',
    // Close the popup when the item is clicked
    closeQuery: '.listbox-item'
  } satisfies PopupSettings;
</script>

<div>
  <button use:popup={popupMenu} class="navlink outline-none">
    <span>{name}</span>
    <i class="fa-solid fa-caret-down opacity-50" />
  </button>

  <div class="card min-w-[128px] shadow-xl p-2" data-popup={popupTarget}>
    <nav class="list-nav">
      <ul>
        {#each submenu as link}
          <li>
            {#if link.disabled}
              <NavLinkDisabled name={link.name} tooltipPosition="bottom" />
            {:else}
              <NavLink
                name={link.name}
                href={link.href}
                external={link.external}
                scroll={link.scroll}
              />
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</div>

<style lang="postcss">
  .navlink {
    @apply font-bold opacity-80 text-lg hover:opacity-100 hover:text-primary-500 cursor-pointer transition-all !text-inherit !no-underline;
  }
</style>

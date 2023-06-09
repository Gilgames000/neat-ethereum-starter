<script lang="ts">
  import type { LinkInfo } from '.';
  import NavLink from './NavLink.svelte';
  import NavLinkDisabled from './NavLinkDisabled.svelte';

  export let name: string;
  export let submenu: LinkInfo[];

  let submenuOpen = false;
</script>

<span class="relative">
  <a class="navlink" on:click={() => (submenuOpen = !submenuOpen)}>{name} 🞃</a>

  {#if submenuOpen}
    <ul>
      {#each submenu as link}
        <li class="ml-4">
          {#if link.disabled}
            <NavLinkDisabled name={link.name} tooltipPosition="bottom" />
          {:else}
            <NavLink name={link.name} href={link.href} scroll={link.scroll} />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</span>

<style lang="postcss">
  .navlink {
    @apply font-bold opacity-80 text-lg hover:opacity-100 hover:text-primary-500 cursor-pointer transition-all !text-inherit !no-underline;
  }
</style>

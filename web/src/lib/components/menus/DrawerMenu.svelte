<script lang="ts">
  import NavLink from './NavLink.svelte';
  import NavLinkDisabled from './NavLinkDisabled.svelte';
  import DrawerLinkSubmenu from './DrawerLinkSubmenu.svelte';
  import type { MenuItem } from 'src/routes/links';

  export let links: MenuItem[];
</script>

<ul class="mt-8 space-y-1 text-2xl font-light">
  {#each links as link}
    <li>
      {#if link.disabled}
        <NavLinkDisabled name={link.name} tooltipPosition="bottom" />
      {:else if link.submenu && link.submenu.length > 0}
        <DrawerLinkSubmenu name={link.name} submenu={link.submenu} />
      {:else}
        <NavLink name={link.name} href={link.href} scroll={link.scroll} />
      {/if}
    </li>
  {/each}
</ul>

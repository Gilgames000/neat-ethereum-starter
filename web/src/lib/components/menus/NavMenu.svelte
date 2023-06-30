<script lang="ts">
    import type { MenuItem } from 'src/routes/links';

    import NavLink from './NavLink.svelte';
    import NavLinkDisabled from './NavLinkDisabled.svelte';
    import NavLinkSubmenu from './NavLinkSubmenu.svelte';

    export let links: MenuItem[];
</script>

<div class="hidden lg:flex space-x-8 mr-10">
    {#each links as link}
        {#if link.disabled}
            <NavLinkDisabled name={link.name} tooltipPosition="bottom" />
        {:else if link.submenu && link.submenu.length > 0}
            <NavLinkSubmenu name={link.name} submenu={link.submenu} />
        {:else}
            <NavLink name={link.name} href={link.href} scroll={link.scroll} />
        {/if}
    {/each}
</div>

<script lang="ts">
  import { links } from './links';
  import { socials } from '$lib/socials';

  import LogoShort from '$lib/components/LogoShort.svelte';
  import { DrawerMenu } from '$lib/components/menus';
  import SvgIcon from '$lib/components/icons/SvgIcon.svelte';
</script>

<div class="flex flex-col p-8 w-full h-full">
  <LogoShort />
  <DrawerMenu {links} />
  <div class="flex-grow" />
  <div class="flex space-x-4 justify-center">
    {#each socials as social}
      <a rel="noopener noreferrer" href={social.href} target="_blank" title={social.name}>
        <SvgIcon name={social.name} width="w-8" height="h-8" fill="fill-current" />
      </a>
    {/each}
  </div>
</div>

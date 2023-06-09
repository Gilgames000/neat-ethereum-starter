<script lang="ts">
  import { isDrawerOpen, closeDrawer } from '$lib/drawer';
  import { scrollPageTo } from '$lib/scroll';

  export let name: string;
  export let href: string;
  export let external: boolean = false;
  export let scroll: boolean = false;
</script>

<a
  href={scroll ? '' : href}
  target={external ? '_blank' : ''}
  on:click={() => {
    if (isDrawerOpen) {
      closeDrawer();
    }

    if (scroll) {
      scrollPageTo(href);
    }
  }}
  class="navlink">{name}</a
>

<style lang="postcss">
  .navlink {
    @apply font-bold opacity-80 text-lg hover:opacity-100 hover:text-primary-500 cursor-pointer transition-all !text-inherit !no-underline;
  }
</style>

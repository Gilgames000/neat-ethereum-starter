<script lang="ts">
  import '../theme.css';
  import '@skeletonlabs/skeleton/styles/all.css';
  import '../app.postcss';

  import { appName, appDescription, appUrl } from '../application.json';
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import { queryParam } from 'sveltekit-search-params';
  import { browser } from '$app/environment';
  import { defaultChain, getChainById, isSupportedChainId } from '$lib/config';
  import { blockNumber, selectedChainId, switchSelectedChain } from '$lib/chain';
  import { modalComponentRegistry } from '$lib/modals';

  import NavBar from './NavBar.svelte';
  import WrongNetwork from './WrongNetwork.svelte';
  import { AppShell, Drawer, Toast } from '@skeletonlabs/skeleton';
  import { Modal } from '@skeletonlabs/skeleton';
  import DrawerContents from './DrawerContents.svelte';
  import Footer from './Footer.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  const title = appName;
  const description = appDescription;
  const host = appUrl.endsWith('/') ? appUrl : appUrl + '/';
  const previewImage = host + 'preview.png';

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  const chainIdUrlParam = queryParam('chainId', {
    encode: (value: number) => value.toString(),
    decode: (value: string | null) => (value ? parseInt(value) : null)
    //defaultValue: defaultChain.id
  });

  $: initialLoad = true; // this is needed to avoid the initial load of the page to trigger the chainId change

  onMount(() => {
    if ($chainIdUrlParam && isSupportedChainId($chainIdUrlParam)) {
      const newChain = getChainById($chainIdUrlParam);
      switchSelectedChain(newChain);
    }
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={host} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={previewImage} />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={host} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={previewImage} />
</svelte:head>

<!-- <WrongNetwork /> -->

<Toast buttonDismiss="btn" />

<Modal regionBackdrop="backdrop-blur-sm" duration={250} components={modalComponentRegistry} />

<Drawer position="left" width="w-fit">
  <DrawerContents />
</Drawer>

<AppShell>
  <svelte:fragment slot="header">
    <NavBar />
  </svelte:fragment>

  {#key $selectedChainId}
    <slot />
  {/key}

  <svelte:fragment slot="pageFooter">
    <Footer />
  </svelte:fragment>
</AppShell>

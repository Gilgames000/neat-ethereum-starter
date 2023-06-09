import { writable, type Writable } from '@square/svelte-store';
import { drawerStore } from '@skeletonlabs/skeleton';

export const isDrawerOpen: Writable<boolean> = writable(false);

export function openDrawer(): void {
  drawerStore.open();
  isDrawerOpen.set(true);
}

export function closeDrawer(): void {
  drawerStore.close();
  isDrawerOpen.set(false);
}

import DrawerMenu from './DrawerMenu.svelte';
import DrawerLinkSubmenu from './DrawerLinkSubmenu.svelte';
import NavMenu from './NavMenu.svelte';
import NavLinkSubmenu from './NavLinkSubmenu.svelte';
import NavLink from './NavLink.svelte';
import NavLinkDisabled from './NavLinkDisabled.svelte';

export interface LinkInfo {
  name: string;
  href: string;
  external: boolean;
  scroll: boolean;
  disabled: boolean;
}

export interface MenuItem extends LinkInfo {
  submenu?: LinkInfo[];
}

export { DrawerMenu, DrawerLinkSubmenu, NavMenu, NavLinkSubmenu, NavLink, NavLinkDisabled };

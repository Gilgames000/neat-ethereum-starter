import type { MenuItem } from '$lib/components/menus';

export const links = [
  {
    name: 'Link1',
    href: '/link1',
    external: false,
    scroll: false,
    disabled: false
  },
  {
    name: 'Link2',
    href: '/link2',
    external: false,
    scroll: false,
    disabled: true
  },
  {
    name: 'Socials',
    href: '',
    external: false,
    scroll: false,
    disabled: false,
    submenu: [
      {
        name: 'Twitter',
        href: 'https://twitter.com/Gilgames1337',
        external: true,
        scroll: false,
        disabled: false
      },
      {
        name: 'Telegram',
        href: 'https://t.me/Gilgames',
        external: true,
        scroll: false,
        disabled: false
      },
      {
        name: 'Discord',
        href: 'https://discord.com/users/841831387169423372',
        external: true,
        scroll: false,
        disabled: false
      }
    ]
  }
] satisfies MenuItem[];

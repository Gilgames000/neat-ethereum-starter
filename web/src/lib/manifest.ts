import { appDescription, appUrl, appName } from '../application.json';

export const manifest = {
  name: appName,
  description: appDescription,
  iconPath: `${appUrl}/favicon.ico`,
  icons: [
    {
      src: 'favicon.ico',
      sizes: '64x64 32x32 24x24 16x16',
      type: 'image/png'
    }
  ]
} as const;

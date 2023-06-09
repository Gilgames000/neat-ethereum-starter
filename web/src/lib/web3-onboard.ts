import Onboard, { type OnboardAPI } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import gnosisModule from '@web3-onboard/gnosis';
import walletConnectModule from '@web3-onboard/walletconnect';
import { supportedChainsList } from '$lib/config';
import { Buffer } from 'buffer';
import { appName, appDescription, appUrl } from '../application.json';

globalThis.Buffer = Buffer; // polyfill needed for walletconnect
let onboard: OnboardAPI | undefined = undefined;

const injected = injectedModule();
const gnosis = gnosisModule({ whitelistedDomains: [/safe.global/, /safe.neobase.one/] });
const walletConnect = walletConnectModule();

if (!onboard) {
  onboard = Onboard({
    wallets: [injected, gnosis, walletConnect],
    chains: supportedChainsList.map(({ id, name }) => ({ id, label: name })),
    accountCenter: {
      desktop: {
        enabled: false,
        containerElement: 'html'
      },
      mobile: {
        enabled: false,
        containerElement: 'html'
      }
    },
    appMetadata: {
      name: appName,
      icon: `${appUrl}/images/favicon.ico`,
      logo: `${appUrl}/images/favicon.ico`,
      description: appDescription,
      recommendedInjectedWallets: [
        { name: 'Rabby', url: 'https://rabby.io' },
        { name: 'MetaMask', url: 'https://metamask.io' },
        { name: 'Brave', url: 'https://brave.com/wallet' }
      ]
    }
  });
}

export default onboard as OnboardAPI;

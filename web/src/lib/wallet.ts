import type { WalletState } from '@web3-onboard/core';
import { derived, get, writable } from '@square/svelte-store';
import { browser } from '$app/environment';
import { createWalletClient, custom, getAddress, type WalletClient } from 'viem';
import { selectedChain, switchSelectedChain } from '$lib/chain';
import onboard from '$lib/web3-onboard';
import { getChainById, isSupportedChainId } from './config';

function getFingerprint(wallet: WalletState): string {
    return JSON.stringify([wallet?.label, wallet?.chains[0].id, wallet?.accounts[0].address]);
}

function getAddressFromFingerprint(fingerprint: string): string {
    return JSON.parse(fingerprint)[2];
}

function updateAlreadyConnectedWallets() {
    const connectedWalletsLabels = onboard.state
        .get()
        .wallets.map(({ label }: { label: string }) => label);
    window.sessionStorage.setItem(
        'alreadyConnectedWallets',
        JSON.stringify(connectedWalletsLabels)
    );
    // console.log('alreadyConnectedWallets', JSON.stringify(connectedWalletsLabels));
}

let currentWallet: string | undefined = undefined;
const walletClient = writable<WalletClient | undefined>(undefined);
const walletChainId = writable<number>(0);
const walletAddress = writable<`0x${string}`>('0x');
const walletsSub = onboard.state.select('wallets');
if (browser) {
    // console.log('walletsSub', walletsSub);
    const { unsubscribe } = walletsSub.subscribe((wallets) => {
        if (wallets.length === 0) {
            currentWallet = undefined;
            return;
        }

        const fingerprint = getFingerprint(wallets[0]);
        if (currentWallet !== undefined && currentWallet === fingerprint) {
            return;
        }

        const walletProvider = wallets[0]?.provider;
        const chainId = wallets[0]?.chains[0].id;
        const address = wallets[0]?.accounts[0].address;
        if (walletProvider && chainId && address) {
            walletClient.set(
                createWalletClient({
                    account: getAddress(address),
                    chain: getChainById(chainId),
                    transport: custom(walletProvider)
                })
            );
            walletChainId.set(Number(chainId));
            walletAddress.set(getAddress(address));
        }

        updateAlreadyConnectedWallets();
        currentWallet = fingerprint;
    });

    const alreadyConnectedWallets = JSON.parse(
        window.sessionStorage.getItem('alreadyConnectedWallets') ?? '[]'
    );
    if (alreadyConnectedWallets && alreadyConnectedWallets.length > 0) {
        onboard
            .connectWallet({
                autoSelect: { label: alreadyConnectedWallets[0], disableModals: true }
            })
            .catch(console.error);
        currentWallet = getFingerprint(onboard.state.get().wallets[0]);
    }
}

const isWalletConnected = derived([walletClient], ([$walletClient]) => {
    // console.log('isWalletConnected: walletClient', $walletClient);
    if (!$walletClient) {
        return false;
    }

    const walletAddress = onboard.state.get().wallets[0]?.accounts[0]?.address;
    if (!walletAddress) {
        return false;
    }

    return walletAddress.toLowerCase() === $walletClient.account?.address.toLowerCase();
});

// walletChainId.subscribe((chainId) => {
//     if (chainId === get(selectedChain).id) return;
//     if (!isSupportedChainId(chainId)) return;
//     const chain = getChainById(chainId);
//     switchSelectedChain(chain);
// });

async function connectWallet() {
    // console.log('connectWallet');
    const wallets = await onboard.connectWallet();
    currentWallet = getFingerprint(wallets[0]);
    // console.log(wallets);
    // window.location.reload();
}

async function ensureWalletConnected(checkCorrectChain = true) {
    if (!get(isWalletConnected)) {
        await connectWallet();
    }
    if (checkCorrectChain && get(walletChainId) !== get(selectedChain).id) {
        await switchWalletChain(get(selectedChain).id);
    }
}

async function disconnectWallet() {
    if (!get(isWalletConnected)) return;

    const connectedWallet = onboard.state.get().wallets[0];
    await onboard.disconnectWallet({ label: connectedWallet.label });
    walletAddress.set('0x');
    walletChainId.set(0);
    walletClient.set(undefined);
    updateAlreadyConnectedWallets();
    // window.location.reload();
}

async function switchWalletChain(chainId: string | number) {
    if (!get(isWalletConnected)) return;
    // await ensureConnected();
    await onboard.setChain({ chainId: Number(chainId) });
    // window.location.reload();
}

export {
    walletClient,
    walletChainId,
    walletAddress,
    isWalletConnected,
    connectWallet,
    disconnectWallet,
    switchWalletChain,
    ensureWalletConnected
};

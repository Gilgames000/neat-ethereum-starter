import { asyncDerived, derived, get, writable, type Writable } from '@square/svelte-store';
import { Token } from 'ethoolbox';
import type { Address } from 'viem';
import { selectedChainId } from './chain';
import { localStorageStore } from '@skeletonlabs/skeleton';

export interface TokenList {
    name: string;
    timestamp: string;
    url: string;
    logoURI: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    tokens: Token[];
}

const defaultTokenListSources = [
    'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/mc.tokenlist.json'
];

const tokenListSourcesStore = writable([...defaultTokenListSources]);

type JsonToken = {
    chainId: number;
    address: string;
    decimals: number;
    symbol: string;
    name: string;
    logoURI: string;
};

type JsonTokenList = {
    name: string;
    timestamp: string;
    logoURI: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    tokens: JsonToken[];
};

function validateToken(json: JsonToken): boolean {
    if (!json.chainId) return false;
    if (!json.address) return false;
    if (!json.decimals) return false;
    if (!json.symbol) return false;
    if (!json.name) return false;
    if (!json.logoURI) return false;
    return true;
}

function validateTokenListExceptTokens(json: JsonTokenList): boolean {
    if (!json.name) return false;
    if (!json.timestamp) return false;
    if (!json.logoURI) return false;
    if (!json.version) return false;
    if (!json.tokens) return false;
    return true;
}

const cachedTokenLists = localStorageStore<TokenList[]>('tokenLists', []);

const tokenLists = asyncDerived([tokenListSourcesStore], async ([$tokenListSources]) => {
    const tokenLists: TokenList[] = [];
    const cached = get(cachedTokenLists);
    if (cached)
        tokenLists.push(
            ...cached.map((tokenList) => ({
                ...tokenList,
                tokens: tokenList.tokens.map(
                    (token) =>
                        new Token(
                            token.chainId,
                            token.address,
                            token.decimals,
                            token.symbol,
                            token.name,
                            token.logoURI
                        )
                )
            }))
        );
    const nonCachedSources = $tokenListSources.filter(
        (source) => !cached?.find((tokenList) => tokenList.url === source)
    );
    const responses = await Promise.all(nonCachedSources.map((url) => fetch(url)));
    const jsons = await Promise.all(responses.map((response) => response.json()));
    for (let i = 0; i < jsons.length; i++) {
        const json = jsons[i];
        if (!validateTokenListExceptTokens(json)) continue;
        const tokens: Token[] = [];
        for (const token of json.tokens) {
            if (!validateToken(token)) continue;
            tokens.push(
                new Token(
                    token.chainId,
                    token.address,
                    token.decimals,
                    token.symbol,
                    token.name,
                    token.logoURI
                )
            );
        }
        tokenLists.push({
            name: json.name,
            timestamp: json.timestamp,
            url: nonCachedSources[i],
            logoURI: json.logoURI,
            version: json.version,
            tokens
        });
    }
    cachedTokenLists.set(tokenLists);
    return tokenLists;
});

const verifiedTokensByChainId = derived([tokenLists], ([$tokenLists]) => {
    const tokensByChainId = new Map<number, Token[]>();
    for (const tokenList of $tokenLists ?? []) {
        for (const token of tokenList.tokens) {
            const tokens = tokensByChainId.get(token.chainId) ?? [];
            if (tokens.some((t) => t.address.toLowerCase() === token.address.toLowerCase()))
                continue;
            tokens.push(token);
            tokensByChainId.set(token.chainId, tokens);
        }
    }
    return tokensByChainId;
});

const verifiedTokens = derived(
    [verifiedTokensByChainId, selectedChainId],
    ([$verifiedTokensByChainId, $selectedChainId]) => {
        return $verifiedTokensByChainId?.get($selectedChainId) ?? [];
    }
);

const tokenListSources = {
    subscribe: tokenListSourcesStore.subscribe,
    add: (url: string) => {
        tokenListSourcesStore.update((sources) => [...sources, url]);
    },
    remove: (url: string) => {
        tokenListSourcesStore.update((sources) => sources.filter((source) => source !== url));
    }
};

function isVerifiedTokenByChainId(chainId: number, address: Address): boolean {
    const tokens = get(verifiedTokensByChainId).get(chainId);
    if (!tokens) return false;
    return tokens.some((token) => token.address.toLowerCase() === address.toLowerCase());
}

function isVerifiedToken(address: Address): boolean {
    return isVerifiedTokenByChainId(get(selectedChainId), address);
}

function getVerifiedTokenByChainId(chainId: number, address: Address): Token | null {
    const tokens = get(verifiedTokensByChainId).get(chainId);
    if (!tokens) return null;
    return tokens.find((token) => token.address.toLowerCase() === address.toLowerCase()) ?? null;
}

function getVerifiedToken(address: Address): Token | null {
    return getVerifiedTokenByChainId(get(selectedChainId), address);
}

const allImportedTokens: Writable<Token[]> = localStorageStore('importedTokens', [], {
    serializer: {
        parse: (value: string) => {
            const tokensJson = JSON.parse(value);
            const tokens: Token[] = [];
            for (const tokenJson of tokensJson) {
                tokens.push(
                    new Token(
                        tokenJson.chainId,
                        tokenJson.address,
                        tokenJson.decimals,
                        tokenJson.symbol,
                        tokenJson.name,
                        tokenJson.logoURI
                    )
                );
            }
            return tokens;
        },
        stringify: (tokens: Token[]) => {
            const tokensJson = [];
            for (const token of tokens) {
                tokensJson.push({
                    chainId: token.chainId,
                    address: token.address,
                    decimals: token.decimals,
                    symbol: token.symbol,
                    name: token.name,
                    logoURI: token.logoURI
                });
            }
            return JSON.stringify(tokensJson);
        }
    }
});

const importedTokensByChainId = derived([allImportedTokens], ([$allImportedTokens]) => {
    const tokensByChainId = new Map<number, Token[]>();
    for (const token of $allImportedTokens ?? []) {
        const tokens = tokensByChainId.get(token.chainId) ?? [];
        tokens.push(token);
        tokensByChainId.set(token.chainId, tokens);
    }
    return tokensByChainId;
});

const importedTokens = derived(
    [importedTokensByChainId, selectedChainId],
    ([$importedTokensByChainId, $selectedChainId]) => {
        return $importedTokensByChainId?.get($selectedChainId) ?? [];
    }
);

function importToken(token: Token) {
    // TODO: check if token is already imported?
    allImportedTokens.update((tokens) => [...tokens, token]);
}

function removeImportedToken(address: Address) {
    allImportedTokens.update((tokens) => tokens.filter((token) => token.address !== address));
}

function isImportedTokenByChainId(chainId: number, address: Address) {
    return (
        get(importedTokensByChainId)
            .get(chainId)
            ?.some((token) => token.address === address) ?? false
    );
}

function isImportedToken(address: Address) {
    return get(importedTokens).some((token) => token.address === address);
}

function getImportedTokenByChainId(chainId: number, address: Address) {
    return (
        get(importedTokensByChainId)
            .get(chainId)
            ?.find((token) => token.address === address) ?? null
    );
}

function getImportedToken(address: Address) {
    return getImportedTokenByChainId(get(selectedChainId), address);
}

const allTrackedTokensByChainId = derived(
    [verifiedTokensByChainId, importedTokensByChainId],
    ([$verifiedTokensByChainId, $importedTokensByChainId]) => {
        const tokensByChainId = new Map<number, Token[]>();
        for (const [chainId, tokens] of $verifiedTokensByChainId ?? []) {
            tokensByChainId.set(chainId, tokens);
        }
        for (const [chainId, tokens] of $importedTokensByChainId ?? []) {
            const existingTokens = tokensByChainId.get(chainId) ?? [];
            tokensByChainId.set(chainId, [...existingTokens, ...tokens]);
        }
        return tokensByChainId;
    }
);

const allTrackedTokens = derived(
    [allTrackedTokensByChainId, selectedChainId],
    ([$allTrackedTokensByChainId, $selectedChainId]) => {
        return $allTrackedTokensByChainId?.get($selectedChainId) ?? [];
    }
);

function isTrackedTokenByChainId(chainId: number, address: Address) {
    const tokens = get(allTrackedTokensByChainId);
    return tokens.get(chainId)?.some((token) => token.address === address) ?? false;
}

function isTrackedToken(address: Address) {
    return isTrackedTokenByChainId(get(selectedChainId), address);
}

function getTrackedTokenByChainId(chainId: number, address: Address) {
    const tokens = get(allTrackedTokensByChainId);
    return tokens.get(chainId)?.find((token) => token.address === address) ?? null;
}

function getTrackedToken(address: Address) {
    return getTrackedTokenByChainId(get(selectedChainId), address);
}

export {
    tokenListSources,
    tokenLists,
    verifiedTokensByChainId,
    verifiedTokens,
    isVerifiedTokenByChainId,
    isVerifiedToken,
    getVerifiedTokenByChainId,
    getVerifiedToken,
    importedTokensByChainId,
    importedTokens,
    importToken,
    removeImportedToken,
    isImportedTokenByChainId,
    isImportedToken,
    getImportedTokenByChainId,
    getImportedToken,
    allTrackedTokensByChainId,
    allTrackedTokens,
    isTrackedTokenByChainId,
    isTrackedToken,
    getTrackedTokenByChainId,
    getTrackedToken
};

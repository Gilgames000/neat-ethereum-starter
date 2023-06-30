import { getContract, type Address, type PublicClient, type WalletClient } from 'viem';
import { CurrencyAmount, Token } from 'ethoolbox';
import { ERC20Abi } from '$lib/abis';
import invariant from 'tiny-invariant';

export function getErc20ViewContract(_publicClient: PublicClient, _tokenAddress: Address) {
    if (!_publicClient.chain) throw new Error('Chain is not set');
    return getContract({
        address: _tokenAddress,
        abi: ERC20Abi,
        publicClient: _publicClient
    });
}

export function getErc20Contract(_walletClient: WalletClient, _tokenAddress: Address) {
    if (!_walletClient.chain) throw new Error('Chain is not set');
    if (!_walletClient.account) throw new Error('Wallet is not connected');
    return getContract({
        address: _tokenAddress,
        abi: ERC20Abi,
        walletClient: _walletClient
    });
}

export async function getErc20Token(
    _publicClient: PublicClient,
    _address: Address
): Promise<Token | null> {
    const chainId = _publicClient.chain?.id;
    invariant(chainId, 'Chain ID is not set');

    const erc20Contract = {
        address: _address,
        abi: ERC20Abi
    } as const;

    const [decimals, symbol, name] = await _publicClient.multicall({
        contracts: [
            {
                ...erc20Contract,
                functionName: 'decimals'
            },
            {
                ...erc20Contract,
                functionName: 'symbol'
            },
            {
                ...erc20Contract,
                functionName: 'name'
            }
        ]
    });

    if (decimals.status === 'failure' || symbol.status === 'failure' || name.status === 'failure') {
        console.error('Failed to get ERC20 token info', decimals, symbol, name);
        return null;
    }

    return new Token(
        chainId,
        _address,
        decimals.result,
        symbol.result,
        name.result,
        undefined,
        true
    );
}

export async function getErc20Allowance<T extends Token>(
    _publicClient: PublicClient,
    _token: T,
    _owner: Address,
    _spender: Address
): Promise<CurrencyAmount<T>> {
    const erc20Contract = getErc20ViewContract(_publicClient, _token.address);
    const allowance = await erc20Contract.read.allowance([_owner, _spender]);
    return CurrencyAmount.fromRawAmount(_token, [allowance, _token.decimals]);
}

export async function approveErc20<T extends Token>(
    _walletClient: WalletClient,
    _spender: Address,
    _amount: CurrencyAmount<T>
): Promise<`0x${string}`> {
    const _token = _amount.currency;
    const erc20Contract = getErc20Contract(_walletClient, _token.address);
    if (!_walletClient.account) throw new Error('Wallet is not connected');
    return await erc20Contract.write.approve([_spender, _amount.rawAmount[0]], {
        account: _walletClient.account,
        chain: _walletClient.chain
    });
}

export async function approveInfinityErc20<T extends Token>(
    _walletClient: WalletClient,
    _token: T,
    _spender: Address
): Promise<`0x${string}`> {
    return await approveErc20(
        _walletClient,
        _spender,
        CurrencyAmount.fromRawAmount(_token, [2n ** 256n - 1n, _token.decimals])
    );
}

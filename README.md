# neat-ethereum-starter

A neat template for developing Ethereum-enabled web applications with the Foundry+SvelteKit+Skeleton.dev stack.

## Requirements:

-   [nodejs](https://nodejs.org/en)

-   [pnpm](https://pnpm.io/)

    ```bash
    npm i -g pnpm
    ```

-   [foundry](https://getfoundry.sh/)

    ```bash
    curl -L https://foundry.paradigm.xyz | bash;
    export PATH=$HOME/.foundry/bin:$PATH # or load it from your shell config which the script above should have configured
    foundryup
    ```

-   [zellij](https://zellij.dev/)

## How To Use:

```bash
pnpm install
pnpm start
```

This will install all of the dependencies and start everything you need with hot reloading enabled on a local Anvil instance.

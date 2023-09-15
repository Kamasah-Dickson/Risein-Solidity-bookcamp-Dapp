# Risein Smartcontract Bootcamp

- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Quickstart](#quickstart)
- [Usage](#usage)
  - [Testing](#testing)
  - [Deployment](#deployment)
- [Deployment to the bnb testnet](#deploying-to-a-testnet)
  - [Verify on bscscan](#verify-on-bscscan)
- [Thank you!](#thank-you)
- [Contact](#contact)

## Getting Started

### Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`

## Quickstart

```bash
git clone https://github.com/Kamasah-Dickson/Risein-Solidity-bookcamp-Dapp.git

```

## Usage

install:

```bash
npm install
```

## Deployment

will automatically deploy to the bnb testnet. this will automatically try to verify the contract also. if it fails might be timeout error but has been deployed, and you can go ahead and verify if it yourself by copying the contract address logged in the console.

```bash
npm run deploy

or

yarn deploy

```

## Testing

```bash
npm run test

or
yarn test

```

## Deploying to a testnet

1. Setup environment variabltes

You'll want to set your `BNB_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to an `.env` file, similar to what you see in `.env`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `BNBCHAIN_RPC_URL`: This is url of the bnb testnet node you're working with.

## Get a testnet BNB

Head over to [Bnbchain.org](https://testnet.bnbchain.org/faucet-smart) and get some tesnet bnb. You should see the bnb show up in your metamask.

## Then run

with this project we a deploying on the bnb testnet

```bash
npx hardhat deploy --network bnbchain
```

And copy / remember the contract address to verify on bscscan.

## Verify on bscscan

If you deploy to a testnet, you can verify it if you get an [API Key](https://bscscan.com/apis) from bscscan. remember to choose the free teer and set it as an environemnt variable named `BINANCESCAN_API_KEY`. You can pop it into your `.env`
In it's current state, if you have your api key set, it will auto verify bnb contracts!

### contact

For questions or feedback, feel free to contact me, [kamasahdickson19@gmail.com](kamasahdickson19@gmail.com)

### Thank you

# Basic FundMe Website

This project demonstrates a basic FundMe Website Where you can connect wallet Lock and withdrew BNB.
Try running some of the following tasks:

# Solidity-bookcamp-Final-Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install

npm run dev
```

cd into the solidity directory and install the dependencies for hardhat.

```bash
npm install

```

run the following to deploy to bnbscan

```bash
npx hardhat deploy --network bnbchain

```

to run tests on the bnbchain,

```bash
npx hardhat test --network bnbchain
```

## Using Ganache & Networks(optional)

Ganache is a javaScript virtual fake environment;
to deploy the contract on a fake blockchain you can use Ganache. but in this project we are using the hardhat runtime environment as the javaScript runtime environment for our solidity code.

[Ganache](https://trufflesuite.com/ganache/):
Ganache is a Quick fire up a personal Ethereum blockchain which you can use to run tests, execute commands, and inspect state while controlling how the chain operates.

Some of the things I learnt along the way. `Cannot specify all`

## ethers.js

ethers.js is a js library that powers hardhat environment. for this project we are using hardhat so that we can test and compile our solidity code. this is optional if you want to install ethers.js

```javascript

yarn add ethers.js

or

npm install ethers
```

utilizing ethers

```javascript
const ethers = require("ethers");
```

## Getting a provider

Get your provider in the ganache desktop application. e.g mine is <http://127.0.0.1:1245> and
inject it into the jsonRpcProvider. the url basically allows us to connect to our local blockchain which is Ganache.

```javascript

const provider = new ethers.jsonRpcProvider(http:127.0.0.1:7545)
```

## Getting a wallet

to get a fake wallet for the dev env you can find a private key in the ganache application by clicking on one of the icons that looks like a key on the fake address. it is adviceable to save your private key in a .env environment.

```javascript
const wallet = new ethers.wallet(process.env.PRIVATE_KEY, provider);
```

## Deploying a contract

in other to deploy a contract we need three things. the ABI, the BIN and a contract factory.
to get your ABI and BIN please go and checkout the solc.js repository in github and
follow the instructions to get your abi and bin or use my script. in my case i have a solidity directory so am compiling them in that folder.

```javascript

add the line below to the package.json scripts

"compile": "solcjs --bin --include-path node_modules/ --base-path solidity/ --output-dir solidity/ solidity/SimpleStorage.sol"

```

## ABI

```javascript
const abi = fs.readFileSync(pathToABIfile, "utf8");
```

## BIN

```javascript
const bin = fs.readFileSync(pathToBINfile, "utf8");
```

## Contract Factory

contract factory is used to deploy a contract to the blockchain. it contains your credentials or should i say meta.

```javascript
const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
console.log("Deploying,please wait...");
const contract = await contractFactory.deploy();
console.log(contract); //logs your credentials
```

## Solidity Coverage

solidity coverage is an npm package that tracks solidity files or lines that has not been tested. to install

```javascript

yarn add solidity-coverage

or

npm install solidity-coverage

```

## localy generate fake accounts and private keys

run the following to generate a fake account and private key for testing locally

```bash

npx hardhat node
```

Inside the solidity folder, you can do

```bash

npx hardhat deploy

```

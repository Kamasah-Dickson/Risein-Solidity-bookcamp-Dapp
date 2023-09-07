This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

# Solidity-bookcamp-Final-Project

# Compiler

in other to compile the solidity code, install solc.js. solc.js is just a solidity compiler.

```bash

 npm install solc

or

yarn add solc

```

## Ganache & Networks

Ganache is a javaScript virtual fake environment;
to deploy the contract on a fake blockchain you can use Ganache. but in the
future we can use hardhat runtime environment as the javaScript runtime
environment for solidity.

[Download Ganache](https://trufflesuite.com/ganache/):
Ganache is a Quick fire up a personal Ethereum blockchain which you can use to run tests, execute commands, and inspect state while controlling how the chain operates.

## ethers.js

ethers.js is a js library that powers hardhat environment.

```javascript

yarn add ethers.js

or

npm install ethers
```

utilizing ethers

```javascript
const ethers = require("ethers")
```

## Getting a provider

look for a provider in the ganache desktop application. e.g <http://127.0.0.1:1245> and
inject it into the jsonRpcProvider. the url basically allows us to connect to our local blockchain

```javascript

const provider = new ethers.jsonRpcProvider(http:127.0.0.1:7545)
```

## Getting a wallet

to get a fake wallet for the dev env you can find a private key in the ganache
application by clicking on one of the icons that looks like a key on the fake address by ganache application.
it is adviceable to save your private key in a .env environment.

```javascript
const wallet = new ethers.wallet(process.env.PRIVATE_KEY, provider)
```

## Deploying a contract

in other to deploy a contract we need three things. the ABI, the BIN and a contract
factory.
to get your ABI and BIN please go and checkout the solc.js repository in github and
follow the instructions to get your abi and bin. in my case i have a solidity folder so am compiling them in the
same folder

```javascript

add the line below to the package.json scripts

"compile": "solcjs --bin --include-path node_modules/ --base-path solidity/ --output-dir solidity/ solidity/SimpleStorage.sol"

```

## ABI

```javascript
const abi = fs.readFileSync(pathToABIfile, "utf8")
```

## BIN

```javascript
const bin = fs.readFileSync(pathToBINfile, "utf8")
```

## Contract Factory

contract factory is used to deploy a contract to the blockchain.

```javascript
const contractFactory = new ethers.ContractFactory(abi, bin, wallet)
console.log("Deploying,please wait...")
const contract = await contractFactory.deploy()
console.log(contract)
```

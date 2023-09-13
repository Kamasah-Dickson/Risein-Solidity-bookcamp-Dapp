require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const BNBCHAIN_RPC_URL =
   process.env.BNBCHAIN_RPC_URL ||
   "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
const PRIVATE_KEY = process.env.PRIVATE_KEY
const REPORT_GAS = process.env.REPORT_GAS || false
const BINANCESCAN_API_KEY =
   process.env.BINANCESCAN_API_KEY || "Your etherscan API key"

// Your API key for Etherscan, obtain one at https://etherscan.io/
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"

module.exports = {
   defaultNetwork: "hardhat",
   networks: {
      localhost: {
         chainId: 31337,
      },
      bnbchain: {
         url: BNBCHAIN_RPC_URL,
         accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
         //   accounts: {
         //     mnemonic: MNEMONIC,
         //   },
         saveDeployments: true,
         chainId: 97,
      },
   },
   etherscan: {
      // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
      apiKey: {
         binance: BINANCESCAN_API_KEY,
      },
   },
   gasReporter: {
      enabled: REPORT_GAS,
      currency: "USD",
      outputFile: "gas-report.txt",
      noColors: true,
      // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
   },
   contractSizer: {
      runOnCompile: false,
      only: ["vault"],
   },
   namedAccounts: {
      deployer: {
         default: 0, // here this will by default take the first account as deployer
         1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      },
      player: {
         default: 1,
      },
   },
   solidity: {
      compilers: [
         {
            version: "0.8.7",
         },
         {
            version: "0.4.24",
         },
      ],
   },
   mocha: {
      timeout: 500000, // 500 seconds max for running tests
   },
}

require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */

const BNBCHAIN_RPC_URL =
   process.env.BNBCHAIN_RPC_URL || "https/bnbchain/exmaple"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "key"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"
const BINANCESCAN_API_KEY = process.env.BINANCESCAN_API_KEY || "key"

module.exports = {
   defaultNetwork: "hardhat",
   networks: {
      bnbchain: {
         url: BNBCHAIN_RPC_URL,
         accounts: [PRIVATE_KEY],
         chainId: 97,
         blockConfirmations: 6,
      },
   },
   solidity: {
      //* it is used to so we can use diffrent soidity versions in our code
      compilers: [
         {
            version: "0.8.8",
         },
         {
            version: "0.6.6",
         },
      ],
   },
   etherscan: {
      apiKey: {
         bscTestnet: BINANCESCAN_API_KEY,
      },
   },
   gasReporter: {
      enabled: false,
      outputFile: "gas-report.txt",
      coinmarketcap: COINMARKETCAP_API_KEY,
      currency: "BNB",
      noColors: true,
   },
   namedAccounts: {
      deployer: {
         default: 0,
      },
   },
   mocha: {
      timeout: 500000,
   },
}

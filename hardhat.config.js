require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BINANCESCAN_API_KEY = process.env.BINANCESCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
	solidity: "0.8.9",
	defaultNetwork: "bnbchain",
	networks: {
		bnbchain: {
			url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
			accounts: [PRIVATE_KEY],
			chainId: 97,
		},
	},

	gasReporter: {
		enabled: false,
		currency: "BNB",
		// noColors: true,
		coinmarketcap: COINMARKETCAP_API_KEY,
		token: "BNB",
	},

	etherscan: {
		// yarn hardhat verify --network <NETWORK>
		apiKey: BINANCESCAN_API_KEY,
	},
};

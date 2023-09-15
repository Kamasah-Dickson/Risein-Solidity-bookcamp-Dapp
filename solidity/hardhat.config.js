require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */

// require("hardhat-deploy");
require("dotenv").config();

const BNBCHAIN_RPC_URL =
	process.env.BNBCHAIN_RPC_URL || "https://bsc-dataseed1.binance.org/"; // Replace with the actual BSC RPC URL
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BINANCESCAN_API_KEY =
	process.env.BINANCESCAN_API_KEY || "Your BscScan API key";

module.exports = {
	solidity: "0.8.9",
	// defaultNetwork: "bnbchain",
	networks: {
		bnbchain: {
			url: BNBCHAIN_RPC_URL,
			accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
			// saveDeployments: true,
			chainId: 97,
		},
	},
	etherscan: {
		// yarn hardhat verify --network <NETWORK>
		apiKey: BINANCESCAN_API_KEY,
	},
};

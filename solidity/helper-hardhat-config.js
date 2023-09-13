const { ethers } = require("hardhat")

const networkConfig = {
   97: {
      name: "bnbchain",
      gasLane:"0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
      keepersUpdateInterval: "30",
      subscriptionId:"5192",
      vaultEntranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
      callbackGasLimit: "500000", // 500,000 gas
      vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
   },
   default: {
      name: "hardhat",
      keepersUpdateInterval: "30",
   },
   31337: {
      name: "localhost",
      subscriptionId: "588",
      gasLane:"0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
      keepersUpdateInterval: "30",
      vaultEntranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
      callbackGasLimit: "500000", // 500,000 gas
   },
   11155111: {
      name: "sepolia",
      subscriptionId: "6926",
      gasLane:
         "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
      keepersUpdateInterval: "30",
      vaultEntranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
      callbackGasLimit: "500000", // 500,000 gas
      vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
   },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsFile = "../frontend/constants/contractAddressess.json"
const frontEndAbiFile = "../frontend/constants/abi.json"

module.exports = {
   networkConfig,
   developmentChains,
   VERIFICATION_BLOCK_CONFIRMATIONS,
   frontEndContractsFile,
   frontEndAbiFile,
}

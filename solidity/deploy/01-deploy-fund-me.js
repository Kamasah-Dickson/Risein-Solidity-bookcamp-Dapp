const { network } = require("hardhat")

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()
   const chainId = network.config.chainId

   let ethUsdPriceFeedAddress
   if (developmentChains.includes(network.name)) {
      const ethUsdAggregator = await deployments.get("MockV3Aggregator")
      ethUsdPriceFeedAddress = ethUsdAggregator.address
   } else {
      ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
   }
   //* when going for localhost or hardhat network we want to use a mock
   const args = [ethUsdPriceFeedAddress]
   const fundMe = await deploy("FundMe", {
      from: deployer,
      args: args,
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
   })

   if (
      !developmentChains.includes(network.name) &&
      process.env.BINANCESCAN_API_KEY
   ) {
      await verify(fundMe.address, args)
   }

   log("----------------------------------------------------------------")
}
module.exports.tags = ["all", "fundMe"]

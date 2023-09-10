const networkConfig = {
   97: {
      name: "bnbchain",
      ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
   },
}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INTIAL_ANSWER = 200000000000

module.exports = {
   networkConfig,
   developmentChains,
   DECIMALS,
   INTIAL_ANSWER,
}

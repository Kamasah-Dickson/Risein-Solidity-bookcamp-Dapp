const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
   const { deployer } = await getNamedAccounts()
   const fundMe = await ethers.getContractAt("FundMe", deployer)
   console.log("Funding Contract...")
   const transactionResponse = await fundMe.fund({
      value: ethers.utils.parseEther("0.1"),
   })
   await transactionResponse.wait(1)
   console.log("Funded!")
}

main()
   .then(() => process.exit())
   .catch((error) => {
      console.error(error)
      process.exit(1)
   })

const { getNamedAccounts, ethers } = require("hardhat")
async function main() {
   const { deployer } = await getNamedAccounts()
   const fundMe = await ethers.getContractAt("FundMe", deployer)
   console.log("Withdrawing....")
   const transactionResponse = await fundMe.withdraw()
   await transactionResponse.wait(1)
   console.log("Withdarw Successfull")
}

main()
   .then(() => process.exit())
   .catch((error) => {
      console.error(error)
      process.exit(1)
   })

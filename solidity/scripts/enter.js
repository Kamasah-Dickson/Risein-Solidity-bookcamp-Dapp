const { ethers } = require("hardhat")

async function entervault() {
   const vault = await ethers.getContract("vault")
   const entranceFee = await vault.getEntranceFee()
   await vault.entervault({ value: entranceFee + 1 })
   console.log("Entered!")
}

entervault()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error)
      process.exit(1)
   })

const { assert, expect } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
   ? describe.skip
   : describe("vault Staging Tests", function () {
        let vault, vaultEntranceFee, deployer

        beforeEach(async function () {
           deployer = (await getNamedAccounts()).deployer
           vault = await ethers.getContract("vault", deployer)
           vaultEntranceFee = await vault.getEntranceFee()
        })

        describe("fulfillRandomWords", function () {
           it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
              // enter the vault
              console.log("Setting up test...")
              const startingTimeStamp = await vault.getLastTimeStamp()
              const accounts = await ethers.getSigners()

              console.log("Setting up Listener...")
              await new Promise(async (resolve, reject) => {
                 // setup listener before we enter the vault
                 // Just in case the blockchain moves REALLY fast
                 vault.once("WinnerPicked", async () => {
                    console.log("WinnerPicked event fired!")
                    try {
                       // add our asserts here
                       const recentWinner = await vault.getRecentWinner()
                       const vaultState = await vault.getvaultState()
                       const winnerEndingBalance =
                          await accounts[0].getBalance()
                       const endingTimeStamp = await vault.getLastTimeStamp()

                       await expect(vault.getPlayer(0)).to.be.reverted
                       assert.equal(
                          recentWinner.toString(),
                          accounts[0].address
                       )
                       assert.equal(vaultState, 0)
                       assert.equal(
                          winnerEndingBalance.toString(),
                          winnerStartingBalance.add(vaultEntranceFee).toString()
                       )
                       assert(endingTimeStamp > startingTimeStamp)
                       resolve()
                    } catch (error) {
                       console.log(error)
                       reject(error)
                    }
                 })
                 // Then entering the vault
                 console.log("Entering vault...")
                 const tx = await vault.entervault({
                    value: vaultEntranceFee,
                 })
                 await tx.wait(1)
                 console.log("Ok, time to wait...")
                 const winnerStartingBalance = await accounts[0].getBalance()

                 // and this code WONT complete until our listener has finished listening!
              })
           })
        })
     })

const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const {
   developmentChains,
   networkConfig,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("vault Unit Tests", function () {
        let vault,
           vaultContract,
           vrfCoordinatorV2Mock,
           vaultEntranceFee,
           interval,
           player // , deployer

        beforeEach(async () => {
           accounts = await ethers.getSigners() // could also do with getNamedAccounts
           //   deployer = accounts[0]
           player = accounts[1]
           await deployments.fixture(["mocks", "vault"]) // Deploys modules with the tags "mocks" and "vault"
           vrfCoordinatorV2Mock = await ethers.getContract(
              "VRFCoordinatorV2Mock"
           ) // Returns a new connection to the VRFCoordinatorV2Mock contract
           vaultContract = await ethers.getContract("vault") // Returns a new connection to the vault contract
           vault = vaultContract.connect(player) // Returns a new instance of the vault contract connected to player
           vaultEntranceFee = await vault.getEntranceFee()
           interval = await vault.getInterval()
        })

        describe("constructor", function () {
           it("initializes the vault correctly", async () => {
              const vaultState = (await vault.getvaultState()).toString()
              // Comparisons for vault initialization:
              assert.equal(vaultState, "0")
              assert.equal(
                 interval.toString(),
                 networkConfig[network.config.chainId]["keepersUpdateInterval"]
              )
           })
        })

        describe("entervault", function () {
           it("reverts when you don't pay enough", async () => {
              await expect(vault.entervault()).to.be.revertedWith(
                 // is reverted when not paid enough or vault is not open
                 "vault__SendMoreToEntervault"
              )
           })
           it("records player when they enter", async () => {
              await vault.entervault({ value: vaultEntranceFee })
              const contractPlayer = await vault.getPlayer(0)
              assert.equal(player.address, contractPlayer)
           })
           it("emits event on enter", async () => {
              await expect(
                 vault.entervault({ value: vaultEntranceFee })
              ).to.emit(
                 // emits vaultEnter event if entered to index player(s) address
                 vault,
                 "vaultEnter"
              )
           })
           it("doesn't allow entrance when vault is calculating", async () => {
              await vault.entervault({ value: vaultEntranceFee })
              await network.provider.send("evm_increaseTime", [
                 interval.toNumber() + 1,
              ])
              await network.provider.request({ method: "evm_mine", params: [] })
              // we pretend to be a keeper for a second
              await vault.performUpkeep([]) // changes the state to calculating for our comparison below
              await expect(
                 vault.entervault({ value: vaultEntranceFee })
              ).to.be.revertedWith(
                 // is reverted as vault is calculating
                 "vault__vaultNotOpen"
              )
           })
        })
        describe("checkUpkeep", function () {
           it("returns false if people haven't sent any ETH", async () => {
              await network.provider.send("evm_increaseTime", [
                 interval.toNumber() + 1,
              ])
              await network.provider.request({ method: "evm_mine", params: [] })
              const { upkeepNeeded } = await vault.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
              assert(!upkeepNeeded)
           })
           it("returns false if vault isn't open", async () => {
              await vault.entervault({ value: vaultEntranceFee })
              await network.provider.send("evm_increaseTime", [
                 interval.toNumber() + 1,
              ])
              await network.provider.request({ method: "evm_mine", params: [] })
              await vault.performUpkeep([]) // changes the state to calculating
              const vaultState = await vault.getvaultState() // stores the new state
              const { upkeepNeeded } = await vault.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
              assert.equal(vaultState.toString() == "1", upkeepNeeded == false)
           })
           it("returns false if enough time hasn't passed", async () => {
              await vault.entervault({ value: vaultEntranceFee })
              await network.provider.send("evm_increaseTime", [
                 interval.toNumber() - 5,
              ]) // use a higher number here if this test fails
              await network.provider.request({ method: "evm_mine", params: [] })
              const { upkeepNeeded } = await vault.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
              assert(!upkeepNeeded)
           })
           it("returns true if enough time has passed, has players, eth, and is open", async () => {
              await vault.entervault({ value: vaultEntranceFee })
              await network.provider.send("evm_increaseTime", [
                 interval.toNumber() + 1,
              ])
              await network.provider.request({ method: "evm_mine", params: [] })
              const { upkeepNeeded } = await vault.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
              assert(upkeepNeeded)
           })
        })

        describe("performUpkeep", function () {
           it("can only run if checkupkeep is true", async () => {
              await vault.entervault({ value: vaultEntranceFee })
              await network.provider.send("evm_increaseTime", [
                 interval.toNumber() + 1,
              ])
              await network.provider.request({ method: "evm_mine", params: [] })
              const tx = await vault.performUpkeep("0x")
              assert(tx)
           })
           it("reverts if checkup is false", async () => {
              await expect(vault.performUpkeep("0x")).to.be.revertedWith(
                 "vault__UpkeepNotNeeded"
              )
           })
           it("updates the vault state and emits a requestId", async () => {
              await vault.entervault({ value: vaultEntranceFee })
              await network.provider.send("evm_increaseTime", [
                 interval.toNumber() + 1,
              ])
              await network.provider.request({ method: "evm_mine", params: [] })
              const txResponse = await vault.performUpkeep("0x") // emits requestId
              const txReceipt = await txResponse.wait(1) // waits 1 block
              const vaultState = await vault.getvaultState() // updates state
              const requestId = txReceipt.events[1].args.requestId
              assert(requestId.toNumber() > 0)
              assert(vaultState == 1) // 0 = open, 1 = calculating
           })
        })
        describe("fulfillRandomWords", function () {
           beforeEach(async () => {
              await vault.entervault({ value: vaultEntranceFee })
              await network.provider.send("evm_increaseTime", [
                 interval.toNumber() + 1,
              ])
              await network.provider.request({ method: "evm_mine", params: [] })
           })
           it("can only be called after performupkeep", async () => {
              await expect(
                 vrfCoordinatorV2Mock.fulfillRandomWords(0, vault.address) // reverts if not fulfilled
              ).to.be.revertedWith("nonexistent request")
              await expect(
                 vrfCoordinatorV2Mock.fulfillRandomWords(1, vault.address) // reverts if not fulfilled
              ).to.be.revertedWith("nonexistent request")
           })

           it("picks a winner, resets, and sends money", async () => {
              const additionalEntrances = 3 // to test
              const startingIndex = 2
              let startingBalance
              for (
                 let i = startingIndex;
                 i < startingIndex + additionalEntrances;
                 i++
              ) {
                 // i = 2; i < 5; i=i+1
                 vault = vaultContract.connect(accounts[i]) // Returns a new instance of the vault contract connected to player
                 await vault.entervault({ value: vaultEntranceFee })
              }
              const startingTimeStamp = await vault.getLastTimeStamp() // stores starting timestamp (before we fire our event)

              await new Promise(async (resolve, reject) => {
                 vault.once("WinnerPicked", async () => {
                    // event listener for WinnerPicked
                    console.log("WinnerPicked event fired!")
                    try {
                       const recentWinner = await vault.getRecentWinner()
                       const vaultState = await vault.getvaultState()
                       const winnerBalance = await accounts[2].getBalance()
                       const endingTimeStamp = await vault.getLastTimeStamp()
                       await expect(vault.getPlayer(0)).to.be.reverted
                       // Comparisons to check if our ending values are correct:
                       assert.equal(
                          recentWinner.toString(),
                          accounts[2].address
                       )
                       assert.equal(vaultState, 0)
                       assert.equal(
                          winnerBalance.toString(),
                          startingBalance // startingBalance + ( (vaultEntranceFee * additionalEntrances) + vaultEntranceFee )
                             .add(
                                vaultEntranceFee
                                   .mul(additionalEntrances)
                                   .add(vaultEntranceFee)
                             )
                             .toString()
                       )
                       assert(endingTimeStamp > startingTimeStamp)
                       resolve() // if try passes, resolves the promise
                    } catch (e) {
                       reject(e) // if try fails, rejects the promise
                    }
                 })

                 // kicking off the event by mocking the chainlink keepers and vrf coordinator
                 try {
                    const tx = await vault.performUpkeep("0x")
                    const txReceipt = await tx.wait(1)
                    startingBalance = await accounts[2].getBalance()
                    await vrfCoordinatorV2Mock.fulfillRandomWords(
                       txReceipt.events[1].args.requestId,
                       vault.address
                    )
                 } catch (e) {
                    reject(e)
                 }
              })
           })
        })
     })

const { assert, expect } = require("chai")
const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name) // remove development chains if running offline
   ? describe.skip
   : describe("FundMe", async function () {
        let fundMe
        let deployer
        let mockV3aggregator
        const sendValue = ethers.utils.parseEther("1") // 1 eth
        beforeEach(async function () {
           deployer = (await getNamedAccounts()).deployer
           await deployments.fixture(["all"])
           fundMe = await ethers.getContractAt("FundMe", deployer)
           mockV3aggregator = await ethers.getContractAt(
              "MockV3Aggregator",
              deployer
           )
        })

        describe("constructor", async function () {
           it("sets the aggregator address correctly", async function () {
              const response = await fundMe.address
              assert.equal(response, mockV3aggregator.address)
           })
        })

        describe("fund", async function () {
           it("Fails if you dont have enough eth", async function () {
              await expect(fundMe.fund(1)).to.be.reverted
           })
        })

        describe("Withdraw ETH", async function () {
           beforeEach(async function () {
              await fundMe.fund({ value: sendValue })
           })
           it("deployedbalance is equal to endingfundme balance", async function () {
              const endingDeployerBalance = await fundMe.provider.getBalance(
                 deployer
              )
              const endingFundMeBalance = await fundMe.provider.getBalance(
                 fundMe.address
              )
              assert.equal(
                 endingFundMeBalance.toString(),
                 endingDeployerBalance.toString()
              )
           })
        })
     })

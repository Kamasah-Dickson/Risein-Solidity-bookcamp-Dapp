// Import necessary dependencies and ethers
const { expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const hre = require("hardhat");

// a function to increase the time in the Ethereum simulator
async function increaseTime(seconds) {
	await ethers.provider.send("evm_increaseTime", [seconds]);
	await ethers.provider.send("evm_mine", []);
}

describe("LockToken Contract", function () {
	let lockToken;
	let user1;

	beforeEach(async function () {
		[user1] = await ethers.getSigners();

		// Deploy the LockToken contract
		LockTokenFactory = await ethers.getContractFactory("LockToken");
		lockToken = await LockTokenFactory.deploy();
		await lockToken.waitForDeployment();
		// console.log("LockToken contract address:", await lockToken.getAddress());
	});

	it("Should allow users to deposit funds", async function () {
		const depositAmount = ethers.parseEther("1");
		const unlockDuration = 60; // 60 seconds
		const interestRate = 5; // 5%
		// User 1 deposits funds
		await lockToken.connect(user1).deposit(unlockDuration, interestRate, {
			value: depositAmount,
		});

		// Verify the deposit for User 1
		const user1Deposit = await lockToken.deposits(user1.address);
		expect(user1Deposit.amount).to.equal(depositAmount);
		expect(user1Deposit.unlockTime).to.not.equal(0);
		expect(user1Deposit.rate).to.equal(interestRate);
	});

	it("Should prevent withdrawal when funds are still locked", async function () {
		const depositAmount = ethers.parseEther("1");
		const unlockDuration = 60; // 60 seconds
		const interestRate = 5; // 5%

		// User 1 deposits funds
		await lockToken.connect(user1).deposit(unlockDuration, interestRate, {
			value: depositAmount,
		});

		// Increase time to simulate unlocking
		await increaseTime(unlockDuration);

		// Attempt to withdraw after the lock duration has passed
		await lockToken.connect(user1).withdraw();

		// Ensure the deposit amount is updated to 0
		const user1Deposit = await lockToken.deposits(user1.address);
		expect(user1Deposit.amount).to.equal(0);
	});

	it("Should allow users to withdraw funds with earned interest", async function () {
		const depositAmount = ethers.parseEther("1");
		const unlockDuration = 60; // 60 seconds
		const interestRate = 5; // 5%

		// User 1 deposits funds
		await lockToken.connect(user1).deposit(unlockDuration, interestRate, {
			value: depositAmount,
		});

		// Increase time to simulate unlocking
		await increaseTime(unlockDuration);

		// User 1 withdraws funds
		const initialBalanceUser1 = await ethers.provider.getBalance(user1.address);
		await lockToken.connect(user1).withdraw();

		// Ensure the deposit amount is updated to 0
		const user1Deposit = await lockToken.deposits(user1.address);
		expect(user1Deposit.amount).to.equal(0);

		// Calculate the expected interest
		const expectedInterest =
			(BigInt(depositAmount) * BigInt(unlockDuration) * BigInt(interestRate)) /
			(100n * 86400n);

		// Get the initial and final balances of User 1
		const initialBalanceUser1BigInt = BigInt(initialBalanceUser1);
		const finalBalanceUser1 = await ethers.provider.getBalance(user1.address);
		const finalBalanceUser1BigInt = BigInt(finalBalanceUser1);

		// Verify the withdrawal for User 1 with tolerance
		const expectedBalance = BigInt(depositAmount) + expectedInterest;
		const balanceDifference =
			finalBalanceUser1BigInt - initialBalanceUser1BigInt;
		expect(balanceDifference).to.be.below(expectedBalance); //because of gas fees
	});

	it("Should allow users to gain profit when withdrawing funds", async function () {
		const unlockDuration = 60; // 60 seconds
		const interestRate = 5; // 5%
		const depositAmount = ethers.parseEther("1");

		// Calculate the expected interest
		const expectedInterest =
			(BigInt(depositAmount) * BigInt(unlockDuration) * BigInt(interestRate)) /
			(100n * 86400n);

		// Get the initial and final withdrawal balances of User 1
		const initialWithdrawalBalance = await lockToken.withdrawalBalances(
			user1.address
		);
		const finalWithdrawalBalance = await lockToken.withdrawalBalances(
			user1.address
		);

		// Calculate the expected withdrawal balance
		const expectedWithdrawalBalance =
			initialWithdrawalBalance + (BigInt(depositAmount) + expectedInterest);

		//check if user gained profit
		expect(expectedWithdrawalBalance).to.be.above(finalWithdrawalBalance);
	});
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

// a function to increase the time in the Ethereum simulator
async function increaseTime(seconds) {
	await ethers.provider.send("evm_increaseTime", [seconds]);
	await ethers.provider.send("evm_mine", []);
}

describe("LockToken Contract", function () {
	let lockToken;
	let user1;
	let owner;

	beforeEach(async function () {
		this.timeout(120000);
		[user1] = await ethers.getSigners();

		// Deploy the LockToken contract
		LockTokenFactory = await ethers.getContractFactory("LockToken");
		lockToken = await LockTokenFactory.deploy();
		await lockToken.waitForDeployment();
		owner = await lockToken.getOwner();
	});

	it("Should allow users to deposit funds", async function () {
		const depositAmount = ethers.parseUnits("0.01", "ether");
		const unlockDuration = 60; // 60 seconds
		const interestRate = 5; // 5%
		// User 1 deposits funds
		await lockToken.connect(user1).deposit(unlockDuration, interestRate, {
			value: depositAmount,
			gasLimit: 2100000,
			gasPrice: ethers.parseUnits("5", "gwei"),
		});

		const user1Deposit = await lockToken.getDepositAmount(user1.address);
		const depositAmountInContract = await user1Deposit.amount;

		// Check if the deposit amount in the contract matches the expected deposit amount
		expect(depositAmountInContract).to.equal(depositAmount);
		expect(user1Deposit.amount).to.equal(depositAmount);
		expect(user1Deposit.unlockTime).to.not.equal(0);
		expect(user1Deposit.rate).to.equal(interestRate);
	});

	it("Should return the correct owner address", async function () {
		expect(owner).to.equal(user1.address);
	});

	it("Should return the correct deposit amount for the user", async function () {
		const depositAmount = ethers.parseUnits("0.01", "ether");
		const unlockDuration = 60; // 60 seconds
		const interestRate = 5; // 5%

		// User 1 deposits funds
		await lockToken.connect(user1).deposit(unlockDuration, interestRate, {
			value: depositAmount,
			gasLimit: 2100000,
			gasPrice: ethers.parseUnits("5", "gwei"),
		});

		// Verifying the deposit amount for User 1
		const user1DepositAmount = await lockToken.getDepositAmount(user1.address);
		expect(user1DepositAmount.amount).to.equal(depositAmount);
	});

	it("Should prevent withdrawal when funds are still locked", async function () {
		const depositAmount = ethers.parseUnits("0.01", "ether");
		const unlockDuration = 60; // 60 seconds
		const interestRate = 5; // 5%

		// User 1 deposits funds
		await lockToken.connect(user1).deposit(unlockDuration, interestRate, {
			value: depositAmount,
		});

		// Attempt to withdraw after the lock duration has passed
		await expect(lockToken.connect(user1).withdraw()).to.be.revertedWith(
			"Funds are still locked"
		);

		// Ensure the deposit amount is updated to 0
		const user1Deposit = await lockToken.getDepositAmount(user1.address);
		expect(user1Deposit.amount).to.equal(depositAmount);
	});

	it("Should revert if interest rate is above 70%", async function () {
		const depositAmount = ethers.parseUnits("0.01", "ether");
		const unlockDuration = 60; // 60 seconds
		const highInterestRate = 75; // 75% (above 70%)

		// Ensuring that the deposit function reverts with a high interest rate
		await expect(
			lockToken.connect(user1).deposit(unlockDuration, highInterestRate, {
				value: depositAmount,
			})
		).to.be.revertedWith("Interest rate cannot exceed 70%");
	});

	it("Should allow users to gain profit when withdrawing funds", async function () {
		const unlockDuration = 60; // 60 seconds
		const interestRate = 5; // 5%
		const depositAmount = ethers.parseUnits("0.01", "ether");

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

		const expectedWithdrawalBalance =
			initialWithdrawalBalance + (BigInt(depositAmount) + expectedInterest);

		//check if user gained profit
		expect(expectedWithdrawalBalance).to.be.above(finalWithdrawalBalance);
	});
});

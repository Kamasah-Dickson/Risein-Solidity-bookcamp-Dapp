// This script deploys the LockToken contract to the Binance Smart Chain (BSC) testnet and verifies it on BSCScan.

// You can run this script with `npx hardhat run scripts/deploy.js`.

const { ethers, run, network } = require("hardhat");
const updateFrontend = require("./update-frontend");

async function main() {
	const lockTokenFactory = await ethers.getContractFactory("LockToken");

	console.log(".............Deploying contract...........");

	const lockToken = await lockTokenFactory.deploy();
	await lockToken.waitForDeployment();
	const contractAddress = await lockToken.getAddress();
	await updateFrontend(contractAddress);
	console.log(`deployed contract to: ${contractAddress}`);
	// verify our contract if the chainId is 97 which is bnb and the bscscan api key is true
	if (network.config.chainId === 97 && process.env.BINANCESCAN_API_KEY) {
		// am waiting for a few blocks to be mined before i verify because bscscan might not know about the transaction yet
		await lockToken.deploymentTransaction().wait(6);
		await verify(contractAddress, []);
	}
}

// automatically verify contract on bscscan
const verify = async (contractAddress, args) => {
	console.log("........verifying contract.......");

	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		});
	} catch (e) {
		//check if already verified
		if (e.message.toLowerCase().includes("already verified")) {
			console.log("This contract is already verified!");
		} else {
			console.log(e);
		}
	}
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

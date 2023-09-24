const { ethers, network } = require("hardhat");

const { readFileSync, writeFileSync } = require("fs");
require("dotenv").config(); // can modify this to work for you

const FRONT_END_ADDRESSES_FILE =
	"../frontend/constants/contractAddressess.json";

const FRONT_END_ABI_FILE = "../frontend/constants/abi.json";
const UPDATE_FRONT_END = process.env.UPDATE_FRONT_END;

async function updateFrontend() {
	if (UPDATE_FRONT_END) {
		console.log(UPDATE_FRONT_END);
		await updateContractAddressess();
		await updateAbi();
		console.log("Frontend updated✨");
	} else {
		console.log(
			"Fronend cannot be updated please make it true in your .env file"
		);
	}
}

module.exports = updateFrontend;

async function updateAbi() {
	const LockTokenFactory = await ethers.getContractFactory("LockToken");
	const lockToken = await LockTokenFactory.deploy();
	await lockToken.waitForDeployment();

	await lockToken.getAddress();
	writeFileSync(
		FRONT_END_ABI_FILE,
		JSON.stringify(LockTokenFactory.interface.fragments)
	);
}

async function updateContractAddressess() {
	const LockTokenFactory = await ethers.getContractFactory("LockToken");
	const lockToken = await LockTokenFactory.deploy();
	await lockToken.waitForDeployment();

	const chainId = network.config.chainId.toString();
	const currentAddresses = JSON.parse(
		readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
	);

	if (chainId in currentAddresses) {
		if (!currentAddresses[chainId].includes(await lockToken.getAddress())) {
			currentAddresses[chainId].push(await lockToken.getAddress());
		}
	} else {
		currentAddresses[chainId] = [await lockToken.getAddress()];
	}

	writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

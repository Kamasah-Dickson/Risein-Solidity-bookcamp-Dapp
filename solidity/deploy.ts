const { ethers } = require("ethers")
const fs = require("fs")
require("dotenv").config()

const main = async () => {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8",
    )
    //contract factory
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    console.log(contract)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error), process.exit(1)
    })

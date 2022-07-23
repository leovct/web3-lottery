import { ethers, network } from "hardhat"
import { Avocado__factory } from "../typechain-types"

const hre = require("hardhat")

async function main() {
  const [owner] = await ethers.getSigners()
  const ContractFactory: Avocado__factory = await ethers.getContractFactory("Avocado")
  const contract = await ContractFactory.deploy(owner.address)
  await contract.deployed()
  console.log(
    `Avocado contract deployed to the ${network.name} blockchain: ${contract.address}`
  )

  // Verify the contract on https://kovan-optimistic.etherscan.io/.
  if (network.config.chainId !== 31337) {
    console.log(
      "Waiting for 5 block confirmations before verifying the contract"
    )
    await contract.deployTransaction.wait(6)

    await hre.run("verify:verify", {
      address: contract.address,
    })
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

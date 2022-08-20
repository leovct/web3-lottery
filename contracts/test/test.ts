import { expect } from "chai"
import { ethers } from "hardhat"
import { LinkToken, LinkToken__factory, Lottery, Lottery__factory, VRFCoordinatorV2Mock, VRFCoordinatorV2Mock__factory } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("Lottery", function () {
  let owner: SignerWithAddress, keeper: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress
  let linkToken: LinkToken, vrfCoordinator: VRFCoordinatorV2Mock, lotteryContract: Lottery

  beforeEach(async function () {
    // Get signers.
    [owner, keeper, user1, user2] = await ethers.getSigners()

    // Deploy the mocks
    // 1. Deploy the LinkToken mock contract
    const LinkTokenFactory: LinkToken__factory = await ethers.getContractFactory("LinkToken")
    linkToken = await LinkTokenFactory.deploy()
    await linkToken.deployed()
    
    // 2. Deploy the VRFCoordinatorV2 mock contract
    // Source: https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol
    const vrfCoordinatorFactory: VRFCoordinatorV2Mock__factory = await ethers.getContractFactory("VRFCoordinatorV2Mock")
    vrfCoordinator = await vrfCoordinatorFactory.deploy(1, 1) // These parameters might not be the best one!
    await vrfCoordinator.deployed()

    // Deploy the contract.
    const LotteryContractFactory: Lottery__factory = await ethers.getContractFactory("Lottery")
    lotteryContract = await LotteryContractFactory.deploy(keeper.address, linkToken.address, vrfCoordinator.address)
    await lotteryContract.deployed()

    // Fund the subscription.
    const subscriptionId = lotteryContract.subscriptionId()
    await vrfCoordinator.fundSubscription(subscriptionId, 1_000_000) // Same thing for the subscription amount

    // Fund the contract with LINK token (is it required?)
    //await linkToken.transfer(lotteryContract.address, ethers.utils.parseEther("20"))
  })

  /******************************************************************
	| Core methods
	/******************************************************************/

  describe("Enter", async function () {
    it("Should buy tickets", async function () {
      // User buys 50 tickets
      await expect(lotteryContract.connect(user1).enter(50, { value: ethers.utils.parseEther("0.5") }))
        .to.emit(lotteryContract, "NewEntry")
        .withArgs(1, user1.address, 50)
      
      // Check that the contract's state has been updated properly
      let round = await lotteryContract.rounds(1)
      expect(round.ticketsSold).to.equal(50)

      let entries = await lotteryContract.getEntries(1)
      expect(entries).to.equal(1)

      let entry = await lotteryContract.getEntry(1, 0)
      expect(entry[0]).to.equal(user1.address)
      expect(entry[1].toNumber()).to.equal(50)

      let balance = await ethers.provider.getBalance(lotteryContract.address)
      expect(balance).to.equal(ethers.utils.parseEther("0.5"))

      // Another user buys 25 tickets
      await expect(lotteryContract.connect(user2).enter(25, { value: ethers.utils.parseEther("0.25") }))
        .to.emit(lotteryContract, "NewEntry")
        .withArgs(1, user2.address, 25)
      
      // Check that the contract's state has been updated properly
      round = await lotteryContract.rounds(1)
      expect(round.ticketsSold).to.equal(75)

      entries = await lotteryContract.getEntries(1)
      expect(entries).to.equal(2)

      entry = await lotteryContract.getEntry(1, 1)
      expect(entry[0]).to.equal(user2.address)
      expect(entry[1].toNumber()).to.equal(25)

      balance = await ethers.provider.getBalance(lotteryContract.address)
      expect(balance).to.equal(ethers.utils.parseEther("0.75"))
    })

    it("Should fail to buy tickets when not sending enough money", async function () {
      // User tries to buy 100 tickets without sending enough money
      await expect(lotteryContract.connect(user1).enter(100, { value: ethers.utils.parseEther("0.1") }))
        .to.be.revertedWithCustomError(lotteryContract, "NotEnoughMoney")
    })

    it("Should fail to buy more tickets than what's available", async function () {
      // User tries to buy 200 tickets even though there are only 100 tickets available
      await expect(lotteryContract.connect(user1).enter(200, { value: ethers.utils.parseEther("2") }))
        .to.be.revertedWithCustomError(lotteryContract, "NotEnoughTicketsLeft")
    })

    it ("Should fail to buy tickets when the round has ended", async function () {
      // Fast forward 5 minutes
      const block = await ethers.provider.getBlock("latest")
      await ethers.provider.send("evm_mine", [block.timestamp + 60*15])

      // Check that the round ended
      const newBlock = await ethers.provider.getBlock("latest")
      expect(newBlock.number).to.equal(block.number + 1)
      expect(newBlock.timestamp).to.equal(block.timestamp + 60*15)

      // User tries to buy 50 tickets after the round ended
      await expect(lotteryContract.connect(user1).enter(50, { value: ethers.utils.parseEther("0.5") }))
        .to.be.revertedWithCustomError(lotteryContract, "RoundHasEnded")
    })
  })

  describe("Draw", async function () {
    it("Should draw a winner, start a new round and send the money", async function () {
      // User buys 50 tickets
      await expect(lotteryContract.connect(user1).enter(50, { value: ethers.utils.parseEther("0.5") }))
        .to.emit(lotteryContract, "NewEntry")
        .withArgs(1, user1.address, 50)
      
      // Another user buys 25 tickets
      await expect(lotteryContract.connect(user2).enter(25, { value: ethers.utils.parseEther("0.25") }))
      .to.emit(lotteryContract, "NewEntry")
      .withArgs(1, user2.address, 25)

      // Fast forward 5 minutes
      const block = await ethers.provider.getBlock("latest")
      await ethers.provider.send("evm_mine", [block.timestamp + 60*15])

      // Check that the round ended
      const newBlock = await ethers.provider.getBlock("latest")
      expect(newBlock.number).to.equal(block.number + 1)
      expect(newBlock.timestamp).to.equal(block.timestamp + 60*15)
      
      // Check the account balances
      // Note that the start balance is set to 10 000 ethers in hardhat
      const ownerBalanceBeforeDraw = await ethers.provider.getBalance(owner.address)
      expect(ownerBalanceBeforeDraw).to.be.below(ethers.utils.parseEther("10000"))

      const contractBalanceBeforeDraw = await ethers.provider.getBalance(lotteryContract.address)
      expect(contractBalanceBeforeDraw).to.equal(ethers.utils.parseEther("0.75"))

      const user1BalanceBeforeDraw = await ethers.provider.getBalance(user1.address)
      expect(user1BalanceBeforeDraw).to.be.below(ethers.utils.parseEther("9999.5"))

      const user2BalanceBeforeDraw = await ethers.provider.getBalance(user2.address)
      expect(user2BalanceBeforeDraw).to.be.below(ethers.utils.parseEther("9999.75"))

      // Draw a winner: here we only request a random number to the Chainlink VRF network
      await expect(lotteryContract.connect(keeper).draw())
        .to.emit(lotteryContract, "RandomNumberRequested")
        .withArgs(1)
      
      // Get the request id
      const requestId = await lotteryContract.requestId()
      expect(requestId).to.not.be.null
      
      // Fullfill the request (the winning ticket is the 10th ticket)
      await expect(vrfCoordinator.fulfillRandomWordsWithOverride(requestId, lotteryContract.address, [51]))
      console.log("request fullfilled!")
      
      // Check that the contract's state has been updated properly
      const round = await lotteryContract.rounds(1)
      expect(round.winnerAddress).to.equal(user1.address)
      expect(round.moneySentToTeam).to.be.true
      expect(round.moneySentToWinner).to.be.true

      const roundNumber = await lotteryContract.currentRound()
      expect(roundNumber).to.equal(2)

      const round1EndDate = round.endDate
      const round2 = await lotteryContract.rounds(2)
      const round2EndDate = round2.endDate
      expect(round2EndDate).to.be.above(round1EndDate.add(60*5)) // there is a slight delay of a few seconds
      
      // Check again the account balances
      // The jackpot value is equal to 0.75 ether
      // The team takes 7%, which is around 0.0525 ethers
      // The contract takes 3%, which represents 0.0225 ethers
      // The winner keeps the rest (90%), which gives 0.675 ethers
      const ownerBalanceAfterDraw = await ethers.provider.getBalance(owner.address)
      expect(ownerBalanceAfterDraw).to.be.above(ownerBalanceBeforeDraw.add(ethers.utils.parseEther("0.05")))

      const contractBalanceAfterDraw = await ethers.provider.getBalance(lotteryContract.address)
      expect(contractBalanceAfterDraw).to.equal(ethers.utils.parseEther("0.0225"))

      const user1BalanceAfterDraw = await ethers.provider.getBalance(user1.address)
      expect(user1BalanceAfterDraw).to.equal(user1BalanceBeforeDraw.add(ethers.utils.parseEther("0.675")))

      const user2BalanceAfterDraw = await ethers.provider.getBalance(user2.address)
      expect(user2BalanceAfterDraw).to.equal(user2BalanceBeforeDraw)
    })

    it("Should fail to draw a winner when using another account than the owner or the keeper", async function () {
      await expect(lotteryContract.connect(user1).draw())
        .to.be.revertedWithCustomError(lotteryContract, "Unauthorized")
    })

    it("Should fail to draw a winner when the round has not ended", async function () {
      await expect(lotteryContract.draw())
        .to.be.revertedWithCustomError(lotteryContract, "RoundHasNotEnded")
    })
	})

  describe("FullfillRandomWords", async function () {
    it("Should draw a winner, start a new round and send the money", async function () {
      
    })
  })

  /******************************************************************
	| Setters
	/******************************************************************/
  
	describe("SetKeeper", async function () {
    it("Should update the keeper's address", async function () {
      // Check the value of the keeper's address before the update
      let keeperAddress = await lotteryContract.keeperAddress()
      expect(keeperAddress).to.equal(keeper.address)

      const tx = await lotteryContract.connect(owner).setKeeper(user1.address)
      await tx.wait()

      // Check that the keeper's address has been updated
      keeperAddress = await lotteryContract.keeperAddress()
      expect(keeperAddress).to.equal(user1.address)
    })

    it("Should fail to update the keeper's address using another account than the owner", async function () {
      await expect(lotteryContract.connect(user1).setKeeper(owner.address))
        .to.be.revertedWithCustomError(lotteryContract, "Unauthorized")
    })
  })
})

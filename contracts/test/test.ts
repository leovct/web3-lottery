import { expect } from "chai"
import { ethers } from "hardhat"
import { Avocado, Avocado__factory } from "../typechain-types"

describe("Avocado", function () {
  let owner: any, keeper: any, user: any
  let contract: Avocado

  beforeEach(async function () {
    // Get signers.
    [owner, keeper, user] = await ethers.getSigners()

    // Deploy the contract.
    const ContractFactory: Avocado__factory = await ethers.getContractFactory("Avocado")
    contract = await ContractFactory.deploy(keeper.address)
    await contract.deployed()
  })

  /******************************************************************
	| Core methods
	/******************************************************************/

  describe("Bet", async function () {
    const guess = ethers.utils.id("3")

    it("Should place a bet", async function () {
      // Check that the contract is in its initial state
      let registeredGuess = await contract.getPlayerGuess(owner.address, 1)
      expect(registeredGuess).to.equal(ethers.constants.HashZero)

      let numberOfPlayers = await contract.getNumberOfPlayers()
      expect(numberOfPlayers).to.equal(0)

      let balance = await ethers.provider.getBalance(contract.address)
      expect(balance).to.equal(0)

      // Place a bet
      await expect(contract.bet(guess, { value: ethers.utils.parseEther("0.0001") }))
        .to.emit(contract, "BetPlaced")
        .withArgs(1, owner.address, guess)
      
      // Check that the contract"s state has been updated with the correct values
      registeredGuess = await contract.getPlayerGuess(owner.address, 1)
      expect(registeredGuess).to.equal(guess)

      numberOfPlayers = await contract.getNumberOfPlayers()
      expect(numberOfPlayers).to.equal(1)

      balance = await ethers.provider.getBalance(contract.address)
      expect(balance).to.equal(ethers.utils.parseEther("0.0001"))
    })

    it("Should fail when betting with less than the minimal amount", async function () {
      await expect(contract.bet(guess))
        .to.be.revertedWithCustomError(contract, "NotEnoughMoneyBet")
    })

    it("Should fail when trying to place 2 (or more) bets in the same round", async function () {
      await expect(contract.bet(guess, { value: ethers.utils.parseEther("0.0001") }))
        .to.emit(contract, "BetPlaced")
        .withArgs(1, owner.address, guess)
      
      let guess2 = ethers.utils.id("11")
      await expect(contract.bet(guess2, { value: ethers.utils.parseEther("0.0001") }))
        .to.be.revertedWithCustomError(contract, "PlayerAlreadyBetInThisRound")
    })
	})

  describe("Draw", async function () {
    it("Should fail to draw a winner when using another account than the keeper", async function () {
      await expect(contract.draw())
        .to.be.revertedWithCustomError(contract, "Unauthorized")
        .withArgs(owner.address, keeper.address)
    })

    it("Should fail to draw a winner when the round has not ended", async function () {
      await expect(contract.connect(keeper).draw())
        .to.be.revertedWithCustomError(contract, "RoundIsNotOverYet")
    })

    it("Should draw a winner and send the money to the winner and the team", async function () {
      // Place a bet
      const guess = ethers.utils.id("3")
      await expect(contract.connect(user).bet(guess, { value: ethers.utils.parseEther("0.0001") }))
        .to.emit(contract, "BetPlaced")
        .withArgs(1, user.address, guess)

      // Fast forward 5 minutes
      await ethers.provider.send("evm_increaseTime", [60 * 5])
      await ethers.provider.send("evm_mine", [])

      // Check the account balances
      const contractBalanceBeforeTheDraw = await ethers.provider.getBalance(contract.address)
      expect(contractBalanceBeforeTheDraw).to.equal(ethers.utils.parseEther("0.0001"))

      const startBalance = ethers.utils.parseEther("10000")
      const userBalanceBeforeTheDraw = await ethers.provider.getBalance(user.address)
      expect(userBalanceBeforeTheDraw).to.be.below(startBalance)

      const ownerBalanceBeforeTheDraw = await ethers.provider.getBalance(owner.address)
      expect(ownerBalanceBeforeTheDraw).to.be.below(startBalance)

      // Draw a winner
      await expect(contract.connect(keeper).draw())
        .to.emit(contract, "RoundEnded")
        .withArgs(1, user.address, ethers.utils.parseEther("0.0001"))
        .to.emit(contract, "RoundStarted")
        .withArgs(2)
      
      // Check again the account balances
      const contractBalanceAfterTheDraw = await ethers.provider.getBalance(contract.address)
      expect(contractBalanceAfterTheDraw).to.be.below(contractBalanceBeforeTheDraw)

      const userBalanceAfterTheDraw = await ethers.provider.getBalance(user.address)
      expect(userBalanceAfterTheDraw).to.be.above(userBalanceBeforeTheDraw)

      const ownerBalanceAfterTheDraw = await ethers.provider.getBalance(owner.address)
      expect(ownerBalanceAfterTheDraw).to.be.above(ownerBalanceBeforeTheDraw)

      // Check that the user is actually the winner
      const result = await contract.getWinner(1)
      expect(result[0]).to.equal(user.address)
      expect(result[1]).to.equal(ethers.utils.parseEther("0.0001"))

      // Check that a new round has started
      const roundId = await contract.currentRoundId()
      expect(roundId).to.equal(2)
    })
	})

  /******************************************************************
	| Setters
	/******************************************************************/
  
	describe("SetKeeper", async function () {
    it("Should update the keeper's address", async function () {
      // Check the value of the keeper's address before the update
      let keeperAddress = await contract.keeper()
      expect(keeperAddress).to.equal(keeper.address)

      const tx = await contract.setKeeper(user.address)
      await tx.wait()

      // Check that the keeper's address has been updated
      keeperAddress = await contract.keeper()
      expect(keeperAddress).to.equal(user.address)
    })

    it("Should fail when trying to update the keeper's address using another account than the owner", async function () {
      await expect(contract.connect(user).setKeeper(owner.address))
        .to.be.revertedWithCustomError(contract, "Unauthorized")
        .withArgs(user.address, owner.address)
    })
  })
})

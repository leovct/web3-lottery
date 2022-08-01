// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title A basic lottery contract
 * @author leovct
 * @notice Interact with this contract at your own risk. You can win but also lose a lot of money!
 */
contract Lottery {

	/******************************************************************
	| Constants
	/******************************************************************/
	uint256 constant TICKET_PRICE = 0.01 ether;
	uint256 constant TICKET_NUMBER = 100;
	uint256 constant ROUND_LENGTH = 15 minutes;
	
	// Fees are a percentage of the amount earned by the winner 	
	uint256 constant TEAM_FEE = 7;
	uint256 constant CONTRACT_FEE = 3;

	/******************************************************************
	| Structures
	/******************************************************************/
	struct Entry {
		address playerAddress;
		uint256 tickets;
	}

	struct Round {
		Entry[] entries;
		uint256 ticketsSold;
		uint256 endDate;
		address winnerAddress;
		bool moneySentToTeam;
		bool moneySentToWinner;
	}

	/******************************************************************
	| Variables
	/******************************************************************/
	address public ownerAddress;
	address public keeperAddress;
	uint256 public deployDate;
	uint256 public currentRound = 1;
	mapping(uint256 => Round) public rounds;

	/******************************************************************
	| Custom errors
	/******************************************************************/
	error NotEnoughMoney();
	error NotEnoughTicketsLeft();
	error RoundHasEnded();
	error RoundHasNotEnded();
	error FailedToSendEther();
	error Unauthorized();

	/******************************************************************
	| Events
	/******************************************************************/
	event RoundStarted(uint256 round);
	event NewEntry(uint256 indexed round, address playerAddress, uint256 indexed tickets);
	event RoundEnded(uint256 indexed round, address indexed winner, uint256 indexed jackpot);
	event KeeperAddressUpdated(address newAddress);

	/******************************************************************
	| Core methods
	/******************************************************************/

	/**
	 * @dev Constructor
	 * @param _keeperAddress the address of the Chainlink keeper that will draw a winner at the end of each round
	 */
	constructor(address _keeperAddress) {
		ownerAddress = msg.sender;
		keeperAddress = _keeperAddress;
		deployDate = block.timestamp;

		// Start the first round
		emit RoundStarted(currentRound);
		Round storage round = rounds[currentRound];
		round.endDate = block.timestamp + ROUND_LENGTH;
	}

	/**
	 * @notice Buy lottery tickets
	 * @param _n the number of tickets bought
	 */
	function enter(uint256 _n) external payable {
		if (msg.value < _n * TICKET_PRICE) revert NotEnoughMoney();
		Round storage round = rounds[currentRound];
		if (round.ticketsSold + _n > TICKET_NUMBER) revert NotEnoughTicketsLeft();
		if (block.timestamp > round.endDate) revert RoundHasEnded();

		// Store the new entry
		round.entries.push(Entry(msg.sender, _n));
		round.ticketsSold += _n;
		emit NewEntry(currentRound, msg.sender, _n);
	}

	/**
	 * @notice Draw a winner
	 */
	function draw() external {
		if (msg.sender != keeperAddress) revert Unauthorized();
		Round storage round = rounds[currentRound];
		if (block.timestamp < round.endDate) revert RoundHasNotEnded();

		// Draw a random number between 1 and ticketsSold
		// TODO: Use Chainlink Oracle
		uint256 winningTicket = 1;

		// Find the winner
		uint256 ticketCounter = round.entries[0].tickets;
		uint256 entryCounter;
		while (winningTicket > ticketCounter) {
			entryCounter++;
			ticketCounter += round.entries[entryCounter].tickets;
		}
		address winnerAddress = round.entries[entryCounter].playerAddress;
		round.winnerAddress = winnerAddress;

		// End the round and start a new one
		uint256 ticketsSold = round.ticketsSold;
		emit RoundEnded(currentRound, winnerAddress, ticketsSold);
		currentRound++;
		emit RoundStarted(currentRound);
		rounds[currentRound].endDate = block.timestamp + ROUND_LENGTH;

		// Send the fees to the team
		uint256 totalValue = round.ticketsSold * TICKET_PRICE;
		if (!round.moneySentToTeam) {
			round.moneySentToTeam = true;

			(bool sent,) = address(ownerAddress).call{value: totalValue * TEAM_FEE / 100}("");
			if (!sent) revert FailedToSendEther();
		}

		// Send the rest of the money to the winner
		if (!round.moneySentToWinner) {
			round.moneySentToWinner = true;

			(bool sent,) = address(winnerAddress).call{value: totalValue * (100 - TEAM_FEE - CONTRACT_FEE) / 100}("");
			if (!sent) revert FailedToSendEther();
		}
	}

	/******************************************************************
	| Getters
	/******************************************************************/

	/**
	 * @notice Get the number of entries
	 * @param _round the round number
	 * @return uint256 the number of entries
	 */
	function getEntries(uint256 _round) view external returns (uint256) {
		return rounds[_round].entries.length;
	}

	/**
	 * @notice Get a specific entry of a specific round
	 * @param _round the round number
	 * @param _id the id of the entry in the array
	 * @return address the address of the player
	 * @return uint256 the number of tickets bought by the player
	 */
	function getEntry(uint256 _round, uint256 _id) view external returns(address, uint256) {
		Entry memory entry = rounds[_round].entries[_id];
		return (entry.playerAddress, entry.tickets);
	}

	/******************************************************************
	| Setters
	/******************************************************************/
	
	/**
	 * @notice Update the keeper's address
	 * @param _keeper the new address of the keeper
	 */
	function setKeeper(address _keeper) external {
		if (msg.sender != ownerAddress) revert Unauthorized();

		keeperAddress = _keeper;
		emit KeeperAddressUpdated(_keeper);
	}
}

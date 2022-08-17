// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

/**
 * @title A basic lottery contract
 * @author leovct
 * @notice Interact with this contract at your own risk. You can win but also lose a lot of money!
 */
contract Lottery is VRFConsumerBaseV2 {

	/******************************************************************
	| Constants
	/******************************************************************/
	uint256 public constant TICKET_PRICE = 0.01 ether;
	uint256 public constant TICKET_NUMBER = 100;
	uint256 public constant ROUND_LENGTH = 15 minutes;
	
	// Fees are a percentage of the amount earned by the winner 	
	uint256 public constant TEAM_FEES = 7;
	uint256 public constant CONTRACT_FEES = 3;

	/******************************************************************
	| Chainlink VRFf parameters
	/******************************************************************/
	VRFCoordinatorV2Interface COORDINATOR;
  LinkTokenInterface LINKTOKEN;
	address public vrfCoordinatorAddress;
	uint64 subscriptionId;
	uint256 requestId;
	uint256 randomWord;

	// Source: https://docs.chain.link/docs/vrf-contracts/#polygon-matic-mumbai-testnet
	//address public vrfCoordinatorAddress = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
	//address public linkTokenContractAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
	bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
	uint32 callbackGasLimit = 100000;
  uint16 requestConfirmations = 3;

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
		bool randomNumberRequested;
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
	error RandomNumberAlreadyRequested();
	error RandomNumberNotRequestedYet();
	error RoundHasEnded();
	error RoundHasNotEnded();
	error FailedToSendEther();
	error Unauthorized();

	/******************************************************************
	| Events
	/******************************************************************/
	event RoundStarted(uint256 round);
	event NewEntry(uint256 indexed round, address playerAddress, uint256 indexed tickets);
	event RandomNumberRequested(uint256 indexed round);
	event RoundEnded(uint256 indexed round, address indexed winner, uint256 indexed jackpot);
	event KeeperAddressUpdated(address newAddress);

	/******************************************************************
	| Core methods
	/******************************************************************/

	/**
	 * @dev Constructor
	 * @param _keeperAddress the address of the Chainlink keeper that will draw a winner at the end of each round
	 * @param _linkTokenAddress the address of the link token contract
	 * @param _vrfCoordinatorAddress the address of the Chainlink VRF v2 coordinator
	 */
	constructor(
		address _keeperAddress,
		address _linkTokenAddress,
		address _vrfCoordinatorAddress
	) VRFConsumerBaseV2(_vrfCoordinatorAddress) {
		// Contract parameters
		ownerAddress = msg.sender;
		keeperAddress = _keeperAddress;
		deployDate = block.timestamp;

		// Chainlink parameters
		LINKTOKEN = LinkTokenInterface(_linkTokenAddress);
		vrfCoordinatorAddress = _vrfCoordinatorAddress;
		COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinatorAddress);
		// Create the new Chailink subscription and add this contract as a consumer
		subscriptionId = COORDINATOR.createSubscription();
    COORDINATOR.addConsumer(subscriptionId, address(this));

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
	 * @notice Draw a winner 1/2
	 * @dev Method called to request a list of random numbers from the Chainlink VRF network
	 */
	function draw() external {
		if (msg.sender != ownerAddress && msg.sender != keeperAddress) revert Unauthorized();
		Round storage round = rounds[currentRound];
		if (block.timestamp < round.endDate) revert RoundHasNotEnded();
		if (round.randomNumberRequested) revert RandomNumberAlreadyRequested();

		// Request a random number to the Chainlink VRF network
		// Will revert if subscription is not set and funded
		requestId = COORDINATOR.requestRandomWords(
      keyHash,
      subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      1
    );

		round.randomNumberRequested = true;
		emit RandomNumberRequested(currentRound);
	}

	/**
	 * @notice Draw a winner 2/2
	 * @dev Method called by the Chainlink VRF network once the list of random words are generated
	 * @param _randomWords the list of random words
	 */
	function fulfillRandomWords(
    uint256, /* requestId */
    uint256[] memory _randomWords
  ) internal override {
		if (msg.sender != vrfCoordinatorAddress) revert Unauthorized();
		Round storage round = rounds[currentRound];
		if (block.timestamp < round.endDate) revert RoundHasNotEnded();
		if (!round.randomNumberRequested) revert RandomNumberNotRequestedYet();

		// Get the winning ticket
    uint256 winningTicket = (_randomWords[0] % round.ticketsSold) + 1;

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

			(bool sent,) = address(ownerAddress).call{value: totalValue * TEAM_FEES / 100}("");
			if (!sent) revert FailedToSendEther();
		}

		// Send the rest of the money to the winner
		if (!round.moneySentToWinner) {
			round.moneySentToWinner = true;

			(bool sent,) = address(winnerAddress).call{value: totalValue * (100 - TEAM_FEES - CONTRACT_FEES) / 100}("");
			if (!sent) revert FailedToSendEther();
		}
  }

	/******************************************************************
	| Chainlink VRF
	/******************************************************************/

	/**
	 * @notice Cancel the subscription and send the remaining LINK to the owner of the contract
	 */
	function cancelSubscription() external {
    COORDINATOR.cancelSubscription(subscriptionId, ownerAddress);
  }

	// Transfer this contract's funds to an address.
  // 1000000000000000000 = 1 LINK

	/**
	 * @notice Transfer this contract's LINK funds to the owner address
	 */
  function withdraw() external {
		uint256 balance = LINKTOKEN.balanceOf(address(this));
    LINKTOKEN.transfer(ownerAddress, balance);
  }

	/**
	 * @notice Refill our contract with LINK tokens.
	 */
	function fund(uint256 _amount) public {
			LINKTOKEN.transferAndCall(
					address(COORDINATOR),
					_amount,
					abi.encode(subscriptionId)
			);
	}

	/**
	 * @notice Transfer this contract's LINK funds to an address
	 * @param _receiverAddress the address of the receiver
	 * @param _amount the amount of LINK sent to the receiver
	 */
  function withdraw(address _receiverAddress, uint256 _amount) external {
    LINKTOKEN.transfer(_receiverAddress, _amount);
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

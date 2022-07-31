import { ethers } from "ethers"
import React from "react"
import { FC } from "react"
import styled from "styled-components"
import { useContractRead, useBalance, useAccount } from "wagmi"
import { BLOCK_EXPLORER_URL, LOTTERY_ADDRESS, LOTTERY_CONFIG, LOTTERY_EXPLORER_URL } from "../../constants/address"
import { MAX_TICKETS, TICKET_PRICE } from "../../constants/game"

function display(x: (number | string | boolean | undefined)): (number | string | boolean) {
	return typeof x === "undefined" ? "???" : x
}

function displayDate(d: Date | undefined): string {
	return typeof d === "undefined" ? "???" : d.toUTCString()
}

function formatTime(time: number): string {
	const hours = Math.floor(time / (60 * 60))
	const minutes = Math.floor(time / 60 - hours * 60)
	const seconds = Math.floor(time - minutes * 60 - hours * 60*60)
	return `${hours}h ${minutes}min ${seconds}s`
}

const Dashboard: FC = () => {
	const { address } = useAccount()

	const [time, setTime] = React.useState<Date>(new Date())

	// Current round data
	const [currentRound, setCurrentRound] = React.useState<number>()
	const [currentTicketsSold, setCurrentTicketsSold] = React.useState<number>()
	const [currentNumberOfEntries, setCurrentNumberOfEntries] = React.useState<number>()
	const [currentCountdown, setCurrentCountdown] = React.useState<number>(0)
	const [currentEndDate, setCurrentEndDate] = React.useState<Date>()
	const [currentWinner, setCurrentWinner] = React.useState<string>()
	const [currentMoneySentToWinner, setCurrentMoneySentToWinner] = React.useState<boolean>()
	const [currentMoneySentToOwner, setCurrentMoneySentToOwner] = React.useState<boolean>()

	// Previous round data
	const [previousRound, setPreviousRound] = React.useState<number>()
	const [previousTicketsSold, setPreviousTicketsSold] = React.useState<number>()
	const [previousNumberOfEntries, setPreviousNumberOfEntries] = React.useState<number>()
	const [previousEndDate, setPreviousEndDate] = React.useState<Date>()
	const [previousWinner, setPreviousWinner] = React.useState<string>()
	const [previousMoneySentToWinner, setPreviousMoneySentToWinner] = React.useState<boolean>()
	const [previousMoneySentToOwner, setPreviousMoneySentToOwner] = React.useState<boolean>()

	// Balance data
	const [contractBalance, setContractBalance] = React.useState<string>()
	const [ownerBalance, setOwnerBalance] = React.useState<string>()

	// Contract parameters
	const [ownerAddress, setOwnerAddress] = React.useState<string>()
	const [keeperAddress, setKeeperAddress] = React.useState<string>()
	const [deployDate, setDeployDate] = React.useState<Date>()

	const { data: round } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "currentRound",
		args: [],
		watch: true,
  })

	const { data: currentRoundData } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "rounds",
		args: [round],
		watch: true,
  })

	const { data: previousRoundData } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "rounds",
		args: [previousRound],
		watch: true,
  })

	const { data: currentEntriesData } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "getEntries",
		args: [currentRound],
		watch: true,
  })

	const { data: previousEntriesData } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "getEntries",
		args: [previousRound],
		watch: true,
  })

	const { data: ownerAddressData } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "ownerAddress",
		args: [],
		watch: true,
  })

	const { data: keeperAddressData } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "keeperAddress",
		args: [],
		watch: true,
  })

	const { data: deployDateData } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "deployDate",
		args: [],
		watch: true,
  })

	const { data: contractBalanceData } = useBalance({
    addressOrName: LOTTERY_ADDRESS,
  })

	const { data: ownerBalanceData } = useBalance({
    addressOrName: address,
  })

	React.useEffect(() => {
		if (round) {
			const _currentRound = round.toNumber()
			setCurrentRound(_currentRound)
			if (_currentRound > 1) {
				setPreviousRound(_currentRound - 1)
			}
    }
  }, [currentRound, round])

	React.useEffect(() => {
    if (currentRoundData) {
			setCurrentTicketsSold(currentRoundData.ticketsSold.toNumber())
			setCurrentEndDate(new Date(currentRoundData.endDate.toNumber() * 1000))
			setCurrentWinner(currentRoundData.winnerAddress)
			setCurrentMoneySentToWinner(currentRoundData.moneySentToWinner)
			setCurrentMoneySentToOwner(currentRoundData.moneySentToTeam)
    }
  }, [currentRoundData])

	React.useEffect(() => {
    if (previousRoundData) {
			setPreviousTicketsSold(previousRoundData.ticketsSold.toNumber())
			setPreviousEndDate(new Date(previousRoundData.endDate.toNumber() * 1000))
			setPreviousWinner(previousRoundData.winnerAddress)
			setPreviousMoneySentToWinner(previousRoundData.moneySentToWinner)
			setPreviousMoneySentToOwner(previousRoundData.moneySentToTeam)
    }
  }, [previousRoundData])

	React.useEffect(() => {
    if (currentEntriesData) {
			setCurrentNumberOfEntries(currentEntriesData.toNumber())
    }
  }, [currentEntriesData])

	React.useEffect(() => {
    if (previousEntriesData) {
			setPreviousNumberOfEntries(previousEntriesData.toNumber())
    }
  }, [previousEntriesData])

	React.useEffect(() => {
    if (ownerAddressData) {
			setOwnerAddress(ownerAddressData.toString())
    }
  }, [ownerAddressData])

	React.useEffect(() => {
    if (keeperAddressData) {
			setKeeperAddress(keeperAddressData.toString())
    }
  }, [keeperAddressData])

	React.useEffect(() => {
    if (deployDateData) {
			setDeployDate(new Date(deployDateData.toNumber() * 1000))
    }
  }, [deployDateData])

	React.useEffect(() => {
    if (contractBalanceData) {
			setContractBalance(ethers.utils.formatEther(contractBalanceData.value).substring(0, 4))
    }
  }, [contractBalanceData])

	React.useEffect(() => {
    if (ownerBalanceData) {
			setOwnerBalance(ethers.utils.formatEther(ownerBalanceData.value).substring(0, 4))
    }
  }, [ownerBalanceData])

	React.useEffect(() => {
		setTimeout(() => {
			setTime(new Date())

			const currentCountdown = currentEndDate ? (time > currentEndDate ? 0 : Math.abs(currentEndDate.getTime() - time.getTime())) : 0
			setCurrentCountdown(currentCountdown)
		}, 1000)
	}, [currentEndDate, time])

	return (
		<Container>
			<RowContainer>
				<ColumnContainer>
					<h1>Current round</h1>
					<ul>
						<li>Round number: {display(currentRound)}</li>
						<li>Tickets sold: {display(currentTicketsSold)} / {MAX_TICKETS}</li>
						<li>Total value: {display(currentTicketsSold ? currentTicketsSold * TICKET_PRICE : 0)} ETH</li>
						<li>Number of entries: {display(currentNumberOfEntries)}</li>
						<li>Countdown: {currentCountdown ? formatTime(currentCountdown) : "expired"}</li>
						<li>End date: {displayDate(currentEndDate)}</li>
						<li>Winner: {(currentWinner === ethers.constants.AddressZero || !currentWinner) ? "none" : currentWinner}</li>
						<li>Money sent: winner {currentMoneySentToWinner === true ? "✅" : "❌"} / owner {currentMoneySentToOwner === true ? "✅" : "❌"}</li>
					</ul>
				</ColumnContainer>
				<ColumnContainer>
					<h1>Previous round</h1>
					<ul>
						<li>Round number: {display(previousRound)}</li>
						<li>Tickets sold: {display(previousTicketsSold)} / {MAX_TICKETS}</li>
						<li>Total value: {display(previousTicketsSold ? previousTicketsSold * TICKET_PRICE : 0)} ETH</li>
						<li>Number of entries: {display(previousNumberOfEntries)}</li>
						<li>Countdown: expired</li>
						<li>End date: {displayDate(previousEndDate)}</li>
						<li>Winner: {(previousWinner === ethers.constants.AddressZero || !previousWinner) ? "none" : previousWinner}</li>
						<li>Money sent: winner {previousMoneySentToWinner === true ? "✅" : "❌"} / owner {previousMoneySentToOwner === true ? "✅" : "❌"}</li>
					</ul>
				</ColumnContainer>
			</RowContainer><RowContainer>
				<ColumnContainer>
					<h1>Balances</h1>
					<ul>
						<li>Contract: {display(contractBalance)} ETH</li>
						<li>Owner: {display(ownerBalance)} ETH</li>
					</ul>
				</ColumnContainer>
					<ColumnContainer>
						<h1>Parameters</h1>
						<ul>
							<li>
								Owner address: <br />
								<a href={BLOCK_EXPLORER_URL + "address/" + ownerAddress} target="_blank" rel="noreferrer">
									{display(ownerAddress)}
								</a>
							</li>
							<li>Keeper address: <br />
								<a href={BLOCK_EXPLORER_URL + "address/" + keeperAddress} target="_blank" rel="noreferrer">
									{display(keeperAddress)}
								</a>
							</li>
							<li>Deploy date: {displayDate(deployDate)}</li>
						</ul>
					</ColumnContainer>
				</RowContainer><p id="subtitle" className="small">
				See more on the <a className="colored" href={LOTTERY_EXPLORER_URL} target="_blank" rel="noreferrer">blockchain explorer</a>
			</p>
		</Container>
	)
}

const Container = styled.div`
	/* Layout */
	display: flex;
	flex-direction: column;
	gap: 20px;
	h1 {
		text-decoration: underline;
		text-align: center;
		font-size: 24px;
	}

	li {
		margin: 0px 0px 10px 0px;
	}

	p {
		text-align: center;
	}
`

const RowContainer = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	gap: 100px;
`

const ColumnContainer = styled.div`
	width: 380px;
`

export default Dashboard

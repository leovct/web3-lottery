import { ethers } from "ethers"
import React from "react"
import { FC } from "react"
import styled from "styled-components"
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi"
import { LOTTERY_CONFIG } from "../../constants/address"
import { MAX_TICKETS, TICKET_PRICE } from "../../constants/game"
import { formatTime } from "../../utils/time"

const Play: FC = () => {
	const [round, setRound] = React.useState<number>(1)
	const [previousRound, setPreviousRound] = React.useState<number>(0)
	const [ticketsSold, setTicketsSold] = React.useState<number>(0)
	const [endDate, setEndDate] = React.useState<Date>(new Date())
	const [time, setTime] = React.useState<Date>(new Date())
	const [countdown, setCountdown] = React.useState<number>(0)
	const [lastWinner, setLastWinner] = React.useState<string>("")
	const [lastAmountWon, setLastAmountWon] = React.useState<number>(0)

	const [ticketAmount, setTicketAmount] = React.useState<number>()

	const { address, isConnected } = useAccount()

	const { data: roundData } = useContractRead({
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

	const { data: currentRound } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "currentRound",
		args: [],
		watch: true,
  })

	const { config } = usePrepareContractWrite({
    ...LOTTERY_CONFIG,
    functionName: 'enter',
		args: [ticketAmount],
		overrides: {
			from: isConnected ? address : "",
			value: ticketAmount ? ethers.utils.parseEther((ticketAmount * TICKET_PRICE).toString()) : 0,
		},
  })

	const { data, isLoading, isSuccess, write } = useContractWrite(config)

	React.useEffect(() => {
		if (currentRound) {
			const _currentRound = currentRound.toNumber()
			setRound(_currentRound)
			if (_currentRound > 1) {
				setPreviousRound(_currentRound - 1)
			}
    }
  }, [currentRound, round])

	React.useEffect(() => {
    if (roundData) {
			setTicketsSold(roundData.ticketsSold.toNumber())
			setEndDate(new Date(roundData.endDate.toNumber() * 1000))
    }
  }, [roundData, ticketsSold])

	React.useEffect(() => {
    if (previousRoundData) {
			setLastWinner(previousRoundData.winnerAddress.toString())
			setLastAmountWon(previousRoundData.ticketsSold.toNumber() * TICKET_PRICE)
    }
  }, [previousRoundData])

	React.useEffect(() => {
		setTimeout(() => {
			setTime(new Date())

			const _countdown = endDate ? (time > endDate ? 0 : Math.abs(endDate.getTime() - time.getTime())) : 0
			setCountdown(_countdown)
		}, 1000)
	}, [endDate, time])

	return (
		<Container>
			<p id="subtitle" className="large colored">May the (🥑) force be with you!</p>
			<p className="medium italic">{"Buy tickets and win the lottery if you're lucky! What are you waiting for?!"}</p>

			<MainContainer>
				<BetContainer>
					<NumericInput
						type="number"
						placeholder="How many tickets do you want?"
						min={0}
						max={MAX_TICKETS}
						value={ticketAmount}
						onInput={(e: { target: { value: React.SetStateAction<number | undefined> } }) => setTicketAmount(e.target.value)}
					/>
					<Button
						onClick={() => isConnected ? (ticketAmount > 0 ? write?.() : alert("You must buy at least 1 ticket!")) : alert("Please connect your wallet!") }
					>
						Play!
					</Button>
				</BetContainer>

				<p className="small colored bold">Tickets sold: {ticketsSold} / {MAX_TICKETS} (1x ticket = {TICKET_PRICE} MATIC)</p>
				<p className="small colored bold">Round #{round} {countdown ? "ends in " + formatTime(countdown) : "has ended"} ({endDate.toUTCString()})</p>
			</MainContainer>

			<InfoContainer className="small">
				<p><span className="bold">Last winner (round #{previousRound})</span>: {lastWinner} ({lastAmountWon} MATIC)</p>
				<Button2
					onClick={() => alert("You clicked on the second button!")}
				>
					{">> Get my award! <<"}
				</Button2>
			</InfoContainer>
		</Container>
	)
}

const Container = styled.div`
	/* Layout */
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	#subtitle {
		margin: 0;
	}
`

const MainContainer = styled.div`
	/* Layout */
	display: flex;
	margin: 20px 0px 20px 0px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;

	p {
		margin: 20px 0px 0px 0px;
	}
`

const BetContainer = styled.div`
	/* Layout */
	display: flex;
	gap: 40px;
`

const InfoContainer = styled.div`
	/* Layout */
	text-align: center;
	margin: 20px 0px 0px 0px;
`

const Button = styled.button`
	/* Layout */
  height: 80px;
  width: 180px;

	/* Text */
	font-size: 26px;
	font-weight: bold;

	/* Border */
	border: 1px solid transparent;
	border-radius: 16px;

	/* Shadow */
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);

	/* User interaction */
	cursor: pointer;

	/* Color */
	background: #e3dcd0;
	color: #4d3636;
	border: 1px solid #4d3636;

	&:hover {
		background: #4d3636;
		color: #e3dcd0;
	}

  &:active {
    box-shadow: inset -2px -2px 1px rgba(255, 255, 255, 0.15);
  }
`

const Button2 = styled(Button)`
	/* Layout */
	width: 400px;
	margin-top: 20px;
`

const NumericInput = styled.input`
	/* Remove default styling */
	border: none;

	/* Layout */
  height: 80px;
  width: 500px;
	text-align: center; 

	/* Color */
	background: #94cc80;
	color: #e3dcd0;

	/* Text */
	font-size: 26px;
	font-weight: bold;

	::placeholder {
		color: #e3dcd0;
	}

	/* Border */
	border-radius: 16px;
`;

export default Play

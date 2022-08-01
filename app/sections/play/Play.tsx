import { ethers } from "ethers"
import React from "react"
import Image from "next/image"
import { FC } from "react"
import styled from "styled-components"
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi"
import { LOTTERY_CONFIG } from "../../constants/address"
import { MAX_TICKETS, TICKET_PRICE } from "../../constants/game"
import { formatTime } from "../../utils/time"
import Ticket from "../../assets/ticket.png"

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
			<TitleContainer className="small">
				<p className="italic">{`"The new lottery blockchain game you need to try!"`}</p>
				<p><span className="bold">{ticketsSold * TICKET_PRICE} MATIC to be won</span>, will you be the lucky one?!</p>
			</TitleContainer>
		
			<MainContainer>
				<BetContainer>
					<NumericInput
						type="number"
						placeholder="How many tickets do you want?"
						max={MAX_TICKETS}
						value={ticketAmount === 0 ? "" : ticketAmount}
						onInput={
							(e: React.ChangeEvent<HTMLInputElement>) => setTicketAmount(Number(e.target.value))
						}
					/>
					<BuyButton
						onClick={() => isConnected ? ((typeof ticketAmount === "undefined" ? 0 : ticketAmount) > 0 ? write?.() : alert("You must buy at least 1 ticket!")) : alert("Please connect your wallet!") }
					>
						<span>Buy!</span>
						<Image className="icon" src={Ticket} alt="ticket" priority={true} width={"26px"} height={"26px"} layout="fixed"/>
						<p className="extra-small italic">
							{ticketAmount === 0 || ticketAmount === 1 ? `1 ticket = ${TICKET_PRICE} MATIC` : (
								typeof ticketAmount === "undefined" ?
								`1 ticket = ${TICKET_PRICE} MATIC` :
								`${ticketAmount} tickets = ${ticketAmount * TICKET_PRICE} MATIC`
							)}
						</p>
					</BuyButton>
				</BetContainer>

				<p className="small"><span className="bold">Only {MAX_TICKETS - ticketsSold} tickets left!</span> {`Don't miss it!`}</p>
				<p className="small">
					<span className="underline">Round {countdown ? "ends in " + formatTime(countdown) : "has ended"}</span> ({endDate.toUTCString()})</p>
			</MainContainer>
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

const TitleContainer = styled.div`
	margin: 0px;
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
		margin: 10px 0px 0px 0px;
	}
`

const BetContainer = styled.div`
	/* Layout */
	display: flex;
	gap: 80px;
	margin: 40px 0px;
`

const InfoContainer = styled.div`
	/* Layout */
	text-align: center;
	margin: 20px 0px 0px 0px;
`

const NumericInput = styled.input`
	/* Remove default styling */
	border: none;

	/* Layout */
  height: 80px;
  width: 500px;
	text-align: center; 

	/* Color */
	background: #05386B;
	color: #EDF5E1;

	/* Text */
	font-size: 26px;
	font-weight: bold;

	::placeholder {
		color: #EDF5E1;
	}

	/* Border */
	border-radius: 16px;
`;

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
	background: #EDF5E1;
	color: #05386B;

	&:hover {
		background: #05386B;
		color: #EDF5E1;
	}

  &:active {
    box-shadow: inset -2px -2px 1px rgba(255, 255, 255, 0.15);
  }
`

const BuyButton = styled(Button)`
	span {
		margin-right: 10px;
	}

	&:hover {
		.icon {
			filter: brightness(0) invert(1);
		}
	}
`

const Button2 = styled(Button)`
	/* Layout */
	width: 300px;
	margin-top: 10px;
`

export default Play

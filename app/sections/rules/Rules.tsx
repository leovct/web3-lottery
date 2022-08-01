import { FC } from "react"
import styled from "styled-components"
import { MAX_TICKETS, TICKET_PRICE } from "../../constants/game"

const Rules: FC = () => {
	return (
		<Container>
			<MainContainer className="small">
				<p>{">"} <span className="bold">{MAX_TICKETS} tickets are available per round</span>, each at {TICKET_PRICE} MATIC.</p>
				<p>{">"} At the end of the round, the contract randomly picks a number using <span className="bold">Chainlink VRF</span>. The lucky owner of the winning ticket wins the jackpot!!</p>
				<p>{">"} A round lasts exactly <span className="bold">24 hours</span>.</p>
				<p>{">"} To finance maintenance and operational costs, the winner shares a percentage of the jackpot with the web3.lottery team.</p>
				<span className="bold">Winner: 90% / Team: 5% / Contract: 5%</span>
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
`

const MainContainer = styled.div`
	/* Layout */
	width: 40%;
	display: flex;
	flex-direction: column;
	gap: 60px;

	p {
		margin: 0px;
	}

	span {
		text-align: center;
	}
`

export default Rules

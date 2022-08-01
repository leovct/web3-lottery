import { FC } from "react"
import styled from "styled-components"
import { MAX_TICKETS, TICKET_PRICE } from "../../constants/game"

const Rules: FC = () => {
	return (
		<Container>
			<p id="subtitle" className="large	">The 4 🥑 rules</p>
			<p className="medium italic">Everything you need to become a real avocado!</p>

			<MainContainer className="small">
				<p>{">"} <span className="bold">{MAX_TICKETS} tickets</span> are available per round, each at {TICKET_PRICE} MATIC.</p>
				<p>{">"} At the end of the round, the contract <span className="bold">randomly picks a number using Chainlink VRF</span>. The lucky owner of the winning ticket wins the jackpot!!</p>
				<p>{">"} A round lasts exactly <span className="bold">24 hours</span>.</p>
				<p>{">"} In order to finance maintenance and operational costs, <span className="bold">the winner takes 92% of the stake</span>, the team behind the project gets 5% and the contract keeps 3%.</p>
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

const MainContainer = styled.div`
	/* Layout */
	display: flex;
	width: 40%;
	margin-top: 40px;
	flex-direction: column;
	justify-content: center;
	gap: 40px;

	p {
		margin: 0px;
	}
`

export default Rules

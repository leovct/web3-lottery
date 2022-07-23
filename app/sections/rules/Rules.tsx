import { FC } from "react"
import styled from "styled-components"

const Rules: FC = () => {
	return (
		<Container>
			<p id="subtitle" className="colored underline	">The Rules</p>

			<MainContainer>
				<p>1) Each round, people bet <span className="underline">once</span> on a number (integer and positive).</p>
				<p>2) At the end of the round, we randomly pick a number using Chainlink VRF. The first person that bet on this number wins the jackpot.</p>
				<p>3) If there is no winner, then we randomly choose a winner among the players.</p>
				<p>4) A round lasts exactly 24 hours.</p>
				<p>5) In order to finance maintenance and operational costs, the winner takes 92% of the stake, the team behind the project gets 5% and the contract keeps 3%.</p>
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
	gap: 10px;
	text-align: center;
`

export default Rules

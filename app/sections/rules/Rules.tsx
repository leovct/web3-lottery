import { FC } from "react"
import styled from "styled-components"

const Rules: FC = () => {
	return (
		<Container>
			<p id="subtitle" className="colored underline	">The Rules</p>

			<MainContainer>
				<p>1) Each round, people bet <span className="underline">once</span> on a number (integer and positive).</p>
				<p>2) At the end of the round, the person who has bet the <span className="underline">smallest</span> number <span className="underline">that has not been bet by someone else</span> wins the jackpot.</p>
				<p>3) A round lasts exactly 24 hours.</p>
				<p>4) If there is no winner (all the people have bet on the same number), then we randomly choose a winner among the players using Chainlink VRF.</p>
				<p>5) In order to finance maintenance and operational costs, the winner takes 95% of the stake and the team behind the project reserves 5%.</p>
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

export default Rules;

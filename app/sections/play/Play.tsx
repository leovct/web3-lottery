import { FC } from "react"
import styled from "styled-components"

const Play: FC = () => {
	return (
		<Container>
			<p id="subtitle" className="large colored">May the (🥑) force be with you!</p>
			<p className="medium italic">{"Bet on a number and win the jackpot if you're lucky! What are you waiting for?!"}</p>

			<MainContainer>
				<BetContainer>
					<NumericInput type="string" placeholder="Your guess..."/>
					<Button
						onClick={() => alert('You clicked on the first button!')}
					>Play!</Button>
				</BetContainer>

				<p className="small colored bold underline">Round #2 ends on July 22, 2022 at 8pm (UTC)</p>
			</MainContainer>

			<InfoContainer className="small">
				<p><span className="bold">Last winner (round #1)</span>: 0xbFe2...5A (10 MATIC)</p>
				<p><span className="bold">Biggest amount won so far</span>: 120 MATIC</p>
				<Button2
					onClick={() => alert('You clicked on the second button!')}
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
	margin: 40px 0px 40px 0px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
`

const BetContainer = styled.div`
	/* Layout */
	display: flex;
	gap: 40px;
`

const InfoContainer = styled.div`
	/* Layout */
	text-align: center;
	margin: 0px;
`

const Button = styled.button`
	/* Layout */
  height: 80px;
  width: 180px;

	/* Color */
	background: #4d3636;
	color: #e3dcd0;

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

	&:hover {
		background: #94cc80;
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
	
	/* Color */
	background: #e3dcd0;
	color: #4d3636;
	border: 1px solid #4d3636;

	&:hover {
		background: #4d3636;
		color: #e3dcd0;
	}
`

const NumericInput = styled.input`
	/* Remove default styling */
	border: none;

	/* Layout */
  height: 80px;
  width: 400px;
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

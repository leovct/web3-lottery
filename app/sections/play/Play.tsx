import { FC } from "react"
import styled from "styled-components"

const Play: FC = () => {
	return (
		<Container>
			<p id="subtitle" className="colored italic">May the power of the avocado be with you...</p>

			<MainContainer>
				<BetContainer>
					<NumericInput type="string" placeholder="your bet?"/>
					<Button
						onClick={() => alert('You clicked on the button!')}
					>submit</Button>
				</BetContainer>

				<p className="colored underline">Round ends on July 22, 2022 at 8pm UTC</p>
			</MainContainer>

			<p>Last winner: 0xbFe21ad2ef6599091afdbe0B1081039d2Fee2B5A won 10Ξ</p>
			<p>Biggest amount won so far: 120Ξ</p>
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

	/* Text */
	.colored {
		color: #84aa21;
	}

	.italic {
		font-style: italic;
	}

	.underline {
		text-decoration: underline;
	}
`

const MainContainer = styled.div`
	/* Layout */
	display: flex;
	margin: 80px 0px 40px 0px;
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

const Button = styled.button`
	/* Layout */
  height: 80px;
  width: 180px;

	/* Color */
	background: #d16c3c;
	color: white;

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
    background: #84aa21;
		color: black;
  }

  &:active {
    box-shadow: inset -2px -2px 1px rgba(255, 255, 255, 0.15);
  }
`

const NumericInput = styled.input`
	/* Remove default styling */
	border: none;

	/* Layout */
  height: 80px;
  width: 320px;
	text-align: center; 

	/* Color */
	background: #84aa21;
	color: white;

	/* Text */
	font-size: 26px;
	font-weight: bold;

	::placeholder {
		color: #d3d3d3;
	}

	/* Border */
	border-radius: 16px;
`;

export default Play;

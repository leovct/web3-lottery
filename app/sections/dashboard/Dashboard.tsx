import { FC } from "react"
import styled from "styled-components"
import { LOTTERY_EXPLORER_URL } from "../../constants/address"

const Dashboard: FC = () => {
	return (
		<Container>
			<RowContainer>
				<ColumnContainer>
					<h1>Current round</h1>
					<ul>
						<li>Round number: 2</li>
						<li>Tickets sold: 90/100</li>
						<li>Number of entries: 20</li>
						<li>Countdown: 20 min</li>
						<li>End date: 31/07/2022 8:00pm CEST</li>
						<li>Winner: none</li>
						<li>Money sent: winner ❌ / owner ❌</li>
					</ul>
				</ColumnContainer>
				<ColumnContainer>
					<h1>Previous round</h1>
					<ul>
						<li>Round number: 1</li>
						<li>Tickets sold: 77/100</li>
						<li>Number of entries: 50</li>
						<li>Countdown: ended</li>
						<li>End date: 30/07/2022 8:00pm CEST</li>
						<li>Winner: 0x...</li>
						<li>Money sent: winner ✅ / owner ✅</li>
					</ul>
				</ColumnContainer>
			</RowContainer>
			<RowContainer>
				<ColumnContainer>
					<h1>Balances</h1>
					<ul>
						<li>Contract: 100 ETH</li>
						<li>Owner: 2 ETH</li>
					</ul>
				</ColumnContainer>
				<ColumnContainer>
					<h1>Parameters</h1>
					<ul>
						<li>Owner address: ???</li>
						<li>Keeper address: ???</li>
						<li>Deploy data: ???</li>
					</ul>
				</ColumnContainer>
			</RowContainer>
			<p id="subtitle" className="small">
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
	align-items: center;
	justify-content: center;
	width: 100%;
	gap: 100px;
`

const ColumnContainer = styled.div`
	width: 300px;
`

export default Dashboard

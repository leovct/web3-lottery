import { FC } from "react"
import styled from "styled-components"

const History: FC = () => {
	return (
		<Container>
			<p id="subtitle" className="colored underline">History</p>

			<MainContainer>
				<Table>
					<tr>
						<th>Round</th>
						<th>Winner</th>
						<th>Amount</th>
					</tr>
					<tr>
						<td>6</td>
						<td>0xbFe21ad2ef6599091afdbe0B1081039d2Fee2B5A</td>
						<td>22 MATIC</td>
					</tr>
					<tr>
						<td>5</td>
						<td>0xbFe21ad2ef6599091afdbe0B1081039d2Fee2B5A</td>
						<td>17 MATIC</td>
					</tr>
					<tr>
						<td>4</td>
						<td>0xbFe21ad2ef6599091afdbe0B1081039d2Fee2B5A</td>
						<td>9 MATIC</td>
					</tr>
					<tr>
						<td>3</td>
						<td>0xbFe21ad2ef6599091afdbe0B1081039d2Fee2B5A</td>
						<td>12 MATIC</td>
					</tr>
					<tr>
						<td>2</td>
						<td>0xbFe21ad2ef6599091afdbe0B1081039d2Fee2B5A</td>
						<td>4 MATIC</td>
					</tr>
					<tr>
						<td>1</td>
						<td>0xbFe21ad2ef6599091afdbe0B1081039d2Fee2B5A</td>
						<td>1 MATIC</td>
					</tr>
				</Table>
			</MainContainer>

			<p id="subtitle" className="colored">
				See more rounds on the <a className="colored underline" href="https://polygonscan.com/" target="_blank" rel="noreferrer">blockchain explorer</a>...
			</p>
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
	width: 44%;
	margin: 40px 0px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
`

const Table = styled.table`
	/* Layout */
	width: 100%;

	/* Text */
	text-align: center;

	/* Table */
	td, th {
		border: 1px solid #ddd;
		padding: 8px;
	}

	tr:nth-child(even){
		background-color: #f2f2f2;
	}

	tr:hover {
		background-color: #ddd;
	}

	th {
		padding-top: 12px;
		padding-bottom: 12px;
		background-color: #84aa21;
		color: white;
	}
`

export default History

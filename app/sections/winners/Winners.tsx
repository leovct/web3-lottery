import { FC } from "react"
import styled from "styled-components"

const Winners: FC = () => {
	return (
		<Container>
			<p id="subtitle" className="large colored">Last winners of the 🥑</p>
			<p className="medium italic">{"Only real avocados are listed here... Are you the next choosen one?"}</p>

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

			<p id="subtitle" className="small">
				See more on the <a className="colored" href="https://polygonscan.com/" target="_blank" rel="noreferrer">blockchain explorer</a>
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
	font-size: 17px;
	text-align: center;

	/* Table */
	border-collapse: collapse;

	th, td {
		border: 1px solid black;
	}

	th {
		background-color: #94cc80;
		color: #e3dcd0;
		font-size: 26px;
	}
	
	td, th {
		border: 1px solid #ddd;
		padding: 8px;
	}
	
	tr:nth-child(even) {
		background-color: #f2f2f2;
	}
`

export default Winners

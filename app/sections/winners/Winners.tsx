import { FC } from "react"
import styled from "styled-components"
import { LOTTERY_EXPLORER_URL } from "../../constants/address"

const Winners: FC = () => {
	return (
		<Container>
			<TitleContainer className="small">
				<p>Here are the last lucky winners of the lottery...</p>
				<p className="italic bold">
					See more on the <a href={LOTTERY_EXPLORER_URL} target="_blank" rel="noreferrer">blockchain explorer</a>
				</p>
			</TitleContainer>

			<MainContainer>
				<Table>
					<tr>
						<th>Round</th>
						<th>Winner</th>
						<th>Amount</th>
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

const TitleContainer = styled.div`
	margin: 0px;
	text-align: center;
`

const MainContainer = styled.div`
	/* Layout */
	display: flex;
	margin: 20px 0px 0px 0px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
`

const Table = styled.table`
	/* Layout */
	width: 100%;

	/* Text */
	font-size: 18px;
	text-align: center;

	/* Table */
	border-collapse: collapse;

	th, td {
		border: 1px solid black;
	}

	th {
		background-color: #05386B;
		width: 200px;
		color: #EDF5E1;
		font-size: 22px;
	}
	
	td, th {
		height: 40px;
		border: 1px solid #05386B;
		padding: 8px;
	}
`

export default Winners

import { FC } from "react"
import styled from "styled-components"
import Image from "next/image"

import Avocado from "../../assets/avocado.png"

const IMG_SIZE = "60px"

const Header: FC = () => {
	return (
		<Container>
			<Image src={Avocado} alt="avocado" priority={true} width={IMG_SIZE} height={IMG_SIZE} layout="fixed"/>
			<h1>avocado.io</h1>
		</Container>
	)
}

const Container = styled.div`
	/* Layout */
	height: 200px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;

	/* Color */
	color: #84aa21;
`

export default Header

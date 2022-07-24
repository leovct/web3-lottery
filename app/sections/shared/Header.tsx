import { FC } from "react"
import styled from "styled-components"
import Image from "next/image"
import { ConnectButton } from '@rainbow-me/rainbowkit'

import Avocado from "../../assets/avocado.png"

const IMG_SIZE = "60px"

const Header: FC = () => {
	return (
		<Container>
			<TitleContainer>
				<Image src={Avocado} alt="avocado" priority={true} width={IMG_SIZE} height={IMG_SIZE} layout="fixed"/>
				<h1>avocado</h1>
			</TitleContainer>
			<ConnectButton />
		</Container>
	)
}

const Container = styled.div`
	/* Layout */
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 40px;

	/* Color */
	color: #94cc80;
`

const TitleContainer = styled.div`
	/* Layout */
	display: flex;
	align-items: center;
	gap: 16px;
`

export default Header

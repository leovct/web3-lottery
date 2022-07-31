import { FC } from "react"
import styled from "styled-components"
import Image from "next/image"
import { ConnectButton } from '@rainbow-me/rainbowkit'

import Avocado from "../../assets/avocado.png"

type HeaderProps = {
	currentPage: string
	handleClick: (page: string) => void
	isAdmin: boolean
}

const Header: FC<HeaderProps> = ({ currentPage, handleClick, isAdmin }) => {
	return (
		<Container>
			<TitleContainer>
				<Image src={Avocado} alt="avocado" priority={true} width={"60px"} height={"60px"} layout="fixed"/>
				<h1>avocado</h1>
			</TitleContainer>
			<MenuContainer>
				<Button
					className={`${currentPage == "home" ? "highlight" : ""}`}
					onClick={() => handleClick("home")}
				>
					Play
				</Button>
				<Button
					className={`${currentPage == "rules" ? "highlight" : ""}`}
					onClick={() => handleClick("rules")}
				>
					The Rules
				</Button>
				<Button
					className={`${currentPage == "winners" ? "highlight" : ""}`}
					onClick={() => handleClick("winners")}
				>
					Winners
				</Button>
				{
					isAdmin && (
						<Button
							className={`${currentPage == "dashboard" ? "highlight" : ""}`}
							onClick={() => handleClick("dashboard")}
						>
							Dashboard
						</Button>
					)
				}
			</MenuContainer>
			<ConnectButtonContainer>
				<ConnectButton />
			</ConnectButtonContainer>
		</Container>
	)
}

const Container = styled.div`
	/* Layout */
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 40px;

	/* Text */
	.highlight {
		font-weight: bold;
		text-decoration: underline;
		color: #4d3636;
	}
`

const TitleContainer = styled.div`
	/* Layout */
	display: flex;
	align-items: center;
	gap: 16px;
	width: 300px;
`

const MenuContainer = styled.div`
	/* Layout */
	display: flex;
	gap: 60px;

	/* Text */
	font-size: 18px;
`

const Button = styled.button`
	/* Remove default styling */
	background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	outline: inherit;

	/* User interaction */
	cursor: pointer;
	
	&:hover, &:focus {
		color: #4d3636;
	}

	&:hover {
		font-style: italic;
	}

	&:focus {
		text-decoration: underline;
	}
`

const ConnectButtonContainer = styled.div`
	/* Layout */
	display: flex;
	justify-content: end;
	width: 300px;
`

export default Header

import { FC } from "react"
import styled from "styled-components"
import Image from "next/image"
import { ConnectButton } from '@rainbow-me/rainbowkit'

import Ticket from "../../assets/ticket.png"
import TwitterLogo from "../../assets/twitter.png"
import GithubLogo from "../../assets/github.png"
import PolygonLogo from "../../assets/polygon.png"
import Gear from "../../assets/gear.png"

import { LOTTERY_EXPLORER_URL } from "../../constants/address"

const IMG_SIZE = "20px"

type HeaderProps = {
	currentPage: string
	handleClick: (page: string) => void
	isAdmin: boolean
}

const Header: FC<HeaderProps> = ({ currentPage, handleClick, isAdmin }) => {
	return (
		<Container>
			<LeftContainer>
				<LogoContainer>
					<Image src={Ticket} alt="ticket" priority={true} width={"40px"} height={"40px"} layout="fixed"/>
					<p className="small">web3.lottery</p>
				</LogoContainer>
				<ExternalLinks>
					<a href="https://twitter.com/leoovct" target="_blank" rel="noreferrer">
						<Image className="icon" src={TwitterLogo} alt="devpost-logo" priority={true} width={IMG_SIZE} height={IMG_SIZE} layout="fixed"/>
					</a>
					<a href="https://github.com/leovct/avocado" target="_blank" rel="noreferrer">
						<Image className="icon" src={GithubLogo} alt="github-logo" priority={true} width={IMG_SIZE} height={IMG_SIZE} layout="fixed"/>
					</a>
					<a href={LOTTERY_EXPLORER_URL} target="_blank" rel="noreferrer">
						<Image className="icon" src={PolygonLogo} alt="polygon-logo" priority={true} width={IMG_SIZE} height={IMG_SIZE} layout="fixed"/>
					</a>
				</ExternalLinks>
			</LeftContainer>
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
			</MenuContainer>
			<RightContainer>
				{
					isAdmin && (
						<Button
							className={`${currentPage == "dashboard" ? "highlight" : ""}`}
							onClick={() => handleClick("dashboard")}
						>
							<Image className="icon" src={Gear} alt="gear" priority={true} width={"26px"} height={"26px"} layout="fixed"/>
						</Button>
					)
				}
				<ConnectButton />
			</RightContainer>
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
	}

	/* Icons */
	.icon:hover {
		filter: brightness(0) invert(1);
	}
`

const LeftContainer = styled.div`
	/* Layout */
	display: flex;
	flex-direction: column;
	align-items: start;
	width: 300px;
`

const LogoContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`

const ExternalLinks = styled.div`
	/* Layout */
	display: flex;
	margin-left: 60px;
	gap: 10px;
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
		color: #05386B;
	}

	&:hover {
		color: #EDF5E1;
	}

	&:focus {
		text-decoration: underline;
		font-weight: bold;
	}
`

const RightContainer = styled.div`
	/* Layout */
	display: flex;
	justify-content: end;
	align-items: center;
	width: 340px;
	gap: 10px;
`

export default Header

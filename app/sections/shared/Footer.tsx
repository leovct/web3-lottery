import { FC } from "react"
import styled from "styled-components"
import Image from "next/image"

import GithubLogo from "../../assets/github.png"
import PolygonLogo from "../../assets/polygon.png"

const IMG_SIZE = "32px"

type FooterProps = {
	currentPage: string;
	handleClick: (page: string) => void;
}

const Footer: FC<FooterProps> = ({ currentPage, handleClick }) => {
	return (
		<Container>
			<Menu>
				<Button
					className={`${currentPage == "home" ? "highlight" : ""}`}
					onClick={() => handleClick("home")}
				>
					Play!
				</Button>
				<Button
					className={`${currentPage == "rules" ? "highlight" : ""}`}
					onClick={() => handleClick("rules")}
				>
					The Rules
				</Button>
				<Button
					className={`${currentPage == "history" ? "highlight" : ""}`}
					onClick={() => handleClick("history")}
				>
					History
				</Button>
			</Menu>
			<ExternalLinks>
				<a href="https://github.com/leovct/avocado" target="_blank" rel="noreferrer">
					<Image src={GithubLogo} alt="github-logo" priority={true} width={IMG_SIZE} height={IMG_SIZE} layout="fixed"/>
				</a>
				<a href="https://polygonscan.com/" target="_blank" rel="noreferrer">
					<Image src={PolygonLogo} alt="polygon-logo" priority={true} width={IMG_SIZE} height={IMG_SIZE} layout="fixed"/>
				</a>
			</ExternalLinks>
		</Container>
	)
}

const Container = styled.div`
	height: 100px;
	margin: 0px 40px 20px 40px;

	display: flex;
	justify-content: center;
	align-items: end;
	gap: 30px;

	// Text
	.highlight {
		font-weight: bold;
		color: #84aa21;
	}
`

const Button = styled.button`
	background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;

	&:hover, &:focus {
		color: #84aa21;
	}
`

const Menu = styled.div`
	width: 100%;
	display: flex;
	gap: 40px;
`

const ExternalLinks = styled.div`
	display: flex;
	gap: 10px;
`

export default Footer

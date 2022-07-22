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
			<MainContainer>
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
				<p className="small colored italic">
					made with ❤️ by <a className="colored underline" href="https://twitter.com/leoovct" target="_blank" rel="noreferrer">@leovct</a>
				</p>
			</MainContainer>

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
	/* Layout */
	height: 100px;
	margin: 0px 40px 20px 40px;

	display: flex;
	justify-content: center;
	align-items: end;
	gap: 30px;

	/* Text */
	.highlight {
		font-weight: bold;
		color: #84aa21;
	}
`

const MainContainer = styled.div`
	/* Layout */
	width: 100%;
	display: flex;
	flex-direction: column;

	/* Text */
	.small {
		font-size: 12px;
	}
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
		color: #84aa21;
	}
`

const Menu = styled.div`
	/* Layout */
	display: flex;
	gap: 40px;
`

const ExternalLinks = styled.div`
	/* Layout */
	display: flex;
	gap: 10px;
`

export default Footer

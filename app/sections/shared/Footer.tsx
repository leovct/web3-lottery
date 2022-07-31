import { FC } from "react"
import styled from "styled-components"
import Image from "next/image"

import DevPostLogo from "../../assets/devpost.png"
import GithubLogo from "../../assets/github.png"
import PolygonLogo from "../../assets/polygon.png"

const IMG_SIZE = "32px"

const Footer: FC = () => {
	return (
		<Container>
			<MainContainer>
				<p className="small colored2 italic">
					made with ❤️ by <a className="colored underline" href="https://twitter.com/leoovct" target="_blank" rel="noreferrer">@leovct</a>
				</p>
			</MainContainer>

			<ExternalLinks>
			<a href="https://devpost.com/software/avocado-i92guw" target="_blank" rel="noreferrer">
					<Image src={DevPostLogo} alt="devpost-logo" priority={true} width={IMG_SIZE} height={IMG_SIZE} layout="fixed"/>
				</a>
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
`

const MainContainer = styled.div`
	/* Layout */
	width: 100%;
	display: flex;
	flex-direction: column;

	/* Text */
	.small {
		font-size: 13px;
	}
`

const ExternalLinks = styled.div`
	/* Layout */
	display: flex;
	gap: 10px;
`

export default Footer

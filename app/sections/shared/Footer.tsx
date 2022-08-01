import { FC } from "react"
import styled from "styled-components"

const Footer: FC = () => {
	return (
		<Container>
			<p className="extra-small italic">
				made with ❤️ by <a className="underline" href="https://twitter.com/leoovct" target="_blank" rel="noreferrer">@leovct</a> during the <a className="underline" href="https://devpost.com/software/avocado-i92guw?ref_content=user-portfolio&ref_feature=in_progress" target="_blank" rel="noreferrer">Polygon BUILD IT: Summer 2022</a> hackathon
			</p>
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

export default Footer

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import "@rainbow-me/rainbowkit/styles.css"
import {
	RainbowKitProvider,
	getDefaultWallets,
	connectorsForWallets,
	wallet,
	lightTheme,
	darkTheme,
} from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

const { chains, provider, webSocketProvider } = configureChains(
	[chain.polygonMumbai],
	[
		alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }),
		publicProvider(),
	]
)

const { wallets } = getDefaultWallets({
	appName: "web3.lottery",
	chains,
})

const connectors = connectorsForWallets([
	...wallets,
	{
		groupName: "Other",
		wallets: [
			wallet.argent({ chains }),
			wallet.trust({ chains }),
			wallet.ledger({ chains }),
		],
	},
])

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
})

const appInfo = {
	appName: "web3.lottery",
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				appInfo={appInfo}
				chains={chains}
				showRecentTransactions={true}
				theme={lightTheme({
					accentColor: "#05386B",
					accentColorForeground: "#EDF5E1",
					overlayBlur: "small",
				})}
				coolMode
			>
				<Component {...pageProps} />
			</RainbowKitProvider>
		</WagmiConfig>
	)
}

export default MyApp

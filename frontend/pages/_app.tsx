import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import ProgressBar from "nextjs-progressbar";

import "@rainbow-me/rainbowkit/styles.css";
import {
	getDefaultWallets,
	RainbowKitProvider,
	darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, bscTestnet } from "wagmi/chains";
import { ToastContainer } from "react-toastify";
import { publicProvider } from "wagmi/providers/public";
const { chains, publicClient } = configureChains(
	[bscTestnet, mainnet, polygon, optimism, arbitrum],
	[
		publicProvider(),
	]
);
const { connectors } = getDefaultWallets({
	appName: "My RainbowKit App",
	projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID!,
	chains,
});
const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<ProgressBar color="#5150E7" height={3} />
			<ToastContainer />
			<WagmiConfig config={wagmiConfig}>
				<RainbowKitProvider
					chains={chains}
					theme={darkTheme({
						accentColor: "#5150E7",
					})}
				>
					<Component {...pageProps} />
				</RainbowKitProvider>
			</WagmiConfig>
		</>
	);
}

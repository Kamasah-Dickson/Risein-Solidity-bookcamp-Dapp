import { Inter } from "next/font/google";
import Head from "next/head";
import Header from "@/components/Header";
import Blockchain_icons from "@/components/blockchain-icons";
import Main_entrance from "@/components/Main_entrance";
import { LoadingStateContext } from "@/context/loadingContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<>
			<Head>
				<title key={"title"}>Smart contract profi-lock tokens</title>
			</Head>
			<Header />
			<main
				className={`absolute pt-32 flex-col p-5 flex justify-center items-center text-white top-0 left-0 min-h-screen w-full bg-top bg-no-repeat bg-cover home ${inter.className}`}
			>
				<h1 className="mb-5 text-3xl font-bold md:text-5xl xl:text-6xl md:max-w-xl text-center">
					Welcome to ProfiLock Tokens
				</h1>
				<LoadingStateContext>
					<Main_entrance />
				</LoadingStateContext>
				<Blockchain_icons />
			</main>
		</>
	);
}

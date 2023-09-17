import { Inter } from "next/font/google";
import Head from "next/head";
import Header from "@/components/Header";
import Blockchain_icons from "@/components/blockchain-icons";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<>
			<Head>
				<title key={"title"}>Smart Contract Token-Lock</title>
			</Head>
			<Header />
			<main
				className={`absolute pt-32 flex-col p-5 flex justify-center items-center text-white top-0 left-0 min-h-screen w-full bg-top bg-no-repeat bg-cover home ${inter.className}`}
			>
				<h1 className="mb-5 text-3xl font-bold md:text-4xl">
					Welcome to ProfiLockToken
				</h1>
				<p className="text-[#ffffffa6] max-w-2xl text-center mb-7">
					Your gateway to secure and profitable token locking.😎 Our smart
					contract technology allows you to lock your tokens for specified
					durations, with the potential to earn substantial profits based on
					your percentage specified and duration.
				</p>
				{/* <div className="border mb-20 rounded-xl p-5 border-[#ffffff3a] bg-[rgba(12,5,5,0.43)]"> */}
				<p className="h-[350px] w-[560px]">hello</p>
				{/* </div> */}

				<Blockchain_icons />
			</main>
		</>
	);
}

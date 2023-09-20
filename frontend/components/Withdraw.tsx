import { useState, useEffect } from "react";
import { abi, contractAddress as contractAddresses } from "../constants/index";

import { useAccount, useNetwork } from "wagmi";
import { parseEther } from "ethers";
import { toast } from "react-toastify";

export function Withdraw({ duration }: { duration: string }) {
	const { chain } = useNetwork();
	const [holdDuration, setHoldDuration] = useState(Number(duration));
	const lockTokenAddress =
		(chain?.id as number) in contractAddresses
			? contractAddresses[
					chain?.id as unknown as keyof typeof contractAddresses
			  ][0]
			: null;

	const { address } = useAccount();
	const [error, setError] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setHoldDuration(holdDuration - 1);
			console.log(holdDuration);
		}, 1000);

		return clearInterval(interval);
	}, [holdDuration]);

	// if (isError) {
	// 	toast.error(isError, {
	// 		position: "top-center",
	// 	});
	// }

	const handleWithdraw = () => {};

	return (
		<form
			className="bg-[#40404421] shadow-sm backdrop-blur-sm mt-7 md:mb-20 rounded-xl flex flex-col w-full gap-5 p-7 max-w-md mx-auto"
			onSubmit={(e) => {
				e.preventDefault();
				// sendTransaction?.();
			}}
		>
			<div className="text-center">{`${holdDuration}s remaining`}</div>
			<button
				onClick={handleWithdraw}
				className="rounded-md cursor-pointer bg-[#4040e0] active:scale-[1.01] px-2 py-3 font-medium text-lg disabled:active:scale-[unset] disabled:cursor-not-allowed disabled:bg-[#3f3c3c]"
				// type="submit"
				// disabled={isLoading || !rate || !duration || Boolean(error)}
			>
				{/* {isLoading ? "Sending..." : "Send"} */}
				Withdraw
			</button>
			{/* {isSuccess && (
				<div>
					Successfully deployed at
					<div>
						<a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
					</div>
				</div>
			)} */}
		</form>
	);
}
export default Withdraw;

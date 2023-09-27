import { useState, useEffect, FormEvent } from "react";
import { abi, contractAddress as contractAddresses } from "../constants/index";
import {
	useAccount,
	useNetwork,
	useContractWrite,
	useWaitForTransaction,
} from "wagmi";
import { Iwithdraw } from "@/interface/interface";

export function Withdraw({
	duration,
	enableWithdraw,
	setSteps,
	setCurrentActiveStep,
}: Iwithdraw) {
	const { chain } = useNetwork();
	const [holdDuration, setHoldDuration] = useState(Number(duration) + 5);
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
			if (holdDuration == 0) {
				return;
			} else {
				setHoldDuration(holdDuration - 1);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [holdDuration]);

	const { data, isLoading, write } = useContractWrite({
		address: lockTokenAddress as any,
		abi,
		functionName: "withdraw",
		chainId: 97,
		account: address,
		gas: BigInt("104878"),
		gasPrice: BigInt("2000000000"),

		onError(error) {
			console.log(error.message);
			setError(error.message);
		},
		onSuccess(data) {
			console.log(`Success ${data}`);
		},
	});

	const { isLoading: isWaitForTransLoading } = useWaitForTransaction({
		hash: data?.hash,
		chainId: 97,
		onSuccess(data) {
			setCurrentActiveStep(1);
			setSteps([
				{ completed: false, step: 1 },
				{ completed: false, step: 2 },
			]);
		},
	});

	const handleWithdraw = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		write?.();
	};

	return (
		<div className="flex flex-col w-full">
			<form
				className="bg-[#40404421] shadow-sm backdrop-blur-sm mt-7 md:mb-20 rounded-xl flex flex-col w-full gap-5 p-7 max-w-md mx-auto"
				onSubmit={(e) => handleWithdraw(e)}
			>
				{isWaitForTransLoading ? (
					<div className="text-green-500">Please wait...</div>
				) : (
					<div className="text-center">{`${holdDuration}s remaining`}</div>
				)}
				<button
					className="rounded-md cursor-pointer bg-[#4040e0] active:scale-[1.01] px-2 py-3 font-medium text-lg disabled:active:scale-[unset] disabled:cursor-not-allowed disabled:bg-[#3f3c3c]"
					type="submit"
					disabled={
						enableWithdraw || holdDuration !== 0 || isWaitForTransLoading
					}
				>
					{isLoading
						? "Please wait..."
						: isWaitForTransLoading
						? "Pending Transaction"
						: "Withdraw"}
				</button>
			</form>
			<div className="pb-4 px-4">
				{error && (
					<div>
						<div className=" text-center w-full">
							<span
								style={{ overflowWrap: "anywhere" }}
								className="text-xs w-full text-[crimson]"
							>
								{error}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
export default Withdraw;

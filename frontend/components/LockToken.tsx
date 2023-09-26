import { useDebounce } from "use-debounce";
import { useState, ChangeEvent, FormEvent } from "react";
import { abi, contractAddress as contractAddresses } from "../constants/index";

import {
	useAccount,
	useNetwork,
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
} from "wagmi";

import { parseEther } from "ethers";
import { Itrans } from "@/interface/interface";

export function LockToken({
	goTonextStep,
	duration,
	setDuration,
	setEnableWithdraw,
}: Itrans) {
	const { chain } = useNetwork();
	const lockTokenAddress =
		(chain?.id as number) in contractAddresses
			? contractAddresses[
					chain?.id as unknown as keyof typeof contractAddresses
			  ][0]
			: null;

	const { address } = useAccount();
	const [amount, setAmount] = useState("");

	const [rate, setRate] = useState("");
	const [debouncedAmount] = useDebounce(amount, 0);
	const [error, setError] = useState("");

	const { config } = usePrepareContractWrite({
		address: lockTokenAddress as any,
		abi,
		functionName: "deposit",
		chainId: 97,
		args: [duration, rate],
		account: address,
		gas: BigInt("908735"),
		gasPrice: BigInt("1000000000"),
		value: debouncedAmount ? parseEther(amount) : undefined,
	});

	const {
		data,
		isLoading,
		write,
		isError,
		error: errorContractWrite,
	} = useContractWrite({
		...config,
	});

	const { isLoading: isWaitForTransLoading } = useWaitForTransaction({
		hash: data?.hash,
		chainId: 97,
		onSuccess(data) {
			console.log(`Success ${data}`);
			setEnableWithdraw(false);
			goTonextStep();
		},
	});

	const handleDuration = (e: ChangeEvent<HTMLInputElement>) => {
		if (!isNaN(Number(e.target.value))) {
			setDuration(e.target.value);
		} else {
			return;
		}
	};
	const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!isNaN(Number(e.target.value))) {
			setRate(e.target.value);
		} else {
			return;
		}
	};

	const handleSetAmount = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0.01) {
			setError("Minimum BNB 0.01");
		} else {
			setError("");
		}
		if (!isNaN(Number(e.target.value))) {
			setAmount(e.target.value);
		} else {
			return;
		}
	};

	const handleSendTransaction = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		write?.();
	};

	return (
		<div className="flex flex-col w-full">
			<form
				className="bg-[#40404421] shadow-sm backdrop-blur-sm mt-7 md:mb-20 rounded-xl flex flex-col w-full gap-5 p-7 max-w-lg mx-auto"
				onSubmit={(e) => handleSendTransaction(e)}
			>
				<div className="flex mt-4 flex-col gap-2">
					<label htmlFor="bnb" className="text-[grey]">
						Deposit BNB
					</label>
					<input
						id="bnb"
						aria-label="Amount (ether)"
						onChange={(e) => handleSetAmount(e)}
						placeholder="0.05"
						disabled={isLoading || isWaitForTransLoading}
						value={amount}
						name="amountOfEthers"
						className="p-2 mb-2 text-black font-bold rounded-md"
					/>
					{error && (
						<span className="text-xs font-bold text-[crimson]">{error}</span>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="duration" className="text-[grey]">
						Duration (in secs)
					</label>
					<input
						id="duration"
						aria-label="Duration"
						onChange={(e) => handleDuration(e)}
						placeholder="e.g 10"
						value={duration}
						disabled={isLoading || isWaitForTransLoading}
						name="duration"
						className="p-2 text-black font-bold rounded-md"
					/>
				</div>

				<div className="flex flex-col">
					<label htmlFor="duration" className="mb-2 text-[grey]">
						Percentage
					</label>
					<input
						aria-label="Percentage"
						onChange={(e) => handleRateChange(e)}
						placeholder="e.g 35"
						value={rate}
						disabled={isLoading || isWaitForTransLoading}
						name="percentage"
						className="p-2 mb-2 text-black font-bold rounded-md"
					/>
				</div>
				<button
					className="rounded-md cursor-pointer bg-[#4040e0] active:scale-[1.01] px-2 py-3 font-medium text-lg disabled:active:scale-[unset] disabled:cursor-not-allowed disabled:bg-[#3f3c3c]"
					type="submit"
					disabled={
						isLoading || !rate || !duration || !amount || isWaitForTransLoading
					}
				>
					{isLoading || isWaitForTransLoading ? "Please wait..." : "Send"}
				</button>
			</form>
			<div className="pb-4 px-4">
				{isError && (
					<div>
						<div className=" text-center w-full">
							<span
								style={{ overflowWrap: "anywhere" }}
								className="text-xs w-full text-[crimson]"
							>
								{errorContractWrite?.message}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
export default LockToken;

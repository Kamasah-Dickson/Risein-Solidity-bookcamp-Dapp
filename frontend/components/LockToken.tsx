import { useDebounce } from "use-debounce";
import { useState, ChangeEvent, SetStateAction, Dispatch } from "react";
import { abi, contractAddress as contractAddresses } from "../constants/index";

import {
	usePrepareSendTransaction,
	useSendTransaction,
	useWaitForTransaction,
	useAccount,
	useNetwork,
} from "wagmi";
import { parseEther } from "ethers";
import { toast } from "react-toastify";

interface Itrans {
	goTonextStep: () => void;
	setDuration: Dispatch<SetStateAction<string>>;
	duration: string;
}

export function LockToken({ goTonextStep, duration, setDuration }: Itrans) {
	const { chain } = useNetwork();
	const lockTokenAddress =
		(chain?.id as number) in contractAddresses
			? contractAddresses[
					chain?.id as unknown as keyof typeof contractAddresses
			  ][0]
			: null;

	const { address } = useAccount();

	const [debouncedTo] = useDebounce(duration, 500);
	const [rate, setRate] = useState("");
	const [debouncedAmount] = useDebounce(rate, 500);
	const [error, setError] = useState("");

	const { config } = usePrepareSendTransaction({
		account: address,
		to: debouncedTo,
		value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
	});

	const { data, sendTransaction } = useSendTransaction(config);

	const { isLoading, isSuccess, isError } = useWaitForTransaction({
		hash: data?.hash,
	});

	if (isError) {
		toast.error(isError, {
			position: "top-center",
		});
	}

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

	return (
		<form
			className="bg-[#40404421] shadow-sm backdrop-blur-sm mt-7 md:mb-20 rounded-xl flex flex-col w-full gap-5 p-7 max-w-md mx-auto"
			onSubmit={(e) => {
				e.preventDefault();
				// sendTransaction?.();
			}}
		>
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
					name="percentage"
					className="p-2 mb-2 text-black font-bold rounded-md"
				/>
				{error && (
					<span className="text-xs font-bold text-[crimson]">{error}</span>
				)}
			</div>
			<button
				onClick={goTonextStep}
				className="rounded-md cursor-pointer bg-[#4040e0] active:scale-[1.01] px-2 py-3 font-medium text-lg disabled:active:scale-[unset] disabled:cursor-not-allowed disabled:bg-[#3f3c3c]"
				// type="submit"
				disabled={isLoading || !rate || !duration || Boolean(error)}
			>
				{isLoading ? "Sending..." : "Send"}
			</button>
			{isSuccess && (
				<div>
					Successfully deployed at
					<div>
						<a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
					</div>
				</div>
			)}
		</form>
	);
}
export default LockToken;

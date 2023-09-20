/* eslint-disable react-hooks/exhaustive-deps */
import { useDebounce } from "use-debounce";
import {
	useState,
	useEffect,
	ChangeEvent,
	SetStateAction,
	Dispatch,
	FormEvent,
} from "react";
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
import { parseGwei } from "viem";

interface Itrans {
	goTonextStep: () => void;
}

export function SendTransaction({ goTonextStep }: Itrans) {
	const { chain } = useNetwork();
	const [transError, setTransError] = useState("");

	const lockTokenAddress =
		(chain?.id as number) in contractAddresses
			? contractAddresses[
					chain?.id as unknown as keyof typeof contractAddresses
			  ][0]
			: null;

	const { address } = useAccount();
	const [to, setTo] = useState<string | `0x${string}` | undefined>(
		lockTokenAddress!
	);
	const [debouncedTo] = useDebounce(to, 0);
	const [amount, setAmount] = useState("");
	const [debouncedAmount] = useDebounce(amount, 0);
	const [error, setError] = useState("");

	const {
		config,
		error: preParedError,
		isError: isPreparedError,
		isLoading: isPreparedLoading,
		isSuccess: isPreparedSuccess,
	} = usePrepareSendTransaction({
		account: address,
		to: debouncedTo,
		value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
	});
	const { data, sendTransaction } = useSendTransaction(config);

	// const {
	// 	isLoading,
	// 	isSuccess,
	// 	isError,
	// 	error: transError,
	// } = useWaitForTransaction({
	// 	hash: data?.hash,
	// });

	useEffect(() => {
		if (isPreparedError) {
			setTransError(preParedError?.message!);
		}
	}, [isPreparedError, preParedError]);

	if (error) {
		toast.error(error, {
			position: "top-center",
		});
	}

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
		sendTransaction?.();
		// sendTransaction?.();
		// isSuccess && goTonextStep();
	};

	return (
		<div className="flex flex-col">
			<form
				className="bg-[#40404421] shadow-sm backdrop-blur-sm mt-7 md:mb-10 rounded-xl flex flex-col w-full gap-5  max-w-md mx-auto"
				onSubmit={(e) => handleSendTransaction(e)}
			>
				<div className="p-7">
					<div className="flex flex-col gap-2">
						<label htmlFor="address" className="text-[grey]">
							Your Address
						</label>
						<input
							id="address"
							aria-label="Recipient"
							onChange={(e) => setTo(e.target.value)}
							placeholder="0xA0Cf…251e"
							value={to}
							name="recipientAddress"
							className="p-2 text-black font-bold rounded-md"
						/>
					</div>
					<div className="flex mt-4 flex-col gap-2">
						<label htmlFor="bnb" className="text-[grey]">
							BNB
						</label>
						<input
							id="bnb"
							aria-label="Amount (ether)"
							onChange={(e) => handleSetAmount(e)}
							placeholder="0.05"
							value={amount}
							name="amountOfEthers"
							className="p-2 mb-2 text-black font-bold rounded-md"
						/>
						{error && (
							<span className="text-xs font-bold text-[crimson]">{error}</span>
						)}
					</div>

					<button
						// onClick={goTonextStep}
						className="w-full mx-auto mt-5  cursor-pointer bg-[#4040e0] active:scale-[1.01] px-2 py-3 font-medium text-lg disabled:active:scale-[unset] disabled:cursor-not-allowed disabled:bg-[#3f3c3c]"
						type="submit"
						disabled={
							isPreparedLoading ||
							!sendTransaction ||
							!to ||
							!amount ||
							Boolean(error)
						}
					>
						{isPreparedLoading ? "Sending..." : "Send"}
					</button>

					{isPreparedSuccess && (
						<div>
							Successfully sent {amount} ether to {to}
							<div>
								<a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
							</div>
						</div>
					)}
				</div>
			</form>
			<div className="pb-4 px-4">
				{transError && (
					<div>
						<div className=" text-center w-full">
							<span
								style={{ overflowWrap: "anywhere" }}
								className="text-xs w-full text-[crimson]"
							>
								{transError}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

import { useDebounce } from "use-debounce";
import {
	useState,
	useEffect,
	ChangeEvent,
	SetStateAction,
	Dispatch,
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

interface Itrans {
	goTonextStep: () => void;
	setTransError: Dispatch<SetStateAction<string | null>>;
}

export function SendTransaction({ goTonextStep, setTransError }: Itrans) {
	const { chain } = useNetwork();
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
	const [debouncedTo] = useDebounce(to, 500);
	const [amount, setAmount] = useState("");
	const [debouncedAmount] = useDebounce(amount, 500);
	const [error, setError] = useState("");

	const { config } = usePrepareSendTransaction({
		account: address,
		to: debouncedTo,
		value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
	});
	const { data, sendTransaction } = useSendTransaction(config);

	const {
		isLoading,
		isSuccess,
		isError,
		error: transError,
	} = useWaitForTransaction({
		hash: data?.hash,
	});

	useEffect(() => {
		if (isError) {
			setTransError(transError?.message!);
		}
	}, [isError, transError?.message, setTransError]);

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

	return (
		<form
			className="bg-[#40404421] shadow-sm backdrop-blur-sm mt-7 md:mb-20 rounded-xl flex flex-col w-full gap-5 p-7 max-w-md mx-auto"
			onSubmit={(e) => {
				e.preventDefault();
				sendTransaction?.();
				// isSuccess && goTonextStep();
			}}
		>
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
			<div className="flex flex-col gap-2">
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
				className="rounded-md cursor-pointer bg-[#4040e0] active:scale-[1.01] px-2 py-3 font-medium text-lg disabled:active:scale-[unset] disabled:cursor-not-allowed disabled:bg-[#3f3c3c]"
				type="submit"
				disabled={isLoading || !to || !amount || Boolean(error)}
			>
				{isLoading ? "Sending..." : "Send"}
			</button>

			{isSuccess && (
				<div>
					Successfully sent {amount} ether to {to}
					<div>
						<a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
					</div>
				</div>
			)}
		</form>
	);
}

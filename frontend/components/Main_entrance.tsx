import { ConnectButton } from "@rainbow-me/rainbowkit";
import LockToken from "../components/LockToken";
import { SendTransaction } from "./SendTransaction";
import { useState } from "react";
import { useAccount } from "wagmi";
import Withdraw from "./Withdraw";

interface Isteps {
	completed: boolean;
	step: number;
}
const Main_entrance = () => {
	const { address } = useAccount();
	const [transError, setTransError] = useState([{ message: "", id: "" }]);

	const [steps, setSteps] = useState<Isteps[]>([
		{ completed: false, step: 1 },
		{ completed: false, step: 2 },
		{ completed: false, step: 3 },
	]);
	const [duration, setDuration] = useState("");

	const [currentActiveStep, setCurrentActiveStep] = useState(1);
	const updateSteps = ({ step }: { completed: boolean; step: number }) => {
		const findStep = steps.find((targetStep) => targetStep.step === step);
		const findCompletedSteps = steps.filter((allSteps) => allSteps.completed);

		if (findStep?.step === 1) {
			setCurrentActiveStep(findStep.step);
		} else if (findStep?.step && findStep.completed) {
			setCurrentActiveStep(findStep.step);
		} else {
			setCurrentActiveStep(findCompletedSteps.length + 1);
		}
	};

	const goTonextStep = () => {
		// currentActiveStep
		// setSteps

		setSteps((prev) =>
			prev.map((prevSteps) => {
				const currentTargetStep = prev.find(
					(aStep) => aStep.step === currentActiveStep
				);
				if (currentTargetStep && currentTargetStep.step === prevSteps.step) {
					return { ...prevSteps, completed: true };
				} else {
					return prevSteps;
				}
			})
		);

		setCurrentActiveStep((prevCurrentSteps) => prevCurrentSteps + 1);
	};

	return !address ? (
		<div className="my-12">
			<ConnectButton />
		</div>
	) : (
		<>
			<div className="flex items-center gap-10 mt-5">
				{steps.map((currentStep) => {
					return (
						<div
							title={currentStep.completed ? "completed" : "uncompleted"}
							onClick={() => updateSteps(currentStep)}
							key={currentStep.step}
							className={` ${
								currentStep.step == currentActiveStep || currentStep.completed
									? `bg-[#4040e0] text-white ${
											currentStep.completed && "!cursor-pointer"
									  }`
									: "bg-[white] text-black"
							} shadow-lg rounded-md  grid place-content-center cursor-not-allowed  h-10 w-10 font-bold`}
						>
							{currentStep.step}
						</div>
					);
				})}
			</div>
			<p className="mt-7 max-w-xs text-center">
				{currentActiveStep === 1
					? "First you must make a deposit of at least 0.01BNB to be able to interact with the contract"
					: currentActiveStep === 2
					? "Good luck and be expecting some amazing profits!"
					: currentActiveStep === 3
					? "Congratulations✨ you are about to get some amazing rewards!🎉"
					: ""}
			</p>
			<div
				className={`flex mt-5 flex-col md:flex-row items-start md:gap-20 w-full max-w-3xl mx-auto`}
			>
				{currentActiveStep == 1 ? (
					<SendTransaction goTonextStep={goTonextStep} />
				) : currentActiveStep == 2 ? (
					<LockToken
						goTonextStep={goTonextStep}
						duration={duration}
						setDuration={setDuration}
					/>
				) : currentActiveStep == 3 ? (
					<Withdraw duration={duration} />
				) : null}

				{(!currentActiveStep as unknown as number) === 3 ? (
					<></>
				) : (
					<div className="mt-7  mb-7 md:mb-0">
						{currentActiveStep === 1 ? (
							<>
								<div className="bg-[#40404421]  p-5 rounded-md">
									<h2 className="mb-3">Step1</h2>
									<span className="text-xs">
										A deposit of at least 0.01BNB to prevent fraudulent acts and
										mentain integrity to the smartcontract.
									</span>
								</div>
							</>
						) : currentActiveStep === 2 ? (
							<div>
								<h2 className="mb-3">Step2</h2>
								<span className="text-xs">
									Specify a duration and a percentage value whih would be used
									to calculate your profits
								</span>
							</div>
						) : (
							<></>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Main_entrance;

import { Dispatch, SetStateAction } from "react";

export interface Isteps {
	completed: boolean;
	step: number;
}

export interface Iwithdraw {
	duration: string;
	enableWithdraw: boolean;
	setSteps: Dispatch<SetStateAction<Isteps[]>>;
	setCurrentActiveStep: Dispatch<SetStateAction<number>>;
}

export interface Itrans {
	goTonextStep: () => void;
	setDuration: Dispatch<SetStateAction<string>>;
	setEnableWithdraw: Dispatch<SetStateAction<boolean>>;
	duration: string;
}

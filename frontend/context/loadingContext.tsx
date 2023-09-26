import { Dispatch, SetStateAction, createContext, useState } from "react";

interface ILoad {
	enableWithdraw: boolean;
	setEnableWithdraw: Dispatch<SetStateAction<boolean>>;
}

export const LoadingContext = createContext<ILoad>({
	enableWithdraw: false,
	setEnableWithdraw: () => {},
});

export const LoadingStateContext = ({
	children,
}: {
	children: JSX.Element;
}) => {
	const [enableWithdraw, setEnableWithdraw] = useState<boolean>(true);

	return (
		<LoadingContext.Provider value={{ enableWithdraw, setEnableWithdraw }}>
			{children}
		</LoadingContext.Provider>
	);
};

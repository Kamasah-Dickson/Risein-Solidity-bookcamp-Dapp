import handImage from "../public/images/hand.svg";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
	return (
		<header className="fixed top-0 mt-7 left-0 w-full  block z-20 ">
			<div className="bg-[rgba(255,255,255,0.1)] px-7 backdrop-blur-[3px] saturate-50 flex items-center justify-between py-4 rounded-full my-max">
				<Link href="/" className="w-fit h-fit">
					<Image width={25} height={25} src={handImage} alt="" />
				</Link>

				<ConnectButton />
			</div>
		</header>
	);
};

export default Header;

import { iconData } from "@/styles/data";
import Image from "next/image";
import React from "react";

const Blockchain_icons = () => {
	return (
		<div className="flex my-before select-none items-center gap-5 max-w-xl justify-center flex-wrap">
			{iconData.map((icons) => {
				return (
					<div
						className="bg-[rgba(255,255,255,0.1)] shadow-lg cursor-pointer hover:bg-[#ffffff1f] backdrop-blur h-24 w-24 flex justify-center rounded-3xl"
						key={icons.id}
					>
						<Image src={icons.image} width={40} height={40} alt="" />
					</div>
				);
			})}
		</div>
	);
};

export default Blockchain_icons;

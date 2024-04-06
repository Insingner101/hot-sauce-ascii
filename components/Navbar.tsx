import { useGlobalContext } from "@/context/GlobalContext";
import Image from "next/image";
import { LuMenu } from "react-icons/lu";

export default function Navbar() {
  const { sidebar, setSidebar } = useGlobalContext();

  return (
    <div className="w-full sm:h-20 bg-white flex items-center py-1 px-2 sm:px-4 justify-between shadow_black border-b-1 border-[#e5e7eb]">
      <div className="flex items-center gap-2">
        <div className="relative w-[4rem] h-[4rem]">
          <Image
            src="/assets/images/bits_logo.png"
            alt="Bits Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <span className="text-black font-bold text-sm sm:text-base md:text-xl leading-6 max-w-[20rem]">
          Department of Computer Science & Information Systems
        </span>
      </div>
      <LuMenu
        onClick={() => {
          setSidebar(!sidebar);
        }}
        className="min-w-8 h-8 sm:w-10 sm:h-10 text-black shadow_black rounded cursor-pointer"
      />
    </div>
  );
}

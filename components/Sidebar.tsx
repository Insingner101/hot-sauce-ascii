import { useGlobalContext } from "@/context/GlobalContext";
import { signOut, useSession } from "next-auth/react";
import ToggleTheme from "./ToggleTheme";

export default function Sidebar() {
  const { data: session, status } = useSession();
  const { sidebar } = useGlobalContext();
  return (
    <div
      className={`transition-all top-0 z-20 ${
        sidebar ? "left-0 absolute md:relative" : "-left-[14rem] absolute"
      } h-full w-[14rem] shadow_black border-r-1 border-[#e5e7eb]`}
    >
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-[16rem] py-2 shadow-black bg-black dark:bg-[#FAFAFA] text-[#FAFAFA] dark:text-black rounded cursor-pointer transition-all hover:bg-[#27272A] dark:hover:bg-[#e0e0e0]"
      >
        Sign out
      </button>
      <ToggleTheme />
    </div>
  );
}

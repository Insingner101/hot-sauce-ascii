import { useGlobalContext } from "@/context/GlobalContext";
import { signOut } from "next-auth/react";
import ToggleTheme from "./ToggleTheme";
import Loader from "./Loader";
import Image from "next/image";
import { PiSignOutBold } from "react-icons/pi";

export default function Sidebar() {
  const { sidebar, loading, user } = useGlobalContext();
  return (
    <div
      className={`transition-all top-0 z-20 ${
        sidebar ? "left-0 absolute md:relative" : "-left-[16rem] absolute"
      } h-full w-[16rem] px-4 shadow_black border-r-1 border-[#e5e7eb]`}
    >
      <div className="w-full flex items-center px-2 py-1.5 mt-4 text-sm font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-base font-medium leading-none text-black">
            {user?.name}
            <span className="shadow_black text-xs ml-2 border border-light rounded-sm text-light px-0.5">
              {/* @ts-ignore */}
              {user?.role && user.role.toUpperCase()}
            </span>
          </p>
          <p className="text-sm leading-none text-muted-foreground text-light">
            {user?.email}
          </p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center justify-between min-w-[14rem] mt-4 px-4 py-2 gap-3 font-semibold shadow_black_lg border-1 dark:border-0 border-[#e5e7eb] bg-white hover:bg-[#eaeaea] text-black rounded-md cursor-pointer transition-all"
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            Sign-out
            <PiSignOutBold />
          </>
        )}
      </button>
      {/* <ToggleTheme /> */}
    </div>
  );
}

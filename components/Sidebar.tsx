import { useGlobalContext } from "@/context/GlobalContext";
import { signOut, useSession } from "next-auth/react";
import ToggleTheme from "./ToggleTheme";
import Loader from "./Loader";
import Image from "next/image";

export default function Sidebar() {
  const { data: session, status } = useSession();
  const { sidebar, loading } = useGlobalContext();
  return (
    <div
      className={`transition-all top-0 z-20 ${
        sidebar ? "left-0 absolute md:relative" : "-left-[16rem] absolute"
      } h-full w-[16rem] px-4 shadow_black border-r-1 border-[#e5e7eb]`}
    >
      <div className="w-full flex items-center px-2 py-1.5 mt-4 text-sm font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-base font-medium leading-none text-black">
            {session?.user?.name}
          </p>
          <p className="text-sm leading-none text-muted-foreground text-light">
            {session?.user?.email}
          </p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center min-w-[14rem] mt-4 px-4 py-2 gap-3 font-semibold shadow_black_lg border-1 dark:border-0 border-[#e5e7eb] bg-white hover:bg-[#eaeaea] text-black rounded-md cursor-pointer transition-all"
      >
        {loading ? <Loader /> : <>Sign-out</>}
      </button>
      {/* <ToggleTheme /> */}
    </div>
  );
}

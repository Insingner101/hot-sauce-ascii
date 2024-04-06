import { useGlobalContext } from "@/context/GlobalContext";
import { signOut, useSession } from "next-auth/react";
import ToggleTheme from "./ToggleTheme";
import Loader from "./Loader";

export default function Sidebar() {
  const { data: session, status } = useSession();
  const { sidebar, loading } = useGlobalContext();
  return (
    <div
      className={`transition-all top-0 z-20 ${
        sidebar ? "left-0 absolute md:relative" : "-left-[14rem] absolute"
      } h-full w-[14rem] shadow_black border-r-1 border-[#e5e7eb]`}
    >
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center min-w-[14rem] mt-4 px-4 py-2 gap-3 font-semibold shadow_black_lg border-1 dark:border-0 border-[#e5e7eb] bg-white hover:bg-[#eaeaea] text-black rounded-full cursor-pointer transition-all"
      >
        {loading ? <Loader /> : <>Sign-out</>}
      </button>
      <ToggleTheme />
    </div>
  );
}

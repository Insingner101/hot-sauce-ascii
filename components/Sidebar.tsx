import { useGlobalContext } from "@/context/GlobalContext";
import { signOut } from "next-auth/react";
import ToggleTheme from "./ToggleTheme";
import Loader from "./Loader";
import Image from "next/image";
import { PiSignOutBold } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";

interface SidebarOption {
  name: string;
  icon: any;
  url: string;
}

export default function Sidebar() {
  const { sidebar, loading, user } = useGlobalContext();
  const [options, setOptions] = useState<SidebarOption[]>([]);
  const router = useRouter();

  const adminPages = useMemo(
    () => [
      { name: "Students", icon: FaUser, url: "/admin" },
      { name: "Users", icon: FaUser, url: "/users" },
    ],
    []
  );
  
  const hodPages = useMemo(
    () => [
      { name: "FDCM", icon: FaUser, url: "/hod" },
      { name: "Faculty", icon: FaUser, url: "/add-user" },
      { name: "Courses", icon: FaUser, url: "/users" },
    ],
    []
  );
  
  const facultyPages = useMemo(() => [{ name: "FDCM", icon: FaUser, url: "/faculty" }], []);
  
  const studentPages = useMemo(() => [{ name: "FDCM", icon: FaUser, url: "/student" }], []);

  useEffect(() => {
    if (user.email) {
      switch (user.role) {
        case "admin":
          setOptions(adminPages);
          break;
        case "hod":
          setOptions(hodPages);
          break;
        case "faculty":
          setOptions(facultyPages);
          break;
        case "student":
          setOptions(studentPages);
          break;
        default:
          setOptions([]);
      }
    }
  }, [user, adminPages, facultyPages, hodPages, studentPages]);

  return (
    <div
      className={`transition-all top-0 z-20 ${
        sidebar ? "left-0 absolute md:relative" : "-left-[16rem] absolute"
      } h-full w-[16rem] px-4 shadow_black border-r-1 border-[#e5e7eb] bg-white z-20`}
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

      {/* options  */}
      {options.map((Option) => (
        <div
          key={Option.url} // Add a unique key prop
          onClick={() => {
            router.push(Option.url);
          }}
          className="flex items-center justify-start min-w-[14rem] mt-4 px-4 py-2 gap-3 font-semibold border-b hover:shadow dark:border-0 border-[#e5e7eb] bg-white text-black rounded-md cursor-pointer transition-all"
        >
          <Option.icon className="text-light w-5 h-5" />
          {Option.name}
        </div>
      ))}

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center justify-between min-w-[14rem] mt-4 px-4 py-2 gap-3 font-semibold border hover:shadow dark:border-0 border-[#e5e7eb] bg-white text-black rounded-md cursor-pointer transition-all"
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

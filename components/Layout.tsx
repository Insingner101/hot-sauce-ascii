import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession();

  return (
    <div className="w-full h-full flex flex-col flex-1">
      {status === "authenticated" && <Navbar />}
      <div className="relative w-full flex flex-1">
        {status === "authenticated" && <Sidebar />}
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}

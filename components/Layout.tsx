import { signOut, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import { User, useGlobalContext } from "@/context/GlobalContext";
import toast, { useToaster } from "react-hot-toast";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { loading, setLoading, user, setUser } = useGlobalContext();

  useEffect(() => {
    console.log(status, session);
    if (router.pathname.includes("applyFDCM") || router.pathname === "/")
      return;

    if (!user.email) {
      if (status === "loading") setLoading(true);
      if (status === "unauthenticated") {
        setLoading(false);
        if (router.pathname !== "/") {
          toast.error("Authentication failed. Please try again later.");
          router.push("/");
        }
        setUser({} as User);
      }
      if (status === "authenticated" && session.user) {
        setLoading(false);
        setUser({
          name: session.user.name!,
          email: session.user.email!,
          image: session.user.image!,
          //@ts-ignore
          role: session.user.role!,
        });
      }
    }
  }, [session, status, router, setLoading, setUser, user.email]);

  return (
    <div className="w-full h-full flex flex-col flex-1">
      {/* @ts-ignore */}
      {router.pathname !== "/" && <Navbar />}
      <div className="relative w-full flex flex-1">
        {/* @ts-ignore */}
        {user?.email &&
          user?.role !== "default" &&
          !router.pathname.includes("applyFDCM") && <Sidebar />}
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}

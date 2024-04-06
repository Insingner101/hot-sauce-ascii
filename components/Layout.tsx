import { signOut, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context/GlobalContext";
import toast, { useToaster } from "react-hot-toast";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { loading, setLoading } = useGlobalContext();

  useEffect(() => {
    console.log(status, session);
    if(status === "loading") setLoading(true)
    if(status === "unauthenticated") {
      setLoading(false)
      toast.error("Authentication failed. Please try again later.")
      router.push("/");
    }
    if (status === "authenticated" && session.user) {
      setLoading(false)
      //@ts-ignore
      switch (session.user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "hod":
          router.push("/hod");
          break;
        case "faculty":
          router.push("/faculty");
          break;
        case "student":
          router.push("/student");
          break;
        default:
          router.push("/");
          toast.error("User not found.")
          signOut({ callbackUrl: "/" })
      }
    }
  }, [session, status]);

  return (
    <div className="w-full h-full flex flex-col flex-1">
      {/* @ts-ignore */}
      {status === "authenticated" && session?.user?.role !== "default" && (
        <Navbar />
      )}
      <div className="relative w-full flex flex-1">
        {/* @ts-ignore */}
        {status === "authenticated" && session?.user?.role !== "default" && (
          <Sidebar />
        )}
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import ToggleTheme from "@/components/ToggleTheme";
import DTButton from "@/components/DTButton";
import { signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { loading, setLoading, user, setUser } = useGlobalContext();

  useEffect(() => {
    if (user.email) {
      switch (user.role) {
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
          toast.error("User not found.");
          signOut({ callbackUrl: "/" });
      }
    }
  }, [user]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Head>
        <title>FDCM Portal - Login</title>
      </Head>
      <Image
        src="/assets/images/bits_logo.png"
        alt="Bits Logo"
        width={223}
        height={223}
      />
      <Image
        src="/assets/images/bits_name.png"
        alt="Bits Logo"
        width={223}
        height={250}
      />
      <span className="text-lg text-light font-medium">
        Department of Computer Science & Information Systems
      </span>
      <button
        onClick={() => signIn("google")}
        className="flex items-center justify-center min-w-[14rem] mt-4 px-4 py-2 gap-3 font-semibold shadow_black_lg border-1 dark:border-0 border-[#e5e7eb] bg-white hover:bg-[#eaeaea] text-black rounded-full cursor-pointer transition-all"
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <Image
              src="/assets/images/google_logo.png"
              alt="Bits Logo"
              width={25}
              height={25}
            />
            Sign-in with Google
          </>
        )}
      </button>
      <DTButton
        onClick={() => {
          router.push("/ApplyFDCM");
        }}
        className="mt-4"
      >
        Apply for FDCM
      </DTButton>
    </div>
  );
}

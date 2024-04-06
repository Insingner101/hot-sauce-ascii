import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import ToggleTheme from "@/components/ToggleTheme";
import DTButton from "@/components/DTButton";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import Loader from "@/components/Loader";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { loading } = useGlobalContext();

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
        className="flex items-center min-w-[14rem] mt-4 px-4 py-2 gap-3 font-semibold shadow_black_lg border-1 dark:border-0 border-[#e5e7eb] bg-white hover:bg-[#eaeaea] text-black rounded-full cursor-pointer transition-all"
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
    </div>
  );
}

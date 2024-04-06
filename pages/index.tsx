import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import ToggleTheme from "@/components/ToggleTheme";
import DTButton from "@/components/DTButton";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data, status } = useSession();

  useEffect(() => {
    console.log(data, status);
  }, [data, status]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Head>
        <title>Login</title>
      </Head>
      <Image
        src="/assets/images/bits_logo.png"
        alt="Bits Logo"
        width={250}
        height={250}
      />
      <Image
        src="/assets/images/bits_name.png"
        alt="Bits Logo"
        width={250}
        height={250}
      />
      <button
        onClick={() => signIn("google")}
        className="flex items-center mt-4 px-4 py-2 gap-3 font-bold border-2 dark:border-0 bg-white border-[#090908] text-[#090908] rounded-full cursor-pointer transition-all hover:bg-[#eaeaea]"
      >
        <Image
          src="/assets/images/google_logo.png"
          alt="Bits Logo"
          width={25}
          height={25}
        />
        Sign-in with Google
      </button>
      {/* <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-[16rem] py-2 bg-[#090908] dark:bg-[#FAFAFA] text-[#FAFAFA] dark:text-[#090908] rounded cursor-pointer transition-all hover:bg-[#27272A] dark:hover:bg-[#e0e0e0]"
      >
        Sign out
      </button> */}
      <ToggleTheme />
    </div>
  );
}

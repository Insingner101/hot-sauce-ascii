import React, { ReactNode, ButtonHTMLAttributes } from "react";

interface DTButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const DTButton: React.FC<DTButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`flex items-center justify-center min-w-[14rem] px-4 py-2 font-semibold shadow_black_lg border-1 dark:border-0 border-[#e5e7eb] bg-white hover:bg-[#eaeaea] text-black rounded-full cursor-pointer transition-all ${
        className ? className : ""
      }`}
    >
      {children}
    </button>
  );
};

export default DTButton;

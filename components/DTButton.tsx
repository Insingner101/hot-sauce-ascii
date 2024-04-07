import React, { ReactNode, ButtonHTMLAttributes } from "react";

interface DTButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const DTButton: React.FC<DTButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`flex items-center justify-between px-4 py-2 gap-3 font-semibold border hover:shadow dark:border-0 border-[#e5e7eb] bg-white text-black rounded-md cursor-pointer transition-all ${
        className ? className : "w-8 h-8"
      }`}
    >
      {children}
    </button>
  );
};

export default DTButton;

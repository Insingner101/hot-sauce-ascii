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
      className={`bg-[#090908] dark:bg-[#FAFAFA] text-[#FAFAFA] dark:text-[#090908] rounded cursor-pointer transition-all hover:bg-[#27272A] dark:hover:bg-[#e0e0e0] ${
        className ? className : "w-8 h-8"
      }`}
    >
      {children}
    </button>
  );
};

export default DTButton;

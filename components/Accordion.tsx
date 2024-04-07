import { ReactNode, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface AccordionProps {
  Header: ReactNode;
  Content: ReactNode;
  height?: string;
}
export default function Accordion({ Header, Content, height }: AccordionProps) {
  const [toggle, setToggle] = useState(false);
  return (
    <div
      className={`flex flex-col w-full ${
        toggle ? "shadow_black" : ""
      } border-b mt-4 border-lightgray`}
    >
      <div className="w-full flex items-center cursor-pointer text-black p-2">
        {Header}
        <div
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          {toggle ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      <div
        className={`w-full overflow-hidden pt-3 transition-height duration-500 ${
          toggle ? height ?? "h-[7rem]" : "h-0"
        }`}
      >
        {Content}
      </div>
    </div>
  );
}

import clsx from "clsx";
import { ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  type?: "bigTitleBlack" | "titleBlack" | "subTitleBlack" | "normalBlack";
  className?: string;
}

const Text = ({ children, type, className }: TextProps) => {
  const getClassName = () => {
    switch (type) {
      case "bigTitleBlack":
        return "text-black text-[24px] leading-[36px] font-pretendard-bold";
      case "titleBlack":
        return "text-black text-[18px] leading-[28px] font-pretendard-bold";
      case "subTitleBlack":
        return "text-black text-[16px] leading-[22px] font-pretendard-medium";
      case "normalBlack":
      default:
        return "text-black text-[14px] leading-5";
    }
  };

  return <p className={clsx(getClassName(), className)}>{children}</p>;
};

export default Text;

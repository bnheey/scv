import clsx from "clsx";
import type { ReactNode } from "react";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  type?:
    | "bigTitleBlack"
    | "titleBlack"
    | "subTitleBlack"
    | "subTitleWhite"
    | "smallMediumWhite"
    | "smallBlack"
    | "normalMediumWhite"
    | "normalMediumBlack"
    | "normalGray"
    | "normalBlack";
  className?: string;
}

const Text = ({ children, type, className, ...props }: TextProps) => {
  const getClassName = () => {
    switch (type) {
      case "bigTitleBlack":
        return "text-black text-[26px] leading-[36px] font-gaegu";
      case "titleBlack":
        return "text-black text-[24px] leading-[28px] font-gaegu";
      case "subTitleBlack":
        return "text-black text-[22px] leading-[22px] font-gaegu";
      case "subTitleWhite":
        return "text-white text-[22px] leading-[22px] font-gaegu";
      case "smallMediumWhite":
        return "text-white text-[18px] leading-4 font-gaegu";
      case "smallBlack":
        return "text-black text-[18px] leading-5";
      case "normalMediumWhite":
        return "text-white text-[16px] leading-5 font-gaegu";
      case "normalMediumBlack":
        return "text-black text-[16px] leading-5 font-gaegu";
      case "normalGray":
        return "text-gray-400 text-[16px] leading-5 font-gaegu";
      case "normalBlack":
      default:
        return "text-black text-[16px] leading-5 font-gaegu";
    }
  };

  return (
    <p className={clsx(getClassName(), className)} {...props}>
      {children}
    </p>
  );
};

export default Text;

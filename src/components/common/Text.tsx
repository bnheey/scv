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
        return "text-black text-[24px] leading-[36px] font-pretendard-bold";
      case "titleBlack":
        return "text-black text-[18px] leading-[28px] font-pretendard-bold";
      case "subTitleBlack":
        return "text-black text-[16px] leading-[22px] font-pretendard-medium";
      case "subTitleWhite":
        return "text-white text-[16px] leading-[22px] font-pretendard-medium";
      case "smallMediumWhite":
        return "text-white text-[11px] leading-4 font-pretendard-medium";
      case "smallBlack":
        return "text-black text-[11px] leading-5";
      case "normalMediumWhite":
        return "text-white text-[14px] leading-5 font-pretendard-medium";
      case "normalMediumBlack":
        return "text-black text-[14px] leading-5 font-pretendard-medium";
      case "normalGray":
        return "text-gray-400 text-[14px] leading-5";
      case "normalBlack":
      default:
        return "text-black text-[14px] leading-5";
    }
  };

  return (
    <p className={clsx(getClassName(), className)} {...props}>
      {children}
    </p>
  );
};

export default Text;

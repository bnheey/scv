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
        return "text-black text-[24px] leading-[36px]";
      case "titleBlack":
        return "text-black text-[18px] leading-[28px]";
      case "subTitleBlack":
        return "text-black text-[16px] leading-[22px]";
      case "subTitleWhite":
        return "text-white text-[16px] leading-[22px]";
      case "smallMediumWhite":
        return "text-white text-[11px] leading-4";
      case "smallBlack":
        return "text-black text-[11px] leading-5";
      case "normalMediumWhite":
        return "text-white text-[14px] leading-5";
      case "normalMediumBlack":
        return "text-black text-[14px] leading-5";
      case "normalGray":
        return "text-gray-400 text-[14px] leading-5";
      case "normalBlack":
      default:
        return "text-black text-[14px] leading-5";
    }
  };

  return (
    <p
      className={clsx(getClassName(), className)}
      style={{
        color: `hsl(${Math.random() * 360}, 75%, 50%)`,
      }}
      {...props}
    >
      {children}
    </p>
  );
};

export default Text;

import clsx from "clsx";
import type { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: "text" | "pink" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Button = ({
  children,
  color = "pink",
  size = "md",
  className,
  ...props
}: ButtonProps) => {
  const getClassName = () => {
    switch (color) {
      case "text":
        return "bg-transparent text-scv-pink border border-scv-pink";
      case "pink":
      case "default":
        return "bg-scv-pink text-white";
    }
  };

  const getSize = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1";
      case "md":
        return "px-4 py-2";
      case "lg":
        return "px-6 py-[10px]";
    }
  };

  return (
    <button
      className={clsx(
        `bg-scv-pink rounded-lg select-none`,
        getClassName(),
        getSize(),
        className
      )}
      {...props}
    >
      <p
        className="!font-gaegu text-[14px]"
        style={{
          color: `hsl(${Math.random() * 360}, 75%, 90%)`,
        }}
      >
        {children}
      </p>
    </button>
  );
};

export default Button;

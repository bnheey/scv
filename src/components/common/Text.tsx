import { ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  type?: "normalBlack";
}

const Text = ({ children, type }: TextProps) => {
  switch (type) {
    // return <p className="text-black">{children}</p>;
    case "normalBlack":
    default:
      return <p className="text-black text-sm">{children}</p>;
  }
};
export default Text;

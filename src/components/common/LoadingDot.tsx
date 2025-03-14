import clsx from "clsx";
import loadingDot from "@/assets/lottie/loading_dot.json";
import Lottie from "lottie-react";

interface LoadingDotProps {
  containerClassName?: string;
  className?: string;
}

const LoadingDot = ({ containerClassName, className }: LoadingDotProps) => (
  <div
    className={clsx(
      "w-full h-full flex items-center justify-center",
      containerClassName
    )}
  >
    <div className={clsx("max-w-[20%] max-h-[50%]", className)}>
      <Lottie animationData={loadingDot} />
    </div>
  </div>
);

export default LoadingDot;

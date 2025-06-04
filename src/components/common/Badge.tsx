import Text from "@/components/common/Text";
import clsx from "clsx";

const Badge = ({
  children,
  color,
  className,
  textClassName,
}: {
  children?: React.ReactNode | string;
  color?: string;
  className?: string;
  textClassName?: string;
}) => {
  return (
    <div
      className={clsx("w-fit rounded px-1 py-0.5", className)}
      style={{ backgroundColor: color || "#60a5fa" }}
    >
      {typeof children === "string" ? (
        <Text
          type="smallMediumWhite"
          className={clsx("!leading-3", textClassName)}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </div>
  );
};

export default Badge;

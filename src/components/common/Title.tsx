import Text from "./Text";

import { ReactNode } from "react";

const Title = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Text type="titleBlack" className={className}>
      {children}
    </Text>
  );
};

export default Title;

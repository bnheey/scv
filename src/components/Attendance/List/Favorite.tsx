import { Star as StarIcon } from "@phosphor-icons/react";
interface PinProps {
  isFixed: boolean;
  onClick: () => void;
}
const Favorite = ({ isFixed, onClick }: PinProps) => (
  <StarIcon
    size={16}
    weight={isFixed ? "fill" : "light"}
    color={isFixed ? "#FFD562" : "#C7C7C7"}
    className="cursor-pointer"
    onClick={onClick}
    mirrored
  />
);

export default Favorite;
